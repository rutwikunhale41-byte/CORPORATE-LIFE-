import { PersonalCareerProfile, PersonalSkillItem } from '../types/careerIntelligence';
import { normalizeSkillName } from '../data/careerUniverseData';

export function parseCvTextToProfile(rawCvText: string, existingProfile: PersonalCareerProfile): PersonalCareerProfile {
  const text = rawCvText.toLowerCase();

  // Extract skills dynamically from text
  const detectedSkills = new Set<string>();
  const commonSkillKeywords = [
    'SCADA', 'PLC', 'Modbus RTU', 'Modbus TCP', 'RS485', 'Python', 'Excel', 'Power Query',
    'Power BI', 'SQL', 'AutoCAD', 'ETAP', 'Docker', 'Kubernetes', 'Kafka', 'React', 'Node.js',
    'Recruitment', 'SOC-2', 'Financial Modeling', 'GST', 'TDS', 'Tally', 'SAP ERP', 'Wireshark',
    'Troubleshooting', 'Client Communication', 'Project Management'
  ];

  commonSkillKeywords.forEach(kw => {
    if (text.includes(kw.toLowerCase())) {
      detectedSkills.add(normalizeSkillName(kw));
    }
  });

  const parsedSkillsList: PersonalSkillItem[] = Array.from(detectedSkills).map(sk => ({
    name: sk,
    category: sk.includes('SCADA') || sk.includes('PLC') || sk.includes('Modbus') ? 'INDUSTRIAL' : sk.includes('Excel') || sk.includes('AutoCAD') ? 'SOFTWARE' : 'TECHNICAL',
    proficiency: 'Intermediate',
    source: 'Work Experience',
  }));

  // Merge with existing skills
  const existingNames = new Set(existingProfile.skills.map(s => normalizeSkillName(s.name)));
  const mergedSkills = [...existingProfile.skills];

  parsedSkillsList.forEach(ps => {
    if (!existingNames.has(normalizeSkillName(ps.name))) {
      mergedSkills.push(ps);
    }
  });

  return {
    ...existingProfile,
    skills: mergedSkills,
    software_tools: Array.from(new Set([...existingProfile.software_tools, ...Array.from(detectedSkills)])),
    careerReadinessScore: Math.min(100, Math.max(70, mergedSkills.length * 8)),
  };
}
