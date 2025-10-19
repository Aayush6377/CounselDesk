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
        const { page = 1, limit = 8, category  = "", search = "", isPersonal = "false" } = req.query;
        const userId = req.userId;

        const query = {};

        if (category){
            query.category = category;
        }

        if (search){
            query.$text = { $search: search };
        }

        const personal = isPersonal === "true";

        if (personal){
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

export const updateQuestion  = async (req,res,next) => {
    try {
        const { isAnonymous, title, description, category } = req.body;
        const { questionId } = req.params;
        const userId = req.userId;

        if (!mongoose.isValidObjectId(questionId)){
            throw createError("Invalid Question ID", 400);
        }

        const questionToUpdate = await QUESTION.findById(questionId);

        if (!questionToUpdate) {
            throw createError("Question not found.", 404);
        }

        if (questionToUpdate.userId.toString() !== userId.toString()) {
            throw createError("You are not authorized to update this question.", 403);
        }

        await QUESTION.findByIdAndUpdate(questionId, { isAnonymous, title, description, category });

        res.status(200).json({ success: true, message: "Your question has been successfully updated" });
    } catch (error) {
        next(error);
    }
}

export const deleteQuestion = async (req,res,next) => {
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
        const { questionId } = req.params;
        const userId = req.userId;

        if (!mongoose.isValidObjectId(questionId)){
            throw createError("Invalid Question ID", 400);
        }

        const questionToDelete = await QUESTION.findById(questionId).session(dbSession);

        if (!questionToDelete) {
            throw createError("Question not found.", 404);
        }

        if (questionToDelete.userId.toString() !== userId.toString()) {
            throw createError("You are not authorized to delete this question.", 403);
        }

        const answersToDelete = await ANSWER.find({ questionId: questionId }).select('_id').session(dbSession);
        const answerIdsToDelete = answersToDelete.map(answer => answer._id);

        if (answerIdsToDelete.length > 0) {
            await VOTE.deleteMany({ answerId: { $in: answerIdsToDelete } }, { session: dbSession });
            await ANSWER.deleteMany({ questionId: questionId }, { session: dbSession });
        }

        await QUESTION.findByIdAndDelete(questionId, { session: dbSession });

        await dbSession.commitTransaction();
        
        res.status(200).json({ success: true, message: "Your question has been successfully deleted" });
    } catch (error) {
        await dbSession.abortTransaction();
        next(error);
    } finally{
        dbSession.endSession();
    }
}

export const getLawyerQuestionsList = async (req,res,next) => {
    try {
        const { page = 1, limit = 9, category = '', search = '', sortBy = "newest", isPersonal = false } = req.query;
        const lawyerId = req.lawyerId;

        const query = {};
        if (category){
            query.category = category;
        }
        if (search){
            query.$text = { $search: search };
        }

        let sortOption = { createdAt: -1 };
        if (sortBy === "oldest"){
            sortOption = { createdAt: 1 };
        }

        const pipeline = [
            { $match: query },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $lookup: {
                from: "answers",
                let: { question_id: "$_id" },
                pipeline: [
                    { $match: { $expr: { $and: [
                        { $eq: ["$questionId", "$$question_id"] },
                        { $eq: ["$lawyerId", new mongoose.Types.ObjectId(lawyerId)] }
                    ] } } },
                    { $project: { content: 1, upvotes: 1 } }
                ],
                as: "answers"
            } },
            { $addFields: { myAnswer: { $arrayElemAt: ["$answers", 0] } } }
        ];

        if (isPersonal === 'true') {
            pipeline.push({ $match: { myAnswer: { $ne: null } } });
        }

        pipeline.push({
            $project: {
                title: 1,
                description: 1,
                category: 1,
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
                myAnswer: 1
            }
        });

        const result = await QUESTION.aggregatePaginate(pipeline,{ page: parseInt(page), limit: parseInt(limit), sort: sortOption });

        res.status(200).json({ success: true, data: result.docs, pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage
        }});

    } catch (error) {
        next(error);
    }
}

export const addAnswer = async (req,res,next) => {
    try {
        const { content, questionId } = req.body;
        const lawyerId = req.lawyerId;

        const existingAnswer = await ANSWER.findOne({ questionId, lawyerId });

        if (existingAnswer){
            throw createError("You have already submitted an answer for this question", 409);
        }

        await ANSWER.create({ questionId, lawyerId, content });

        res.status(201).json({ success: true, message: "Answer submitted successfully." });
    } catch (error) {
        next(error);
    }
}

export const updateAnswer = async (req,res,next) => {
    try {
        const { content, answerId } = req.body;
        const lawyerId = req.lawyerId;

        const answerToUpdate = await ANSWER.findById(answerId);

        if (!answerToUpdate) {
            throw createError("Answer not found.", 404);
        }

        if (answerToUpdate.lawyerId.toString() !== lawyerId.toString()) {
            throw createError("You are not authorized to update this answer.", 403);
        }

        answerToUpdate.content = content;
        await answerToUpdate.save();

        res.status(200).json({ success: true, message: "Answer updated successfully." });
    } catch (error) {
        next(error);
    }
}

export const deleteAnswer = async (req,res,next) => {
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
        const { answerId } = req.params;
        const lawyerId = req.lawyerId;

        if (!mongoose.isValidObjectId(answerId)){
            throw createError("Invalid Answer ID.", 400);
        }

        const answerToDelete = await ANSWER.findById(answerId).session(dbSession);

        if (!answerToDelete) {
            throw createError("Answer not found.", 404);
        }

        if (answerToDelete.lawyerId.toString() !== lawyerId.toString()) {
            throw createError("You are not authorized to delete this answer.", 403);
        }

        await VOTE.deleteMany({ answerId }, { session: dbSession });
        
        const question = await QUESTION.findById(answerToDelete.questionId).session(dbSession);
        if (question && question.bestAnswerId?.toString() === answerToDelete._id.toString()) {
            await QUESTION.findByIdAndUpdate(question._id, { $set: { bestAnswerId: null } }, { session: dbSession });
        }

        await ANSWER.findByIdAndDelete(answerId, { session: dbSession });
        await dbSession.commitTransaction();

        res.status(200).json({ success: true, message: "Answer deleted successfully." });
    } catch (error) {
        await dbSession.abortTransaction();
        next(error);
    } finally{
        dbSession.endSession();
    }
}

export const getFeaturedQAndA = async (req,res,next) => {
    try {
        const pipeline = [
            { $lookup: {
                from: 'answers',
                localField: '_id',
                foreignField: 'questionId',
                as: 'answerDocs'
            }},
            { $match: { "answerDocs": { $ne: [] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $lookup: {
                from: 'answers',
                let: { question_id: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$questionId", "$$question_id"] } } },
                    { $sort: { upvotes: -1 } }, 
                    { $limit: 1 }, 
                    { $lookup: { from: 'lawyers', localField: 'lawyerId', foreignField: '_id', as: 'lawyer' } },
                    { $unwind: '$lawyer' },
                    { $lookup: { from: 'users', localField: 'lawyer.userId', foreignField: '_id', as: 'lawyer.user' } },
                    { $unwind: '$lawyer.user' }
                ],
                as: 'topAnswer'
            }},
            { $unwind: '$topAnswer' }, 
            { $project: {
                _id: 0, 
                question: '$title',
                askedBy: { $cond: { if: { $eq: ["$isAnonymous", true] }, then: "Anonymous User", else: "$user.name" } },
                date: '$createdAt',
                answer: {
                    text: '$topAnswer.content',
                    lawyer: {
                        name: '$topAnswer.lawyer.user.name',
                        specialization: '$topAnswer.lawyer.specialization',
                        avatar: '$topAnswer.lawyer.user.profileImage'
                    }
                }
            }}
        ];

        const exampleQuestions = await QUESTION.aggregate(pipeline);

        res.status(200).json({ success: true, data: exampleQuestions });
    } catch (error) {
        next(error);
    }
}