import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  CheckSquare,
  Calendar,
  Users,
  AlertOctagon,
  BarChart3,
  TrendingUp,
  Award,
  Settings,
  Flame,
  ChevronRight,
  Newspaper,
  Briefcase
} from 'lucide-react';
import { GameState } from '../types/game';

export type NavTab = 
  | 'dashboard' 
  | 'messages' 
  | 'email' 
  | 'tasks' 
  | 'news'
  | 'incident' 
  | 'calendar' 
  | 'team' 
  | 'performance' 
  | 'career' 
  | 'job_market'
  | 'achievements' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  gameState: GameState;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, gameState }) => {
  const { messages, emails, tasks, incident, channels } = gameState;

  // Calculate unread messages
  const totalUnreadMessages = channels.reduce((sum, ch) => sum + (ch.unreadCount || 0), 0);
  const unreadEmails = emails.filter(e => !e.isRead).length;
  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;
  // Calculate only unaccepted active offers; once hired or accepted, count is 0
  const activeOffersCount = !gameState.isHired
    ? (gameState.applications || []).filter(
        a => a.currentStage === 'OFFER_EXTENDED' && a.offer?.status !== 'ACCEPTED'
      ).length
    : 0;

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'messages' as NavTab, 
      label: 'Messages', 
      icon: MessageSquare, 
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
      badgeColor: 'bg-blue-600 text-white'
    },
    { 
      id: 'email' as NavTab, 
      label: 'Email', 
      icon: Mail, 
      badge: unreadEmails > 0 ? unreadEmails : undefined,
      badgeColor: 'bg-amber-600 text-white'
    },
    { 
      id: 'tasks' as NavTab, 
      label: 'Tasks & Jira', 
      icon: CheckSquare, 
      badge: pendingTasks > 0 ? pendingTasks : undefined,
      badgeColor: 'bg-slate-500 text-white'
    },
    {
      id: 'news' as NavTab,
      label: 'Corporate News',
      icon: Newspaper,
      badge: 'LIVE',
      badgeColor: 'bg-indigo-600 text-white'
    },
    { 
      id: 'incident' as NavTab, 
      label: 'Incident Room', 
      icon: AlertOctagon,
      urgent: incident.active,
      badge: incident.active ? 'SEV-1' : undefined,
      badgeColor: 'bg-red-600 text-white animate-pulse'
    },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: Calendar },
    { id: 'team' as NavTab, label: 'Team Directory', icon: Users },
    { id: 'performance' as NavTab, label: '360° Review', icon: BarChart3 },
    { id: 'career' as NavTab, label: 'Career & Salary', icon: TrendingUp },
    { 
      id: 'job_market' as NavTab, 
      label: 'Job Market (ATS)', 
      icon: Briefcase,
      badge: activeOffersCount > 0 ? `${activeOffersCount} Offer${activeOffersCount > 1 ? 's' : ''}` : undefined,
      badgeColor: 'bg-emerald-600 text-white animate-bounce'
    },
    { id: 'achievements' as NavTab, label: 'Achievements', icon: Award },
    { id: 'settings' as NavTab, label: 'Settings & Saves', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-slate-50/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between select-none shrink-0 h-[calc(100vh-3.5rem)]">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Workplace Hub
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : item.urgent
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.urgent ? 'text-red-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer corporate profile widget */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {gameState.player.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {gameState.player.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={gameState.player.department || gameState.player.team}>
              {gameState.player.department || gameState.player.team || 'Corporate Staff'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
