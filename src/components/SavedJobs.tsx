import React from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import { Job } from '../types';
import { JobCard } from './JobCard';

interface SavedJobsProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onSaveToggle: (jobId: string) => void;
}

export const SavedJobs: React.FC<SavedJobsProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  onSelectJob,
  onSaveToggle,
}) => {
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="space-y-5 pb-20">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Saved Jobs (सेव की गई नौकरियां)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review bookmarked positions in Nagpur and apply whenever you are ready.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bookmark size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No saved jobs yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tap the bookmark icon on any job card in the home feed to save it for quick access later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
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
