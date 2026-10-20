import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  Phone,
  Clock,
  Briefcase,
  MapPin,
  IndianRupee,
  FileText,
  Filter,
} from 'lucide-react';
import { Application, ApplicationStatus, BusinessProfile, Job } from '../types';
import { appStorage } from '../services/storage';

interface ApplicantManagerProps {
  business: BusinessProfile;
  jobs: Job[];
  applications: Application[];
  selectedJobId?: string | null;
  onRefresh: () => void;
}

export const ApplicantManager: React.FC<ApplicantManagerProps> = ({
  business,
  jobs,
  applications,
  selectedJobId: initialSelectedJobId,
  onRefresh,
}) => {
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>(initialSelectedJobId || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeModalApp, setActiveModalApp] = useState<Application | null>(null);
  const [employerNoteInput, setEmployerNoteInput] = useState('');

  React.useEffect(() => {
    if (initialSelectedJobId) {
      setSelectedJobFilter(initialSelectedJobId);
    }
  }, [initialSelectedJobId]);

  const myJobs = jobs.filter((j) => j.businessId === business.id);
  const myApps = applications.filter((a) => a.businessId === business.id);

  const filteredApps = myApps.filter((app) => {
    if (selectedJobFilter !== 'all' && app.jobId !== selectedJobFilter) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (appId: string, status: ApplicationStatus, notes?: string) => {
    appStorage.updateApplicationStatus(appId, status, notes);
    onRefresh();
    if (activeModalApp && activeModalApp.id === appId) {
      setActiveModalApp((prev) => (prev ? { ...prev, status, employerNotes: notes } : null));
    }
  };

  return (
    <div className="space-y-5 pb-20">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Applicant Management (आवेदक प्रबंधन)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review candidates, check previous work experience in Nagpur, shortlist top prospects, and contact them directly.
        </p>
      </div>

      {/* Filter Row: By Job and By Status */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        {/* Job selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 whitespace-nowrap">Filter by Opening:</span>
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 bg-white font-medium text-xs text-slate-800"
          >
            <option value="all">All Jobs ({myApps.length} applicants)</option>
            {myJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'applied', label: 'New / Pending' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'accepted', label: 'Hired' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition text-xs ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No applicants match this criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Switch the filter to &quot;All&quot; or check other vacancies.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isShortlisted = app.status === 'shortlisted';
            const isAccepted = app.status === 'accepted';
            const isRejected = app.status === 'rejected';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Candidate Summary */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 font-black text-lg flex items-center justify-center shrink-0">
                      {app.workerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900">{app.workerName}</h3>
                        <span className="text-xs font-semibold text-slate-600">
                          ({app.workerExperienceYears === 0 ? 'Fresher' : `${app.workerExperienceYears} yrs experience`})
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md capitalize ${
                            isShortlisted
                              ? 'bg-amber-100 text-amber-900'
                              : isAccepted
                              ? 'bg-emerald-100 text-emerald-900'
                              : isRejected
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          {app.status === 'applied' ? 'Pending Review' : app.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Briefcase size={13} className="text-slate-400" />
                          Applied for: <strong className="text-slate-900">{app.jobTitle}</strong>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {app.workerLocality}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>
                          Expected: <strong>₹{app.workerExpectedSalary?.toLocaleString('en-IN')}/{app.workerSalaryPeriod}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact & Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Direct WhatsApp connect */}
                    <a
                      href={`https://wa.me/?text=Namaste%20${encodeURIComponent(app.workerName)},%20this%20is%20${encodeURIComponent(business.businessName)}%20regarding%20your%20job%20application%20for%20${encodeURIComponent(app.jobTitle)}%20on%20MY%20CHOWK.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      title="Direct WhatsApp interview call"
                    >
                      <MessageSquare size={13} />
                      WhatsApp
                    </a>

                    <a
                      href={`tel:${app.workerPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      title="Direct phone call"
                    >
                      <Phone size={13} />
                      Call Candidate
                    </a>
                  </div>
                </div>

                {/* Candidate Skills Chips */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Candidate Skills:</span>
                  {app.workerSkills.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>

                {/* Cover note / worker message */}
                {app.coverNote && (
                  <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 text-xs text-slate-800">
                    <strong className="text-orange-900 block text-[11px] mb-0.5">Worker Note:</strong>
                    <p className="italic">&ldquo;{app.coverNote}&rdquo;</p>
                  </div>
                )}

                {/* Employer notes if recorded */}
                {app.employerNotes && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong className="text-slate-900 text-[11px] block">Your Notes / Interview Instructions:</strong>
                    <p className="mt-0.5">{app.employerNotes}</p>
                  </div>
                )}

                {/* Hiring Decision Status Bar */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap text-xs">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Applied {new Date(app.appliedAt).toLocaleDateString([], { day: 'numeric', month: 'short' })} · Phone: {app.workerPhone}
                  </span>

                  <div className="flex items-center gap-2">
                    {!isShortlisted && !isAccepted && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'shortlisted', 'Shortlisted for in-person interview.')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg font-bold text-xs transition"
                      >
                        <Star size={13} className="text-amber-600" />
                        Shortlist
                      </button>
                    )}

                    {!isAccepted && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'accepted', 'Selected and hired for this position.')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg font-bold text-xs transition"
                      >
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        Accept & Hire
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected', 'Position filled or candidate did not fit criteria.')}
                        className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-xs transition"
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    )}
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
