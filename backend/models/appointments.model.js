import mongoose from "mongoose";

const AppointmentsSchema = new mongoose.Schema({
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
    slot: {
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },
    paymentId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "payment"
    }
}, {timestamps: true});

AppointmentsSchema.index({userId: 1});
AppointmentsSchema.index({lawyerId: 1});

const APPOINTMENT = mongoose.model("appointment", AppointmentsSchema);

export default APPOINTMENT;