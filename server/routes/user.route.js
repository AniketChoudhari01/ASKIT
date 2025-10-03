import { Router } from "express";
import {
  User,
  ServiceProvider,
  RecordOTP,
  ServiceRequest,
  FAQ,
  Video,
  Comment,
} from "../models/user-model.js";
import Fuse from "fuse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authorization from "../middlewares/authorization.js";
import axios from "axios";
import passport from "../config/passport.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import otpGenerator from "otp-generator";
import cloudinary from "../utils/cloudinary.js";
import upload from "../middlewares/upload.js";
const router = Router();
import mongoose from "mongoose";
import { Types } from "mongoose";
import { uploadVideos } from "../controllers/videoController.js";
const getCoordinates = async (address) => {
  try {
    /* REDIS check for query location(key) */

    const response = await axios.get(
      `https://us1.locationiq.com/v1/search?key=${
        process.env.LOCATIONIQ_API_KEY
      }&q=${encodeURIComponent(
        address
      )}&limit=1&normalizeaddress=1&countrycodes=IN&format=json`
    );

    if (response.data && response.data.length > 0) {
      return {
        longitude: parseFloat(response.data[0].lon),
        latitude: parseFloat(response.data[0].lat),
      };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    // console.error("Error fetching coordinates:", error);
    return null;
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log(
        "Missing credentials - Email:",
        !!email,
        "Password:",
        !!password
      );
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      console.log("No user found with email:", email);
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = await userExist.generateToken();

    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (tokenError) {
      return res.status(500).json({
        message: "Error generating authentication token",
      });
    }
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using https
      maxAge: 24 * 60 * 60 * 1000 * 30,
    });

    res.status(200).json({
      message: "Login Successful",
      userId: userExist._id.toString(),
    });
  } catch (error) {
    // console.error("Login error:", error);
    next(error);
  }
};
const hashedOTP = (otp) => {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex");
};

// const sendOTP = async (req, res) => {
//   try {
//     const { type, target } = req.body;
//     console.log("user:", target);

//     if (!type || !target) {
//       return res.status(400).json({ message: "Type and target are required" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const hashedOtpValue = hashedOTP(otp);
//     console.log("OTP:", otp);
//     const otpData = {
//       otp: hashedOtpValue,
//       createdAt: Date.now(),
//     };

//     if (type === "mobile") {
//       // Handle mobile OTP
//       let record = await RecordOTP.findOne({ mobile: target });
//       if (record) {
//         Object.assign(record, otpData);
//         await record.save();
//       } else {
//         await RecordOTP.create({ mobile: target, ...otpData });
//       }
//       // Send OTP via SMS (you can use Twilio or similar here)
//       console.log(`Send SMS to ${target} with OTP ${otp}`);
//     } else if (type === "email") {
//       // Handle email OTP
//       let record = await RecordOTP.findOne({ email: target });
//       if (record) {
//         Object.assign(record, otpData);
//         await record.save();
//       } else {
//         await RecordOTP.create({ email: target, ...otpData });
//       }

//       // Send OTP via email
//       await nodemailer
//         .createTransport({
//           service: "Gmail",
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD,
//           },
//         })
//         .sendMail({
//           from: process.env.EMAIL_USER,
//           to: target,
//           subject: "Your OTP Code for ASKIT",
//           text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
//         });
//     } else {
//       return res.status(400).json({ message: "Invalid type" });
//     }

//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error in sendOTP:", error);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

const sendOTP = async (req, res) => {
  const { phone } = req.body;
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // console.log("Generated OTP:", otp);
  try {
    await RecordOTP.findOneAndUpdate(
      { identifier: phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        route: "q", // transactional
        message: `Your verification code for the ASK IT is ${otp}`,
        language: "english",
        flash: 0,
        numbers: phone,
      },
    });

    res
      .status(200)
      .json({ message: "OTP sent successfully", data: response.data });
  } catch (error) {
    // console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

const sendEmailOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const hashedOtpValue = hashedOTP(otp);
  const otpData = {
    otp: hashedOtpValue,
    createdAt: Date.now(),
  };
  // console.log("Generated OTP via email:", otpData);
  let record = await RecordOTP.findOne({ identifier: email });
  if (record) {
    Object.assign(record, otpData);
    await record.save();
  } else {
    await RecordOTP.create({ identifier: email, ...otpData });
  }

  // Send OTP via email
  await nodemailer
    .createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    .sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code for ASKIT",
      text: `Your OTP code is ${otp}. It is valid for 60 seconds.`,
    });
};

const verifyOTP = async (req, res) => {
  let { identifier, email, phone, otp } = req.body;
  if (!identifier) identifier = email || phone;
  if (!identifier || !otp) {
    return res.status(400).json({ message: "Identifier and OTP are required" });
  }
  try {
    const record = await RecordOTP.findOne({ identifier });
    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }
    const incomingHashedOtp = hashedOTP(otp);
    // console.log("incoming otp ", otp);
    if (record.otp !== incomingHashedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};

const checkEmailAvailability = async (req, res) => {
  const email = req.query.email;
  // console.log("Checking email availability for:", email);
  const userExist = await User.findOne({ email });
  // console.log("User exists:", !!userExist);
  return res.json({ exists: !!userExist });
};

// const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     console.log(email, " ", otp);
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     const hashedOtpValue = hashedOTP(otp);
//     const record = await RecordOTP.findOne({ email, otp: hashedOtpValue });

//     if (!record) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Check if OTP is expired
//     if (Date.now() > record.createdAt + 5 * 60 * 1000) {
//       return res.status(400).json({ message: "OTP has expired" });
//     }

//     return res.status(200).json({ message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("Error in verifyOTP:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error while verifying OTP" });
//   }
// };

const logout = async (req, res) => {
  // console.log("inside logout route");
  return res
    .clearCookie("access_token") // Clear the access token cookie
    .status(200)
    .json({ message: "Successfully logged out" });
};
const register = async (req, res) => {
  try {
    const {
      // userName,
      name,
      email,
      password,
      // profilePicture,
      phone,
      // addresses,
    } = req.body;

    const userExist = await User.findOne({ email });
    // console.log("User exists:", userExist);
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Process each address for geocoding
    // if (addresses && addresses.length > 0) {
    //   for (let addr of addresses) {
    //     if (!addr.coordinates) {
    //       const geoData = await getCoordinates(addr.address);
    //       if (!geoData) {
    //         return res.status(400).json({
    //           message: `Invalid address: ${addr.address}, could not fetch coordinates.`,
    //         });
    //       }
    //       addr.location = {
    //         type: "Point",
    //         coordinates: [geoData.longitude, geoData.latitude],
    //       };
    //     }
    //     addr.isDefault = addr === addresses[0]; // Mark first address as default
    //     addr.lastUsed = new Date();
    //   }
    // }
    const userCreated = await User.create({
      // Create a new user
      // userName,
      name,
      email,
      password,
      // profilePicture,
      phone,
      // addresses, //Store addresses with updated coordinates
    });
    const token = await userCreated.generateToken();
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      user: userCreated,
      message: "User registered successfully",
    });
  } catch (error) {
    // console.error("Error in Register Route:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("serviceProviderId");
    if (!user) {
      return res.status(404).json({ message: "User not found! Please login" });
    }
    // console.log("user inside get profile");
    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phone: user.phone,
      ...(user.serviceProviderId && {
        provider: {
          id: user.serviceProviderId._id,
          professionName: user.serviceProviderId.professionName,
          jobDescription: user.serviceProviderId.jobDescription,
          locationCovered: user.serviceProviderId.locationCovered,
          certifications: user.serviceProviderId.certifications,
          workImages: user.serviceProviderId.workImages,
          rating: user.serviceProviderId.rating,
          services: user.serviceProviderId.services,
          availableWeekends: user.serviceProviderId.availableWeekends,
          experience: user.serviceProviderId.experience,
        },
      }),
    };
    // console.log("profile created in backend is ", profile);
    res.status(200).json(profile);
  } catch (error) {
    // console.error("Error fetching user profile", error.message);
    return res.status(500).json({ message: "server error" });
  }
};

const serviceProvider = async (req, res) => {
  const { keyword, verified } = req.query;
  try {
    let query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } }, // Case-insensitive name search
        { skills: { $regex: keyword, $options: "i" } }, // Search by skills
      ];
    }
    if (verified === "true") {
      query.verified = true;
    }
    const providers = await ServiceProvider.find(query);
    res.status(200).json(providers);
  } catch (error) {
    // console.error("Error fetching service providers:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

/* cached faqs */
let cachedFAQs = {};
async function loadCachedFAQs() {
  const all = await FAQ.find({ isAnswered: true });
  cachedFAQs = all.reduce((acc, faq) => {
    if (!acc[faq.userType]) acc[faq.userType] = [];
    acc[faq.userType].push(faq);
    return acc;
  }, {});
  console.log("FAQS cached in memory");
}
loadCachedFAQs();

//gets the FAQs with FUZZY and pagination,
const getFAQs = async (req, res) => {
  try {
    const { keyword, location, page = 1, limit = 4 } = req.query;
    const UserType = req.params.type;

    // Ensure cache is loaded
    if (Object.keys(cachedFAQs).length === 0) {
      // console.log("FAQs not cached yet, loading...");
      const all = await FAQ.find({ isAnswered: true });
      cachedFAQs = all.reduce((acc, faq) => {
        if (!acc[faq.userType]) acc[faq.userType] = [];
        acc[faq.userType].push(faq);
        return acc;
      }, {});
    }

    // console.log("faq: ", cachedFAQs);

    let allFAQs = Object.values(cachedFAQs).flat();
    if (UserType) {
      allFAQs = cachedFAQs[UserType] || [];
    }

    let filtered = allFAQs;

    // console.log("api call in the query backend");

    if (location) {
      filtered = filtered.filter((faq) => faq.location === location);
    }

    if (keyword) {
      const fuse = new Fuse(filtered, {
        keys: ["question", "answer"],
        threshold: 0.4,
      });
      const results = fuse.search(keyword).map((r) => r.item);
      const paginated = results.slice((page - 1) * limit, page * limit);
      return res.json({
        resultType: "fuzzy",
        total: results.length,
        data: paginated,
      });
    }

    // console.log("filtered data", filtered);
    const paginated = filtered.slice((page - 1) * limit, page * limit);
    res.json({ resultType: "exact", total: filtered.length, data: paginated });
  } catch (error) {
    // console.log("Error in fetching faqs", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//get the how-to-videos with fuzzy and pagination
const getVideos = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (keyword.trim() !== "") {
      query.title = { $regex: keyword, $options: "i" }; // case-insensitive
    }

    const totalItems = await Video.countDocuments(query);
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      data: videos,
      totalItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};
// db.comments.updateMany(
//   { likedBy: { $exists: false } },
//   { $set: { likedBy: [] } }
// );

//get videos by id
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "Failed to get video" });
  }
};
//get comments for a video
const getComments = async (req, res) => {
  try {
    // console.log("inisde get comments route");
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({
      createdAt: -1,
    });
    // console.log("no error in get comments");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get comments" });
  }
};
//post a comment root or reply
const postComment = async (req, res) => {
  try {
    const { videoId, user, text, parentId = null, commentedBy } = req.body;
    const comment = new Comment({ videoId, user, text, parentId, commentedBy });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to post comment" });
  }
};
//reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { parentId, user, text, videoId, commentedBy } = req.body;
    if (!parentId || !user || !text || !videoId) {
      return res.status(400).json({ error: "Missing required fields" });
    } //may be user is not login first then sign up
    const reply = new Comment({
      videoId,
      text,
      user,
      parentId:new mongoose.Types.ObjectId(parentId), // This is the ID of the comment being replied to
      commentedBy:new mongoose.Types.ObjectId(commentedBy),
      createdAt: new Date(),
    });
    await reply.save();
    // console.log("in reply back", reply);
    res.status(201).json(reply);
  } catch (error) {
    // console.log("Error in replyToComment:", error);
    res.status(500).json({ error: "Failed to reply" });
  }
};
//like a video
const likeVideo = async (req, res) => {
  try {
    // console.log("inside like a video");
    const userId = req.body.userId;
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ error: "Video not found" });
    if (video.likedBy.includes(userId)) {
      return res.status(400).json({ error: "You already liked this video" });
    }

    video.likedBy.push(userId);
    video.likes++;
    await video.save();

    res.json({ success: true, likes: video.likes });
  } catch (error) {
    res.status(500).json({ error: "Failed to like video" });
  }
};
//like a comment
const likeComment = async (req, res) => {
  try {
    // console.log("inside like comment");
    // Extend your commentSchema to include likedBy and likes like video
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    // console.log("liking comment ", comment.text);
    const userId = req.body.userId;

    if (!comment) return res.status(404).json({ error: "Comment not found" });
    //check for duplicate likes
    if (comment.likedBy.includes(userId)) {
      return res.status(400).json({ erro: "Already likes" });
    }
    comment.likedBy.push(userId);
    comment.likes++;
    await comment.save();
    return res.status(200).json({ success: true, likes: comment.likes });
  } catch (error) {
    // console.log("❌ Error in likeComment:", error);
    return res.status(500).json({ error: "Failed to like comment" });
  }
};

//unlike a comment
const unlikeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { userId } = req.body; // or however you're getting the user

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.likedBy && comment.likedBy.includes(userId)) {
      comment.likedBy = comment.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      comment.likes = Math.max(0, comment.likes - 1);
      await comment.save();
      return res.json({ message: "Comment unliked" });
    } else {
      return res
        .status(400)
        .json({ error: "User hasn't liked this comment yet" });
    }
  } catch (error) {
    // console.error("❌ Error in unlikeComment:", error);
    res.status(500).json({ error: "Failed to unlike comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.id;
    // console.log("Deleting comment with ID:", commentId, "by user:", userId);
    await Comment.deleteOne({
      _id: new Types.ObjectId(commentId),
      commentedBy: new Types.ObjectId(userId),
    });
    if (res.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Comment not found or Unauthorized user" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    // console.log("❌ Error in deleteComment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId, text, userId } = req.body;
    // console.log("inside comment update", commentId, text, userId);
    if (!commentId || !text || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      // console.log("Comment not found with Id:", commentId);
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.commentedBy.toString() !== userId.toString()) {
      // console.log("Unauthorized user trying to update comment");
      return res.status(403).json({ error: "Unaithorized user" });
    }
    comment.text = text;
    await comment.save();
    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    // console.log("Error in updateCOmment", error);
    return res
      .status(500)
      .json({ error: "Failed to update comment, please try again later" });
  }
};

const askQuestion = async (req, res) => {
  try {
    const { name, email, question, userType } = req.body;
    if (!name || !email || !question || !userType) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // console.log("ask a question", name, email, question, userType);
    const newFAQ = new FAQ({
      userName: name,
      userEmail: email,
      question: question,
      userType: userType,
    });
    await newFAQ.save();
    res.status(201).json({
      message: "Question submitted.",
    });
  } catch (error) {
    // console.log("Error in fetching faqs", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

/* find the required service provider */
const queryServiceProvider = async (req, res) => {
  try {
    const { search, lat, lon, isVerified, location, id } = req.query;
    const filters = {};
    // console.log("queried for", req.query);

    if (search) {
      filters.$or = [{ professionName: new RegExp(search, "i") }];
    }

    if (isVerified !== "") {
      filters.isVerified = isVerified === "true";
    }

    if (lat && lon) {
      filters.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          $maxDistance: 10000, // 10 km radius
        },
      };
    }

    const serviceProviders = await ServiceProvider.find(filters);

    // console.log("Data in backend:", serviceProviders);
    res.json(serviceProviders);
  } catch (error) {
    // console.error("Error fetching service providers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postService = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      professionName,
      company,
      experience,
      jobDescription,
      locationCovered,
      mobileNumbers,
      whatsappNumbers,
      sameWhatsApp,
      email,
      services,
      availableWeekends,
    } = req.body;

    // console.log("Received Body →", req.body);
    // console.log("Received Files →", req.files);
    // console.log("Received locationCovered →", locationCovered);

    // ✅ Parse location
    let parsedLocation = [];
    try {
      parsedLocation = JSON.parse(locationCovered);
    } catch (e) {
      // console.error("❌ Failed to parse locationCovered:", locationCovered);
      parsedLocation = [];
    }
    if (!Array.isArray(parsedLocation)) parsedLocation = [parsedLocation];

    const geoLocation = {
      type: "Point",
      coordinates: parsedLocation[0]?.coordinates || [],
      name: parsedLocation[0]?.name || "Unknown location",
    };

    // ✅ Validate coordinates
    if (
      !Array.isArray(geoLocation.coordinates) ||
      geoLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid coordinates format" });
    }

    // ✅ Cloudinary Upload Helper
    const uploadToCloudinary = (fileBuffer, folder) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto", folder }, (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          })
          .end(fileBuffer);
      });

    // ✅ Upload files
    const [image, aadhaar, quotationFile, termsFile, logoImg] =
      await Promise.all([
        req.files?.image?.[0]
          ? uploadToCloudinary(req.files.image[0].buffer, "profile_pictures")
          : null,
        req.files?.aadhaar?.[0]
          ? uploadToCloudinary(req.files.aadhaar[0].buffer, "aadhaar_cards")
          : null,
        req.files?.quotationFile?.[0]
          ? uploadToCloudinary(req.files.quotationFile[0].buffer, "quotations")
          : null,
        req.files?.termsFile?.[0]
          ? uploadToCloudinary(req.files.termsFile[0].buffer, "terms")
          : null,
        req.files?.logoImg?.[0]
          ? uploadToCloudinary(req.files.logoImg[0].buffer, "logos")
          : null,
      ]);

    const workImageUrls = await Promise.all(
      (req.files?.workImages || []).map((file) =>
        uploadToCloudinary(file.buffer, "work_images")
      )
    );

    const certificationUrls = await Promise.all(
      (req.files?.certifications || []).map((file) =>
        uploadToCloudinary(file.buffer, "certifications")
      )
    );

    // ✅ Create new ServiceProvider
    const newServiceProvider = new ServiceProvider({
      userId,
      firstName,
      lastName,
      professionName,
      email,
      jobDescription,
      company,
      experience,
      locationCovered: geoLocation, // ✅ Matches schema
      mobileNumbers:
        typeof mobileNumbers === "string" ? mobileNumbers.split(",") : [],
      whatsappNumbers:
        typeof whatsappNumbers === "string" ? whatsappNumbers.split(",") : [],
      sameWhatsApp: sameWhatsApp === "true",
      availableWeekends: availableWeekends === "true",
      aadhaar,
      quotationFile,
      termsFile,
      certifications: certificationUrls,
      logoImg,
      services,
      image,
      workImages: workImageUrls,
    });

    await newServiceProvider.save();
    // ✅ Map ServiceProvider ID to User & Update Role
    await User.findByIdAndUpdate(userId, {
      serviceProviderId: newServiceProvider._id,
      role: "service_provider",
    });
    res.status(201).json({
      success: true,
      message: "Service provider added & linked to user successfully!",
      serviceProviderId: newServiceProvider._id,
    });
  } catch (error) {
    // console.error("Error in postService:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    if (req.user.temp) {
      req.session.tempGoogleUser = req.user;
      return res.redirect(`${process.env.REACT_APP_CLIENT_URL}/signin2`);
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.REACT_APP_CLIENT_URL}`);
  }
);

router.post("/SignUp-google", async (req, res) => {
  const { username, password } = req.body;
  const { tempGoogleUser } = req.session;
  if (!tempGoogleUser) return res.status(400).send("session expired");
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      name: tempGoogleUser.name,
      email: tempGoogleUser.email,
      username,
      password: hashedPassword,
      googleId: tempGoogleUser.googleId,
      profilePicture: tempGoogleUser.profilePicture,
      isGoogleUser: true,
    });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) return res.status(500).send("Login failed");
      res.redirect(`${process.env.REACT_APP_CLIENT_URL}/dashboard`); // Redirect to your desired URL after successful login
    });
  } catch (err) {
    res.status(500).send("Failed to create account");
  }
});

router.get("/temp-user", (req, res) => {
  if (req.session.tempGoogleUser) {
    return res.json(req.session.tempGoogleUser);
  }
  res.status(404).json({ message: "No temporary user found" });
});

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/validate", authorization, (req, res) => {
  res.json({ message: "User is authenticated", user: req.user });
});
router.get("/api/profile/:id", authorization, getProfile);
router.get("/serviceProviders", serviceProvider);
router.get("/queryServiceProviders", queryServiceProvider);
router.post("/send-otp", sendOTP);
router.post("/send-email-otp", sendEmailOTP);
router.post("/verify-otp", verifyOTP);
router.get("/check-email", checkEmailAvailability);
router.post(
  "/post-service",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "quotationFile", maxCount: 1 },
    { name: "pricingFile", maxCount: 1 },
    { name: "termsFile", maxCount: 1 },
    { name: "logoImg", maxCount: 1 },
    { name: "workImages", maxCount: 10 },
    { name: "certifications", maxCount: 10 },
  ]),
  postService
);
router.get("/api/faqs/:type?", getFAQs);
router.post("/api/faqs/support", askQuestion);
//should be secured route only Admin can do it
router.post("/api/videos/upload", uploadVideos);
router.get("/api/videos/getVideos", getVideos);
router.get("/api/videos/:id", getVideoById);

router.get("/api/comments/:videoId", getComments);
router.post("/api/comments", postComment);
router.post("/api/comments/reply", replyToComment);
router.put("/api/comments/:id", authorization, updateComment);
router.post("/api/videos/:id/like", likeVideo);
router.post("/api/comments/:id/like", likeComment);
router.post("/api/comments/:id/unlike", unlikeComment);
router.delete("/api/comments/:id", authorization, deleteComment);
export { router, loadCachedFAQs };
