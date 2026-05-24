import mongoose from 'mongoose';

/**
 * MongoDB connection configuration
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orderuk';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE || 10),
      minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || 5),
      maxIdleTimeMS: 45000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;