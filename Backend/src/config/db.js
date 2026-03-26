import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected succesfully!🚀");
    })
    .catch(() => {
      console.error("Error while connecting to DB ❌");
      process.exit(1);
    });
};

export default connectDB;

