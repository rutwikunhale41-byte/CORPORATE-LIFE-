import { LinkedInJobPost, LinkedInRecruiter, LinkedInMessage } from '../types/smartphone';
import { CandidateProfile } from '../types/jobMarket';

export function generateDynamicJobsAndRecruiters(candidate: Partial<CandidateProfile> & { degree?: string; primaryCareerGoal?: string; skills?: string }) {
  const name = candidate.name || 'Candidate';
  const degree = candidate.degree || candidate.education || 'Bachelor Degree';
  const skillsStr = candidate.skills || (candidate.technicalSkills ? candidate.technicalSkills.join(', ') : 'Communication, Management, Strategy');
  const targetDomain = candidate.primaryCareerGoal || candidate.careerGoal || 'Human Resources & Operations';
  const location = candidate.preferredLocations && candidate.preferredLocations.length > 0 ? candidate.preferredLocations[0] : 'Pune / Hybrid';
  const curr = candidate.currency || '₹';

  // Normalize lower
  const domainLower = targetDomain.toLowerCase();
  const degreeLower = degree.toLowerCase();
  const skillsLower = skillsStr.toLowerCase();

  // Determine Primary Family
  let isHR = domainLower.includes('hr') || domainLower.includes('human resource') || domainLower.includes('people') || degreeLower.includes('human resource') || degreeLower.includes('ta') || skillsLower.includes('recruitment');
  let isAdmin = domainLower.includes('admin') || domainLower.includes('facility') || domainLower.includes('workplace') || domainLower.includes('office');
  let isMBA = domainLower.includes('mba') || domainLower.includes('business') || domainLower.includes('operation') || domainLower.includes('strategy') || degreeLower.includes('mba');
  let isTech = domainLower.includes('software') || domainLower.includes('tech') || domainLower.includes('code') || domainLower.includes('developer') || degreeLower.includes('computer science') || skillsLower.includes('python');
  let isFinance = domainLower.includes('finance') || domainLower.includes('account') || domainLower.includes('bank') || degreeLower.includes('b.com');
  let isMarketing = domainLower.includes('market') || domainLower.includes('growth') || domainLower.includes('brand') || domainLower.includes('creative');
  let isSCADA = domainLower.includes('scada') || domainLower.includes('plc') || domainLower.includes('automation') || domainLower.includes('electrical');

  // If none explicitly matched, infer or default to HR & Operations
  if (!isHR && !isAdmin && !isMBA && !isTech && !isFinance && !isMarketing && !isSCADA) {
    if (degreeLower.includes('b.tech') || degreeLower.includes('engineering')) {
      isTech = true;
    } else if (degreeLower.includes('bba') || degreeLower.includes('management')) {
      isMBA = true;
    } else {
      isHR = true;
    }
  }

  const jobs: LinkedInJobPost[] = [];
  const recruiters: LinkedInRecruiter[] = [];
  const chats: Record<string, LinkedInMessage[]> = {};

  // Build jobs according to primary family
  if (isHR) {
    jobs.push(
      {
        id: 'job-hr-1',
        company: 'Nexora Global People Hub',
        logo: '👥',
        role: 'Talent Acquisition & HR Operations Specialist',
        location: `${location} / Hybrid`,
        salaryRange: `${curr}8,50,000 - ${curr}12,00,000 / year`,
        department: 'Global People Operations & TA',
        experienceLevel: '0 - 3 Years',
        matchScore: 96,
        skillsRequired: ['Recruitment', 'Talent Sourcing', 'HRIS', 'Employee Engagement', 'HR Policy'],
        description: 'Drive end-to-end recruitment pipelines, conduct candidate screenings, manage HRIS employee records, and coordinate onboarding programs across global business units.',
        postedDate: 'Just now',
        applicantsCount: 18,
        isSaved: true,
      },
      {
        id: 'job-hr-2',
        company: 'Apex Corporate Solutions',
        logo: '🏢',
        role: 'HR Business Partner (HRBP) Associate',
        location: `${location} / Onsite`,
        salaryRange: `${curr}9,00,000 - ${curr}13,50,000 / year`,
        department: 'Human Resources & Organizational Development',
        experienceLevel: '1 - 4 Years',
        matchScore: 92,
        skillsRequired: ['Performance Management', 'Employee Relations', 'HR Analytics', 'Labor Compliance'],
        description: 'Partner with department leads to optimize workforce planning, drive quarterly performance appraisals, address workplace grievance resolution, and manage organizational development.',
        postedDate: '1 day ago',
        applicantsCount: 34,
        isSaved: false,
      },
      {
        id: 'job-hr-3',
        company: 'Innova Talent Systems',
        logo: '✨',
        role: 'People Analytics & Shared Services Specialist',
        location: `${location} / Remote`,
        salaryRange: `${curr}10,00,000 - ${curr}14,00,000 / year`,
        department: 'People Operations & Workforce Intelligence',
        experienceLevel: '1 - 3 Years',
        matchScore: 89,
        skillsRequired: ['HR Analytics', 'Excel', 'Workday', 'Payroll Oversight', 'Stakeholder Communication'],
        description: 'Analyze employee attrition metrics, manage regional payroll auditing, oversee Workday HRIS database integrity, and present quarterly workforce reports to executive leadership.',
        postedDate: '2 days ago',
        applicantsCount: 29,
        isSaved: false,
      },
      {
        id: 'job-hybrid-admin-1',
        company: 'GlobalCore Services',
        logo: '🌐',
        role: 'HR & Office Administration Executive',
        location: `${location} / Onsite`,
        salaryRange: `${curr}7,50,000 - ${curr}11,00,000 / year`,
        department: 'Corporate Workplace Services',
        experienceLevel: '0 - 2 Years',
        matchScore: 94,
        skillsRequired: ['Vendor Management', 'Office Administration', 'HR Operations', 'Facility Management'],
        description: 'Hybrid career opportunity overseeing office operations, vendor contract negotiations, employee travel logistics, facility maintenance, and candidate interview scheduling.',
        postedDate: '3 days ago',
        applicantsCount: 45,
        isSaved: false,
      }
    );

    recruiters.push(
      {
        id: 'recruiter-priya-hr',
        name: 'Priya Sharma',
        title: 'Head of Talent Acquisition & People Operations',
        company: 'Nexora Global',
        avatar: '👩‍💼',
        specialty: 'Talent Acquisition, HR Generalist & People Operations',
        personality: 'Friendly',
        hiringRoles: ['Talent Acquisition Specialist', 'HR Business Partner', 'HR Operations Lead'],
        connectionStatus: 'CONNECTED',
      },
      {
        id: 'recruiter-rohit-hr',
        name: 'Rohit Verma',
        title: 'Executive Recruitment Director',
        company: 'Apex Corporate Solutions',
        avatar: '👨‍💼',
        specialty: 'Executive Search & HR Leadership',
        personality: 'Professional',
        hiringRoles: ['HR Business Partner', 'HR Analytics Lead'],
        connectionStatus: 'CONNECTED',
      }
    );

    chats['recruiter-priya-hr'] = [
      {
        id: 'msg-hr-1',
        senderId: 'recruiter-priya-hr',
        senderName: 'Priya Sharma',
        senderAvatar: '👩‍💼',
        text: `Hello ${name}! We thoroughly reviewed your profile and resume. Your qualification (${degree}) and skill set in ${skillsStr} match our requirement for a Talent Acquisition & HR Operations Specialist at Nexora Global! Would you be available for a Google Meet interview to discuss compensation and team alignment?`,
        timestamp: '09:00 AM',
        isPlayer: false,
        jobOpportunityId: 'job-hr-1',
      },
    ];
  } else if (isAdmin) {
    jobs.push(
      {
        id: 'job-admin-1',
        company: 'Nexora Corporate Operations',
        logo: '🏛️',
        role: 'Corporate Workplace & Office Operations Administrator',
        location: `${location} / Onsite`,
        salaryRange: `${curr}8,00,000 - ${curr}11,50,000 / year`,
        department: 'Workplace Experience & Facilities Management',
        experienceLevel: '0 - 3 Years',
        matchScore: 95,
        skillsRequired: ['Office Management', 'Vendor Relations', 'Facility Management', 'Asset Tracking', 'Budgeting'],
        description: 'Oversee corporate office operations, facility maintenance, visitor badge security, corporate event planning, and vendor SLA procurement.',
        postedDate: 'Just now',
        applicantsCount: 15,
        isSaved: true,
      },
      {
        id: 'job-admin-2',
        company: 'Zenith Global HQ',
        logo: '🏢',
        role: 'Executive Assistant & Corporate Services Coordinator',
        location: `${location} / Onsite`,
        salaryRange: `${curr}9,00,000 - ${curr}13,00,000 / year`,
        department: 'Executive Administration & Leadership Support',
        experienceLevel: '1 - 4 Years',
        matchScore: 91,
        skillsRequired: ['Executive Support', 'Travel Coordination', 'Calendar Management', 'Stakeholder Relations'],
        description: 'Provide high-level administrative support to Vice Presidents, manage C-level calendar schedules, coordinate international board meetings, and draft executive briefings.',
        postedDate: '1 day ago',
        applicantsCount: 22,
        isSaved: false,
      },
      {
        id: 'job-hybrid-hr-2',
        company: 'Innova Corporate Infrastructure',
        logo: '💼',
        role: 'People & Workplace Operations Lead',
        location: `${location} / Hybrid`,
        salaryRange: `${curr}8,50,000 - ${curr}12,50,000 / year`,
        department: 'People & Admin Shared Services',
        experienceLevel: '1 - 3 Years',
        matchScore: 93,
        skillsRequired: ['Administration', 'HR Support', 'Facility Ops', 'Procurement', 'Event Management'],
        description: 'Dual-scope position bridging office administrative logistics, facility management, and HR employee onboarding services for expanding regional tech centers.',
        postedDate: '2 days ago',
        applicantsCount: 31,
        isSaved: false,
      }
    );

    recruiters.push(
      {
        id: 'recruiter-anita-admin',
        name: 'Anita Deshmukh',
        title: 'VP of Corporate Services & Workplace Operations',
        company: 'Nexora Global',
        avatar: '👩‍💼',
        specialty: 'Corporate Administration, Facilities & Workplace Experience',
        personality: 'Executive',
        hiringRoles: ['Office Operations Administrator', 'Executive Assistant', 'Facilities Lead'],
        connectionStatus: 'CONNECTED',
      }
    );

    chats['recruiter-anita-admin'] = [
      {
        id: 'msg-admin-1',
        senderId: 'recruiter-anita-admin',
        senderName: 'Anita Deshmukh',
        senderAvatar: '👩‍💼',
        text: `Hi ${name}! We noticed your strong background in administration and office operations. Nexora Global is expanding our workplace services team and your background (${degree}) caught our attention. Let's get you scheduled for an introductory Google Meet interview today!`,
        timestamp: '09:15 AM',
        isPlayer: false,
        jobOpportunityId: 'job-admin-1',
      },
    ];
  } else if (isMBA) {
    jobs.push(
      {
        id: 'job-mba-1',
        company: 'Nexora Management Consulting',
        logo: '📊',
        role: 'Business Operations & Strategy Associate',
        location: `${location} / Hybrid`,
        salaryRange: `${curr}12,00,000 - ${curr}17,00,000 / year`,
        department: 'Global Strategy & Operations',
        experienceLevel: '0 - 3 Years',
        matchScore: 96,
        skillsRequired: ['Business Analysis', 'Process Optimization', 'Financial Modeling', 'SQL', 'Excel', 'Stakeholder Management'],
        description: 'Analyze business unit performance, identify operational bottlenecks, design cross-departmental workflows, and present strategic expansion roadmaps to executive leadership.',
        postedDate: 'Just now',
        applicantsCount: 28,
        isSaved: true,
      },
      {
        id: 'job-mba-2',
        company: 'Apex Supply Chain Solutions',
        logo: '🚚',
        role: 'Operations & Project Manager',
        location: `${location} / Onsite`,
        salaryRange: `${curr}13,50,000 - ${curr}19,00,000 / year`,
        department: 'Supply Chain & Project Delivery',
        experienceLevel: '1 - 4 Years',
        matchScore: 92,
        skillsRequired: ['Project Management', 'Agile / Scrum', 'Supply Chain', 'Risk Mitigation', 'Cost Optimization'],
        description: 'Lead multi-million dollar client delivery projects, manage vendor logistics contracts, track project KPIs, and ensure zero-delay delivery milestones.',
        postedDate: '1 day ago',
        applicantsCount: 40,
        isSaved: false,
      }
    );

    recruiters.push(
      {
        id: 'recruiter-vikram-mba',
        name: 'Karan Sengupta',
        title: 'Partner — Strategy & Operations Practice',
        company: 'Nexora Consulting',
        avatar: '👨‍💼',
        specialty: 'Strategy, Business Operations & Management',
        personality: 'Executive',
        hiringRoles: ['Business Operations Associate', 'Project Manager', 'Strategy Consultant'],
        connectionStatus: 'CONNECTED',
      }
    );

    chats['recruiter-vikram-mba'] = [
      {
        id: 'msg-mba-1',
        senderId: 'recruiter-vikram-mba',
        senderName: 'Karan Sengupta',
        senderAvatar: '👨‍💼',
        text: `Greetings ${name}! Your MBA / Management profile and analytical skill set (${skillsStr}) matched our top candidate tier for our Strategy & Operations Practice. Let's schedule a Google Meet interview to discuss strategic initiatives and salary bands.`,
        timestamp: '09:30 AM',
        isPlayer: false,
        jobOpportunityId: 'job-mba-1',
      },
    ];
  } else if (isFinance) {
    jobs.push(
      {
        id: 'job-fin-1',
        company: 'Nexora Financial Services',
        logo: '🏦',
        role: 'Financial Analyst & Corporate FP&A Associate',
        location: `${location} / Hybrid`,
        salaryRange: `${curr}9,50,000 - ${curr}14,00,000 / year`,
        department: 'Corporate Finance & Treasury',
        experienceLevel: '0 - 3 Years',
        matchScore: 95,
        skillsRequired: ['Financial Modeling', 'Excel', 'FP&A', 'Accounting', 'Variance Analysis', 'Tax Compliance'],
        description: 'Prepare quarterly financial forecasts, conduct budget variance analysis, oversee capital expenditure reporting, and build financial valuation models.',
        postedDate: 'Just now',
        applicantsCount: 25,
        isSaved: true,
      }
    );

    recruiters.push(
      {
        id: 'recruiter-meera-fin',
        name: 'Meera Kulkarni',
        title: 'Director of Global Financial Recruitment',
        company: 'Nexora Financial',
        avatar: '👩‍💼',
        specialty: 'Corporate Finance, Banking & FP&A',
        personality: 'Professional',
        hiringRoles: ['Financial Analyst', 'FP&A Manager', 'Senior Accountant'],
        connectionStatus: 'CONNECTED',
      }
    );

    chats['recruiter-meera-fin'] = [
      {
        id: 'msg-fin-1',
        senderId: 'recruiter-meera-fin',
        senderName: 'Meera Kulkarni',
        senderAvatar: '👩‍💼',
        text: `Hello ${name}! We evaluated your financial profile and background in ${degree}. We are actively recruiting a Financial Analyst at Nexora Financial. We'd love to set up a Google Meet interview with you!`,
        timestamp: '09:10 AM',
        isPlayer: false,
        jobOpportunityId: 'job-fin-1',
      },
    ];
  } else if (isTech) {
    jobs.push(
      {
        id: 'job-tech-1',
        company: 'Nexora Cloud & Platform Systems',
        logo: '💻',
        role: 'Software Engineer (Backend / Cloud)',
        location: `${location} / Remote`,
        salaryRange: `${curr}12,00,000 - ${curr}18,00,000 / year`,
        department: 'Cloud Platform Engineering',
        experienceLevel: '0 - 3 Years',
        matchScore: 95,
        skillsRequired: ['Python', 'System Architecture', 'SQL', 'REST APIs', 'Cloud'],
        description: 'Design low-latency microservices, build RESTful APIs, optimize PostgreSQL database queries, and deploy Kubernetes services on multi-cloud infrastructure.',
        postedDate: 'Just now',
        applicantsCount: 38,
        isSaved: true,
      }
    );

    recruiters.push(
      {
        id: 'recruiter-vikram-tech',
        name: 'Vikram Sengupta',
        title: 'Talent Lead — Engineering & Cloud',
        company: 'Nexora Global',
        avatar: '👔',
        specialty: 'Software, Cloud & System Architecture',
        personality: 'Professional',
        hiringRoles: ['Software Engineer', 'Backend Lead', 'Cloud Architect'],
        connectionStatus: 'CONNECTED',
      }
    );

    chats['recruiter-vikram-tech'] = [
      {
        id: 'msg-tech-1',
        senderId: 'recruiter-vikram-tech',
        senderName: 'Vikram Sengupta',
        senderAvatar: '👔',
        text: `Hey ${name}! Impressive tech stack (${skillsStr}). Nexora Cloud is looking for a Backend / Cloud Software Engineer. Let's schedule a Google Meet interview with Tech Lead Deepak Joshi!`,
        timestamp: '08:30 AM',
        isPlayer: false,
        jobOpportunityId: 'job-tech-1',
      },
    ];
  } else {
    // SCADA or general default
    jobs.push(
      {
        id: 'job-scada-1',
        company: 'Nexora Global Solutions',
        logo: '⚡',
        role: 'SCADA & Industrial IoT Engineer',
        location: `${location} / Hybrid`,
        salaryRange: `${curr}10,00,000 - ${curr}15,00,000 / year`,
        department: 'Industrial IoT & Telemetry Systems',
        experienceLevel: '1 - 3 Years',
        matchScore: 94,
        skillsRequired: ['SCADA', 'PLC', 'Modbus TCP', 'Python', 'AutoCAD'],
        description: 'Lead deployment of real-time telemetry pipelines, HMI interfaces, Modbus RTU/TCP gateways, and OPC UA protocols for tier-1 industrial clients.',
        postedDate: 'Just now',
        applicantsCount: 20,
        isSaved: true,
      }
    );

    recruiters.push(
      {
        id: 'recruiter-vikram-scada',
        name: 'Vikram Sengupta',
        title: 'Talent Acquisition Lead',
        company: 'Nexora Global Solutions',
        avatar: '👔',
        specialty: 'Industrial Systems & Telemetry',
        personality: 'Professional',
        hiringRoles: ['SCADA Engineer', 'Controls Lead'],
        connectionStatus: 'CONNECTED',
      }
    );

    chats['recruiter-vikram-scada'] = [
      {
        id: 'msg-scada-1',
        senderId: 'recruiter-vikram-scada',
        senderName: 'Vikram Sengupta',
        senderAvatar: '👔',
        text: `Hi ${name}! We reviewed your engineering profile. Nexora Global is hiring a SCADA & Industrial IoT Engineer. Would you be open for a Google Meet interview?`,
        timestamp: '08:45 AM',
        isPlayer: false,
        jobOpportunityId: 'job-scada-1',
      },
    ];
  }

  // Always add 2 universal versatile jobs so player can switch/explore
  jobs.push(
    {
      id: 'job-universal-1',
      company: 'GlobalCore Tech Enterprises',
      logo: '🌐',
      role: 'Project Delivery & Client Operations Lead',
      location: `${location} / Hybrid`,
      salaryRange: `${curr}8,00,000 - ${curr}12,50,000 / year`,
      department: 'Client Success & Delivery',
      experienceLevel: '0 - 3 Years',
      matchScore: 88,
      skillsRequired: ['Communication', 'Project Coordination', 'Problem Solving', 'Excel'],
      description: 'Manage client communications, coordinate cross-functional team deliverables, track SLAs, and ensure smooth corporate onboarding.',
      postedDate: '1 day ago',
      applicantsCount: 42,
      isSaved: false,
    }
  );

  return { jobs, recruiters, chats };
}
