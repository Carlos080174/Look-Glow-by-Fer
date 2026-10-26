import React from 'react';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';
import { Sparkles, ArrowUpDown, X } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  sortBy: 'destacados' | 'precio-asc' | 'precio-desc';
  onSortChange: (sort: 'destacados' | 'precio-asc' | 'precio-desc') => void;
  totalResults: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalResults,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#24211D] text-white shadow-xs'
                    : 'bg-[#F2ECE4] text-[#5A5043] hover:bg-[#E8DFC0] hover:text-[#24211D]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-[#7A7064]">
            {totalResults} {totalResults === 1 ? 'producto' : 'productos'}
          </span>

          <div className="flex items-center gap-1.5 bg-[#F2ECE4] px-3 py-1.5 rounded-full border border-[#DED3C6]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-[#24211D] focus:outline-none cursor-pointer"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-[#8B5E3C] hover:text-[#24211D] font-semibold underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
