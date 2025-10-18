import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
    answerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "answer",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});

VoteSchema.index({ answerId: 1, userId: 1 }, { unique: true });

const VOTE = mongoose.model("vote", VoteSchema);

export default VOTE;