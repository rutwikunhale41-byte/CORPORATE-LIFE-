export type HighestQualification = 
  | 'B.Tech'
  | 'B.E.'
  | 'M.Tech'
  | 'MBA'
  | 'MCA'
  | 'M.Com'
  | 'B.Com'
  | 'BBA'
  | 'B.Sc'
  | 'M.Sc'
  | 'BA'
  | 'MA'
  | 'LLB'
  | 'LLM'
  | 'B.Des'
  | 'B.Arch'
  | 'Diploma Engineering'
  | 'B.Pharm'
  | 'CA / CS / CMA';

export type EducationLevel = 
  | 'Diploma' 
  | 'Undergraduate' 
  | 'Postgraduate' 
  | 'Professional Certification';

export interface PastExperienceItem {
  title: string;
  company: string;
  durationYears: number;
  domain: string;
}

export interface EducationProfile {
  highest_qualification: HighestQualification;
  degree: string; // e.g. "B.Tech Electrical", "MBA HR", "M.Com Accounting & Finance", "MCA", "B.Com Taxation"
  specialization: string; // e.g. "SCADA & Industrial Automation", "Talent Acquisition & HRBP", "Corporate Finance", "Web & Cloud Software"
  college: string;
  graduation_year: number;
  education_level: EducationLevel;
  skills: string[];
  certifications: string[];
  experience: PastExperienceItem[];
  career_preferences: string[];
}

export interface SkillCourse {
  id: string;
  title: string;
  provider: string; // e.g. "Siemens Academy", "NPTEL", "Coursera", "ICAI", "PMI", "AWS Certification"
  durationDays: number;
  costInr: number;
  skillUnlocked: string;
  certificationGranted: string;
  prerequisites: string[];
  description: string;
}

export interface JobMatchAnalysis {
  overallMatchScore: number; // 0 - 100
  educationMatchScore: number; // 0 - 100
  skillMatchScore: number; // 0 - 100
  experienceMatchScore: number; // 0 - 100
  certificationMatchScore: number; // 0 - 100
  matchTier: 'STRONG_MATCH' | 'GOOD_POTENTIAL' | 'SKILL_GAP' | 'INELIGIBLE';
  unlockedCareerFamily: string;
  metRequirements: string[];
  missingSkills: string[];
  educationGapReason?: string;
  recommendedSkillCourses: SkillCourse[];
}

export interface ProgressionTrackOption {
  trackName: 'Technical Architecture' | 'Management & Leadership' | 'Specialist Practitioner' | 'Project & Program';
  levels: Array<{
    levelName: string;
    minYearsExp: number;
    typicalSalaryInr: number;
    responsibilities: string;
  }>;
}

export interface CareerFamilyDefinition {
  id: string;
  familyName: string;
  category: 'INDUSTRIAL' | 'ENGINEERING' | 'BUSINESS_MBA' | 'COMMERCE_MCOM' | 'DESIGN_LAW' | 'GENERAL';
  eligibleDegrees: string[];
  entryLevelRoles: string[];
  intermediateRoles: string[];
  seniorLevelRoles: string[];
  coreSkills: string[];
  typicalDepartments: string[];
  progressionTracks: ProgressionTrackOption[];
}
