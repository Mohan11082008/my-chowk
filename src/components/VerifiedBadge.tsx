import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetailsTooltip?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isVerified,
  size = 'md',
  showDetailsTooltip = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isVerified) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-[11px] gap-1 px-1.5 py-0.5',
    md: 'text-xs gap-1.5 px-2 py-0.5',
    lg: 'text-sm gap-2 px-2.5 py-1',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center font-medium bg-amber-50 text-amber-900 border border-amber-200/80 rounded-md cursor-pointer hover:bg-amber-100/80 transition-colors ${sizeClasses[size]}`}
        onClick={(e) => {
          e.stopPropagation();
          if (showDetailsTooltip) setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => showDetailsTooltip && setShowTooltip(true)}
        onMouseLeave={() => showDetailsTooltip && setShowTooltip(false)}
        role="status"
        aria-label="Verified Local Business"
      >
        <ShieldCheck
          size={iconSizes[size]}
          className="text-amber-600 fill-amber-600/20 shrink-0"
        />
        <span className="font-semibold tracking-tight text-amber-950">Verified Business</span>
        {showDetailsTooltip && (
          <Info size={11} className="text-amber-600/70 ml-0.5 shrink-0 hidden sm:inline" />
        )}
      </div>

      {showTooltip && (
        <div
          className="absolute z-50 left-0 top-full mt-1.5 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 font-semibold text-amber-400">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>MY CHOWK Trust Seal</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            This business identity, physical shop premises, and Shop Act / Udyam registration
            in Nagpur have been checked by MY CHOWK.
          </p>
          <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            Prompt salary payment & genuine vacancy verified.
          </div>
        </div>
      )}
    </div>
  );
};
