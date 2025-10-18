import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const QuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 15,
        index: "text"
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 30,
        index: "text"
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    bestAnswerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "answer",
        default: null
    }
}, { timestamps: true });

QuestionSchema.plugin(mongoosePaginate);
QuestionSchema.plugin(mongooseAggregatePaginate);

const QUESTION = mongoose.model("question", QuestionSchema);

export default QUESTION;