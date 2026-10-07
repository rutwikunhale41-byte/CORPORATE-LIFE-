export interface PersonalEducationItem {
  id: string;
  qualification: string; // e.g. "B.Tech", "MBA", "Diploma", "M.Com"
  degree: string; // e.g. "B.Tech Electrical", "MBA HR", "M.Com Accounting"
  specialization: string; // e.g. "SCADA & Industrial Automation", "Talent Acquisition"
  college: string;
  year: number;
  gradeGpa?: string;
}

export interface PersonalExperienceItem {
  id: string;
  title: string;
  company: string;
  durationYears: number;
  domain: string;
  responsibilities: string[];
}

export interface PersonalProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  linkOrResult?: string;
}

export interface PersonalSkillItem {
  name: string;
  category: 'TECHNICAL' | 'SOFTWARE' | 'INDUSTRIAL' | 'DOMAIN' | 'SOFT_SKILL';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  source: 'Education' | 'Work Experience' | 'Project' | 'Certification' | 'Self-Learned';
}

export interface PersonalCareerProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bioSummary: string;
  };
  education: PersonalEducationItem[];
  skills: PersonalSkillItem[];
  software_tools: string[];
  certifications: Array<{ id: string; name: string; issuer: string; year: number }>;
  experience: PersonalExperienceItem[];
  projects: PersonalProjectItem[];
  industries: string[];
  job_titles: string[];
  responsibilities: string[];
  soft_skills: string[];
  languages: string[];
  career_preferences: string[];
  careerDirections: {
    primary: string;
    secondary: string;
    exploration: string;
  };
  careerReadinessScore: number; // 0-100
}

export interface MatchFactorBreakdown {
  educationMatch: number; // 0-100
  skillMatch: number; // 0-100
  experienceMatch: number; // 0-100
  toolMatch: number; // 0-100
  certificationMatch: number; // 0-100
  projectMatch: number; // 0-100
  industryMatch: number; // 0-100
  responsibilityMatch: number; // 0-100
  transferableSkillMatch: number; // 0-100
  seniorityMatch: number; // 0-100
  interestMatch: number; // 0-100
}

export interface CareerUniverseItem {
  id: string;
  title: string;
  category: 'BEST_MATCH' | 'ADJACENT' | 'CAREER_SWITCH' | 'WITH_UPSKILLING' | 'NON_TECHNICAL';
  industry: string;
  department: string;
  seniorityLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead' | 'Management';
  overallMatchScore: number; // 0-100
  matchBreakdown: MatchFactorBreakdown;
  matchingStrengths: string[];
  transferableSkillsUsed: string[];
  missingSkills: string[];
  educationRequirement: string;
  expectedSalaryRangeInr: string;
  minSalaryInr: number;
  maxSalaryInr: number;
  whySuitableExplanation: string;
  skillGapRoadmap: {
    currentMatchScore: number;
    potentialMatchScore: number;
    steps: Array<{
      stepNumber: number;
      actionTitle: string;
      skillToAcquire: string;
      recommendedCourseTitle: string;
      impactPercentageIncrease: number;
    }>;
  };
  careerGraphNodes: Array<{
    stageName: string;
    typicalTimeYears: string;
    salaryInr: string;
  }>;
}

export interface WhatCanIBecomeResult {
  generatedAt: string;
  profileSummary: string;
  topCareers: CareerUniverseItem[];
  adjacentCareers: CareerUniverseItem[];
  careerSwitches: CareerUniverseItem[];
  upskillingCareers: CareerUniverseItem[];
  nonTechnicalCareers: CareerUniverseItem[];
  recommendedCertifications: Array<{
    courseTitle: string;
    skillUnlocked: string;
    costInr: number;
    impactOnCareers: string[];
  }>;
}
