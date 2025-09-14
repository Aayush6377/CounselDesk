import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
        index: true
    },
    bioDataProvided:{
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
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
    qualification: {
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
    fees: {
        type: Number,
        deafult: 0
    },
    subscription: {
        plan: {
            type: String,
            enum: ["Free", "Monthly", "Yearly"],
            default: "Free",
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
            enum: ["active", "expired"],
            default: "expired",
            required: true
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
    availability: [{ 
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        booked: {
            type: Boolean,
            default: false,
        },
        appointmentId: {
            type: mongoose.Types.ObjectId,
            ref: "appointment",
            default: null
        }
    }],
    backDetails: {
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

const LAWYER = mongoose.model("lawyer",LawyerSchema);

export default LAWYER;