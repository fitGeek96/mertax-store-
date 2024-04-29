import mongoose from "mongoose";

const connectDB = async (params) => {
  try {
    const connecting = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${connecting.connections[0].host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
