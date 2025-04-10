import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., "Home", "Work", "Gym"
  address: { type: String, required: true }, // Full address string
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  isDefault: { type: Boolean, default: false }, // Marks default address
  lastUsed: { type: Date, default: Date.now }, // Last time this address was selected
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    // Single array to store all used addresses, including default one
    addresses: [addressSchema],
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);
// Geospatial Indexing
userSchema.index({ "addresses.location": "2dsphere" });

const serviceProviderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    professionName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    password: { type: String, required: true }, // Store hashed passwords!
    profilePicture: { type: String },
    jobDescription: { type: String, required: true, trim: true },

    address: {
      formattedAddress: { type: String, required: true, trim: true }, // Full address
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return (
              value.length === 2 &&
              value.every((num) => typeof num === "number")
            );
          },
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },

    locationCovered: { type: [String], required: true }, // Changed to an array
    phone: {
      type: String,
      required: true,
      // unique: true, FIX ME: uncomment later in production
      match: /^\+?[0-9]{7,15}$/, // Validates international phone numbers
    },
    whatsAppNumber: {
      type: String,
      required: true,
      match: /^\+?[0-9]{7,15}$/,
    },
    pricePerDay: { type: Number, required: true, min: 0 },
    servicesOffered: { type: [String], required: true },
    certifications: { type: [String], default: [] },
    experiences: { type: [String], default: [] },
    workingDays: {
      type: Map,
      of: {
        startTime: {
          type: String,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
          required: true,
        }, // Time validation (HH:mm)
        endTime: {
          type: String,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
          required: true,
        },
      },
    },
    topSkills: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 }, // Default to 0
  },
  { timestamps: true }
);

serviceProviderSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function (next) {
  console.log("pre method inside Token.js", this);

  if (!this.isModified("password")) return next();

  try {
    const saltRound = 10;
    const hash_password = await bcrypt.hash(this.password, saltRound);
    this.password = hash_password;
    next();
  } catch (error) {
    next(error);
  }
});

//? Generate JSON Web Token

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        id: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d", // Token expires
      }
    );
  } catch (error) {
    console.error("Token Generation Error:", error);
    throw new Error("Error generating token");
  }
};

export const User = mongoose.model("User", userSchema);
export const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);
