const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB, disconnectDB } = require('./src/config/db');
const User = require('./src/models/User');
const Pizza = require('./src/models/Pizza');
const InventoryItem = require('./src/models/InventoryItem');
const CustomizationOption = require('./src/models/CustomizationOption');

const seedDatabase = async () => {
  try {
    console.log('[Blaze Seed] Connecting to database...');
    await connectDB();

    console.log('[Blaze Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Pizza.deleteMany({}),
      InventoryItem.deleteMany({}),
      CustomizationOption.deleteMany({}),
    ]);

    // 1. Seed Admin User + Sample Customer
    console.log('[Blaze Seed] Seeding users...');
    const adminPasswordHash = await bcrypt.hash('Admin@blaze123', 10);
    const userPasswordHash = await bcrypt.hash('User@blaze123', 10);

    const users = await User.create([
      {
        name: 'Blaze Master Admin',
        email: 'admin@blaze.com',
        password: adminPasswordHash,
        role: 'admin',
        isVerified: true,
        address: {
          street: '10 Blaze Headquarters Blvd',
          city: 'Lagos',
          state: 'Lagos State',
        },
      },
      {
        name: 'Alex Hunter',
        email: 'alex@blaze.com',
        password: userPasswordHash,
        role: 'user',
        isVerified: true,
        address: {
          street: '42 Victoria Island Way, Apt 3B',
          city: 'Lagos',
          state: 'Lagos State',
        },
      },
    ]);
    console.log(`[Blaze Seed] Created ${users.length} users (Admin: admin@blaze.com / Admin@blaze123)`);

    // 2. Seed 5 Signature Pizzas
    console.log('[Blaze Seed] Seeding signature pizzas...');
    const pizzas = await Pizza.create([
      {
        name: 'The Blaze Special',
        description: 'Fire-roasted smoked chicken, double spicy pepperoni, scotch bonnet infused marinara, fresh basil & hot honey drizzle.',
        basePrice: 7500,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
        category: 'Specials',
        badge: "Chef's Pick",
        isAvailable: true,
      },
      {
        name: 'Loaded Pepperoni',
        description: 'Double stacked artisanal beef pepperoni curls, whole-milk mozzarella, San Marzano tomato sauce, dried oregano & chili flakes.',
        basePrice: 6500,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80',
        category: 'Classic',
        badge: 'Popular',
        isAvailable: true,
      },
      {
        name: 'Margherita Classic',
        description: 'Simple perfection. Fresh buffalo mozzarella, sweet vine-ripened tomato sauce, extra virgin olive oil and fragrant fresh basil.',
        basePrice: 5200,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1000&q=80',
        category: 'Classic',
        badge: 'Popular',
        isAvailable: true,
      },
      {
        name: 'BBQ Chicken Supreme',
        description: 'Flame-grilled shredded barbecue chicken, smoked cheddar, red onions, charred bell peppers and signature tangy smokey sauce.',
        basePrice: 6800,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
        category: 'Chicken',
        badge: 'Spicy',
        isAvailable: true,
      },
      {
        name: 'Veggie Feast',
        description: 'Earthy button mushrooms, sweet crisp bell peppers, Kalamata black olives, sweet corn, baby spinach and caramelized onions.',
        basePrice: 5800,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80',
        category: 'Veggie',
        badge: 'New',
        isAvailable: true,
      },
    ]);
    console.log(`[Blaze Seed] Created ${pizzas.length} signature pizzas`);

    // 3. Seed Inventory Items
    console.log('[Blaze Seed] Seeding inventory items...');
    const inventoryData = [
      // Bases: 5 options (100 units each, threshold 20)
      { name: 'Classic Thin', type: 'base', stock: 100, threshold: 20, unit: 'units' },
      { name: 'Thick Pan', type: 'base', stock: 100, threshold: 20, unit: 'units' },
      { name: 'Stuffed Crust', type: 'base', stock: 100, threshold: 20, unit: 'units' },
      { name: 'Whole Wheat', type: 'base', stock: 100, threshold: 20, unit: 'units' },
      { name: 'Gluten Free', type: 'base', stock: 100, threshold: 20, unit: 'units' },

      // Sauces: 5 options (80 units each, threshold 15)
      { name: 'Tomato', type: 'sauce', stock: 80, threshold: 15, unit: 'litres' },
      { name: 'BBQ', type: 'sauce', stock: 80, threshold: 15, unit: 'litres' },
      { name: 'Pesto', type: 'sauce', stock: 80, threshold: 15, unit: 'litres' },
      { name: 'Alfredo', type: 'sauce', stock: 80, threshold: 15, unit: 'litres' },
      { name: 'Spicy Arrabbiata', type: 'sauce', stock: 80, threshold: 15, unit: 'litres' },

      // Cheeses: 3 options (60 units each, threshold 10)
      { name: 'Mozzarella', type: 'cheese', stock: 60, threshold: 10, unit: 'kg' },
      { name: 'Cheddar', type: 'cheese', stock: 60, threshold: 10, unit: 'kg' },
      { name: 'Vegan Cheese', type: 'cheese', stock: 60, threshold: 10, unit: 'kg' },

      // Vegetables: 8 options (50 units each, threshold 10)
      { name: 'Bell Peppers', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Mushrooms', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Olives', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Onions', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Jalapeños', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Corn', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Spinach', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
      { name: 'Tomatoes', type: 'vegetable', stock: 50, threshold: 10, unit: 'units' },
    ];

    const inventoryItems = await InventoryItem.create(inventoryData);
    console.log(`[Blaze Seed] Created ${inventoryItems.length} inventory items`);

    // 4. Seed Customization Options for Builder
    console.log('[Blaze Seed] Seeding custom pizza builder options...');
    const customizationData = [
      // Bases
      { type: 'base', name: 'Classic Thin', description: 'Crisp & light authentic Roman-style hand-tossed dough', priceModifier: 0, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80' },
      { type: 'base', name: 'Thick Pan', description: 'Golden caramelized deep-dish crust with airy pillowy crumb', priceModifier: 500, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80' },
      { type: 'base', name: 'Stuffed Crust', description: 'Folded edge stuffed with gooey melting mozzarella strings', priceModifier: 1000, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=300&q=80' },
      { type: 'base', name: 'Whole Wheat', description: 'Nutty, high-fiber, rustic stone-ground grain crust', priceModifier: 600, image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=300&q=80' },
      { type: 'base', name: 'Gluten Free', description: 'Certified gluten-free crispy cauliflower-blend crust', priceModifier: 1200, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300&q=80' },

      // Sauces
      { type: 'sauce', name: 'Tomato', description: 'Rich slow-simmered San Marzano tomatoes with aromatic herbs', priceModifier: 0, image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=300&q=80' },
      { type: 'sauce', name: 'BBQ', description: 'Smokey mesquite glaze with dark brown sugar sweetness', priceModifier: 300, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80' },
      { type: 'sauce', name: 'Pesto', description: 'Fresh crushed Genovese basil, garlic, pine nuts and olive oil', priceModifier: 500, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&q=80' },
      { type: 'sauce', name: 'Alfredo', description: 'Velvety cream sauce with aged parmesan cheese and black pepper', priceModifier: 400, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&q=80' },
      { type: 'sauce', name: 'Spicy Arrabbiata', description: 'Fiery roasted garlic sauce infused with crushed red chilies', priceModifier: 300, image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&q=80' },

      // Cheeses
      { type: 'cheese', name: 'Mozzarella', description: 'Premium whole milk low-moisture mozzarella for legendary cheese pulls', priceModifier: 0, image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=300&q=80' },
      { type: 'cheese', name: 'Cheddar', description: 'Sharp aged Wisconsin orange cheddar for intense savory depth', priceModifier: 400, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=300&q=80' },
      { type: 'cheese', name: 'Vegan Cheese', description: 'Cultured cashew and coconut oil melting blend, 100% plant based', priceModifier: 600, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=300&q=80' },

      // Vegetables
      { type: 'vegetable', name: 'Bell Peppers', description: 'Crisp green & red bell pepper strips', priceModifier: 200, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&q=80' },
      { type: 'vegetable', name: 'Mushrooms', description: 'Earthy sliced white button mushrooms', priceModifier: 250, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80' },
      { type: 'vegetable', name: 'Olives', description: 'Briny sliced black Kalamata olives', priceModifier: 200, image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=300&q=80' },
      { type: 'vegetable', name: 'Onions', description: 'Thinly sliced sweet red rings', priceModifier: 150, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&q=80' },
      { type: 'vegetable', name: 'Jalapeños', description: 'Zesty pickling spicy jalapeño coins', priceModifier: 250, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=300&q=80' },
      { type: 'vegetable', name: 'Corn', description: 'Sweet golden sunburst sweetcorn niblets', priceModifier: 200, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&q=80' },
      { type: 'vegetable', name: 'Spinach', description: 'Farm fresh baby spinach leaves', priceModifier: 200, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80' },
      { type: 'vegetable', name: 'Tomatoes', description: 'Sun-drenched roasted cherry tomato halves', priceModifier: 200, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
    ];

    const customizationOptions = await CustomizationOption.create(customizationData);
    console.log(`[Blaze Seed] Created ${customizationOptions.length} customization options`);

    console.log('\n=============================================================');
    console.log('🔥 [Blaze Seed] Database successfully seeded with all initial data!');
    console.log('   Admin credentials: admin@blaze.com / Admin@blaze123');
    console.log('   User credentials:  alex@blaze.com  / User@blaze123');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDatabase();
