import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2, X, Briefcase, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { appStorage } from '../services/storage';
import { notificationService } from '../services/notificationService';
import { NotificationItem, UserRole } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentUserId: string;
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToApplications?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentUserId,
  onNavigateToJob,
  onNavigateToApplications,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  const loadNotifications = () => {
    const list = appStorage.getNotifications(currentUserId, currentRole);
    setNotifications(list);
    setPermissionStatus(notificationService.getPermissionStatus());
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, currentRole, currentUserId]);

  useEffect(() => {
    const handleUpdate = () => loadNotifications();
    window.addEventListener('mychowk-notifications-update', handleUpdate);
    return () => window.removeEventListener('mychowk-notifications-update', handleUpdate);
  }, [currentUserId, currentRole]);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    const perm = await notificationService.requestPermission();
    setPermissionStatus(perm);
    if (perm === 'granted') {
      notificationService.sendPush('Push Notifications Active!', {
        body: 'You will now receive instant alerts for new jobs and applicant updates on MY CHOWK.',
      });
    }
  };

  const handleTestChime = () => {
    notificationService.sendPush('Test Job Alert', {
      body: 'This is a test notification with sound chime from MY CHOWK.',
    });
  };

  const handleMarkAllRead = () => {
    appStorage.markAllNotificationsAsRead(currentUserId);
    loadNotifications();
  };

  const handleItemClick = (notif: NotificationItem) => {
    appStorage.markNotificationAsRead(notif.id);
    loadNotifications();
    if (notif.relatedJobId && onNavigateToJob) {
      onNavigateToJob(notif.relatedJobId);
      onClose();
    } else if (onNavigateToApplications) {
      onNavigateToApplications();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Notifications</h2>
              <p className="text-xs text-slate-300">
                {currentRole === 'worker' ? 'Job matches & application updates' : 'New applicants & hiring activity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close notifications"
          >
            <X size={20} />
          </button>
        </div>

        {/* Browser Permission Banner */}
        <div className="p-3 bg-amber-50 border-b border-amber-200/80 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-amber-950">Push Alerts: </span>
              <span className="text-amber-800">
                {permissionStatus === 'granted'
                  ? 'Active on this device'
                  : permissionStatus === 'denied'
                  ? 'Blocked in browser settings'
                  : 'Get instant phone alerts'}
              </span>
            </div>
            {permissionStatus !== 'granted' ? (
              <button
                onClick={handleEnablePush}
                className="px-2.5 py-1 bg-amber-600 text-white font-medium text-xs rounded-md hover:bg-amber-700 transition"
              >
                Enable
              </button>
            ) : (
              <button
                onClick={handleTestChime}
                className="px-2 py-0.5 text-xs text-amber-900 bg-amber-200/70 rounded hover:bg-amber-300 transition"
              >
                Test Sound
              </button>
            )}
          </div>
        </div>

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>{notifications.filter((n) => !n.isRead).length} unread updates</span>
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700 transition"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell size={22} />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">No notifications yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {currentRole === 'worker'
                  ? 'When a shop posts a job matching your skills, you will be notified here immediately.'
                  : 'When candidates apply for your job openings, alerts will show up here.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.isRead;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                    isUnread ? 'bg-orange-50/60 hover:bg-orange-100/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.type === 'job_alert'
                        ? 'bg-blue-100 text-blue-700'
                        : notif.type === 'new_applicant'
                        ? 'bg-emerald-100 text-emerald-700'
                        : notif.type === 'status_updated'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {notif.type === 'job_alert' ? (
                      <Briefcase size={17} />
                    ) : notif.type === 'new_applicant' ? (
                      <UserCheck size={17} />
                    ) : (
                      <Sparkles size={17} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-orange-600">Tap to view</span>
                      {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
