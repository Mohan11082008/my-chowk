import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { JobFilterState } from '../types';
import { JOB_CATEGORIES, NAGPUR_LOCALITIES } from '../services/storage';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: JobFilterState;
  onUpdateFilters: (newFilters: JobFilterState) => void;
  onReset: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-orange-400" />
            <h3 className="font-bold text-base">Filter Nagpur Jobs</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Locality in Nagpur */}
          <div>
            <label className="block font-bold text-slate-900 text-xs mb-2">
              Locality (नागपुर इलाका)
            </label>
            <select
              value={filters.locality}
              onChange={(e) => onUpdateFilters({ ...filters, locality: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-orange-500"
            >
              {NAGPUR_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-slate-900 text-xs mb-2">
              Job Category (श्रेणी)
            </label>
            <select
              value={filters.category}
              onChange={(e) => onUpdateFilters({ ...filters, category: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-orange-500"
            >
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.labelHi})
                </option>
              ))}
            </select>
          </div>

          {/* Work Type */}
          <div>
            <label className="block font-bold text-slate-900 text-xs mb-2">Work Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'full_time', label: 'Full-time' },
                { id: 'part_time', label: 'Part-time' },
                { id: 'daily_wage', label: 'Daily Wage' },
              ].map((wt) => (
                <button
                  key={wt.id}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, workType: wt.id })}
                  className={`p-2 rounded-xl text-center font-medium transition ${
                    filters.workType === wt.id
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {wt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Salary Filter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-900 text-xs">Min Expected Pay</label>
              <span className="font-bold text-orange-600">
                {filters.minSalary === 0 ? 'Any' : `₹${filters.minSalary.toLocaleString('en-IN')}+`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={1000}
              value={filters.minSalary}
              onChange={(e) => onUpdateFilters({ ...filters, minSalary: Number(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>Any</span>
              <span>₹10,000</span>
              <span>₹20,000+</span>
            </div>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block font-bold text-slate-900 text-xs mb-2">
              Experience Requirement (अनुभव)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: -1, label: 'Any Experience' },
                { val: 0, label: 'Fresher OK (0 yrs)' },
                { val: 1, label: 'Up to 1 Year' },
                { val: 2, label: 'Up to 2 Years' },
              ].map((exp) => (
                <button
                  key={exp.val}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, maxExperience: exp.val })}
                  className={`p-2 rounded-xl text-center font-medium transition ${
                    filters.maxExperience === exp.val
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-bold text-slate-900 text-xs mb-2">Sort Results</label>
            <div className="space-y-1.5">
              {[
                { id: 'relevance', label: 'Recommended & Verified First' },
                { id: 'newest', label: 'Recently Posted' },
                { id: 'salary_high', label: 'Salary: High to Low' },
                { id: 'salary_low', label: 'Salary: Low to High' },
              ].map((sortOption) => (
                <label
                  key={sortOption.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    checked={filters.sortBy === sortOption.id}
                    onChange={() =>
                      onUpdateFilters({
                        ...filters,
                        sortBy: sortOption.id as JobFilterState['sortBy'],
                      })
                    }
                    className="accent-orange-600"
                  />
                  <span className="text-slate-800 font-medium">{sortOption.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl transition"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
};
