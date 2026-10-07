import React, { useState } from 'react';
import { DatingProfile, DateScenario, PersonalLifeState } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { 
  Heart, 
  X, 
  Sparkles, 
  MapPin, 
  Coffee, 
  Calendar, 
  MessageSquare, 
  User, 
  Flame, 
  CheckCircle2, 
  Star, 
  ChevronRight,
  ArrowLeft,
  Send
} from 'lucide-react';

interface DatingAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
}

interface DatingChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isPlayer: boolean;
}

export const DatingApp: React.FC<DatingAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
}) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'dates'>('discover');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const candidateName = personalLife.candidateName || 'You';

  // Maintain custom dating chats state
  const [datingChats, setDatingChats] = useState<Record<string, DatingChatMessage[]>>({
    'date-sneha': [
      { id: 'dc-1', senderId: 'date-sneha', senderName: 'Sneha Kulkarni', text: 'Hey there! Loved your bio about exploring Pune cafes. ☕', timestamp: 'Yesterday', isPlayer: false },
      { id: 'dc-2', senderId: 'player', senderName: candidateName, text: 'Hey Sneha! Yes, Koregaon Park cafes are awesome.', timestamp: 'Yesterday', isPlayer: true },
    ],
    'date-aditi': [
      { id: 'dc-3', senderId: 'date-aditi', senderName: 'Aditi Rao', text: 'Hey! Are you free for a coffee this weekend? 🎨', timestamp: '10:00 AM', isPlayer: false },
    ]
  });

  const suggestedProfiles = personalLife.datingProfiles.filter(p => p.status === 'SUGGESTED');
  const matchedProfiles = personalLife.datingProfiles.filter(p => p.status === 'MATCHED' || p.status === 'DATING');
  const currentCard = suggestedProfiles[currentIndex];

  const handleMatch = (profileId: string) => {
    onUpdatePersonalLife(prev => ({
      ...prev,
      datingProfiles: prev.datingProfiles.map(p => {
        if (p.id === profileId) {
          return {
            ...p,
            status: 'MATCHED' as const,
            matchedAt: 'Just now',
          };
        }
        return p;
      }),
    }));
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const activeMatch = personalLife.datingProfiles.find(p => p.id === selectedMatchId);
  const activeMessages = selectedMatchId ? (datingChats[selectedMatchId] || []) : [];

  const handleSendDatingMessage = async () => {
    if (!chatInput.trim() || !selectedMatchId || !activeMatch) return;

    const typedText = chatInput.trim();
    setChatInput('');

    const playerMsg: DatingChatMessage = {
      id: `dc-msg-${Date.now()}`,
      senderId: 'player',
      senderName: candidateName,
      text: typedText,
      timestamp: 'Just now',
      isPlayer: true,
    };

    setDatingChats(prev => ({
      ...prev,
      [selectedMatchId]: [...(prev[selectedMatchId] || []), playerMsg],
    }));

    setIsTyping(true);

    try {
      const chatRes = await sendChatMessage({
        channel: { id: activeMatch.id, name: activeMatch.name, type: 'direct', topic: `DilConnect Match Chat: ${activeMatch.bio}` },
        activeCharacters: [{
          id: activeMatch.id,
          name: activeMatch.name,
          role: 'Dating Match',
          department: activeMatch.occupation,
          personality: 'Warm & romantic',
          communicationStyle: activeMatch.bio,
          trust: 80,
          respect: 80,
          rapport: activeMatch.compatibilityScore,
        }],
        conversationHistory: [...activeMessages, playerMsg],
        playerMessage: typedText,
        player: { name: candidateName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 12, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `That sounds really nice! 😊`;

      const replyMsg: DatingChatMessage = {
        id: `dc-reply-${Date.now()}`,
        senderId: activeMatch.id,
        senderName: activeMatch.name,
        text: replyText,
        timestamp: 'Just now',
        isPlayer: false,
      };

      setTimeout(() => {
        setDatingChats(prev => ({
          ...prev,
          [selectedMatchId]: [...(prev[selectedMatchId] || []), replyMsg],
        }));
        setIsTyping(false);
      }, 1200);

      // Boost closeness in general contacts list if they match
      onUpdatePersonalLife(prev => {
        return {
          ...prev,
          datingProfiles: prev.datingProfiles.map(p => {
            if (p.id === selectedMatchId) {
              return {
                ...p,
                lastChatText: replyText,
              };
            }
            return p;
          }),
        };
      });

    } catch (err) {
      console.warn('DilConnect Match Chat AI error:', err);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* App Header */}
      {!selectedMatchId ? (
        <div className="p-3 bg-gradient-to-r from-rose-950 via-pink-950 to-slate-950 border-b border-rose-900/60 flex items-center justify-between shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center font-extrabold text-white text-base shadow">
              💖
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-rose-100 tracking-tight flex items-center gap-1">
                <span>DilConnect</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-900/80 text-rose-300 border border-rose-700">Dating</span>
              </h2>
            </div>
          </div>

          <div className="flex bg-slate-900 p-0.5 rounded-lg text-xs border border-slate-800">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-2.5 py-1 rounded-md font-bold transition ${activeTab === 'discover' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-2.5 py-1 rounded-md font-bold transition ${activeTab === 'matches' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
            >
              Matches ({matchedProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('dates')}
              className={`px-2.5 py-1 rounded-md font-bold transition ${activeTab === 'dates' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
            >
              Dates
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-rose-950 border-b border-rose-900 text-white flex items-center justify-between shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedMatchId(null)} className="p-1 hover:bg-rose-900 rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold">{activeMatch?.name}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold">
              {activeMatch?.compatibilityScore}% Match
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px]">
            🔥
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-between">
        {!selectedMatchId ? (
          <>
            {/* Discover / Swipe Deck */}
            {activeTab === 'discover' && (
              currentCard ? (
                <div className="h-full flex flex-col justify-between max-w-sm mx-auto w-full">
                  {/* Profile Card */}
                  <div className="flex-1 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col relative">
                    <div className="h-64 bg-slate-800 relative shrink-0">
                      <img
                        src={currentCard.photos[0]}
                        alt={currentCard.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-700 text-[10px] font-bold text-rose-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-rose-400" />
                        <span>{currentCard.compatibilityScore}% Compatibility</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-4">
                        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                          <span>{currentCard.name}, {currentCard.age}</span>
                        </h3>
                        <p className="text-xs text-rose-300 font-medium">{currentCard.occupation}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{currentCard.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto flex-1">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">About Me</h4>
                        <p className="text-xs text-slate-200 leading-relaxed">{currentCard.bio}</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Interests & Vibes</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {currentCard.interests.map((int, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-rose-300 border border-slate-700">
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-6 pt-3 shrink-0">
                    <button
                      onClick={handlePass}
                      className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-400 flex items-center justify-center shadow-lg transition transform active:scale-90"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleMatch(currentCard.id)}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white flex items-center justify-center shadow-xl transition transform active:scale-95"
                    >
                      <Heart className="w-7 h-7 fill-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                  <Sparkles className="w-10 h-10 text-rose-400 mb-2 animate-bounce" />
                  <h3 className="font-bold text-slate-200 text-sm">All Profiles Reviewed!</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Check back tomorrow for new profile suggestions in Pune!
                  </p>
                </div>
              )
            )}

            {/* Matches Tab */}
            {activeTab === 'matches' && (
              <div className="space-y-3 w-full">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Your Active Matches & Connection History
                </div>
                {matchedProfiles.map(match => (
                  <div
                    key={match.id}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:bg-slate-800/80 transition cursor-pointer"
                    onClick={() => setSelectedMatchId(match.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={match.photos[0]}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover border border-rose-500/60"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{match.name}, {match.age}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
                            {match.compatibilityScore}% Match
                          </span>
                        </h4>
                        <p className="text-[10px] text-rose-300 font-medium">{match.occupation}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{match.lastChatText || match.bio}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatchId(match.id);
                        }}
                        className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition shadow"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Dates Tab */}
            {activeTab === 'dates' && (
              <div className="space-y-3 w-full">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Scheduled Date Scenarios & Chemistry Outings
                </div>
                {personalLife.dates.map(date => (
                  <div
                    key={date.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-sm">
                          {date.matchAvatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-rose-100">{date.venueName}</h4>
                          <p className="text-[10px] text-slate-400">{date.venueType} • {date.dateTime}</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        {date.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Coffee & Art Gallery outing scheduled with {date.matchName}. Chemistry score will shape relationship milestones!
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Active Chat Thread with Match */
          <div className="flex-1 flex flex-col justify-between overflow-hidden -mx-3 -my-3 h-[420px] bg-slate-950">
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              <div className="text-[10px] text-slate-500 text-center font-bold">
                DilConnect Encrypted Connection Active ✨
              </div>

              {activeMessages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.isPlayer ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow ${
                    m.isPlayer 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-tr-none' 
                      : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{m.text}</p>
                    <span className="text-[8px] opacity-60 text-right block mt-1">{m.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-[10px] text-rose-400 italic animate-pulse">
                  {activeMatch?.name} is typing a sweet response...
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Type a message...`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendDatingMessage()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleSendDatingMessage}
                className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
