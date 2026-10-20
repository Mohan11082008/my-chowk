import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Job, UserRole } from '../types';
import { appStorage } from '../services/storage';

interface ReportModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentRole: UserRole;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  job,
  isOpen,
  onClose,
  currentUserId,
  currentRole,
}) => {
  const [reason, setReason] = useState('fake_job');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appStorage.submitReport({
      reportedBy: currentUserId,
      reporterRole: currentRole,
      targetType: 'job',
      targetId: job.id,
      targetTitle: `${job.title} at ${job.businessName}`,
      reason,
      details,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
            <Flag size={18} />
            <span>Report Job Posting</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Report Received</h3>
            <p className="text-xs text-slate-600">
              Thank you for keeping MY CHOWK safe. Our moderation team in Nagpur will inspect this listing immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="text-xs text-slate-600">
              Reporting: <strong className="text-slate-900">{job.title}</strong> at {job.businessName}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Reason for reporting:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="fake_job">Fake or Non-Existent Job / Shop</option>
                <option value="money_asked">Asking for Money / Registration Fee / Deposit</option>
                <option value="incorrect_salary">Salary or Hours Mismatch</option>
                <option value="inappropriate">Inappropriate, Offensive, or Rude Behavior</option>
                <option value="duplicate">Duplicate or Spam Posting</option>
                <option value="other">Other Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Additional Details (Optional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe what happened or why this post violates community guidelines..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
