// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload"); // Import multer middleware

// Profile picture upload route
router.post(
  "/update-profile-picture",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          profilePicture: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            uploadDate: new Date(),
          },
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: {
          contentType: user.profilePicture.contentType,
          uploadDate: user.profilePicture.uploadDate,
        },
      });
    } catch (error) {
      console.error("Profile picture upload error:", error);
      res.status(500).json({
        message: "Error updating profile picture",
        error: error.message,
      });
    }
  }
);

// Get profile picture route
router.get("/profile-picture/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user || !user.profilePicture || !user.profilePicture.data) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.set("Content-Type", user.profilePicture.contentType);
    res.send(user.profilePicture.data);
  } catch (error) {
    console.error("Error retrieving profile picture:", error);
    res.status(500).json({
      message: "Error retrieving profile picture",
      error: error.message,
    });
  }
});

module.exports = router;
