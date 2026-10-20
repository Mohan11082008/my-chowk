import React, { useState } from 'react';
import {
  Building,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  ToggleLeft,
  ToggleRight,
  FileCheck,
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { appStorage, NAGPUR_LOCALITIES } from '../services/storage';
import { VerifiedBadge } from './VerifiedBadge';

interface BusinessProfileViewProps {
  business: BusinessProfile;
  onUpdate: (business: BusinessProfile) => void;
  onSwitchRole: () => void;
  onVerificationToggle: () => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  onUpdate,
  onSwitchRole,
  onVerificationToggle,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(business);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isVerified = business.verificationStatus === 'verified';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    appStorage.updateBusiness(formData);
    onUpdate(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {business.businessName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{business.businessName}</h1>
              <VerifiedBadge isVerified={isVerified} size="sm" />
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Owner: {business.ownerName} · {business.locality}, Nagpur
            </p>
            <div className="text-[11px] text-slate-500 mt-1">
              Category: <strong className="text-slate-800">{business.category}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={onSwitchRole}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
        >
          <ArrowRightLeft size={13} />
          Switch to Worker Mode
        </button>
      </div>

      {/* Verified Business Trust Badge Management & Demo Toggle */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          isVerified
            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                isVerified ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {isVerified ? 'Verified Business Trust Badge Active' : 'Unverified Business Status'}
                </span>
                <VerifiedBadge isVerified={isVerified} size="sm" />
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The Verified Business Badge reassures workers that salaries are paid on time and your shop is an authentic local establishment.
              </p>
            </div>
          </div>

          {/* Interactive Manual Toggle for Demonstration */}
          <button
            type="button"
            onClick={onVerificationToggle}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-2xs ${
              isVerified
                ? 'bg-amber-200/80 text-amber-950 hover:bg-amber-300'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isVerified ? <ToggleRight size={18} className="text-amber-700" /> : <ToggleLeft size={18} />}
            <span>{isVerified ? 'Toggle Unverified' : 'Toggle Verified (Demo)'}</span>
          </button>
        </div>

        {/* Verification Requirements Checklist */}
        <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-2 text-xs">
          <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
            Verification Requirements in Production:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div className="flex items-center gap-1.5">
              <FileCheck size={14} className={isVerified ? 'text-amber-700' : 'text-slate-400'} />
              <span>Shop Act License (Gumasta / गुमास्ता)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck size={14} className={isVerified ? 'text-amber-700' : 'text-slate-400'} />
              <span>Udyam / MSME Registration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck size={14} className={isVerified ? 'text-amber-700' : 'text-slate-400'} />
              <span>Electricity Bill of Shop Premises</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck size={14} className={isVerified ? 'text-amber-700' : 'text-slate-400'} />
              <span>Owner Aadhaar / PAN Verification</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-1">
            Note: MY CHOWK never marks any business as verified unless documents are checked by our Nagpur verification field team.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          Business details updated successfully!
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Business Information (दुकान / व्यापार विवरण)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Business / Shop Name (दुकान का नाम) *
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Owner / Manager Name (मालिक का नाम) *
            </label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business Category *</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Locality in Nagpur *</label>
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
            <label className="block font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              disabled
              value="Nagpur, Maharashtra"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Shop / Premises Address *</label>
          <input
            type="text"
            required
            value={formData.fullAddress}
            onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
            placeholder="Plot number, market name, landmark, Nagpur"
            className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">About Your Business</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe your shop, working hours, and benefits..."
            className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md"
        >
          Save Business Profile
        </button>
      </form>
    </div>
  );
};
