const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware to verify JWT tokens
const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "Session has expired, please sign in again to continue!"
      });
    }

    try {
      // Verify the token using JWT_SECRET from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID from decoded token
      const user = await User.findById(decoded.userId);
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach user info to request object for use in subsequent middleware/routes
      req.userId = decoded.userId;
      req.username = user.username;
      req.nickname = user.nickname;

      // Move to next middleware/route handler
      next();
    } catch (err) {
      // Handle JWT verification errors
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token" });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired" });
      } else {
        throw err; // Pass other errors to catch block
      }
    }
  } catch (err) {
    // Handle any other errors
    console.error('Auth Middleware Error:', err);
    return res.status(403).json({ message: "Authentication failed!" });
  }
};

// Optional: Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error('Admin Check Error:', err);
    return res.status(500).json({ message: "Error checking admin status" });
  }
};

// Optional: Middleware to check if user owns the resource
const isResourceOwner = (model) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await model.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    
    if (resource.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to access this resource" });
    }
    
    next();
  } catch (err) {
    console.error('Resource Owner Check Error:', err);
    return res.status(500).json({ message: "Error checking resource ownership" });
  }
};

// Export middleware functions
module.exports = {
  verifyToken,
  isAdmin,
  isResourceOwner
};