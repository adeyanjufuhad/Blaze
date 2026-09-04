import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Upload, Eye, EyeOff, Pizza as PizzaIcon, Layers } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { Pizza, CustomizationOption } from '../../types';
import api from '../../lib/api';

export const AdminMenu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pizzas' | 'customizations'>('pizzas');

  // Pizzas State
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [showAddPizzaModal, setShowAddPizzaModal] = useState(false);
  const [newPizza, setNewPizza] = useState({
    name: '',
    description: '',
    basePrice: '',
    category: 'Classic',
    badge: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmittingPizza, setIsSubmittingPizza] = useState(false);

  // Customizations State
  const [customizationTab, setCustomizationTab] = useState<'base' | 'sauce' | 'cheese' | 'vegetable'>('base');
  const [customizations, setCustomizations] = useState<CustomizationOption[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(true);
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [newOption, setNewOption] = useState({
    name: '',
    description: '',
    priceModifier: '0',
    image: '',
    initialStock: '100',
  });
  const [isSubmittingOption, setIsSubmittingOption] = useState(false);

  // Fetch Pizzas (including unavailable items for admin)
  const fetchPizzas = async () => {
    try {
      setLoadingPizzas(true);
      const res = await api.get('/api/pizza?all=true');
      if (res.data?.pizzas) {
        setPizzas(res.data.pizzas);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch pizzas');
    } finally {
      setLoadingPizzas(false);
    }
  };

  // Fetch Customization Options
  const fetchCustomizations = async () => {
    try {
      setLoadingCustom(true);
      const res = await api.get('/api/customization');
      if (res.data?.options) {
        setCustomizations(res.data.options);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch customization options');
    } finally {
      setLoadingCustom(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
    fetchCustomizations();
  }, []);

  // Toggle pizza availability
  const togglePizzaAvailability = async (pizza: Pizza) => {
    try {
      const res = await api.put(`/api/pizza/${pizza._id}`, {
        isAvailable: !pizza.isAvailable,
      });
      if (res.data?.success) {
        toast.success(`Pizza ${pizza.name} availability updated`);
        setPizzas((prev) =>
          prev.map((p) => (p._id === pizza._id ? { ...p, isAvailable: !p.isAvailable } : p))
        );
      }
    } catch (err: any) {
      toast.error('Failed to toggle availability');
    }
  };

  // Add new pizza
  const handleCreatePizza = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPizza(true);

    try {
      const formData = new FormData();
      formData.append('name', newPizza.name);
      formData.append('description', newPizza.description);
      formData.append('basePrice', newPizza.basePrice);
      formData.append('category', newPizza.category);
      if (newPizza.badge) formData.append('badge', newPizza.badge);
      if (newPizza.image) formData.append('image', newPizza.image);
      if (imageFile) formData.append('imageFile', imageFile);

      const res = await api.post('/api/pizza', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        toast.success(`Pizza ${newPizza.name} created!`);
        setPizzas([res.data.pizza, ...pizzas]);
        setShowAddPizzaModal(false);
        setNewPizza({
          name: '',
          description: '',
          basePrice: '',
          category: 'Classic',
          badge: '',
          image: '',
        });
        setImageFile(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create pizza');
    } finally {
      setIsSubmittingPizza(false);
    }
  };

  // Add new customization option
  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOption(true);

    try {
      const res = await api.post('/api/customization', {
        type: customizationTab,
        name: newOption.name,
        description: newOption.description,
        priceModifier: Number(newOption.priceModifier) || 0,
        image: newOption.image,
        initialStock: Number(newOption.initialStock) || 50,
      });

      if (res.data?.success) {
        toast.success(`Added ${newOption.name} to ${customizationTab}`);
        setCustomizations([...customizations, res.data.option]);
        setShowAddOptionModal(false);
        setNewOption({
          name: '',
          description: '',
          priceModifier: '0',
          image: '',
          initialStock: '100',
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add option');
    } finally {
      setIsSubmittingOption(false);
    }
  };

  // Delete customization option
  const handleDeleteOption = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this customization option?')) return;

    try {
      await api.delete(`/api/customization/${id}`);
      toast.success('Option removed');
      setCustomizations((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error('Failed to remove option');
    }
  };

  const filteredCustomizations = customizations.filter((c) => c.type === customizationTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium tracking-widest text-[#2d5a27] uppercase">
            Catalog & Customizations
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111111] mt-1">
            Menu Manager
          </h1>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-white border border-[#e8e4dd] p-1 rounded-full self-start sm:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pizzas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer ${
              activeTab === 'pizzas'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            <PizzaIcon className="w-3.5 h-3.5" />
            <span>Pizzas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customizations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer ${
              activeTab === 'customizations'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Custom Builder Options</span>
          </button>
        </div>
      </div>

      {/* 1. PIZZAS SECTION */}
      {activeTab === 'pizzas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-normal tracking-tight text-[#111111]">
              Signature Menu Items ({pizzas.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowAddPizzaModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pizza</span>
            </button>
          </div>

          {loadingPizzas ? (
            <div className="p-8 space-y-4 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pizzas.map((pizza) => (
                <div
                  key={pizza._id}
                  className={`rounded-2xl border bg-white shadow-xs overflow-hidden p-4 space-y-4 transition-all ${
                    pizza.isAvailable ? 'border-[#e8e4dd]' : 'border-red-200 opacity-60'
                  }`}
                >
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#faf9f6]">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-full object-cover"
                    />
                    {pizza.badge && (
                      <div className="absolute top-2.5 left-2.5">
                        <StatusBadge status={pizza.badge} showDot={false} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-normal text-[#111111] tracking-tight">
                        {pizza.name}
                      </h4>
                      <span className="font-medium text-sm text-[#111111]">
                        ₦{pizza.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#666666] mt-1 line-clamp-2">
                      {pizza.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#e8e4dd] text-xs">
                    <span className="text-[#666666] text-xs">
                      {pizza.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => togglePizzaAvailability(pizza)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        pizza.isAvailable
                          ? 'bg-[#2d5a27]/10 border border-[#2d5a27]/30 text-[#2d5a27] hover:bg-[#2d5a27]/20'
                          : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {pizza.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{pizza.isAvailable ? 'Available' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. CUSTOM BUILDER OPTIONS MANAGER */}
      {activeTab === 'customizations' && (
        <div className="space-y-6">
          {/* Sub-tabs: Bases, Sauces, Cheeses, Vegetables */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(['base', 'sauce', 'cheese', 'vegetable'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCustomizationTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                    customizationTab === tab
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-white border border-[#e8e4dd] text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  {tab === 'base' ? 'Bases (Crusts)' : `${tab}s`}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddOptionModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add {customizationTab} Option</span>
            </button>
          </div>

          {/* Grid of Options for Active Tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCustomizations.map((opt) => (
              <div
                key={opt._id}
                className="p-4 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-[#111111] tracking-tight">
                      {opt.name}
                    </h4>
                    <span className="font-medium text-xs text-[#2d5a27]">
                      {opt.priceModifier > 0 ? `+₦${opt.priceModifier}` : 'Free'}
                    </span>
                  </div>
                  {opt.description && (
                    <p className="text-xs text-[#666666] mt-1 line-clamp-2">
                      {opt.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#e8e4dd]">
                  <span className="text-[10px] text-[#666666] uppercase font-medium">
                    {opt.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(opt._id)}
                    className="p-1.5 rounded-lg text-[#888888] hover:text-red-600 hover:bg-[#faf9f6] transition-colors cursor-pointer"
                    title="Delete option"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Pizza Modal */}
      {showAddPizzaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-lg w-full rounded-3xl border border-[#e8e4dd] bg-white p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e4dd]">
              <h3 className="font-serif text-lg font-normal tracking-tight text-[#111111]">
                Add Signature Pizza
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPizzaModal(false)}
                className="text-[#888888] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePizza} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">
                  Pizza Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPizza.name}
                  onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
                  placeholder="e.g. Smoky Truffle Delight"
                  className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newPizza.description}
                  onChange={(e) => setNewPizza({ ...newPizza, description: e.target.value })}
                  placeholder="Ingredients and flavor notes..."
                  className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1">
                    Base Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newPizza.basePrice}
                    onChange={(e) => setNewPizza({ ...newPizza, basePrice: e.target.value })}
                    placeholder="6500"
                    className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1">
                    Category
                  </label>
                  <select
                    value={newPizza.category}
                    onChange={(e) => setNewPizza({ ...newPizza, category: e.target.value })}
                    className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none"
                  >
                    <option value="Classic">Classic</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Veggie">Veggie</option>
                    <option value="Specials">Specials</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1">
                    Badge Pill
                  </label>
                  <select
                    value={newPizza.badge}
                    onChange={(e) => setNewPizza({ ...newPizza, badge: e.target.value })}
                    className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none"
                  >
                    <option value="">No Badge</option>
                    <option value="Popular">Popular</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Chef's Pick">Chef's Pick</option>
                    <option value="New">New</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1">
                    Image URL (or upload file)
                  </label>
                  <input
                    type="url"
                    value={newPizza.image}
                    onChange={(e) => setNewPizza({ ...newPizza, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">
                  Upload Image File (Cloudinary)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[#666666] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border file:border-[#e8e4dd] file:text-xs file:font-medium file:bg-white file:text-[#111111] hover:file:bg-[#faf9f6] cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPizzaModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#e8e4dd] text-xs font-medium text-[#666666] hover:text-[#111111] bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPizza}
                  className="flex-1 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
                >
                  {isSubmittingPizza ? 'Saving...' : 'Create Pizza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customization Option Modal */}
      {showAddOptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl border border-[#e8e4dd] bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e4dd]">
              <h3 className="font-serif text-base font-normal tracking-tight text-[#111111]">
                Add {customizationTab} Option
              </h3>
              <button
                type="button"
                onClick={() => setShowAddOptionModal(false)}
                className="text-[#888888] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOption} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#666666] mb-1">
                  Option Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOption.name}
                  onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                  placeholder="e.g. Sourdough Thin"
                  className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3 py-2 text-[#111111] placeholder-[#888888] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#666666] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newOption.description}
                  onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                  placeholder="Brief flavor or texture note"
                  className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3 py-2 text-[#111111] placeholder-[#888888] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#666666] mb-1">
                    Price Modifier (₦)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newOption.priceModifier}
                    onChange={(e) => setNewOption({ ...newOption, priceModifier: e.target.value })}
                    className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3 py-2 text-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#666666] mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newOption.initialStock}
                    onChange={(e) => setNewOption({ ...newOption, initialStock: e.target.value })}
                    className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl px-3 py-2 text-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOptionModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#e8e4dd] font-medium text-[#666666] hover:text-[#111111] bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOption}
                  className="flex-1 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white font-medium shadow-xs transition-all cursor-pointer"
                >
                  {isSubmittingOption ? 'Saving...' : 'Add Option'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
