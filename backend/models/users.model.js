import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        },
        default: null,
        select: false
    },
    authProvider: {
        type: String,
        enum: ["local","google", "Both"],
        required: true,
        default: "local"
    },
    oauthId: {
        type: String,
        required: function() {
            return this.authProvider === 'google';
        },
        default: null,
        select: false 
    },
    role: {
        type: String,
        enum: ["user","lawyer","admin"],
        required: true
    },
    profileImage: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active',
        required: true,
    },
    bioDataProvided:{
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
},{minimize: false, timestamps: true});

UsersSchema.plugin(mongooseAggregatePaginate);
UsersSchema.plugin(mongoosePaginate);

UsersSchema.pre("save", async function(next){
    if (!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,12);
    next();
});

const USER = mongoose.model("user",UsersSchema);

export default USER;