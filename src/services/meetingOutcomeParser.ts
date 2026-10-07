import { Task, Email, Message, PlayerProfile } from '../types/game';
import { MeetingDebrief, ResponseStyle } from '../types/meeting';

export interface ParsedMeetingOutcome {
  tasks: Task[];
  emails: Email[];
  chatMessages: Record<string, Message[]>;
  summaryToast: string;
}

export function parseMeetingOutcome(
  debrief: MeetingDebrief,
  player: PlayerProfile,
  currentDay: number,
  currentHour: number
): ParsedMeetingOutcome {
  const tasks: Task[] = [];
  const emails: Email[] = [];
  const chatMessages: Record<string, Message[]> = {};
  const primaryStyle = debrief.primaryStyle;
  const timestampStr = `Day ${currentDay}, ${currentHour.toString().padStart(2, '0')}:00`;
  const playerShortName = player.name.split(' ')[0] || 'Rutwik';
  const playerEmail = player.email || `${playerShortName.toLowerCase()}@nexoraglobal.com`;

  // 1. DAILY CORE ENGINEERING STANDUP (09:15 AM)
  if (debrief.meetingId === 'meeting-standup') {
    if (primaryStyle === 'assertive') {
      // Assertive outcome: Player took ownership of connection leak by 12 PM and volunteered for Saturday on-call
      tasks.push(
        {
          id: `TASK-${Date.now()}-101`,
          title: 'Resolve Staging Postgres Connection Pool Contention',
          description:
            'Patch the unindexed telemetry query on telemetry_raw_1sec, lock down connection leaks, and achieve green CI before the 14:00 deployment window.',
          priority: 'HIGH',
          deadlineDay: currentDay,
          deadlineHour: '12:00',
          status: 'IN_PROGRESS',
          estimatedHours: 2,
          stakeholders: ['Sneha Rao', 'Deepak Joshi'],
          impact: 'Gating item for today’s 14:00 UTC production release.',
          technicalContext: 'Postgres row-level lock escalation under 4,000 writes/sec.',
        },
        {
          id: `TASK-${Date.now()}-102`,
          title: 'Saturday Secondary On-Call Telemetry Duty',
          description:
            'Serve as secondary on-call engineer backing Deepak Joshi for solar inverter telemetry ingestion alerts.',
          priority: 'MEDIUM',
          deadlineDay: currentDay + 2,
          deadlineHour: '20:00',
          status: 'TODO',
          estimatedHours: 4,
          stakeholders: ['Sneha Rao', 'Deepak Joshi'],
          impact: 'Ensures 24/7 weekend SLA coverage for core telemetry pipeline.',
        }
      );

      emails.push({
        id: `email-standup-assertive-${Date.now()}`,
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao (Engineering Manager)',
        fromEmail: 'sneha.rao@nexoraglobal.com',
        toEmail: playerEmail,
        subject: 'Action Item: 12:00 PM CI Gate & Saturday On-Call Rota',
        body: `Hi ${playerShortName},\n\nI really appreciated your clear technical conviction during standup today. You committed to having the staging CI green by 12:00 PM.\n\nPlease reply to this thread with the PR link once your unit tests and connection pool regression suite pass. Also, I have logged your name for Saturday secondary on-call (stipend will be processed in this month's payroll).\n\nBest regards,\nSneha Rao\nEngineering Manager, SCADA & Core Platform`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      });

      chatMessages['channel-standup'] = [
        {
          id: `msg-standup-post-${Date.now()}`,
          channelId: 'channel-standup',
          senderId: 'sneha-rao',
          senderName: 'Sneha Rao',
          text: `Standup Action Items: @${playerShortName} owning the connection pool patch by 12:00 PM. Target release at 14:00 is ON TRACK.`,
          timestamp: timestampStr,
          emotion: 'impressed',
          intent: 'update',
        },
      ];
    } else if (primaryStyle === 'collaborative') {
      // Collaborative outcome: Pairing with Aisha on query index and coordinating canary with Ananya
      tasks.push(
        {
          id: `TASK-${Date.now()}-103`,
          title: 'Pair-Triage Index Optimization with Aisha Patel',
          description:
            'Conduct a 20-minute pairing session with Aisha to optimize the Modbus query service index and verify latency on staging cluster B.',
          priority: 'HIGH',
          deadlineDay: currentDay,
          deadlineHour: '11:30',
          status: 'IN_PROGRESS',
          estimatedHours: 1,
          stakeholders: ['Aisha Patel', 'Ananya Iyer'],
          impact: 'Enables safe canary deployment before 14:00 release.',
        },
        {
          id: `TASK-${Date.now()}-104`,
          title: 'Execute Canary Rollout & Brief Business Stakeholders',
          description:
            'Deploy the telemetry backoff buffer to Canary cluster at 13:45 with synthetic traffic and ping Ananya in #automation-team.',
          priority: 'HIGH',
          deadlineDay: currentDay,
          deadlineHour: '14:00',
          status: 'TODO',
          estimatedHours: 2,
          stakeholders: ['Ananya Iyer', 'Sneha Rao'],
          impact: 'Validates production readiness with zero downtime.',
        }
      );

      emails.push({
        id: `email-standup-collab-${Date.now()}`,
        fromId: 'ananya-iyer',
        fromName: 'Ananya Iyer (Senior BA)',
        fromEmail: 'ananya.iyer@nexoraglobal.com',
        toEmail: playerEmail,
        subject: 'Re: Staging Telemetry & Customer Release Sync',
        body: `Hey ${playerShortName},\n\nLoved the collaborative plan you laid out in standup! Bringing Aisha into the loop is fantastic for team morale, and the canary approach gives our CX team total confidence.\n\nCould you reply with a quick ping when your pairing session finishes so I can give Apex Global’s tech ops team a quick heads-up before 2 PM?\n\nThanks a million!\nAnanya`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    } else {
      // Passive outcome: Deferred analysis to Deepak, avoided on-call
      tasks.push({
        id: `TASK-${Date.now()}-105`,
        title: 'Shadow Deepak Joshi on Kafka Ingestion Logs',
        description:
          'Review Deepak’s log analysis notes on partition 3 and document the findings in Confluence.',
        priority: 'LOW',
        deadlineDay: currentDay,
        deadlineHour: '16:00',
        status: 'IN_PROGRESS',
        estimatedHours: 2,
        stakeholders: ['Deepak Joshi'],
        impact: 'Knowledge transfer on Kafka partition rebalancing.',
      });

      emails.push({
        id: `email-standup-passive-${Date.now()}`,
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao (Engineering Manager)',
        fromEmail: 'sneha.rao@nexoraglobal.com',
        toEmail: playerEmail,
        subject: 'Feedback: Initiative & Technical Ownership in Standups',
        body: `Hi ${playerShortName},\n\nI noticed during standup that you hesitated to take a definitive stance on the 3 AM staging packet drops. In this team, we value engineers who proactively analyze logs before the call and come prepared with a diagnosis.\n\nPlease shadow Deepak on his investigation today and reply to this email with what you learned regarding our database connection pool limits.\n\nBest,\nSneha`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    }
  }

  // 2. TASK-101: TELEMETRY PIPELINE ARCHITECTURE TRIAGE (11:00 AM)
  else if (debrief.meetingId === 'meeting-tech-triage') {
    if (primaryStyle === 'assertive') {
      tasks.push({
        id: `TASK-${Date.now()}-201`,
        title: 'Implement In-Process Ring Buffer Prototype & Benchmark',
        description:
          'Write high-throughput in-memory ring buffer for solar telemetry consumer, run JMH benchmark suite, and open PR for Deepak’s 17:00 code review.',
        priority: 'HIGH',
        deadlineDay: currentDay,
        deadlineHour: '16:30',
        status: 'IN_PROGRESS',
        estimatedHours: 3,
        stakeholders: ['Deepak Joshi', 'Vijay Menon'],
        impact: 'Eliminates 18k record consumer lag without adding external network infrastructure.',
      });

      emails.push({
        id: `email-triage-assertive-${Date.now()}`,
        fromId: 'deepak-joshi',
        fromName: 'Deepak Joshi (Senior Staff Engineer)',
        fromEmail: 'deepak.joshi@nexoraglobal.com',
        toEmail: playerEmail,
        subject: 'Code Review Placeholder: 5:00 PM for Telemetry Ring Buffer PR',
        body: `Hey ${playerShortName},\n\nSolid defense against Vijay’s architecture challenge earlier. You made the right call standing up for bounded-risk buffering.\n\nI have blocked 5:00 PM to 5:30 PM on my calendar for our code review. Please reply with the Git branch name and your preliminary benchmark numbers (throughput in msgs/sec and GC pause times) before 4:30 PM.\n\nCheers,\nDeepak`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    } else if (primaryStyle === 'collaborative') {
      tasks.push(
        {
          id: `TASK-${Date.now()}-202`,
          title: 'Draft RFC-408: LMAX Ring Buffer Concurrency Architecture',
          description:
            'Document memory boundaries, ring buffer sizing, and fallback to batch upsert. Share draft with Vijay Menon for architecture sign-off.',
          priority: 'HIGH',
          deadlineDay: currentDay + 1,
          deadlineHour: '15:00',
          status: 'IN_PROGRESS',
          estimatedHours: 4,
          stakeholders: ['Vijay Menon', 'Deepak Joshi', 'Sneha Rao'],
          impact: 'Establishes standardized high-throughput architecture RFC across platform.',
        }
      );

      emails.push({
        id: `email-triage-collab-${Date.now()}`,
        fromId: 'vijay-menon',
        fromName: 'Vijay Menon (Principal Enterprise Architect)',
        fromEmail: 'vijay.menon@nexoraglobal.com',
        toEmail: playerEmail,
        subject: 'RFC-408 Architecture Guidance: In-Process Ring Buffer Memory Sizing',
        body: `Rutwik,\n\nYour proposal to use an in-process ring buffer is clean engineering. It eliminates the operational blast radius of external caches while solving the write contention.\n\nWhen drafting the RFC, make sure you explicitly calculate JVM heap overhead under 99th-percentile message bursts (assume 25,000 packets/sec). Send me the Confluence draft when ready for architecture board sign-off.\n\nVijay Menon\nOffice of the CTO`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    } else {
      tasks.push({
        id: `TASK-${Date.now()}-203`,
        title: 'Review RFC-312 Failure Domain Guidelines',
        description:
          'Read architecture standards on database lock escalation and cache invalidation edge cases.',
        priority: 'LOW',
        deadlineDay: currentDay + 1,
        deadlineHour: '18:00',
        status: 'TODO',
        estimatedHours: 2,
        stakeholders: ['Vijay Menon'],
        impact: 'Deepen architecture fundamentals.',
      });
    }
  }

  // 3. APEX GLOBAL CLIENT RELIABILITY REVIEW (02:30 PM - HIGH STAKES)
  else if (debrief.meetingId === 'meeting-client-review') {
    if (primaryStyle === 'assertive') {
      tasks.push({
        id: `TASK-${Date.now()}-301`,
        title: 'Publish Forensic BGP Network Audit & Timestamp RCA',
        description:
          'Compile Frankfurt ISP route re-convergence packet traces, Zurich edge rerouting timestamps, and deliver executive RCA document to Vikramaditya Singhania.',
        priority: 'HIGH',
        deadlineDay: currentDay,
        deadlineHour: '17:00',
        status: 'IN_PROGRESS',
        estimatedHours: 2,
        stakeholders: ['Vikramaditya Singhania', 'Sneha Rao', 'Rajesh Kulkarni'],
        impact: 'Protects company from ₹9,00,000 quarterly SLA penalty claim.',
      });

      emails.push({
        id: `email-client-assertive-${Date.now()}`,
        fromId: 'vikramaditya-singhania',
        fromName: 'Vikramaditya Singhania (VP of Technology, Apex Global)',
        fromEmail: 'vikramaditya.singhania@apexglobal.com',
        toEmail: playerEmail,
        subject: 'Forensic RCA Requirement: Telemetry Routing Incident Trace',
        body: `Rutwik,\n\nThank you for your disciplined presentation during today’s review. Your network packet evidence regarding the Frankfurt ISP BGP route was noted by our network engineers.\n\nAs agreed on the call, please deliver the full forensic RCA document with timestamped packet captures by 17:00 IST today. I will review it alongside our legal counsel before closing out our contractual penalty audit.\n\nRegards,\nVikramaditya Singhania\nVP of Technology | Apex Global`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    } else if (primaryStyle === 'collaborative') {
      tasks.push(
        {
          id: `TASK-${Date.now()}-302`,
          title: 'Setup Dual-Redundant Multi-Pathing Sandbox & Schedule Chaos Test',
          description:
            'Deploy dual-homed telemetry streaming prototype and coordinate live synthetic packet-drop injection test with Sangeeta Reddy.',
          priority: 'HIGH',
          deadlineDay: currentDay + 1,
          deadlineHour: '15:00',
          status: 'IN_PROGRESS',
          estimatedHours: 4,
          stakeholders: ['Vikramaditya Singhania', 'Sangeeta Reddy', 'Ananya Iyer'],
          impact: 'Transforms high-stakes customer churn risk into multi-year strategic SaaS partnership.',
        }
      );

      emails.push({
        id: `email-client-collab-${Date.now()}`,
        fromId: 'vikramaditya-singhania',
        fromName: 'Vikramaditya Singhania (VP of Technology, Apex Global)',
        fromEmail: 'vikramaditya.singhania@apexglobal.com',
        toEmail: playerEmail,
        subject: 'Joint Multi-Pathing Chaos Engineering Pilot — Thursday Sync',
        body: `Rutwik,\n\nYour proposal to conduct a live joint chaos-testing session on Thursday at 3 PM IST is exactly the kind of transparent partnership we look for in our core technology vendors.\n\nSangeeta Reddy (our Client Ops Lead) is setting up the sandbox credentials on our side. Please reply with the API endpoints and Grafana dashboard URLs as soon as they are live on staging.\n\nBest regards,\nVikramaditya Singhania\nVP of Technology, Apex Global`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: true,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    } else {
      tasks.push({
        id: `TASK-${Date.now()}-303`,
        title: 'Assist Commercial Team with SLA Credit Calculations',
        description:
          'Gather telemetry uptime logs for Rajesh Kulkarni and Sneha Rao to assess client rebate exposure.',
        priority: 'MEDIUM',
        deadlineDay: currentDay,
        deadlineHour: '18:00',
        status: 'TODO',
        estimatedHours: 2,
        stakeholders: ['Sneha Rao', 'Priya Sharma'],
        impact: 'Commercial account compliance.',
      });
    }
  }

  // 4. WEEKLY 1:1 MANAGER SYNC WITH SNEHA (04:30 PM)
  else if (debrief.meetingId === 'meeting-manager-1on1') {
    if (primaryStyle === 'assertive') {
      tasks.push({
        id: `TASK-${Date.now()}-401`,
        title: 'Draft Senior Engineering Scope & Zero-Copy Telemetry Proposal',
        description:
          'Define the core telemetry distributed ingestion architecture roadmap targeting Senior Engineer calibration at Month 6.',
        priority: 'MEDIUM',
        deadlineDay: currentDay + 5,
        deadlineHour: '18:00',
        status: 'IN_PROGRESS',
        estimatedHours: 6,
        stakeholders: ['Sneha Rao'],
        impact: 'Prepares promotion dossier and fast-track appraisal calibration.',
      });

      emails.push({
        id: `email-1on1-assertive-${Date.now()}`,
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao (Engineering Manager)',
        fromEmail: 'sneha.rao@nexoraglobal.com',
        toEmail: playerEmail,
        subject: '1:1 Follow-Up: Senior Engineer Promotion Roadmap & Calibration',
        body: `Hi ${playerShortName},\n\nI really enjoyed our 1:1 today. I appreciate an engineer who comes in with clear career ambition and measurable targets.\n\nAs we discussed, if you lead the zero-copy Protobuf telemetry pipeline and mentor our associate engineers effectively, I will personally sponsor your Senior Engineer promotion case at the Month 6 calibration.\n\nPlease reply with your bullet points for the team focus block pilot we talked about.\n\nBest,\nSneha`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: true,
        replied: false,
      });
    } else if (primaryStyle === 'collaborative') {
      tasks.push(
        {
          id: `TASK-${Date.now()}-402`,
          title: 'Establish Weekly Pre-Grooming Routine with Ananya Iyer',
          description:
            'Host weekly 30-min informal coffee sync to refine Product user stories and estimate story points before sprint planning.',
          priority: 'MEDIUM',
          deadlineDay: currentDay + 3,
          deadlineHour: '17:00',
          status: 'IN_PROGRESS',
          estimatedHours: 2,
          stakeholders: ['Ananya Iyer', 'Sneha Rao'],
          impact: 'Eliminates cross-functional scope creep and builds high team cohesion.',
        },
        {
          id: `TASK-${Date.now()}-403`,
          title: 'Co-Author Platform Engineering Best Practices Guide',
          description:
            'Collaborate with Deepak Joshi to draft onboarding guidelines and schedule the first brown-bag knowledge share.',
          priority: 'MEDIUM',
          deadlineDay: currentDay + 7,
          deadlineHour: '18:00',
          status: 'TODO',
          estimatedHours: 4,
          stakeholders: ['Deepak Joshi', 'Sneha Rao'],
          impact: 'Tech Lead leadership development milestone.',
        }
      );

      emails.push({
        id: `email-1on1-collab-${Date.now()}`,
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao (Engineering Manager)',
        fromEmail: 'sneha.rao@nexoraglobal.com',
        toEmail: playerEmail,
        subject: '1:1 Follow-Up: Tech Lead Track & Cross-Functional Synergy',
        body: `Hi ${playerShortName},\n\nOur 1:1 was fantastic today. Your idea to set up weekly pre-grooming coffee syncs with Ananya is a textbook example of leadership without ego. Ananya was delighted when I mentioned it to her.\n\nLet’s also get the brown-bag knowledge sharing sessions on the calendar. You are demonstrating the exact multiplier mindset we look for in future Tech Leads.\n\nKeep shining,\nSneha`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: false,
        replied: false,
      });
    } else {
      emails.push({
        id: `email-1on1-passive-${Date.now()}`,
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao (Engineering Manager)',
        fromEmail: 'sneha.rao@nexoraglobal.com',
        toEmail: playerEmail,
        subject: '1:1 Follow-Up: Career Trajectory & Self-Advocacy',
        body: `Hi ${playerShortName},\n\nThanks for sitting down with me today. As you settle into Nexora, I encourage you to think more boldly about where you want to take your career. Don't be afraid to voice your ambitions and propose new initiatives.\n\nLet's revisit your development plan in our next sync.\n\nBest,\nSneha`,
        timestamp: timestampStr,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: false,
        replied: false,
      });
    }
  }

  const taskCount = tasks.length;
  const emailCount = emails.length;
  const summaryToast = `Meeting outcome parsed: +${taskCount} Jira task${taskCount > 1 ? 's' : ''} assigned and +${emailCount} email thread${emailCount > 1 ? 's' : ''} received!`;

  return {
    tasks,
    emails,
    chatMessages,
    summaryToast,
  };
}
