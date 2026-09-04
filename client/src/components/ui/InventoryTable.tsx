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
    <div className="w-full overflow-x-auto rounded-2xl border border-[#e8e4dd] bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#e8e4dd] bg-[#faf9f6] text-[11px] font-medium uppercase tracking-wider text-[#666666]">
            <th className="py-4 px-5">Item Name</th>
            <th className="py-4 px-5">Type</th>
            <th className="py-4 px-5">Current Stock</th>
            <th className="py-4 px-5">Threshold</th>
            <th className="py-4 px-5">Unit</th>
            <th className="py-4 px-5">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8e4dd] font-medium">
          {items.map((item) => {
            const isEditing = editingId === item._id;
            const isSaving = savingId === item._id;
            const isLow = item.stock <= item.threshold;
            const isCritical = item.stock <= Math.floor(item.threshold / 2);

            let rowBg = 'hover:bg-[#faf9f6]';
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
                    <span className="font-semibold text-[#111111] tracking-tight">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-5 text-[#666666] capitalize">
                  <span className="px-2 py-0.5 rounded-full bg-[#faf9f6] border border-[#e8e4dd] text-xs text-[#111111]">
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
                      className="w-24 px-2 py-1 bg-[#faf9f6] border border-[#2d5a27] rounded text-[#111111] font-semibold text-sm focus:outline-none"
                      min={0}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="group flex items-center gap-1.5 font-semibold hover:text-[#2d5a27] transition-colors"
                      title="Click to inline edit"
                    >
                      <span
                        className={
                          isCritical
                            ? 'text-red-500 font-bold text-base'
                            : isLow
                            ? 'text-amber-600 font-bold text-base'
                            : 'text-[#111111]'
                        }
                      >
                        {item.stock}
                      </span>
                      <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#666666] transition-opacity" />
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
                      className="w-20 px-2 py-1 bg-[#faf9f6] border border-[#e8e4dd] rounded text-[#111111] text-sm focus:outline-none"
                      min={0}
                    />
                  ) : (
                    <span className="text-[#666666]">{item.threshold}</span>
                  )}
                </td>

                {/* Unit */}
                <td className="py-4 px-5 text-[#666666] text-xs">{item.unit}</td>

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
                        className="p-1.5 rounded-lg bg-[#2d5a27] hover:bg-[#23471f] text-white transition-colors"
                        title="Save changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg bg-[#faf9f6] border border-[#e8e4dd] text-[#666666] hover:text-[#111111] transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="px-3 py-1 rounded-full bg-[#faf9f6] border border-[#e8e4dd] hover:border-[#111111] text-[#111111] hover:text-[#2d5a27] text-xs font-medium transition-colors"
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
