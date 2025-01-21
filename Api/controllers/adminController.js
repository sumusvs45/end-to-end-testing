import adminModel from '../models/adminModel.js'
import  jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";
import bcrypt from 'bcryptjs'

export const adminRegister = async (req, res) => {
  const { name, email, phno, password } = req.body;
  console.log(name, email, phno, password);
  console.log(req.body);

  // Checking if name, email, phno, or password are empty or not
  if (!name || !email || !phno || !password) {
    return res.status(400).json({ success: false, message: "Enter all details" }); // 400 Bad Request for missing data
  }

  try {
    const userExist = await adminModel.findOne({ email });

    // Checking if the user exists
    if (userExist) {
      return res.status(409).json({ success: false, message: "User already exists" }); // 409 Conflict if user exists
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate verification OTP
    const verificationCode = Math.floor(100000 + Math.random() * 9000).toString();

    // Create a new user
    const user = new adminModel({
      name,
      email,
      phno,
      password: hashPassword,
      verifyOtp: verificationCode,
    });

    // Save the user
    await user.save();

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, 'secret@key', {
      expiresIn: "7d",
    });

    // Send the verification email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Raithana Dairy",
      text: `Welcome to Raithana Dairy. Your account was created with email: ${email}`,
      html: `Your OTP code for verification is: ${user.verifyOtp}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success response with token (ensure content is sent)
    return res.status(201).json({ success: true, message: 'Registration successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


 // Import required packages

// CORS middleware (if you're not using it globally)

// Admin login function



    // Sending email (optional)

    export const adminLogin = async (req, res) => {
      const { email, password } = req.body;
      console.log(req.body)
    
      // Checking if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }
    
      try {
        const user = await adminModel.findOne({ email });
    
        // Checking if user exists
        if (!user) {
          return res.status(404).json({ success: false, message: "User doesn't exist" });
        }
    
        // Comparing passwords
        const isMatchpwd = await bcrypt.compare(password, user.password);
    
        // If passwords don't match
        if (!isMatchpwd) {
          return res.status(401).json({ success: false, message: "Incorrect password" });
        }
    
        // Generating JWT token
        const token = jwt.sign({ id: user._id }, 'secret@key', {
          expiresIn: '7d', // Token will expire in 7 days
        });
    
        // Sending response with the token
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token:token 
         // Send the token in the response
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message});
      }
    };
    
