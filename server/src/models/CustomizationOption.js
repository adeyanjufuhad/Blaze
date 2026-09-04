const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Option type is required'],
      enum: ['base', 'sauce', 'cheese', 'vegetable'],
    },
    name: {
      type: String,
      required: [true, 'Option name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priceModifier: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CustomizationOption', customizationOptionSchema);
