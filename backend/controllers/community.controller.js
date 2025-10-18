import QUESTION from "../models/questions.model.js";
import ANSWER from "../models/answers.model.js";
import VOTE from "../models/votes.model.js";
import mongoose from "mongoose";
import createError from "../utils/createError.js";

export const addQuestion = async (req,res,next) => {
    try {
        const userId = req.userId;
        const { isAnonymous, title, description, category } = req.body;

        await QUESTION.create({ userId, isAnonymous, title, description, category });

        res.status(201).json({ success: true, message: "Your question has been successfully submitted" });
    } catch (error) {
        next(error);
    }
}

export const getQuestionsList = async (req,res,next) => {
    try {
        const { page = 1, limit = 8, category  = "", search = "", isPersonal = false } = req.query;
        const userId = req.userId;

        const query = {};

        if (category){
            query.category = category;
        }

        if (search){
            query.$text = { $search: search };
        }

        if (isPersonal){
            query.userId = new mongoose.Types.ObjectId(userId);
        }

        const pipeline = new mongoose.Aggregate([
            { $match: query },
            { $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            } },
            { $unwind: "$user" },
            { $lookup: {
                from: "answers",
                let: { question_id: "$_id", best_answer_id: "$bestAnswerId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$questionId", "$$question_id"] } } },
                    { $addFields: { isBest: { $eq: ["$_id", "$$best_answer_id"] } } },
                    { $lookup: { 
                        from: "votes",
                        let: { answer_id: "$_id" },
                        pipeline: [ { $match: { $expr: { $and: [ { $eq: ['$answerId', '$$answer_id'] }, { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] } ] } } } ],
                        as: 'userVote'
                    } },
                    { $sort: { isBest: -1, upvotes: -1, createdAt: -1 } },
                    { $lookup: { from: "lawyers", localField: "lawyerId", foreignField: "_id", as: "lawyer" } },
                    { $unwind: "$lawyer" },
                    { $lookup: { from: "users", localField: "lawyer.userId", foreignField: "_id", as: "lawyer.user" } },
                    { $unwind: "$lawyer.user" },
                    { $project: {
                        content: 1,
                        upvotes: 1,
                        createdAt: 1,
                        lawyerId: "$lawyer.user._id",
                        lawyername: "$lawyer.user.name",
                        lawyerProfile: "$lawyer.user.profileImage",
                        isBestAnswer: "$isBest",
                        isVoted: { $gt: [{ $size: '$userVote' }, 0] } 
                    } }
                ],
                as: "answers"
            } },
            { $project: {
                title: 1,
                category: 1,
                description: 1,
                isAnonymous: 1,
                createdAt: 1,
                username: {
                    $cond: {
                        if: { $eq: ["$isAnonymous", true] },
                        then: "Anonymous",
                        else: "$user.name"
                    }
                },
                userProfile: {
                    $cond: {
                        if: { $eq: ["$isAnonymous", false] },
                        then: "$user.profileImage",
                        else: null
                    }
                },
                answers: "$answers"
            } }
        ]);


        const result = await QUESTION.aggregatePaginate(pipeline, { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 } });

        res.status(200).json({ success: true, data: result.docs, pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage }
        });
    } catch (error) {
        next(error);
    }
}

export const toggleVote = async (req,res,next) => {
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
        const { answerId } = req.body;
        const userId = req.userId;

        const existingVote = await VOTE.findOne({ answerId, userId }).session(dbSession);

        if (existingVote){
            await VOTE.findOneAndDelete({ answerId }, { session: dbSession });
            await ANSWER.findByIdAndUpdate(answerId, { $inc: { upvotes: -1 } }, { session: dbSession });
            await dbSession.commitTransaction();
            res.status(200).json({ success: true, message: "Vote removed.", liked: false });
        }
        else{
            await VOTE.create([{ answerId, userId }], { session: dbSession });
            await ANSWER.findByIdAndUpdate(answerId, { $inc: { upvotes: 1 } }, { session: dbSession });
            await dbSession.commitTransaction();
            res.status(200).json({ success: true, message: "Answer upvoted.", liked: true });
        }

    } catch (error) {
        await dbSession.abortTransaction();
        if (error.code === 11000) {
            return next(createError("Vote operation conflict. Please try again.", 409));
        }
        next(error);
    } finally{
        dbSession.endSession();
    }
}

export const markAsBestAnswer = async (req,res,next) => {
    try {
        const { questionId, answerId } = req.body;
        const userId = req.userId;

        const [question, answer] = await Promise.all([
            QUESTION.findById(questionId),
            ANSWER.findById(answerId)
        ]);

        if (!question) {
            throw createError("Question not found.", 404);
        }
        if (!answer) {
            throw createError("Answer not found.", 404);
        }

        if (question.userId.toString() !== userId.toString()) {
            throw createError("You are not authorized to mark the best answer for this question.", 403);
        }

        if (answer.questionId.toString() !== question._id.toString()) {
            throw createError("This answer does not belong to the specified question.", 400);
        }
        
        question.bestAnswerId = answerId;
        await question.save();
        res.status(200).json({ success: true, message: "Best answer marked successfully." });
    } catch (error) {
        next(error);
    }
}