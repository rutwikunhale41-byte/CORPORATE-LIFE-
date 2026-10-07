import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Award,
  MapPin,
  DollarSign,
  ArrowRight,
  Plus,
  X,
  Sparkles,
  Building2
} from 'lucide-react';
import { CandidateProfile, ExperienceTier } from '../../types/jobMarket';

interface ProfileBuilderProps {
  initialProfile?: CandidateProfile;
  onSaveProfile: (profile: CandidateProfile) => void;
  onCancel?: () => void;
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  initialProfile,
  onSaveProfile,
  onCancel,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Rutwik Unhale');
  const [age, setAge] = useState(initialProfile?.age || 23);
  const [degree, setDegree] = useState(initialProfile?.degree || 'B.Tech / B.E.');
  const [specialization, setSpecialization] = useState(initialProfile?.specialization || 'Electrical & Automation Engineering');
  const [college, setCollege] = useState(initialProfile?.college || 'National Institute of Technology');
  const [graduationYear, setGraduationYear] = useState(initialProfile?.graduationYear || 2024);
  const [experienceTier, setExperienceTier] = useState<ExperienceTier>(initialProfile?.experienceTier || '1–3 Years');
  const [experienceYears, setExperienceYears] = useState(initialProfile?.experienceYears ?? 1.5);
  const [previousCompany, setPreviousCompany] = useState(initialProfile?.previousCompany || '');
  
  // Skills arrays
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(
    initialProfile?.technicalSkills || ['SCADA', 'PLC', 'Modbus RTU/TCP', 'RS485', 'Python', 'AutoCAD Electrical']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  const [certifications, setCertifications] = useState<string[]>(
    initialProfile?.certifications || ['Siemens PLC Certified', 'Industrial Automation Specialist']
  );
  const [newCertInput, setNewCertInput] = useState('');

  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    initialProfile?.preferredLocations || ['Pune', 'Mumbai', 'Bangalore', 'Remote']
  );

  const [expectedSalary, setExpectedSalary] = useState(initialProfile?.expectedSalary || 650000);
  const [careerGoal, setCareerGoal] = useState(
    initialProfile?.careerGoal || 'Become a Lead SCADA & Industrial Automation Architect for Renewable Power MNCs.'
  );

  const experienceTiers: ExperienceTier[] = [
    'Fresher',
    '0–1 Year',
    '1–3 Years',
    '3–5 Years',
    '5–10 Years',
    '10+ Years',
  ];

  const popularSkills = [
    'SCADA', 'PLC', 'Modbus RTU/TCP', 'RS485', 'IEC 61850', 'Solar PV',
    'Python', 'Kubernetes', 'Docker', 'AWS', 'Node.js', 'PostgreSQL',
    'SQL', 'Tableau', 'Selenium', 'Agile / Scrum', 'HMI', 'VFDs'
  ];

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !technicalSkills.includes(trimmed)) {
      setTechnicalSkills([...technicalSkills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTechnicalSkills(technicalSkills.filter(s => s !== skillToRemove));
  };

  const handleAddCert = () => {
    if (newCertInput.trim() && !certifications.includes(newCertInput.trim())) {
      setCertifications([...certifications, newCertInput.trim()]);
      setNewCertInput('');
    }
  };

  const handleRemoveCert = (cert: string) => {
    setCertifications(certifications.filter(c => c !== cert));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: CandidateProfile = {
      name,
      age: Number(age),
      education: `${degree} in ${specialization}`,
      degree,
      specialization,
      college,
      graduationYear: Number(graduationYear),
      experienceTier,
      experienceYears: Number(experienceYears),
      previousCompany: previousCompany.trim() || undefined,
      technicalSkills,
      softSkills: ['Problem Solving', 'Structured Communication', 'Ownership', 'Cross-Functional Teamwork'],
      certifications,
      preferredLocations,
      expectedSalary: Number(expectedSalary),
      currency: '₹',
      willingToRelocate: true,
      noticePeriodDays: 30,
      careerGoal,
      primaryCareerDomain: 'Industrial Automation',
      bioSummary: `${name} is an engineering graduate specializing in ${specialization} with ${experienceYears} years experience in ${technicalSkills.slice(0, 3).join(', ')}.`,
    };

    onSaveProfile(profile);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase">
              Step 1 of 3
            </span>
            <span className="text-xs text-slate-400">Candidate Profile</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Build Your Professional Candidate Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your real qualifications, skills, and background determine your job matches, recruiter screening callbacks, and interview difficulty.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic & Academic Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Personal & Academic Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                min={18}
                max={60}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Degree Level
              </label>
              <select
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
                <option value="BCA / MCA">BCA / MCA</option>
                <option value="BBA / MBA">BBA / MBA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Specialization / Major
              </label>
              <input
                type="text"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                placeholder="e.g. Electrical & Automation / Computer Science"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Graduation Year
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={e => setGraduationYear(Number(e.target.value))}
                min={2000}
                max={2026}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Experience Tier & Background */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Experience Level & Past Background
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
              Select Experience Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {experienceTiers.map(tier => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => {
                    setExperienceTier(tier);
                    if (tier === 'Fresher') setExperienceYears(0);
                    else if (tier === '0–1 Year') setExperienceYears(0.8);
                    else if (tier === '1–3 Years') setExperienceYears(2);
                    else if (tier === '3–5 Years') setExperienceYears(4);
                    else if (tier === '5–10 Years') setExperienceYears(6.5);
                    else setExperienceYears(11);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    experienceTier === tier
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="text-xs">{tier}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Exact Years of Experience
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Previous Organization / Internship (Optional)
              </label>
              <input
                type="text"
                value={previousCompany}
                onChange={e => setPreviousCompany(e.target.value)}
                placeholder="e.g. Apex Industrial Systems / Tech Trainee"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills & Certifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Technical Skills & Certifications
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              Crucial for Job Match %
            </span>
          </div>

          {/* Current Skills Chips */}
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
              Your Current Technical Skills ({technicalSkills.length})
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {technicalSkills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Custom skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(newSkillInput);
                  }
                }}
                placeholder="Type any skill (e.g. Modbus TCP, PLC Siemens, Python, Kafka)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-semibold text-[10px] uppercase mr-1">
                Quick Add:
              </span>
              {popularSkills
                .filter(ps => !technicalSkills.includes(ps))
                .slice(0, 10)
                .map(ps => (
                  <button
                    type="button"
                    key={ps}
                    onClick={() => handleAddSkill(ps)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 text-[10px] font-semibold border border-slate-200 dark:border-slate-700"
                  >
                    + {ps}
                  </button>
                ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
              Certifications & Credentials
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {certifications.map(c => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Award className="w-3 h-3 text-purple-500" />
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(c)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCertInput}
                onChange={e => setNewCertInput(e.target.value)}
                placeholder="e.g. Certified SCADA Professional / AWS Solutions Architect..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Preferences & Career Goal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Target Expectations & Career Goal
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Expected Annual CTC (₹ INR)
              </label>
              <input
                type="number"
                step="50000"
                value={expectedSalary}
                onChange={e => setExpectedSalary(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                ₹{(expectedSalary / 100000).toFixed(1)} Lakhs per Annum (LPA)
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Preferred Locations
              </label>
              <input
                type="text"
                value={preferredLocations.join(', ')}
                onChange={e =>
                  setPreferredLocations(
                    e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Pune, Mumbai, Bangalore, Remote"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Your Professional Career Goal
            </label>
            <textarea
              value={careerGoal}
              onChange={e => setCareerGoal(e.target.value)}
              rows={2}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Save Profile & Choose Career Direction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
