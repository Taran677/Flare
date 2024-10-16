const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User"); // Use the same User model for both signup and login
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser()); // Add cookie parser
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "You have access to this protected route!" });
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { name, username, nickname, birthday, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      nickname,
      birthday,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }
    res.status(500).json({ message: "Error creating account", error });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as an HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true, // Secure cookie
        sameSite: "lax",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({ message: "Login successful", username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
