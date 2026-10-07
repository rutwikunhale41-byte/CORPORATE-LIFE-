import React from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Flame,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Building2
} from 'lucide-react';
import { GameState } from '../types/game';

interface AchievementsViewProps {
  gameState: GameState;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ gameState }) => {
  const { player, reputation, currentDay, tasks, reviews } = gameState;

  const allAchievements = [
    {
      id: 'ach-onboarding',
      title: 'Badge of Entry',
      description: 'Accepted offer and completed corporate onboarding at Nexora Global.',
      icon: Building2,
      isUnlocked: true,
      unlockedAt: 'Day 1',
    },
    {
      id: 'ach-first-ticket',
      title: 'First Sprint Delivery',
      description: 'Successfully completed and resolved your first assigned Jira task.',
      icon: CheckCircle2,
      isUnlocked: tasks.some(t => t.status === 'DONE'),
      unlockedAt: tasks.some(t => t.status === 'DONE') ? `Day ${currentDay}` : undefined,
    },
    {
      id: 'ach-incident',
      title: 'Crisis Averter (SEV-1)',
      description: 'Mitigated an active production outage while protecting enterprise client SLA.',
      icon: Flame,
      isUnlocked: player.achievements.some(a => a.id.includes('incident')),
      unlockedAt: player.achievements.find(a => a.id.includes('incident'))?.unlockedAt,
    },
    {
      id: 'ach-ownership',
      title: 'The Ownership Standard',
      description: 'Maintain manager trust above 75% without deflecting or making excuses.',
      icon: ShieldCheck,
      isUnlocked: reputation.managerTrust >= 75,
      unlockedAt: reputation.managerTrust >= 75 ? `Day ${currentDay}` : undefined,
    },
    {
      id: 'ach-client-whisperer',
      title: 'Enterprise Diplomat',
      description: 'Gain >65% customer trust with demanding enterprise client Vikramaditya Singhania.',
      icon: Star,
      isUnlocked: reputation.customerTrust >= 65,
      unlockedAt: reputation.customerTrust >= 65 ? `Day ${currentDay}` : undefined,
    },
    {
      id: 'ach-negotiator',
      title: 'Master Negotiator',
      description: 'Successfully negotiate a compensation revision with Sneha and HR.',
      icon: TrendingUp,
      isUnlocked: player.salary > 500000,
      unlockedAt: player.salary > 500000 ? `Day ${currentDay}` : undefined,
    },
    {
      id: 'ach-promoted',
      title: 'Stepping Up',
      description: 'Earn a corporate promotion from Level 1 to Level 2 or higher.',
      icon: Award,
      isUnlocked: player.level >= 2,
      unlockedAt: player.level >= 2 ? `Day ${currentDay}` : undefined,
    },
    {
      id: 'ach-flawless-review',
      title: 'Top Tier Performer',
      description: 'Receive an overall rating of 4.5+ / 5.0 on a formal 360° monthly appraisal.',
      icon: Zap,
      isUnlocked: reviews.some(r => r.overallRating >= 4.5),
      unlockedAt: reviews.find(r => r.overallRating >= 4.5)?.timestamp,
    },
  ];

  const unlockedCount = allAchievements.filter(a => a.isUnlocked).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-purple-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-400/30">
              Corporate Milestones
            </span>
            <span className="text-xs text-purple-200">Career Badges</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Workplace Achievements
          </h1>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            Proof of your impact, crisis management, and engineering rigor at Nexora Global.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-purple-300 font-semibold uppercase">Unlocked</div>
          <div className="text-2xl font-black font-mono mt-0.5">
            {unlockedCount} / {allAchievements.length}
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allAchievements.map(ach => {
          const Icon = ach.icon;

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                ach.isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400'
                  : 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ach.isUnlocked
                      ? 'bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {ach.isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  {ach.isUnlocked && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                {ach.isUnlocked ? `Earned: ${ach.unlockedAt}` : 'Requirement Not Yet Met'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
