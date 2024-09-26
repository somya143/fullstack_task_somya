import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB URI with your credentials
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@testcluster.6f94f5o.mongodb.net/assignment');

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
