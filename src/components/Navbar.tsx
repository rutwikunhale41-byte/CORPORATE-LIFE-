import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  Calendar, 
  FastForward, 
  ShieldCheck, 
  Flame, 
  Save, 
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { GameState } from '../types/game';
import { universalAiEngine } from '../services/universalAiEngine';

interface NavbarProps {
  gameState: GameState;
  onAdvanceTime: (minutes: number) => void;
  onEndDay: () => void;
  onSaveGame: () => void;
  hasGeminiKey: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenIncident: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  gameState,
  onAdvanceTime,
  onEndDay,
  onSaveGame,
  hasGeminiKey,
  isDarkMode,
  onToggleDarkMode,
  onOpenIncident,
}) => {
  const { player, reputation, incident, currentDay, currentHour, currentMinute, difficulty, isHired } = gameState;

  const [aiStatus, setAiStatus] = useState<string>('Embedded AI');

  useEffect(() => {
    universalAiEngine.checkConnection().then(res => {
      setAiStatus(res.connected ? 'Embedded AI Active' : 'Embedded AI (LFM2.5)');
    });
  }, []);

  const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  const isWorkHours = currentHour >= 9 && currentHour < 18;
  const companyName = player.company || 'NEXORA GLOBAL';

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm font-extrabold tracking-wide uppercase truncate max-w-[130px] sm:max-w-none">
                {isHired ? companyName : 'MNC SIMULATOR'}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold tracking-normal">
                {isHired ? 'TIER-1' : 'JOB MARKET'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {isHired ? player.department : 'Pre-Employment Candidate Hub'}
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

        {/* Player mini card */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{player.name}</span>
          {isHired ? (
            <>
              <span className="text-slate-400">({player.id})</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                L{player.level}: {player.title.split(' ')[0]}
              </span>
            </>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-[11px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Active Candidate (Unemployed)
            </span>
          )}
        </div>
      </div>

      {/* Center: Workday Clock & Time Controls */}
      {isHired ? (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Day {currentDay}</span>
            <span className="text-slate-400">•</span>
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono">{timeString}</span>
            {!isWorkHours && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-normal">
                After Hours
              </span>
            )}
          </div>

          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => onAdvanceTime(15)}
              title="Advance 15 Minutes"
              className="px-2 py-1 text-[11px] font-medium rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              +15m
            </button>
            <button
              onClick={() => onAdvanceTime(60)}
              title="Advance 1 Hour"
              className="px-2 py-1 text-[11px] font-medium rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              +1h
            </button>
            <button
              onClick={onEndDay}
              title="End Workday and Advance to Next Morning"
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
            >
              <FastForward className="w-3 h-3" />
              <span className="hidden sm:inline">End Day</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-slate-900 dark:text-white">Job Search Phase</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Pass Interviews to Earn Day 1 Offer</span>
        </div>
      )}

      {/* Right: Status Indicators & Actions */}
      <div className="flex items-center gap-2">
        {/* Active Incident Alert */}
        {incident.active && (
          <button
            onClick={onOpenIncident}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-bold animate-pulse shadow-sm shadow-red-500/30 hover:bg-red-500 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SEV-1 OUTAGE</span>
            <span className="font-mono text-[11px]">{incident.slaMinutesRemaining}m SLA</span>
          </button>
        )}

        {/* Embedded AI Engine Badge */}
        <div
          title="In-Game AI Engine: LFM2.5-2.6B-Q4_K_M.gguf (Embedded llama.cpp Runtime)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="hidden lg:inline">{aiStatus}</span>
          <span className="lg:hidden">AI</span>
        </div>

        {/* Reputation mini badge */}
        <div 
          title={`Manager Trust: ${reputation.managerTrust}% | Team: ${reputation.teamTrust}% | Customer: ${reputation.customerTrust}%`}
          className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-slate-900 dark:text-white">{reputation.managerTrust}%</span>
          <span className="text-[10px] text-slate-400">Trust</span>
        </div>

        {/* Save button */}
        <button
          onClick={onSaveGame}
          title="Save Career Progress"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          title="Toggle Theme"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
