export type ExperienceTier = 'Fresher' | '0–1 Year' | '1–3 Years' | '3–5 Years' | '5–10 Years' | '10+ Years';

export interface TargetCareerDirection {
  primaryDomain: string; // e.g. 'hr_people', 'administration', 'scada_automation', 'finance_corporate', 'software_dev', 'product_project'
  primaryRoleGoal: string; // e.g. 'HR Executive', 'Admin Executive', 'Facilities Specialist', 'Software Engineer'
  secondaryRoleGoal?: string; // e.g. 'Talent Acquisition Specialist', 'Office Administrator'
  transitionStatus: 'DIRECT_MATCH' | 'IN_TRANSITION' | 'EXPLORING';
  transferableSkills: string[];
  skillGaps: string[];
  completedCourses: string[];
  completedProjects: string[];
}

export interface CandidateProfile {
  name: string;
  age: number;
  education: string;
  degree: string;
  specialization: string;
  college: string;
  graduationYear: number;
  experienceTier: ExperienceTier;
  experienceYears: number;
  previousCompany?: string;
  technicalSkills: string[];
  softSkills: string[];
  certifications: string[];
  preferredLocations: string[];
  expectedSalary: number;
  currency: string;
  willingToRelocate: boolean;
  noticePeriodDays: number;
  careerGoal: string;
  primaryCareerDomain: string;
  secondaryInterest?: string;
  bioSummary: string;
  targetCareerDirection?: TargetCareerDirection;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyTagline: string;
  companySize: string;
  industry: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  experienceRequired: string;
  minExpYears: number;
  salaryRange: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  skillsRequired: string[];
  preferredDegree: string[];
  department: string;
  reportingManager: string;
  managerRole: string;
  interviewDifficulty: number; // 1 to 5
  interviewRounds: string[]; // e.g. ['Resume Screening', 'HR Screening', 'Technical Round', 'Managerial Fit', 'Offer']
  description: string;
  responsibilities: string[];
  benefits: string[];
}

export type ApplicationStage = 
  | 'APPLIED' 
  | 'RESUME_SCREEN' 
  | 'HR_SCREEN' 
  | 'TECHNICAL_INTERVIEW' 
  | 'MANAGER_ROUND' 
  | 'OFFER_EXTENDED' 
  | 'OFFER_ACCEPTED' 
  | 'REJECTED' 
  | 'WAITLISTED';

export interface InterviewMessage {
  id: string;
  sender: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isPlayer?: boolean;
  emotion?: 'neutral' | 'impressed' | 'skeptical' | 'challenging' | 'warm';
}

export interface JobOffer {
  id: string;
  jobId: string;
  company: string;
  title: string;
  department: string;
  location: string;
  baseSalary: number;
  variableBonus: number;
  joiningBonus: number;
  probationMonths: number;
  noticePeriodDays: number;
  reportingManager: string;
  managerRole: string;
  currency: string;
  benefits: string[];
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'NEGOTIATING';
  negotiationCount: number;
}

export interface JobApplication {
  id: string;
  job: JobOpening;
  appliedDate: string;
  currentStage: ApplicationStage;
  currentRoundIndex: number;
  matchScore: number;
  matchBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    verdict: 'Strong Match' | 'Good Match' | 'Stretch Role' | 'Low Match';
  };
  interviewerName?: string;
  interviewerRole?: string;
  interviewerPersonality?: 'STRICT' | 'FRIENDLY' | 'TECHNICAL' | 'SENIOR_MANAGER';
  recruiterNotes?: string;
  interviewChat: InterviewMessage[];
  hiddenImpression: {
    technicalKnowledge: number;
    communication: number;
    confidence: number;
    problemSolving: number;
    cultureFit: number;
  };
  rejectionReason?: string;
  feedbackNotes?: string[];
  offer?: JobOffer;
  lastUpdated: string;
}
