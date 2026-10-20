import React from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  RotateCcw,
  Briefcase,
} from 'lucide-react';
import { Job, JobFilterState } from '../types';
import { JobCard } from './JobCard';
import { JOB_CATEGORIES, NAGPUR_LOCALITIES } from '../services/storage';

interface WorkerSearchTabProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  filters: JobFilterState;
  onUpdateFilters: (filters: JobFilterState) => void;
  onSelectJob: (job: Job) => void;
  onSaveToggle: (jobId: string) => void;
  onOpenFilterDrawer: () => void;
}

export const WorkerSearchTab: React.FC<WorkerSearchTabProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  filters,
  onUpdateFilters,
  onSelectJob,
  onSaveToggle,
  onOpenFilterDrawer,
}) => {
  return (
    <div className="space-y-5 pb-20">
      {/* Top Search Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Search & Filter Nagpur Jobs
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Filter by job role, locality, expected pay, or experience level
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by role or skill (e.g. Cook, Sales, Billing, Electrician)..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-orange-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick Locality Selector & Filter Drawer Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <MapPin size={15} className="text-orange-600 shrink-0" />
            <select
              value={filters.locality}
              onChange={(e) => onUpdateFilters({ ...filters, locality: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
            >
              {NAGPUR_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenFilterDrawer}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <SlidersHorizontal size={14} />
            <span>More Filters</span>
          </button>

          {(filters.searchQuery ||
            filters.category !== 'all' ||
            filters.locality !== 'All Nagpur' ||
            filters.workType !== 'all' ||
            filters.minSalary > 0 ||
            filters.maxExperience !== -1) && (
            <button
              onClick={() =>
                onUpdateFilters({
                  searchQuery: '',
                  category: 'all',
                  locality: 'All Nagpur',
                  workType: 'all',
                  minSalary: 0,
                  maxExperience: -1,
                  sortBy: 'relevance',
                })
              }
              className="flex items-center gap-1 px-2.5 py-2 text-slate-600 hover:text-orange-600 text-xs font-medium"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {JOB_CATEGORIES.map((cat) => {
            const active = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onUpdateFilters({ ...filters, category: cat.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                  active
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Sort Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-semibold text-slate-700">
          Showing {jobs.length} Matching Job{jobs.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onUpdateFilters({
                ...filters,
                sortBy: e.target.value as JobFilterState['sortBy'],
              })
            }
            className="p-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
          >
            <option value="relevance">Recommended</option>
            <option value="newest">Newest</option>
            <option value="salary_high">Salary: High to Low</option>
            <option value="salary_low">Salary: Low to High</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Briefcase size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No jobs match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try broadening your search keyword or clearing the locality filter to see all Nagpur opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              hasApplied={appliedJobIds.includes(job.id)}
              onSaveToggle={onSaveToggle}
              onSelect={onSelectJob}
            />
          ))}
        </div>
      )}
    </div>
  );
};
