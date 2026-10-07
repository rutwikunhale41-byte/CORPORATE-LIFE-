import { JobRoleProfile, Task } from '../types/game';

export const JOB_ROLE_PROFILES: Record<string, JobRoleProfile> = {
  'hr-business-partner': {
    job_title: 'HR Associate & Talent Acquisition',
    department: 'People Operations & Culture',
    seniority: 'Mid-Level',
    job_description:
      'Responsible for talent acquisition, candidate screening, technical interview scheduling, Workday HRIS employee ledger audits, compliance verification, and regional labor policy guidelines.',
    primary_responsibilities: [
      'Screening candidate resumes and checking CTC salary band alignment',
      'Conducting initial HR candidate interviews and scorecard logging',
      'Workday HRIS database indexing and employee file compliance audits',
      'Reviewing Regional Employee Handbook and statutory leave policies',
      'Issuing appointment letters and coordinating onboarding checklists',
      'Workplace conflict mediation and employee relations support',
    ],
    secondary_responsibilities: [
      'Facilitating cross-departmental team building and orientation',
      'Monitoring employee feedback and Glassdoor sentiment metrics',
      'Assisting departments with talent pipeline forecasting',
    ],
    allowed_tasks: [
      'Week 1 Systems & HR Orientation: Overview of Company Policies, Portals & Team',
      'Screen & Advance High-Priority Frontend Candidate Profiles',
      'Perform Workday HRIS Database Audit & General Compliance Checks',
      'Conduct Screening Interviews for Junior Frontend Candidate Profiles',
      'Review Regional Employee Handbook & Policy SLA Guidelines',
      'Audit employee SOC-2 security training compliance completion',
      'Conduct mid-year probation review for graduate cohort',
      'Process internal role transfer applications',
    ],
    restricted_tasks: [
      'Write backend Go/Node code or deploy Kubernetes pods (Engineering)',
      'Configure Modbus SCADA tags or electrical switchgear (Engineering)',
      'Approve company financial tax filings or SWIFT wires (Finance Team)',
      'Manage corporate campus power grids and HVAC cooling (Facilities Team)',
    ],
    required_skills: [
      'Talent Acquisition & Interviewing',
      'Labor Law & Compliance (SOC-2, Employment Acts)',
      'Workday HRIS & ATS Management',
      'Compensation & Benefits Benchmarking',
    ],
    optional_skills: ['HR Analytics', 'Greenhouse ATS', 'Employee Coaching'],
    tools: ['Workday HRIS', 'LinkedIn Recruiter', 'Greenhouse ATS', 'Lattice', 'SurveyMonkey'],
    technologies: ['HRIS Cloud', 'ATS Portals', 'LMS Verification'],
    protocols: ['Internal Corporate Governance & Statutory HR Policy Guidelines'],
    kpis: [
      'Time-to-Hire & Quality-of-Hire (< 21 days)',
      'Employee File Compliance (100% Audit Score)',
      'On-Time Probation Review Completion (100%)',
    ],
    typical_projects: ['Global Engineering Hiring Pipeline & Workday Compliance Harmonization'],
    common_problems: ['Skill mismatch during candidate screening for specialized roles'],
    escalation_roles: [
      {
        problemType: 'Deep Technical Architecture Assessment of Engineering Candidates',
        targetRole: 'Senior Staff Engineer',
        targetDepartment: 'Cloud Platform & Infrastructure',
        targetCharacterId: 'deepak-joshi',
        targetCharacterName: 'Deepak Joshi (Tech Lead)',
        description: 'Escalate when deep system design and coding evaluation is required.',
      },
      {
        problemType: 'Legal Labor Dispute & Statutory Employment Tribunal Inquiries',
        targetRole: 'Director of People Operations',
        targetDepartment: 'People Operations & Culture',
        targetCharacterId: 'priya-sharma',
        targetCharacterName: 'Priya Sharma (HR Director)',
        description: 'Escalate formal regulatory notices and severance policy approvals.',
      },
    ],
    reports_to: 'Priya Sharma (Director of People Operations)',
  },

  'admin-specialist': {
    job_title: 'Workplace & Facilities Coordinator',
    department: 'Workplace Operations & Facilities',
    seniority: 'Mid-Level',
    job_description:
      'Responsible for corporate campus physical operations, biometric access turnstile security, building management systems (BMS), corporate travel vendor contracts, and physical asset inventory management.',
    primary_responsibilities: [
      'Corporate hardware and workspace asset inventory auditing',
      'Managing physical building access cards and biometric security logs',
      'Auditing corporate travel agency and catering vendor contract SLAs',
      'Overseeing building facilities, meeting room allocations, and campus safety',
      'Coordinating physical campus maintenance and auxiliary power systems',
    ],
    secondary_responsibilities: [
      'Procurement logistics for office workstations and ergonomic furniture',
      'Assisting HR with physical onboarding welcome kits and access badges',
    ],
    allowed_tasks: [
      'Week 1 Systems & Facilities Orientation: Corporate Campus & Asset Portals',
      'High-Priority Asset Audit & Biometric Security Pass Clearance',
      'Complete Corporate Asset Inventory Auditing',
      'Verify Physical Building Access Pass Allocations',
      'Review Corporate Travel Vendor Contract Guidelines',
    ],
    restricted_tasks: [
      'Write production backend code or configure databases (Engineering)',
      'Perform employee payroll salary calculations (HR/Finance)',
      'Configure industrial substation SCADA RTUs (SCADA Team)',
    ],
    required_skills: [
      'Building Management Systems (BMS)',
      'Vendor Contract & SLA Management',
      'Corporate Asset Registry Auditing',
      'Physical Security & Life Safety Compliance',
    ],
    optional_skills: ['HVAC Operations', 'Procurement Analytics'],
    tools: ['BMS Console', 'AssetTrack Pro', 'Vendor Portal', 'Honeywell Access Control'],
    technologies: ['Facilities IoT', 'Biometric Turnstiles', 'Asset Management Systems'],
    protocols: ['Corporate Workplace Standards & Life Safety Regulations'],
    kpis: [
      'Zero Facility Outages & Safety Breaches',
      'Asset Inventory Discrepancy Rate (< 0.5%)',
      'Vendor SLA Compliance (> 98%)',
    ],
    typical_projects: ['Regional Corporate Campus Modernization & Asset Auditing'],
    common_problems: ['Turnstile biometric sensor drift during peak morning arrival hours'],
    escalation_roles: [
      {
        problemType: 'IT Hardware Networking & Server Room Power Allocation',
        targetRole: 'Senior Staff Engineer',
        targetDepartment: 'Cloud Platform & Infrastructure',
        targetCharacterId: 'deepak-joshi',
        targetCharacterName: 'Deepak Joshi (Staff Engineer)',
        description: 'Escalate when server racks require high-voltage phase reconfiguration.',
      },
    ],
    reports_to: 'Anita Deshmukh (VP of Corporate Services)',
  },

  'finance-specialist': {
    job_title: 'Financial & Treasury Analyst',
    department: 'Corporate Finance & Accounting',
    seniority: 'Mid-Level',
    job_description:
      'Responsible for budget tracking, client invoicing, vendor purchase orders, project cost allocation, SLA financial penalty audits, and financial reporting.',
    primary_responsibilities: [
      'Client invoicing, accounts receivable reconciliation, and milestone billing',
      'Vendor purchase order (PO) generation and invoice verification',
      'Departmental OPEX/CAPEX budget monitoring and variance analysis',
      'Enterprise SLA contractual penalty calculations and escrow auditing',
      'Monthly financial closing and quarterly tax preparation',
    ],
    secondary_responsibilities: [
      'Assisting project managers with cost-to-complete forecasts',
      'Auditing travel and corporate expense claims',
    ],
    allowed_tasks: [
      'Week 1 Systems & Finance Briefing: ERP Ledgers, Tax Portals & Bank Accounts',
      'High-Priority Ledger Variance Audit & Tax Settlement Clearance',
      'Audit Regional Expense Ledger Allocations',
      'Audit Q2 SLA penalty liability for Apex Global contract downtime',
      'Generate vendor purchase order for cloud server infrastructure',
      'Reconcile monthly departmental OPEX software subscription expenses',
    ],
    restricted_tasks: [
      'Troubleshoot electrical cables or SCADA gateways (Engineering)',
      'Write software code or modify production databases (Engineering)',
      'Conduct employee recruitment interviews (HR Team)',
    ],
    required_skills: [
      'Financial Accounting & Auditing (GAAP/IFRS)',
      'Budgeting & Variance Analysis',
      'Contractual SLA Financial Terms Analysis',
      'Advanced Excel & ERP Systems (SAP, NetSuite)',
    ],
    optional_skills: ['Power BI', 'Corporate Tax Law', 'Cost Estimation'],
    tools: ['SAP ERP', 'NetSuite', 'Excel / Financial Models', 'QuickBooks'],
    technologies: ['ERP Cloud', 'Financial Reporting Engines'],
    protocols: ['Corporate Financial Controls & SOX Compliance'],
    kpis: [
      'Invoice Accuracy & Zero Billing Errors (100%)',
      'Days Sales Outstanding (DSO < 45 days)',
      'Audit Compliance (Zero Deficiencies)',
    ],
    typical_projects: ['Apex Global Enterprise SLA Contract Financial Reconciliation'],
    common_problems: ['Discrepancy between logged cloud uptime and client penalty claims'],
    escalation_roles: [
      {
        problemType: 'System Outage Root-Cause & SLA Technical Data Validation',
        targetRole: 'Engineering Manager',
        targetDepartment: 'Cloud Platform & Infrastructure',
        targetCharacterId: 'sneha-rao',
        targetCharacterName: 'Sneha Rao (Engineering Manager)',
        description: 'Escalate to verify whether outage was caused by client or provider.',
      },
    ],
    reports_to: 'Meera Kulkarni (Finance Director)',
  },

  'operations-analyst': {
    job_title: 'Business Strategy & Operations Analyst',
    department: 'Business Operations & Strategy',
    seniority: 'Mid-Level',
    job_description:
      'Responsible for analyzing cross-functional business processes, identifying client delivery bottlenecks, compiling executive SWOT decks, and tracking operational KPIs across global accounts.',
    primary_responsibilities: [
      'Analyzing APAC client fulfillment pipelines and delivery cycle times',
      'Preparing quarterly strategy slide decks and SWOT competitor assessments',
      'Tracking operational margin variance and process bottlenecks',
      'Coordinating cross-departmental alignment for strategic expansion',
    ],
    secondary_responsibilities: [
      'Supporting leadership with resource procurement and capacity modeling',
    ],
    allowed_tasks: [
      'Week 1 Systems & Strategy Briefing: Business Operations & APAC Client Landscape',
      'Solve Urgent APAC Client Delivery Bottlenecks & Margin Discrepancies',
      'Audit Client Delivery Bottleneck Reports & Process Timelines',
      'Prepare Regional SWOT Slide Deck for Strategy Sync',
    ],
    restricted_tasks: [
      'Write production backend code or manage Kubernetes clusters (Engineering)',
      'Configure industrial PLC ladders or Modbus registers (Controls Team)',
      'Manage corporate employee POSH inquiries or candidate screening (HR Team)',
    ],
    required_skills: ['Process Optimization', 'Operations Analytics', 'Strategic Modeling', 'Executive Presentation'],
    optional_skills: ['Tableau', 'Supply Chain Economics'],
    tools: ['Power BI', 'Excel Strategy Models', 'Asana / Jira Strategy', 'Figma Presentation'],
    technologies: ['Analytics BI', 'Process Automation'],
    protocols: ['Corporate Strategic Planning Frameworks'],
    kpis: ['Operational Bottleneck Resolution Velocity', 'Strategy Deliverable On-Time Completion (100%)'],
    typical_projects: ['APAC Client Delivery Margin Optimization'],
    common_problems: ['Data fragmentation across disparate business unit spreadsheets'],
    escalation_roles: [
      {
        problemType: 'Technical Delivery Delays & Cloud Infrastructure Blockers',
        targetRole: 'Engineering Manager',
        targetDepartment: 'Cloud Platform & Infrastructure',
        targetCharacterId: 'sneha-rao',
        targetCharacterName: 'Sneha Rao (Engineering Manager)',
        description: 'Escalate when client fulfillment is held back by technical engineering bottlenecks.',
      },
    ],
    reports_to: 'Karan Sengupta (Partner — Business Strategy)',
  },

  'software-engineer': {
    job_title: 'Software Engineer (Cloud & Backend)',
    department: 'Cloud Platform & Infrastructure',
    seniority: 'Mid-Level',
    job_description:
      'Responsible for designing, developing, testing, deploying, and maintaining cloud backend microservices, REST/gRPC APIs, message queues, databases, and CI/CD pipelines.',
    primary_responsibilities: [
      'Backend microservices development in TypeScript, Go, Python, and Node.js',
      'Database schema design, query optimization, and indexing (PostgreSQL, Redis)',
      'Distributed message queue engineering (Kafka, RabbitMQ, SQS)',
      'Code reviews, unit testing, integration testing, and CI/CD pipeline deployment',
      'API gateway integration, authentication/authorization (OAuth/JWT), and rate limiting',
      'Application performance monitoring, memory leak diagnosis, and distributed tracing',
    ],
    secondary_responsibilities: [
      'Technical architecture documentation, RFCs, and API specifications',
      'Mentoring junior engineers and participating in sprint standups',
    ],
    allowed_tasks: [
      'Week 1 Systems & Architecture Introduction: Microservices, Repositories & Incident Protocol',
      'Triage Ingress Telemetry Lag & Database Connection Exhaustion',
      'Investigate and resolve Kafka consumer partition offset lag',
      'Conduct peer code review for PR #842 (gRPC retry with exponential backoff)',
      'Implement least-privilege IAM and database access grants for ingestion service',
      'Optimize PostgreSQL connection pool exhaustion during peak API traffic',
      'Complete Corporate InfoSec Compliance Training',
    ],
    restricted_tasks: [
      'Configure Modbus RS485 registers on physical field inverters (SCADA Team)',
      'Commission electrical substations and high-voltage switchgear (Electrical Team)',
      'Process monthly employee payroll or tax deductions (Finance Team)',
      'Conduct candidate HR background checks or benefit enrollment (HR Team)',
    ],
    required_skills: [
      'TypeScript / Node.js / Go / Python',
      'PostgreSQL & Redis Caching',
      'Kafka / Distributed Systems',
      'Docker & Kubernetes (K8s)',
      'REST & gRPC API Design',
    ],
    optional_skills: ['GraphQL', 'Terraform', 'Prometheus/Grafana'],
    tools: ['VS Code', 'Git / GitHub Enterprise', 'Docker Desktop', 'Postman', 'Grafana', 'kubectl'],
    technologies: ['Node.js', 'Go', 'PostgreSQL', 'Apache Kafka', 'Kubernetes', 'Redis'],
    protocols: ['HTTP/2', 'REST', 'gRPC', 'WebSocket', 'TCP/IP'],
    kpis: [
      'Sprint Velocity & On-Time Story Delivery',
      'API Latency (p99 < 150ms) and 99.95% Availability',
    ],
    typical_projects: ['Enterprise Telemetry Ingestion Microservice Pipeline'],
    common_problems: ['Kafka consumer lag caused by slow database batch writes'],
    escalation_roles: [
      {
        problemType: 'Physical Inverter & SCADA Register Offset Mismatch',
        targetRole: 'Associate SCADA & Controls Engineer',
        targetDepartment: 'SCADA, Automation & Renewable Energy',
        targetCharacterId: 'aisha-patel',
        targetCharacterName: 'Aisha Patel (SCADA Engineer)',
        description: 'Escalate when data arriving at gateway contains 0 values due to PLC mapping.',
      },
    ],
    reports_to: 'Sneha Rao (Engineering Manager)',
  },

  'scada-engineer': {
    job_title: 'SCADA Engineer',
    department: 'SCADA, Automation & Renewable Energy',
    seniority: 'Mid-Level',
    job_description:
      'Responsible for SCADA architecture, plant monitoring systems, inverter telemetry integration, Modbus/IEC protocol mapping, alarm configuration, historian logging, and communication troubleshooting across solar, wind, and industrial microgrids.',
    primary_responsibilities: [
      'SCADA system configuration, tag mapping, and historian logging',
      'Inverter, BESS, and meter telemetry integration over industrial protocols',
      'Modbus RTU/TCP, IEC 60870-5-104, OPC UA, and DNP3 protocol calibration',
      'SCADA alarm configuration, threshold tuning, and zero-generation triage',
      'Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT) support',
      'Plant telemetry data validation, active/reactive power validation, and PPC/EMS sync',
    ],
    secondary_responsibilities: [
      'Communication gateway firmware updates and serial baud calibration',
      'SCADA documentation, point lists, and single-line diagram (SLD) tag cross-referencing',
    ],
    allowed_tasks: [
      'Week 1 Systems & Architecture Introduction: Microservices, Repositories & Incident Protocol',
      'Configure inverter telemetry tags in the SCADA database',
      'Investigate why active power is showing 0 kW on plant inverters',
      'Verify Modbus TCP communication and register offsets with inverters',
      'Map new BESS (Battery Energy Storage) telemetry points in the SCADA system',
      'Test IEC 60870-5-104 communication during plant FAT',
    ],
    restricted_tasks: [
      'Build React frontend UI for public consumer websites (Software Team)',
      'Develop mobile banking or financial applications (Software Team)',
      'Calculate electrical cable ampacity and transformer sizing (Electrical Team)',
      'Recruit employees, conduct salary reviews, or manage payroll (HR/Finance Team)',
    ],
    required_skills: [
      'SCADA Architecture (Ignition, WinCC, Wonderware)',
      'Modbus RTU / Modbus TCP',
      'IEC 60870-5-104 / OPC UA',
      'Telemetry Mapping & Tag Configuration',
    ],
    optional_skills: ['IEC 61850', 'Python Scripting for Data Parsing'],
    tools: ['Modbus Poll', 'Wireshark', 'SCADA Historian', 'Ignition Designer', 'Serial Port Monitor', 'Putty/SSH'],
    technologies: ['Ignition SCADA', 'Kepware OPC', 'Moxa Gateways', 'Schneider Inverters'],
    protocols: ['Modbus TCP', 'Modbus RTU', 'IEC 60870-5-104', 'OPC UA', 'DNP3'],
    kpis: [
      'SCADA Communication Uptime (≥ 99.8%)',
      'Speed of Communication Fault Resolution (< 45 mins)',
    ],
    typical_projects: ['Apex Global 150MW Solar Inverter Telemetry Gateway Calibration'],
    common_problems: ['Slave inverter returning 0x83 exception code (illegal data address)'],
    escalation_roles: [
      {
        problemType: 'Core Cloud API & Enterprise Web Platform Outage',
        targetRole: 'Senior Staff Engineer',
        targetDepartment: 'Cloud Platform & Infrastructure',
        targetCharacterId: 'deepak-joshi',
        targetCharacterName: 'Deepak Joshi (Staff Engineer)',
        description: 'Escalate when cloud REST APIs or Kafka ingestion clusters crash.',
      },
    ],
    reports_to: 'Sneha Rao (Engineering Manager)',
  },
};

/**
 * Dynamically resolves the role profile based on the player's title or department
 */
export function resolveRoleProfile(title: string = '', department: string = ''): JobRoleProfile {
  const combined = (title + ' ' + department).toLowerCase();

  if (combined.includes('hr') || combined.includes('talent') || combined.includes('people') || combined.includes('culture') || combined.includes('recruit')) {
    return JOB_ROLE_PROFILES['hr-business-partner'];
  }
  if (combined.includes('admin') || combined.includes('facility') || combined.includes('workplace') || combined.includes('services')) {
    return JOB_ROLE_PROFILES['admin-specialist'];
  }
  if (combined.includes('finance') || combined.includes('account') || combined.includes('treasury') || combined.includes('audit')) {
    return JOB_ROLE_PROFILES['finance-specialist'];
  }
  if (combined.includes('strategy') || combined.includes('operation') || combined.includes('analyst') || combined.includes('consult')) {
    return JOB_ROLE_PROFILES['operations-analyst'];
  }
  if (combined.includes('scada') || combined.includes('telemetry')) {
    return JOB_ROLE_PROFILES['scada-engineer'];
  }
  if (combined.includes('software') || combined.includes('cloud') || combined.includes('backend') || combined.includes('devops') || combined.includes('developer') || combined.includes('tech')) {
    return JOB_ROLE_PROFILES['software-engineer'];
  }

  // Fallback
  return JOB_ROLE_PROFILES['hr-business-partner'] || JOB_ROLE_PROFILES['software-engineer'];
}

export const validateTaskForRole = (
  task: Task,
  roleProfile: JobRoleProfile
): {
  isAllowed: boolean;
  ownershipCategory: 'DIRECT_OWNERSHIP' | 'CROSS_FUNCTIONAL_COLLABORATION' | 'OUT_OF_SCOPE';
  reason: string;
  suggestedEscalation?: {
    targetRole: string;
    targetDepartment: string;
    targetCharacterId: string;
    targetCharacterName: string;
  };
} => {
  const taskDept = (task.department || '').toLowerCase();
  const playerDept = (roleProfile.department || '').toLowerCase();
  const taskRole = (task.owner_role || '').toLowerCase();
  const playerRole = (roleProfile.job_title || '').toLowerCase();

  // Check HR / Admin / Finance keywords alignment
  const isHRRole = playerRole.includes('hr') || playerRole.includes('people') || playerRole.includes('talent');
  const isHRTask = taskDept.includes('people') || taskDept.includes('hr') || taskDept.includes('talent') || taskRole.includes('hr') || task.id.startsWith('HR-');

  const isAdminRole = playerRole.includes('admin') || playerRole.includes('workplace') || playerRole.includes('facility');
  const isAdminTask = taskDept.includes('admin') || taskDept.includes('workplace') || taskDept.includes('facility') || taskDept.includes('security') || taskRole.includes('workplace') || task.id.startsWith('AD-');

  const isFinanceRole = playerRole.includes('finance') || playerRole.includes('account') || playerRole.includes('treasury');
  const isFinanceTask = taskDept.includes('finance') || taskDept.includes('treasury') || taskDept.includes('audit') || taskRole.includes('finance') || task.id.startsWith('FIN-');

  const isOpsRole = playerRole.includes('operation') || playerRole.includes('strategy') || playerRole.includes('analyst');
  const isOpsTask = taskDept.includes('operation') || taskDept.includes('strategy') || taskDept.includes('consult') || taskRole.includes('analyst') || task.id.startsWith('BA-');

  const isTechRole = playerRole.includes('software') || playerRole.includes('cloud') || playerRole.includes('engineer') || playerRole.includes('scada') || playerRole.includes('developer');
  const isTechTask = taskDept.includes('cloud') || taskDept.includes('platform') || taskDept.includes('compliance') || taskDept.includes('scada') || taskRole.includes('engineer') || task.id.startsWith('TECH-') || task.id.startsWith('TASK-');

  if (
    (isHRRole && isHRTask) ||
    (isAdminRole && isAdminTask) ||
    (isFinanceRole && isFinanceTask) ||
    (isOpsRole && isOpsTask) ||
    (isTechRole && isTechTask) ||
    taskRole.includes(playerRole) ||
    playerRole.includes(taskRole) ||
    taskDept.includes(playerDept) ||
    playerDept.includes(taskDept)
  ) {
    return {
      isAllowed: true,
      ownershipCategory: 'DIRECT_OWNERSHIP',
      reason: `This deliverable directly belongs to your Job Description as ${roleProfile.job_title} in ${roleProfile.department}.`,
    };
  }

  const isCollaboration = (roleProfile.allowed_tasks || []).some(
    allowed => task.title.toLowerCase().includes(allowed.toLowerCase()) || allowed.toLowerCase().includes(task.title.toLowerCase())
  );

  if (isCollaboration) {
    return {
      isAllowed: true,
      ownershipCategory: 'CROSS_FUNCTIONAL_COLLABORATION',
      reason: `This task involves cross-functional coordination within your scope as ${roleProfile.job_title}.`,
    };
  }

  const matchingEscalation = (roleProfile.escalation_roles || []).find(
    esc =>
      task.title.toLowerCase().includes(esc.problemType.toLowerCase()) ||
      task.description.toLowerCase().includes(esc.problemType.toLowerCase())
  ) || (roleProfile.escalation_roles && roleProfile.escalation_roles[0]);

  return {
    isAllowed: false,
    ownershipCategory: 'OUT_OF_SCOPE',
    reason: `This task belongs to ${task.owner_role || task.department || 'another department'}. In accordance with strict MNC boundaries, ${roleProfile.job_title} does not perform this directly and should escalate or hand it over.`,
    suggestedEscalation: matchingEscalation
      ? {
          targetRole: matchingEscalation.targetRole,
          targetDepartment: matchingEscalation.targetDepartment,
          targetCharacterId: matchingEscalation.targetCharacterId,
          targetCharacterName: matchingEscalation.targetCharacterName,
        }
      : undefined,
  };
};
