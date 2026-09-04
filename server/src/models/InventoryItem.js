const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Item type is required'],
      enum: ['base', 'sauce', 'cheese', 'vegetable'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0,
    },
    threshold: {
      type: Number,
      required: true,
      default: 20,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['units', 'kg', 'litres'],
      default: 'units',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for status (OK, Low, Critical)
inventoryItemSchema.virtual('status').get(function () {
  if (this.stock <= Math.floor(this.threshold / 2)) return 'Critical';
  if (this.stock <= this.threshold) return 'Low';
  return 'OK';
});

inventoryItemSchema.set('toJSON', { virtuals: true });
inventoryItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
