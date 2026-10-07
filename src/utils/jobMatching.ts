import { CandidateProfile, JobOpening, JobApplication } from '../types/jobMarket';

export function calculateJobMatch(candidate: CandidateProfile, job: JobOpening) {
  // 1. Skills match (normalized case-insensitive matching)
  const candidateSkills = (candidate.technicalSkills || []).map(s => s.toLowerCase().trim());
  const requiredSkills = (job.skillsRequired || []).map(s => s.toLowerCase().trim());

  let matchedSkillsCount = 0;
  for (const req of requiredSkills) {
    if (candidateSkills.some(cs => cs.includes(req) || req.includes(cs))) {
      matchedSkillsCount++;
    }
  }

  const skillsMatch = Math.round(
    requiredSkills.length > 0 ? (matchedSkillsCount / requiredSkills.length) * 100 : 70
  );

  // 2. Experience match
  const candidateExp = Number(candidate.experienceYears) || 0;
  let experienceMatch = 80;
  if (candidateExp >= job.minExpYears) {
    experienceMatch = Math.min(100, 85 + (candidateExp - job.minExpYears) * 5);
  } else {
    // Gap penalty
    const gap = job.minExpYears - candidateExp;
    experienceMatch = Math.max(25, 75 - gap * 20);
  }

  // 3. Education match
  let educationMatch = 75;
  const spec = (candidate.specialization || '').toLowerCase();
  const deg = (candidate.degree || '').toLowerCase();

  const isRelevantDeg = (job.preferredDegree || []).some(
    pd => spec.includes(pd.toLowerCase()) || pd.toLowerCase().includes(spec) || deg.includes('tech') || deg.includes('engineering')
  );
  if (isRelevantDeg) {
    educationMatch = 95;
  }

  // 4. Overall Weighted Score
  const overall = Math.round(skillsMatch * 0.5 + experienceMatch * 0.3 + educationMatch * 0.2);

  let verdict: 'Strong Match' | 'Good Match' | 'Stretch Role' | 'Low Match' = 'Good Match';
  if (overall >= 78) {
    verdict = 'Strong Match';
  } else if (overall >= 60) {
    verdict = 'Good Match';
  } else if (overall >= 42) {
    verdict = 'Stretch Role';
  } else {
    verdict = 'Low Match';
  }

  return {
    skillsMatch,
    experienceMatch,
    educationMatch,
    overall,
    verdict,
  };
}

export function evaluateApplicationScreening(
  candidate: CandidateProfile,
  job: JobOpening,
  matchScore: number
): {
  stage: 'HR_SCREEN' | 'TECHNICAL_INTERVIEW' | 'REJECTED' | 'WAITLISTED';
  recruiterNotes: string;
  rejectionReason?: string;
  interviewerName: string;
  interviewerRole: string;
  personality: 'STRICT' | 'FRIENDLY' | 'TECHNICAL' | 'SENIOR_MANAGER';
} {
  // Recruiters pool
  const recruiters = [
    { name: 'Priya Sharma', role: 'Lead Talent Partner', personality: 'FRIENDLY' as const },
    { name: 'Ananya Deshmukh', role: 'Technical Recruiter', personality: 'STRICT' as const },
    { name: 'Rohan Varma', role: 'Staff Engineering Recruiter', personality: 'TECHNICAL' as const },
  ];
  const recruiter = recruiters[Math.floor(Math.random() * recruiters.length)];

  // Strict randomness and realistic qualification filter
  const randomFactor = Math.random() * 20 - 10; // -10 to +10 variance
  const adjustedScore = matchScore + randomFactor;

  if (adjustedScore >= 68) {
    // Passes resume screening! Proceeds to HR Screening
    return {
      stage: 'HR_SCREEN',
      recruiterNotes: `Hi ${candidate.name}, your profile and background in ${candidate.specialization || 'engineering'} stood out to our hiring team. We would like to schedule an initial HR conversation to discuss the ${job.title} role at ${job.company}.`,
      interviewerName: recruiter.name,
      interviewerRole: recruiter.role,
      personality: recruiter.personality,
    };
  } else if (adjustedScore >= 48) {
    // Waitlisted / Pending review
    return {
      stage: 'WAITLISTED',
      recruiterNotes: `Thank you for applying to ${job.company}. Your application for ${job.title} is currently under active review with the hiring committee. We will update you as candidate shortlisting progresses.`,
      interviewerName: recruiter.name,
      interviewerRole: recruiter.role,
      personality: recruiter.personality,
    };
  } else {
    // Realistic rejection
    return {
      stage: 'REJECTED',
      recruiterNotes: `Thank you for your interest in ${job.company}. After thorough review of your resume and technical skills, we have chosen to proceed with other applicants whose experience with ${job.skillsRequired.slice(0, 2).join(' and ')} more closely matches our immediate project needs.`,
      rejectionReason: `Missing critical hands-on experience in ${job.skillsRequired[0] || 'core technologies'}.`,
      interviewerName: recruiter.name,
      interviewerRole: recruiter.role,
      personality: 'STRICT',
    };
  }
}
