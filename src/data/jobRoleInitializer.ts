import { GameState } from '../types/game';

export interface WorkplaceData {
  managerId: string;
  managerName: string;
  channels: Array<{
    id: string;
    name: string;
    type: 'direct' | 'channel' | 'incident';
    participantIds: string[];
    topic: string;
    unreadCount: number;
    subtopic?: string;
    conversationStatus?: 'active' | 'resolved' | 'idle';
  }>;
  emails: Array<{
    id: string;
    fromId: string;
    fromName: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
    timestamp: string;
    isRead: boolean;
    isFlagged: boolean;
    thread: any[];
    requiresReply: boolean;
    replied: boolean;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    department: string;
    owner_role: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    deadlineDay: number;
    deadlineHour: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
    estimatedHours: number;
    stakeholders: string[];
    impact: string;
    technicalContext?: string;
  }>;
  messages: Record<string, any[]>;
}

export function initializeWorkplaceData(offer: any, playerName: string): WorkplaceData {
  const company = offer.company || 'Nexora Global';
  const roleTitle = offer.title || 'Specialist';
  const titleLower = roleTitle.toLowerCase();
  const companyClean = company.toLowerCase().replace(/[^a-z0-9]/g, '');
  const playerClean = playerName.toLowerCase().replace(/\s+/g, '.');
  const playerEmail = `${playerClean}@${companyClean}.com`;

  // Mappings based on selected career
  let managerId = 'sneha-rao';
  let managerName = 'Sneha Rao';
  let managerTitle = 'Engineering Manager';
  let managerEmail = `sneha.rao@${companyClean}.com`;
  let divisionDept = offer.department || 'Cloud Engineering';

  // Default values to override
  let channels: any[] = [];
  let emails: any[] = [];
  let tasks: any[] = [];
  let messages: Record<string, any[]> = {};

  const isHR = titleLower.includes('hr') || titleLower.includes('talent') || titleLower.includes('people');
  const isAdmin = titleLower.includes('admin') || titleLower.includes('workplace') || titleLower.includes('facility');
  const isMBA = titleLower.includes('strategy') || titleLower.includes('operation') || titleLower.includes('analyst') || titleLower.includes('consult');
  const isFinance = titleLower.includes('finance') || titleLower.includes('financial') || titleLower.includes('account');
  const isMarketing = titleLower.includes('market') || titleLower.includes('brand') || titleLower.includes('growth');
  const isSCADA = titleLower.includes('scada') || titleLower.includes('plc') || titleLower.includes('automation') || titleLower.includes('telemetry');

  if (isHR) {
    managerId = 'priya-sharma';
    managerName = 'Priya Sharma';
    managerTitle = 'Director of Human Resources';
    managerEmail = `priya.sharma@${companyClean}.com`;

    channels = [
      {
        id: 'direct-priya',
        name: 'Priya Sharma (Manager)',
        type: 'direct',
        participantIds: ['priya-sharma'],
        topic: '1:1 HR feedback, employee operations oversight, and candidate pipeline tracking',
        unreadCount: 1,
      },
      {
        id: 'channel-hr-ops',
        name: '#people-ops-and-culture',
        type: 'channel',
        participantIds: ['priya-sharma', 'deepak-joshi', 'ananya-iyer'],
        topic: 'Company policy audits, cultural engagement programs, and Workday compliance',
        unreadCount: 1,
      },
      {
        id: 'channel-recruitment',
        name: '#global-talent-acquisition',
        type: 'channel',
        participantIds: ['priya-sharma', 'vikram-sengupta'],
        topic: 'Review active candidate screenings, offer letters tracking, and screening scores',
        unreadCount: 0,
      }
    ];

    emails = [
      {
        id: 'email-welcome-day1',
        fromId: 'priya-sharma',
        fromName: 'Priya Sharma',
        fromEmail: managerEmail,
        toEmail: playerEmail,
        subject: `Welcome to ${company} — Day 1 HR & Talent Orientation`,
        body: `Hi ${playerName.split(' ')[0]},\n\nWelcome to the Global People Operations team at ${company}! We are absolutely thrilled to have you join as our new ${roleTitle}.\n\nYour first week will focus on audit file compliance, Workday HRIS database indexing, and conducting introductory screening interviews. Please review your active task board and let's catch up on direct chat once you are ready.\n\nBest regards,\nPriya Sharma\nDirector of People Operations`,
        timestamp: 'Day 1, 09:00 AM',
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      }
    ];

    tasks = [
      {
        id: 'HR-101',
        title: 'Week 1 Systems & HR Orientation: Overview of Company Policies, Portals & Team',
        description: 'Review complete overview of Workday HRIS portals, employee handbooks, labor guidelines, and stakeholder reporting lines.',
        department: 'People Operations',
        owner_role: 'HR Associate',
        priority: 'MEDIUM',
        deadlineDay: 2,
        deadlineHour: '05:00 PM',
        status: 'TODO',
        estimatedHours: 1.5,
        stakeholders: ['Priya Sharma'],
        impact: 'Establishes statutory legal alignment for employee advisory inquiries.'
      },
      {
        id: 'HR-102',
        title: '🔥 CRITICAL TASK: Screen & Advance High-Priority Frontend Candidate Profiles',
        description: 'Filter technical candidate resumes in the urgent hiring pipeline, verify salary CTC band compliance, and schedule interview rounds.',
        department: 'Talent Acquisition',
        owner_role: 'HR Associate',
        priority: 'HIGH',
        deadlineDay: 1,
        deadlineHour: '04:00 PM',
        status: 'TODO',
        estimatedHours: 3,
        stakeholders: ['Priya Sharma', 'Vikram Sengupta'],
        impact: 'Fills urgent critical software division vacancies before project deadline.'
      },
      {
        id: 'HR-103',
        title: 'Perform Workday HRIS Database Audit & General Compliance Checks',
        description: 'Verify regional employee records have valid identification files, signed NDAs, and clear payroll bank account routing credentials.',
        department: 'HR Shared Services',
        owner_role: 'HR Associate',
        priority: 'LOW',
        deadlineDay: 3,
        deadlineHour: '06:00 PM',
        status: 'TODO',
        estimatedHours: 2,
        stakeholders: ['Priya Sharma'],
        impact: 'Maintains SOC-2 regulatory data audit logs compliance.'
      }
    ];

    messages['direct-priya'] = [
      {
        id: 'msg-welcome-day1',
        channelId: 'direct-priya',
        senderId: 'priya-sharma',
        senderName: 'Priya Sharma',
        text: `Welcome aboard, ${playerName.split(' ')[0]}! We're so excited to have you on the People Operations team. Let me know on chat once you've reviewed your Workday audit tasks!`,
        timestamp: '09:02 AM',
        emotion: 'warm',
      }
    ];
  } else if (isAdmin) {
    managerId = 'anita-deshmukh';
    managerName = 'Anita Deshmukh';
    managerTitle = 'VP of Corporate Services';
    managerEmail = `anita.deshmukh@${companyClean}.com`;

    channels = [
      {
        id: 'direct-anita',
        name: 'Anita Deshmukh (Manager)',
        type: 'direct',
        participantIds: ['anita-deshmukh'],
        topic: '1:1 Office operations administration, vendor contracts, and facilities oversight',
        unreadCount: 1,
      },
      {
        id: 'channel-admin-ops',
        name: '#facility-and-admin-ops',
        type: 'channel',
        participantIds: ['anita-deshmukh', 'deepak-joshi'],
        topic: 'Regional office space allocation, access badges security, and office billing sync',
        unreadCount: 1,
      },
      {
        id: 'channel-procurement',
        name: '#vendor-procurements',
        type: 'channel',
        participantIds: ['anita-deshmukh', 'ananya-iyer'],
        topic: 'Track active third-party catering contracts, corporate travel agency billings, and office asset inventory',
        unreadCount: 0,
      }
    ];

    emails = [
      {
        id: 'email-welcome-day1',
        fromId: 'anita-deshmukh',
        fromName: 'Anita Deshmukh',
        fromEmail: managerEmail,
        toEmail: playerEmail,
        subject: `Welcome to ${company} — Day 1 Workplace Operations & Admin Alignment`,
        body: `Hi ${playerName.split(' ')[0]},\n\nWelcome to the Corporate Services division at ${company}! It is fantastic to have you join our team as our new ${roleTitle}.\n\nYour primary deliverables this week center on reviewing vendor contract guidelines, auditing building access security pass logs, and conducting corporate asset checks. Please check your task board and text me on chat once you are ready to begin.\n\nBest regards,\nAnita Deshmukh\nVP of Corporate Services`,
        timestamp: 'Day 1, 09:00 AM',
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      }
    ];

    tasks = [
      {
        id: 'AD-101',
        title: 'Week 1 Systems & Facilities Orientation: Corporate Campus & Asset Portals',
        description: 'Complete comprehensive Week 1 orientation on corporate BMS portals, travel vendor SLAs, and facility emergency protocols.',
        department: 'Workplace Services',
        owner_role: 'Workplace Coordinator',
        priority: 'MEDIUM',
        deadlineDay: 2,
        deadlineHour: '04:00 PM',
        status: 'TODO',
        estimatedHours: 1.5,
        stakeholders: ['Anita Deshmukh'],
        impact: 'Aligns facility operations with regional corporate governance.'
      },
      {
        id: 'AD-102',
        title: '🔥 CRITICAL TASK: High-Priority Asset Audit & Biometric Security Pass Clearance',
        description: 'Track and verify serial keys of corporate laptop allocations, smart screens, and workspace access badges before quarterly audit freeze.',
        department: 'Facilities Management',
        owner_role: 'Workplace Coordinator',
        priority: 'HIGH',
        deadlineDay: 1,
        deadlineHour: '05:00 PM',
        status: 'TODO',
        estimatedHours: 3,
        stakeholders: ['Anita Deshmukh'],
        impact: 'Maintains strict compliance for corporate physical audits and security.'
      },
      {
        id: 'AD-103',
        title: 'Verify Physical Building Access Pass Allocations',
        description: 'Review visitor log registry files and confirm biometric access keys are in full regulatory compliance.',
        department: 'Office Security',
        owner_role: 'Workplace Coordinator',
        priority: 'LOW',
        deadlineDay: 3,
        deadlineHour: '06:00 PM',
        status: 'TODO',
        estimatedHours: 1,
        stakeholders: ['Anita Deshmukh'],
        impact: 'Maintains zero-security breaches across regional hub offices.'
      }
    ];

    messages['direct-anita'] = [
      {
        id: 'msg-welcome-day1',
        channelId: 'direct-anita',
        senderId: 'anita-deshmukh',
        senderName: 'Anita Deshmukh',
        text: `Welcome, ${playerName.split(' ')[0]}! Really looking forward to working with you to streamline our facility operations. Let's touch base on chat once you've reviewed the asset checklists.`,
        timestamp: '09:02 AM',
        emotion: 'warm',
      }
    ];
  } else if (isMBA) {
    managerId = 'karan-sengupta';
    managerName = 'Karan Sengupta';
    managerTitle = 'Partner — Business Strategy';
    managerEmail = `karan.sengupta@${companyClean}.com`;

    channels = [
      {
        id: 'direct-karan',
        name: 'Karan Sengupta (Manager)',
        type: 'direct',
        participantIds: ['karan-sengupta'],
        topic: '1:1 Strategic initiatives, process bottlenecks, and operational consulting',
        unreadCount: 1,
      },
      {
        id: 'channel-strategy-ops',
        name: '#business-operations-strategy',
        type: 'channel',
        participantIds: ['karan-sengupta', 'ananya-iyer', 'deepak-joshi'],
        topic: 'Global corporate expansion plans, SWOT insights, and operational KPIs tracking',
        unreadCount: 1,
      }
    ];

    emails = [
      {
        id: 'email-welcome-day1',
        fromId: 'karan-sengupta',
        fromName: 'Karan Sengupta',
        fromEmail: managerEmail,
        toEmail: playerEmail,
        subject: `Welcome to ${company} — Day 1 Strategy & Ops Briefing`,
        body: `Hi ${playerName.split(' ')[0]},\n\nWelcome to the Business Strategy division at ${company}! We are incredibly excited to align with you as our new ${roleTitle}.\n\nThis week, our central priorities are compiling SWOT slide decks, identifying regional supply chain bottlenecks, and auditing operations analytics. Check out your task board and text me here once you are active.\n\nBest regards,\nKaran Sengupta\nPartner — Strategy & Operations`,
        timestamp: 'Day 1, 09:00 AM',
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      }
    ];

    tasks = [
      {
        id: 'BA-101',
        title: 'Week 1 Systems & Strategy Briefing: Business Operations & APAC Client Landscape',
        description: 'Complete comprehensive Week 1 orientation on operational KPIs, client delivery SLA dashboards, and team reporting structure.',
        department: 'Operations Strategy',
        owner_role: 'Operations Analyst',
        priority: 'MEDIUM',
        deadlineDay: 2,
        deadlineHour: '04:30 PM',
        status: 'TODO',
        estimatedHours: 2,
        stakeholders: ['Karan Sengupta'],
        impact: 'Aligns operations with executive strategy goals.'
      },
      {
        id: 'BA-102',
        title: '🔥 CRITICAL TASK: Solve Urgent APAC Client Delivery Bottlenecks & Margin Discrepancies',
        description: 'Analyze real-time service fulfillment delays in the Tier-1 APAC client pipeline and deploy process optimizations.',
        department: 'Operations Strategy',
        owner_role: 'Operations Analyst',
        priority: 'HIGH',
        deadlineDay: 1,
        deadlineHour: '05:00 PM',
        status: 'TODO',
        estimatedHours: 3,
        stakeholders: ['Karan Sengupta', 'Ananya Iyer'],
        impact: 'Protects critical quarterly gross delivery margins.'
      }
    ];

    messages['direct-karan'] = [
      {
        id: 'msg-welcome-day1',
        channelId: 'direct-karan',
        senderId: 'karan-sengupta',
        senderName: 'Karan Sengupta',
        text: `Welcome, ${playerName.split(' ')[0]}! Thrilled to have you in the Strategy practice. Ping me once you've reviewed the bottleneck reports.`,
        timestamp: '09:02 AM',
        emotion: 'warm',
      }
    ];
  } else if (isFinance) {
    managerId = 'meera-kulkarni';
    managerName = 'Meera Kulkarni';
    managerTitle = 'Finance Director';
    managerEmail = `meera.kulkarni@${companyClean}.com`;

    channels = [
      {
        id: 'direct-meera',
        name: 'Meera Kulkarni (Manager)',
        type: 'direct',
        participantIds: ['meera-kulkarni'],
        topic: '1:1 Corporate treasury auditing, FP&A variance checks, and regional tax sync',
        unreadCount: 1,
      },
      {
        id: 'channel-finance',
        name: '#treasury-and-finance-planning',
        type: 'channel',
        participantIds: ['meera-kulkarni', 'ananya-iyer'],
        topic: 'Regional budgeting forecasts, cash flow metrics, and tax audit tracking',
        unreadCount: 1,
      }
    ];

    emails = [
      {
        id: 'email-welcome-day1',
        fromId: 'meera-kulkarni',
        fromName: 'Meera Kulkarni',
        fromEmail: managerEmail,
        toEmail: playerEmail,
        subject: `Welcome to ${company} — Day 1 Treasury Briefing`,
        body: `Hi ${playerName.split(' ')[0]},\n\nWelcome to the Corporate Finance division at ${company}! Thrilled to align with you as our new ${roleTitle}.\n\nYour core deliverables are auditing variance expense logs, planning quarterly forecasts, and verifying tax files. Ping me on direct chat once you review your active task board.\n\nBest regards,\nMeera Kulkarni\nFinance Director`,
        timestamp: 'Day 1, 09:00 AM',
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      }
    ];

    tasks = [
      {
        id: 'FIN-101',
        title: 'Week 1 Systems & Finance Briefing: ERP Ledgers, Tax Portals & Bank Accounts',
        description: 'Complete comprehensive Week 1 orientation across SAP ERP financial ledgers, corporate bank routing accounts, and statutory tax calendars.',
        department: 'Treasury Audit',
        owner_role: 'Financial Analyst',
        priority: 'MEDIUM',
        deadlineDay: 2,
        deadlineHour: '03:00 PM',
        status: 'TODO',
        estimatedHours: 1.5,
        stakeholders: ['Meera Kulkarni'],
        impact: 'Aligns financial operations with corporate accounting governance.'
      },
      {
        id: 'FIN-102',
        title: '🔥 CRITICAL TASK: High-Priority Ledger Variance Audit & Tax Settlement Clearance',
        description: 'Audit ₹42 Lakhs discrepancy across department hardware procurements and international wire settlements before quarterly tax filing.',
        department: 'Treasury Audit',
        owner_role: 'Financial Analyst',
        priority: 'HIGH',
        deadlineDay: 1,
        deadlineHour: '05:00 PM',
        status: 'TODO',
        estimatedHours: 3,
        stakeholders: ['Meera Kulkarni'],
        impact: 'Averts statutory penalties and reconciles regional general ledger.'
      }
    ];

    messages['direct-meera'] = [
      {
        id: 'msg-welcome-day1',
        channelId: 'direct-meera',
        senderId: 'meera-kulkarni',
        senderName: 'Meera Kulkarni',
        text: `Welcome to the Finance team, ${playerName.split(' ')[0]}! Ping me once you've initialized the ledger spreadsheets.`,
        timestamp: '09:02 AM',
        emotion: 'warm',
      }
    ];
  } else {
    // Default / Software Engineering or SCADA / Controls
    managerId = 'sneha-rao';
    managerName = 'Sneha Rao';
    managerTitle = 'Engineering Manager';
    managerEmail = `sneha.rao@${companyClean}.com`;

    channels = [
      {
        id: 'direct-sneha',
        name: 'Sneha Rao (Manager)',
        type: 'direct',
        participantIds: ['sneha-rao'],
        topic: '1:1 Direct manager reporting, sprint deliverables, and career pathing',
        unreadCount: 1,
      },
      {
        id: 'channel-standup',
        name: '#core-eng-standup',
        type: 'channel',
        participantIds: ['sneha-rao', 'deepak-joshi', 'ananya-iyer'],
        topic: 'Daily engineering standups, PR reviews, and blocker sync',
        unreadCount: 1,
      }
    ];

    emails = [
      {
        id: 'email-welcome-day1',
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao',
        fromEmail: managerEmail,
        toEmail: playerEmail,
        subject: `Welcome to ${company} — Day 1 Team Introduction`,
        body: `Hi ${playerName.split(' ')[0]},\n\nWelcome to the technology division at ${company}! We are incredibly excited to align with you as our new ${roleTitle}.\n\nPlease inspect your active tasks board, complete compliance training, and check in on standup once active.\n\nBest regards,\nSneha Rao\nEngineering Manager`,
        timestamp: 'Day 1, 09:00 AM',
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      }
    ];

    tasks = [
      {
        id: 'TECH-101',
        title: 'Week 1 Systems & Architecture Introduction: Microservices, Repositories & Incident Protocol',
        description: 'Complete comprehensive Week 1 orientation across cloud microservice repositories, CI/CD pipelines, Grafana dashboards, and emergency incident triage bridges.',
        department: 'Cloud Platform & Infrastructure',
        owner_role: 'Software Engineer',
        priority: 'MEDIUM',
        deadlineDay: 2,
        deadlineHour: '06:00 PM',
        status: 'TODO',
        estimatedHours: 1.5,
        stakeholders: ['Sneha Rao', 'Deepak Joshi'],
        impact: 'Maintains SOC-2 regulatory alignment and architecture familiarity.'
      },
      {
        id: 'TECH-102',
        title: '🔥 CRITICAL TASK: Triage Ingress Telemetry Lag & Database Connection Exhaustion',
        description: 'Diagnose p99 latency spikes on production enterprise endpoints and prevent contract SLA breach for Tier-1 corporate clients.',
        department: 'Cloud Platform & Infrastructure',
        owner_role: 'Software Engineer',
        priority: 'HIGH',
        deadlineDay: 1,
        deadlineHour: '04:30 PM',
        status: 'TODO',
        estimatedHours: 3,
        stakeholders: ['Sneha Rao', 'Deepak Joshi'],
        impact: 'Averts contractual SEV-1 customer latency penalty.'
      }
    ];

    messages['direct-sneha'] = [
      {
        id: 'msg-welcome-day1',
        channelId: 'direct-sneha',
        senderId: 'sneha-rao',
        senderName: 'Sneha Rao',
        text: `Welcome aboard, ${playerName.split(' ')[0]}! Glad to have you on the technology team. Check in once you've reviewed the sprint board.`,
        timestamp: '09:02 AM',
        emotion: 'warm',
      }
    ];
  }

  return {
    managerId,
    managerName,
    channels,
    emails,
    tasks,
    messages,
  };
}
