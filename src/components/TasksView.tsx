import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle,
  FileCode,
  Users,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Terminal,
  Zap,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Check,
  ShieldCheck,
  Key,
  Copy,
  ArrowRight,
  RotateCcw,
  Award,
  Layers,
  Search,
  Briefcase,
  ShieldAlert,
  Send,
  UserCheck,
  Building2,
  FileText,
  Sliders,
  ChevronDown,
  Info,
  Flame
} from 'lucide-react';
import { GameState, Task, TaskStatus, Priority, JobRoleProfile } from '../types/game';
import { JOB_ROLE_PROFILES, validateTaskForRole, resolveRoleProfile } from '../data/jobRoleProfiles';
import { initializeWorkplaceData } from '../data/jobRoleInitializer';

interface TasksViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  onAdvanceTime: (minutes: number) => void;
  onJumpToChat: (channelId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  gameState,
  onUpdateGameState,
  onAdvanceTime,
  onJumpToChat,
}) => {
  const { tasks, player, currentDay, currentHour, currentMinute } = gameState;
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'execute' | 'context' | 'details'>('execute');

  // Week 1 Systems Orientation state
  const [isOrientationUnderstood, setIsOrientationUnderstood] = useState<boolean>(() => {
    return localStorage.getItem('week1_systems_understood') === 'true';
  });
  const [showOrientationModal, setShowOrientationModal] = useState<boolean>(false);

  // Execution terminal state
  const [terminalLogs, setTerminalLogs] = useState<Array<{ command: string; output: string; timestamp: string }>>([]);
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);
  const [isExecutingCommand, setIsExecutingCommand] = useState<boolean>(false);
  const [workLogModal, setWorkLogModal] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Job Role Profile Modals & Escalation State
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalationMemo, setEscalationMemo] = useState('');
  const [escalationSuccessMsg, setEscalationSuccessMsg] = useState<string | null>(null);

  const activeRoleProfile: JobRoleProfile =
    player.roleProfile || resolveRoleProfile(player.title, player.department);

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  // Validation boundary check
  const roleValidation = selectedTask
    ? validateTaskForRole(selectedTask, activeRoleProfile)
    : { isAllowed: true, ownershipCategory: 'DIRECT_OWNERSHIP' as const, reason: '' };

  // Reset state when switching tasks - directly to execute!
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTerminalLogs([]);
    setExecutedCommands([]);
    setWorkLogModal(null);
    setEscalationSuccessMsg(null);
    setActiveTab('execute');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRolePresetChange = (roleKey: string) => {
    const newProfile = JOB_ROLE_PROFILES[roleKey];
    if (!newProfile) return;

    const mockOffer = {
      title: newProfile.job_title,
      department: newProfile.department,
      company: player.company || 'Nexora Global',
    };
    const workplaceData = initializeWorkplaceData(mockOffer, player.name);

    let teamName = newProfile.department;
    const titleLower = newProfile.job_title.toLowerCase();
    if (titleLower.includes('hr') || titleLower.includes('people') || titleLower.includes('talent')) {
      teamName = 'People Operations & Talent Acquisition';
    } else if (titleLower.includes('admin') || titleLower.includes('facility') || titleLower.includes('workplace')) {
      teamName = 'Corporate Services & Facilities';
    } else if (titleLower.includes('finance') || titleLower.includes('treasury') || titleLower.includes('analyst')) {
      teamName = 'Corporate Finance & Treasury';
    } else if (titleLower.includes('strategy') || titleLower.includes('operation')) {
      teamName = 'Business Strategy & Operations';
    } else if (titleLower.includes('scada')) {
      teamName = 'SCADA & Industrial Automation Systems';
    } else {
      teamName = 'Cloud Platform & Infrastructure';
    }

    const conformingChannels = workplaceData.channels.map(c => ({
      ...c,
      type: c.type as any,
      conversationStatus: (c.conversationStatus === 'resolved' ? 'idle' : c.conversationStatus) as any,
    }));
    const conformingTasks = workplaceData.tasks.map(t => ({
      ...t,
      status: (t.status === 'COMPLETED' ? 'DONE' : t.status) as any,
    }));

    onUpdateGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        title: newProfile.job_title,
        department: newProfile.department,
        team: teamName,
        managerId: workplaceData.managerId,
        roleProfile: newProfile,
      },
      tasks: conformingTasks.length > 0 ? conformingTasks : prev.tasks,
      channels: conformingChannels.length > 0 ? conformingChannels : prev.channels,
      emails: workplaceData.emails.length > 0 ? workplaceData.emails : prev.emails,
    }));
    if (conformingTasks.length > 0 && conformingTasks[0]) {
      setSelectedTaskId(conformingTasks[0].id);
    }
    setIsRoleSwitchModalOpen(false);
  };

  const handleMarkOrientationUnderstood = () => {
    setIsOrientationUnderstood(true);
    localStorage.setItem('week1_systems_understood', 'true');
    setShowOrientationModal(false);

    onUpdateGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        xp: prev.player.xp + 60,
        technicalSkills: Math.min(100, prev.player.technicalSkills + 3),
      },
      reputation: {
        ...prev.reputation,
        managerTrust: Math.min(100, prev.reputation.managerTrust + 6),
        teamTrust: Math.min(100, prev.reputation.teamTrust + 5),
        professionalReputation: Math.min(100, prev.reputation.professionalReputation + 5),
      },
      memories: [
        ...prev.memories,
        {
          id: `mem-week1-orientation-${Date.now()}`,
          day: currentDay,
          type: 'ACHIEVEMENT' as const,
          summary: `Completed Week 1 systems, toolchain & architecture orientation for ${activeRoleProfile.job_title}. Unlocked critical production tasks.`,
          involvedCharacters: ['Sneha Rao', 'Priya Sharma'],
          status: 'HONORED' as const,
        },
      ],
    }));
  };

  const handleExecuteCommand = (cmd: { command: string; description: string; expectedOutput: string }) => {
    if (isExecutingCommand) return;
    setIsExecutingCommand(true);

    const nowStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        {
          command: cmd.command,
          output: cmd.expectedOutput,
          timestamp: nowStr,
        },
      ]);
      setExecutedCommands(prev => (prev.includes(cmd.command) ? prev : [...prev, cmd.command]));
      setIsExecutingCommand(false);

      // Auto update task to IN_PROGRESS if TODO
      if (selectedTask.status === 'TODO') {
        onUpdateGameState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => (t.id === selectedTask.id ? { ...t, status: 'IN_PROGRESS' } : t)),
        }));
      }
    }, 500);
  };

  // Perform realistic MNC task escalation
  const handlePerformEscalation = () => {
    if (!selectedTask || !roleValidation.suggestedEscalation) return;
    setIsEscalating(true);

    const target = roleValidation.suggestedEscalation;

    setTimeout(() => {
      setIsEscalating(false);
      setEscalationSuccessMsg(
        `Ticket successfully escalated to ${target.targetCharacterName} (${target.targetRole} - ${target.targetDepartment}). Handover memo logged.`
      );

      onUpdateGameState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === selectedTask.id
            ? {
                ...t,
                status: 'REVIEW' as TaskStatus,
                isEscalated: true,
                escalation_role: target.targetRole,
                escalation_department: target.targetDepartment,
                escalationResolution: `Resolved by ${target.targetCharacterName} (${target.targetRole}): Root-cause investigated and cross-functional technical handover completed.`,
              }
            : t
        ),
        player: {
          ...prev.player,
          xp: prev.player.xp + 60,
          communication: Math.min(100, prev.player.communication + 2),
        },
        reputation: {
          ...prev.reputation,
          professionalReputation: Math.min(100, prev.reputation.professionalReputation + 3),
          teamTrust: Math.min(100, prev.reputation.teamTrust + 2),
        },
        memories: [
          ...prev.memories,
          {
            id: `mem-esc-${Date.now()}`,
            day: currentDay,
            type: 'DECISION' as const,
            summary: `Properly escalated out-of-scope task ${selectedTask.id} to ${target.targetCharacterName} adhering to MNC boundary guidelines.`,
            involvedCharacters: [target.targetCharacterName, 'Sneha Rao'],
            status: 'HONORED' as const,
          },
        ],
      }));
    }, 1000);
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    onUpdateGameState(prev => {
      const isFinishing = newStatus === 'DONE';
      const updatedTasks = prev.tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));

      return {
        ...prev,
        tasks: updatedTasks,
        player: isFinishing
          ? {
              ...prev.player,
              xp: prev.player.xp + 120,
              performanceScore: Math.min(100, prev.player.performanceScore + 4),
              productivity: Math.min(100, prev.player.productivity + 3),
              technicalSkills: Math.min(100, prev.player.technicalSkills + 2),
            }
          : prev.player,
        reputation: isFinishing
          ? {
              ...prev.reputation,
              managerTrust: Math.min(100, prev.reputation.managerTrust + 5),
              teamTrust: Math.min(100, prev.reputation.teamTrust + 3),
              professionalReputation: Math.min(100, prev.reputation.professionalReputation + 4),
            }
          : prev.reputation,
        memories: isFinishing
          ? [
              ...prev.memories,
              {
                id: `mem-task-${Date.now()}`,
                day: currentDay,
                type: 'ACHIEVEMENT' as const,
                summary: `Successfully completed role-specific deliverable ${taskId}: ${selectedTask.title}`,
                involvedCharacters: selectedTask.stakeholders,
                status: 'HONORED' as const,
              },
            ]
          : prev.memories,
      };
    });
  };

  const handleWorkOnTask = (task: Task) => {
    onAdvanceTime(60); // 1 hour of simulated work
    setWorkLogModal(
      `Investigated & completed operational deliverable on ${task.id} (${task.title}): Applied ${activeRoleProfile.job_title} methodology.`
    );
    if (task.status === 'TODO') {
      handleUpdateStatus(task.id, 'IN_PROGRESS');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  const allCommandsExecuted =
    selectedTask?.trainingGuide?.commandsToExecute &&
    selectedTask.trainingGuide.commandsToExecute.every(c => executedCommands.includes(c.command));

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900 select-none overflow-hidden flex-col">
      {/* Top Persistent Job Role Boundary Banner */}
      <div className="px-5 py-2.5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white truncate">
                {activeRoleProfile.job_title}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold border border-blue-500/30">
                {activeRoleProfile.seniority}
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                • {activeRoleProfile.department}
              </span>
              {isOrientationUnderstood && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 hidden sm:inline-flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>Systems Understood</span>
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 truncate hidden sm:block">
              Allowed Protocols: {activeRoleProfile.protocols.slice(0, 4).join(', ')} • Tools: {activeRoleProfile.tools.slice(0, 3).join(', ')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowOrientationModal(true)}
            className="px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-700/60 shadow-2xs"
            title="Review Week 1 systems, tools, architecture, and team introductions"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Week 1 Systems Intro</span>
            <span className="sm:hidden">Intro</span>
          </button>

          <button
            onClick={() => setIsJdModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Official JD</span>
          </button>

          <button
            onClick={() => setIsRoleSwitchModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Switch your active engineering role for testing boundaries"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch Role</span>
          </button>
        </div>
      </div>

      {/* Week 1 Systems & Environment Introduction Banner (Dismissible / Actionable) */}
      {!isOrientationUnderstood && (
        <div className="bg-gradient-to-r from-blue-900/90 via-indigo-950 to-slate-900 border-b border-indigo-500/40 p-4 sm:px-6 text-white shrink-0 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 font-extrabold text-[10px] uppercase tracking-wider border border-blue-400/30">
                  Week 1 Comprehensive Orientation
                </span>
                <span className="text-xs text-blue-300 font-semibold">
                  Introduce Everything First
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Welcome to {player.company || 'Nexora Global'} • {activeRoleProfile.department}
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Before executing high-impact tasks, get oriented: your reporting manager is <span className="text-blue-300 font-semibold">{activeRoleProfile.reports_to}</span>. Your allowed toolchains are <span className="text-emerald-300 font-mono text-[11px]">{activeRoleProfile.tools.join(', ')}</span>. Out-of-scope issues escalate directly to cross-functional leads.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowOrientationModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                Inspect Full Systems Briefing
              </button>

              <button
                onClick={handleMarkOrientationUnderstood}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Systems Understood & Unlock Critical Tasks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Backlog & Task Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Task List / Sprint Backlog Left Column */}
        <div className="w-80 sm:w-96 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Sprint Backlog
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isOrientationUnderstood ? 'Critical Production Tasks Assigned' : 'Week 1 Orientation & Setup'}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
              {tasks.filter(t => t.status !== 'DONE').length} Active
            </span>
          </div>

          {/* Filter Pills */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex gap-1 text-[11px] overflow-x-auto">
            {['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Task Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredTasks.map(task => {
              const isSelected = task.id === selectedTask?.id;
              const isCritical = task.priority === 'HIGH' || task.priority === 'SEV-1' || task.title.toLowerCase().includes('critical');
              const isDirectOwnership = (task.owner_role || '').toLowerCase().includes(activeRoleProfile.job_title.toLowerCase().split(' ')[0]);

              return (
                <div
                  key={task.id}
                  onClick={() => handleSelectTask(task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 shadow-xs ring-1 ring-blue-500/50'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
                      {task.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isCritical && (
                        <span className="px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-extrabold text-[9px] flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-red-600" />
                          <span>CRITICAL</span>
                        </span>
                      )}
                      {isDirectOwnership ? (
                        <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px]">
                          Your Role
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[9px]">
                          Cross-Team
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                          task.priority === 'SEV-1'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due Day {task.deadlineDay}, {task.deadlineHour}</span>
                    </div>

                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Task Workspace (Direct Live Execution Sandbox by default) */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
          {selectedTask ? (
            <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
              {/* Role Responsibility Boundary Card */}
              <div
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
                  roleValidation.ownershipCategory === 'DIRECT_OWNERSHIP'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                    : roleValidation.ownershipCategory === 'CROSS_FUNCTIONAL_COLLABORATION'
                    ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200'
                    : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {roleValidation.ownershipCategory === 'DIRECT_OWNERSHIP' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-[11px]">
                      {roleValidation.ownershipCategory.replace(/_/g, ' ')}
                    </span>
                    <p className="mt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
                      {roleValidation.reason}
                    </p>
                  </div>
                </div>

                {roleValidation.suggestedEscalation && (
                  <button
                    onClick={handlePerformEscalation}
                    disabled={isEscalating || selectedTask.isEscalated}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shrink-0 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{selectedTask.isEscalated ? 'Escalated' : 'Escalate Ticket'}</span>
                  </button>
                )}
              </div>

              {/* Task Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {selectedTask.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedTask.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : selectedTask.priority === 'SEV-1'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {selectedTask.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                    Status: {selectedTask.status.replace('_', ' ')}
                  </span>
                  {(selectedTask.priority === 'HIGH' || selectedTask.priority === 'SEV-1') && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-extrabold flex items-center gap-1 border border-red-500/30">
                      <Flame className="w-3 h-3 text-red-500" />
                      <span>Critical Task</span>
                    </span>
                  )}
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedTask.title}
                </h1>
              </div>

              {/* Practical Tab Navigation (Default to Live Execution Sandbox) */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 p-1 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl">
                <button
                  onClick={() => setActiveTab('execute')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'execute'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs ring-1 ring-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>1. Live Execution Sandbox (Direct Work)</span>
                </button>

                <button
                  onClick={() => setActiveTab('context')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'context'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-blue-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>2. Technical SOP & Architecture Guide</span>
                </button>

                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'details'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Ticket Scope</span>
                </button>
              </div>

              {/* TAB 1: LIVE EXECUTION & TERMINAL SANDBOX (DEFAULT) */}
              {activeTab === 'execute' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Execution Header & Progress */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold uppercase tracking-wider">
                          {activeRoleProfile.job_title} Operations Sandbox
                        </span>
                      </div>
                      {selectedTask.trainingGuide?.commandsToExecute ? (
                        <span className="font-mono text-[11px] text-slate-400">
                          Executed: {executedCommands.length} /{' '}
                          {selectedTask.trainingGuide.commandsToExecute.length}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Active Role Workspace
                        </span>
                      )}
                    </div>

                    {selectedTask.trainingGuide?.commandsToExecute && (
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 transition-all duration-300"
                          style={{
                            width: `${
                              (executedCommands.length /
                                selectedTask.trainingGuide.commandsToExecute.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Available Action Commands if defined */}
                  {selectedTask.trainingGuide?.commandsToExecute && selectedTask.trainingGuide.commandsToExecute.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Operational Actions (Click to Execute Directly)
                        </h3>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          Direct execution without quiz blockers
                        </span>
                      </div>

                      {selectedTask.trainingGuide.commandsToExecute.map((cmd, idx) => {
                        const isDone = executedCommands.includes(cmd.command);

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border transition-all ${
                              isDone
                                ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                                    {idx + 1}
                                  </span>
                                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                    {cmd.description}
                                  </span>
                                </div>

                                <div className="font-mono text-xs bg-slate-950 text-emerald-400 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap border border-slate-800">
                                  {cmd.command}
                                </div>
                              </div>

                              <button
                                onClick={() => handleExecuteCommand(cmd)}
                                disabled={isExecutingCommand}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                              >
                                {isDone ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Re-run</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Execute</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Live Terminal Output Console */}
                  <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl font-mono text-xs">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold text-slate-300 ml-2">
                          console — {activeRoleProfile.job_title.toLowerCase().replace(/\s+/g, '-')}-worker
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">Live Operation Output</span>
                    </div>

                    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                      {terminalLogs.length === 0 ? (
                        <div className="text-slate-500 italic">
                          Click 'Execute' above or 'Deep Work on Ticket' below to run real operational commands...
                        </div>
                      ) : (
                        terminalLogs.map((log, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="text-blue-400 flex items-center gap-2">
                              <span className="text-slate-600">[{log.timestamp}]</span>
                              <span className="text-emerald-400">$</span>
                              <span className="text-white font-bold">{log.command}</span>
                            </div>
                            <div className="text-slate-300 pl-4 whitespace-pre-wrap leading-relaxed">
                              {log.output}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Completion Block */}
                  {allCommandsExecuted && selectedTask.status !== 'DONE' && (
                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
                            All Operational Steps Complete!
                          </h4>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            You've applied {activeRoleProfile.job_title} methodology and validated the ticket resolution.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpdateStatus(selectedTask.id, 'DONE')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors shrink-0 cursor-pointer"
                      >
                        Complete & Close Ticket
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TECHNICAL SOP & ARCHITECTURE GUIDE (NO QUIZ) */}
              {activeTab === 'context' && selectedTask.trainingGuide && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Concept Overview Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4" />
                      <span>{activeRoleProfile.job_title} SOP: {selectedTask.trainingGuide.conceptTitle}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {selectedTask.trainingGuide.summary}
                    </p>

                    <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 bg-white/60 dark:bg-slate-900/40 p-3 rounded-xl">
                      <span className="font-bold block mb-1">💼 Real-World Corporate Practice:</span>
                      <span>{selectedTask.trainingGuide.realWorldContext}</span>
                    </div>
                  </div>

                  {/* Step-by-Step Training SOP */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Operational Step-by-Step Instructions
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {selectedTask.trainingGuide.keySteps.length} Steps
                      </span>
                    </div>

                    {selectedTask.trainingGuide.keySteps.map(step => (
                      <div
                        key={step.stepNumber}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {step.stepNumber}
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                          {step.explanation}
                        </p>

                        {step.codeSnippet && (
                          <div className="ml-8 relative rounded-xl bg-slate-950 p-3 text-emerald-400 font-mono text-xs border border-slate-800">
                            <pre className="overflow-x-auto whitespace-pre-wrap">{step.codeSnippet}</pre>
                            <button
                              onClick={() => handleCopy(step.codeSnippet!)}
                              className="absolute right-2 top-2 p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {copiedCode === step.codeSnippet ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {step.commonMistakeToAvoid && (
                          <div className="ml-8 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span><strong>Watch out:</strong> {step.commonMistakeToAvoid}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button
                      onClick={() => setActiveTab('execute')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Live Execution Sandbox</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: TICKET DETAILS & ARCHITECTURE SPECS */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Deliverable Description
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {selectedTask.description}
                    </p>
                  </div>

                  {selectedTask.technicalContext && (
                    <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase text-[10px]">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Technical Architecture Specs</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedTask.technicalContext}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Business Impact</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {selectedTask.impact}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Key Stakeholders</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedTask.stakeholders.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Work log display if recently worked */}
              {workLogModal && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{workLogModal}</span>
                  </div>
                  <span className="text-[10px] text-blue-500 font-bold uppercase">+1h Time Spent</span>
                </div>
              )}

              {/* Escalation Success Alert */}
              {escalationSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{escalationSuccessMsg}</span>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWorkOnTask(selectedTask)}
                    disabled={selectedTask.status === 'DONE'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Deep Work on Ticket (+1h)</span>
                  </button>

                  <button
                    onClick={() => onJumpToChat('channel-standup')}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>Discuss in Standup</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status Transition buttons */}
                <div className="flex items-center gap-2">
                  {selectedTask.status !== 'IN_PROGRESS' && selectedTask.status !== 'DONE' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTask.id, 'IN_PROGRESS')}
                      className="px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200 cursor-pointer"
                    >
                      Set In Progress
                    </button>
                  )}

                  {selectedTask.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTask.id, 'REVIEW')}
                      className="px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 text-xs font-semibold hover:bg-purple-200 cursor-pointer"
                    >
                      Submit for PR Review
                    </button>
                  )}

                  {selectedTask.status !== 'DONE' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTask.id, 'DONE')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete & Close Ticket</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Select a Jira ticket from the backlog.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Week 1 Systems & Architecture Comprehensive Overview */}
      {showOrientationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Week 1 Systems & Architecture Comprehensive Briefing
                  </h3>
                  <p className="text-xs text-slate-400">
                    {player.company || 'Nexora Global'} • {activeRoleProfile.department} • {activeRoleProfile.job_title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOrientationModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Mission & Management */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-sm">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>1. Department Mission & Reporting Line</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You report directly to <strong className="text-slate-900 dark:text-white">{activeRoleProfile.reports_to}</strong>. Your primary mandate within {activeRoleProfile.department} is to safeguard uptime, adhere to operating standards, and maintain strict role boundaries.
                </p>
              </div>

              {/* Toolchains */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span>2. Core Systems & Toolchains</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Authorized Tools</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold">
                      {activeRoleProfile.tools.join(', ')}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Operating Protocols</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold">
                      {activeRoleProfile.protocols.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>3. Role Responsibilities & Direct Ownership</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc pl-5">
                  {activeRoleProfile.primary_responsibilities.slice(0, 4).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Critical Tasks Progression */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-sm">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>4. Transition to Critical High-Impact Tasks</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Now that you understand the systems, toolchains, and team boundaries, you are cleared to tackle high-stakes deliverables and SEV-1 production hotfixes. Click the confirmation below to unlock active critical tasks.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setShowOrientationModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dismiss
              </button>
              <button
                onClick={handleMarkOrientationUnderstood}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Systems Understood & Unlock Critical Tasks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Official Job Description & Responsibility Boundaries */}
      {isJdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Official Job Description & Responsibility Agreement
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeRoleProfile.job_title} • {activeRoleProfile.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsJdModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Role Purpose & Scope
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeRoleProfile.job_description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Direct Core Responsibilities
                </h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-5">
                  {activeRoleProfile.primary_responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider text-red-600 dark:text-red-400">
                  Strict Task Boundaries (Requires Escalation)
                </h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-5">
                  {activeRoleProfile.restricted_tasks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Switch Role Preset */}
      {isRoleSwitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Switch Active Role Preset
                </h3>
              </div>
              <button
                onClick={() => setIsRoleSwitchModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {Object.entries(JOB_ROLE_PROFILES).map(([key, profile]) => (
                <div
                  key={key}
                  onClick={() => handleRolePresetChange(key)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    profile.job_title === activeRoleProfile.job_title
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {profile.job_title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {profile.department} ({profile.seniority})
                    </p>
                  </div>
                  {profile.job_title === activeRoleProfile.job_title && (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
