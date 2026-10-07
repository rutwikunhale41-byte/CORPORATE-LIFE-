import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { EducationProfile, JobMatchAnalysis, SkillCourse } from '../../types/education';
import { JobOpening } from '../../types/jobMarket';
import { evaluateJobEligibility } from '../../services/careerMatchingEngine';
import { MASTER_CAREER_FAMILIES, EXPANDED_JOB_OPENINGS, AVAILABLE_SKILL_COURSES } from '../../data/educationData';

import { 
  GraduationCap, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Search, 
  ChevronRight, 
  BarChart2, 
  Building2, 
  Check 
} from 'lucide-react';

interface CareerDiscoveryViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  onApplyForJob: (job: JobOpening) => void;
}

export const CareerDiscoveryView: React.FC<CareerDiscoveryViewProps> = ({
  gameState,
  onUpdateGameState,
  onApplyForJob,
}) => {
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('ALL');
  const [activeCourseModal, setActiveCourseModal] = useState<SkillCourse | null>(null);

  // Player's Education Profile or default B.Tech Electrical
  const playerEduProfile: EducationProfile = gameState.player.roleProfile
    ? {
        highest_qualification: 'B.Tech',
        degree: 'B.Tech Electrical & Automation',
        specialization: 'SCADA, PLC & Industrial Automation',
        college: 'National Institute of Technology',
        graduation_year: 2024,
        education_level: 'Undergraduate',
        skills: gameState.player.roleProfile.required_skills || ['SCADA', 'PLC', 'Modbus RTU/TCP'],
        certifications: ['Siemens TIA Portal Certified'],
        experience: [{ title: 'SCADA Engineer', company: 'Pioneer Automation', durationYears: 1.5, domain: 'Industrial IoT' }],
        career_preferences: ['SCADA Engineering', 'Automation', 'Cloud Telemetry'],
      }
    : {
        highest_qualification: 'B.Tech',
        degree: 'B.Tech Electrical Engineering',
        specialization: 'Power Systems & Controls',
        college: 'National Institute of Technology',
        graduation_year: 2024,
        education_level: 'Undergraduate',
        skills: ['SCADA', 'PLC', 'Modbus RTU/TCP', 'RS485'],
        certifications: ['Industrial Automation Specialist'],
        experience: [],
        career_preferences: ['SCADA', 'Automation'],
      };

  const experienceYears = 1.5;

  // Evaluate all jobs
  const evaluatedJobs = EXPANDED_JOB_OPENINGS.map(job => ({
    job,
    match: evaluateJobEligibility(job, playerEduProfile, gameState.player.roleProfile?.required_skills || [], experienceYears),
  }));

  const filteredJobs = evaluatedJobs.filter(item => {
    if (selectedFamilyFilter === 'ALL') return true;
    return item.job.department.toLowerCase().includes(selectedFamilyFilter.toLowerCase());
  });

  const handleEnrollCourse = (course: SkillCourse) => {
    onUpdateGameState(prev => {
      const currentRoleProfile = prev.player.roleProfile;
      const updatedSkills = Array.from(new Set([
        ...(currentRoleProfile?.required_skills || []),
        course.skillUnlocked,
      ]));

      const updatedAchievements = [
        ...prev.player.achievements,
        {
          id: `cert-${Date.now()}`,
          title: course.certificationGranted,
          description: `Completed ${course.title} by ${course.provider}.`,
          icon: 'Award',
          unlockedAt: `Day ${prev.currentDay}`,
        },
      ];

      return {
        ...prev,
        player: {
          ...prev.player,
          roleProfile: currentRoleProfile ? {
            ...currentRoleProfile,
            required_skills: updatedSkills,
          } : undefined,
          achievements: updatedAchievements,
        },
      };
    });

    setActiveCourseModal(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Education → Skills → Career Opportunity Discovery</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every career vacancy is strictly evaluated against your degree, specializations, skills, and experience.
          </p>
        </div>
      </div>

      {/* Education Profile Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white border border-blue-800/60 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow">
              🎓
            </div>
            <div>
              <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider">
                {playerEduProfile.education_level} Degree Profile
              </div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{playerEduProfile.degree}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900 text-blue-300 border border-blue-700">
                  Graduated {playerEduProfile.graduation_year}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">{playerEduProfile.specialization} • {playerEduProfile.college}</p>
            </div>
          </div>
        </div>

        {/* Current Skills & Certifications Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">
              Active Verified Skills ({playerEduProfile.skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {playerEduProfile.skills.map((s, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-blue-900/80 text-blue-200 border border-blue-700 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
              Earned Certifications ({playerEduProfile.certifications.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {playerEduProfile.certifications.map((c, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>{c}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Domain / Career Family Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedFamilyFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedFamilyFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All Career Families ({EXPANDED_JOB_OPENINGS.length})
        </button>
        {MASTER_CAREER_FAMILIES.map(fam => (
          <button
            key={fam.id}
            onClick={() => setSelectedFamilyFilter(fam.typicalDepartments[0] || 'SCADA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedFamilyFilter === (fam.typicalDepartments[0] || 'SCADA')
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {fam.familyName}
          </button>
        ))}
      </div>

      {/* Job Opportunity Match Cards */}
      <div className="space-y-4">
        {filteredJobs.map(({ job, match }) => {
          const isStrong = match.matchTier === 'STRONG_MATCH';
          const isPotential = match.matchTier === 'GOOD_POTENTIAL';
          const isSkillGap = match.matchTier === 'SKILL_GAP';
          const isIneligible = match.matchTier === 'INELIGIBLE';

          return (
            <div
              key={job.id}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-sm ${
                isStrong ? 'border-emerald-500/80 shadow-emerald-500/10' : isPotential ? 'border-blue-500/80' : isSkillGap ? 'border-amber-500/80' : 'border-slate-300 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Job Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isStrong
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                        : isPotential
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-400'
                        : isSkillGap
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400'
                    }`}>
                      {isStrong && '★★★★★ STRONG MATCH'}
                      {isPotential && '★★★★ GOOD POTENTIAL'}
                      {isSkillGap && '★★★ SKILL GAP'}
                      {isIneligible && '❌ DEGREE / SKILL INELIGIBLE'}
                    </span>

                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Overall Match: <span className="text-slate-900 dark:text-white">{match.overallMatchScore}%</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{job.title}</span>
                    <span className="text-xs text-slate-500 font-normal">at {job.company}</span>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{job.salaryRange}</span>
                    <span>•</span>
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>Exp: {job.experienceRequired}</span>
                  </div>
                </div>

                {/* Match Analysis Gauge & Action */}
                <div className="shrink-0 flex flex-col items-end gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
                  {/* Detailed Match breakdown bars */}
                  <div className="w-full space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Education:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{match.educationMatchScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Skills:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{match.skillMatchScore}%</span>
                    </div>
                  </div>

                  {match.educationGapReason && (
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 p-2 rounded-lg border border-rose-200 dark:border-rose-800 leading-normal w-full">
                      {match.educationGapReason}
                    </div>
                  )}

                  {!isIneligible ? (
                    <button
                      onClick={() => onApplyForJob(job)}
                      className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Apply for Vacancy</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-xs cursor-not-allowed text-center"
                    >
                      Ineligible Background
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Upgrading Courses & Certifications Marketplace */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Skill Upgrading & Certifications Center</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Complete courses to unlock higher job match scores</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_SKILL_COURSES.map(course => (
            <div key={course.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  <span>{course.provider}</span>
                  <span>{course.durationDays} Days Bootcamp</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{course.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{course.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  Unlocks: {course.skillUnlocked}
                </span>
                <button
                  onClick={() => handleEnrollCourse(course)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Enroll & Certification</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
