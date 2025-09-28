import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user"
    },
    lawyerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "lawyer"
    },
    appointmentId: {
        type: mongoose.Types.ObjectId,
        ref: "appointment",
        default: null
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["consultancy", "subscription", "refund"],
        default: "consultancy"
    },
    status: {
        type: String,
        required: true,
        enum: ["success", "failed","pending"],
        default: "pending"
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

PaymentSchema.index({userId: 1});
PaymentSchema.index({lawyerId: 1});
PaymentSchema.index({appointmentId: 1});

const PAYMENT = mongoose.model("payment", PaymentSchema);

export default PAYMENT;