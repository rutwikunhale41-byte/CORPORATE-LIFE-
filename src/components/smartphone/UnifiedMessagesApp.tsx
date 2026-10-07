import React, { useState } from 'react';
import { PersonalLifeState, DirectChatMessage } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { MessageSquare, Mail, MessageCircle, Send, Search, Sparkles, Filter, CheckCheck, Clock, User } from 'lucide-react';

interface UnifiedMessagesAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  onStartCall?: (contact: any) => void;
}

export const UnifiedMessagesApp: React.FC<UnifiedMessagesAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  onStartCall,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'WHATSAPP' | 'SMS' | 'EMAIL'>('ALL');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('whatsapp-contact-mom');
  const [inputText, setInputText] = useState<string>('');

  // Unify all conversations into one list
  const whatsappContacts = personalLife.contacts.map(c => {
    const messages = personalLife.whatsappChats[c.id] || [];
    const lastMsg = messages[messages.length - 1];
    return {
      id: `whatsapp-${c.id}`,
      type: 'WHATSAPP' as const,
      contactId: c.id,
      name: c.name,
      avatar: c.avatar,
      badge: 'WhatsApp',
      badgeColor: 'bg-emerald-600 text-white',
      lastText: lastMsg ? lastMsg.text : 'Tap to start chat',
      timestamp: lastMsg ? lastMsg.timestamp : 'Active',
      unread: messages.some(m => !m.isPlayer && !m.read),
      messages,
    };
  });

  const smsThreads = [
    {
      id: 'sms-bank',
      type: 'SMS' as const,
      contactId: 'bank',
      name: 'HDFC-BANK',
      avatar: '🏦',
      badge: 'SMS',
      badgeColor: 'bg-teal-600 text-white',
      lastText: 'OTP for UPI transaction is 849201. Valid for 10 mins.',
      timestamp: '10:12 AM',
      unread: true,
      messages: [
        { id: 's1', text: 'OTP for UPI transaction is 849201. Valid for 10 mins. Do not share with anyone.', timestamp: '10:12 AM', isPlayer: false },
      ],
    },
    {
      id: 'sms-jobs',
      type: 'SMS' as const,
      contactId: 'jobs',
      name: 'NEXORA-JOBS',
      avatar: '💼',
      badge: 'SMS',
      badgeColor: 'bg-teal-600 text-white',
      lastText: 'Nexora Talent Portal: Application status updated.',
      timestamp: '09:30 AM',
      unread: false,
      messages: [
        { id: 's2', text: 'Nexora Talent Portal: Application status updated. Check your candidate portal.', timestamp: '09:30 AM', isPlayer: false },
      ],
    },
  ];

  const emailThreads = [
    {
      id: 'email-nexora',
      type: 'EMAIL' as const,
      contactId: 'careers-nexora',
      name: 'Nexora Global Careers',
      avatar: '📧',
      badge: 'Email',
      badgeColor: 'bg-indigo-600 text-white',
      lastText: 'Thank you for registering! Your CV profile has been logged.',
      timestamp: '08:05 AM',
      unread: false,
      messages: [
        { id: 'e1', text: 'Thank you for registering with Nexora Global Careers! Your CV profile has been logged in our candidate database.', timestamp: '08:05 AM', isPlayer: false },
      ],
    },
    {
      id: 'email-apex',
      type: 'EMAIL' as const,
      contactId: 'hr-apex',
      name: 'Apex Clean Energy HR',
      avatar: '☀️',
      badge: 'Email',
      badgeColor: 'bg-indigo-600 text-white',
      lastText: 'Invitation for Initial Screening discussion.',
      timestamp: 'Yesterday',
      unread: true,
      messages: [
        { id: 'e2', text: 'We came across your LinkedIn profile and were impressed by your skills! We would love to schedule a interview.', timestamp: 'Yesterday', isPlayer: false },
      ],
    },
  ];

  const allUnifiedThreads = [...whatsappContacts, ...smsThreads, ...emailThreads];

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    const target = allUnifiedThreads.find(t => t.id === threadId);
    if (!target) return;

    if (target.type === 'WHATSAPP') {
      const contactId = target.contactId;
      onUpdatePersonalLife(prev => ({
        ...prev,
        whatsappChats: {
          ...prev.whatsappChats,
          [contactId]: (prev.whatsappChats[contactId] || []).map(m =>
            !m.isPlayer ? { ...m, read: true, deliveryStatus: 'read' } : m
          ),
        },
        notifications: prev.notifications.map(n =>
          n.app === 'whatsapp' && (n.targetAppId === contactId || n.title.includes(target.name))
            ? { ...n, isRead: true }
            : n
        ),
      }));
    } else {
      onUpdatePersonalLife(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          (target.type === 'SMS' && n.app === 'messages') || (target.type === 'EMAIL' && n.app === 'email')
            ? { ...n, isRead: true }
            : n
        ),
      }));
    }
  };

  const filteredThreads = allUnifiedThreads.filter(t => {
    if (filterType === 'WHATSAPP') return t.type === 'WHATSAPP';
    if (filterType === 'SMS') return t.type === 'SMS';
    if (filterType === 'EMAIL') return t.type === 'EMAIL';
    return true;
  });

  const activeThread = allUnifiedThreads.find(t => t.id === selectedThreadId) || allUnifiedThreads[0];

  const candidateName = personalLife.candidateName || 'Candidate';

  const handleSendUnifiedMessage = async () => {
    if (!inputText.trim() || !activeThread) return;

    const typedMsg = inputText.trim();
    setInputText('');

    const newMsg: DirectChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'player',
      senderName: candidateName,
      text: typedMsg,
      timestamp: 'Just now',
      isPlayer: true,
      read: true,
    };

    // Append player message immediately
    if (activeThread.type === 'WHATSAPP') {
      const contactId = activeThread.contactId;
      onUpdatePersonalLife(prev => {
        const existing = prev.whatsappChats[contactId] || [];
        return {
          ...prev,
          whatsappChats: {
            ...prev.whatsappChats,
            [contactId]: [...existing, newMsg],
          },
        };
      });

      // Call AI Engine
      try {
        const contact = personalLife.contacts.find(c => c.id === contactId) || {
          id: contactId,
          name: activeThread.name,
          relationshipType: 'Friend',
          occupation: 'Professional',
          mood: 'Friendly',
          bio: 'Chat participant',
          trust: 80,
          respect: 80,
          closeness: 80,
        };

        const chatRes = await sendChatMessage({
          channel: { id: contact.id, name: activeThread.name, type: 'direct', topic: contact.bio },
          activeCharacters: [{
            id: contact.id,
            name: activeThread.name,
            role: contact.relationshipType,
            department: contact.occupation,
            personality: contact.mood,
            communicationStyle: contact.bio,
            trust: contact.trust,
            respect: contact.respect,
            rapport: contact.closeness,
          }],
          conversationHistory: [...(personalLife.whatsappChats[contactId] || []), newMsg],
          playerMessage: typedMsg,
          player: { name: candidateName },
          reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
          memories: [],
          currentTime: { day: 1, hour: 10, minute: 0 },
          difficulty: 'Normal',
        });

        const replyText = chatRes.replies[0]?.text || `Got it! Chat you soon.`;
        const replyMsg: DirectChatMessage = {
          id: `reply-${Date.now() + 1}`,
          senderId: contactId,
          senderName: activeThread.name,
          text: replyText,
          timestamp: 'Just now',
          isPlayer: false,
          read: true,
        };

        onUpdatePersonalLife(prev => {
          const existing = prev.whatsappChats[contactId] || [];
          return {
            ...prev,
            whatsappChats: {
              ...prev.whatsappChats,
              [contactId]: [...existing, replyMsg],
            },
          };
        });
      } catch (err) {
        console.warn('AI Unified WhatsApp reply error:', err);
      }
    } else {
      // For SMS or EMAIL threads, we also simulate via AI engine!
      const contactId = activeThread.contactId;
      const originalMessages = activeThread.messages || [];
      const updatedHistory = [...originalMessages, newMsg];

      // Add to thread UI list temporarily by editing the active thread's messages
      activeThread.messages.push(newMsg);

      try {
        const chatRes = await sendChatMessage({
          channel: { id: contactId, name: activeThread.name, type: 'direct', topic: activeThread.badge },
          activeCharacters: [{
            id: contactId,
            name: activeThread.name,
            role: activeThread.badge,
            department: activeThread.name,
            personality: 'Helpful',
            communicationStyle: activeThread.lastText,
            trust: 90,
            respect: 90,
            rapport: 90,
          }],
          conversationHistory: updatedHistory,
          playerMessage: typedMsg,
          player: { name: candidateName },
          reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
          memories: [],
          currentTime: { day: 1, hour: 10, minute: 0 },
          difficulty: 'Normal',
        });

        const replyText = chatRes.replies[0]?.text || `We have processed your request. Thank you.`;
        const replyMsg: DirectChatMessage = {
          id: `reply-${Date.now() + 1}`,
          senderId: contactId,
          senderName: activeThread.name,
          text: replyText,
          timestamp: 'Just now',
          isPlayer: false,
          read: true,
        };

        activeThread.messages.push(replyMsg);
        onUpdatePersonalLife(prev => ({ ...prev })); // Force re-render
      } catch (err) {
        console.warn('AI Unified SMS/Email reply error:', err);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-sans text-xs">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            ⚡
          </div>
          <span className="font-extrabold text-sm text-slate-100">Unified Hub</span>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[9px] font-bold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-0.5 rounded ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('WHATSAPP')}
            className={`px-2 py-0.5 rounded ${filterType === 'WHATSAPP' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            WhatsApp
          </button>
          <button
            onClick={() => setFilterType('SMS')}
            className={`px-2 py-0.5 rounded ${filterType === 'SMS' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            SMS
          </button>
          <button
            onClick={() => setFilterType('EMAIL')}
            className={`px-2 py-0.5 rounded ${filterType === 'EMAIL' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Email
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Thread Sidebar */}
        <div className="w-32 bg-slate-900 border-r border-slate-800 overflow-y-auto shrink-0 p-1 space-y-1">
          {filteredThreads.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectThread(t.id)}
              className={`w-full text-left p-2 rounded-xl transition flex flex-col gap-0.5 ${
                t.id === selectedThreadId
                  ? 'bg-slate-800 border border-slate-700 text-white shadow'
                  : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{t.avatar}</span>
                <span className={`px-1 py-0.2 rounded text-[8px] font-extrabold ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </div>
              <div className="font-bold text-[10px] text-slate-200 truncate mt-1">{t.name}</div>
              <div className="text-[8px] text-slate-400 truncate opacity-80">{t.lastText}</div>
            </button>
          ))}
        </div>

        {/* Selected Thread Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-950 p-2 space-y-2">
          {activeThread && (
            <>
              {/* Header card for selected thread */}
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeThread.avatar}</span>
                  <div>
                    <div className="font-bold text-slate-100 text-xs">{activeThread.name}</div>
                    <div className="text-[9px] text-slate-400 flex items-center gap-1">
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${activeThread.badgeColor}`}>
                        {activeThread.badge}
                      </span>
                      <span>• Unified Communications</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto space-y-2 p-1 bg-slate-950 rounded-xl border border-slate-900 min-h-[220px]">
                {activeThread.messages.map((m, idx) => (
                  <div
                    key={idx}
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

              {/* Universal Input Bar */}
              <div className="flex items-center gap-2 pt-1 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendUnifiedMessage()}
                  placeholder={`Send ${activeThread.badge} message...`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSendUnifiedMessage}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow"
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
