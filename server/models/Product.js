const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description']
  },
  fullDescription: {
    type: String,
    required: [true, 'Please add a full description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating can not be more than 5'],
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
