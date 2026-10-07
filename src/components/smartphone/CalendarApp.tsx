import React from 'react';
import { PersonalLifeState } from '../../types/smartphone';
import { Calendar as CalendarIcon, Clock, MapPin, Users, AlertTriangle, Plus } from 'lucide-react';

interface CalendarAppProps {
  personalLife: PersonalLifeState;
}

export const CalendarApp: React.FC<CalendarAppProps> = ({ personalLife }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-sm">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Personal Life Calendar</h2>
            <p className="text-[10px] text-slate-400">Events, Outings & Dates</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {personalLife.personalCalendar.map(evt => (
          <div
            key={evt.id}
            className={`p-3.5 rounded-2xl bg-slate-900 border space-y-2 ${
              evt.conflictWithWork ? 'border-amber-600/80 bg-amber-950/20' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-rose-300 border border-slate-700">
                {evt.category}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{evt.dateTimeString}</span>
            </div>

            <h3 className="text-xs font-bold text-slate-100">{evt.title}</h3>

            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{evt.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-indigo-400" />
                <span>{evt.attendees.join(', ')}</span>
              </span>
            </div>

            {evt.conflictWithWork && (
              <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-[10px] text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Conflict warning: Overlaps with late office sprint deployment window.</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
