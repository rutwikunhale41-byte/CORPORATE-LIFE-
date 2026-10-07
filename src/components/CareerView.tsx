import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Briefcase,
  Flame,
  Send,
  MessageSquare,
  Users,
  Building2,
  Code2,
  BookOpen,
  Compass,
  ArrowRight
} from 'lucide-react';
import { GameState } from '../types/game';
import { negotiateSalary } from '../services/api';

interface CareerViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
}

export const CareerView: React.FC<CareerViewProps> = ({ gameState, onUpdateGameState }) => {
  const { player, reputation, currentDay, candidateProfile } = gameState;
  const [requestedSalary, setRequestedSalary] = useState<number>(Math.round(player.salary * 1.2));
  const [justification, setJustification] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<any>(null);
  const [showDirectionModal, setShowDirectionModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>(candidateProfile?.primaryCareerDomain || 'hr_people');

  const handleApplyCareerSwitch = (domainId: string, domainName: string, primaryRole: string) => {
    onUpdateGameState(prev => {
      const currentCand = prev.candidateProfile;
      if (!currentCand) return prev;

      let transferSkills = ['Communication', 'Corporate Documentation', 'Process Coordination', 'Excel'];
      let gaps = ['Domain Fundamentals', 'Industry Tools', 'Compliance'];
      let courses = ['Intro to Domain', 'Core Operations', 'Advanced Tools'];

      if (domainId === 'hr_people') {
        gaps = ['Recruitment & TA', 'HRMS/Workday', 'Labour Compliance', 'People Analytics'];
        courses = ['HR Fundamentals & Talent Acquisition', 'HR Operations & HRIS', 'People Analytics & Excel'];
      } else if (domainId === 'administration') {
        gaps = ['Facilities Management', 'Vendor Procurement', 'Asset Management'];
        courses = ['Corporate Facilities & Admin Ops', 'Vendor Management & Contracting'];
      } else if (domainId === 'finance_corporate') {
        gaps = ['Financial Modeling', 'SAP / Tally', 'Taxation Compliance'];
        courses = ['Corporate Financial Modeling', 'SAP Finance & Auditing'];
      }

      const updatedCand = {
        ...currentCand,
        primaryCareerDomain: domainId,
        targetCareerDirection: {
          primaryDomain: domainId,
          primaryRoleGoal: primaryRole,
          transitionStatus: 'IN_TRANSITION' as const,
          transferableSkills: transferSkills,
          skillGaps: gaps,
          completedCourses: [],
          completedProjects: [],
        },
      };

      // Also update personal life linkedIn jobs
      const updatedPersonalLife = prev.personalLife
        ? {
            ...prev.personalLife,
            notifications: [
              {
                id: `notif-switch-${Date.now()}`,
                app: 'work' as const,
                title: `Career Direction Updated: ${domainName}`,
                message: `Your career transition pathway is set! Your LinkedIn feed & ATS job recommendations now prioritize ${primaryRole} opportunities.`,
                timestamp: 'Just now',
                isRead: false,
              },
              ...prev.personalLife.notifications,
            ],
          }
        : prev.personalLife;

      return {
        ...prev,
        candidateProfile: updatedCand,
        personalLife: updatedPersonalLife,
      };
    });

    setShowDirectionModal(false);
  };

  const careerLevels = [
    { level: 1, title: 'Graduate Associate Engineer', salaryBand: '₹5,00,000 - ₹6,50,000', reqTrust: 50, reqXp: 0 },
    { level: 2, title: 'Software Engineer II', salaryBand: '₹7,00,000 - ₹9,50,000', reqTrust: 65, reqXp: 500 },
    { level: 3, title: 'Senior Software Engineer', salaryBand: '₹10,50,000 - ₹14,00,000', reqTrust: 72, reqXp: 1200 },
    { level: 4, title: 'Technical Lead', salaryBand: '₹15,00,000 - ₹20,00,000', reqTrust: 78, reqXp: 2200 },
    { level: 5, title: 'Engineering Manager', salaryBand: '₹22,00,000 - ₹30,00,000', reqTrust: 84, reqXp: 3500 },
    { level: 6, title: 'Senior Director of Engineering', salaryBand: '₹35,00,000 - ₹50,00,000', reqTrust: 90, reqXp: 5500 },
    { level: 7, title: 'Vice President of Global Technology', salaryBand: '₹60,00,000+', reqTrust: 95, reqXp: 8000 },
  ];

  const possibleEndings = [
    {
      title: 'Fast-Track Executive Promotion',
      type: 'VICTORY',
      desc: 'Achieve >85% Manager & Team Trust with high technical delivery. Promoted to Senior Engineering Leadership in record time.',
      status: reputation.managerTrust >= 85 && player.level >= 2 ? 'ACTIVE TRAJECTORY' : 'LOCKED',
    },
    {
      title: 'Distinguished Technical Fellow',
      type: 'VICTORY',
      desc: 'Become the undisputed subject matter authority on distributed zero-trust systems.',
      status: player.technicalSkills >= 85 ? 'ACTIVE TRAJECTORY' : 'LOCKED',
    },
    {
      title: 'International Expat Transfer',
      type: 'VICTORY',
      desc: 'Selected by Elena Rostova for relocation to Zurich or London Tech Headquarters.',
      status: reputation.professionalReputation >= 80 && player.xp >= 800 ? 'ACTIVE TRAJECTORY' : 'LOCKED',
    },
    {
      title: 'Solid Enterprise Contributor',
      type: 'AVERAGE',
      desc: 'Maintain steady sprint delivery with standard annual salary revisions.',
      status: 'DEFAULT BASELINE',
    },
    {
      title: 'Performance Improvement Plan (PIP)',
      type: 'TRAGEDY',
      desc: 'Manager trust drops below 35% or repeated missed SLAs lead to strict 30-day scrutiny.',
      status: reputation.managerTrust < 40 ? 'HIGH RISK' : 'SAFE',
    },
    {
      title: 'Corporate Termination',
      type: 'TRAGEDY',
      desc: 'Severe compliance violation, insubordination, or catastrophic customer contract loss.',
      status: reputation.managerTrust < 25 ? 'CRITICAL RISK' : 'SAFE',
    },
  ];

  const handleStartNegotiation = async () => {
    if (!justification.trim() || isNegotiating) return;

    setIsNegotiating(true);
    try {
      const res = await negotiateSalary({
        player,
        playerArgument: justification,
        reputation,
        currentSalary: player.salary,
        requestedSalary,
      });

      setNegotiationResult(res);

      if (res.status === 'ACCEPTED' || res.status === 'COUNTERED') {
        onUpdateGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            salary: res.agreedSalary || requestedSalary,
            xp: prev.player.xp + 50,
          },
          reputation: {
            ...prev.reputation,
            managerTrust: Math.min(100, Math.max(0, prev.reputation.managerTrust + (res.trustDelta || 1))),
          },
          memories: [
            ...prev.memories,
            {
              id: `mem-salary-${Date.now()}`,
              day: currentDay,
              type: 'DECISION',
              summary: `Negotiated salary compensation to ₹${(res.agreedSalary || requestedSalary).toLocaleString()}/yr with ${res.speakerName}.`,
              involvedCharacters: ['Sneha Rao', 'Priya Sharma'],
              status: 'HONORED',
            },
          ],
        }));
      }
    } catch (err) {
      console.error('Failed to negotiate salary:', err);
    } finally {
      setIsNegotiating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-blue-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-400/30">
              Level {player.level}
            </span>
            <span className="text-xs text-blue-200">Nexora Global Tech Ladder</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            {player.title}
          </h1>
          <p className="text-xs text-blue-200/80 mt-1 max-w-xl">
            Base Annual Compensation: <span className="font-extrabold text-white">{player.currency}{player.salary.toLocaleString()}</span> • Experience: {player.joiningDate}
          </p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs text-blue-300 font-semibold uppercase">Promotion Progress</div>
          <div className="text-xl font-black font-mono mt-0.5">
            {player.xp} / {player.nextLevelXp} XP
          </div>
          <div className="text-[11px] text-blue-200/70 mt-0.5">
            {Math.max(0, player.nextLevelXp - player.xp)} XP remaining for Level {player.level + 1}
          </div>
        </div>
      </div>

      {/* MY CAREER DIRECTION & PATHWAY SWITCHER */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">MY CAREER DIRECTION & TRANSITION PATHWAY</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your starting CV describes where you began. You can transition into HR, Admin, Business, or Finance anytime!
            </p>
          </div>

          <button
            onClick={() => setShowDirectionModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 shrink-0 transition"
          >
            <Compass className="w-4 h-4" />
            <span>CHANGE CAREER DIRECTION</span>
          </button>
        </div>

        {/* Current Career Target Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Target Domain</div>
            <div className="font-black text-slate-900 dark:text-white text-sm">
              {candidateProfile?.targetCareerDirection?.primaryDomain === 'hr_people' ? '👥 Human Resources & People Ops' :
               candidateProfile?.targetCareerDirection?.primaryDomain === 'administration' ? '🏢 Corporate Administration' :
               candidateProfile?.targetCareerDirection?.primaryDomain === 'finance_corporate' ? '📊 Finance & Accounting' : '⚡ Engineering & Tech'}
            </div>
            <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold">
              Goal: {candidateProfile?.targetCareerDirection?.primaryRoleGoal || 'HR Executive / Generalist'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Transferable Skills</div>
            <div className="flex flex-wrap gap-1 pt-1">
              {(candidateProfile?.targetCareerDirection?.transferableSkills || ['Communication', 'Documentation', 'Process Design', 'Excel']).map(s => (
                <span key={s} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[9px] border border-emerald-300 dark:border-emerald-800">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Skill Gaps To Bridge</div>
            <div className="flex flex-wrap gap-1 pt-1">
              {(candidateProfile?.targetCareerDirection?.skillGaps || ['Domain Tools', 'Compliance', 'Operations']).map(s => (
                <span key={s} className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[9px] border border-amber-300 dark:border-amber-800">
                  △ {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Ladder & Salary Negotiation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Ladder (Col 1 & 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Engineering Career Hierarchy
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              Promotion is earned via trust, reliability, and incident triage
            </span>
          </div>

          <div className="space-y-3">
            {careerLevels.map(tier => {
              const isCurrent = tier.level === player.level;
              const isPast = tier.level < player.level;

              return (
                <div
                  key={tier.level}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs'
                      : isPast
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-80'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        L{tier.level}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {tier.title}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                              CURRENT
                            </span>
                          )}
                          {isPast && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                              ACHIEVED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Band: {tier.salaryBand}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                        Requires: {tier.reqTrust}% Trust • {tier.reqXp} XP
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                        {reputation.managerTrust >= tier.reqTrust && player.xp >= tier.reqXp ? (
                          <span className="text-emerald-600 font-bold">Criteria Met</span>
                        ) : (
                          <span className="text-slate-400">In Progress</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Salary Negotiation Widget (Col 3) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Salary Revision Negotiation
                </h3>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Sneha & Priya
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Negotiate compensation with management. Frame your achievements, customer impact, and reliability.
            </p>

            {/* Requested Salary Input */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Target Salary (Current: {player.currency}{player.salary.toLocaleString()})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                  {player.currency}
                </span>
                <input
                  type="number"
                  value={requestedSalary}
                  onChange={e => setRequestedSalary(Number(e.target.value))}
                  step={50000}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                +{Math.round(((requestedSalary - player.salary) / player.salary) * 100)}% revision request
              </span>
            </div>

            {/* Justification Textarea */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Your Justification & Business Case
              </label>
              <textarea
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="Over the last cycle, I independently resolved the Apex Global SEV-1 outage and delivered Kafka telemetry optimization ahead of deadline..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Negotiation Result Display */}
            {negotiationResult && (
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                negotiationResult.status === 'ACCEPTED'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : negotiationResult.status === 'COUNTERED'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <span>{negotiationResult.speakerName}:</span>
                  <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-black/10">
                    {negotiationResult.status}
                  </span>
                </div>
                <p className="italic text-[11px] leading-relaxed">
                  "{negotiationResult.dialogue}"
                </p>
                {negotiationResult.agreedSalary && negotiationResult.status !== 'REJECTED' && (
                  <div className="font-bold font-mono pt-1 text-xs">
                    New Annual Salary: ₹{negotiationResult.agreedSalary.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleStartNegotiation}
            disabled={!justification.trim() || isNegotiating}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors"
          >
            {isNegotiating ? 'Negotiating with Management...' : 'Submit Revision Case to Sneha & HR'}
          </button>
        </div>
      </div>

      {/* Row 3: Career Endings Showcase */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Potential Career Trajectory Endings
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            Shaped by your cumulative decisions across 90 days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {possibleEndings.map((end, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                end.type === 'VICTORY'
                  ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50'
                  : end.type === 'TRAGEDY'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {end.title}
                </h4>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  end.status.includes('ACTIVE') || end.status.includes('MET')
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : end.status.includes('RISK')
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {end.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {end.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CHANGE CAREER DIRECTION MODAL */}
      {showDirectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-indigo-500" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">SELECT YOUR NEW CAREER DIRECTION</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Switching direction updates your ATS candidate profile & job market recommendations.</p>
                </div>
              </div>
              <button onClick={() => setShowDirectionModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Option 1: HR */}
              <button
                onClick={() => handleApplyCareerSwitch('hr_people', 'Human Resources & People Ops', 'HR Executive / Generalist')}
                className="p-4 rounded-2xl border text-left space-y-1.5 transition hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2 font-black text-indigo-600 dark:text-indigo-400 text-sm">
                  <Users className="w-4 h-4" />
                  <span>HR & Talent Acquisition</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Recruitment, Employee Onboarding, HR Operations, Performance Management, People Analytics & HRBP.
                </p>
              </button>

              {/* Option 2: Admin */}
              <button
                onClick={() => handleApplyCareerSwitch('administration', 'Corporate Administration', 'Corporate Admin & Facilities Executive')}
                className="p-4 rounded-2xl border text-left space-y-1.5 transition hover:border-blue-500 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2 font-black text-blue-600 dark:text-blue-400 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>Corporate Administration</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Office Operations, Facilities Management, Vendor Procurement, Workplace Logistics & Executive Assistance.
                </p>
              </button>

              {/* Option 3: Business */}
              <button
                onClick={() => handleApplyCareerSwitch('product_project', 'Business Operations & Management', 'Business Analyst / Operations Associate')}
                className="p-4 rounded-2xl border text-left space-y-1.5 transition hover:border-purple-500 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2 font-black text-purple-600 dark:text-purple-400 text-sm">
                  <Briefcase className="w-4 h-4" />
                  <span>Business Operations</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Business Analysis, Process Optimization, Project Management, Strategy & Client Success.
                </p>
              </button>

              {/* Option 4: Finance */}
              <button
                onClick={() => handleApplyCareerSwitch('finance_corporate', 'Finance & Accounting', 'Financial Accountant / Risk Analyst')}
                className="p-4 rounded-2xl border text-left space-y-1.5 transition hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>Finance & Accounting</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Financial Accounting, Tax Compliance, Auditing, Corporate Budgeting & SAP Financial Modeling.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
