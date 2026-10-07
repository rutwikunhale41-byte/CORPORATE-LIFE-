import React from 'react';
import { PersonalLifeState, PersonalContact } from '../../types/smartphone';
import { User, Phone, MessageSquare, Heart, ShieldCheck, Sparkles, MapPin, Search } from 'lucide-react';

interface ContactsAppProps {
  personalLife: PersonalLifeState;
  onStartCall: (contact: PersonalContact) => void;
  onOpenWhatsApp: (contactId: string) => void;
}

export const ContactsApp: React.FC<ContactsAppProps> = ({
  personalLife,
  onStartCall,
  onOpenWhatsApp,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Phonebook & Contacts</h2>
            <p className="text-[10px] text-slate-400">Personal & Professional Network</p>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
        {personalLife.contacts.map(contact => (
          <div key={contact.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:bg-slate-800/60 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${contact.color || 'from-indigo-500 to-purple-700'} flex items-center justify-center text-lg font-bold text-white shadow`}>
                  {contact.avatar}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{contact.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                      {contact.relationshipType}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">{contact.occupation} • {contact.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onStartCall(contact)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition shadow"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenWhatsApp(contact.id)}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition shadow"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Relationship Stats */}
            <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 border-t border-slate-800/60">
              <div>Trust: <span className="text-emerald-400 font-bold">{contact.trust}%</span></div>
              <div>Closeness: <span className="text-indigo-400 font-bold">{contact.closeness}%</span></div>
              {contact.romanticInterest && (
                <div>Romance: <span className="text-rose-400 font-bold">{contact.romanticInterest}%</span></div>
              )}
            </div>

            {/* Shared Memory */}
            {contact.memories && contact.memories.length > 0 && (
              <div className="text-[10px] text-slate-300 flex items-center gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{contact.memories[contact.memories.length - 1]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
