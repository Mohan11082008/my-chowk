import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Shield,
  Bell,
  CheckCircle2,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { WorkerProfile, WorkType, SalaryPeriod } from '../types';
import { appStorage, NAGPUR_LOCALITIES } from '../services/storage';
import { notificationService } from '../services/notificationService';

interface WorkerProfileViewProps {
  worker: WorkerProfile;
  onUpdate: (worker: WorkerProfile) => void;
  onSwitchRole: () => void;
}

const COMMON_SKILLS = [
  'Counter Sales',
  'Customer Service',
  'Cash Handling',
  'Cooking Helper',
  'Tandoor & Roti',
  'Two-Wheeler Driving',
  'Smart Phone Maps',
  'Electrician & Wiring',
  'AC Repair',
  'Plumbing',
  'Office Boy & Peon',
  'Stock Loading',
  'Housekeeping & Cleaning',
  'Saree Folding',
  'Computer & Billing',
];

export const WorkerProfileView: React.FC<WorkerProfileViewProps> = ({
  worker,
  onUpdate,
  onSwitchRole,
}) => {
  const [formData, setFormData] = useState<WorkerProfile>(worker);
  const [skillInput, setSkillInput] = useState('');
  const [isSavedMessage, setIsSavedMessage] = useState(false);
  const [pushStatus, setPushStatus] = useState<NotificationPermission>(notificationService.getPermissionStatus());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    appStorage.updateWorker(formData);
    onUpdate(formData);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 3000);
  };

  const handleToggleSkill = (skill: string) => {
    const current = formData.skills;
    if (current.includes(skill)) {
      setFormData({ ...formData, skills: current.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...current, skill] });
    }
  };

  const handleAddCustomSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleEnablePush = async () => {
    const perm = await notificationService.requestPermission();
    setPushStatus(perm);
    if (perm === 'granted') {
      notificationService.sendPush('Push Notifications Enabled!', {
        body: 'You will receive immediate alerts whenever a matching Nagpur job is posted.',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {formData.name.charAt(0) || 'W'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{formData.name}</h1>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Phone Verified
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{formData.phone} · {formData.preferredLocation}, Nagpur</p>
            <div className="text-[11px] text-slate-500 mt-1">
              {formData.experienceYears} Years Experience · Expected: ₹{formData.expectedSalary.toLocaleString('en-IN')}/{formData.salaryPeriod}
            </div>
          </div>
        </div>

        <button
          onClick={onSwitchRole}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
        >
          <ArrowRightLeft size={13} />
          Switch to Business Mode
        </button>
      </div>

      {isSavedMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          Profile updated successfully! New job recommendations will match your updated skills.
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Edit Worker Profile (कार्यकर्ता विवरण)
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name (पूरा नाम)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mobile Number (फोन नंबर)</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>
        </div>

        {/* Preferred Locality & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Preferred Locality in Nagpur</label>
            <select
              value={formData.preferredLocation}
              onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
            >
              {NAGPUR_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Experience (वर्ष अनुभव)</label>
            <select
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
            >
              <option value={0}>Fresher (नया उम्मीदवार)</option>
              <option value={1}>1 Year Experience</option>
              <option value={2}>2 Years Experience</option>
              <option value={3}>3-5 Years Experience</option>
              <option value={6}>6+ Years Experience</option>
            </select>
          </div>
        </div>

        {/* Expected Salary & Work Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Minimum Expected Salary (अपेक्षित वेतन)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                step={500}
                value={formData.expectedSalary}
                onChange={(e) => setFormData({ ...formData, expectedSalary: Number(e.target.value) })}
                className="w-2/3 p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
              <select
                value={formData.salaryPeriod}
                onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value as SalaryPeriod })}
                className="w-1/3 p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Type Preference</label>
            <select
              value={formData.workType}
              onChange={(e) => setFormData({ ...formData, workType: e.target.value as WorkType })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
            >
              <option value="full_time">Full-time (पूरा समय)</option>
              <option value="part_time">Part-time (आधा समय)</option>
              <option value="daily_wage">Daily Wage (दैनिक मजदूरी)</option>
              <option value="temporary">Temporary (अस्थाई)</option>
            </select>
          </div>
        </div>

        {/* Skills Tag Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Your Skills & Trades (कौशल चुनें - कम से कम 2)
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_SKILLS.map((skill) => {
              const selected = formData.skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selected
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom skill add */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add other skill (e.g. Tailoring, Welding)..."
              className="flex-1 p-2 rounded-xl border border-slate-300 text-xs"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Preferred shift & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Availability for Joining</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value as WorkerProfile['availability'] })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
            >
              <option value="immediate">Immediate (तुरंत तैयार)</option>
              <option value="within_7_days">Within 7 Days</option>
              <option value="within_15_days">Within 15 Days</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Preferred Shift Hours</label>
            <input
              type="text"
              value={formData.preferredHours || ''}
              onChange={(e) => setFormData({ ...formData, preferredHours: e.target.value })}
              placeholder="e.g. General (9:30 AM - 8:00 PM)"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>
        </div>

        {/* Privacy & Safety Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-orange-600" />
              <span className="font-bold text-slate-900">Privacy & Phone Number Shield</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hidePhoneUntilShortlist}
                onChange={(e) => setFormData({ ...formData, hidePhoneUntilShortlist: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            When enabled, your mobile number is hidden from employers until they review your profile and officially shortlist your application.
          </p>
        </div>

        {/* Push Notification Setup */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-amber-800 shrink-0" />
            <div>
              <span className="font-bold text-amber-950 block">Instant Job Alerts</span>
              <span className="text-[11px] text-amber-800">
                {pushStatus === 'granted'
                  ? 'Push alerts are active for matching Nagpur jobs.'
                  : 'Receive notifications when a nearby shop posts matching work.'}
              </span>
            </div>
          </div>
          {pushStatus !== 'granted' && (
            <button
              type="button"
              onClick={handleEnablePush}
              className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition"
            >
              Enable Notifications
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md"
        >
          Save Worker Profile
        </button>
      </form>
    </div>
  );
};
