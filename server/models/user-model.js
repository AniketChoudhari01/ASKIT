import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Schema from "mongoose";

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

const recordOTPSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 }, // Automatically deletes after 5 minutes
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    profilePicture: {
      type: String,
    },
    // Simplified address field to store a single address
    // address: {
    //   label: { type: String /* , required: true */ }, // e.g., "Home", "Work"
    //   address: { type: String /* , required: true */ }, // Full address string
    //   location: {
    //     type: {
    //       type: String,
    //       enum: ["Point"],
    //     },
    //     coordinates: {
    //       type: [Number],
    //     },
    //   },
    // },
    phone: {
      type: String,
    },
    isGoogleUser: { type: Boolean, default: false },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["service_provider", "service_seeker"],
      default: "service_seeker",
    },
    serviceProviderId: {
      //to map with respective service provider
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      default: null,
    },
  },
  { timestamps: true }
);

// Removed geospatial indexing for addresses array
// userSchema.index({ "address.location": "2dsphere" });

const serviceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    image: { type: String, required: true },
    // password: { type: String, required: true }, // Store hashed passwords!
    profilePicture: { type: String },
    jobDescription: { type: String, required: true, trim: true },
    services: { type: String, required: true, trim: true },
    company: { type: String },
    experience: { type: String, required: true, trim: true }, // e.g., "5 years"
    // locationCovered: { type: [String], required: true }, // Changed to an array
    mobileNumbers: {
      type: [String],
      required: true,
      // unique: true /* FIX ME: uncomment later in production */,
      match: /^\+?[0-9]{7,15}$/, // Validates international phone numbers
    },
    whatsappNumbers: {
      type: [String],
      // required: true,
      match: /^\+?[0-9]{7,15}$/,
    },
    sameWhatsApp: { type: Boolean, default: false },
    availableWeekends: { type: Boolean, default: false },
    aadhaar: {
      type: String,
      required: true,
      trim: true,
    },
    quotationFile: {
      type: String,
      required: true,
      trim: true,
    },
    quotationUrl: { type: String },
    pricingFile: { type: String },
    termsFile: { type: String },
    termsUrl: { type: String },
    certifications: { type: [String], default: [] },
    certificationsUrl: [],
    logoImg: { type: String },
    workImages: { type: [String], default: [] },
    workImageUrls: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 }, // Default to 0
    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },
    radius: { type: String, default: "10KM" },
    step: { type: String },
    jobPreference: { type: String },
    // address: {
    //   formattedAddress: { type: String, required: true, trim: true }, // Full address
    //   street: { type: String, trim: true },
    //   city: { type: String, trim: true },
    //   state: { type: String, trim: true },
    //   country: { type: String, trim: true },
    //   postalCode: { type: String, trim: true },
    // },

    // locationCovered: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point",
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: true,
    //     validate: {
    //       validator: function (value) {
    //         return (
    //           value.length === 2 &&
    //           value.every((num) => typeof num === "number")
    //         );
    //       },
    //       message: "Coordinates must be an array of [longitude, latitude]",
    //     },
    //   },
    // },
    locationCovered: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
      name: {
        type: String, // ✅ Add a field for human-readable address
        required: true,
      },
    },

    // pricePerDay: { type: Number, required: true, min: 0 },
    // servicesOffered: { type: [String], required: true },
    // // experiences: { type: [String], default: [] },
    // workingDays: {
    //   type: Map,
    //   of: {
    //     startTime: {
    //       type: String,
    //       match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    //       required: true,
    //     }, // Time validation (HH:mm)
    //     endTime: {
    //       type: String,
    //       match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    //       required: true,
    //     },
    //   },
    // },
    // topSkills: { type: [String], default: [] },
  },
  { timestamps: true }
);
serviceProviderSchema.index({ location: "2dsphere", userId: 1, status: 1 });
const timeSlotSchema = new mongoose.Schema(
  {
    from: { type: String, required: true }, // e.g., "08:00 AM"
    to: { type: String, required: true }, // e.g., "10:00 AM"
  },
  { _id: false }
);
const serviceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  serviceType: { type: String, required: true }, // e.g., "Plumbing", "Electrical"
  fullName: { type: String, required: true },
  title: { type: String, required: true }, // e.g., "Leaky Faucet Repair"
  description: { type: String, required: true }, // Detailed description of the service needed,
  keywords: { type: [String], required: true }, // Keywords for search optimization,
  image: { type: String, required: true }, // URL to an image related to the service request,
  serviceAddress: { type: String, required: true },
  landmark: { type: String, required: true }, //initially only shows this
  preferredDate: { type: Date, required: true }, // Date when the service is needed,
  preferredTime: {
    type: String,
    enum: ["morning", "afternoon", "evening", "flexible", "custom"],
    required: true,
  }, // Time when the service is needed, e.g., "10:00 AM - 12:00 PM"
  customTimeSlot: {
    type: timeSlotSchema,
    required: function () {
      return this.preferredTime === "custom";
    },
  },
  urgencyLevel: {
    type: String,
    enum: ["immediate", "today", "flexible"],
    required: true,
  },
  phone: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  // console.log("pre method inside Token.js", this);

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

/* FAQ Schema */
const FAQSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["seeker", "provider", "two-way"],
    required: true,
  },
  userName: { type: String },
  userEmail: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String },
  location: { type: String },
  isAnswered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
FAQSchema.index({ question: "text", userType: 1, location: 1 });

/* How to videos schemes */
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeLink: { type: String, required: true },
  videoId: { type: String, required: true }, //extracted from youtube url used to embed the videos
  likes: { type: Number, default: 0 },
  // This stores the list of users who liked the video
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
});

//comments schema
const commentSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  user: String,
  text: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  commentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
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
    // console.error("Token Generation Error:", error);
    throw new Error("Error generating token");
  }
};

export const User = mongoose.model("User", userSchema);
export const RecordOTP = mongoose.model("RecordOTP", recordOTPSchema);
export const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);
export const FAQ = mongoose.model("FAQ", FAQSchema);
export const ServiceRequest = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);
export const Video = mongoose.model("Video", videoSchema);
export const Comment = mongoose.model("Comment", commentSchema);
