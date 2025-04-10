import { Router } from "express";
import { User, ServiceProvider } from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authorization from "../middlewares/authorization.js";
import axios from "axios";
const router = Router();

// Function to get coordinates from LocationIQ
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
    console.error("Error fetching coordinates:", error);
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
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = await userExist.generateToken();
    console.log("Generated token:", token);

    // Verify token immediately to ensure it's valid
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Token verified successfully");
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError);
      return res.status(500).json({
        message: "Error generating authentication token",
      });
    }
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using https
      maxAge: 24 * 60 * 60 * 1000 * 10, // Cookie expires in 1 day
    });

    res.status(200).json({
      message: "Login Successful",
      userId: userExist._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

const logout = async (req, res) => {
  return res
    .clearCookie("access_token") // Clear the access token cookie
    .status(200)
    .json({ message: "Successfully logged out" });
};
const register = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      name,
      profilePicture,
      phone,
      addresses,
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Process each address for geocoding
    if (addresses && addresses.length > 0) {
      for (let addr of addresses) {
        if (!addr.coordinates) {
          const geoData = await getCoordinates(addr.address);
          if (!geoData) {
            return res.status(400).json({
              message: `Invalid address: ${addr.address}, could not fetch coordinates.`,
            });
          }
          addr.location = {
            type: "Point",
            coordinates: [geoData.longitude, geoData.latitude],
          };
        }
        addr.isDefault = addr === addresses[0]; // Mark first address as default
        addr.lastUsed = new Date();
      }
    }
    const userCreated = await User.create({
      // Create a new user
      userName,
      email,
      password,
      name,
      profilePicture,
      phone,
      addresses, // Store addresses with updated coordinates
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
    console.error("Error in Register Route:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Fetch nearby service providers
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
    // Apply geospatial filtering if location is provided
    // if (longitude && latitude && radiusKm) {
    //   query.location = {
    //     $near: {
    //       $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
    //       $maxDistance: parseFloat(radiusKm) * 1000, // Convert km to meters
    //     },
    //   };
    // }
    if (verified === "true") {
      query.verified = true;
    }
    const providers = await ServiceProvider.find(query);
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const queryServiceProvider = async (req, res) => {
  try {
    const { search, lat, lon, isVerified, location, id } = req.query;
    const filters = {};
    console.log("queried for", req.query);

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

    console.log("Data in backend:", serviceProviders);
    res.json(serviceProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/login", login);
router.post("/register", register);
router.get("/logout", authorization, logout);
router.get("/validate", authorization, (req, res) => {
  res.json({ message: "User is authenticated", user: req.user });
});
router.get("/serviceProviders", serviceProvider);
router.get("/queryServiceProviders", queryServiceProvider);

export default router;
