import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medcloud';

let isConnected = false;

export const connectMongoDB = async (): Promise<void> => {
    if (isConnected) {
        console.log(' MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('✅ MongoDB connected successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

export const disconnectMongoDB = async (): Promise<void> => {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        throw error;
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await disconnectMongoDB();
    process.exit(0);
});

export default mongoose;
