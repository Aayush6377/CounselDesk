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
    timeSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timeSlot',
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['scheduled', 'completed', 'cancelledByUser', 'cancelledByLawyer', 'noShow', 'pending'],
        default: 'pending'
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