import React, { useState } from 'react';
import {
  User,
  Compass,
  Briefcase,
  FileCheck2,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { CandidateProfile, JobOpening, JobApplication, JobOffer } from '../../types/jobMarket';
import { GameState } from '../../types/game';
import { ProfileBuilder } from './ProfileBuilder';
import { CareerSelector } from './CareerSelector';
import { JobMarketView } from './JobMarketView';
import { ApplicationTrackerView } from './ApplicationTrackerView';
import { InterviewRoomModal } from './InterviewRoomModal';
import { OfferLetterModal } from './OfferLetterModal';
import { CareerDiscoveryView } from './CareerDiscoveryView';
import { INITIAL_JOB_OPENINGS, DEFAULT_CANDIDATE_PROFILE } from '../../data/jobMarketData';

export type RecruitmentStep = 'profile' | 'career' | 'discovery' | 'jobs' | 'applications';

interface RecruitmentHubViewProps {
  gameState: GameState;
  onUpdateGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onAcceptOfferAndJoin: (application: JobApplication, offer: JobOffer) => void;
  hasGeminiKey: boolean;
  initialStep?: RecruitmentStep;
}

export const RecruitmentHubView: React.FC<RecruitmentHubViewProps> = ({
  gameState,
  onUpdateGameState,
  onAcceptOfferAndJoin,
  hasGeminiKey,
  initialStep = 'profile',
}) => {
  const candidate: CandidateProfile = gameState.candidateProfile || {
    ...DEFAULT_CANDIDATE_PROFILE,
    name: gameState.player.name || 'Rutwik Unhale',
  };

  const applications: JobApplication[] = gameState.applications || [];
  const [activeStep, setActiveStep] = useState<RecruitmentStep>(() => {
    // If player already has applications, jump to applications or jobs
    if (applications.length > 0) return 'applications';
    return initialStep;
  });

  const [activeInterviewApp, setActiveInterviewApp] = useState<JobApplication | null>(null);
  const [activeOfferApp, setActiveOfferApp] = useState<JobApplication | null>(null);

  // All active received offers across applications waiting for candidate decision
  const applicationsWithOffers = !gameState.isHired
    ? applications.filter(
        a => a.currentStage === 'OFFER_EXTENDED' && a.offer?.status !== 'ACCEPTED'
      )
    : [];

  const handleSaveProfile = (newProfile: CandidateProfile) => {
    onUpdateGameState(prev => ({
      ...prev,
      candidateProfile: newProfile,
      player: {
        ...prev.player,
        name: newProfile.name,
      },
    }));
    setActiveStep('career');
  };

  const handleSelectCareer = (primaryDomain: string, secondaryDomain?: string) => {
    onUpdateGameState(prev => {
      const currentCandidate = prev.candidateProfile || { ...DEFAULT_CANDIDATE_PROFILE, name: prev.player.name };
      return {
        ...prev,
        candidateProfile: {
          ...currentCandidate,
          primaryCareerDomain: primaryDomain,
          secondaryInterest: secondaryDomain,
        },
      };
    });
    setActiveStep('jobs');
  };

  const handleApplyJob = (newApp: JobApplication) => {
    onUpdateGameState(prev => {
      const existing = prev.applications || [];
      return {
        ...prev,
        applications: [newApp, ...existing],
      };
    });
  };

  const handleApplyJobOpening = (job: JobOpening) => {
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      job,
      appliedDate: 'Day 1',
      currentStage: 'APPLIED',
      currentRoundIndex: 0,
      matchScore: 88,
      matchBreakdown: {
        skillsMatch: 85,
        experienceMatch: 90,
        educationMatch: 100,
        verdict: 'Strong Match',
      },
      interviewerName: job.reportingManager,
      interviewerRole: job.managerRole,
      interviewerPersonality: 'TECHNICAL',
      interviewChat: [],
      hiddenImpression: {
        technicalKnowledge: 75,
        communication: 78,
        confidence: 80,
        problemSolving: 76,
        cultureFit: 82,
      },
      lastUpdated: 'Just now',
    };
    handleApplyJob(newApp);
    setActiveStep('applications');
  };

  const handleUpdateApplication = (updatedApp: JobApplication) => {
    onUpdateGameState(prev => {
      const existing = prev.applications || [];
      const updatedList = existing.map(a => (a.id === updatedApp.id ? updatedApp : a));
      return {
        ...prev,
        applications: updatedList,
      };
    });

    if (activeInterviewApp && activeInterviewApp.id === updatedApp.id) {
      setActiveInterviewApp(updatedApp);
    }
  };

  const handleDeclineOffer = (app: JobApplication) => {
    onUpdateGameState(prev => {
      const existing = prev.applications || [];
      return {
        ...prev,
        applications: existing.map(a =>
          a.id === app.id
            ? { ...a, currentStage: 'REJECTED' as const, rejectionReason: 'Offer declined by candidate.' }
            : a
        ),
      };
    });
    setActiveOfferApp(null);
  };

  const stepsList: { id: RecruitmentStep; label: string; icon: any; count?: number }[] = [
    { id: 'profile', label: '1. Candidate Profile', icon: User },
    { id: 'career', label: '2. Career Direction', icon: Compass },
    { id: 'discovery', label: '3. Education & Skill Match Engine', icon: Sparkles },
    { id: 'jobs', label: '4. MNC Job Market', icon: Briefcase, count: INITIAL_JOB_OPENINGS.length },
    {
      id: 'applications',
      label: '5. Applications & ATS',
      icon: FileCheck2,
      count: applications.length,
    },
  ];

  return (
    <div className="min-h-full flex flex-col bg-slate-50/70 dark:bg-slate-950/70 overflow-y-auto">
      {/* Top Banner / Progress Navigator */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] tracking-wide uppercase">
                Career Launch Portal
              </span>
              {!gameState.isHired && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  Status: Job Seeker (Unemployed)
                </span>
              )}
              {gameState.isHired && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Currently at {gameState.player.company || 'Nexora Global'}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              MNC Recruitment & Career Entry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your career begins here. Create your profile, apply to Fortune 500 MNCs, attend AI-powered interviews, negotiate CTC, and earn your appointment letter.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
            {stepsList.map(step => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                  {typeof step.count === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {step.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Candidate Quick Stats Bar */}
        <div className="max-w-6xl mx-auto mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Candidate: <span className="text-blue-600 dark:text-blue-400">{candidate.name}</span>
            </span>
            <span>•</span>
            <span>{candidate.degree} ({candidate.specialization})</span>
            <span>•</span>
            <span>Exp: {candidate.experienceYears} Years</span>
            <span>•</span>
            <span>Expected: ₹{(candidate.expectedSalary / 100000).toFixed(1)} LPA</span>
          </div>

          <div className="flex items-center gap-3">
            {applicationsWithOffers.length > 0 && (
              <button
                onClick={() => {
                  setActiveOfferApp(applicationsWithOffers[0]);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs animate-bounce"
              >
                <Award className="w-3.5 h-3.5" />
                <span>
                  {applicationsWithOffers.length} Offer{applicationsWithOffers.length > 1 ? 's' : ''} Ready to Sign!
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {activeStep === 'profile' && (
          <ProfileBuilder
            initialProfile={candidate}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {activeStep === 'career' && (
          <CareerSelector
            candidate={candidate}
            onSelectCareer={handleSelectCareer}
            onExploreAll={() => setActiveStep('discovery')}
          />
        )}

        {activeStep === 'discovery' && (
          <CareerDiscoveryView
            gameState={gameState}
            onUpdateGameState={onUpdateGameState}
            onApplyForJob={job => handleApplyJobOpening(job)}
          />
        )}

        {activeStep === 'jobs' && (
          <JobMarketView
            jobOpenings={INITIAL_JOB_OPENINGS}
            candidate={candidate}
            applications={applications}
            onApplyJob={handleApplyJob}
            onNavigateToApplications={() => setActiveStep('applications')}
          />
        )}

        {activeStep === 'applications' && (
          <ApplicationTrackerView
            applications={applications}
            onOpenInterview={app => setActiveInterviewApp(app)}
            onOpenOffer={app => setActiveOfferApp(app)}
            onBrowseJobs={() => setActiveStep('jobs')}
          />
        )}
      </div>

      {/* Live AI Interview Room Modal */}
      {activeInterviewApp && (
        <InterviewRoomModal
          application={activeInterviewApp}
          candidate={candidate}
          onClose={() => setActiveInterviewApp(null)}
          onUpdateApplication={handleUpdateApplication}
          onOpenOffer={app => {
            setActiveInterviewApp(null);
            setActiveOfferApp(app);
          }}
          hasGeminiKey={hasGeminiKey}
        />
      )}

      {/* Formal Offer Letter & Negotiation Modal */}
      {activeOfferApp && (
        <OfferLetterModal
          applicationsWithOffers={applicationsWithOffers}
          selectedApplication={activeOfferApp}
          candidate={candidate}
          onAcceptOffer={(app, finalOffer) => {
            onAcceptOfferAndJoin(app, { ...finalOffer, status: 'ACCEPTED' });
            setActiveOfferApp(null);
          }}
          onDeclineOffer={handleDeclineOffer}
          onClose={() => setActiveOfferApp(null)}
        />
      )}
    </div>
  );
};
