import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lawyer', 
        required: true,
        unique: true,
        index: true,
    },
    recurringDays: {
        mon: { type: Boolean, default: false },
        tue: { type: Boolean, default: false },
        wed: { type: Boolean, default: false },
        thu: { type: Boolean, default: false },
        fri: { type: Boolean, default: false },
        sat: { type: Boolean, default: false },
        sun: { type: Boolean, default: false },
    },
    startTime: {
        type: String,
        required: true,
        default: '09:00',
    },
    endTime: {
        type: String, 
        required: true,
        default: '17:00',
    },
    breakStartTime: {
        type: String,
        required: true,
        default: '09:00',
    },
    breakEndTime: {
        type: String, 
        required: true,
        default: '17:00',
    },
    availableToday: {
        type: Boolean,
        required: true,
        default: true
    },
    slotDuration: {
        type: Number, 
        required: true,
        enum: [15, 30, 45, 60],
        default: 30,
    },
}, { timestamps: true });

const SCHEDULE = mongoose.model('schedule', scheduleSchema);
export default SCHEDULE;