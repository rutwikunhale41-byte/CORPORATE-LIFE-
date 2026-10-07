import React, { useState } from 'react';
import { PersonalLifeState } from '../../types/smartphone';
import { Mail, Search, Star, Send, Inbox, ChevronRight, CheckCircle2, User, Paperclip } from 'lucide-react';

interface MobileEmailAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  playerEmail?: string;
  playerName?: string;
}

interface MobileEmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  category: 'RECRUITMENT' | 'PERSONAL' | 'BANK' | 'WORK';
}

export const MobileEmailApp: React.FC<MobileEmailAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  playerEmail,
  playerName,
}) => {
  const actualPlayerName = personalLife.candidateName || personalLife.candidateProfile?.name || playerName || 'Candidate';
  const actualPlayerEmail = playerEmail || `${actualPlayerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

  const [selectedEmail, setSelectedEmail] = useState<MobileEmailItem | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');
  const [sentToast, setSentToast] = useState<string | null>(null);

  const initialEmails: MobileEmailItem[] = [
    {
      id: 'm-email-1',
      senderName: 'Nexora Global Careers',
      senderEmail: 'careers@nexoraglobal.com',
      subject: 'Application Received: Career Opportunities Program',
      body: `Dear ${actualPlayerName},\n\nThank you for registering with Nexora Global Careers! Your CV profile has been logged in our global candidate registry. Based on your skill assessment and career preferences, our Talent Acquisition team will reach out for suitable vacancies.\n\nBest regards,\nNexora Global Recruitment Team`,
      timestamp: '08:05 AM',
      isRead: false,
      category: 'RECRUITMENT',
    },
    {
      id: 'm-email-2',
      senderName: 'HDFC Bank Alerts',
      senderEmail: 'alerts@hdfcbank.net',
      subject: 'Monthly e-Statement & Account Update',
      body: `Dear Customer,\n\nYour monthly account statement for savings account ending in *1204 is now available. Account balance: ₹1,45,000.00.\n\nThank you for banking with us.`,
      timestamp: 'Yesterday',
      isRead: true,
      category: 'BANK',
    },
    {
      id: 'm-email-3',
      senderName: 'Apex Clean Energy Talent',
      senderEmail: 'hr@apexcleanenergy.com',
      subject: 'Invitation for Initial Screening',
      body: `Hi ${actualPlayerName},\n\nWe came across your profile on LinkedIn and were impressed by your domain skills and background. We would love to schedule a preliminary discussion for our team.\n\nPlease let us know your availability for a Google Meet session!`,
      timestamp: '2 days ago',
      isRead: false,
      category: 'RECRUITMENT',
    },
  ];

  const [emailList, setEmailList] = useState<MobileEmailItem[]>(initialEmails);

  const handleSelectEmail = (email: MobileEmailItem) => {
    setSelectedEmail(email);
    setEmailList(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
    onUpdatePersonalLife(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.app === 'email' ? { ...n, isRead: true } : n
      ),
    }));
  };

  const handleSendReply = () => {
    if (!replyInput.trim() || !selectedEmail) return;

    const replyBody = `Hi ${selectedEmail.senderName},\n\n${replyInput.trim()}\n\nBest regards,\n${actualPlayerName}`;
    setSentToast(`Email sent to ${selectedEmail.senderEmail}`);
    setTimeout(() => setSentToast(null), 3500);

    setSelectedEmail({
      ...selectedEmail,
      body: `${selectedEmail.body}\n\n--- Your Reply (${new Date().toLocaleTimeString()}):\n${replyBody}`,
    });

    setReplyInput('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-sans text-xs">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            📧
          </div>
          <span className="font-extrabold text-sm text-slate-100">Mail</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{actualPlayerEmail}</span>
      </div>

      {sentToast && (
        <div className="bg-emerald-600 text-white text-[10px] font-bold py-1.5 px-3 text-center shrink-0 flex items-center justify-center gap-1.5 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{sentToast}</span>
        </div>
      )}

      {selectedEmail ? (
        /* Email Detail View */
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-3 space-y-3">
          <button
            onClick={() => setSelectedEmail(null)}
            className="text-indigo-400 font-bold text-xs flex items-center gap-1 hover:underline shrink-0"
          >
            ← Back to Inbox
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 shrink-0">
            <h3 className="font-extrabold text-sm text-slate-100 leading-snug">{selectedEmail.subject}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <div>
                <span className="font-bold text-slate-200">{selectedEmail.senderName}</span> ({selectedEmail.senderEmail})
              </div>
              <span>{selectedEmail.timestamp}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-200 leading-relaxed text-xs whitespace-pre-wrap font-sans">
            {selectedEmail.body}
          </div>

          {/* Quick Reply Box */}
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shrink-0">
            <input
              type="text"
              value={replyInput}
              onChange={e => setReplyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendReply()}
              placeholder="Write reply email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSendReply}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reply</span>
            </button>
          </div>
        </div>
      ) : (
        /* Email Inbox List */
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {emailList.map(email => (
            <div
              key={email.id}
              onClick={() => handleSelectEmail(email)}
              className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                !email.isRead
                  ? 'bg-slate-900 border-indigo-500/50 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs">{email.senderName}</span>
                <span className="text-[9px] text-slate-500">{email.timestamp}</span>
              </div>
              <div className="font-semibold text-slate-100 text-xs truncate">{email.subject}</div>
              <p className="text-[10px] text-slate-400 line-clamp-2">{email.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
