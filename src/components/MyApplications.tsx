import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Phone,
  MessageSquare,
  Building,
  RotateCcw,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';
import { appStorage } from '../services/storage';

interface MyApplicationsProps {
  applications: Application[];
  onSelectJob: (jobId: string) => void;
  onRefresh: () => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({
  applications,
  onSelectJob,
  onRefresh,
}) => {
  const [filterTab, setFilterTab] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    if (filterTab === 'all') return true;
    return app.status === filterTab;
  });

  const handleWithdraw = (appId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      appStorage.withdrawApplication(appId);
      onRefresh();
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-lg border border-amber-300">
            ★ Shortlisted for Interview
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg border border-emerald-300">
            <CheckCircle2 size={13} className="text-emerald-700" /> Hired / Selected
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg">
            <XCircle size={13} className="text-slate-500" /> Not Selected
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 font-medium text-xs rounded-lg">
            Withdrawn
          </span>
        );
      case 'applied':
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 font-semibold text-xs rounded-lg border border-blue-200">
            <Clock size={13} className="text-blue-600" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          My Applications (मेरे आवेदन)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Track real-time hiring updates, shortlisted interviews, and employer contact for your applied jobs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All (${applications.length})` },
          { id: 'applied', label: `Under Review (${applications.filter((a) => a.status === 'applied').length})` },
          { id: 'shortlisted', label: `Shortlisted (${applications.filter((a) => a.status === 'shortlisted').length})` },
          { id: 'accepted', label: `Hired (${applications.filter((a) => a.status === 'accepted').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              filterTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Briefcase size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No applications found in this tab</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse open vacancies in Nagpur and apply to shops and local businesses.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isShortlistedOrAccepted = app.status === 'shortlisted' || app.status === 'accepted';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header: Job Title & Status */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3
                      onClick={() => onSelectJob(app.jobId)}
                      className="text-base font-bold text-slate-900 hover:text-orange-600 cursor-pointer transition"
                    >
                      {app.jobTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-0.5">
                      <Building size={13} className="text-slate-400" />
                      <span>{app.businessName}</span>
                    </div>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                {/* Status Timeline Bar */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                    <span className="text-emerald-700">1. Applied</span>
                    <span className={app.status !== 'applied' ? 'text-emerald-700' : 'text-slate-400'}>
                      2. Under Review
                    </span>
                    <span
                      className={
                        app.status === 'shortlisted' || app.status === 'accepted'
                          ? 'text-emerald-700 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      3. Interview / Shortlist
                    </span>
                    <span className={app.status === 'accepted' ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      4. Hired
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-1/4" />
                    <div
                      className={`h-full w-1/4 ${
                        app.status !== 'applied' ? 'bg-emerald-500' : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full w-1/4 ${
                        app.status === 'shortlisted' || app.status === 'accepted'
                          ? 'bg-emerald-500'
                          : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full w-1/4 ${
                        app.status === 'accepted' ? 'bg-emerald-500' : 'bg-transparent'
                      }`}
                    />
                  </div>
                </div>

                {/* Employer Notes if present */}
                {app.employerNotes && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <strong className="block text-[11px] text-amber-800">Employer Message:</strong>
                    <p className="mt-0.5">{app.employerNotes}</p>
                  </div>
                )}

                {/* Metadata & Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Safe Contact if Shortlisted or Accepted */}
                    {isShortlistedOrAccepted && (
                      <a
                        href={`https://wa.me/?text=Namaste%20${encodeURIComponent(app.businessName)},%20I%20am%20${encodeURIComponent(app.workerName)}.%20You%20shortlisted%20my%20application%20for%20${encodeURIComponent(app.jobTitle)}%20on%20MY%20CHOWK.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition shadow-xs"
                      >
                        <MessageSquare size={13} />
                        Contact Employer
                      </a>
                    )}

                    <button
                      onClick={() => onSelectJob(app.jobId)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-xs transition"
                    >
                      View Job Details
                    </button>

                    {app.status === 'applied' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 text-xs font-medium transition"
                      >
                        Withdraw
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
