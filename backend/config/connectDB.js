import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        console.log('Using cached database connection.');
        return cachedConnection;
    }

    try {
        console.log('Creating new database connection...');
        const connection = await mongoose.connect(process.env.MONGO_PATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        cachedConnection = connection;
        console.log('Database connected successfully.');
        
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
