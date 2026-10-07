import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Star,
  CheckCircle2,
  Search,
  Filter,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { JobOpening, CandidateProfile, JobApplication } from '../../types/jobMarket';
import { calculateJobMatch, evaluateApplicationScreening } from '../../utils/jobMatching';

interface JobMarketViewProps {
  jobOpenings: JobOpening[];
  candidate: CandidateProfile;
  applications: JobApplication[];
  onApplyJob: (application: JobApplication) => void;
  onNavigateToApplications: () => void;
}

export const JobMarketView: React.FC<JobMarketViewProps> = ({
  jobOpenings,
  candidate,
  applications,
  onApplyJob,
  onNavigateToApplications,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedJobModal, setSelectedJobModal] = useState<JobOpening | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const appliedJobIds = applications.map(a => a.job.id);

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      selectedLocation === 'ALL' || job.location.includes(selectedLocation) || job.workMode === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  const handleApply = (job: JobOpening) => {
    if (appliedJobIds.includes(job.id)) return;

    const match = calculateJobMatch(candidate, job);
    const screening = evaluateApplicationScreening(candidate, job, match.overall);

    const newApplication: JobApplication = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      job,
      appliedDate: 'Just Now',
      currentStage: screening.stage,
      currentRoundIndex: 0,
      matchScore: match.overall,
      matchBreakdown: {
        skillsMatch: match.skillsMatch,
        experienceMatch: match.experienceMatch,
        educationMatch: match.educationMatch,
        verdict: match.verdict,
      },
      interviewerName: screening.interviewerName,
      interviewerRole: screening.interviewerRole,
      interviewerPersonality: screening.personality,
      recruiterNotes: screening.recruiterNotes,
      rejectionReason: screening.rejectionReason,
      interviewChat: [
        {
          id: `msg-recruiter-init`,
          sender: screening.interviewerName,
          senderRole: screening.interviewerRole,
          text: screening.recruiterNotes,
          timestamp: 'Just Now',
          emotion: 'warm',
        },
      ],
      hiddenImpression: {
        technicalKnowledge: 70,
        communication: 75,
        confidence: 70,
        problemSolving: 72,
        cultureFit: 75,
      },
      lastUpdated: 'Just now',
    };

    onApplyJob(newApplication);

    if (screening.stage === 'HR_SCREEN') {
      setAppliedNotice(`Application Shortlisted! ${screening.interviewerName} (${job.company}) invited you to an HR Screening discussion.`);
    } else if (screening.stage === 'WAITLISTED') {
      setAppliedNotice(`Application Submitted to ${job.company}. Currently under review by the hiring team.`);
    } else {
      setAppliedNotice(`Application Submitted to ${job.company}. Screening decision generated.`);
    }

    setTimeout(() => setAppliedNotice(null), 6000);
    if (selectedJobModal) setSelectedJobModal(null);
  };

  const toggleSaveJob = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobIds(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 select-none">
      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase">
              Job Market
            </span>
            <span className="text-xs text-slate-400">Step 3: Browse & Apply</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            MNC Career Opportunities
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare positions across tier-1 MNCs. Calculate live AI match scores and submit applications to start your interview loop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToApplications}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:opacity-90 transition-opacity"
          >
            <span>Track Applications</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px]">
              {applications.length}
            </span>
          </button>
        </div>
      </div>

      {/* Applied Banner Toast */}
      {appliedNotice && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{appliedNotice}</span>
          </div>
          <button
            onClick={onNavigateToApplications}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            View in ATS Tracker →
          </button>
        </div>
      )}

      {/* Search & Location Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company, or technical skills (e.g. SCADA, PLC, Python, Kubernetes)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Locations & Modes</option>
            <option value="Hybrid">Hybrid Roles</option>
            <option value="Remote">Remote Roles</option>
            <option value="Pune">Pune</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map(job => {
          const isApplied = appliedJobIds.includes(job.id);
          const isSaved = savedJobIds.includes(job.id);
          const match = calculateJobMatch(candidate, job);

          return (
            <div
              key={job.id}
              onClick={() => setSelectedJobModal(job)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {job.companyLogo}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {job.company}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={e => toggleSaveJob(job.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Job Metadata Chips */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[130px]">{job.location.split('/')[0]}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                    {job.workMode}
                  </span>
                </div>

                {/* AI Match Score Badge */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Profile Match
                    </span>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="font-mono text-sm">{match.overall}%</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        match.overall >= 75
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : match.overall >= 55
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {match.verdict}
                      </span>
                    </div>
                  </div>

                  {/* Difficulty stars */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Interview Rigor
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star
                          key={st}
                          className={`w-3 h-3 ${st <= job.interviewDifficulty ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {job.skillsRequired.slice(0, 4).map(sk => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                  {job.skillsRequired.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{job.skillsRequired.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedJobModal(job);
                  }}
                  className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors text-center"
                >
                  View Details
                </button>

                <button
                  type="button"
                  disabled={isApplied}
                  onClick={e => {
                    e.stopPropagation();
                    handleApply(job);
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1 ${
                    isApplied
                      ? 'bg-emerald-600 text-white opacity-90 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <span>Apply Now</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Job Details Modal */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                  {selectedJobModal.companyLogo}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedJobModal.title}
                  </h2>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                    {selectedJobModal.company} • {selectedJobModal.location}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedJobModal.companyTagline}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedJobModal(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Salary Range</span>
                <div className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedJobModal.salaryRange}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Experience</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                  {selectedJobModal.experienceRequired}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Reporting Manager</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                  {selectedJobModal.reportingManager}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Interview Rounds</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedJobModal.interviewRounds.length} Rounds
                </div>
              </div>
            </div>

            {/* Description & Responsibilities */}
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                  Role Overview
                </h4>
                <p className="leading-relaxed">
                  {selectedJobModal.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                  Key Responsibilities
                </h4>
                <ul className="space-y-1 list-disc pl-4 leading-relaxed">
                  {selectedJobModal.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                  Required Skill Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobModal.skillsRequired.map(sk => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Candidate Match: <span className="font-bold text-slate-900 dark:text-white font-mono">{calculateJobMatch(candidate, selectedJobModal).overall}%</span>
              </div>

              <button
                disabled={appliedJobIds.includes(selectedJobModal.id)}
                onClick={() => handleApply(selectedJobModal)}
                className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                {appliedJobIds.includes(selectedJobModal.id) ? 'Already Applied' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
