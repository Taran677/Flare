// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  blogs: [{                           // Changed to array of references
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 8,
  },
  birthday: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Birthday cannot be in the future!",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
    uploadDate: Date,
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// models/Blog.js
