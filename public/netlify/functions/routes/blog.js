const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const multer = require("multer");

const { verifyToken } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const storage = multer.memoryStorage();

router.get("/:username/:slug", async (req, res) => {
  try {
    // First find the user by username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Then find the blog post by slug and author ID
    const blog = await Blog.findOne({
      slug: req.params.slug,
      author: user._id,
    }).populate("author", "username nickname");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if blog is published and public, or if the requesting user is the author
    if (blog.status !== "published") {
      return res
        .status(403)
        .json({ message: "This blog post is not published" });
    }

    if (!blog.status || !(blog.status === "published")) {
      return res.status(403).json({ message: "This blog post is private" });
    }

    res.status(200).json({
      _id: blog._id,
      title: blog.title,
      blocks: blog.blocks,
      author: blog.author,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      status: blog.status,
      isPublic: blog.isPublic,
      template: blog.template,
    });
  } catch (error) {
    console.error("Error retrieving blog:", error);
    res.status(500).json({
      message: "Error retrieving blog",
      error: error.message,
    });
  }
});
// Route to publish a blog
router.post("/publish", verifyToken, async (req, res) => {
  try {
    const { title, blocks, isPublic, template } = req.body;

    if (!title || !blocks) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Find the user to get their username
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and update the existing blog
    const blog = await Blog.findOneAndUpdate(
      { author: req.userId, title: title },
      {
        status: "published",
        isPublic: isPublic,
        template: template, // Add template to the update
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the URL of the published blog post with username
    res.status(200).json({
      message: "Blog published successfully",
      url: `http://localhost:5173/${user.username}/blog/${blog.slug}`,
    });
  } catch (error) {
    console.error("Error publishing blog:", error);
    res.status(500).json({
      message: "Error publishing blog",
      error: error.message,
    });
  }
});
router.put("/:slug/template", verifyToken, async (req, res) => {
  try {
    const { template } = req.body;
    const { slug } = req.params;

    // Validate template input
    if (!template) {
      return res
        .status(400)
        .json({ message: "Template selection is required" });
    }

    // Find and update the blog, ensuring the user owns it
    const blog = await Blog.findOneAndUpdate(
      {
        slug: slug,
        author: req.userId, // Ensure the user owns this blog
      },
      {
        template: template,
        updatedAt: new Date(),
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run any mongoose validators
      }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      message: "Blog template updated successfully",
      template: blog.template,
      updatedAt: blog.updatedAt,
    });
  } catch (error) {
    console.error("Error updating blog template:", error);
    res.status(500).json({
      message: "Error updating blog template",
      error: error.message,
    });
  }
});
// Create/Save blog
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { title, blocks } = req.body;

    if (!title || !blocks) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Check if it's a new blog or update
    let blog;
    if (req.body.blogId) {
      // Update existing blog
      blog = await Blog.findOne({
        _id: req.body.blogId,
        author: req.userId,
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      blog.title = title;
      blog.blocks = blocks;
    } else {
      // Create new blog
      blog = new Blog({
        title,
        blocks,
        author: req.userId,
      });
    }

    await blog.save();

    // If it's a new blog, add it to user's blogs array
    if (!req.body.blogId) {
      await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { blogs: blog._id } },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Blog saved successfully",
      blogId: blog._id,
      slug: blog.slug,
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({
      message: "Error saving blog",
      error: error.message,
    });
  }
});

// Route to create or update a blog
router.post("/:slug?/update", verifyToken, async (req, res) => {
  try {
    const { title, blocks } = req.body;
    const { slug } = req.params;

    let blog;
    if (slug) {
      blog = await Blog.findOne({ slug, author: req.userId });
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      blog.title = title;
      blog.blocks = blocks;
      blog.updatedAt = Date.now();
    } else {
      blog = new Blog({
        title,
        blocks,
        author: req.userId,
      });
    }

    await blog.save();
    res.status(200).json({
      message: `Blog ${slug ? "updated" : "saved"} successfully`,
      slug: blog.slug,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving blog", error: error.message });
  }
});

// Route to get a blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      "author",
      "username nickname"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving blog", error: error.message });
  }
});

// Route to delete a blog
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.userId,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { blogs: req.params.id },
    });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
});

// Get user's blogs without filtering
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "blogs",
      "title slug createdAt updatedAt status"
    );

    // Return all blogs for the user
    res.status(200).json(user.blogs);
  } catch (error) {
    console.error("Error retrieving user blogs:", error);
    res.status(500).json({
      message: "Error retrieving blogs",
      error: error.message,
    });
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(
        new Error(
          "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image."
        )
      );
    }
    cb(null, true);
  },
});

router.post(
  "/upload-image",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    try {
      // Convert image buffer to base64
      const imageData = req.file.buffer.toString("base64");
      const imageUrl = `data:${req.file.mimetype};base64,${imageData}`;

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res
        .status(500)
        .json({ message: "Error uploading image", error: error.message });
    }
  }
);
module.exports = router;
