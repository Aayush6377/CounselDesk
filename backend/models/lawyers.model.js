import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
        index: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    qualifications: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    totalRatingSum: {
        type: Number,
        default: 0,
        select: false 
    },
    fees: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'monthly', 'yearly'],
            default: "free",
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ["active", "expired", "canceled"],
            default: "expired",
            required: true
        },
        stripeSubscriptionId: { 
            type: String,
            select: false,
        }
    },
    address: {
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        pincode: {
            type: String,
            trim: true
        }
    },
    bankDetails: {
        accountHolderName: {
            type: String,
            required: true,
            select: false
        },
        bankName: {
            type: String,
            required: true,
            select: false
        },
        accountNumber: {
            type: String,
            required: true,
            select: false
        },
        ifscCode: {
            type: String,
            required: true,
            select: false
        }
    },
    stripeAccountId: {
        type: String,
        select: false 
    },
    stripeCustomerId: {
        type: String,
        select: false,
        unique: true,
        sparse: true 
    },
    documents: {
        barCouncilCertificate: {
            type: String,
            required: true
        },
        practiceCertificate: {
            type: String,
        },
        governmentId: {
            type: String,
            required: true
        },
        lawDegree: {
            type: String,
            required: true
        }
    }
}, {timestamps: true});

LawyerSchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (update.rating) {
        update.rating = Math.round(update.rating * 100) / 100;
    }
    next(); 
});

const LAWYER = mongoose.model("lawyer",LawyerSchema);

export default LAWYER;