import { PersonalCareerProfile } from '../types/careerIntelligence';

export const SKILL_NORMALIZATION_MAP: Record<string, string> = {
  'plc programming': 'PLC',
  'plc development': 'PLC',
  'plc control': 'PLC',
  'ladder logic': 'PLC',
  'ms excel': 'Excel',
  'microsoft excel': 'Excel',
  'power query': 'Power Query',
  'microsoft power query': 'Power Query',
  'scada monitoring': 'SCADA',
  'scada operations': 'SCADA',
  'scada systems': 'SCADA',
  'modbus tcp/ip': 'Modbus TCP',
  'modbus tcp': 'Modbus TCP',
  'modbus rtu/tcp': 'Modbus TCP',
  'python scripting': 'Python',
  'python 3': 'Python',
  'power bi dashboard': 'Power BI',
  'power bi advanced': 'Power BI',
  'sql queries': 'SQL',
  'postgresql': 'SQL',
  'rest api': 'REST APIs',
  'restful apis': 'REST APIs',
  'soc-2 compliance': 'SOC-2',
  'soc2': 'SOC-2',
  'gst filing': 'GST',
  'gst returns': 'GST',
};

export function normalizeSkillName(skill: string): string {
  const lower = skill.trim().toLowerCase();
  return SKILL_NORMALIZATION_MAP[lower] || skill.trim();
}

export const INITIAL_DEFAULT_CAREER_PROFILE: PersonalCareerProfile = {
  personalInfo: {
    name: 'Rutwik Unhale',
    email: 'rutwik.unhale@nexoraglobal.com',
    phone: '+91 98220 44102',
    location: 'Pune / Mumbai, Maharashtra',
    bioSummary: 'Engineering graduate specializing in Electrical & Industrial Automation with hands-on experience in SCADA, Modbus protocols, Python scripting, and data analysis.',
  },
  education: [
    {
      id: 'edu-1',
      qualification: 'B.Tech',
      degree: 'B.Tech Electrical Engineering',
      specialization: 'SCADA, Controls & Industrial Automation',
      college: 'National Institute of Technology',
      year: 2024,
      gradeGpa: '8.8 / 10 CGPA',
    },
    {
      id: 'edu-2',
      qualification: 'Diploma Engineering',
      degree: 'Diploma in Electrical Engineering',
      specialization: 'Industrial Electronics & Power Systems',
      college: 'Government Polytechnic',
      year: 2021,
      gradeGpa: '86.4%',
    },
  ],
  skills: [
    { name: 'SCADA', category: 'INDUSTRIAL', proficiency: 'Advanced', source: 'Work Experience' },
    { name: 'PLC', category: 'INDUSTRIAL', proficiency: 'Advanced', source: 'Work Experience' },
    { name: 'Modbus TCP', category: 'INDUSTRIAL', proficiency: 'Advanced', source: 'Work Experience' },
    { name: 'RS485 Serial', category: 'INDUSTRIAL', proficiency: 'Intermediate', source: 'Work Experience' },
    { name: 'Excel', category: 'SOFTWARE', proficiency: 'Advanced', source: 'Self-Learned' },
    { name: 'Power Query', category: 'SOFTWARE', proficiency: 'Intermediate', source: 'Self-Learned' },
    { name: 'Python', category: 'TECHNICAL', proficiency: 'Intermediate', source: 'Project' },
    { name: 'AutoCAD', category: 'SOFTWARE', proficiency: 'Intermediate', source: 'Education' },
    { name: 'Troubleshooting', category: 'SOFT_SKILL', proficiency: 'Advanced', source: 'Work Experience' },
    { name: 'Client Communication', category: 'SOFT_SKILL', proficiency: 'Intermediate', source: 'Work Experience' },
  ],
  software_tools: ['Excel', 'Power Query', 'Python', 'Siemens TIA Portal', 'Wireshark', 'AutoCAD', 'Postman'],
  certifications: [
    { id: 'cert-1', name: 'Siemens TIA Portal Certified Specialist', issuer: 'Siemens Automation', year: 2023 },
    { id: 'cert-2', name: 'Industrial Automation & Modbus Telemetry', issuer: 'NPTEL India', year: 2024 },
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Automation & SCADA Engineer',
      company: 'Pioneer Automation Systems',
      durationYears: 1.5,
      domain: 'Industrial Automation & Renewable Power',
      responsibilities: [
        'Configured Modbus RTU/TCP gateways for solar inverters.',
        'Investigated telemetry packet drops and zero-power readings.',
        'Calibrated RS485 loop resistance and baud rates.'
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Solar Inverter High-Frequency Telemetry Gateway',
      description: 'Built a Modbus TCP parser in Python to stream active/reactive power readings to a central historian database.',
      technologies: ['Python', 'Modbus TCP', 'PostgreSQL', 'Excel'],
    },
  ],
  industries: ['Industrial Automation', 'Renewable Energy', 'Power & Utilities', 'Software Telemetry'],
  job_titles: ['SCADA Engineer', 'Automation Engineer', 'Electrical Engineer'],
  responsibilities: [
    'SCADA configuration',
    'Modbus gateway calibration',
    'Telemetry data validation',
    'Troubleshooting RS485 loops',
    'Client technical support'
  ],
  soft_skills: ['Problem Solving', 'Root-Cause Analysis', 'Structured Communication', 'Cross-Functional Collaboration'],
  languages: ['English', 'Hindi', 'Marathi'],
  career_preferences: ['SCADA & Industrial Automation', 'Solar & Renewable Energy', 'Data & Analytics', 'Technical Project Management'],
  careerDirections: {
    primary: 'SCADA & Industrial Automation',
    secondary: 'Solar Energy & Telemetry',
    exploration: 'Energy Analytics & Data Science',
  },
  careerReadinessScore: 88,
};
