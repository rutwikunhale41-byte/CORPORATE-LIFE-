import React from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';
import { JobApplication } from '../../types/jobMarket';

interface ApplicationTrackerViewProps {
  applications: JobApplication[];
  onOpenInterview: (application: JobApplication) => void;
  onOpenOffer: (application: JobApplication) => void;
  onBrowseJobs: () => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onOpenInterview,
  onOpenOffer,
  onBrowseJobs,
}) => {
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'OFFER_ACCEPTED':
        return {
          label: '✅ Offer Accepted & Joined Company',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
        };
      case 'OFFER_EXTENDED':
        return {
          label: '🎉 Official Offer Letter Extended',
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
        };
      case 'HR_SCREEN':
        return {
          label: '📞 HR Screening Round',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
        };
      case 'TECHNICAL_INTERVIEW':
        return {
          label: '⚙️ Technical Domain Interview',
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
        };
      case 'MANAGER_ROUND':
        return {
          label: '👨‍💼 Managerial Fit Round',
          color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300',
        };
      case 'WAITLISTED':
        return {
          label: '⏳ Under Recruiter Review',
          color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
        };
      case 'REJECTED':
        return {
          label: '❌ Not Proceeding',
          color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        };
      default:
        return {
          label: '📄 Application Submitted',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase">
              Application Tracker (ATS)
            </span>
            <span className="text-xs text-slate-400">Recruitment Dashboard</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Your Active Job Applications ({applications.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor screening status, attend scheduled technical and managerial rounds, and review received offer letters.
          </p>
        </div>

        <button
          onClick={onBrowseJobs}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <span>Browse More MNC Openings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Active Applications Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't submitted any job applications yet. Visit the Job Market to discover open roles in SCADA, Automation, Software, Cloud, and Data.
          </p>
          <button
            onClick={onBrowseJobs}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors mt-2"
          >
            Explore Job Openings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const badge = getStageBadge(app.currentStage);
            const isInterviewReady = ['HR_SCREEN', 'TECHNICAL_INTERVIEW', 'MANAGER_ROUND'].includes(app.currentStage);
            const isOfferReady = app.currentStage === 'OFFER_EXTENDED' && (!app.offer || app.offer.status !== 'ACCEPTED');
            const isOfferAccepted = app.currentStage === 'OFFER_ACCEPTED' || app.offer?.status === 'ACCEPTED';
            const isRejected = app.currentStage === 'REJECTED';

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-400 font-mono">
                      Applied {app.appliedDate}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold font-mono">
                      Match: {app.matchScore}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {app.job.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {app.job.company} • {app.job.location} • Band: {app.job.salaryRange}
                    </div>
                  </div>

                  {/* Recruiter / Interviewer message preview */}
                  {app.recruiterNotes && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Message from {app.interviewerName || 'Recruiter'}:</span>
                      </div>
                      <p className="italic text-[11px] leading-relaxed">
                        "{app.recruiterNotes}"
                      </p>
                    </div>
                  )}

                  {/* Rejection constructive feedback */}
                  {isRejected && app.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                      <div className="font-bold text-[11px] flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Constructive Feedback for Growth:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {app.rejectionReason} You can practice technical and HR mock rounds in the Prep Center, improve your skills, and apply to other open roles!
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  {isInterviewReady && (
                    <button
                      onClick={() => onOpenInterview(app)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
                    >
                      <span>Join Live AI Interview Room</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {isOfferReady && (
                    <button
                      onClick={() => onOpenOffer(app)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Review Offer Letter & Negotiate</span>
                    </button>
                  )}

                  {isOfferAccepted && (
                    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Offer Accepted • Employed</span>
                    </div>
                  )}

                  {isRejected && (
                    <button
                      onClick={onBrowseJobs}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Explore Other Companies
                    </button>
                  )}

                  {app.currentStage === 'WAITLISTED' && (
                    <span className="text-xs text-slate-400 italic px-2 py-1">
                      Under Recruiter Review
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
