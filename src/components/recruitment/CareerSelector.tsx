import React, { useState } from 'react';
import {
  Cpu,
  Sun,
  Bot,
  Code2,
  Cloud,
  BrainCircuit,
  ShieldAlert,
  CheckSquare,
  BarChart3,
  Briefcase,
  Headphones,
  DollarSign,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { CAREER_DOMAINS, CareerDomainOption } from '../../data/jobMarketData';
import { CandidateProfile } from '../../types/jobMarket';

interface CareerSelectorProps {
  candidate: CandidateProfile;
  onSelectCareer: (primaryDomain: string, secondaryDomain?: string) => void;
  onExploreAll: () => void;
}

export const CareerSelector: React.FC<CareerSelectorProps> = ({
  candidate,
  onSelectCareer,
  onExploreAll,
}) => {
  const [selectedPrimary, setSelectedPrimary] = useState<string>(
    candidate.primaryCareerDomain || 'scada_automation'
  );
  const [selectedSecondary, setSelectedSecondary] = useState<string | undefined>(
    candidate.secondaryInterest
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'Cloud': return <Cloud className="w-5 h-5" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  const filteredDomains = CAREER_DOMAINS.filter(dom => {
    if (categoryFilter === 'ALL') return true;
    return dom.category === categoryFilter;
  });

  const handleConfirm = () => {
    onSelectCareer(selectedPrimary, selectedSecondary);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase">
              Step 2 of 3
            </span>
            <span className="text-xs text-slate-400">Career Direction</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            What Do You Want to Become?
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select your primary career aspiration. Your selection personalizes the job matching engine, technical interview topics, and company opportunities.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors shrink-0"
        >
          <Compass className="w-4 h-4 text-blue-500" />
          <span>Explore All Careers (No Filter)</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'INDUSTRIAL', 'ENGINEERING', 'BUSINESS', 'CUSTOMER', 'FINANCE_HR'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid of Career Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomains.map(domain => {
          const isPrimary = selectedPrimary === domain.id;
          const isSecondary = selectedSecondary === domain.id;

          return (
            <div
              key={domain.id}
              onClick={() => setSelectedPrimary(domain.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isPrimary
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${
                    isPrimary ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {getIcon(domain.icon)}
                  </div>

                  {isPrimary ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PRIMARY CHOICE</span>
                    </span>
                  ) : isSecondary ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                      SECONDARY
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {domain.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Roles: {domain.roles.join(', ')}
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {domain.recommendedSkills.slice(0, 4).map(sk => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                  {domain.recommendedSkills.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{domain.recommendedSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedPrimary(domain.id);
                  }}
                  className={`font-semibold ${isPrimary ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {isPrimary ? 'Selected' : 'Set as Primary'}
                </button>

                {!isPrimary && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedSecondary(isSecondary ? undefined : domain.id);
                    }}
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {isSecondary ? 'Remove Secondary' : '+ Secondary'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Bottom Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase">Ready to explore jobs:</span>
          <div className="font-extrabold text-sm text-slate-900 dark:text-white">
            Primary Target: {CAREER_DOMAINS.find(d => d.id === selectedPrimary)?.name || 'SCADA & Industrial Automation'}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Search Matching Job Openings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
