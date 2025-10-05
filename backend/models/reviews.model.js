import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user"
    },
    lawyerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "lawyer",
    },
    appointmentId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: "appointment"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

ReviewSchema.plugin(mongoosePaginate);
ReviewSchema.index({userId: 1, appointmentId: 1}, {unique: 1});
ReviewSchema.index({lawyerId: 1});

const REVIEW = mongoose.model("review",ReviewSchema);

export default REVIEW;