import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { GameState, Character } from '../types/game';

interface TeamViewProps {
  gameState: GameState;
  onJumpToChat: (channelId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ gameState, onJumpToChat }) => {
  const { characters, channels } = gameState;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const departments = ['ALL', 'Cloud Platform & Infrastructure', 'Product & Customer Solutions', 'People Operations & Culture', 'Enterprise Customer', 'Office of the CTO', 'Cybersecurity & Compliance', 'Site Reliability Engineering'];

  const filteredCharacters = characters.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || c.department.includes(selectedDept) || selectedDept.includes(c.department);
    return matchesSearch && matchesDept;
  });

  const handleMessageUser = (character: Character) => {
    // Find or create direct channel
    const directChannel = channels.find(ch => ch.type === 'direct' && ch.participantIds.includes(character.id));
    if (directChannel) {
      onJumpToChat(directChannel.id);
    } else {
      // Default to general or sneha
      onJumpToChat('direct-sneha');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Nexora Global Corporate Directory</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            20+ AI-controlled colleagues, managers, clients, and vendors. Every relationship evolves with your actions.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, role, department..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid of Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters.map(char => {
          return (
            <div
              key={char.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Header with Avatar and Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${char.color} flex items-center justify-center text-white font-extrabold text-sm shadow-xs`}>
                        {char.avatar}
                      </div>
                      {char.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {char.name}
                      </h3>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {char.role}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                        {char.department}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Age {char.age}
                  </span>
                </div>

                {/* Personality & Quirks */}
                <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white">Personality: </span>
                    {char.personality}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] italic">
                    "{char.quirks}"
                  </div>
                </div>

                {/* Relationship Gauges (Trust, Respect, Rapport) */}
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mb-0.5 font-semibold">Trust</div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs mb-1">{char.trust || 50}%</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${char.trust || 50}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mb-0.5 font-semibold">Respect</div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs mb-1">{char.respect || 50}%</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${char.respect || 50}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mb-0.5 font-semibold">Rapport</div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs mb-1">{char.rapport || 50}%</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${char.rapport || 50}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Latest Memory / Meeting Impression Note */}
                {char.memories && char.memories.length > 0 && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-950/20 p-2 rounded-lg border border-blue-100 dark:border-blue-900/30 line-clamp-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Impression: </span>
                    {char.memories[char.memories.length - 1]}
                  </div>
                )}
              </div>

              {/* Bottom Action */}
              <button
                onClick={() => handleMessageUser(char)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Chat</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
