import mongoose from "mongoose";
import dotenv from "dotenv";
import data from "./Data/serviceProvider.js";
dotenv.config();

const url = process.env.MONGO_URI;
const serviceProviderSchema = new mongoose.Schema({}, { strict: false });
const ServiceProvider = mongoose.model(
  "serviceProviders",
  serviceProviderSchema
);

async function seedDatabase() {
  try {
    await mongoose.connect(url);
    console.log("db connected");
    await ServiceProvider.insertMany(data, { ordered: false });
    console.log("data inserted successfully");
    mongoose.connection.close();
  } catch (error) {
    console.log("Error during db connecting", error);
  }
}

seedDatabase();
