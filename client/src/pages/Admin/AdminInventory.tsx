import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Boxes, AlertTriangle, BellRing, RefreshCw, Filter } from 'lucide-react';
import { InventoryTable } from '../../components/ui/InventoryTable';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { InventoryItem } from '../../types';
import api from '../../lib/api';

const typeTabs = [
  { label: 'All Items', value: 'all' },
  { label: 'Bases (Crusts)', value: 'base' },
  { label: 'Sauces', value: 'sauce' },
  { label: 'Cheeses', value: 'cheese' },
  { label: 'Vegetables', value: 'vegetable' },
];

export const AdminInventory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lowOnlyParam = searchParams.get('lowOnly') === 'true';

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [lowOnly, setLowOnly] = useState(lowOnlyParam);
  const [isAlerting, setIsAlerting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (selectedType !== 'all') params.type = selectedType;
      if (lowOnly) params.lowOnly = 'true';

      const res = await api.get('/api/inventory', { params });
      if (res.data?.items) {
        setItems(res.data.items);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load inventory stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedType, lowOnly]);

  const handleUpdateItem = async (id: string, updates: { stock?: number; threshold?: number }) => {
    try {
      const res = await api.put(`/api/inventory/${id}`, updates);
      if (res.data?.success) {
        toast.success(`Inventory for ${res.data.item.name} updated!`);
        setItems((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...res.data.item } : item))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
      throw err;
    }
  };

  const handleTriggerAlert = async () => {
    try {
      setIsAlerting(true);
      const res = await api.post('/api/inventory/trigger-alert');
      if (res.data?.success) {
        toast.success(res.data.message);
      }
    } catch (err: any) {
      toast.error('Failed to trigger alert');
    } finally {
      setIsAlerting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium tracking-widest text-[#2d5a27] uppercase">
            Stock Control
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111111] mt-1">
            Ingredient Inventory
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Manage thresholds, monitor real-time stock levels, and automate daily reorder notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTriggerAlert}
            disabled={isAlerting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium tracking-wide transition-colors cursor-pointer shadow-xs"
            title="Execute node-cron stock check now and dispatch email alert"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{isAlerting ? 'Alerting...' : 'Trigger Stock Alert Email'}</span>
          </button>

          <button
            type="button"
            onClick={fetchInventory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#e8e4dd] bg-white text-xs font-medium tracking-wide text-[#111111] hover:border-[#111111] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {typeTabs.map((tab) => {
            const isActive = selectedType === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedType(tab.value)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#e8e4dd] text-[#666666] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Low Stock Toggle Button */}
        <button
          type="button"
          onClick={() => setLowOnly(!lowOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide border transition-colors cursor-pointer ${
            lowOnly
              ? 'bg-red-500 border-red-500 text-white shadow-xs'
              : 'bg-white border-[#e8e4dd] text-[#666666] hover:text-[#111111]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Stock Only</span>
        </button>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="p-8 space-y-4 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      ) : (
        <InventoryTable
          items={items}
          onUpdateItem={handleUpdateItem}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default AdminInventory;
