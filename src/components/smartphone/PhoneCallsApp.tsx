import React, { useState, useEffect } from 'react';
import { PersonalContact, PersonalCallRecord, PersonalLifeState } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneMissed, 
  User, 
  Clock, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  Check,
  Send
} from 'lucide-react';

interface PhoneCallsAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  activeCallContact?: PersonalContact | null;
  onEndCall?: () => void;
}

export const PhoneCallsApp: React.FC<PhoneCallsAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  activeCallContact: propActiveCallContact,
  onEndCall,
}) => {
  const candidateName = personalLife.candidateName || 'Candidate';
  const [activeTab, setActiveTab] = useState<'recents' | 'contacts' | 'dialpad'>('recents');
  const [selectedContact, setSelectedContact] = useState<PersonalContact | null>(propActiveCallContact || null);
  const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'CONNECTED'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [callDialogue, setCallDialogue] = useState<Array<{ speaker: string; text: string }>>([]);
  const [dialNumber, setDialNumber] = useState('');
  const [customSpeakInput, setCustomSpeakInput] = useState('');
  const [interactionMode, setInteractionMode] = useState<'voice' | 'text'>('text');

  const handleCustomSpeak = async () => {
    if (!customSpeakInput.trim() || !selectedContact) return;

    const userText = customSpeakInput.trim();
    setCustomSpeakInput('');

    // Append player text immediately
    setCallDialogue(prev => [
      ...prev,
      { speaker: `${candidateName} (You)`, text: userText }
    ]);

    try {
      const chatRes = await sendChatMessage({
        channel: { id: selectedContact.id, name: selectedContact.name, type: 'direct', topic: `Ongoing Phone Call with ${selectedContact.name}` },
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
        conversationHistory: callDialogue.filter(d => d.speaker !== 'System').map((d, i) => ({
          id: `call-d-${i}`,
          senderId: d.speaker.includes('You') ? 'player' : selectedContact.id,
          senderName: d.speaker,
          text: d.text,
        })),
        playerMessage: userText,
        player: { name: candidateName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 10, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `Got it! Talk to you soon.`;

      setCallDialogue(prev => [
        ...prev,
        { speaker: selectedContact.name, text: replyText }
      ]);
    } catch (err) {
      console.warn('Phone call AI reply error:', err);
    }
  };

  // Handle call timer
  useEffect(() => {
    let interval: any = null;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Initiate call
  const startCallWith = (contact: PersonalContact) => {
    setSelectedContact(contact);
    setCallState('CALLING');
    setCallDuration(0);
    setCallDialogue([
      { speaker: 'System', text: `Dialing ${contact.name} (${contact.phone})...` }
    ]);

    setTimeout(() => {
      setCallState('CONNECTED');
      let intro = '';
      if (contact.id === 'contact-mom') {
        intro = `Hello beta! How are you? I was just thinking about you. Did you have lunch?`;
      } else if (contact.id === 'contact-rohan') {
        intro = 'Bro! Tell me, are we locking in dinner tonight at 8 PM?';
      } else if (contact.id === 'contact-neha') {
        intro = `Hey ${candidateName}! So nice of you to call. How is your day going?`;
      } else {
        intro = `Hey ${candidateName}! Good to hear from you. What’s up?`;
      }

      setCallDialogue(prev => [
        ...prev,
        { speaker: contact.name, text: intro }
      ]);
    }, 2000);
  };

  const handleSpeakOption = async (playerOptionText: string) => {
    if (!selectedContact) return;

    // Append player text immediately
    setCallDialogue(prev => [
      ...prev,
      { speaker: `${candidateName} (You)`, text: playerOptionText }
    ]);

    // Improve closeness & trust
    onUpdatePersonalLife(prev => {
      const updatedContacts = prev.contacts.map(c => {
        if (c.id === selectedContact.id) {
          return {
            ...c,
            closeness: Math.min(100, c.closeness + 2),
            trust: Math.min(100, c.trust + 2),
          };
        }
        return c;
      });
      return { ...prev, contacts: updatedContacts };
    });

    try {
      const chatRes = await sendChatMessage({
        channel: { id: selectedContact.id, name: selectedContact.name, type: 'direct', topic: `Ongoing Phone Call with ${selectedContact.name}` },
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
        conversationHistory: callDialogue.filter(d => d.speaker !== 'System').map((d, i) => ({
          id: `call-d-${i}`,
          senderId: d.speaker.includes('You') ? 'player' : selectedContact.id,
          senderName: d.speaker,
          text: d.text,
        })),
        playerMessage: playerOptionText,
        player: { name: candidateName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 10, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `Understood! Let's talk soon.`;

      setCallDialogue(prev => [
        ...prev,
        { speaker: selectedContact.name, text: replyText }
      ]);
    } catch (err) {
      console.warn('Phone call option AI reply error:', err);
    }
  };

  const endCall = () => {
    if (selectedContact && callState === 'CONNECTED') {
      const newCallRecord: PersonalCallRecord = {
        id: `call-${Date.now()}`,
        contactId: selectedContact.id,
        contactName: selectedContact.name,
        contactAvatar: selectedContact.avatar,
        type: 'outgoing',
        timestamp: 'Just now',
        durationSeconds: callDuration,
        summaryNote: `Call duration ${Math.floor(callDuration / 60)}m ${callDuration % 60}s.`,
      };

      onUpdatePersonalLife(prev => ({
        ...prev,
        callHistory: [newCallRecord, ...prev.callHistory],
      }));
    }

    setCallState('IDLE');
    setSelectedContact(null);
    if (onEndCall) onEndCall();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If in an active call screen
  if (callState !== 'IDLE' && selectedContact) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-white p-4 justify-between relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center pt-6 z-10">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
            {callState === 'CALLING' ? 'Ringing...' : 'In Call • ' + formatTimer(callDuration)}
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-3xl font-bold mx-auto my-3 shadow-lg border-2 border-emerald-400">
            {selectedContact.avatar}
          </div>
          <h2 className="text-lg font-bold text-white">{selectedContact.name}</h2>
          <p className="text-xs text-slate-400">{selectedContact.relationshipType} • {selectedContact.phone}</p>
        </div>

        {/* Call Dialogue Stream */}
        <div className="flex-1 overflow-y-auto my-4 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2.5 z-10 max-h-48 text-xs">
          {callDialogue.map((d, idx) => (
            <div key={idx} className={`p-2 rounded-xl ${d.speaker.includes('You') ? 'bg-emerald-900/40 text-emerald-200 text-right' : 'bg-slate-800 text-slate-200'}`}>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5">{d.speaker}</div>
              <div>{d.text}</div>
            </div>
          ))}
        </div>

        {/* Text Input for Custom Speech during Call */}
        {callState === 'CONNECTED' && (
          <div className="z-10 space-y-2 my-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customSpeakInput}
                onChange={e => setCustomSpeakInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustomSpeak()}
                placeholder={`Speak/Type to ${selectedContact.name}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCustomSpeak}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Say</span>
              </button>
            </div>

            {/* Quick Speech Options */}
            <div className="space-y-1 text-[11px]">
              {selectedContact.id === 'contact-mom' && (
                <button
                  onClick={() => handleSpeakOption('Aai, I had lunch! How are you and Baba?')}
                  className="w-full p-2 bg-slate-900/90 hover:bg-emerald-950 text-left rounded-xl border border-slate-800/80 text-xs text-slate-200"
                >
                  "Aai, I had lunch! How are you and Baba?"
                </button>
              )}
              {selectedContact.id === 'contact-rohan' && (
                <button
                  onClick={() => handleSpeakOption('Bro dinner tonight at 8 PM in Baner is locked!')}
                  className="w-full p-2 bg-slate-900/90 hover:bg-emerald-950 text-left rounded-xl border border-slate-800/80 text-xs text-slate-200"
                >
                  "Bro 8 PM dinner tonight is locked!"
                </button>
              )}
              {selectedContact.id === 'contact-neha' && (
                <button
                  onClick={() => handleSpeakOption('Looking forward to Sunday coffee at Cafe Goodluck!')}
                  className="w-full p-2 bg-slate-900/90 hover:bg-emerald-950 text-left rounded-xl border border-slate-800/80 text-xs text-slate-200"
                >
                  "Looking forward to Sunday coffee!"
                </button>
              )}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="z-10 pt-2 pb-6 flex items-center justify-around">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full ${isMuted ? 'bg-rose-900 text-rose-300' : 'bg-slate-800 text-slate-300'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={endCall}
            className="p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg transition transform active:scale-95"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full ${isSpeaker ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans">
      {/* Top App Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Phone className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-sm text-slate-100">Phone & Calls</h2>
        </div>
        <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('recents')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeTab === 'recents' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Recents
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeTab === 'contacts' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('dialpad')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeTab === 'dialpad' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Keypad
          </button>
        </div>
      </div>

      {/* Recents Tab */}
      {activeTab === 'recents' && (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
            Recent Calls
          </div>
          {personalLife.callHistory.map(call => (
            <div key={call.id} className="p-2.5 flex items-center justify-between hover:bg-slate-900/60 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-base">
                  {call.contactAvatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{call.contactName}</span>
                    {call.type === 'missed' && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-rose-950 text-rose-400 border border-rose-800 rounded font-semibold">
                        Missed Call
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    {call.type === 'incoming' && <PhoneIncoming className="w-3 h-3 text-emerald-400" />}
                    {call.type === 'missed' && <PhoneMissed className="w-3 h-3 text-rose-400" />}
                    {call.type === 'outgoing' && <PhoneCall className="w-3 h-3 text-blue-400" />}
                    <span>{call.timestamp}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const contact = personalLife.contacts.find(c => c.id === call.contactId);
                  if (contact) startCallWith(contact);
                }}
                className="p-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 rounded-full border border-emerald-800"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {personalLife.contacts.map(contact => (
            <div key={contact.id} className="p-2.5 flex items-center justify-between hover:bg-slate-900/60 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${contact.color || 'from-blue-600 to-indigo-600'} flex items-center justify-center text-base font-bold`}>
                  {contact.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{contact.name}</h4>
                  <p className="text-[10px] text-slate-400">{contact.relationshipType} • {contact.phone}</p>
                </div>
              </div>

              <button
                onClick={() => startCallWith(contact)}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition shadow"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Keypad Tab */}
      {activeTab === 'dialpad' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-white tracking-widest h-10">
              {dialNumber || 'Enter Number'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(num => (
              <button
                key={num}
                onClick={() => setDialNumber(prev => prev + num)}
                className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-lg font-bold text-white flex items-center justify-center border border-slate-800 shadow"
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setDialNumber(prev => prev.slice(0, -1))}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const matchedContact = personalLife.contacts.find(c => c.phone.includes(dialNumber)) || personalLife.contacts[0];
                startCallWith(matchedContact);
              }}
              className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
