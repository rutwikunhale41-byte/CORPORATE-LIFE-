import React, { useState } from 'react';
import { PersonalLifeState } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { Flame, Camera, Send, Smile, Sparkles, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';

interface SnapchatAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
}

interface SnapMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isPlayer: boolean;
  type?: 'text' | 'snap';
}

export const SnapchatApp: React.FC<SnapchatAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeSnapContact, setActiveSnapContact] = useState<string | null>(null);
  const [snapText, setSnapText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Maintain separate Snapchat chat histories in a local component state or sync it with the engine
  const [snapchatChats, setSnapchatChats] = useState<Record<string, SnapMessage[]>>({
    'contact-rohan': [
      { id: 'sc-1', senderId: 'contact-rohan', senderName: 'Rohan Deshmukh', text: 'Sent you a Snap! 👻', timestamp: 'Yesterday', isPlayer: false, type: 'snap' },
      { id: 'sc-2', senderId: 'contact-rohan', senderName: 'Rohan Deshmukh', text: 'Yo bro, did you check the trek photos?', timestamp: 'Yesterday', isPlayer: false, type: 'text' },
    ],
    'contact-neha': [
      { id: 'sc-3', senderId: 'contact-neha', senderName: 'Neha Joshi', text: 'Working on a new design layout right now! 💻', timestamp: '10:05 AM', isPlayer: false, type: 'text' },
    ],
    'contact-mom': [
      { id: 'sc-4', senderId: 'contact-mom', senderName: 'Aai (Mom)', text: 'Sent you a Snap! ❤️', timestamp: '08:15 AM', isPlayer: false, type: 'snap' },
    ]
  });

  const candidateName = personalLife.candidateName || 'Candidate';
  const selectedContact = personalLife.contacts.find(c => c.id === selectedContactId);
  const currentChats = selectedContactId ? (snapchatChats[selectedContactId] || []) : [];

  const handleSendSnap = async (contactId: string) => {
    const contact = personalLife.contacts.find(c => c.id === contactId);
    if (!contact) return;

    // Increment streak
    onUpdatePersonalLife(prev => {
      const currentStreak = prev.snapchatStreaks[contactId] || 1;
      return {
        ...prev,
        snapchatStreaks: {
          ...prev.snapchatStreaks,
          [contactId]: currentStreak + 1,
        },
      };
    });

    const typedSnapText = snapText.trim() || 'Sent a photo Snap 📷';

    const playerMsg: SnapMessage = {
      id: `sc-msg-${Date.now()}`,
      senderId: 'player',
      senderName: candidateName,
      text: typedSnapText,
      timestamp: 'Just now',
      isPlayer: true,
      type: 'snap',
    };

    setSnapchatChats(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), playerMsg],
    }));

    setSnapText('');
    setActiveSnapContact(null);
    setSelectedContactId(contactId); // Open chat view to see reply
    setIsTyping(true);

    // Call AI conversation engine to reply dynamically!
    try {
      const chatRes = await sendChatMessage({
        channel: { id: contact.id, name: contact.name, type: 'direct', topic: `Snapchat Chat: ${contact.bio}` },
        activeCharacters: [{
          id: contact.id,
          name: contact.name,
          role: contact.relationshipType,
          department: contact.occupation,
          personality: contact.mood,
          communicationStyle: contact.bio,
          trust: contact.trust,
          respect: contact.respect,
          rapport: contact.closeness,
        }],
        conversationHistory: [...currentChats, playerMsg],
        playerMessage: `Sending you a Snapchat snap with caption: "${typedSnapText}"`,
        player: { name: candidateName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 12, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `Awesome snap! 🔥`;

      const replyMsg: SnapMessage = {
        id: `sc-reply-${Date.now()}`,
        senderId: contact.id,
        senderName: contact.name,
        text: replyText,
        timestamp: 'Just now',
        isPlayer: false,
        type: 'text',
      };

      setTimeout(() => {
        setSnapchatChats(prev => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), replyMsg],
        }));
        setIsTyping(false);
      }, 1500);
    } catch (err) {
      console.warn('Snapchat AI snap reply error:', err);
      setIsTyping(false);
    }
  };

  const handleSendTextMessage = async () => {
    if (!chatInput.trim() || !selectedContactId || !selectedContact) return;

    const typedText = chatInput.trim();
    setChatInput('');

    const playerMsg: SnapMessage = {
      id: `sc-msg-${Date.now()}`,
      senderId: 'player',
      senderName: candidateName,
      text: typedText,
      timestamp: 'Just now',
      isPlayer: true,
      type: 'text',
    };

    setSnapchatChats(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), playerMsg],
    }));

    setIsTyping(true);

    try {
      const chatRes = await sendChatMessage({
        channel: { id: selectedContact.id, name: selectedContact.name, type: 'direct', topic: `Snapchat Chat: ${selectedContact.bio}` },
        activeCharacters: [{
          id: selectedContact.id,
          name: selectedContact.name,
          role: selectedContact.relationshipType,
          department: selectedContact.occupation,
          personality: selectedContact.mood,
          communicationStyle: selectedContact.bio,
          trust: selectedContact.trust,
          respect: selectedContact.respect,
          rapport: selectedContact.closeness,
        }],
        conversationHistory: [...currentChats, playerMsg],
        playerMessage: typedText,
        player: { name: candidateName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 12, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `Yo! What's up?`;

      const replyMsg: SnapMessage = {
        id: `sc-reply-${Date.now()}`,
        senderId: selectedContact.id,
        senderName: selectedContact.name,
        text: replyText,
        timestamp: 'Just now',
        isPlayer: false,
        type: 'text',
      };

      setTimeout(() => {
        setSnapchatChats(prev => ({
          ...prev,
          [selectedContactId]: [...(prev[selectedContactId] || []), replyMsg],
        }));
        setIsTyping(false);
      }, 1200);
    } catch (err) {
      console.warn('Snapchat AI text reply error:', err);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-yellow-400 text-slate-900 font-sans overflow-hidden">
      {/* Header */}
      {!selectedContactId ? (
        <div className="p-3 bg-yellow-400 border-b border-yellow-500 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-yellow-400 flex items-center justify-center font-extrabold text-sm">
              👻
            </div>
            <h2 className="font-extrabold text-base text-black tracking-tight">Snapchat</h2>
          </div>
          <div className="flex items-center gap-2 bg-yellow-300 px-2.5 py-1 rounded-full border border-yellow-500 text-xs font-extrabold text-black">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
            <span>Streaks Hub</span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedContactId(null)} className="p-1 hover:bg-slate-800 rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold">{selectedContact?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveSnapContact(selectedContactId)} className="p-1.5 bg-yellow-400 text-slate-950 rounded-full hover:bg-yellow-300">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Panel */}
      {!selectedContactId ? (
        <div className="flex-1 bg-slate-950 text-white overflow-y-auto p-3 space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Streaks & Chats
          </div>

          {personalLife.contacts.map(contact => {
            const streak = personalLife.snapchatStreaks[contact.id] || 0;
            const history = snapchatChats[contact.id] || [];
            const lastMsg = history[history.length - 1];

            return (
              <div
                key={contact.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:bg-slate-800/80 transition cursor-pointer"
                onClick={() => setSelectedContactId(contact.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center text-lg font-bold">
                    {contact.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{contact.name}</span>
                      {streak > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800 font-extrabold flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          <span>{streak}d</span>
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {lastMsg ? `${lastMsg.senderName.split(' ')[0]}: ${lastMsg.text}` : 'Tap to chat or send snap'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSnapContact(contact.id);
                  }}
                  className="p-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-full transition shadow"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Direct Snapchat Chat View */
        <div className="flex-1 bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {currentChats.map(m => (
              <div key={m.id} className={`flex flex-col ${m.isPlayer ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                  m.isPlayer 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {m.type === 'snap' ? (
                    <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                      <span>📷 Snap: {m.text}</span>
                    </div>
                  ) : (
                    <p>{m.text}</p>
                  )}
                  <span className="text-[8px] opacity-65 block text-right mt-1">{m.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[10px] text-slate-400 italic animate-pulse pl-1">
                {selectedContact?.name} is typing...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Send chat to ${selectedContact?.name}...`}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendTextMessage()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={handleSendTextMessage}
              className="p-2 bg-yellow-400 text-slate-950 rounded-xl hover:bg-yellow-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Snap Creation Overlay */}
      {activeSnapContact && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-4 flex flex-col justify-between text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-400">Send Snap</span>
            <button
              onClick={() => setActiveSnapContact(null)}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="aspect-[3/4] rounded-2xl bg-slate-900 border-2 border-yellow-400 overflow-hidden relative flex flex-col items-center justify-center p-4 my-auto">
            <Camera className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <p className="text-xs font-bold text-slate-200">Monsoon Filter Camera Active 🌧️</p>

            <input
              type="text"
              placeholder="Add a snap caption..."
              value={snapText}
              onChange={e => setSnapText(e.target.value)}
              className="mt-6 w-full max-w-xs p-2.5 bg-black/60 backdrop-blur-md text-xs text-white text-center rounded-xl border border-white/20 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          <button
            onClick={() => handleSendSnap(activeSnapContact)}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Snap + Keep Streak 🔥</span>
          </button>
        </div>
      )}
    </div>
  );
};
