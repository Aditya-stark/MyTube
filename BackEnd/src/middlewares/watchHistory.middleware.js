// middlewares/optionalAuth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const watchHistory = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("_id username");
    } catch (err) {
      // Invalid token, treat as guest
      req.user = undefined;
    }
  }
  
  next();
};
