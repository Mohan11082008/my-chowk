import React, { useState } from 'react';
import {
  X,
  Briefcase,
  IndianRupee,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Eye,
  Edit3,
} from 'lucide-react';
import { BusinessProfile, Job, SalaryPeriod, WorkType } from '../types';
import { appStorage, JOB_CATEGORIES, NAGPUR_LOCALITIES } from '../services/storage';
import { JobCard } from './JobCard';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  onJobCreated: (job: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  business,
  onJobCreated,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'kirana',
    description: '',
    requiredSkills: ['Customer Service', 'Counter Sales'] as string[],
    vacancies: 1,
    minSalary: 14000,
    maxSalary: 18000,
    salaryPeriod: 'monthly' as SalaryPeriod,
    workType: 'full_time' as WorkType,
    workingHours: '9:30 AM - 8:00 PM',
    weeklyOff: 'Sunday',
    minExperienceYears: 0,
    locality: business.locality || 'Sitabuldi',
    city: 'Nagpur',
    fullAddress: business.fullAddress || '',
    contactPreference: 'both' as 'call' | 'whatsapp' | 'both',
    joiningDate: 'Immediate',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedJob, setSubmittedJob] = useState<Job | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);

    const created = appStorage.createJob({
      businessId: business.id,
      businessName: business.businessName,
      businessCategory: business.category,
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim() || `Urgent hiring for ${formData.title} at ${business.businessName}. Timely salary and good work culture.`,
      requiredSkills: formData.requiredSkills,
      vacancies: Number(formData.vacancies),
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      salaryPeriod: formData.salaryPeriod,
      workType: formData.workType,
      workingHours: formData.workingHours,
      weeklyOff: formData.weeklyOff,
      minExperienceYears: Number(formData.minExperienceYears),
      locality: formData.locality,
      city: 'Nagpur',
      fullAddress: formData.fullAddress || `${formData.locality}, Nagpur`,
      contactPreference: formData.contactPreference,
      joiningDate: formData.joiningDate,
      isVerifiedBusiness: business.verificationStatus === 'verified',
    });

    setIsSubmitting(false);
    setSubmittedJob(created);
    onJobCreated(created);
  };

  // Build a preview object
  const previewJob: Job = {
    id: 'preview',
    businessId: business.id,
    businessName: business.businessName,
    businessCategory: business.category,
    title: formData.title || 'Sample Job Title',
    category: formData.category,
    description: formData.description || 'Description will appear here.',
    requiredSkills: formData.requiredSkills,
    vacancies: formData.vacancies,
    minSalary: formData.minSalary,
    maxSalary: formData.maxSalary,
    salaryPeriod: formData.salaryPeriod,
    workType: formData.workType,
    workingHours: formData.workingHours,
    weeklyOff: formData.weeklyOff,
    minExperienceYears: formData.minExperienceYears,
    locality: formData.locality,
    city: 'Nagpur',
    fullAddress: formData.fullAddress,
    contactPreference: formData.contactPreference,
    status: 'active',
    createdAt: new Date().toISOString(),
    isVerifiedBusiness: business.verificationStatus === 'verified',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full sm:max-w-2xl bg-white h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Post a Job Vacancy</h2>
              <p className="text-[11px] text-slate-300">
                Publish opening for {business.businessName} (Nagpur)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!submittedJob && (
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition"
              >
                {isPreview ? <Edit3 size={13} /> : <Eye size={13} />}
                <span>{isPreview ? 'Edit Form' : 'Preview'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs">
          {submittedJob ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Job Published Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your opening for <strong>{submittedJob.title}</strong> is now live across Nagpur.
                Instant push alerts have been dispatched to workers with matching skills in {submittedJob.locality}.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition"
                >
                  Done & Back to Dashboard
                </button>
              </div>
            </div>
          ) : isPreview ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs">
                <strong>Live Card Preview:</strong> This is how your job opening will appear in the MY CHOWK worker feed.
              </div>
              <JobCard
                job={previewJob}
                isSaved={false}
                hasApplied={false}
                onSaveToggle={() => {}}
                onSelect={() => {}}
              />
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900">Detailed Description:</h4>
                <p>{previewJob.description || 'No description provided.'}</p>
                <div className="pt-2 flex gap-4 text-slate-600">
                  <span>Hours: <strong>{previewJob.workingHours}</strong></span>
                  <span>Weekly Off: <strong>{previewJob.weeklyOff}</strong></span>
                  <span>Joining: <strong>{previewJob.joiningDate}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Job Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Job Title (पद / नौकरी का नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Counter Sales, Assistant Cook, Delivery Boy"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Job Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    {JOB_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} ({cat.labelHi})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locality & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Locality in Nagpur *</label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    {NAGPUR_LOCALITIES.filter((l) => l !== 'All Nagpur').map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Number of Vacancies *</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              {/* Salary Range & Period */}
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3">
                <span className="font-bold text-slate-900 block">Salary & Compensation (वेतन) *</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Min Salary (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      required
                      value={formData.minSalary}
                      onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Max Salary (₹)</label>
                    <input
                      type="number"
                      min={formData.minSalary}
                      step={500}
                      required
                      value={formData.maxSalary}
                      onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Pay Frequency</label>
                    <select
                      value={formData.salaryPeriod}
                      onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value as SalaryPeriod })}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="monthly">Monthly (प्रति माह)</option>
                      <option value="daily">Daily (प्रति दिन)</option>
                      <option value="weekly">Weekly (प्रति सप्ताह)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Work Type, Hours, Weekly Off */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Work Type</label>
                  <select
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value as WorkType })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="daily_wage">Daily Wage</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Working Hours</label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    placeholder="e.g. 9:30 AM - 8:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Weekly Off</label>
                  <select
                    value={formData.weeklyOff}
                    onChange={(e) => setFormData({ ...formData, weeklyOff: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Rotational">Rotational</option>
                  </select>
                </div>
              </div>

              {/* Experience & Joining */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Experience Requirement</label>
                  <select
                    value={formData.minExperienceYears}
                    onChange={(e) => setFormData({ ...formData, minExperienceYears: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value={0}>Freshers Welcome (0 Experience)</option>
                    <option value={1}>At least 1 Year</option>
                    <option value={2}>At least 2 Years</option>
                    <option value={3}>3+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Joining Timeline</label>
                  <input
                    type="text"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    placeholder="e.g. Immediate / Within 3 days"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Skills Needed */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Required Skills</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type skill & press Add (e.g. Billing, Tandoor, Driving)..."
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Job Description & Responsibilities *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe day-to-day work, duties, duty meals provided, any allowances..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
