import React, { useState } from 'react';
import {
  UserCheck,
  Store,
  Check,
  X,
  UserPlus,
  Building,
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, WorkerProfile, BusinessProfile, SalaryPeriod, WorkType } from '../types';
import { appStorage, NAGPUR_LOCALITIES, JOB_CATEGORIES } from '../services/storage';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentUserId: string;
  onSelectRole: (role: UserRole) => void;
  onAccountSwitched: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentUserId,
  onSelectRole,
  onAccountSwitched,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'reg_worker' | 'reg_business' | 'accounts'>('switch');

  // New Worker Form state
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('+91 ');
  const [workerLocality, setWorkerLocality] = useState('Sitabuldi');
  const [workerSkills, setWorkerSkills] = useState<string[]>(['Counter Sales']);
  const [workerSkillInput, setWorkerSkillInput] = useState('');
  const [workerExp, setWorkerExp] = useState(1);
  const [workerExpectedSalary, setWorkerExpectedSalary] = useState(15000);
  const [workerSalaryPeriod, setWorkerSalaryPeriod] = useState<SalaryPeriod>('monthly');
  const [workerWorkType, setWorkerWorkType] = useState<WorkType>('full_time');
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // New Business Form state
  const [bizName, setBizName] = useState('');
  const [bizOwner, setBizOwner] = useState('');
  const [bizCategory, setBizCategory] = useState('Grocery & General Store');
  const [bizPhone, setBizPhone] = useState('+91 ');
  const [bizLocality, setBizLocality] = useState('Sitabuldi');
  const [bizAddress, setBizAddress] = useState('');
  const [bizDesc, setBizDesc] = useState('');

  if (!isOpen) return null;

  const allWorkers = appStorage.getWorkers();
  const allBusinesses = appStorage.getBusinesses();

  const handleRegisterWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) return;

    const newWorker = appStorage.registerWorker({
      name: workerName.trim(),
      phone: workerPhone.trim() || '+91 98000 00000',
      preferredLocation: workerLocality,
      skills: workerSkills.length > 0 ? workerSkills : ['General Helper'],
      experienceYears: Number(workerExp),
      expectedSalary: Number(workerExpectedSalary),
      salaryPeriod: workerSalaryPeriod,
      workType: workerWorkType,
      availability: 'immediate',
      languages: ['Hindi', 'Marathi'],
      isPhoneVerified: true,
      hidePhoneUntilShortlist: false,
    });

    setRegSuccessMessage(`Welcome ${newWorker.name}! Registered successfully as a Worker.`);
    setTimeout(() => {
      setRegSuccessMessage(null);
      onAccountSwitched();
      onClose();
    }, 1500);
  };

  const handleRegisterBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim() || !bizOwner.trim()) return;

    const newBiz = appStorage.registerBusiness({
      businessName: bizName.trim(),
      ownerName: bizOwner.trim(),
      category: bizCategory,
      phone: bizPhone.trim() || '+91 98000 00000',
      locality: bizLocality,
      city: 'Nagpur',
      fullAddress: bizAddress.trim() || `${bizLocality}, Nagpur`,
      description: bizDesc.trim() || `${bizName} operating in ${bizLocality}, Nagpur.`,
      verificationStatus: 'unverified',
      verificationDocsSubmitted: false,
    });

    setRegSuccessMessage(`Welcome ${newBiz.businessName}! Registered successfully as a Business.`);
    setTimeout(() => {
      setRegSuccessMessage(null);
      onAccountSwitched();
      onClose();
    }, 1500);
  };

  const handleAddWorkerSkill = () => {
    if (workerSkillInput.trim() && !workerSkills.includes(workerSkillInput.trim())) {
      setWorkerSkills([...workerSkills, workerSkillInput.trim()]);
      setWorkerSkillInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/aistudio/WhatsApp_Image_2026-10-20_at_3.29.08_PM_8c34b5f8.jpeg`}
              alt="MY CHOWK"
              className="w-11 h-11 rounded-xl object-contain bg-white p-1"
            />
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-orange-400 block">
                Local Jobs · Local People
              </span>
              <h2 className="text-lg font-bold tracking-tight">MY CHOWK Account & Roles</h2>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('switch')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === 'switch' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Switch Role
            </button>
            <button
              onClick={() => setActiveTab('reg_worker')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === 'reg_worker' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              + Register Worker
            </button>
            <button
              onClick={() => setActiveTab('reg_business')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === 'reg_business' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              + Register Business
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === 'accounts' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              All Profiles ({allWorkers.length + allBusinesses.length})
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {regSuccessMessage && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            <span>{regSuccessMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: Role Switcher */}
          {activeTab === 'switch' && (
            <div className="space-y-3.5">
              <p className="text-slate-600 leading-relaxed text-xs">
                Switch role below. You can apply for jobs as a worker, or post jobs and review applicants as a business owner.
              </p>

              {/* Worker Role Option */}
              <div
                onClick={() => {
                  onSelectRole('worker');
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  currentRole === 'worker'
                    ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-500/10'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    currentRole === 'worker' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <UserCheck size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">FIND WORK (काम खोजें)</h3>
                    {currentRole === 'worker' && (
                      <span className="inline-flex items-center text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        <Check size={12} className="mr-1" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Browse nearby vacancies in Sitabuldi, Dharampeth, Sadar & Nagpur. Apply with 1 tap, track salary & working hours.
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Active worker: <strong className="text-slate-800">{appStorage.getWorker(currentUserId)?.name || 'Worker'}</strong>
                  </div>
                </div>
              </div>

              {/* Business Role Option */}
              <div
                onClick={() => {
                  onSelectRole('business');
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  currentRole === 'business'
                    ? 'border-blue-700 bg-blue-50/50 shadow-md ring-2 ring-blue-700/10'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    currentRole === 'business' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Store size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">HIRE STAFF (स्टाफ रखें)</h3>
                    {currentRole === 'business' && (
                      <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        <Check size={12} className="mr-1" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Post jobs for your shop, restaurant, or business. Review local applicants, shortlist candidates & hire fast.
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Active shop: <strong className="text-slate-800">{appStorage.getBusiness(currentUserId)?.businessName || 'Business'}</strong>
                  </div>
                </div>
              </div>

              {/* Reset Demo Data button */}
              <div className="pt-3 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                <span>Want to reset sample test data?</span>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all demo data to initial Nagpur listings?')) {
                      appStorage.resetToInitialDemo();
                      onAccountSwitched();
                      onClose();
                    }
                  }}
                  className="text-slate-600 hover:text-orange-600 underline text-[11px]"
                >
                  Reset Sample Data
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Register Worker Form */}
          {activeTab === 'reg_worker' && (
            <form onSubmit={handleRegisterWorker} className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Register as New Worker (कामगार पंजीकरण)</h3>
                <p className="text-slate-500 text-[11px]">
                  Fill this quick profile to apply for local shop jobs and receive instant match notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (पूरा नाम) *</label>
                  <input
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="e.g. Ramesh Patil / Anita Meshram"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number (+91) *</label>
                  <input
                    type="text"
                    required
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    placeholder="+91 98231 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality in Nagpur *</label>
                  <select
                    value={workerLocality}
                    onChange={(e) => setWorkerLocality(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Previous Experience</label>
                  <select
                    value={workerExp}
                    onChange={(e) => setWorkerExp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value={0}>Fresher (0 Years)</option>
                    <option value={1}>1 Year Experience</option>
                    <option value={2}>2 Years Experience</option>
                    <option value={3}>3-5 Years Experience</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Salary (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={workerExpectedSalary}
                      onChange={(e) => setWorkerExpectedSalary(Number(e.target.value))}
                      className="w-2/3 p-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                    <select
                      value={workerSalaryPeriod}
                      onChange={(e) => setWorkerSalaryPeriod(e.target.value as SalaryPeriod)}
                      className="w-1/3 p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="monthly">/mo</option>
                      <option value="daily">/day</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Type</label>
                  <select
                    value={workerWorkType}
                    onChange={(e) => setWorkerWorkType(e.target.value as WorkType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="daily_wage">Daily Wage</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Skills</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {workerSkills.map((s) => (
                    <span key={s} className="bg-orange-100 text-orange-900 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      {s}
                      <button
                        type="button"
                        onClick={() => setWorkerSkills(workerSkills.filter((sk) => sk !== s))}
                        className="text-orange-700 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workerSkillInput}
                    onChange={(e) => setWorkerSkillInput(e.target.value)}
                    placeholder="Add skill (Sales, Cook, Delivery, Helper)..."
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddWorkerSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddWorkerSkill}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md transition"
              >
                Complete Worker Registration (पंजीकरण पूर्ण करें)
              </button>
            </form>
          )}

          {/* TAB 3: Register Business Form */}
          {activeTab === 'reg_business' && (
            <form onSubmit={handleRegisterBusiness} className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Register as Business / Shop Owner (दुकानदार पंजीकरण)</h3>
                <p className="text-slate-500 text-[11px]">
                  Register your business to publish vacancies and hire local Nagpur staff.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business / Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="e.g. Nagpur Sweets & Bakery"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner / Manager Name *</label>
                  <input
                    type="text"
                    required
                    value={bizOwner}
                    onChange={(e) => setBizOwner(e.target.value)}
                    placeholder="e.g. Ramesh Agrawal"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value)}
                    placeholder="e.g. Grocery, Cafe, Retail Shop"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    placeholder="+91 94221 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality in Nagpur *</label>
                  <select
                    value={bizLocality}
                    onChange={(e) => setBizLocality(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Shop Address *</label>
                  <input
                    type="text"
                    required
                    value={bizAddress}
                    onChange={(e) => setBizAddress(e.target.value)}
                    placeholder="Plot 10, Main Road, Sitabuldi, Nagpur"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (Optional)</label>
                <textarea
                  rows={2}
                  value={bizDesc}
                  onChange={(e) => setBizDesc(e.target.value)}
                  placeholder="Describe your shop / enterprise..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition"
              >
                Register Business (व्यापार पंजीकृत करें)
              </button>
            </form>
          )}

          {/* TAB 4: Switch between All Profiles */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Select Profile to Test</h3>
                <p className="text-slate-500 text-[11px]">
                  Pick any registered worker or business account to test user journeys.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2 text-orange-700 uppercase">
                  Worker Accounts ({allWorkers.length}):
                </h4>
                <div className="space-y-2">
                  {allWorkers.map((w) => {
                    const isSelected = currentRole === 'worker' && currentUserId === w.id;
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          appStorage.switchAccount('worker', w.id);
                          onAccountSwitched();
                          onClose();
                        }}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                          isSelected ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{w.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {w.skills.slice(0, 2).join(', ')} · {w.preferredLocation}, Nagpur
                          </div>
                        </div>
                        {isSelected && <span className="text-xs font-bold text-orange-600">Active</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2 text-blue-900 uppercase">
                  Business Accounts ({allBusinesses.length}):
                </h4>
                <div className="space-y-2">
                  {allBusinesses.map((b) => {
                    const isSelected = currentRole === 'business' && currentUserId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => {
                          appStorage.switchAccount('business', b.id);
                          onAccountSwitched();
                          onClose();
                        }}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                          isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{b.businessName}</div>
                          <div className="text-[11px] text-slate-500">
                            Owner: {b.ownerName} · {b.locality}, Nagpur
                          </div>
                        </div>
                        {isSelected && <span className="text-xs font-bold text-blue-700">Active</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
