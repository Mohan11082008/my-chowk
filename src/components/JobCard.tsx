import React from 'react';
import { Bookmark, Clock, MapPin, IndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Job } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  hasApplied: boolean;
  onSaveToggle: (jobId: string) => void;
  onSelect: (job: Job) => void;
  matchScoreText?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  hasApplied,
  onSaveToggle,
  onSelect,
  matchScoreText,
}) => {
  const formatSalary = () => {
    const periodLabel =
      job.salaryPeriod === 'daily'
        ? '/ day'
        : job.salaryPeriod === 'monthly'
        ? '/ month'
        : job.salaryPeriod === 'weekly'
        ? '/ week'
        : '/ hr';

    if (job.minSalary === job.maxSalary) {
      return `₹${job.minSalary.toLocaleString('en-IN')} ${periodLabel}`;
    }
    return `₹${job.minSalary.toLocaleString('en-IN')} – ₹${job.maxSalary.toLocaleString('en-IN')} ${periodLabel}`;
  };

  const workTypeLabel =
    job.workType === 'full_time'
      ? 'Full-time'
      : job.workType === 'part_time'
      ? 'Part-time'
      : job.workType === 'daily_wage'
      ? 'Daily Wage'
      : 'Temporary';

  const expLabel =
    job.minExperienceYears === 0 ? 'Fresher OK' : `${job.minExperienceYears}+ yrs exp`;

  return (
    <div
      onClick={() => onSelect(job)}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Match reason (if computed) */}
        {matchScoreText && (
          <div className="text-[11px] font-medium text-orange-700 bg-orange-50/70 px-2 py-0.5 rounded-md mb-2 inline-block">
            {matchScoreText}
          </div>
        )}

        {/* Top row: Title & Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                {job.businessName}
              </span>
              {job.isVerifiedBusiness && <VerifiedBadge isVerified={true} size="sm" />}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(job.id);
            }}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isSaved
                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark size={18} className={isSaved ? 'fill-orange-600' : ''} />
          </button>
        </div>

        {/* Unboxed Metadata (Zero-Pill discipline compliant) */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mt-3 flex-wrap">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            {job.locality}, Nagpur
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{workTypeLabel}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{expLabel}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600">{job.weeklyOff} Off</span>
        </div>

        {/* Skills needed snippet */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
          <span className="text-[11px] text-slate-600 font-medium">Skills:</span>
          {job.requiredSkills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 3 && (
            <span className="text-[11px] text-slate-600 font-medium">
              +{job.requiredSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card bottom: Salary & Status/CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] text-slate-600 font-medium">Salary Offer</div>
          <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {formatSalary()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Applied
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(job);
              }}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Apply
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
