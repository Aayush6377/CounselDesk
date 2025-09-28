import TIMESLOT from '../models/timeSlot.model.js';
import moment from 'moment-timezone';

const generateSlotsForNextDays = async (lawyerId, schedule, daysToGenerate = 3) => {
    const { startTime, endTime, breakStartTime, breakEndTime, slotDuration, recurringDays } = schedule;
    const timeZone = 'Asia/Kolkata'; 
    const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const bookedSlots = await TIMESLOT.find({
        lawyerId: lawyerId,
        status: 'booked',
        startTime: { $gte: moment().tz(timeZone).startOf('day').toDate() }
    });

    const newSlots = [];

    for (let i = 0; i < daysToGenerate; i++) {
        const currentDay = moment().tz(timeZone).add(i, 'days');
        const dayOfWeek = dayMapping[currentDay.day()];

        if (recurringDays[dayOfWeek]) {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            const [breakStartHour, breakStartMinute] = breakStartTime.split(':').map(Number);
            const [breakEndHour, breakEndMinute] = breakEndTime.split(':').map(Number);

            let slotTime = currentDay.clone().hour(startHour).minute(startMinute).second(0).millisecond(0);
            const endOfDay = currentDay.clone().hour(endHour).minute(endMinute).second(0).millisecond(0);
            
            const breakStart = currentDay.clone().hour(breakStartHour).minute(breakStartMinute).second(0).millisecond(0);
            const breakEnd = currentDay.clone().hour(breakEndHour).minute(breakEndMinute).second(0).millisecond(0);
            
            if (i === 0) {
                const now = moment().tz(timeZone);
                if (endOfDay.isBefore(now)) continue; 

                if (slotTime.isBefore(now)) {
                    slotTime = now;
                }
            }

            const remainder = slotTime.minute() % 15;
            if (remainder !== 0) {
                slotTime.add(15 - remainder, 'minutes').second(0).millisecond(0);
            }

            while (slotTime.isBefore(endOfDay)) {
                const potentialEndTime = slotTime.clone().add(slotDuration, 'minutes');

                if (potentialEndTime.isAfter(endOfDay)) {
                    break; 
                }

                let overlapsWithBooking = false;
                for (const bookedSlot of bookedSlots) {
                    const bookedStartTime = moment(bookedSlot.startTime);
                    const bookedEndTime = moment(bookedSlot.endTime);
                    
                    if (slotTime.isBefore(bookedEndTime) && potentialEndTime.isAfter(bookedStartTime)) {
                        overlapsWithBooking = true;
                        break; 
                    }
                }

                const overlapsWithBreak = potentialEndTime.isAfter(breakStart) && slotTime.isBefore(breakEnd);

                if (!overlapsWithBooking && !overlapsWithBreak) {
                    newSlots.push({
                        lawyerId,
                        startTime: slotTime.toDate(),
                        endTime: potentialEndTime.toDate(),
                        status: 'available'
                    });
                }
                
                slotTime.add(slotDuration, 'minutes');
            }
        }
    }

    if (newSlots.length > 0) {
        try {
            await TIMESLOT.bulkWrite(
                newSlots.map(slot => ({ insertOne: { document: slot } })),
                { ordered: false }
            );
        } catch (e) {
            if (e.code !== 11000) {
                console.error("Bulk write error:", e);
            }
        }
    }
};

export default generateSlotsForNextDays;