import React, { useState, useRef, useEffect } from 'react';
import { 
  PersonalContact, 
  DirectChatMessage, 
  PersonalLifeState 
} from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { universalAiEngine } from '../../services/universalAiEngine';
import { 
  Send, 
  Phone, 
  Video, 
  Search, 
  ArrowLeft, 
  MoreVertical, 
  CheckCheck, 
  Sparkles, 
  Paperclip, 
  Smile, 
  Heart, 
  ShieldCheck, 
  Clock, 
  UserCheck 
} from 'lucide-react';

interface WhatsAppAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  onStartCall: (contact: PersonalContact) => void;
}

export const WhatsAppApp: React.FC<WhatsAppAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  onStartCall,
}) => {
  const [activeContactId, setActiveContactId] = useState<string | null>('contact-rohan');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = personalLife.contacts.find(c => c.id === activeContactId);
  const activeMessages = activeContactId ? (personalLife.whatsappChats[activeContactId] || []) : [];

  // Automatically mark incoming messages as read when opening a contact's chat
  useEffect(() => {
    if (!activeContactId) return;
    const chatList = personalLife.whatsappChats[activeContactId] || [];
    const hasUnread = chatList.some(m => !m.isPlayer && !m.read);
    if (hasUnread) {
      onUpdatePersonalLife(prev => ({
        ...prev,
        whatsappChats: {
          ...prev.whatsappChats,
          [activeContactId]: (prev.whatsappChats[activeContactId] || []).map(m =>
            !m.isPlayer ? { ...m, read: true, deliveryStatus: 'read' } : m
          ),
        },
        notifications: prev.notifications.map(n =>
          n.app === 'whatsapp' && (n.targetAppId === activeContactId || n.title.includes(activeContact?.name || ''))
            ? { ...n, isRead: true }
            : n
        ),
      }));
    }
  }, [activeContactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  const candidateName = personalLife.candidateName || 'Candidate';

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !activeContactId || !activeContact) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMsg: DirectChatMessage = {
      id: userMsgId,
      senderId: 'player',
      senderName: candidateName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPlayer: true,
      read: false, // Initially delivered (grey ticks)
      deliveryStatus: 'delivered',
    };

    const updatedMessages = [...activeMessages, userMsg];

    // Update messages with 'delivered' state
    onUpdatePersonalLife(prev => {
      return {
        ...prev,
        whatsappChats: {
          ...prev.whatsappChats,
          [activeContactId]: updatedMessages,
        },
      };
    });

    if (!textToSend) setInputMessage('');

    // Simulated read receipt delay: switches from delivered (grey double ticks) to read (cyan double ticks)
    // after a random interval simulating 2-10 minutes (UI timer between 2.5s - 6.5s with realistic timestamp calculation)
    const simulatedDelayMins = Math.floor(Math.random() * 9) + 2; // 2 to 10 simulated minutes
    const now = new Date();
    const readDate = new Date(now.getTime() + simulatedDelayMins * 60 * 1000);
    const simulatedReadTimeString = readDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const simulatedUiTimerMs = Math.floor(Math.random() * 3000) + 2500; // 2.5s to 5.5s real-time interval
    setTimeout(() => {
      onUpdatePersonalLife(prev => {
        const chats = prev.whatsappChats[activeContactId] || [];
        return {
          ...prev,
          whatsappChats: {
            ...prev.whatsappChats,
            [activeContactId]: chats.map(m =>
              m.id === userMsgId ? { ...m, read: true, deliveryStatus: 'read', readAtTimestamp: simulatedReadTimeString } : m
            ),
          },
        };
      });
    }, simulatedUiTimerMs);

    setIsTyping(true);

    try {
      const chatRes = await universalAiEngine.generateCharacterReply(
        {
          playerMessage: text.trim(),
          characterId: activeContact.id,
          conversationId: activeContactId,
          app: 'whatsapp',
          context: {
            location: 'Personal WhatsApp Chat',
          },
        },
        {
          player: {
            id: 'player',
            name: candidateName,
            title: personalLife.candidateProfile?.targetRole || 'Professional',
            department: 'Corporate',
            team: 'General',
            company: 'Nexora Global',
            level: 1,
            salary: 600000,
            currency: '₹',
            location: 'Pune / Mumbai',
            probationDaysLeft: 90,
            probationPassed: true,
            joiningDate: 'Day 1',
            xp: 0,
            nextLevelXp: 500,
            performanceScore: 80,
            productivity: 80,
            quality: 80,
            communication: 80,
            technicalSkills: 80,
            leadership: 70,
            reliability: 80,
            teamwork: 80,
            achievements: [],
          },
          reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, professionalReputation: 80, hrReputation: 80 },
          characters: personalLife.contacts.map(c => ({
            id: c.id,
            name: c.name,
            age: 28,
            role: c.relationshipType,
            department: c.occupation,
            avatar: c.name[0],
            color: 'from-emerald-500 to-teal-600',
            personality: c.mood || 'Warm, authentic and personal',
            communicationStyle: c.bio || 'Casual texting style',
            quirks: 'Uses emojis and natural texting nuances',
            trust: c.trust,
            respect: c.respect,
            rapport: c.closeness,
            memories: [],
            isOnline: true,
            currentMood: 'supportive' as any,
          })),
          tasks: [],
          channels: [],
          messages: {},
          emails: [],
          incident: { active: false, title: '', description: '', severity: 'LOW' as any, slaMinutesRemaining: 120, serviceHealth: {} },
          currentDay: 1,
          currentHour: 10,
          currentMinute: 0,
          difficulty: 'Normal',
          isHired: true,
          gameStarted: true,
          isRomanceModeEnabled: true,
          applications: [],
          careerStage: 'CONFIRMED',
          memories: [],
          reviews: [],
          evaluations: [],
          news: [],
        } as any,
        updatedMessages.map(m => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.senderName,
          text: m.text,
          timestamp: m.timestamp,
          isPlayer: m.isPlayer,
          appContext: 'whatsapp',
        }))
      );

      const replyText = chatRes.message || `Got it! Let's talk soon.`;

      const replyMsg: DirectChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: activeContact.id,
        senderName: activeContact.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPlayer: false,
        read: true,
      };

      setIsTyping(false);
      onUpdatePersonalLife(prev => {
        const chatList = prev.whatsappChats[activeContactId] || [];
        const updatedContacts = prev.contacts.map(c => {
          if (c.id === activeContactId) {
            const trustDelta = chatRes.relationship_change?.trustDelta || 1;
            const rapportDelta = chatRes.relationship_change?.rapportDelta || 1;
            return {
              ...c,
              closeness: Math.min(100, Math.max(0, c.closeness + rapportDelta)),
              trust: Math.min(100, Math.max(0, c.trust + trustDelta)),
            };
          }
          return c;
        });
        return {
          ...prev,
          contacts: updatedContacts,
          whatsappChats: {
            ...prev.whatsappChats,
            [activeContactId]: [...chatList, replyMsg],
          },
        };
      });
    } catch (e) {
      setIsTyping(false);
      console.warn('AI WhatsApp chat error:', e);
    }
  };

  const filteredContacts = personalLife.contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.relationshipType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* WhatsApp Header */}
      {!activeContactId ? (
        <div className="p-3 bg-emerald-900 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              WA
            </div>
            <div>
              <h2 className="font-bold text-base text-emerald-100 leading-none">WhatsApp</h2>
              <span className="text-[10px] text-emerald-300">Personal & Family Chats</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-emerald-200">
            <Search className="w-4 h-4 cursor-pointer" />
            <MoreVertical className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      ) : null}

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar or Full Screen on mobile */}
        {(!activeContactId || window.innerWidth > 640) && (
          <div className={`flex-1 flex flex-col bg-slate-900 border-r border-slate-800 ${activeContactId ? 'hidden sm:flex sm:w-1/3' : 'w-full'}`}>
            {/* Search Bar */}
            <div className="p-2 bg-slate-900 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts or chats..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-xs text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Contact Chat Rows */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {filteredContacts.map(contact => {
                const chats = personalLife.whatsappChats[contact.id] || [];
                const lastMsg = chats[chats.length - 1];
                const unreadCount = chats.filter(m => !m.isPlayer && !m.read).length;

                return (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    className={`w-full p-3 flex items-center gap-3 text-left transition ${
                      activeContactId === contact.id ? 'bg-emerald-950/40 border-l-2 border-emerald-500' : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${contact.color || 'from-emerald-500 to-teal-700'} flex items-center justify-center text-lg font-bold text-white shadow-sm`}>
                        {contact.avatar}
                      </div>
                      {contact.isOnline && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute bottom-0 right-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-slate-100 truncate">{contact.name}</h3>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {lastMsg ? lastMsg.timestamp : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[11px] text-slate-400 truncate">
                          {lastMsg ? lastMsg.text : contact.bio}
                        </p>
                        {unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium">
                          {contact.relationshipType}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Trust: {contact.trust}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Conversation View */}
        {activeContactId && activeContact ? (
          <div className="flex-1 flex flex-col bg-slate-950 relative min-w-0">
            {/* Active Contact Header */}
            <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setActiveContactId(null)}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400 sm:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${activeContact.color || 'from-emerald-500 to-teal-700'} flex items-center justify-center text-lg font-bold text-white shrink-0`}>
                  {activeContact.avatar}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                    <span>{activeContact.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {activeContact.relationshipType}
                    </span>
                  </h3>
                  <p className="text-[10px] text-emerald-400 truncate">
                    {activeContact.isOnline ? 'Online • ' + activeContact.mood : activeContact.lastSeen}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onStartCall(activeContact)}
                  className="p-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 rounded-full transition"
                  title="Call Contact"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <div className="hidden sm:block text-right pr-2">
                  <div className="text-[10px] text-slate-400">Closeness: <span className="text-emerald-400 font-bold">{activeContact.closeness}%</span></div>
                  <div className="text-[10px] text-slate-400">Trust: <span className="text-emerald-400 font-bold">{activeContact.trust}%</span></div>
                </div>
              </div>
            </div>

            {/* Conversation Background Pattern */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Memories / Context Banner */}
              {activeContact.memories && activeContact.memories.length > 0 && (
                <div className="mx-auto max-w-md p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-center">
                  <p className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Shared Memory: {activeContact.memories[activeContact.memories.length - 1]}</span>
                  </p>
                </div>
              )}

              {/* Chat Messages */}
              {activeMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isPlayer ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-2.5 text-xs shadow-md relative ${
                      msg.isPlayer
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    {!msg.isPlayer && (
                      <div className="text-[10px] font-bold text-emerald-400 mb-0.5">
                        {msg.senderName}
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-300 opacity-80">
                      <span>{msg.timestamp}</span>
                      {msg.isPlayer && (
                        <span 
                          className="flex items-center gap-0.5 ml-1 inline-flex"
                          title={msg.deliveryStatus === 'read' || msg.read ? `Read at ${msg.readAtTimestamp || msg.timestamp}` : 'Delivered (Delivered to recipient)'}
                        >
                          <CheckCheck
                            className={`w-3.5 h-3.5 transition-colors duration-500 ${
                              msg.deliveryStatus === 'read' || msg.read ? 'text-cyan-300' : 'text-slate-400'
                            }`}
                          />
                          {(msg.deliveryStatus === 'read' || msg.read) && msg.readAtTimestamp && (
                            <span className="text-[7.5px] text-cyan-300/90 font-medium">Read</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-3 py-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-slate-400 ml-1">{activeContact.name} is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Contextual Response Chips */}
            <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {activeContact.id === 'contact-mom' && (
                <>
                  <button onClick={() => handleSendMessage('Aai, reached office safely! How are you and Baba?')} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-900 border border-slate-700 text-slate-300 whitespace-nowrap">
                    "Aai, reached office safely!"
                  </button>
                  <button onClick={() => handleSendMessage('I will come home this weekend for sure! ❤️')} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-900 border border-slate-700 text-slate-300 whitespace-nowrap">
                    "I will come home this weekend ❤️"
                  </button>
                </>
              )}
              {activeContact.id === 'contact-rohan' && (
                <>
                  <button onClick={() => handleSendMessage('Bro 8 PM Baner dinner is locked! See you there!')} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-900 border border-slate-700 text-slate-300 whitespace-nowrap">
                    "8 PM dinner locked! See you there!"
                  </button>
                  <button onClick={() => handleSendMessage('Ready for Saturday Sinhagad trek! 5 AM sharp.')} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-900 border border-slate-700 text-slate-300 whitespace-nowrap">
                    "Ready for Saturday Sinhagad trek! 🏔️"
                  </button>
                </>
              )}
              {activeContact.id === 'contact-neha' && (
                <>
                  <button onClick={() => handleSendMessage('Looking forward to Sunday coffee at Goodluck! ☕✨')} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-900 border border-slate-700 text-slate-300 whitespace-nowrap">
                    "Looking forward to Sunday coffee! ☕"
                  </button>
                  <button onClick={() => handleSendMessage('Show me your new sketches when we meet! 😊')} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-900 border border-slate-700 text-slate-300 whitespace-nowrap">
                    "Show me your new sketches! 🎨"
                  </button>
                </>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder={`Message ${activeContact.name}...`}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-800 text-xs text-white px-3 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-full transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex-1 sm:flex flex-col items-center justify-center bg-slate-950 text-slate-500 text-xs p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 mb-3 border border-slate-800">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-300 text-sm mb-1">WhatsApp Personal & Social Messaging</h3>
            <p className="max-w-xs text-slate-500">
              Select a friend, family member, or colleague to start interactive private conversations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
