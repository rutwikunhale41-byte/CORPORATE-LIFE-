import React from 'react';
import { PersonalLifeState, PhoneNotification } from '../../types/smartphone';
import { Bell, CheckCheck, Trash2, ChevronRight, MessageSquare, Briefcase, Heart, Calendar, Wallet, Mail } from 'lucide-react';

interface NotificationsAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  onOpenApp?: (appId: string) => void;
}

export const NotificationsApp: React.FC<NotificationsAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  onOpenApp,
}) => {
  const notifications = personalLife.notifications || [];

  const handleMarkAllRead = () => {
    onUpdatePersonalLife(prev => {
      const updatedChats: Record<string, any[]> = {};
      Object.entries(prev.whatsappChats).forEach(([k, msgs]) => {
        updatedChats[k] = msgs.map(m => (!m.isPlayer ? { ...m, read: true, deliveryStatus: 'read' } : m));
      });

      return {
        ...prev,
        whatsappChats: updatedChats,
        notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
      };
    });
  };

  const handleClearAll = () => {
    onUpdatePersonalLife(prev => ({
      ...prev,
      notifications: [],
    }));
  };

  const getAppIcon = (app: string) => {
    switch (app) {
      case 'whatsapp':
      case 'messages':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'work':
      case 'linkedin':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'dating':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-teal-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-sans text-xs">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Notifications Center</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <button
            onClick={handleMarkAllRead}
            className="text-slate-400 hover:text-white flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Mark Read</span>
          </button>
          <button
            onClick={handleClearAll}
            className="text-slate-400 hover:text-red-400 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="font-bold text-slate-400 text-xs">No active notifications</p>
            <p className="text-[10px]">All caught up! You'll get pings for WhatsApp, LinkedIn, Emails, and Calls here.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                onUpdatePersonalLife(prev => ({
                  ...prev,
                  notifications: prev.notifications.map(item =>
                    item.id === n.id ? { ...item, isRead: true } : item
                  ),
                }));
                if (n.targetAppId && onOpenApp) {
                  onOpenApp(n.targetAppId);
                }
              }}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                !n.isRead
                  ? 'bg-slate-900 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                {getAppIcon(n.app)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs truncate">{n.title}</span>
                  <span className="text-[9px] text-slate-500 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.message}</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 self-center" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
