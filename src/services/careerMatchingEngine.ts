import { JobOpening } from '../types/jobMarket';
import { EducationProfile, JobMatchAnalysis, SkillCourse } from '../types/education';

export function evaluateJobEligibility(
  job: JobOpening,
  educationProfile: EducationProfile,
  playerSkills: string[] = [],
  experienceYears: number = 0
): JobMatchAnalysis {
  const jobTitleLower = job.title.toLowerCase();
  const jobDeptLower = job.department.toLowerCase();
  const degreeLower = educationProfile.degree.toLowerCase();
  const qualLower = educationProfile.highest_qualification.toLowerCase();
  const specLower = educationProfile.specialization.toLowerCase();

  // 1. Education Match Analysis
  let educationMatchScore = 0;
  let isDegreeStrictIneligible = false;
  let gapReason = '';

  const preferredDegrees = job.preferredDegree.map(d => d.toLowerCase());

  const degreeMatches = preferredDegrees.some(pd => 
    degreeLower.includes(pd) || 
    pd.includes(degreeLower) || 
    specLower.includes(pd) ||
    qualLower.includes(pd)
  );

  if (degreeMatches) {
    educationMatchScore = 100;
  } else {
    // Cross-domain check rules
    const isEngineeringJob = jobDeptLower.includes('scada') || jobDeptLower.includes('automation') || jobDeptLower.includes('electrical') || jobDeptLower.includes('power') || jobTitleLower.includes('engineer') || jobTitleLower.includes('plc');
    const isEngineeringDegree = qualLower.includes('tech') || qualLower.includes('diploma') || degreeLower.includes('engineering');

    const isHrJob = jobDeptLower.includes('hr') || jobDeptLower.includes('people') || jobTitleLower.includes('recruitment') || jobTitleLower.includes('talent');
    const isHrDegree = degreeLower.includes('hr') || specLower.includes('hr') || specLower.includes('people') || degreeLower.includes('human resources');

    const isFinanceJob = jobDeptLower.includes('finance') || jobDeptLower.includes('accounting') || jobDeptLower.includes('audit') || jobDeptLower.includes('tax') || jobTitleLower.includes('analyst') || jobTitleLower.includes('accountant');
    const isFinanceDegree = degreeLower.includes('finance') || degreeLower.includes('m.com') || degreeLower.includes('b.com') || degreeLower.includes('ca') || specLower.includes('finance');

    const isSoftwareJob = jobDeptLower.includes('software') || jobDeptLower.includes('cloud') || jobDeptLower.includes('devops') || jobTitleLower.includes('developer') || jobTitleLower.includes('swe');
    const isSoftwareDegree = qualLower.includes('mca') || degreeLower.includes('computer') || degreeLower.includes('it') || degreeLower.includes('software');

    if (isEngineeringJob && !isEngineeringDegree) {
      isDegreeStrictIneligible = true;
      gapReason = `Degree mismatch: ${educationProfile.degree} does not satisfy the core engineering/technical background required for ${job.title}.`;
      educationMatchScore = 15;
    } else if (isHrJob && !isHrDegree && !degreeLower.includes('mba') && !qualLower.includes('ba')) {
      educationMatchScore = 40;
      gapReason = `Preferred background: HR roles favor candidates with MBA HR, M.A. Psychology, or People Operations background.`;
    } else if (isFinanceJob && !isFinanceDegree) {
      educationMatchScore = 35;
      gapReason = `Preferred background: Financial analytics requires M.Com, MBA Finance, CA, or B.Com Accounting foundation.`;
    } else {
      educationMatchScore = 65; // Moderate domain overlap
    }
  }

  // 2. Skill Match Analysis
  const combinedPlayerSkills = Array.from(new Set([
    ...(educationProfile.skills || []),
    ...playerSkills,
  ])).map(s => s.toLowerCase());

  const metRequirements: string[] = [];
  const missingSkills: string[] = [];

  job.skillsRequired.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const hasSkill = combinedPlayerSkills.some(ps => ps.includes(skillLower) || skillLower.includes(ps));
    if (hasSkill) {
      metRequirements.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchScore = job.skillsRequired.length > 0
    ? Math.round((metRequirements.length / job.skillsRequired.length) * 100)
    : 100;

  // 3. Experience Match Analysis
  let experienceMatchScore = 100;
  if (experienceYears < job.minExpYears) {
    const diff = job.minExpYears - experienceYears;
    experienceMatchScore = Math.max(20, 100 - diff * 25);
  }

  // 4. Certification Match Analysis
  let certificationMatchScore = 70;
  if (educationProfile.certifications && educationProfile.certifications.length > 0) {
    certificationMatchScore = Math.min(100, 70 + educationProfile.certifications.length * 15);
  }

  // 5. Overall Match Score Calculation
  let overallMatchScore = Math.round(
    educationMatchScore * 0.4 +
    skillMatchScore * 0.35 +
    experienceMatchScore * 0.15 +
    certificationMatchScore * 0.1
  );

  if (isDegreeStrictIneligible) {
    overallMatchScore = Math.min(30, overallMatchScore);
  }

  // 6. Match Tier Determination
  let matchTier: JobMatchAnalysis['matchTier'] = 'GOOD_POTENTIAL';
  if (isDegreeStrictIneligible || overallMatchScore < 40) {
    matchTier = 'INELIGIBLE';
  } else if (overallMatchScore >= 80) {
    matchTier = 'STRONG_MATCH';
  } else if (overallMatchScore >= 60) {
    matchTier = 'GOOD_POTENTIAL';
  } else {
    matchTier = 'SKILL_GAP';
  }

  // 7. Recommended Skill Upgrading Courses
  const recommendedSkillCourses: SkillCourse[] = missingSkills.map((sk, idx) => ({
    id: `course-${idx}-${Date.now()}`,
    title: `Mastery Certification: ${sk}`,
    provider: sk.includes('SCADA') || sk.includes('PLC') ? 'Siemens Industrial Academy' : sk.includes('AWS') || sk.includes('Cloud') ? 'AWS Training' : 'NPTEL & Enterprise Portal',
    durationDays: 14,
    costInr: 12000,
    skillUnlocked: sk,
    certificationGranted: `Certified ${sk} Professional`,
    prerequisites: ['Basic Engineering or Corporate Aptitude'],
    description: `Accelerated 14-day practical bootcamp unlocking ${sk} competency for enterprise roles.`,
  }));

  return {
    overallMatchScore,
    educationMatchScore,
    skillMatchScore,
    experienceMatchScore,
    certificationMatchScore,
    matchTier,
    unlockedCareerFamily: job.department,
    metRequirements,
    missingSkills,
    educationGapReason: isDegreeStrictIneligible ? gapReason : (missingSkills.length > 0 ? `Requires acquisition of ${missingSkills.join(', ')}.` : undefined),
    recommendedSkillCourses,
  };
}
