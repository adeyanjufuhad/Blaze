const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { upload, uploadImageBuffer } = require('../services/cloudinaryService');

// GET /api/pizza — all available pizzas (public)
// Optional query ?all=true for admin to view unavailable too
router.get('/', async (req, res, next) => {
  try {
    const { category, search, all } = req.query;
    const filter = {};

    if (!all) {
      filter.isAvailable = true;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pizzas.length, pizzas });
  } catch (err) {
    next(err);
  }
});

// GET /api/pizza/:id — single pizza (public)
router.get('/:id', async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.json({ success: true, pizza });
  } catch (err) {
    next(err);
  }
});

// POST /api/pizza — admin: create pizza
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.single('imageFile'),
  async (req, res, next) => {
    try {
      let { name, description, basePrice, category, badge, isAvailable, image } = req.body;

      if (req.file) {
        image = await uploadImageBuffer(req.file.buffer, 'blaze_pizzas');
      }

      if (!name || !description || !basePrice || !image) {
        return res.status(400).json({
          success: false,
          message: 'Name, description, basePrice, and an image are required',
        });
      }

      const pizza = new Pizza({
        name,
        description,
        basePrice: Number(basePrice),
        image,
        category: category || 'Classic',
        badge: badge || null,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      });

      await pizza.save();

      res.status(201).json({
        success: true,
        message: 'Pizza created successfully',
        pizza,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/pizza/:id — admin: update pizza
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  upload.single('imageFile'),
  async (req, res, next) => {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.image = await uploadImageBuffer(req.file.buffer, 'blaze_pizzas');
      }

      if (updateData.basePrice !== undefined) {
        updateData.basePrice = Number(updateData.basePrice);
      }
      if (updateData.isAvailable !== undefined) {
        updateData.isAvailable = Boolean(updateData.isAvailable);
      }

      const pizza = await Pizza.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!pizza) {
        return res.status(404).json({ success: false, message: 'Pizza not found' });
      }

      res.json({
        success: true,
        message: 'Pizza updated successfully',
        pizza,
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/pizza/:id — admin: soft delete (set isAvailable false)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    res.json({
      success: true,
      message: 'Pizza marked as unavailable (soft deleted)',
      pizza,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
