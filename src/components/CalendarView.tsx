import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  FastForward,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  Users,
  Video,
  FileText,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Flame,
  HandHeart,
  ArrowRight,
  Info
} from 'lucide-react';
import { GameState, HiddenEvaluation, GameMemory, Email } from '../types/game';
import { MeetingSession, MeetingDebrief } from '../types/meeting';
import { SCHEDULED_MEETINGS } from '../data/meetingsData';
import { MeetingEngine, outcomeParser } from './MeetingEngine';

interface CalendarViewProps {
  gameState: GameState;
  onUpdateGameState?: (updater: (prev: GameState) => GameState) => void;
  onAdvanceTime: (minutes: number) => void;
  onEndDay: () => void;
  onJumpToChat: (channelId: string) => void;
  hasGeminiKey?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  gameState,
  onUpdateGameState,
  onAdvanceTime,
  onEndDay,
  onJumpToChat,
  hasGeminiKey = false,
}) => {
  const { currentDay, currentHour, currentMinute, player } = gameState;

  // Active meeting modal state
  const [activeMeeting, setActiveMeeting] = useState<MeetingSession | null>(null);
  const [completedMeetingIds, setCompletedMeetingIds] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentTotalMins = currentHour * 60 + currentMinute;
  const startDayMins = 9 * 60; // 09:00 AM
  const endDayMins = 18 * 60; // 06:00 PM
  const dayProgress = Math.min(100, Math.max(0, ((currentTotalMins - startDayMins) / (endDayMins - startDayMins)) * 100));

  const scheduleItems = [
    {
      id: 'cal-standup-0915',
      meetingId: 'meeting-standup',
      time: '09:15 AM',
      hour: 9,
      minute: 15,
      duration: 15,
      title: 'Daily Core Engineering Standup (15m)',
      type: 'meeting',
      channelId: 'channel-standup',
      speaker: 'Sneha Rao & Deepak Joshi',
      attendeeCount: 4,
      tag: 'DAILY SYNC',
      description: 'Review staging telemetry blockers, test execution speed, and weekend on-call coverage.',
    },
    {
      id: 'cal-tech-triage-1100',
      meetingId: 'meeting-tech-triage',
      time: '11:00 AM',
      hour: 11,
      minute: 0,
      duration: 30,
      title: 'TASK-101: Telemetry Pipeline Kafka Triage',
      type: 'meeting',
      channelId: 'direct-deepak',
      speaker: 'Deepak Joshi & Vijay Menon',
      attendeeCount: 3,
      tag: 'ARCHITECTURE',
      description: 'Diagnose Kafka partition 3 consumer lag, DB lock contention, and debate in-process buffering.',
    },
    {
      id: 'cal-lunch-1300',
      meetingId: null,
      time: '01:00 PM',
      hour: 13,
      minute: 0,
      duration: 45,
      title: 'Catered Lunch & Coffee Break with Peers',
      type: 'break',
      channelId: 'channel-watercooler',
      speaker: 'Ananya Iyer & Karan Verma',
      attendeeCount: 4,
      tag: 'TEAM CULTURE',
      description: 'Decompress from sprint pressure, talk weekend plans, and connect socially with teammates.',
    },
    {
      id: 'cal-client-review-1430',
      meetingId: 'meeting-client-review',
      time: '02:30 PM',
      hour: 14,
      minute: 30,
      duration: 45,
      title: 'Apex Global Client Reliability Review',
      type: 'client',
      channelId: 'direct-vikramaditya',
      speaker: 'Vikramaditya Singhania & Sneha Rao',
      attendeeCount: 4,
      tag: 'HIGH STAKES CLIENT',
      description: 'High-stakes executive escalation with enterprise client VP over solar telemetry lag and SLA penalties.',
    },
    {
      id: 'cal-manager-1on1-1630',
      meetingId: 'meeting-manager-1on1',
      time: '04:30 PM',
      hour: 16,
      minute: 30,
      duration: 30,
      title: 'Weekly 1:1 Manager Sync with Sneha',
      type: 'meeting',
      channelId: 'direct-sneha',
      speaker: 'Sneha Rao (Manager)',
      attendeeCount: 2,
      tag: '1:1 APPRAISAL',
      description: 'Probation progress review, cross-functional peer relations, workload balance, and promotion trajectory.',
    },
    {
      id: 'cal-eod-1800',
      meetingId: null,
      time: '06:00 PM',
      hour: 18,
      minute: 0,
      duration: 15,
      title: 'End of Day Sign-off & EOD Slack Report',
      type: 'routine',
      channelId: 'channel-standup',
      speaker: 'Core Infra Team',
      attendeeCount: 5,
      tag: 'EOD WRAP',
      description: 'Post final sprint status to Slack, sync with APAC shift lead, and complete timesheet.',
    },
  ];

  // Open meeting modal
  const handleOpenMeeting = (meetingId: string) => {
    const found = SCHEDULED_MEETINGS.find(m => m.id === meetingId);
    if (found) {
      setActiveMeeting(found);
    }
  };

  // Process completed meeting debrief
  const handleCompleteMeeting = (debrief: MeetingDebrief) => {
    setActiveMeeting(null);
    setCompletedMeetingIds(prev => [...prev, debrief.meetingId]);

    // Show temporary banner
    setSuccessToast(
      `Meeting "${debrief.title}" completed (${debrief.primaryStyle.toUpperCase()} style)! Performance record and colleague relationships updated.`
    );
    setTimeout(() => setSuccessToast(null), 6000);

    if (onUpdateGameState) {
      onUpdateGameState(prev => {
        // Run outcomeParser to parse side effects, tasks, thank-you emails, and PerformanceView updates
        const result = outcomeParser(debrief, prev);

        // Show comprehensive feedback toast
        setSuccessToast(
          `Meeting "${debrief.title}" completed (${debrief.primaryStyle.toUpperCase()} style)! ${result.summaryMessage}`
        );
        setTimeout(() => setSuccessToast(null), 7000);

        return result.updatedGameState;
      });
    }

    // Advance time by meeting duration
    onAdvanceTime(debrief.durationMinutes || 15);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Toast notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workday Progress Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-400/30">
                Simulated Workday
              </span>
              <span className="text-xs text-slate-300">
                {gameState.player.company || 'Nexora Global'} (HQ)
              </span>
            </div>
            <h1 className="text-2xl font-black mt-1 tracking-tight">
              Day {currentDay} • {currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Standard operating hours: 09:00 AM – 06:00 PM. Attend calendar meetings to voice Passive, Assertive, or Collaborative responses that shape your 360° appraisal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdvanceTime(15)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors"
            >
              +15 Mins
            </button>
            <button
              onClick={() => onAdvanceTime(60)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors"
            >
              +1 Hour
            </button>
            <button
              onClick={onEndDay}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>End Day</span>
            </button>
          </div>
        </div>

        {/* Day progress bar */}
        <div className="mt-5 pt-3 border-t border-slate-700/60">
          <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span>Workday Elapsed ({Math.round(dayProgress)}%)</span>
            <span className="font-mono">
              {currentHour < 18 ? `${Math.max(0, 18 - currentHour)}h remaining` : 'After Hours'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dayProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Communication Response Guide Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Passive Response Style
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Defers decisions to leads, avoids conflict, takes notes. Safe from confrontation, but yields lower leadership and ownership ratings in 360° reviews.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Assertive Response Style
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Enforces technical standards, challenges unrealistic timelines, and takes bold ownership. Earns high respect from leadership, but risks friction if tone is too sharp.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <HandHeart className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Collaborative Response Style
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Bridges functional silos, proposes win-win compromises, and supports peers. Boosts Team Trust, coworker rapport, and cross-functional culture fit.
          </p>
        </div>
      </div>

      {/* Today's Agenda Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Today’s Interactive Calendar Agenda
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            Synced with Corporate Exchange
          </span>
        </div>

        <div className="space-y-3">
          {scheduleItems.map((item, idx) => {
            const itemMins = item.hour * 60 + item.minute;
            const isPast = currentTotalMins > itemMins + (item.duration || 30);
            const isCurrent = currentTotalMins >= itemMins - 15 && currentTotalMins <= itemMins + (item.duration || 30);
            const hasInteractiveMeeting = Boolean(item.meetingId);
            const isCompleted = completedMeetingIds.includes(item.meetingId || '');

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                  isCurrent
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                    : isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40'
                    : isPast
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-70'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`p-3 rounded-xl font-mono text-xs font-bold shrink-0 text-center min-w-[76px] ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.time}
                    <span className="block text-[9px] font-normal opacity-80 mt-0.5">
                      {item.duration}m
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>

                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                        {item.tag}
                      </span>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[9px] animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping" />
                          HAPPENING NOW
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] border border-emerald-400/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          EVALUATION LOGGED
                        </span>
                      )}

                      {isPast && !isCurrent && !isCompleted && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          (Finished)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{item.speaker}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Attend Interactive Meeting or Jump to Chat */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                  {hasInteractiveMeeting && (
                    <button
                      onClick={() => handleOpenMeeting(item.meetingId!)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                        isCurrent
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 animate-pulse'
                          : isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>
                        {isCompleted
                          ? 'Re-Enter Meeting'
                          : isCurrent
                          ? 'Join Live Video Sync'
                          : 'Attend Interactive Meeting'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => onJumpToChat(item.channelId)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Open Channel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Interactive Meeting Engine */}
      {activeMeeting && (
        <MeetingEngine
          meeting={activeMeeting}
          gameState={gameState}
          onClose={() => setActiveMeeting(null)}
          onCompleteMeeting={handleCompleteMeeting}
          hasGeminiKey={hasGeminiKey}
        />
      )}
    </div>
  );
};
