import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ContactSubmissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['new', 'read', 'resolved'],
        default: 'new',
    }
}, { timestamps: true });

ContactSubmissionSchema.plugin(mongoosePaginate);

const CONTACT = mongoose.model("contactSubmission", ContactSubmissionSchema);

export default CONTACT;
