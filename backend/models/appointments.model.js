import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
    },
    status: {
        type: String,
        required: true,
        enum: ['scheduled', 'completed', 'pending', 'cancelled'],
        default: 'pending'
    },
    paymentId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "payment"
    },
    meetingLink: {
        type: String,
        default: null
    }
}, {timestamps: true});

AppointmentsSchema.plugin(mongooseAggregatePaginate);

AppointmentsSchema.index({userId: 1});
AppointmentsSchema.index({lawyerId: 1});

const APPOINTMENT = mongoose.model("appointment", AppointmentsSchema);

export default APPOINTMENT;