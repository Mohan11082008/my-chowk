import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  TrendingUp,
  Bookmark,
  Briefcase,
  Store,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Job, JobFilterState, WorkerProfile } from '../types';
import { JobCard } from './JobCard';
import { JOB_CATEGORIES, NAGPUR_LOCALITIES } from '../services/storage';

interface WorkerHomeProps {
  jobs: Job[];
  workerProfile: WorkerProfile | null;
  savedJobIds: string[];
  appliedJobIds: string[];
  filters: JobFilterState;
  onUpdateFilters: (filters: JobFilterState) => void;
  onSelectJob: (job: Job) => void;
  onSaveToggle: (jobId: string) => void;
  onOpenFilterDrawer: () => void;
  onNavigateToApplications: () => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({
  jobs,
  workerProfile,
  savedJobIds,
  appliedJobIds,
  filters,
  onUpdateFilters,
  onSelectJob,
  onSaveToggle,
  onOpenFilterDrawer,
  onNavigateToApplications,
}) => {
  // Matched jobs computed based on worker's selected skills and preferred locality
  const matchedJobs = workerProfile
    ? jobs.filter((job) => {
        const matchesSkill = workerProfile.skills.some((skill) =>
          job.requiredSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()))
        );
        const matchesLoc =
          workerProfile.preferredLocation === 'All Nagpur' ||
          job.locality.toLowerCase().includes(workerProfile.preferredLocation.toLowerCase());
        return matchesSkill || matchesLoc;
      })
    : [];

  // Filter count helper
  const activeFiltersCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.locality !== 'All Nagpur' ? 1 : 0) +
    (filters.workType !== 'all' ? 1 : 0) +
    (filters.minSalary > 0 ? 1 : 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Search & Locality Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-orange-400">
              Nagpur Local Jobs Market
            </span>
            <span className="text-[11px] text-slate-300">
              Welcome, <strong className="text-white">{workerProfile?.name || 'Worker'}</strong>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Find Honest Work Near Your Home
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Direct jobs from grocery stores, restaurants, workshops, and retail shops across Nagpur. Clear salary, no agents.
          </p>

          {/* Search Bar Input */}
          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onUpdateFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Search jobs, skills (Sales, Cook, Delivery, Helper)..."
                className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500 shadow-md"
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

            {/* Filter Drawer Toggle */}
            <button
              onClick={onOpenFilterDrawer}
              className={`p-3 rounded-2xl transition flex items-center justify-center relative shrink-0 ${
                activeFiltersCount > 0
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Open filters"
            >
              <SlidersHorizontal size={18} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-slate-900 font-black text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Activity Pill strip */}
      <div className="flex items-center gap-3 overflow-x-auto py-1 text-xs">
        <button
          onClick={onNavigateToApplications}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">{appliedJobIds.length} Applied Jobs</span>
          <span className="text-[10px] text-slate-600 font-medium">Track Status →</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
          <Bookmark size={13} className="text-orange-600" />
          <span className="font-semibold text-slate-800">{savedJobIds.length} Saved</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
          <MapPin size={13} className="text-blue-600" />
          <span className="text-slate-600">Location:</span>
          <span className="font-semibold text-slate-800">{filters.locality}</span>
        </div>
      </div>

      {/* Categories Horizontal Slider */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Browse by Category</h2>
          <span className="text-xs text-slate-600 font-medium">काम की श्रेणी</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {JOB_CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onUpdateFilters({ ...filters, category: cat.id })}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched Jobs Section (if worker has skills and matching jobs exist) */}
      {matchedJobs.length > 0 && filters.category === 'all' && !filters.searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-orange-600" />
              <h2 className="text-sm font-bold text-slate-900">Recommended For You</h2>
            </div>
            <span className="text-xs text-slate-600 font-medium">Matches your skills & area</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedJobs.slice(0, 2).map((job) => (
              <JobCard
                key={`matched_${job.id}`}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                hasApplied={appliedJobIds.includes(job.id)}
                onSaveToggle={onSaveToggle}
                onSelect={onSelectJob}
                matchScoreText="★ Best Match for your profile"
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Jobs Listing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {filters.category !== 'all'
                ? `${JOB_CATEGORIES.find((c) => c.id === filters.category)?.label}`
                : 'All Available Jobs in Nagpur'}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Showing {jobs.length} open position{jobs.length === 1 ? '' : 's'}
              {filters.locality !== 'All Nagpur' && ` in ${filters.locality}`}
            </p>
          </div>

          {activeFiltersCount > 0 && (
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
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Briefcase size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No jobs match your current filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try changing the locality or category, or clear search keywords to see more jobs.
            </p>
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
              className="mt-4 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Reset All Filters
            </button>
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
    </div>
  );
};
