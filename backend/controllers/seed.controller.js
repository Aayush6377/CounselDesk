import { lawyerProfiles, lawyerUsers, schedules } from "../assets/dummyData.js";
import APPOINTMENT from "../models/appointments.model.js";
import LAWYER from "../models/lawyers.model.js";
import PAYMENT from "../models/payments.model.js";
import REVIEW from "../models/reviews.model.js";
import SCHEDULE from "../models/schedule.model.js";
import TIMESLOT from "../models/timeSlot.model.js";
import USER from "../models/users.model.js";
import generateSlotsForNextDays from "../utils/slotGenerator.js";

export const seedLawyers = async (req,res,next) => {
    try {
        for (let i = 0; i < lawyerUsers.length; i++) {
            const userData = lawyerUsers[i];
            const profileData = lawyerProfiles[i];
            const scheduleData = schedules[i];

            let user = await USER.findOneAndUpdate(
                { email: userData.email },
                { 
                    ...userData,
                    role: 'lawyer',
                    authProvider: "local",
                    verified: true,
                    bioDataProvided: true,
                },
                { upsert: true, new: true }
            );

            let lawyer = await LAWYER.findOneAndUpdate(
                { userId: user._id },
                { 
                    ...profileData,
                    documents: { barCouncilCertificate: 'dummy_url', governmentId: 'dummy_url', lawDegree: 'dummy_url' },
                    verificationStatus: "approved",
                    stripeAccountId: `acct_test_${Date.now() + i}`,
                    stripeCustomerId: `cus_test_${Date.now() + i}`,
                },
                { upsert: true, new: true }
            );

            let schedule = await SCHEDULE.findOneAndUpdate(
                { lawyerId: lawyer._id },
                { ...scheduleData },
                { upsert: true, new: true }
            );

            await TIMESLOT.deleteMany({ lawyerId: lawyer._id, status: { $ne: 'booked' } });
            await generateSlotsForNextDays(lawyer._id, schedule, 3);
            
            console.log(`Upserted lawyer: ${user.name}`);
        }
    
    res.status(200).json({ success: true, message: "Lawyer seeding finished successfully" });
    } catch (error) {
        next(error);
    }
}

export const unseedLawyers = async (req,res,next) => {
    try {
        const lawyerEmails = lawyerUsers.map(u => u.email);
        
        const usersToDelete = await USER.find({ email: { $in: lawyerEmails } });
        const userIdsToDelete = usersToDelete.map(u => u._id);
        const lawyersToDelete = await LAWYER.find({ userId: { $in: userIdsToDelete } });
        const lawyerIdsToDelete = lawyersToDelete.map(l => l._id);

        if (lawyerIdsToDelete.length === 0) {
            throw new Error("No dummy lawyers found to delete.");
        }

        await Promise.all([
            TIMESLOT.deleteMany({ lawyerId: { $in: lawyerIdsToDelete } }),
            SCHEDULE.deleteMany({ lawyerId: { $in: lawyerIdsToDelete } }),
            REVIEW.deleteMany({ lawyerId: { $in: lawyerIdsToDelete } }),
            APPOINTMENT.deleteMany({ lawyerId: { $in: lawyerIdsToDelete } }),
            PAYMENT.deleteMany({ lawyerId: { $in: lawyerIdsToDelete } }),
        ]);

        await LAWYER.deleteMany({ _id: { $in: lawyerIdsToDelete } });
        await USER.deleteMany({ _id: { $in: userIdsToDelete } });
        
        res.status(200).json({ success: true, message:  `Successfully removed ${lawyersToDelete.length} dummy lawyers.`});
    } catch (error) {
        next(error);
    }
}