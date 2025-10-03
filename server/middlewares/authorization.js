import jwt from "jsonwebtoken";
import { User } from "../models/user-model.js";
const authorization = async (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log("token is", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }
  // console.log("in auth middleware token", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");
    // console.log("U", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Please login again." });
    }
    req.user = user;
    // console.log("User authorized:", user);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authorization;
