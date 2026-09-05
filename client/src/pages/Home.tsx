import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { PizzaCard } from '../components/ui/PizzaCard';
import { PizzaCardSkeleton } from '../components/ui/Skeleton';
import { MarqueeProductSection } from '../components/ui/MarqueeProductSection';
import { Marquee } from '../components/ui/Marquee';
import { Magnetic } from '../components/ui/Magnetic';
import { TextScramble } from '../components/ui/TextScramble';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { MenuHero } from '../components/home/MenuHero';
import { HeroPizzaShowcase } from '../components/home/HeroPizzaShowcase';
import { Pizza } from '../types';
import api from '../lib/api';

const CATEGORIES = ['All', 'Specials', 'Classic', 'Chicken', 'Veggie'];

export const Home: React.FC = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<Pizza[]>([]);
  const [allPizzas, setAllPizzas] = useState<Pizza[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await api.get('/api/pizza?all=false');
        if (res.data?.pizzas && res.data.pizzas.length > 0) {
          setAllPizzas(res.data.pizzas);
          setFeaturedPizzas(res.data.pizzas.slice(0, 4));
        } else {
          throw new Error('No pizzas returned');
        }
      } catch (err) {
        console.warn('Using fallback pizzas:', err);
        const fallback: Pizza[] = [
          {
            _id: '1',
            name: 'Smoky Truffle Delight',
            description: 'Fire-roasted smoked chicken, wild forest mushrooms, buffalo mozzarella & black truffle oil.',
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
            name: 'Mediterranean Veggie',
            description: 'Earthy button mushrooms, sweet bell peppers, Kalamata olives, sweet corn & baby spinach.',
            basePrice: 5800,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80',
            category: 'Veggie',
            badge: 'New',
            isAvailable: true,
          },
          {
            _id: '5',
            name: 'Quattro Formaggi',
            description: 'Aged parmesan, creamy gorgonzola, fresh ricotta and fior di latte mozzarella.',
            basePrice: 7200,
            image: 'https://images.unsplash.com/photo-1573821663912-569905455b1a?auto=format&fit=crop&w=1000&q=80',
            category: 'Classic',
            badge: 'Popular',
            isAvailable: true,
          },
          {
            _id: '6',
            name: 'Spicy Diavola',
            description: 'Spicy Calabrian salami, fresh chili flakes, San Marzano sauce and melted provolone.',
            basePrice: 6900,
            image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1000&q=80',
            category: 'Specials',
            badge: 'Spicy',
            isAvailable: true,
          },
        ];
        setAllPizzas(fallback);
        setFeaturedPizzas(fallback.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const filteredPizzas =
    selectedCategory === 'All'
      ? allPizzas
      : allPizzas.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] text-[#111111] overflow-hidden">
      {/* 1. HERO SECTION (Editorial Serif, split layout with large food photo) */}
      <section className="relative min-h-[82vh] flex items-center bg-[#faf9f6] border-b border-[#e8e4dd] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-1 text-xs font-medium text-[#faf9f6]">
                <span>🔥 Freshly baked · Wood-fired crusts</span>
              </div>

              {/* Editorial Headline: Playfair Display serif with mid-sentence break */}
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-[#111111]">
                Blazing Hot Pizza,
                <br />
                <span className="italic font-normal">Made for the late-night grind.</span>
              </h1>

              {/* Subtext */}
              <p className="max-w-xl text-base sm:text-lg text-[#666666] leading-relaxed font-light">
                Wood-fired artisanal pizzas baked with patience and passion. Hand-stretched dough, San Marzano tomatoes, and whole-milk mozzarella delivered fresh.
              </p>

              {/* CTAs with Magnetic interaction and TextScramble */}
              <div className="pt-4 flex flex-wrap items-center gap-5">
                <Magnetic strength={0.35}>
                  <Link
                    to="/menu"
                    className="inline-flex items-center justify-center rounded-full bg-[#111111] hover:bg-[#2d5a27] px-8 py-3.5 text-xs font-medium text-white transition-colors shadow-sm"
                  >
                    <TextScramble text="Order Now" />
                  </Link>
                </Magnetic>

                <Magnetic strength={0.2}>
                  <button
                    type="button"
                    onClick={scrollToMenu}
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#111111] hover:opacity-70 transition-opacity cursor-pointer px-4 py-3 rounded-full border border-transparent hover:border-[#e8e4dd]"
                  >
                    <span>View Menu</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </Magnetic>
              </div>
            </div>

            {/* Right Food Photo with Dynamic Showcase & Scroll Parallax */}
            <div className="lg:col-span-5 relative flex justify-center">
              <HeroPizzaShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STATS & HERITAGE (Animated Number Counters) */}
      <section className="border-b border-[#e8e4dd] bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-1 text-center sm:text-left border-r border-[#e8e4dd]/70 pr-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111]">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#666666]">
                Artisanal Sourdough
              </p>
            </div>
            <div className="space-y-1 text-center sm:text-left sm:border-r border-[#e8e4dd]/70 pr-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111]">
                <AnimatedCounter value={48} suffix="hr" />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#666666]">
                Cold Fermentation
              </p>
            </div>
            <div className="space-y-1 text-center sm:text-left border-r border-[#e8e4dd]/70 pr-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111]">
                <AnimatedCounter value={900} suffix="°" />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#666666]">
                Wood-Fired Heat
              </p>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111]">
                <AnimatedCounter value={20000} suffix="+" />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#666666]">
                Late-Night Crusts Served
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE PRODUCT MARQUEE SECTION #1 (Oriente's Key Signature Feature) */}
      {featuredPizzas.length > 0 && (
        <MarqueeProductSection
          pizza={featuredPizzas[0]}
          tagline="Chef's Signature Selection"
        />
      )}

      {/* 3. OUR MENU TEXT-CLIP HERO SECTION */}
      <MenuHero />

      {/* 4. MENU / PRODUCT GRID */}
      <section id="menu-section" className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-serif text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight">
            Our Pizzas
          </h2>
          <p className="text-sm text-[#666666]">
            Freshly baked · Wood-fired crusts · Real ingredients
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-[#faf9f6]'
                      : 'bg-transparent text-[#666666] border border-[#e8e4dd] hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column / 4-Column Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <PizzaCardSkeleton />
            <PizzaCardSkeleton />
            <PizzaCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
        {/* View Full Menu Link */}
        <div className="mt-14 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-[#111111] hover:opacity-60 transition-opacity border-b border-[#111111] pb-1"
          >
            <span>Explore All Pizzas & Custom Options</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
          </Link>
        </div>
      </section>

      {/* 4. SIGNATURE PRODUCT MARQUEE SECTION #2 */}
      {featuredPizzas.length > 1 && (
        <MarqueeProductSection
          pizza={featuredPizzas[1]}
          tagline="The Late-Night Crowd Favorite"
          reverseMarquee={true}
        />
      )}

      {/* 5. HOW IT WORKS / BRAND STORY STRIP */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full border-t border-[#e8e4dd]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Item 1 */}
          <div className="space-y-3">
            <span className="text-xs font-medium text-[#888888]">01 /</span>
            <h3 className="font-serif text-2xl text-[#111111] font-normal">
              Choose your crust
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Hand-stretched Roman style or natural sourdough crust, slow-fermented for 48 hours for crisp, airy perfection.
            </p>
          </div>

          {/* Item 2 */}
          <div className="space-y-3">
            <span className="text-xs font-medium text-[#888888]">02 /</span>
            <h3 className="font-serif text-2xl text-[#111111] font-normal">
              Fresh toppings only
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              San Marzano tomato marinara, whole-milk fior di latte mozzarella, and flame-roasted artisan proteins.
            </p>
          </div>

          {/* Item 3 */}
          <div className="space-y-3">
            <span className="text-xs font-medium text-[#888888]">03 /</span>
            <h3 className="font-serif text-2xl text-[#111111] font-normal">
              At your door in 30
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Straight from our wood-fired oven into insulated carriers. Delivered steaming hot to your campus room or office.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CATERING / EXPERIENCE SECTION (Full-bleed #f0ece4 background) */}
      <section className="bg-[#f0ece4] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#e8e4dd]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h2 className="font-serif text-3xl sm:text-5xl text-[#111111] font-normal tracking-tight leading-tight">
                Craft your perfect
                <br />
                <span className="italic">pizza experience.</span>
              </h2>
            </div>
            <div className="md:col-span-5 space-y-4">
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Whether you're hosting a late-night study session, campus event, or simply craving something bespoke, our 4-step custom crust builder lets you compose every layer.
              </p>
              <div>
                <Link
                  to="/build"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#111111] hover:text-[#2d5a27] transition-colors border-b border-[#111111] pb-0.5"
                >
                  <span>Build Your Own →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAST FRESH MARQUEE STRIP (Black #111111 with cream text) */}
      <Marquee
        items={[
          'WOOD-FIRED CRUSTS',
          'REAL MOZZARELLA',
          'FAST CAMPUS DELIVERY',
          'OPEN LATE TILL 2 AM',
          'HAND-STRETCHED DOUGH',
          'SAN MARZANO SAUCE',
        ]}
        speed="normal"
        direction="left"
        gap="lg"
      />
    </div>
  );
};

export default Home;
