import React from 'react';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Building,
  ArrowRight,
  TrendingUp,
  MapPin,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Application, BusinessProfile, Job } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { appStorage } from '../services/storage';

interface BusinessDashboardProps {
  business: BusinessProfile;
  jobs: Job[];
  applications: Application[];
  onOpenPostJob: () => void;
  onNavigateToJobs: () => void;
  onNavigateToApplicants: () => void;
  onViewApplicantDetails: (app: Application) => void;
  onVerificationToggle: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  business,
  jobs,
  applications,
  onOpenPostJob,
  onNavigateToJobs,
  onNavigateToApplicants,
  onViewApplicantDetails,
  onVerificationToggle,
}) => {
  const myJobs = jobs.filter((j) => j.businessId === business.id);
  const activeJobs = myJobs.filter((j) => j.status === 'active');
  const myApplications = applications.filter((a) => a.businessId === business.id);
  const pendingApps = myApplications.filter((a) => a.status === 'applied');
  const shortlistedApps = myApplications.filter((a) => a.status === 'shortlisted');
  const hiredApps = myApplications.filter((a) => a.status === 'accepted');

  const isVerified = business.verificationStatus === 'verified';

  return (
    <div className="space-y-6 pb-20">
      {/* Business Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider text-orange-400">
                Employer Dashboard · Nagpur
              </span>
              <VerifiedBadge isVerified={isVerified} size="sm" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              {business.businessName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
              <MapPin size={13} className="text-orange-400 shrink-0" />
              <span>{business.locality}, Nagpur</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Owner: {business.ownerName}</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-slate-400">{business.category}</span>
            </p>
          </div>

          <button
            onClick={onOpenPostJob}
            className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-lg shadow-orange-600/25 active:scale-95"
          >
            <Plus size={18} />
            POST A JOB (नया विज्ञापन)
          </button>
        </div>
      </div>

      {/* Verified Business Status Card & Demo Toggle */}
      <div
        className={`p-4 rounded-3xl border transition-all ${
          isVerified
            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isVerified ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {isVerified ? 'Verified Business Trust Badge Active' : 'Business Unverified (Community Mode)'}
                </span>
                <VerifiedBadge isVerified={isVerified} size="sm" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {isVerified
                  ? 'All your job postings display the verified trust seal in Nagpur worker feeds, increasing applicant response by 3x.'
                  : 'Submit Shop Act / Udyam registration to display the verified shield on your listings.'}
              </p>
            </div>
          </div>

          {/* Interactive Demo Toggle as requested by user */}
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-700">Demo Toggle:</span>
            <button
              onClick={onVerificationToggle}
              className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                isVerified ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
              }`}
              title="Click to toggle verification status for demo testing"
            >
              {isVerified ? <ToggleRight size={18} className="text-amber-600" /> : <ToggleLeft size={18} />}
              <span>{isVerified ? 'Verified' : 'Unverified'}</span>
            </button>
          </div>
        </div>

        {/* Note on production verification requirement */}
        <div className="mt-2.5 pt-2 border-t border-amber-200/50 text-[10px] text-slate-500">
          <em>Production note:</em> In live deployment, verification requires uploading Maharashtra Shop &
          Establishment licence (Gumasta) or GSTIN / Udyam certificate, manually validated by MY CHOWK team.
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={onNavigateToJobs}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium text-[11px]">Active Jobs</span>
            <Briefcase size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{activeJobs.length}</div>
          <span className="text-[10px] text-slate-600 mt-1 block">Total posted: {myJobs.length}</span>
        </div>

        <div
          onClick={onNavigateToApplicants}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium text-[11px]">New Applicants</span>
            <Users size={16} className="text-orange-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-orange-600 tracking-tight">{pendingApps.length}</div>
          <span className="text-[10px] text-slate-600 mt-1 block">Awaiting review</span>
        </div>

        <div
          onClick={onNavigateToApplicants}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium text-[11px]">Shortlisted</span>
            <Clock size={16} className="text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{shortlistedApps.length}</div>
          <span className="text-[10px] text-slate-600 mt-1 block">Interview stage</span>
        </div>

        <div
          onClick={onNavigateToApplicants}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium text-[11px]">Hired / Filled</span>
            <CheckCircle2 size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">{hiredApps.length}</div>
          <span className="text-[10px] text-slate-600 mt-1 block">Positions closed</span>
        </div>
      </div>

      {/* Recent Applicants Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Applicants</h2>
            <p className="text-xs text-slate-600 font-medium">Workers who applied for your shop vacancies</p>
          </div>
          {myApplications.length > 0 && (
            <button
              onClick={onNavigateToApplicants}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View All ({myApplications.length}) <ArrowRight size={13} />
            </button>
          )}
        </div>

        {myApplications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <Users size={20} />
            </div>
            <p className="font-semibold text-slate-700">No applicants yet</p>
            <p className="text-[11px] mt-0.5">Post a job vacancy to start receiving local worker applications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myApplications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                onClick={() => onViewApplicantDetails(app)}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 font-bold text-sm flex items-center justify-center shrink-0">
                    {app.workerName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {app.workerName}
                      </span>
                      <span className="text-[10px] text-slate-600 font-medium">
                        · {app.workerExperienceYears} yrs exp
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      Applied for: <strong className="text-slate-800">{app.jobTitle}</strong>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {app.workerSkills.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                      app.status === 'shortlisted'
                        ? 'bg-amber-100 text-amber-900'
                        : app.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-900'
                        : app.status === 'rejected'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {app.status === 'applied' ? 'New' : app.status}
                  </span>
                  <div className="text-[10px] text-slate-600 font-medium mt-1">
                    {new Date(app.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
