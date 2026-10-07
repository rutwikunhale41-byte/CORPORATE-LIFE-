import React from 'react';
import {
  Building2,
  TrendingUp,
  ShieldAlert,
  Award,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Briefcase,
  Flame,
  Zap,
  Sparkles,
  ArrowUpRight,
  Newspaper,
  Globe,
  Video
} from 'lucide-react';
import { GameState } from '../types/game';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  gameState: GameState;
  onNavigate: (tab: NavTab) => void;
  onOpenTask: (taskId: string) => void;
  onOpenChannel: (channelId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  gameState,
  onNavigate,
  onOpenTask,
  onOpenChannel,
}) => {
  const { player, reputation, tasks, incident, emails, channels, memories, reviews, characters } = gameState;

  const pendingTasks = tasks.filter(t => t.status !== 'DONE');
  const unreadEmails = emails.filter(e => !e.isRead);

  const managerChar = characters.find(c => c.id === player.managerId);
  const managerName = managerChar?.name || player.roleProfile?.reports_to?.split('(')[0]?.trim() || (player.title.toLowerCase().includes('hr') ? 'Priya Sharma' : 'Sneha Rao');
  const teamLabel = player.team || player.department;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-3.5rem)]">
      {/* Top Banner Alert if Incident is Active */}
      {incident.active && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/30 font-mono text-xs font-bold uppercase">
                  {incident.severity} ACTIVE
                </span>
                <span className="font-extrabold text-base">{incident.title}</span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                {incident.description} SLA: {incident.slaMinutesRemaining} minutes remaining before breach.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('incident')}
            className="px-4 py-2 rounded-lg bg-white text-red-700 font-bold text-xs hover:bg-red-50 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Enter Incident Room</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Row 1: Profile & Key Career Level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Profile Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20">
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {player.name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800">
                    ID: {player.id}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{player.title}</span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{teamLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Annual Salary</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {player.currency}{player.salary.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => onNavigate('career')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 transition-colors"
                title="View Compensation & Career Progression"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile metadata pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Manager</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                {managerName}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Probation Status</div>
              <div className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {player.probationDaysLeft} Days Left
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Location</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                {player.location.split('/')[0]}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Work Email</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate text-[11px]">
                {player.email}
              </div>
            </div>
          </div>
        </div>

        {/* Career Level & XP Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between border border-blue-900/50">
          <div>
            <div className="flex items-center justify-between text-xs text-blue-200">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Corporate Level</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                Level {player.level}
              </span>
            </div>
            <h3 className="text-xl font-black mt-1 text-white tracking-tight">
              {player.title}
            </h3>
            <p className="text-xs text-blue-200/80 mt-1">
              Deliver quality engineering, maintain stakeholder trust, and resolve outages to gain XP for promotion.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-800/40">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-blue-200">XP to Next Promotion</span>
              <span className="text-white font-mono">{player.xp} / {player.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (player.xp / player.nextLevelXp) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] text-blue-300/80">
              <span>Next: Level {player.level + 1}</span>
              <button 
                onClick={() => onNavigate('career')}
                className="hover:text-white font-semibold underline underline-offset-2"
              >
                Promotion Criteria
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Meetings Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-950/70 to-slate-900 border border-blue-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 text-blue-300">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-400/30">
                Calendar Interactive Meetings
              </span>
              <span className="text-[11px] text-slate-300">
                Day {gameState.currentDay} Schedule
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Live Video Syncs: Choose Passive, Assertive, or Collaborative Responses
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Voice your perspective during scheduled calendar syncs with Sneha, Deepak, and enterprise clients. Every stance directly shapes your 360° performance appraisal and colleague trust scores.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('calendar')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Open Meeting Calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 2: 360° Reputation Radar Meters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              360° Stakeholder Trust & Reputation
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Dynamically shifts based on every conversation and deadline
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Manager Trust */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Manager Trust</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{reputation.managerTrust}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  reputation.managerTrust >= 70 ? 'bg-emerald-500' : reputation.managerTrust >= 45 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${reputation.managerTrust}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">{managerName}</div>
          </div>

          {/* Team Trust */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Team Trust</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{reputation.teamTrust}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  reputation.teamTrust >= 70 ? 'bg-emerald-500' : reputation.teamTrust >= 45 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${reputation.teamTrust}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">{player.team || 'Colleagues & Peers'}</div>
          </div>

          {/* Customer Trust */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Customer Trust</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{reputation.customerTrust}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  reputation.customerTrust >= 70 ? 'bg-emerald-500' : reputation.customerTrust >= 45 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${reputation.customerTrust}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Apex Global (Vikramaditya)</div>
          </div>

          {/* Professional Reputation */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Professional</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{reputation.professionalReputation}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  reputation.professionalReputation >= 70 ? 'bg-emerald-500' : reputation.professionalReputation >= 45 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${reputation.professionalReputation}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Integrity & Ownership</div>
          </div>

          {/* HR Reputation */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>HR Standing</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{reputation.hrReputation}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  reputation.hrReputation >= 70 ? 'bg-emerald-500' : reputation.hrReputation >= 45 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${reputation.hrReputation}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Priya Sharma (HR BP)</div>
          </div>
        </div>
      </div>

      {/* Row 3: Actionable Workspace Grid (Tasks, Recent Messages, Memory Tracker) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks & Jira sprint */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Sprint Tasks</h3>
              </div>
              <button 
                onClick={() => onNavigate('tasks')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View Jira ({pendingTasks.length})
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {pendingTasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  onClick={() => onOpenTask(task.id)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{task.id}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                      task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      task.priority === 'SEV-1' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Due Day {task.deadlineDay} at {task.deadlineHour}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="w-full mt-4 py-2 text-xs font-semibold text-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Open Backlog & Sprint Board
          </button>
        </div>

        {/* Corporate Messages & Quick Chats */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Channels</h3>
              </div>
              <button 
                onClick={() => onNavigate('messages')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Open Slack/Teams
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {channels.slice(0, 4).map(channel => (
                <div
                  key={channel.id}
                  onClick={() => onOpenChannel(channel.id)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {channel.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {channel.topic || 'Team channel'}
                    </div>
                  </div>
                  {channel.unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      {channel.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('messages')}
            className="w-full mt-4 py-2 text-xs font-semibold text-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Launch Chat Hub
          </button>
        </div>

        {/* Real-time Memory & Promises System */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Real-Time Memory</h3>
              </div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                Permanent
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {memories.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-6 text-center">
                  No memories recorded yet. Characters remember commitments, deadlines, and conflicts.
                </div>
              ) : (
                memories.slice(-3).reverse().map(mem => (
                  <div
                    key={mem.id}
                    className="p-2.5 rounded-xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/40 dark:bg-purple-950/20 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-purple-700 dark:text-purple-300 font-semibold mb-1">
                      <span>Day {mem.day} • {mem.type}</span>
                      <span>{mem.involvedCharacters?.join(', ') || 'Team'}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                      {mem.summary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center">
            Sneha and Deepak hold you accountable to promises logged here.
          </div>
        </div>
      </div>

      {/* Row 4: Corporate News & Market Radar Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 shadow-xs border border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Google Search Grounded News</span>
              </span>
              <span className="text-xs text-blue-200/80 font-mono">Real-Time Intelligence</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-1">
              {gameState.newsItems?.[0]?.headline || 'Global Enterprise Cloud & AI Market Updates Active'}
            </h4>
            <p className="text-xs text-blue-200/70 line-clamp-1 mt-0.5">
              Review breaking industry events and take strategic actions to raise Manager Trust and Professional Reputation.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('news')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <span>Open Corporate News Radar</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
