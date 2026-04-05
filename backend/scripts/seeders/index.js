import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Import Models
import { User } from "../../src/models/user.js";
import { Property } from "../../src/models/property.js";
import { Enquiry } from "../../src/models/enquiry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import JSON data
const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data/users.json"), "utf-8"));
const properties = JSON.parse(fs.readFileSync(path.join(__dirname, "data/properties.json"), "utf-8"));
const enquiries = JSON.parse(fs.readFileSync(path.join(__dirname, "data/enquiries.json"), "utf-8"));

dotenv.config();

const seedData = async (Model, data, modelName) => {
  try {
    await Model.deleteMany({});
    console.log(`${modelName} collection is now empty!`);
    await Model.insertMany(data);
    console.log(`${modelName} collection seeded successfully!`);
  } catch (error) {
    console.error(`Failed to seed ${modelName}:`, error);
    throw error; // Exit if any operation fails
  }
};

const seedDatabase = async () => {
  console.log("Starting the database seeding process...");
  await seedData(User, users, "User");
  await seedData(Property, properties, "Property");
  await seedData(Enquiry, enquiries, "Enquiry");
  console.log("All data seeded successfully!");
};

const runSeeder = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Seeder cannot run in production. Exiting...");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB connection established for seeding!");

    await seedDatabase();
  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed. Process exiting...");
    process.exit(0);
  }
};

runSeeder();
