import React from 'react';
import { PersonalLifeState } from '../../types/smartphone';
import { FileText, Plus, Sparkles } from 'lucide-react';

interface NotesAppProps {
  personalLife: PersonalLifeState;
}

export const NotesApp: React.FC<NotesAppProps> = ({ personalLife }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white text-sm">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Notes & Goals</h2>
            <p className="text-[10px] text-slate-400">Personal Thoughts & Lists</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {personalLife.notes.map(note => (
          <div key={note.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300">{note.title}</h3>
              <span className="text-[10px] text-slate-500">{note.updatedAt}</span>
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
