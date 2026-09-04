import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pizza } from '../types';
import { PizzaCard } from '../components/ui/PizzaCard';
import { PizzaCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Pizza as PizzaIcon, Search } from 'lucide-react';
import api from '../lib/api';

const categories = ['All', 'Classic', 'Custom', 'Chicken', 'Veggie', 'Specials'] as const;

export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = { all: 'false' };
        if (currentCategory !== 'All') {
          params.category = currentCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await api.get('/api/pizza', { params });
        if (res.data?.pizzas) {
          setPizzas(res.data.pizzas);
        }
      } catch (err) {
        console.error('Error fetching menu pizzas:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPizzas();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [currentCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-medium tracking-widest text-[#666666] uppercase">
          Wood-Fired & Handcrafted
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#111111] mt-1 mb-4">
          Our Menu
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
          Explore our range of artisanal pizzas made with slow-fermented crusts, San Marzano tomatoes, and whole-milk mozzarella.
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza by name..."
            className="w-full bg-white border border-[#e8e4dd] focus:border-[#111111] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 scrollbar-none">
        {categories.map((category) => {
          const isActive = currentCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-[#faf9f6]'
                  : 'bg-transparent border border-[#e8e4dd] text-[#666666] hover:border-[#111111] hover:text-[#111111]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Pizza Grid or States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PizzaCardSkeleton key={i} />
          ))}
        </div>
      ) : pizzas.length === 0 ? (
        <EmptyState
          icon={PizzaIcon}
          title={`No pizzas found in "${currentCategory}"`}
          description="We couldn't find any available pizzas matching this criteria. Try selecting another category or clear your search."
          actionText="View All Pizzas"
          onAction={() => {
            setSearchQuery('');
            handleCategoryChange('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
