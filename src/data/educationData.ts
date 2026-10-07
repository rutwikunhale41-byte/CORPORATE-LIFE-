import { CareerFamilyDefinition, SkillCourse, EducationProfile } from '../types/education';
import { JobOpening } from '../types/jobMarket';

export const MASTER_CAREER_FAMILIES: CareerFamilyDefinition[] = [
  // 1. SCADA, Automation & Renewable Energy
  {
    id: 'scada_automation_family',
    familyName: 'SCADA, Industrial Automation & Renewable Energy',
    category: 'INDUSTRIAL',
    eligibleDegrees: ['B.Tech Electrical', 'B.Tech Instrumentation', 'B.Tech Electronics', 'Diploma Electrical'],
    entryLevelRoles: ['Associate SCADA Engineer', 'Junior Automation Engineer', 'Testing & Commissioning Trainee'],
    intermediateRoles: ['SCADA Engineer', 'PLC Programmer', 'Solar Telemetry Specialist', 'Substation Controls Lead'],
    seniorLevelRoles: ['Lead SCADA Architect', 'Head of Industrial IoT', 'Principal Renewable Grid Engineer'],
    coreSkills: ['SCADA', 'PLC', 'Modbus RTU/TCP', 'IEC 60870-5-104', 'RS485 Serial', 'Inverters', 'HMI'],
    typicalDepartments: ['SCADA, Automation & Renewable Energy', 'Industrial Controls', 'Power Systems'],
    progressionTracks: [
      {
        trackName: 'Technical Architecture',
        levels: [
          { levelName: 'Associate SCADA Engineer', minYearsExp: 0, typicalSalaryInr: 600000, responsibilities: 'Inverter tag mapping and gateway configuration.' },
          { levelName: 'SCADA Engineer', minYearsExp: 2, typicalSalaryInr: 900000, responsibilities: 'Modbus/IEC protocol calibration and FAT/SAT support.' },
          { levelName: 'Lead SCADA Architect', minYearsExp: 5, typicalSalaryInr: 1800000, responsibilities: '150MW Substation telecontrol gateway architecture.' }
        ]
      }
    ]
  },

  // 2. MBA - Human Resources
  {
    id: 'mba_hr_family',
    familyName: 'Human Resources & Talent Acquisition',
    category: 'BUSINESS_MBA',
    eligibleDegrees: ['MBA HR', 'MBA People Operations', 'M.A. Organizational Psychology', 'BBA HR'],
    entryLevelRoles: ['HR Executive', 'Recruitment Associate', 'Talent Acquisition Coordinator', 'People Ops Executive'],
    intermediateRoles: ['HR Business Partner (HRBP)', 'Talent Acquisition Specialist', 'L&D Specialist', 'Compensation & Benefits Analyst'],
    seniorLevelRoles: ['Senior HRBP', 'Head of HR', 'Global Talent Director', 'Chief Human Resources Officer (CHRO)'],
    coreSkills: ['Recruitment', 'Resume Screening', 'Interviewing', 'SOC-2 Compliance', 'Performance Appraisals', 'Labor Laws', 'Employee Engagement'],
    typicalDepartments: ['People Operations & Culture', 'Talent Acquisition', 'Corporate HR'],
    progressionTracks: [
      {
        trackName: 'Management & Leadership',
        levels: [
          { levelName: 'HR Associate', minYearsExp: 0, typicalSalaryInr: 550000, responsibilities: 'Candidate screening, interview scheduling, and onboarding documentation.' },
          { levelName: 'HR Business Partner', minYearsExp: 3, typicalSalaryInr: 1100000, responsibilities: 'Departmental performance appraisals, probation management, and employee relations.' },
          { levelName: 'Head of HR', minYearsExp: 8, typicalSalaryInr: 2800000, responsibilities: 'Executive compensation bands, leadership succession, and corporate culture.' }
        ]
      }
    ]
  },

  // 3. MBA - Corporate Finance & FP&A
  {
    id: 'mba_finance_family',
    familyName: 'Corporate Finance, FP&A & Financial Analytics',
    category: 'BUSINESS_MBA',
    eligibleDegrees: ['MBA Finance', 'M.Com Finance', 'CA', 'CMA', 'B.Com Honors'],
    entryLevelRoles: ['Financial Analyst', 'FP&A Associate', 'Corporate Finance Executive', 'Risk Analyst Trainee'],
    intermediateRoles: ['Senior Financial Analyst', 'FP&A Manager', 'Treasury Manager', 'Cost Controller'],
    seniorLevelRoles: ['Finance Controller', 'VP of Corporate Finance', 'Chief Financial Officer (CFO)'],
    coreSkills: ['Financial Modeling', 'Variance Analysis', 'Budgeting & Forecasting', 'SLA Penalty Auditing', 'SAP ERP', 'Excel Financial Macros'],
    typicalDepartments: ['Corporate Finance & Accounting', 'FP&A', 'Risk & Treasury'],
    progressionTracks: [
      {
        trackName: 'Specialist Practitioner',
        levels: [
          { levelName: 'Financial Analyst', minYearsExp: 0, typicalSalaryInr: 700000, responsibilities: 'Variance analysis and departmental OPEX expense tracking.' },
          { levelName: 'Finance Controller', minYearsExp: 6, typicalSalaryInr: 2200000, responsibilities: 'Enterprise SLA penalty auditing and quarterly financial closing.' }
        ]
      }
    ]
  },

  // 4. M.Com - Accounting, Taxation & Audit
  {
    id: 'mcom_accounting_family',
    familyName: 'Commerce, Accounting, GST Taxation & Internal Audit',
    category: 'COMMERCE_MCOM',
    eligibleDegrees: ['M.Com', 'M.Com Accounting', 'M.Com Taxation', 'B.Com Honors'],
    entryLevelRoles: ['Accounts Executive', 'GST & Tax Assistant', 'Audit Associate', 'Commercial Executive'],
    intermediateRoles: ['Senior Accountant', 'Internal Auditor', 'Taxation Analyst', 'Commercial Manager'],
    seniorLevelRoles: ['Chief Accountant', 'Head of Audit & Compliance', 'Finance Operations Manager'],
    coreSkills: ['General Ledger', 'GST & TDS Filing', 'Internal Audit', 'Tally / NetSuite', 'Vendor Reconciliation', 'Financial Statements'],
    typicalDepartments: ['Corporate Finance & Accounting', 'Taxation & Audit', 'Commercial Operations'],
    progressionTracks: [
      {
        trackName: 'Specialist Practitioner',
        levels: [
          { levelName: 'Accounts Executive', minYearsExp: 0, typicalSalaryInr: 480000, responsibilities: 'General ledger entries, GST filing, and invoice matching.' },
          { levelName: 'Senior Auditor', minYearsExp: 4, typicalSalaryInr: 1200000, responsibilities: 'Internal financial audit controls and statutory tax reporting.' }
        ]
      }
    ]
  },

  // 5. MCA & Computer Science / Software Engineering
  {
    id: 'mca_software_family',
    familyName: 'Software Development, Cloud & DevOps Engineering',
    category: 'ENGINEERING',
    eligibleDegrees: ['MCA', 'B.Tech Computer Science', 'B.Tech IT', 'M.Sc Computer Science'],
    entryLevelRoles: ['Associate Software Engineer', 'Junior Cloud Developer', 'QA Automation Engineer', 'API Support Engineer'],
    intermediateRoles: ['Software Engineer (Cloud & Backend)', 'Senior Staff Engineer', 'DevOps Specialist', 'Database Architect'],
    seniorLevelRoles: ['Principal Software Architect', 'VP of Technology', 'Chief Technology Officer (CTO)'],
    coreSkills: ['TypeScript', 'Node.js', 'Go', 'Python', 'PostgreSQL', 'Docker & Kubernetes', 'Kafka', 'REST & gRPC'],
    typicalDepartments: ['Cloud Platform & Infrastructure', 'Software Engineering', 'DevOps & SRE'],
    progressionTracks: [
      {
        trackName: 'Technical Architecture',
        levels: [
          { levelName: 'Associate Software Engineer', minYearsExp: 0, typicalSalaryInr: 650000, responsibilities: 'REST API bug fixing and unit test creation.' },
          { levelName: 'Software Engineer', minYearsExp: 2, typicalSalaryInr: 1100000, responsibilities: 'Kafka consumer lag resolution and gRPC retry loops.' },
          { levelName: 'Principal Architect', minYearsExp: 7, typicalSalaryInr: 2500000, responsibilities: 'Multi-region zero-downtime distributed cloud architecture.' }
        ]
      }
    ]
  }
];

export const EXPANDED_JOB_OPENINGS: JobOpening[] = [
  // --- SCADA & RENEWABLE ENERGY ---
  {
    id: 'job-scada-104',
    title: 'SCADA Automation Engineer',
    company: 'Nexora Global',
    companyLogo: 'NG',
    companyTagline: 'Global Leader in Mission-Critical Infrastructure & Industrial IoT',
    companySize: '15,000+ Employees',
    industry: 'Renewable Energy & SCADA Systems',
    location: 'Pune / Mumbai (Hybrid)',
    workMode: 'Hybrid',
    experienceRequired: '0–2 Years',
    minExpYears: 0,
    salaryRange: '₹6.0L – ₹9.0L',
    minSalary: 600000,
    maxSalary: 900000,
    currency: '₹',
    skillsRequired: ['SCADA', 'PLC', 'Modbus RTU/TCP', 'RS485', 'IEC 60870-5-104', 'Inverters'],
    preferredDegree: ['B.Tech Electrical', 'B.Tech Instrumentation', 'Diploma Electrical'],
    department: 'SCADA, Automation & Renewable Energy',
    reportingManager: 'Sneha Rao',
    managerRole: 'Engineering Manager',
    interviewDifficulty: 3,
    interviewRounds: ['Resume Screening', 'Technical SCADA Round', 'Managerial Fit'],
    description: 'Design and commission supervisory control systems for solar farm telemetry and high-capacity inverter gateways.',
    responsibilities: [
      'Calibrate Modbus RS485 register mapping for solar inverters.',
      'Configure IEC 104 telecontrol points for grid despatch.',
      'Triage zero-generation dashboard alerts.'
    ],
    benefits: ['Health Insurance', 'Performance Bonus', 'Learning Allowance']
  },

  // --- MBA HUMAN RESOURCES ---
  {
    id: 'job-hrbp-201',
    title: 'HR Business Partner (HRBP)',
    company: 'Nexora Global',
    companyLogo: 'NG',
    companyTagline: 'Global Leader in Mission-Critical Infrastructure',
    companySize: '15,000+ Employees',
    industry: 'Corporate HR & People Operations',
    location: 'Bangalore / Pune',
    workMode: 'Hybrid',
    experienceRequired: '1–3 Years',
    minExpYears: 1,
    salaryRange: '₹7.5L – ₹11.5L',
    minSalary: 750000,
    maxSalary: 1150000,
    currency: '₹',
    skillsRequired: ['Recruitment', 'Interviewing', 'SOC-2 Compliance', 'Performance Appraisals', 'Labor Laws'],
    preferredDegree: ['MBA HR', 'MBA People Operations', 'M.A. Psychology'],
    department: 'People Operations & Culture',
    reportingManager: 'Priya Sharma',
    managerRole: 'HR Lead',
    interviewDifficulty: 3,
    interviewRounds: ['Resume Screening', 'HR Generalist Interview', 'Behavioral Deep Dive'],
    description: 'Lead talent onboarding, 90-day engineering probation check-ins, and performance evaluation reviews.',
    responsibilities: [
      'Conduct mid-year probation reviews for graduate engineering cohorts.',
      'Audit employee SOC-2 security compliance completion.',
      'Facilitate conflict resolution and 1:1 manager coaching.'
    ],
    benefits: ['Health Insurance', 'Annual Incentive', 'Wellness Allowance']
  },

  // --- MBA FINANCE & FP&A ---
  {
    id: 'job-fin-301',
    title: 'Financial & Cost Accounting Analyst',
    company: 'Nexora Global',
    companyLogo: 'NG',
    companyTagline: 'Global Leader in Mission-Critical Infrastructure',
    companySize: '15,000+ Employees',
    industry: 'Corporate Finance & Procurement',
    location: 'Mumbai / Pune',
    workMode: 'Hybrid',
    experienceRequired: '1–3 Years',
    minExpYears: 1,
    salaryRange: '₹8.0L – ₹12.0L',
    minSalary: 800000,
    maxSalary: 1200000,
    currency: '₹',
    skillsRequired: ['Financial Modeling', 'Variance Analysis', 'Budgeting & Forecasting', 'SLA Penalty Auditing', 'SAP ERP'],
    preferredDegree: ['MBA Finance', 'M.Com Finance', 'CA', 'CMA'],
    department: 'Corporate Finance & Accounting',
    reportingManager: 'Roshni Gokhale',
    managerRole: 'Engineering Finance Controller',
    interviewDifficulty: 4,
    interviewRounds: ['Resume Screening', 'Financial Modeling Test', 'CFO Interview'],
    description: 'Audit cloud infrastructure expenses, client SLA contractual penalty exposure, and department OPEX variance.',
    responsibilities: [
      'Audit quarterly SLA penalty claims for enterprise client downtime.',
      'Generate vendor purchase orders for cloud server infrastructure.',
      'Prepare quarterly project cost variance reports for the board.'
    ],
    benefits: ['Bonus', 'Health Plan', 'Stock Options']
  },

  // --- M.COM ACCOUNTING & TAXATION ---
  {
    id: 'job-mcom-401',
    title: 'Senior Accounts & GST Tax Specialist',
    company: 'Apex Logistics & Energy',
    companyLogo: 'AL',
    companyTagline: 'Logistics Infrastructure & Commercial Services',
    companySize: '8,000+ Employees',
    industry: 'Commerce & Financial Services',
    location: 'Pune / Vadodara',
    workMode: 'Onsite',
    experienceRequired: '0–2 Years',
    minExpYears: 0,
    salaryRange: '₹5.0L – ₹7.5L',
    minSalary: 500000,
    maxSalary: 750000,
    currency: '₹',
    skillsRequired: ['General Ledger', 'GST & TDS Filing', 'Tally / NetSuite', 'Vendor Reconciliation', 'Internal Audit'],
    preferredDegree: ['M.Com', 'M.Com Taxation', 'B.Com Honors'],
    department: 'Taxation & Audit',
    reportingManager: 'Rajesh Kulkarni',
    managerRole: 'Commercial Director',
    interviewDifficulty: 3,
    interviewRounds: ['Screening', 'Accounting Practical Round', 'Commercial Head Interview'],
    description: 'Manage corporate GST returns, TDS compliance, general ledger reconciliations, and vendor invoice processing.',
    responsibilities: [
      'File monthly GST-1 and GST-3B returns.',
      'Conduct vendor account reconciliations.',
      'Coordinate internal audit compliance checks.'
    ],
    benefits: ['PF & Gratuity', 'Medical Insurance', 'Overtime Bonus']
  },

  // --- MCA / B.TECH CS SOFTWARE ENGINEER ---
  {
    id: 'job-swe-501',
    title: 'Software Engineer (Cloud Platform & Backend)',
    company: 'Nexora Global',
    companyLogo: 'NG',
    companyTagline: 'Global Leader in Mission-Critical Infrastructure',
    companySize: '15,000+ Employees',
    industry: 'Cloud Platform & SaaS',
    location: 'Bangalore / Remote',
    workMode: 'Hybrid',
    experienceRequired: '1–3 Years',
    minExpYears: 1,
    salaryRange: '₹8.5L – ₹14.0L',
    minSalary: 850000,
    maxSalary: 1400000,
    currency: '₹',
    skillsRequired: ['TypeScript', 'Node.js', 'Go', 'Kafka', 'PostgreSQL', 'Docker'],
    preferredDegree: ['MCA', 'B.Tech Computer Science', 'B.Tech IT'],
    department: 'Cloud Platform & Infrastructure',
    reportingManager: 'Deepak Joshi',
    managerRole: 'Senior Staff Engineer',
    interviewDifficulty: 4,
    interviewRounds: ['Resume Screen', 'Coding & Data Structures', 'System Architecture', 'Managerial'],
    description: 'Architect distributed microservices handling high-throughput solar telemetry, Kafka queue scaling, and connection pool optimization.',
    responsibilities: [
      'Resolve Kafka consumer partition lag during peak telemetry influx.',
      'Conduct peer code reviews with exponential backoff and jitter.',
      'Implement least-privilege IAM and database table grants.'
    ],
    benefits: ['Flexible Hybrid', 'MacBook Pro Provided', 'Top Health Cover']
  }
];

export const AVAILABLE_SKILL_COURSES: SkillCourse[] = [
  {
    id: 'course-scada-101',
    title: 'Advanced Modbus RTU/TCP & Industrial Gateway Calibration',
    provider: 'Siemens Industrial Automation Academy',
    durationDays: 7,
    costInr: 15000,
    skillUnlocked: 'Modbus RTU/TCP',
    certificationGranted: 'Certified Modbus Communications Specialist',
    prerequisites: ['Electrical Fundamentals'],
    description: 'Learn register offset mapping, slave ID configuration, and RS485 loop troubleshooting for solar inverters.'
  },
  {
    id: 'course-kafka-201',
    title: 'Distributed Kafka Queue Scaling & Consumer Lag Optimization',
    provider: 'Confluent Enterprise Cloud',
    durationDays: 10,
    costInr: 18000,
    skillUnlocked: 'Kafka',
    certificationGranted: 'Certified Kafka Distributed Systems Engineer',
    prerequisites: ['Basic Java/TypeScript or Go'],
    description: 'Master partition rebalancing, consumer group scaling, and in-memory ring buffer architectures.'
  },
  {
    id: 'course-hr-301',
    title: 'Strategic HRBP & SOC-2 Workforce Compliance Masterclass',
    provider: 'SHRM India',
    durationDays: 7,
    costInr: 14000,
    skillUnlocked: 'SOC-2 Compliance',
    certificationGranted: 'Certified HR Business Partner (SHRM-CP)',
    prerequisites: ['Graduation in Any Field'],
    description: 'Master engineering 90-day probation evaluations, compensation parity audits, and employee engagement.'
  },
  {
    id: 'course-fin-401',
    title: 'Corporate Financial Modeling & Enterprise SLA Penalty Audit',
    provider: 'NSE Academy / ICAI',
    durationDays: 10,
    costInr: 16000,
    skillUnlocked: 'Financial Modeling',
    certificationGranted: 'Certified Corporate Financial Analyst',
    prerequisites: ['Basic Accounting or Commerce Degree'],
    description: 'Learn variance analysis, cloud OPEX expense modeling, and SLA credit calculations for enterprise contracts.'
  }
];
