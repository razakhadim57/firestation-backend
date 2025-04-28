import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection promise
 */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MongoDB connection error: MONGO_URI is not defined in environment variables');
      console.error('Please create a .env file with MONGO_URI defined');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      autoIndex: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit the process in development mode to allow for recovery
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
