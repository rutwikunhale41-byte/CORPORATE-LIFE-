import React, { useState } from 'react';
import { PersonalLifeState, PersonalContact } from '../../types/smartphone';
import { WhatsAppApp } from './WhatsAppApp';
import { PhoneCallsApp } from './PhoneCallsApp';
import { InstagramApp } from './InstagramApp';
import { SnapchatApp } from './SnapchatApp';
import { FacebookApp } from './FacebookApp';
import { DatingApp } from './DatingApp';
import { ContactsApp } from './ContactsApp';
import { CalendarApp } from './CalendarApp';
import { WalletApp } from './WalletApp';
import { GalleryApp } from './GalleryApp';
import { MapsApp } from './MapsApp';
import { NotesApp } from './NotesApp';
import { MusicApp } from './MusicApp';
import { LinkedInApp } from './LinkedInApp';
import { GoogleMeetApp } from './GoogleMeetApp';
import { NotificationsApp } from './NotificationsApp';
import { MobileEmailApp } from './MobileEmailApp';
import { MobileMessagesApp } from './MobileMessagesApp';
import { UnifiedMessagesApp } from './UnifiedMessagesApp';
import { Briefcase, Video, Mail, MessageCircle, Zap } from 'lucide-react';

import { 
  X, 
  Wifi, 
  Battery, 
  Signal, 
  MessageSquare, 
  Phone, 
  Camera, 
  Calendar as CalendarIcon, 
  Wallet, 
  Image as ImageIcon, 
  Compass, 
  FileText, 
  Music, 
  Heart, 
  User, 
  Bell, 
  Home, 
  ChevronLeft, 
  Sparkles, 
  Flame,
  RotateCcw
} from 'lucide-react';

interface SmartphoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  currentDay: number;
  currentHour: number;
  currentMinute: number;
  onResetGame?: () => void;
  onAcceptOfferAndJoin?: (roleTitle: string, companyName: string, salary: number) => void;
}

export const SmartphoneModal: React.FC<SmartphoneModalProps> = ({
  isOpen,
  onClose,
  personalLife,
  onUpdatePersonalLife,
  currentDay,
  currentHour,
  currentMinute,
  onResetGame,
  onAcceptOfferAndJoin,
}) => {
  const [activeApp, setActiveTab] = useState<string | null>(null);
  const [callingContact, setCallingContact] = useState<PersonalContact | null>(null);
  const [confirmHomeReset, setConfirmHomeReset] = useState(false);

  if (!isOpen) return null;

  const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  const unreadNotifications = personalLife.notifications.filter(n => !n.isRead).length;

  // Unread badges per app
  const unreadWhatsApp = Object.values(personalLife.whatsappChats)
    .flat()
    .filter(m => !m.isPlayer && !m.read).length;

  const missedCalls = personalLife.callHistory.filter(c => c.type === 'missed').length;
  const unreadEmail = personalLife.notifications.filter(n => !n.isRead && n.app === 'email').length;
  const unreadSMS = personalLife.notifications.filter(n => !n.isRead && n.app === 'messages').length;
  const unreadLinkedIn = personalLife.notifications.filter(n => !n.isRead && (n.app === 'linkedin' || n.app === 'work')).length;
  const unreadMeet = (personalLife.googleMeetInterviews || []).filter(i => i.status === 'SCHEDULED').length;
  const unreadInstagram = personalLife.notifications.filter(n => !n.isRead && n.app === 'instagram').length;
  const unreadSnapchat = personalLife.notifications.filter(n => !n.isRead && n.app === 'snapchat').length;
  const unreadFacebook = personalLife.notifications.filter(n => !n.isRead && n.app === 'facebook').length;
  const unreadDating = personalLife.notifications.filter(n => !n.isRead && n.app === 'dating').length;
  const unreadUnified = unreadWhatsApp + unreadEmail + unreadSMS;

  const handleOpenApp = (appId: string) => {
    setActiveTab(appId);
    // Mark corresponding notifications for this app as read
    onUpdatePersonalLife(prev => {
      const updatedNotifs = prev.notifications.map(n => {
        if (appId === 'notifications') return n;
        if (
          n.app === appId || 
          (appId === 'linkedin' && n.app === 'work') ||
          (appId === 'calls' && n.app === 'calls') ||
          (appId === 'messages' && n.app === 'messages') ||
          (appId === 'email' && n.app === 'email') ||
          (appId === 'whatsapp' && n.app === 'whatsapp') ||
          (appId === 'unified' && (n.app === 'whatsapp' || n.app === 'messages' || n.app === 'email'))
        ) {
          return { ...n, isRead: true };
        }
        return n;
      });

      return {
        ...prev,
        notifications: updatedNotifs,
      };
    });
  };

  const handleStartCall = (contact: PersonalContact) => {
    setCallingContact(contact);
    handleOpenApp('calls');
  };

  const handleOpenWhatsAppContact = (contactId: string) => {
    handleOpenApp('whatsapp');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in select-none">
      {/* Smartphone Outer Physical Device Frame */}
      <div className="w-full max-w-[380px] h-[780px] max-h-[92vh] bg-slate-900 border-[6px] border-slate-700 rounded-[48px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-slate-600/50">
        
        {/* Physical Top Notch / Island */}
        <div className="w-full bg-slate-950 px-6 pt-3 pb-1 flex items-center justify-between shrink-0 text-white text-[11px] font-semibold tracking-tight z-30">
          <span className="font-bold">{timeString}</span>

          {/* Camera Notch */}
          <div className="w-24 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Top App Control Bar (when inside an app) */}
        {activeApp && (
          <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between z-20 shrink-0">
            <button
              onClick={() => setActiveTab(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{activeApp}</span>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* App Content viewport or Home Screen */}
        <div className="flex-1 overflow-hidden relative bg-slate-950">
          {!activeApp ? (
            /* Home Screen UI */
            <div className="h-full flex flex-col justify-between p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white relative overflow-y-auto">
              
              {/* Close Button top right */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 border border-slate-800 rounded-full text-slate-400 hover:text-white z-20 shadow"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Time & Weather Widget */}
              <div className="text-center pt-6 pb-2 space-y-1">
                <div className="text-4xl font-extrabold tracking-tight text-white font-mono">
                  {timeString}
                </div>
                <div className="text-xs font-medium text-emerald-400 flex items-center justify-center gap-1">
                  <span>Pune 26°C • Monsoon Breeze 🌧️</span>
                </div>
                <div className="text-[10px] text-slate-400">Day {currentDay} • Personal Life Active</div>
              </div>

              {/* Notifications Widget Banner */}
              {unreadNotifications > 0 && (
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="w-full text-left p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/80 shadow text-xs flex items-center justify-between hover:border-emerald-500 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <Bell className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-300 text-[11px]">
                        {unreadNotifications} Unread Notification{unreadNotifications > 1 ? 's' : ''}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {personalLife.notifications[0]?.message || 'Check your personal pings'}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-emerald-400 rotate-180" />
                </button>
              )}

              {/* App Icon Grid */}
              <div className="grid grid-cols-4 gap-4 my-auto pt-2">
                {/* Unified Messaging Hub */}
                <button
                  onClick={() => handleOpenApp('unified')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 hover:opacity-90 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Zap className="w-6 h-6 text-white" />
                    {unreadUnified > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950 animate-pulse">
                        {unreadUnified}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Unified Hub</span>
                </button>

                {/* Notifications Center */}
                <button
                  onClick={() => handleOpenApp('notifications')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Bell className="w-6 h-6 text-white" />
                    {unreadNotifications > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950 animate-pulse">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Alerts</span>
                </button>

                {/* Personal & Candidate Email */}
                <button
                  onClick={() => handleOpenApp('email')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Mail className="w-6 h-6 text-white" />
                    {unreadEmail > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadEmail}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Email</span>
                </button>

                {/* SMS Text Messages */}
                <button
                  onClick={() => handleOpenApp('messages')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-teal-600 hover:bg-teal-500 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <MessageCircle className="w-6 h-6 text-white" />
                    {unreadSMS > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadSMS}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">SMS</span>
                </button>
                {/* LinkedIn / ATS */}
                <button
                  onClick={() => handleOpenApp('linkedin')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-blue-700 hover:bg-blue-600 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Briefcase className="w-6 h-6 text-white" />
                    {unreadLinkedIn > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadLinkedIn}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">LinkedIn</span>
                </button>

                {/* Google Meet Interviews */}
                <button
                  onClick={() => handleOpenApp('meet')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Video className="w-6 h-6 text-white" />
                    {unreadMeet > 0 && (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadMeet}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Google Meet</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleOpenApp('whatsapp')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <MessageSquare className="w-6 h-6 text-white" />
                    {unreadWhatsApp > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadWhatsApp}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">WhatsApp</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => handleOpenApp('instagram')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Camera className="w-6 h-6 text-white" />
                    {unreadInstagram > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadInstagram}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Instagram</span>
                </button>

                {/* Snapchat */}
                <button
                  onClick={() => handleOpenApp('snapchat')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-yellow-400 hover:bg-yellow-300 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <span className="text-xl">👻</span>
                    {unreadSnapchat > 0 && (
                      <span className="w-4 h-4 rounded-full bg-orange-600 text-white font-extrabold text-[8px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        🔥
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Snapchat</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleOpenApp('facebook')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <span className="text-2xl font-extrabold text-white italic">f</span>
                    {unreadFacebook > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadFacebook}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Facebook</span>
                </button>

                {/* Phone / Calls */}
                <button
                  onClick={() => handleOpenApp('calls')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Phone className="w-6 h-6 text-white" />
                    {missedCalls > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {missedCalls}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Calls</span>
                </button>

                {/* Dating */}
                <button
                  onClick={() => handleOpenApp('dating')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 hover:opacity-90 flex items-center justify-center shadow-lg relative transition transform group-active:scale-90">
                    <Heart className="w-6 h-6 text-white fill-white" />
                    {unreadDating > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-slate-950">
                        {unreadDating}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">DilConnect</span>
                </button>

                {/* Contacts */}
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Contacts</span>
                </button>

                {/* Personal Calendar */}
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Calendar</span>
                </button>

                {/* Wallet / Banking */}
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-teal-600 hover:bg-teal-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Wallet</span>
                </button>

                {/* Gallery */}
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Gallery</span>
                </button>

                {/* Maps */}
                <button
                  onClick={() => setActiveTab('maps')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Maps</span>
                </button>

                {/* Notes */}
                <button
                  onClick={() => setActiveTab('notes')}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-amber-600 hover:bg-amber-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-200">Notes</span>
                </button>

                {/* Restart Simulation App */}
                {onResetGame && (
                  <button
                    onClick={() => setConfirmHomeReset(true)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg transition transform group-active:scale-90 border border-rose-500/30">
                      <RotateCcw className="w-6 h-6 text-white animate-spin-slow" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Restart</span>
                  </button>
                )}
              </div>

              {/* Home Screen Reset Confirmation Dialog */}
              {confirmHomeReset && (
                <div className="absolute inset-x-4 top-1/3 z-50 p-4 bg-slate-900 border-2 border-rose-500 rounded-3xl shadow-2xl space-y-3 animate-fade-in text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-950 text-rose-500 border border-rose-800 flex items-center justify-center mx-auto text-lg font-bold">
                    ⚠️
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-100">Restart Simulation?</h4>
                    <p className="text-[10px] text-slate-400">All progress, personal relations, cash balance, and recruitment pipelines will be fully deleted.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        setConfirmHomeReset(false);
                        onResetGame?.();
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                    >
                      Yes, Restart
                    </button>
                    <button
                      onClick={() => setConfirmHomeReset(false)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] border border-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Dock */}
              <div className="p-2.5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-lg flex items-center justify-around shrink-0 my-2">
                <button onClick={() => setActiveTab('calls')} className="p-2 text-emerald-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveTab('whatsapp')} className="p-2 text-emerald-500 hover:text-white">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveTab('music')} className="p-2 text-purple-400 hover:text-white">
                  <Music className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveTab('wallet')} className="p-2 text-teal-400 hover:text-white">
                  <Wallet className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Active App View */
            <div className="h-full flex flex-col">
              {activeApp === 'unified' && (
                <UnifiedMessagesApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                  onStartCall={handleStartCall}
                />
              )}
              {activeApp === 'notifications' && (
                <NotificationsApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                  onOpenApp={appId => setActiveTab(appId)}
                />
              )}
              {activeApp === 'email' && (
                <MobileEmailApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'messages' && (
                <MobileMessagesApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'linkedin' && (
                <LinkedInApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                  onOpenGoogleMeet={() => setActiveTab('meet')}
                />
              )}
              {activeApp === 'meet' && (
                <GoogleMeetApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                  onAcceptOfferAndJoin={onAcceptOfferAndJoin}
                />
              )}
              {activeApp === 'whatsapp' && (
                <WhatsAppApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                  onStartCall={handleStartCall}
                />
              )}
              {activeApp === 'calls' && (
                <PhoneCallsApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                  activeCallContact={callingContact}
                  onEndCall={() => setCallingContact(null)}
                />
              )}
              {activeApp === 'instagram' && (
                <InstagramApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'snapchat' && (
                <SnapchatApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'facebook' && (
                <FacebookApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'dating' && (
                <DatingApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'contacts' && (
                <ContactsApp
                  personalLife={personalLife}
                  onStartCall={handleStartCall}
                  onOpenWhatsApp={handleOpenWhatsAppContact}
                />
              )}
              {activeApp === 'calendar' && (
                <CalendarApp personalLife={personalLife} />
              )}
              {activeApp === 'wallet' && (
                <WalletApp
                  personalLife={personalLife}
                  onUpdatePersonalLife={onUpdatePersonalLife}
                />
              )}
              {activeApp === 'gallery' && (
                <GalleryApp personalLife={personalLife} />
              )}
              {activeApp === 'maps' && <MapsApp />}
              {activeApp === 'notes' && <NotesApp personalLife={personalLife} />}
              {activeApp === 'music' && <MusicApp />}
            </div>
          )}
        </div>

        {/* Physical Home Indicator Bar (Swipe/Tap Home) */}
        <div className="w-full bg-slate-950 py-2 flex justify-center shrink-0 z-30">
          <button
            onClick={() => setActiveTab(null)}
            className="w-32 h-1 bg-slate-600 hover:bg-white rounded-full transition cursor-pointer"
            title="Home"
          />
        </div>
      </div>
    </div>
  );
};
