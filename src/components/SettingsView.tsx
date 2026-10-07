import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Sliders,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { GameState, DifficultyLevel } from '../types/game';
import { DeveloperAiPanel } from './DeveloperAiPanel';

interface SettingsViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  onSaveGame: () => void;
  onResetGame: () => void;
  hasGeminiKey: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  gameState,
  onUpdateGameState,
  onSaveGame,
  onResetGame,
  hasGeminiKey,
}) => {
  const { difficulty, isRomanceModeEnabled, player, currentDay } = gameState;
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const difficulties: { level: DifficultyLevel; desc: string }[] = [
    { level: 'Easy', desc: 'Forgiving managers, generous deadlines, and minor SLA penalties.' },
    { level: 'Normal', desc: 'Standard multinational corporate experience. Realistic accountability and expectations.' },
    { level: 'Hard', desc: 'Demanding managers, tight sprint deadlines, and impatient enterprise clients.' },
    { level: 'Expert', desc: 'Zero tolerance for excuses. Severe political pressures and multi-tier outages.' },
    { level: 'Executive', desc: 'Boardroom scrutiny, high-stakes contractual liabilities, and razor-thin margin for error.' },
  ];

  const handleManualSave = () => {
    onSaveGame();
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleExportSave = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gameState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexora_career_save_day_${currentDay}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.player && parsed.characters) {
          onUpdateGameState(() => parsed);
          alert('Career save loaded successfully!');
        } else {
          alert('Invalid save file structure.');
        }
      } catch (err) {
        alert('Failed to parse save JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Workplace Simulation Settings & Career Saves</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure corporate simulation difficulty, manage persistent save files, and inspect live AI connectivity.
        </p>
      </div>

      {/* Developer Local AI Engine Diagnostics & Testing Panel */}
      <DeveloperAiPanel gameState={gameState} />

      {/* Difficulty Level Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Corporate Difficulty & Stakeholder Pressure
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {difficulties.map(diff => (
            <button
              key={diff.level}
              onClick={() => onUpdateGameState(prev => ({ ...prev, difficulty: diff.level }))}
              className={`p-3 rounded-xl border text-left transition-all ${
                difficulty === diff.level
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="font-bold text-xs">{diff.level}</div>
              <div className={`text-[10px] mt-1 leading-snug line-clamp-3 ${
                difficulty === diff.level ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {diff.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Safe Social & Romance Mode */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Optional: Office Social & Life Relationships Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safe, consensual, non-explicit story-driven interactions with adult colleagues (coffee breaks, mutual support, friendship).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isRomanceModeEnabled}
              onChange={e => onUpdateGameState(prev => ({ ...prev, isRomanceModeEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </div>
      </div>

      {/* Save, Load, Export & Reset */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Save className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Career Data Persistence (Slot Storage)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleManualSave}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save to Browser Storage</span>
          </button>

          <button
            onClick={handleExportSave}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Save JSON</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Save File</span>
            <input type="file" accept=".json" onChange={handleImportSave} className="hidden" />
          </label>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Career saved successfully to browser local storage!</span>
          </div>
        )}

        {/* Reset / Restart Career Danger Zone */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Career (Reset from Day 1)</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-600 font-bold">
                Are you sure? All progress, reputation, and conversations will be wiped.
              </span>
              <button
                onClick={() => {
                  onResetGame();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Yes, Reset Career
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
