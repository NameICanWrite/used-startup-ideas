import mongoose from 'mongoose'
import dotenv from 'dotenv'


const connectDB = async () => {
  try {
    await mongoose.connect(
      // process.env.DATABASE,
      process.env.NODE_ENV == 'production' ? process.env.DATABASE : process.env.DATABASE_LOCAL, 
      {
      useNewUrlParser: true
    });
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB
