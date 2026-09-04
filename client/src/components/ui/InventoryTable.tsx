import React, { useState } from 'react';
import { Check, Edit2, X, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../../types';
import { StatusBadge } from './StatusBadge';

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdateItem: (id: string, updates: { stock?: number; threshold?: number }) => Promise<void>;
  isLoading?: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onUpdateItem,
  isLoading = false,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item._id);
    setEditStock(item.stock);
    setEditThreshold(item.threshold);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      setSavingId(id);
      await onUpdateItem(id, {
        stock: Number(editStock),
        threshold: Number(editThreshold),
      });
      setEditingId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#f0e6d9] bg-white shadow-blaze-card">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#f0e6d9] bg-[#fffaf5] text-[11px] font-black uppercase tracking-wider text-[#8a6a50]">
            <th className="py-4 px-5">Item Name</th>
            <th className="py-4 px-5">Type</th>
            <th className="py-4 px-5">Current Stock</th>
            <th className="py-4 px-5">Threshold</th>
            <th className="py-4 px-5">Unit</th>
            <th className="py-4 px-5">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0e6d9] font-medium">
          {items.map((item) => {
            const isEditing = editingId === item._id;
            const isSaving = savingId === item._id;
            const isLow = item.stock <= item.threshold;
            const isCritical = item.stock <= Math.floor(item.threshold / 2);

            let rowBg = 'hover:bg-[#fffaf5]';
            if (isCritical) {
              rowBg = 'bg-red-50/80 hover:bg-red-100/60';
            } else if (isLow) {
              rowBg = 'bg-amber-50/70 hover:bg-amber-100/60';
            }

            return (
              <tr key={item._id} className={`transition-colors ${rowBg}`}>
                {/* Name */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    {isCritical && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    <span className="font-bold text-[#1a0a00] uppercase tracking-tight">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-5 text-[#8a6a50] capitalize">
                  <span className="px-2 py-0.5 rounded bg-[#fffaf5] border border-[#f0e6d9] text-xs text-[#1a0a00]">
                    {item.type}
                  </span>
                </td>

                {/* Current Stock */}
                <td className="py-4 px-5">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-[#fffaf5] border border-[#ff4500] rounded text-[#1a0a00] font-bold text-sm focus:outline-none"
                      min={0}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="group flex items-center gap-1.5 font-bold hover:text-[#ff4500] transition-colors"
                      title="Click to inline edit"
                    >
                      <span
                        className={
                          isCritical
                            ? 'text-red-500 font-extrabold text-base'
                            : isLow
                            ? 'text-amber-600 font-extrabold text-base'
                            : 'text-[#1a0a00]'
                        }
                      >
                        {item.stock}
                      </span>
                      <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#8a6a50] transition-opacity" />
                    </button>
                  )}
                </td>

                {/* Threshold */}
                <td className="py-4 px-5">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editThreshold}
                      onChange={(e) => setEditThreshold(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-[#fffaf5] border border-[#f0e6d9] rounded text-[#1a0a00] text-sm focus:outline-none"
                      min={0}
                    />
                  ) : (
                    <span className="text-[#8a6a50]">{item.threshold}</span>
                  )}
                </td>

                {/* Unit */}
                <td className="py-4 px-5 text-[#8a6a50] text-xs">{item.unit}</td>

                {/* Status Badge */}
                <td className="py-4 px-5">
                  <StatusBadge
                    status={isCritical ? 'Critical' : isLow ? 'Low' : 'OK'}
                  />
                </td>

                {/* Actions */}
                <td className="py-4 px-5 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => saveEdit(item._id)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        title="Save changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg bg-[#fffaf5] border border-[#f0e6d9] text-[#8a6a50] hover:text-[#1a0a00] transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="px-3 py-1 rounded-lg bg-[#fffaf5] border border-[#f0e6d9] hover:border-[#ff4500] text-[#1a0a00] hover:text-[#ff4500] text-xs font-bold transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
