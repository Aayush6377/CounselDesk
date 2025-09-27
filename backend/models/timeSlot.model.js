import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lawyer',
        required: true,
        index: true, 
    },
    startTime: {
        type: Date,
        required: true,
        index: true, 
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'booked', 'expired', 'cancelled'],
        default: 'available',
        index: true,
    },
}, { timestamps: true });


timeSlotSchema.index({ lawyerId: 1, startTime: 1, status: 1 });

const TIMESLOT = mongoose.model('timeSlot', timeSlotSchema);
export default TIMESLOT;