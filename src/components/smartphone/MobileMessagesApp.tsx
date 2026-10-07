import React, { useState } from 'react';
import { PersonalLifeState } from '../../types/smartphone';
import { MessageSquare, Send, ShieldAlert, CheckCheck, User } from 'lucide-react';

interface MobileMessagesAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
}

interface SmsThread {
  id: string;
  senderName: string;
  senderNumber: string;
  avatar: string;
  messages: Array<{ id: string; text: string; timestamp: string; isPlayer: boolean }>;
}

export const MobileMessagesApp: React.FC<MobileMessagesAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>('sms-1');
  const [inputText, setInputText] = useState<string>('');

  const [threads, setThreads] = useState<SmsThread[]>([
    {
      id: 'sms-1',
      senderName: 'HDFC-BANK',
      senderNumber: '56767',
      avatar: '🏦',
      messages: [
        {
          id: 'sm-1',
          text: 'OTP for your UPI transaction is 849201. Valid for 10 mins. Do not share with anyone.',
          timestamp: '10:12 AM',
          isPlayer: false,
        },
      ],
    },
    {
      id: 'sms-2',
      senderName: 'NEXORA-JOBS',
      senderNumber: '38192',
      avatar: '💼',
      messages: [
        {
          id: 'sm-2',
          text: 'Nexora Talent Portal: Your job application status has been updated. Log in to your candidate portal or check your LinkedIn messages.',
          timestamp: '09:30 AM',
          isPlayer: false,
        },
      ],
    },
    {
      id: 'sms-3',
      senderName: 'Swiggy Food',
      senderNumber: '88201',
      avatar: '🛵',
      messages: [
        {
          id: 'sm-3',
          text: 'Your order from Cafe Goodluck has been delivered! Enjoy your filter coffee.',
          timestamp: 'Yesterday',
          isPlayer: false,
        },
      ],
    },
  ]);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    onUpdatePersonalLife(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.app === 'messages' ? { ...n, isRead: true } : n
      ),
    }));
  };

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThread) return;

    const newMsg = {
      id: `sm-${Date.now()}`,
      text: inputText.trim(),
      timestamp: 'Just now',
      isPlayer: true,
    };

    setThreads(prev =>
      prev.map(t =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, newMsg] }
          : t
      )
    );

    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-sans text-xs">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            💬
          </div>
          <span className="font-extrabold text-sm text-slate-100">SMS Messages</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Thread Sidebar / List */}
        <div className="w-28 bg-slate-900/90 border-r border-slate-800 overflow-y-auto shrink-0 space-y-1 p-1">
          {threads.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectThread(t.id)}
              className={`w-full text-left p-2 rounded-xl transition flex items-center gap-2 ${
                t.id === selectedThreadId
                  ? 'bg-emerald-950 border border-emerald-700 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">{t.avatar}</span>
              <div className="min-w-0">
                <div className="text-[10px] truncate">{t.senderName}</div>
                <div className="text-[8px] opacity-60 truncate">{t.messages[t.messages.length - 1]?.text}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Conversation View */}
        <div className="flex-1 flex flex-col bg-slate-950 p-2 space-y-2">
          {activeThread && (
            <>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2 shrink-0">
                <span className="text-xl">{activeThread.avatar}</span>
                <div>
                  <div className="font-bold text-slate-100 text-xs">{activeThread.senderName}</div>
                  <div className="text-[9px] text-slate-400">{activeThread.senderNumber}</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 p-1">
                {activeThread.messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isPlayer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                        m.isPlayer
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <div className="text-[8px] text-right opacity-60 mt-1">{m.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type SMS reply..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
