const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Classic', 'Custom', 'Chicken', 'Veggie', 'Specials'],
      default: 'Classic',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      enum: ['Popular', 'Spicy', "Chef's Pick", 'New', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pizza', pizzaSchema);
