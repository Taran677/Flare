const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  id: { 
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'h1', 'h2', 'h3', 'image']  // allowed block types
  },
  content: String,
  style: {
    textAlign: String,
    fontWeight: String,
    fontStyle: String,
    textDecoration: String
  },
  imageUrl: String,
  alt: String
});

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  blocks: [blockSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Generate URL-friendly slug from title
blogSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + 
      '-' + 
      Math.random().toString(36).substr(2, 6);
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;