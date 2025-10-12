import mongoose from 'mongoose';
import APPOINTMENT from '../models/appointments.model.js';
import LAWYER from '../models/lawyers.model.js';
import createError from '../utils/createError.js';
import moment from 'moment-timezone';

export const getMeetingLink = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const { userId, role } = req; 

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw createError("Invalid appointment ID format.", 400);
        }

        const appointment = await APPOINTMENT.findById(appointmentId).populate('timeSlotId', 'endTime');

        if (!appointment) {
            throw createError("Appointment not found.", 404);
        }

        const now = moment().tz('Asia/Kolkata');
        const appointmentEndTime = moment(appointment.timeSlotId.endTime).tz('Asia/Kolkata');

        if (now.isAfter(appointmentEndTime)) {
            throw createError("This appointment has already ended.", 400);
        }

        const isUserOwner = appointment.userId.toString() === userId.toString();
        let isLawyerOwner = false;

        if (role === 'lawyer') {
            const lawyerProfile = await LAWYER.findOne({ userId: userId }).select('_id');
            if (lawyerProfile) {
                isLawyerOwner = appointment.lawyerId.toString() === lawyerProfile._id.toString();
            }
        }
        
        if (!isUserOwner && !isLawyerOwner) {
            throw createError("You are not authorized to join this meeting.", 403);
        }
        
        if (!appointment.meetingLink) {
            throw createError("A meeting link has not been generated for this appointment.", 404);
        }

        res.status(200).json({ success: true, meetingLink: appointment.meetingLink });
    } catch (error) {
        next(error);
    }
};