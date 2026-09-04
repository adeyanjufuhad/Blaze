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
    <div className="min-h-screen bg-[#fffaf5] text-[#1a0a00] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
          Wood-Fired & Handcrafted
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#1a0a00] mt-1 mb-4">
          Our Menu
        </h1>
        <p className="text-sm sm:text-base text-[#8a6a50]">
          Explore our range of sizzling artisanal pizzas made with slow-fermented Roman crusts and signature toppings.
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a50]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza by name..."
            className="w-full bg-white border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50] focus:outline-none transition-colors shadow-xs"
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
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#ff4500] text-white shadow-md shadow-[#ff4500]/25'
                  : 'bg-white border border-[#f0e6d9] text-[#8a6a50] hover:text-[#1a0a00] hover:border-[#ff4500]/40 shadow-xs'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Pizza Grid or States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
