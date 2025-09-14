import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_PATH)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(`Error in connecting database: ${err}`);
    })
}

export default connectDB;