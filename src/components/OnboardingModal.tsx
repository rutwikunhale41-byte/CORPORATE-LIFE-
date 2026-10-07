import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  User,
  DollarSign
} from 'lucide-react';
import { PlayerProfile } from '../types/game';

interface OnboardingModalProps {
  onStartCareer: (
    name: string, 
    currency: string, 
    isCandidateMode: boolean,
    educationDegree?: string,
    skills?: string,
    experienceTier?: string,
    primaryCareerGoal?: string
  ) => void;
  hasGeminiKey: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onStartCareer, hasGeminiKey }) => {
  const [playerName, setPlayerName] = useState('');
  const [degree, setDegree] = useState('MBA Human Resources');
  const [primaryCareerGoal, setPrimaryCareerGoal] = useState('Human Resources & Talent Acquisition');
  const [skills, setSkills] = useState('Recruitment, HRIS, Talent Sourcing, Employee Relations, Office Admin');
  const [experienceTier, setExperienceTier] = useState('1–3 Years');
  const [currency, setCurrency] = useState('₹');
  const [startMode, setStartMode] = useState<'candidate' | 'hired'>('candidate');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = playerName.trim() || 'Alex Morgan';
    onStartCareer(
      finalName, 
      currency, 
      startMode === 'candidate',
      degree,
      skills,
      experienceTier,
      primaryCareerGoal
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 sm:p-6 py-8">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative my-auto">
        {/* Top ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                NEXORA GLOBAL
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] tracking-wide">
                TIER-1 MNC
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Cloud & Technology Infrastructure
            </p>
          </div>
        </div>

        {/* Headline & Tagline */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            CORPORATE LIFE AI — MNC SIMULATOR
          </h2>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            "Your career. Your decisions. Your reputation."
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
            Experience a realistic corporate workplace simulation powered by AI. Navigate demanding managers, technical debt, enterprise customer outages, office politics, and multi-person meetings. Type freely without scripted multiple-choice dialogs.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Player Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Enter your name (e.g. Alex Morgan)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Primary Career Goal / Target Domain */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1.5">
              Target Career Goal & Primary Domain
            </label>
            <select
              value={primaryCareerGoal}
              onChange={e => setPrimaryCareerGoal(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              <option value="Human Resources & Talent Acquisition">Human Resources & Talent Acquisition (HR / TA / HRBP)</option>
              <option value="Administration & Workplace Operations">Administration & Workplace Operations (Office Admin / Facilities)</option>
              <option value="MBA & Business Operations / Strategy">MBA & Business Operations / Strategy / Consulting</option>
              <option value="Software & Tech Engineering">Software Engineering, Cloud & Tech (Backend / Full Stack)</option>
              <option value="Finance, Banking & Accounting">Finance, Banking & Accounting (FP&A / Financial Analyst)</option>
              <option value="Marketing, Growth & Creative">Marketing, Brand Growth & Content Strategy</option>
              <option value="SCADA, Electrical & Industrial Automation">SCADA, Electrical & Industrial Automation Engineering</option>
            </select>
          </div>

          {/* Education Degree & Major */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px]">
                Education Qualification / Degree
              </label>
              <select
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              >
                <option value="MBA Human Resources">MBA Human Resources / TA</option>
                <option value="MBA Operations & Marketing">MBA Operations & Marketing</option>
                <option value="B.A. / M.A. Humanities">B.A. / M.A. Humanities & Communication</option>
                <option value="B.Com / M.Com Financial Accounting">B.Com / M.Com Financial Accounting</option>
                <option value="B.B.A. Business Administration">B.B.A. Business Administration</option>
                <option value="B.Tech Computer Science">B.Tech Computer Science / IT</option>
                <option value="B.Tech Electrical & Automation">B.Tech Electrical & Automation</option>
                <option value="B.Tech Mechanical Engineering">B.Tech Mechanical Engineering</option>
                <option value="B.Des Product Design">B.Des UI/UX Product Design</option>
                <option value="Diploma / Other">Diploma / High School / Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px]">
                Experience Level
              </label>
              <select
                value={experienceTier}
                onChange={e => setExperienceTier(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              >
                <option value="Fresher">Fresher (0 Years)</option>
                <option value="1–3 Years">1–3 Years Experience</option>
                <option value="3–5 Years">3–5 Years Experience</option>
                <option value="5+ Years">5+ Years Senior Specialist</option>
              </select>
            </div>
          </div>

          {/* Technical / Core Skills Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Primary Technical / Professional Skills
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, React, SQL, Java, Financial Modeling, SCADA, HRIS..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Dynamic Allocation Preview based on Career Goal */}
          {(() => {
            let assignedDivision = 'Cloud Platform & Infrastructure';
            let assignedTitle = 'Graduate Associate Engineer (L1)';
            let assignedManager = 'Sneha Rao';

            switch (primaryCareerGoal) {
              case 'Human Resources & Talent Acquisition':
                assignedDivision = 'Human Resources & Talent Management';
                assignedTitle = 'Graduate HR Associate (L1)';
                assignedManager = 'Priya Sharma (HR Lead)';
                break;
              case 'Administration & Workplace Operations':
                assignedDivision = 'Corporate Workplace & Facilities';
                assignedTitle = 'Workplace Operations Coordinator (L1)';
                assignedManager = 'Anita Deshmukh (VP Corporate Services)';
                break;
              case 'MBA & Business Operations / Strategy':
                assignedDivision = 'Business Strategy & Operations';
                assignedTitle = 'Operations Analyst (L1)';
                assignedManager = 'Karan Sengupta (Strategy Lead)';
                break;
              case 'Software & Tech Engineering':
                assignedDivision = 'Cloud Platform & Infrastructure';
                assignedTitle = 'Graduate Associate Engineer (L1)';
                assignedManager = 'Sneha Rao (Engineering Manager)';
                break;
              case 'Finance, Banking & Accounting':
                assignedDivision = 'Corporate Finance & Treasury';
                assignedTitle = 'Corporate Financial Analyst (L1)';
                assignedManager = 'Meera Kulkarni (Finance Director)';
                break;
              case 'Marketing, Growth & Creative':
                assignedDivision = 'Corporate Marketing & Growth';
                assignedTitle = 'Marketing & Brand Associate (L1)';
                assignedManager = 'Vikram Sengupta (Marketing Director)';
                break;
              case 'SCADA, Electrical & Industrial Automation':
                assignedDivision = 'Industrial Telemetry & SCADA Systems';
                assignedTitle = 'Automation Project Engineer (L1)';
                assignedManager = 'Sneha Rao (Engineering Manager)';
                break;
            }

            return (
              <>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px]">
                      Currency Display
                    </label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                    >
                      <option value="₹">₹ INR (₹5,00,000 / yr)</option>
                      <option value="$">$ USD ($75,000 / yr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px]">
                      Assigned Division (Dynamic)
                    </label>
                    <div className="px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-extrabold text-xs border border-blue-200 dark:border-blue-900/60 truncate">
                      {assignedDivision}
                    </div>
                  </div>
                </div>

                {/* Offer Package Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider text-slate-500">
                    Your Day 1 Package & Allocation
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div>• Title: <span className="font-semibold text-slate-900 dark:text-white">{assignedTitle}</span></div>
                    <div>• Direct Manager: <span className="font-semibold text-slate-900 dark:text-white">{assignedManager}</span></div>
                    <div>• Probation: <span className="font-semibold text-slate-900 dark:text-white">90 Days</span></div>
                    <div>• Base Salary: <span className="font-semibold text-slate-900 dark:text-white">{currency === '₹' ? '₹5,00,000/yr' : '$75,000/yr'}</span></div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Engine indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Embedded LFM2.5 AI Engine Active</span>
            </span>
            <span className="font-mono">Nexora OS v4.2</span>
          </div>

          {/* Start Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Simulation Entry Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStartMode('candidate')}
                className={`p-3 rounded-2xl border text-left transition ${
                  startMode === 'candidate'
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-slate-900 dark:text-white shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-extrabold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Personal Life & Candidate Search</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Day 1 starts with personal life, friends, phone, LinkedIn ATS, and Google Meet interviews.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStartMode('hired')}
                className={`p-3 rounded-2xl border text-left transition ${
                  startMode === 'hired'
                    ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 text-slate-900 dark:text-white shadow-sm ring-2 ring-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-extrabold text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Direct Workplace Entry</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Start already hired at Nexora Global on Day 1 with workplace tasks and phone active.
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{startMode === 'candidate' ? 'ENTER PERSONAL LIFE & CAREER SEARCH' : 'START CAREER AT NEXORA GLOBAL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
