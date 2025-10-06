import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ['free', 'monthly', 'yearly'],
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
        default: 0,
    },

    period: {
        type: String,
        required: true,
        enum: ['month', 'year'],
    },

    features: {
        type: [String],
        required: true,
        default: [],
    },

    isPopular: {
        type: Boolean,
        default: false,
    },

    stripePriceId: {
        type: String,
        required: function() { return this.planId !== 'free'; }, 
    },

}, { timestamps: true });

const PLAN = mongoose.model('plan', planSchema);

export default PLAN;
