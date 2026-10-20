import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

interface ToastData {
  id: string;
  title: string;
  body: string;
}

export const NotificationToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; body: string }>;
      const newToast: ToastData = {
        id: `toast_${Date.now()}_${Math.random()}`,
        title: customEvent.detail.title,
        body: customEvent.detail.body,
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 2)]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('mychowk-notification', handleNotification);
    return () => {
      window.removeEventListener('mychowk-notification', handleNotification);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[90vw] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-top-3"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bell size={18} className="animate-bounce" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="font-semibold text-sm text-slate-100 truncate">{toast.title}</div>
            <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">{toast.body}</p>
            <div className="text-[10px] text-orange-400 mt-1 font-medium">Just now · MY CHOWK Instant Alert</div>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};
