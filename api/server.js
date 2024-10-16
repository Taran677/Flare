const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User"); // Use the same User model for both signup and login
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(express.json());
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

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
