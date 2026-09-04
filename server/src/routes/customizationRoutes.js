const express = require('express');
const router = express.Router();
const CustomizationOption = require('../models/CustomizationOption');
const InventoryItem = require('../models/InventoryItem');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/customization — all options grouped by type (public)
router.get('/', async (req, res, next) => {
  try {
    const options = await CustomizationOption.find({ isAvailable: true }).sort({ priceModifier: 1 });

    const grouped = {
      base: options.filter((o) => o.type === 'base'),
      sauce: options.filter((o) => o.type === 'sauce'),
      cheese: options.filter((o) => o.type === 'cheese'),
      vegetable: options.filter((o) => o.type === 'vegetable'),
    };

    res.json({
      success: true,
      options,
      grouped,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/customization — admin: add option
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { type, name, description, priceModifier, image, initialStock, threshold, unit } = req.body;

    if (!type || !name) {
      return res.status(400).json({ success: false, message: 'Type and name are required' });
    }

    const option = new CustomizationOption({
      type,
      name,
      description: description || '',
      priceModifier: Number(priceModifier) || 0,
      image: image || '',
      isAvailable: true,
    });

    await option.save();

    // Optionally create or synchronize with inventory item
    let inventoryItem = await InventoryItem.findOne({ name });
    if (!inventoryItem && initialStock !== undefined) {
      inventoryItem = new InventoryItem({
        name,
        type,
        stock: Number(initialStock) || 50,
        threshold: Number(threshold) || 20,
        unit: unit || 'units',
      });
      await inventoryItem.save();
    }

    res.status(201).json({
      success: true,
      message: 'Customization option added successfully',
      option,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/customization/:id — admin: update option + stock
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, priceModifier, image, isAvailable, stock } = req.body;

    const option = await CustomizationOption.findById(req.params.id);
    if (!option) {
      return res.status(404).json({ success: false, message: 'Customization option not found' });
    }

    const oldName = option.name;
    if (name) option.name = name;
    if (description !== undefined) option.description = description;
    if (priceModifier !== undefined) option.priceModifier = Number(priceModifier);
    if (image !== undefined) option.image = image;
    if (isAvailable !== undefined) option.isAvailable = Boolean(isAvailable);

    await option.save();

    // If stock is also provided, update the corresponding InventoryItem
    if (stock !== undefined) {
      await InventoryItem.findOneAndUpdate(
        { name: oldName },
        { $set: { name: option.name, stock: Number(stock) } }
      );
    }

    res.json({
      success: true,
      message: 'Customization option updated successfully',
      option,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/customization/:id — admin: remove option
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const option = await CustomizationOption.findByIdAndDelete(req.params.id);
    if (!option) {
      return res.status(404).json({ success: false, message: 'Customization option not found' });
    }

    res.json({
      success: true,
      message: 'Customization option deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
