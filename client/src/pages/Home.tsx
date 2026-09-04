import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, Clock, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { Marquee } from '../components/ui/Marquee';
import { PizzaCard } from '../components/ui/PizzaCard';
import { PizzaCardSkeleton } from '../components/ui/Skeleton';
import { Pizza } from '../types';
import api from '../lib/api';

export const Home: React.FC = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/pizza?all=false');
        if (res.data?.pizzas) {
          setFeaturedPizzas(res.data.pizzas.slice(0, 4));
        }
      } catch (err) {
        console.warn('Using fallback featured pizzas:', err);
        setFeaturedPizzas([
          {
            _id: '1',
            name: 'The Blaze Special',
            description: 'Fire-roasted smoked chicken, double spicy pepperoni, scotch bonnet marinara & hot honey drizzle.',
            basePrice: 7500,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
            category: 'Specials',
            badge: "Chef's Pick",
            isAvailable: true,
          },
          {
            _id: '2',
            name: 'Loaded Pepperoni',
            description: 'Double stacked artisanal beef pepperoni curls, whole-milk mozzarella & San Marzano tomato sauce.',
            basePrice: 6500,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80',
            category: 'Classic',
            badge: 'Popular',
            isAvailable: true,
          },
          {
            _id: '3',
            name: 'BBQ Chicken Supreme',
            description: 'Flame-grilled shredded barbecue chicken, smoked cheddar, red onions & tangy mesquite sauce.',
            basePrice: 6800,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
            category: 'Chicken',
            badge: 'Spicy',
            isAvailable: true,
          },
          {
            _id: '4',
            name: 'Veggie Feast',
            description: 'Earthy button mushrooms, sweet crisp bell peppers, Kalamata olives, sweet corn & baby spinach.',
            basePrice: 5800,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80',
            category: 'Veggie',
            badge: 'New',
            isAvailable: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fffaf5] text-[#1a0a00] overflow-hidden">
      {/* 1. HERO SECTION (Warm Light Theme with Radial Gradient) */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#f0e6d9] bg-[#fffaf5]">
        {/* Subtle warm radial gradient behind hero text */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #fff0e6 0%, #fffaf5 70%)',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Pill badge: warm border + orange-red text on light background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#f0e6d9] bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#ff4500] shadow-[0_2px_12px_rgba(255,69,0,0.1)] mb-8"
          >
            <Flame className="w-4 h-4 fill-[#ff4500]" />
            <span>CAMPUS FRESH · WOOD-FIRED ARTISANAL CRUSTS</span>
          </motion.div>

          {/* Large Bold Oversized Typography: "PIZZA THAT" in #1a0a00, "HITS DIFFERENT" in #ff4500 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-6 select-none"
            style={{ letterSpacing: '-0.06em' }}
          >
            <span className="text-[#1a0a00]">PIZZA THAT</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4500] via-[#ff6b35] to-[#ff4500]">
              HITS DIFFERENT.
            </span>
          </motion.h1>

          {/* Subtext in warm brown-gray #8a6a50 */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-xl text-lg sm:text-xl text-[#8a6a50] font-medium leading-relaxed mb-10"
          >
            Built for the bold. Delivered to your door. Hand-tossed dough, bubbling whole-milk mozzarella, and signature fire seasonings.
          </motion.p>

          {/* Two CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#ff4500] px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#ff4500]/30 hover:bg-[#e03800] hover:shadow-[#ff4500]/50 active:scale-95 transition-all cursor-pointer"
            >
              <span>Order Now</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <Link
              to="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-[#1a0a00] bg-white px-8 py-4 text-sm font-black uppercase tracking-wider text-[#1a0a00] hover:bg-[#fff5f0] hover:border-[#ff4500] active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>Build Your Own</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. HORIZONTAL MARQUEE TICKER (Orange-Red Strip #ff4500 with White Text) */}
      <Marquee
        items={[
          'BLAZING HOT',
          'FRESH TO YOUR DOOR',
          'ORDER NOW',
          'CUSTOM BUILT',
          'DELIVERED FAST',
          'BLAZE',
        ]}
        speed="fast"
        direction="left"
        gap="lg"
      />

      {/* 3. FEATURED PIZZAS GRID (White cards with warm borders) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
              Signature Selection
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
              Featured Pizzas
            </h2>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff4500] hover:text-[#e03800] transition-colors"
          >
            <span>Explore Full Menu</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PizzaCardSkeleton />
            <PizzaCardSkeleton />
            <PizzaCardSkeleton />
            <PizzaCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </section>

      {/* 4. CUSTOM PIZZA BUILDER CTA SECTION (Deep Warm Black #1a0a00 Contrast Section) */}
      <section className="relative mx-4 sm:mx-8 lg:mx-auto max-w-7xl my-8 rounded-3xl overflow-hidden border border-[#2d1a10] bg-[#1a0a00] p-8 sm:p-14 lg:p-20 shadow-2xl text-white">
        {/* Background Warm Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff4500]/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#ff4500]/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#ff6b35]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Kitchen, Your Rules</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Build Your Dream <br />
              <span className="text-[#ff4500]">Artisanal Pizza</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl">
              From hand-tossed Roman crusts to smoky mesquite glazes and flame-roasted toppings. Craft your own masterpiece in 4 simple steps and watch it come alive in real-time.
            </p>

            <div className="pt-2">
              <Link
                to="/build"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#ff4500] px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#ff4500]/30 hover:bg-[#e03800] hover:shadow-[#ff4500]/50 transition-all active:scale-95"
              >
                <span>Build Your Pizza</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full border-2 border-dashed border-[#ff4500]/40 p-4 animate-spin-slow">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                alt="Custom Pizza Builder"
                className="w-full h-full object-cover rounded-full shadow-2xl shadow-black/80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (White cards with warm border #f0e6d9) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
            Fast & Loud
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
            How Blaze Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#f0e6d9] bg-white shadow-sm hover:border-[#ff4500]/40 hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] border border-[#f0e6d9] flex items-center justify-center text-[#ff4500] mb-6 shadow-xs">
              <Flame className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-black tracking-widest text-[#ff4500] uppercase mb-2">
              Step 01
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00] mb-3">
              Choose or Build
            </h3>
            <p className="text-sm text-[#8a6a50] leading-relaxed">
              Pick from our legendary chef-curated signature pizzas or customize your own crust, sauce, cheese & veggies.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#f0e6d9] bg-white shadow-sm hover:border-[#ff4500]/40 hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] border border-[#f0e6d9] flex items-center justify-center text-[#ff4500] mb-6 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-black tracking-widest text-[#ff4500] uppercase mb-2">
              Step 02
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00] mb-3">
              Instant Payment
            </h3>
            <p className="text-sm text-[#8a6a50] leading-relaxed">
              Pay smoothly with Razorpay. Secure test card verification with automated stock checking and instant confirmation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#f0e6d9] bg-white shadow-sm hover:border-[#ff4500]/40 hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] border border-[#f0e6d9] flex items-center justify-center text-[#ff4500] mb-6 shadow-xs">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-black tracking-widest text-[#ff4500] uppercase mb-2">
              Step 03
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00] mb-3">
              Real-Time Tracking
            </h3>
            <p className="text-sm text-[#8a6a50] leading-relaxed">
              Follow your order live via WebSockets as it moves from oven baking to packaging and arrival at your door.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECOND MARQUEE (Contrast Dark Strip #1a0a00 with #fffaf5 Text) */}
      <Marquee
        items={[
          'CHEF SPECIALS',
          'DOUBLE SMOKED CHICKEN',
          'SAN MARZANO MARINARA',
          'SPICY SCOTCH BONNET',
          'TRIPLE CHEESE MELT',
          'BLAZE PIZZA',
        ]}
        speed="slow"
        direction="right"
        gap="md"
        className="bg-[#1a0a00] border-y border-[#2d1808]"
      />
    </div>
  );
};

export default Home;
