// models/Post.js
const mongoose = require('mongoose');

// Block Schema - for better organization of block-specific fields
const blockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'h1', 'h2', 'h3', 'image'], // restrict block types
    default: 'paragraph'
  },
  content: {
    type: String,
    default: ''
  },
  style: {
    textAlign: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left'
    },
    fontWeight: {
      type: String,
      enum: ['normal', 'bold'],
      default: 'normal'
    },
    fontStyle: {
      type: String,
      enum: ['normal', 'italic'],
      default: 'normal'
    },
    textDecoration: {
      type: String,
      enum: ['none', 'underline'],
      default: 'none'
    }
  },
  imageUrl: {
    type: String,
    // Required only if block type is 'image'
    required: function() {
      return this.type === 'image';
    }
  },
  alt: {
    type: String,
    // Required only if block type is 'image'
    required: function() {
      return this.type === 'image';
    }
  }
}, { _id: false }); // Disable automatic _id for subdocuments

// Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  blocks: {
    type: [blockSchema],
    required: true,
    default: []
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  readTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ slug: 1 });

// Virtual field for comments (if you decide to add comments feature later)
postSchema.virtual('commentsCount', {
  ref: 'Comment', // Assuming you'll have a Comment model
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Pre-save middleware to generate slug and calculate read time
postSchema.pre('save', function(next) {
  // Only generate slug if title is modified or it's a new document
  if (this.isModified('title') || this.isNew) {
    this.slug = generateSlug(this.title);
  }
  
  // Calculate read time based on content
  this.readTime = calculateReadTime(this.blocks);
  
  next();
});

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to calculate read time in minutes
function calculateReadTime(blocks) {
  const WORDS_PER_MINUTE = 200;
  
  const totalWords = blocks.reduce((count, block) => {
    if (block.type !== 'image') {
      return count + (block.content.trim().split(/\s+/).length || 0);
    }
    return count + 10; // Assume each image takes 10 words worth of time to process
  }, 0);
  
  return Math.ceil(totalWords / WORDS_PER_MINUTE);
}

// Instance methods
postSchema.methods.isAuthor = function(userId) {
  return this.author.toString() === userId.toString();
};

// Static methods
postSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug }).populate('author', 'username nickname profilePicture');
};

postSchema.statics.findPublishedByAuthor = function(authorId) {
  return this.find({
    author: authorId,
    status: 'published'
  }).sort({ createdAt: -1 });
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;