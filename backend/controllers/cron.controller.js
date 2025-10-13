import moment from 'moment-timezone';
import LAWYER from '../models/lawyers.model.js';
import SCHEDULE from '../models/schedule.model.js';
import TIMESLOT from '../models/timeSlot.model.js';
import APPOINTMENT from '../models/appointments.model.js';
import PAYMENT from '../models/payments.model.js';
import generateSlotsForNextDays from '../utils/slotGenerator.js';
import cron from "node-cron";

export const dailyMaintenanceJob = async (req,res,next) => {
    console.log(`Starting daily maintenance job at ${new Date().toISOString()}`);
    const timeZone = 'Asia/Kolkata';
    const now = moment().tz(timeZone);

    try {
        //Update appointment status
        const timeSlotsToEnd = await TIMESLOT.find({ endTime: { $lt: now.toDate() } }).select("_id");
        const timeSlotIdsToEnd = timeSlotsToEnd.map(slot => slot._id);
        await APPOINTMENT.updateMany(
            { status: "scheduled", timeSlotId: { $in: timeSlotIdsToEnd } },
            { $set: { status: "completed" } }
        );

        //Deleting old time slots
        await TIMESLOT.deleteMany({
            status: { $ne: "booked" }, 
            endTime: { $lt: now.toDate() }
        });

        //Generating new time slots
        const schedules = await SCHEDULE.find();
        if (schedules.length > 0) {
            let totalSlotsGenerated = 0;
            await Promise.all(schedules.map(async (schedule) => {
                const slotsGenerated = await generateSlotsForNextDays(schedule.lawyerId, schedule, 3);
                if (slotsGenerated) {
                    totalSlotsGenerated += slotsGenerated;
                }
            }));
            console.log(`Generated ${totalSlotsGenerated} new time slots.`);
        } else {
            console.log('No schedules found to generate new slots.');
        }

        //Expire Lawyer Subscriptions
        await LAWYER.updateMany(
            { 'subscription.status': 'active', 'subscription.endDate': { $lt: now.toDate() } },
            { $set: { 'subscription.status': 'expired' } }
        );

        //Updating availableToday to true
        await SCHEDULE.updateMany(
            { availableToday: false },
            { $set: { availableToday: true } }
        );

        //Delete Old Pending Payments
        const oneHourAgo = now.clone().subtract(1, 'hour').toDate();
        await PAYMENT.deleteMany({
            status: 'pending',
            createdAt: { $lt: oneHourAgo }
        });

        console.log(`Daily maintenance job finished successfully at ${new Date().toISOString()}`);
        res.status(200).json({ success: 1, message: `Daily maintenance job finished successfully at ${new Date().toISOString()}` });
    } catch (error) {
        console.error('An error occurred during the daily maintenance job:', error);
        next('An error occurred during the daily maintenance job');
    }
};

export const startLocalCronJobs = () => {
    if (process.env.NODE_ENV !== 'production') {
        cron.schedule('0 0 * * *', () => {
            dailyMaintenanceJob();
        });
    }
};

