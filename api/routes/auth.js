const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { verifyToken } = require("../middleware/auth");
require("dotenv").config();

// Input validation middleware
const validateSignupInput = (req, res, next) => {
  const { name, username, email, password, birthday } = req.body;

  // Basic validation rules
  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  // Username validation
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({
      message: "Username must be between 3 and 30 characters",
    });
  }

  next();
};

// Signup route with validation
router.post("/signup", validateSignupInput, async (req, res) => {
  try {
    const { name, username, nickname, birthday, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name: name.trim(),
      username: username.toLowerCase(),
      nickname: nickname?.trim(),
      birthday,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      message: "Account created successfully!",
      userId: user._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Error creating account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Login route with rate limiting
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
router.get("/protected", verifyToken, async (req, res) => {
  try {
    // Fetch user data from the database using userId from the token
    const user = await User.findById(req.userId).select(
      "username nickname profilePicture"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.profilePicture)
    const profilePictureBase64 = user.profilePicture
      ? `data:${
          user.profilePicture.contentType
        };base64,${user.profilePicture.data?.toString("base64")}`
      : null;

    // Respond with user data
    res.status(200).json({
      message: "User data retrieved successfully!",
      username: user.username,
      nickname: user.nickname,
      profilePicture: profilePictureBase64, // send base64 string
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      message: "Error fetching user data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check login attempts
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

    if (attempts.count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_TIME) {
      return res.status(429).json({
        message: "Too many failed attempts. Please try again later.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Update failed attempts
      loginAttempts.set(email, {
        count: attempts.count + 1,
        lastAttempt: Date.now(),
      });

      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset login attempts on successful login
    loginAttempts.delete(email);

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({
        message: "Login successful",
        username: user.username,
        userId: user._id,
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Secure logout route
router.post("/logout", verifyToken, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Delete account with confirmation
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    // Optional: Add password confirmation for deletion
    const { password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    await User.findByIdAndDelete(req.userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      message: "Error deleting account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
