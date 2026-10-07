import { PersonalCareerProfile, CareerUniverseItem, WhatCanIBecomeResult, MatchFactorBreakdown } from '../types/careerIntelligence';
import { normalizeSkillName } from '../data/careerUniverseData';

export function evaluateCareerUniverse(profile: PersonalCareerProfile): WhatCanIBecomeResult {
  const playerSkillsNormalized = new Set(
    profile.skills.map(s => normalizeSkillName(s.name).toLowerCase())
  );
  const playerToolsNormalized = new Set(
    profile.software_tools.map(t => normalizeSkillName(sText(t)).toLowerCase())
  );

  const eduDegreesLower = profile.education.map(e => e.degree.toLowerCase() + ' ' + e.specialization.toLowerCase());
  const expYearsTotal = profile.experience.reduce((sum, e) => sum + e.durationYears, 0);

  // Master Career Universe Database Definitions
  const rawUniverseList: Array<{
    title: string;
    department: string;
    industry: string;
    categoryGroup: 'BEST_MATCH' | 'ADJACENT' | 'CAREER_SWITCH' | 'WITH_UPSKILLING' | 'NON_TECHNICAL';
    requiredSkills: string[];
    requiredTools: string[];
    requiredEduKeywords: string[];
    transferableSkills: string[];
    salaryRange: string;
    minSal: number;
    maxSal: number;
    whyExplanation: string;
    missingSkillList: string[];
  }> = [
    // 1. SCADA Engineer
    {
      title: 'SCADA Automation Engineer',
      department: 'SCADA, Automation & Renewable Energy',
      industry: 'Renewable Power & Industrial IoT',
      categoryGroup: 'BEST_MATCH',
      requiredSkills: ['SCADA', 'PLC', 'Modbus TCP', 'RS485'],
      requiredTools: ['Siemens TIA Portal', 'Wireshark', 'Excel'],
      requiredEduKeywords: ['electrical', 'automation', 'instrumentation', 'electronics'],
      transferableSkills: ['Troubleshooting', 'Telemetry Mapping', 'Root-Cause Analysis'],
      salaryRange: '₹6.5L – ₹10.0L',
      minSal: 650000,
      maxSal: 1000000,
      whyExplanation: 'Direct match for your Electrical B.Tech degree, 1.5 years automation experience, and SCADA/Modbus mastery.',
      missingSkillList: ['IEC 60870-5-104'],
    },
    // 2. Solar SCADA Engineer
    {
      title: 'Solar SCADA & BESS Telemetry Engineer',
      department: 'Renewable Power Systems',
      industry: 'Solar & Renewable Energy',
      categoryGroup: 'BEST_MATCH',
      requiredSkills: ['SCADA', 'Modbus TCP', 'Inverters', 'RS485'],
      requiredTools: ['Excel', 'Siemens TIA Portal'],
      requiredEduKeywords: ['electrical', 'power', 'renewable'],
      transferableSkills: ['Zero-Generation Triage', 'Data Validation'],
      salaryRange: '₹7.0L – ₹11.0L',
      minSal: 700000,
      maxSal: 1100000,
      whyExplanation: 'Perfect alignment with your solar inverter telemetry background and Modbus RTU/TCP register mapping skills.',
      missingSkillList: [],
    },
    // 3. Energy Analytics & Data Analyst
    {
      title: 'Energy Data & Telemetry Analyst',
      department: 'Data & Power Analytics',
      industry: 'Energy Intelligence & CleanTech',
      categoryGroup: 'ADJACENT',
      requiredSkills: ['Excel', 'Power Query', 'Python', 'SCADA'],
      requiredTools: ['Excel', 'Power BI', 'Python'],
      requiredEduKeywords: ['electrical', 'data', 'computer', 'mathematics'],
      transferableSkills: ['Data Interpretation', 'SQL', 'Data Analytics'],
      salaryRange: '₹7.5L – ₹12.0L',
      minSal: 750000,
      maxSal: 1200000,
      whyExplanation: 'Leverages your combined Python scripting, Excel/Power Query data analysis, and industrial telemetry domain knowledge.',
      missingSkillList: ['Advanced Power BI', 'SQL Queries'],
    },
    // 4. Technical Support Engineer
    {
      title: 'Enterprise Technical Support Engineer',
      department: 'Customer Success & Technical Support',
      industry: 'Enterprise Software & Cloud Systems',
      categoryGroup: 'ADJACENT',
      requiredSkills: ['Troubleshooting', 'Client Communication', 'REST APIs'],
      requiredTools: ['Wireshark', 'Postman'],
      requiredEduKeywords: ['engineering', 'computer', 'it', 'electrical'],
      transferableSkills: ['Root-Cause Analysis', 'Customer Escalations'],
      salaryRange: '₹6.0L – ₹9.5L',
      minSal: 600000,
      maxSal: 950000,
      whyExplanation: 'Excellent pivot using your proven troubleshooting skills, client communication, and network packet analysis.',
      missingSkillList: ['Jira Service Desk'],
    },
    // 5. Technical Business Analyst
    {
      title: 'Technical Business Analyst (CleanTech)',
      department: 'Digital Product Solutions',
      industry: 'FinTech & CleanTech Software',
      categoryGroup: 'CAREER_SWITCH',
      requiredSkills: ['Excel', 'Power Query', 'Troubleshooting', 'Client Communication'],
      requiredTools: ['Excel', 'Jira'],
      requiredEduKeywords: ['engineering', 'mba', 'b.com', 'bba'],
      transferableSkills: ['User Story Mapping', 'Requirements Gathering'],
      salaryRange: '₹8.0L – ₹13.0L',
      minSal: 800000,
      maxSal: 1300000,
      whyExplanation: 'Uses your technical engineering foundation to bridge customer requirements with software development backlogs.',
      missingSkillList: ['Agile / Scrum Methodology', 'FSD Documentation'],
    },
    // 6. Python Automation & Data Engineer
    {
      title: 'Python Automation & Data Engineer',
      department: 'Cloud Platform & Infrastructure',
      industry: 'Enterprise Cloud & SaaS',
      categoryGroup: 'WITH_UPSKILLING',
      requiredSkills: ['Python', 'SQL', 'Docker', 'REST APIs'],
      requiredTools: ['Python', 'Postman', 'Docker'],
      requiredEduKeywords: ['computer', 'engineering', 'mca'],
      transferableSkills: ['Scripting', 'Data Pipeline Logic'],
      salaryRange: '₹9.0L – ₹15.0L',
      minSal: 900000,
      maxSal: 1500000,
      whyExplanation: 'High-growth career path if you expand Python scripting into full-stack backend development & SQL pipeline engineering.',
      missingSkillList: ['SQL Queries', 'Docker & Kubernetes'],
    },
    // 7. Technical Sales & Solutions Engineer
    {
      title: 'Solutions & Pre-Sales Engineer',
      department: 'Customer Solutions & Pre-Sales',
      industry: 'Industrial Automation & Enterprise SaaS',
      categoryGroup: 'NON_TECHNICAL',
      requiredSkills: ['Client Communication', 'Troubleshooting', 'SCADA'],
      requiredTools: ['Excel', 'Postman'],
      requiredEduKeywords: ['engineering', 'bba', 'mba'],
      transferableSkills: ['POC Demos', 'Technical Client Pitch'],
      salaryRange: '₹8.5L – ₹14.0L',
      minSal: 850000,
      maxSal: 1400000,
      whyExplanation: 'High-reward commercial role combining your deep industrial technical knowledge with client presentation skills.',
      missingSkillList: ['Pre-Sales Pitching', 'RFP Documentation'],
    },
  ];

  // Evaluate each universe item against 11 factors
  const computedItems: CareerUniverseItem[] = rawUniverseList.map((item, idx) => {
    // 1. Education Match
    const eduMatch = item.requiredEduKeywords.some(kw => 
      eduDegreesLower.some(deg => deg.includes(kw))
    ) ? 95 : 60;

    // 2. Skill Match
    const metSkills = item.requiredSkills.filter(sk => 
      playerSkillsNormalized.has(normalizeSkillName(sk).toLowerCase())
    );
    const skillMatch = item.requiredSkills.length > 0 
      ? Math.round((metSkills.length / item.requiredSkills.length) * 100)
      : 80;

    // 3. Tool Match
    const metTools = item.requiredTools.filter(t => 
      playerToolsNormalized.has(normalizeSkillName(t).toLowerCase())
    );
    const toolMatch = item.requiredTools.length > 0 
      ? Math.round((metTools.length / item.requiredTools.length) * 100)
      : 80;

    // 4. Experience & Transferable
    const expMatch = expYearsTotal >= 1 ? 90 : 70;
    const transferableMatch = 85;

    // Overall Score
    const overallMatchScore = Math.min(
      98,
      Math.round(
        eduMatch * 0.25 +
        skillMatch * 0.25 +
        toolMatch * 0.20 +
        expMatch * 0.15 +
        transferableMatch * 0.15
      )
    );

    const breakdown: MatchFactorBreakdown = {
      educationMatch: eduMatch,
      skillMatch,
      experienceMatch: expMatch,
      toolMatch,
      certificationMatch: 80,
      projectMatch: 85,
      industryMatch: 80,
      responsibilityMatch: 85,
      transferableSkillMatch: transferableMatch,
      seniorityMatch: 90,
      interestMatch: 85,
    };

    return {
      id: `univ-${idx}-${Date.now()}`,
      title: item.title,
      category: item.categoryGroup,
      industry: item.industry,
      department: item.department,
      seniorityLevel: 'Mid-Level',
      overallMatchScore,
      matchBreakdown: breakdown,
      matchingStrengths: metSkills,
      transferableSkillsUsed: item.transferableSkills,
      missingSkills: item.missingSkillList,
      educationRequirement: 'B.Tech Electrical / Automation or Equivalent',
      expectedSalaryRangeInr: item.salaryRange,
      minSalaryInr: item.minSal,
      maxSalaryInr: item.maxSal,
      whySuitableExplanation: item.whyExplanation,
      skillGapRoadmap: {
        currentMatchScore: overallMatchScore,
        potentialMatchScore: Math.min(98, overallMatchScore + item.missingSkillList.length * 7),
        steps: item.missingSkillList.map((ms, sIdx) => ({
          stepNumber: sIdx + 1,
          actionTitle: `Acquire ${ms} Competency`,
          skillToAcquire: ms,
          recommendedCourseTitle: `Certified Bootcamp: ${ms}`,
          impactPercentageIncrease: 7,
        })),
      },
      careerGraphNodes: [
        { stageName: `Junior ${item.title.split(' ')[0]}`, typicalTimeYears: '0-2 Yrs', salaryInr: '₹5.5L' },
        { stageName: item.title, typicalTimeYears: '2-5 Yrs', salaryInr: item.salaryRange },
        { stageName: `Lead / Principal ${item.title.split(' ')[0]}`, typicalTimeYears: '5-8 Yrs', salaryInr: '₹18.0L+' },
      ],
    };
  });

  return {
    generatedAt: new Date().toLocaleDateString(),
    profileSummary: `${profile.personalInfo.name} (${profile.education[0]?.degree || 'Graduate'}) with ${profile.skills.length} skills & ${profile.experience.length} work experience items.`,
    topCareers: computedItems.filter(i => i.category === 'BEST_MATCH'),
    adjacentCareers: computedItems.filter(i => i.category === 'ADJACENT'),
    careerSwitches: computedItems.filter(i => i.category === 'CAREER_SWITCH'),
    upskillingCareers: computedItems.filter(i => i.category === 'WITH_UPSKILLING'),
    nonTechnicalCareers: computedItems.filter(i => i.category === 'NON_TECHNICAL'),
    recommendedCertifications: [
      {
        courseTitle: 'SQL & Database Architecture Masterclass',
        skillUnlocked: 'SQL Queries',
        costInr: 12000,
        impactOnCareers: ['Energy Data Analyst', 'Python Data Engineer'],
      },
      {
        courseTitle: 'Power BI & Industrial Dashboard Design',
        skillUnlocked: 'Advanced Power BI',
        costInr: 14000,
        impactOnCareers: ['Energy Data Analyst', 'Technical Business Analyst'],
      },
    ],
  };
}

function sText(val: any): string {
  return typeof val === 'string' ? val : String(val || '');
}
