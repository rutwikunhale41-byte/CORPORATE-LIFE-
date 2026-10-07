import React, { useState } from 'react';
import {
  Award,
  DollarSign,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Check
} from 'lucide-react';
import { JobOffer, JobApplication, CandidateProfile } from '../../types/jobMarket';
import { negotiateInitialOffer } from '../../services/api';

interface OfferLetterModalProps {
  applicationsWithOffers: JobApplication[];
  selectedApplication: JobApplication;
  candidate: CandidateProfile;
  onAcceptOffer: (application: JobApplication, finalOffer: JobOffer) => void;
  onDeclineOffer: (application: JobApplication) => void;
  onClose: () => void;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({
  applicationsWithOffers,
  selectedApplication,
  candidate,
  onAcceptOffer,
  onDeclineOffer,
  onClose,
}) => {
  const [currentApp, setCurrentApp] = useState<JobApplication>(selectedApplication);
  const [activeOffer, setActiveOffer] = useState<JobOffer>(
    currentApp.offer || {
      id: `offer-${Date.now()}`,
      jobId: currentApp.job.id,
      company: currentApp.job.company,
      title: currentApp.job.title,
      department: currentApp.job.department,
      location: currentApp.job.location,
      baseSalary: currentApp.job.minSalary || 600000,
      variableBonus: 50000,
      joiningBonus: 30000,
      probationMonths: 6,
      noticePeriodDays: 30,
      reportingManager: currentApp.job.reportingManager || 'Sneha Rao',
      managerRole: currentApp.job.managerRole || 'Engineering Manager',
      currency: '₹',
      benefits: currentApp.job.benefits || ['Comprehensive Healthcare', 'Learning Allowance'],
      status: 'PENDING',
      negotiationCount: 0,
    }
  );

  const [counterSalary, setCounterSalary] = useState<number>(
    Math.round(activeOffer.baseSalary * 1.15)
  );
  const [negotiationText, setNegotiationText] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationResponse, setNegotiationResponse] = useState<any>(null);

  const handleSelectAnotherOffer = (app: JobApplication) => {
    setCurrentApp(app);
    if (app.offer) {
      setActiveOffer(app.offer);
      setCounterSalary(Math.round(app.offer.baseSalary * 1.15));
      setNegotiationResponse(null);
    }
  };

  const handleSendNegotiation = async () => {
    if (!negotiationText.trim() || isNegotiating) return;

    setIsNegotiating(true);
    try {
      const res = await negotiateInitialOffer({
        job: currentApp.job,
        candidate,
        currentOffer: activeOffer,
        requestedSalary: counterSalary,
        playerArgument: negotiationText,
        negotiationCount: activeOffer.negotiationCount || 0,
      });

      setNegotiationResponse(res);

      if (res.status === 'ACCEPTED' || res.status === 'COUNTERED') {
        const revised: JobOffer = {
          ...activeOffer,
          baseSalary: res.revisedSalary || counterSalary,
          joiningBonus: activeOffer.joiningBonus + (res.signingBonusDelta || 0),
          negotiationCount: (activeOffer.negotiationCount || 0) + 1,
        };
        setActiveOffer(revised);
      }
    } catch (err) {
      console.error('Failed to negotiate offer:', err);
    } finally {
      setIsNegotiating(false);
    }
  };

  const handleAccept = () => {
    onAcceptOffer(currentApp, activeOffer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  Formal Job Offer Letter
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                  Candidate Selected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review your compensation breakdown, compare competing offers, or negotiate with HR.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold self-start sm:self-auto"
          >
            Close Window
          </button>
        </div>

        {/* Competing Offers Tabs if player has multiple offers */}
        {applicationsWithOffers.length > 1 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Compare Multiple Received Offers ({applicationsWithOffers.length})
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {applicationsWithOffers.map(app => (
                <button
                  key={app.id}
                  onClick={() => handleSelectAnotherOffer(app)}
                  className={`p-3 rounded-xl border text-left transition-all shrink-0 min-w-[200px] ${
                    currentApp.id === app.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {app.job.company}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {app.job.title}
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹{(app.offer?.baseSalary || app.job.minSalary).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Official Offer Letter Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-3">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Position Offered
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {activeOffer.title}
              </h3>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {activeOffer.company} • {activeOffer.department}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Annual Base Compensation
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {activeOffer.currency}{activeOffer.baseSalary.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> / yr</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Reporting Manager</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                {activeOffer.reportingManager}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{activeOffer.managerRole}</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Work Location</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                {activeOffer.location}
              </div>
              <div className="text-[10px] text-slate-400">Hybrid / Onsite</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Probation Period</span>
              <div className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
                {activeOffer.probationMonths} Months
              </div>
              <div className="text-[10px] text-slate-400">Performance Evaluated</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Joining Bonus</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                +{activeOffer.currency}{activeOffer.joiningBonus.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">1st Month Disbursal</div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Corporate Benefits & Perks
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {activeOffer.benefits.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Free-Text Salary Negotiation Console */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Pre-Employment Salary Negotiation
              </h4>
            </div>
            <span className="text-[10px] text-slate-400">
              Negotiation Round #{activeOffer.negotiationCount + 1}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Your Counter Target (Current: ₹{activeOffer.baseSalary.toLocaleString()})
              </label>
              <input
                type="number"
                step="25000"
                value={counterSalary}
                onChange={e => setCounterSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Your Value Proposition to HR
              </label>
              <input
                type="text"
                value={negotiationText}
                onChange={e => setNegotiationText(e.target.value)}
                placeholder="Based on my automation and SCADA background, I was hoping to discuss ₹..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {negotiationResponse && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              negotiationResponse.status === 'ACCEPTED'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                : negotiationResponse.status === 'COUNTERED'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-200'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 text-slate-800 dark:text-slate-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                <span>Recruiter Response ({negotiationResponse.status}):</span>
              </div>
              <p className="italic text-[11px] leading-relaxed">
                "{negotiationResponse.recruiterResponse}"
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSendNegotiation}
              disabled={!negotiationText.trim() || isNegotiating}
              className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              {isNegotiating ? 'Negotiating...' : 'Submit Counter-Proposal to HR'}
            </button>
          </div>
        </div>

        {/* Master Actions Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => onDeclineOffer(currentApp)}
            className="px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            Decline Offer & Continue Searching
          </button>

          <button
            onClick={handleAccept}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>ACCEPT OFFER & JOIN {activeOffer.company.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
