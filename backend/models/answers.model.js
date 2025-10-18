import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question",
        required: true,
        index: true
    },
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lawyer",
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        minlength: 20
    },
    upvotes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

AnswerSchema.plugin(mongoosePaginate);

const ANSWER = mongoose.model("answer", AnswerSchema);

export default ANSWER;