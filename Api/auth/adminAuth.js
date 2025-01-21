import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

const auth = async (req, res, next) => {
  const token = req.header("auth");
  console.log("Received token:", token);  // Log token for debugging
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Please login" });
  }

  try {
    const decoded = jwt.verify(token, 'secret@key');
    console.log("Decoded token:", decoded);  // Log decoded token to check payload
    
    const user = await adminModel.findById(decoded.id);
    console.log("User found:", user);  // Log the user object found in the database
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    req.user = user.id;
    next();
  } catch (error) {
    console.log("Error during token verification:", error);  // Log error to understand what went wrong
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth;
