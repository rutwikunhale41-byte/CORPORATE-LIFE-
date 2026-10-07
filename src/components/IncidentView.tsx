import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  Terminal,
  Activity,
  CheckCircle2,
  RotateCcw,
  Zap,
  Users,
  MessageSquare,
  ShieldCheck,
  Server,
  Briefcase,
  Layers,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { GameState, Incident } from '../types/game';
import { getRoleIncident, ROLE_INCIDENTS, RoleIncidentConfig } from '../data/roleIncidentData';

interface IncidentViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  onJumpToWarRoom: () => void;
  onAdvanceTime: (minutes: number) => void;
}

export const IncidentView: React.FC<IncidentViewProps> = ({
  gameState,
  onUpdateGameState,
  onJumpToWarRoom,
  onAdvanceTime,
}) => {
  const { incident, player, reputation, currentDay, currentHour, currentMinute } = gameState;
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);

  // Determine role-specific incident config
  const defaultRoleConfig = getRoleIncident(player.title, player.department);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>(defaultRoleConfig.roleCategory);

  const activeRoleConfig: RoleIncidentConfig =
    ROLE_INCIDENTS[selectedRoleCategory] || defaultRoleConfig;

  const handleTriggerIncident = () => {
    onUpdateGameState(prev => ({
      ...prev,
      incident: {
        active: true,
        id: activeRoleConfig.id,
        title: activeRoleConfig.title,
        severity: activeRoleConfig.severity,
        description: activeRoleConfig.description,
        slaMinutesRemaining: activeRoleConfig.slaMinutesRemaining,
        affectedServices: activeRoleConfig.affectedServices,
        customerEscalationLevel: activeRoleConfig.customerEscalationLevel,
        logs: activeRoleConfig.logs,
        status: 'ACTIVE',
      },
      reputation: {
        ...prev.reputation,
        customerTrust: Math.max(0, prev.reputation.customerTrust - 5),
      },
    }));
    setActionLog([
      `[${currentHour}:${currentMinute.toString().padStart(2, '0')}] ${activeRoleConfig.severity} Incident declared by ${player.name} (${player.title}).`,
      `[${currentHour}:${currentMinute.toString().padStart(2, '0')}] Incident Command active: ${activeRoleConfig.categoryLabel}. Emergency bridge initiated.`
    ]);
  };

  const handleTakeAction = (actionTitle: string, logMessage: string, slaBonus: number, trustBonus: number) => {
    onAdvanceTime(10);
    const nowStr = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
    setActionLog(prev => [
      `[${nowStr}] ${logMessage}`,
      ...prev,
    ]);

    onUpdateGameState(prev => {
      const newSla = Math.min(60, prev.incident.slaMinutesRemaining + slaBonus);
      const newLogs = [
        `[${nowStr}] INFO [incident-response] ${actionTitle} executed successfully.`,
        ...prev.incident.logs,
      ];

      return {
        ...prev,
        incident: {
          ...prev.incident,
          slaMinutesRemaining: newSla,
          logs: newLogs,
        },
        reputation: {
          ...prev.reputation,
          managerTrust: Math.min(100, prev.reputation.managerTrust + trustBonus),
          professionalReputation: Math.min(100, prev.reputation.professionalReputation + 2),
        },
        player: {
          ...prev.player,
          xp: prev.player.xp + 35,
        },
      };
    });
  };

  const handleResolveIncident = () => {
    setIsResolving(true);
    onAdvanceTime(15);
    const nowStr = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;

    onUpdateGameState(prev => ({
      ...prev,
      incident: {
        ...prev.incident,
        active: false,
        status: 'RESOLVED',
        logs: [
          `[${nowStr}] RESOLVED: ${activeRoleConfig.resolutionSummary}`,
          ...prev.incident.logs,
        ],
      },
      reputation: {
        ...prev.reputation,
        managerTrust: Math.min(100, prev.reputation.managerTrust + 12),
        customerTrust: Math.min(100, prev.reputation.customerTrust + 15),
        teamTrust: Math.min(100, prev.reputation.teamTrust + 10),
        professionalReputation: Math.min(100, prev.reputation.professionalReputation + 10),
      },
      player: {
        ...prev.player,
        xp: prev.player.xp + 300,
        performanceScore: Math.min(100, prev.player.performanceScore + 6),
        technicalSkills: Math.min(100, prev.player.technicalSkills + 4),
        achievements: [
          ...prev.player.achievements,
          {
            id: `ach-incident-${Date.now()}`,
            title: activeRoleConfig.achievementTitle,
            description: activeRoleConfig.achievementDesc,
            icon: 'Flame',
            unlockedAt: `Day ${currentDay}`,
          },
        ],
      },
      memories: [
        ...prev.memories,
        {
          id: `mem-incident-${Date.now()}`,
          day: currentDay,
          type: 'ACHIEVEMENT',
          summary: `Demonstrated decisive crisis leadership during ${prev.incident.id} (${activeRoleConfig.title}). Successfully resolved under role responsibilities.`,
          involvedCharacters: activeRoleConfig.involvedCharacters,
          status: 'HONORED',
        },
      ],
    }));

    setTimeout(() => setIsResolving(false), 800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Role Responsibility & Incident Command Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                Incident Command Center: {activeRoleConfig.categoryLabel}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
                Active Role: {player.title || 'Specialist'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Crisis scenarios, blast radius, diagnostics, and triage playbooks dynamically calibrated to your department ({player.department || 'Corporate'}).
            </p>
          </div>
        </div>

        {/* Role Crisis Scenario Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Role Calibration:</span>
          <select
            value={selectedRoleCategory}
            onChange={e => setSelectedRoleCategory(e.target.value)}
            disabled={incident.active}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
          >
            <option value="HR">People Ops & HR Crisis</option>
            <option value="FINANCE">Corporate Finance & Audit Crisis</option>
            <option value="MARKETING">Brand Strategy & PR Crisis</option>
            <option value="ADMIN">Workplace & Facilities Crisis</option>
            <option value="SCADA">SCADA & Telemetry Crisis</option>
            <option value="SOFTWARE">Cloud & Backend Microservice Crisis</option>
          </select>
        </div>
      </div>

      {/* Top Header Card */}
      <div className={`p-6 rounded-2xl border text-white shadow-lg transition-all ${
        incident.active
          ? 'bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 border-red-500/60 ring-1 ring-red-500/30'
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-slate-700'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                incident.active ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
              }`}>
                {incident.active ? `${incident.severity} LIVE CRISIS OUTAGE` : 'ALL DEPARTMENT SYSTEMS HEALTHY'}
              </span>
              <span className="text-xs font-mono text-slate-300">
                {incident.active ? incident.id : activeRoleConfig.id}
              </span>
              <span className="text-xs text-slate-400">
                • {activeRoleConfig.categoryLabel}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {incident.active ? incident.title : `Nominal Status: ${activeRoleConfig.title}`}
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {incident.active
                ? incident.description
                : `All department services and statutory compliance metrics are currently nominal. Press the button below to test your ${player.title} crisis response playbooks.`}
            </p>

            {incident.active && activeRoleConfig.stakeholderAlert && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-400 shrink-0" />
                <span>{activeRoleConfig.stakeholderAlert}</span>
              </div>
            )}
          </div>

          {/* Right SLA countdown widget */}
          {incident.active ? (
            <div className="p-4 rounded-xl bg-black/50 border border-red-500/50 text-center shrink-0 min-w-[170px] shadow-inner">
              <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider">
                Contractual SLA Remaining
              </div>
              <div className="text-3xl font-black font-mono text-red-400 mt-0.5">
                {incident.slaMinutesRemaining}m
              </div>
              <div className="text-[10px] text-red-200 mt-1">
                Before Client / Regulatory Breach
              </div>
            </div>
          ) : (
            <button
              onClick={handleTriggerIncident}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 self-start md:self-auto transition-all cursor-pointer hover:scale-[1.02]"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Simulate Role SEV-1 Crisis</span>
            </button>
          )}
        </div>
      </div>

      {incident.active && (
        <>
          {/* Architecture Blast Radius & Affected Services */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>Critical Blast Radius ({incident.affectedServices.length} Department Systems Degraded)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {incident.affectedServices.map((service, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {service}
                      </h4>
                      <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wide">
                        Degraded / Critical Alert
                      </span>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Incident Mitigation Playbook */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mitigation Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Emergency Triage Playbook ({player.title || 'Specialist'})
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Each action takes 10 mins
                </span>
              </div>

              <div className="space-y-2.5">
                {activeRoleConfig.actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() =>
                      handleTakeAction(
                        action.title,
                        action.logMessage,
                        action.slaBonus,
                        action.trustBonus
                      )
                    }
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                        +{action.slaBonus}m SLA
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {action.subtitle}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                      Impact: {action.reputationImpact}
                    </div>
                  </button>
                ))}

                <button
                  onClick={onJumpToWarRoom}
                  className="w-full p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Join Live War Room Channel (#incident-sev1-war-room)</span>
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                      Live sync bridge with {activeRoleConfig.involvedCharacters.join(', ')}.
                    </div>
                  </div>
                  <Users className="w-4 h-4 text-blue-500 shrink-0" />
                </button>
              </div>

              {/* Complete Resolution */}
              <div className="pt-2">
                <button
                  onClick={handleResolveIncident}
                  disabled={isResolving}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Incident Mitigated & Submit Post-Mortem Signoff</span>
                </button>
              </div>
            </div>

            {/* Live Terminal Telemetry & Console Logs */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between text-xs font-mono text-slate-300">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <div className="flex items-center gap-2 text-red-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Real-Time Audit & Diagnostics Log Stream</span>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LIVE STREAM</span>
                  </span>
                </div>

                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                  {incident.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`text-[11px] leading-relaxed break-all ${
                        log.includes('CRITICAL') || log.includes('ERROR') || log.includes('ALERT')
                          ? 'text-red-400 font-semibold'
                          : log.includes('RESOLVED')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('INFO')
                          ? 'text-cyan-300'
                          : 'text-amber-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}

                  {actionLog.map((act, idx) => (
                    <div key={`act-${idx}`} className="text-[11px] text-blue-300">
                      &gt; {act}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>Department: {activeRoleConfig.categoryLabel}</span>
                <span>Security Clearance: LEVEL-4 HIGH</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!incident.active && (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeRoleConfig.categoryLabel}: Systems Operating Under Normal SLA
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            No active emergencies logged. Click "Simulate Role SEV-1 Crisis" above to test your {player.title} operational triage, team leadership, and emergency escalation.
          </p>
        </div>
      )}
    </div>
  );
};
