import React from 'react';
import {
  Briefcase,
  Users,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Clock,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import { Application, BusinessProfile, Job } from '../types';
import { appStorage } from '../services/storage';
import { VerifiedBadge } from './VerifiedBadge';

interface BusinessJobsProps {
  business: BusinessProfile;
  jobs: Job[];
  applications: Application[];
  onOpenPostJob: () => void;
  onViewJobApplicants: (jobId: string) => void;
  onRefresh: () => void;
}

export const BusinessJobs: React.FC<BusinessJobsProps> = ({
  business,
  jobs,
  applications,
  onOpenPostJob,
  onViewJobApplicants,
  onRefresh,
}) => {
  const myJobs = jobs.filter((j) => j.businessId === business.id);

  const handleToggleStatus = (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    appStorage.toggleJobStatus(jobId, nextStatus);
    onRefresh();
  };

  const handleMarkClosed = (jobId: string) => {
    if (window.confirm('Mark this position as filled/closed? It will no longer accept new applications.')) {
      appStorage.toggleJobStatus(jobId, 'closed');
      onRefresh();
    }
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Delete this job posting permanently?')) {
      appStorage.deleteJob(jobId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Job Postings (मेरी पोस्ट की गई नौकरियां)
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage vacancies, pause listings when overwhelmed with candidates, or close positions once filled.
          </p>
        </div>
        <button
          onClick={onOpenPostJob}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition shadow-xs"
        >
          <Plus size={16} />
          Post New Job
        </button>
      </div>

      {myJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Briefcase size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No job postings created yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first vacancy to hire reliable staff for your shop or business in Nagpur.
          </p>
          <button
            onClick={onOpenPostJob}
            className="mt-4 px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => {
            const jobApps = applications.filter((a) => a.jobId === job.id);
            const pendingApps = jobApps.filter((a) => a.status === 'applied');

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900">{job.title}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          job.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900'
                            : job.status === 'paused'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                      <span className="font-semibold text-slate-800">
                        ₹{job.minSalary.toLocaleString('en-IN')} – ₹{job.maxSalary.toLocaleString('en-IN')}/{job.salaryPeriod}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{job.locality}, Nagpur</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{job.workType.replace('_', ' ')}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{job.vacancies} Vacanc{job.vacancies > 1 ? 'ies' : 'y'}</span>
                    </div>
                  </div>

                  {/* Applicants Badge Button */}
                  <button
                    onClick={() => onViewJobApplicants(job.id)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-950 rounded-xl border border-orange-200 transition text-xs font-bold"
                  >
                    <Users size={15} className="text-orange-600" />
                    <span>{jobApps.length} Applicants</span>
                    {pendingApps.length > 0 && (
                      <span className="w-5 h-5 bg-orange-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                        {pendingApps.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Job Stats & Description snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {job.description}
                </p>

                {/* Actions row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Posted on {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.status !== 'closed' ? (
                      <>
                        <button
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                        >
                          {job.status === 'active' ? (
                            <>
                              <PauseCircle size={14} className="text-amber-600" /> Pause Listing
                            </>
                          ) : (
                            <>
                              <PlayCircle size={14} className="text-emerald-600" /> Resume Listing
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleMarkClosed(job.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                        >
                          <CheckCircle2 size={14} className="text-emerald-600" /> Mark Filled
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(job.id, 'closed')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition"
                      >
                        Reopen Opening
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      title="Delete job"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
