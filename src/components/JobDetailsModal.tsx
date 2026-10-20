import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  IndianRupee,
  Users,
  Briefcase,
  ShieldCheck,
  Phone,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Job, WorkerProfile } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { appStorage } from '../services/storage';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  workerProfile: WorkerProfile | null;
  isSaved: boolean;
  onSaveToggle: (jobId: string) => void;
  onOpenReport: (job: Job) => void;
  onApplicationSubmitted?: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  workerProfile,
  isSaved,
  onSaveToggle,
  onOpenReport,
  onApplicationSubmitted,
}) => {
  const [coverNote, setCoverNote] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen || !job) return null;

  const hasAlreadyApplied = workerProfile ? appStorage.hasApplied(workerProfile.id, job.id) : false;

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

  const handleApply = () => {
    if (!workerProfile) {
      setApplyError('Please create or update your worker profile first.');
      return;
    }

    setIsApplying(true);
    setApplyError(null);

    const res = appStorage.submitApplication(job.id, workerProfile, coverNote);
    setIsApplying(false);

    if (res.success) {
      setApplySuccess(true);
      if (onApplicationSubmitted) onApplicationSubmitted();
    } else {
      setApplyError(res.error || 'Failed to submit application');
    }
  };

  const handleShare = () => {
    const text = `Vacancy at ${job.businessName} (${job.locality}, Nagpur): ${job.title}. Salary: ${formatSalary()}. Check on MY CHOWK!`;
    if (navigator.share) {
      navigator.share({ title: job.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const business = appStorage.getBusiness(job.businessId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full sm:max-w-2xl bg-white h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              MY CHOWK Job Vacancy
            </span>
            {job.isVerifiedBusiness && <VerifiedBadge isVerified={true} size="sm" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Share job"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => onSaveToggle(job.id)}
              className={`p-2 rounded-xl transition ${
                isSaved ? 'text-orange-600 bg-orange-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Saved' : 'Save job'}
            >
              <Bookmark size={18} className={isSaved ? 'fill-orange-600' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {copiedShare && (
          <div className="bg-emerald-600 text-white text-xs text-center py-1.5 font-medium">
            Job details copied to clipboard! Share on WhatsApp.
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Title & Salary Strip */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium mt-1">
              <span>{job.businessName}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500">{job.businessCategory}</span>
            </div>

            {/* Salary Box */}
            <div className="mt-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-orange-950/70 font-medium">Offered Pay (वेतन)</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatSalary()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Weekly Off</span>
                <div className="text-sm font-bold text-slate-800">{job.weeklyOff}</div>
              </div>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[11px] font-medium">Work Type</span>
              <strong className="text-slate-900 text-xs mt-0.5 block capitalize">
                {job.workType.replace('_', ' ')}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[11px] font-medium">Vacancies</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">
                {job.vacancies} open post{job.vacancies > 1 ? 's' : ''}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[11px] font-medium">Min Experience</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">
                {job.minExperienceYears === 0 ? 'Freshers welcome' : `${job.minExperienceYears}+ Years`}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[11px] font-medium">Joining</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">
                {job.joiningDate || 'Immediate'}
              </strong>
            </div>
          </div>

          {/* Working Hours & Address */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Clock size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Working Hours / Shift</span>
                <p className="text-xs text-slate-600 mt-0.5">{job.workingHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Job Location (Nagpur)</span>
                <p className="text-xs text-slate-600 mt-0.5">{job.fullAddress || `${job.locality}, Nagpur`}</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Job Description (काम का विवरण)
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border border-slate-200/80 rounded-2xl p-4">
              {job.description}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Required Skills & Traits (ज़रूरी कौशल)
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Business Profile Summary & Trust */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">About the Employer</span>
              <VerifiedBadge isVerified={job.isVerifiedBusiness} size="sm" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {business?.description || 'Authentic local enterprise operating in Nagpur, Maharashtra.'}
            </p>
            <div className="text-[11px] text-slate-600 pt-1">
              Posting Date: {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Application Form Drawer / State */}
          {hasAlreadyApplied || applySuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Application Sent Successfully!</h4>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  The employer has been notified on their dashboard. You can track your application status in the
                  <strong> Applications</strong> tab.
                </p>
                {/* Safe Contact CTA */}
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=Namaste,%20I%20have%20applied%20for%20the%20${encodeURIComponent(job.title)}%20position%20on%20MY%20CHOWK.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    <MessageSquare size={13} />
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ) : showApplyForm ? (
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Confirm Your Application</span>
                <span className="text-[11px] text-orange-700">Profile will be shared</span>
              </div>

              {!workerProfile ? (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 text-xs rounded-xl space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <AlertCircle size={15} />
                    <span>Business Mode Active</span>
                  </div>
                  <p className="leading-relaxed">
                    You are currently using MY CHOWK in Business Mode. Please switch to Worker Mode to apply for vacancies with your worker profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      appStorage.setCurrentRole('worker');
                      if (onApplicationSubmitted) onApplicationSubmitted();
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-lg transition text-xs"
                  >
                    Switch to Worker Mode & Apply
                  </button>
                </div>
              ) : (
                <>
                  {applyError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{applyError}</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-600">
                    Applying as: <strong className="text-slate-900">{workerProfile?.name}</strong> (
                    {workerProfile?.phone})
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Add a short note to the shop owner (Optional):
                    </label>
                    <textarea
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="e.g. Sir, I reside nearby in Sitabuldi and have 2 years of shop experience. Ready to join immediately."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition shadow-xs disabled:opacity-50"
                    >
                      {isApplying ? 'Submitting...' : 'Submit Application Now'}
                    </button>
                    <button
                      onClick={() => setShowApplyForm(false)}
                      className="px-3 py-2.5 bg-slate-200 text-slate-700 font-medium text-xs rounded-xl hover:bg-slate-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* Report Job option */}
          <div className="pt-2 flex justify-between items-center text-xs text-slate-600 border-t border-slate-100">
            <span>Notice something suspicious?</span>
            <button
              onClick={() => onOpenReport(job)}
              className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition"
            >
              <Flag size={13} />
              Report this Job
            </button>
          </div>
        </div>

        {/* Fixed Bottom CTA Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          {hasAlreadyApplied || applySuccess ? (
            <button
              disabled
              className="w-full h-12 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-emerald-200"
            >
              <CheckCircle2 size={16} className="text-emerald-600" />
              Applied Already
            </button>
          ) : showApplyForm ? (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full h-12 rounded-xl bg-orange-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 active:scale-[0.98] transition"
            >
              {isApplying ? 'Sending Application...' : 'Send Application Now'}
            </button>
          ) : (
            <button
              onClick={() => setShowApplyForm(true)}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.98] transition"
            >
              Apply for this Job (आवेदन करें)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
