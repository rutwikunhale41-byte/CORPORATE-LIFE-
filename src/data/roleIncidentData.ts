export interface RoleIncidentAction {
  id: string;
  title: string;
  subtitle: string;
  logMessage: string;
  slaBonus: number;
  trustBonus: number;
  reputationImpact: string;
}

export interface RoleIncidentConfig {
  id: string;
  roleCategory: 'HR' | 'FINANCE' | 'MARKETING' | 'ADMIN' | 'SCADA' | 'SOFTWARE' | 'ELECTRICAL' | 'OPERATIONS';
  categoryLabel: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2';
  description: string;
  slaMinutesRemaining: number;
  customerEscalationLevel: number;
  stakeholderAlert: string;
  affectedServices: string[];
  logs: string[];
  actions: RoleIncidentAction[];
  resolutionSummary: string;
  involvedCharacters: string[];
  achievementTitle: string;
  achievementDesc: string;
}

export const ROLE_INCIDENTS: Record<string, RoleIncidentConfig> = {
  HR: {
    id: 'INC-HR-901',
    roleCategory: 'HR',
    categoryLabel: 'People Operations & Global Talent',
    title: 'SEV-1 Confidential Employee PII Leak & Labor Compliance Crisis',
    severity: 'SEV-1',
    description: 'Unauthorized external scraping detected on Workday payroll export API. 450 executive salary records and confidential performance appraisals were exposed to an unauthenticated staging bucket. Regional labor regulators and external legal counsel have issued an immediate 45-minute statutory compliance deadline.',
    slaMinutesRemaining: 45,
    customerEscalationLevel: 3,
    stakeholderAlert: 'Priya Sharma (Director of People Operations) & General Legal Counsel are on the crisis bridge.',
    affectedServices: [
      'Workday HRIS Employee Ledger',
      'Payroll Bank Routing Gateway',
      'Executive Talent Review Dossiers'
    ],
    logs: [
      '[10:32:01] CRITICAL [audit-guard] Unauthorized GET /api/v2/hris/export-salaries from unknown IP 194.26.29.12',
      '[10:32:20] ALERT    [compliance-engine] Statutory PII disclosure threshold breached (450 employee records exposed)',
      '[10:32:45] WARN     [labor-tribunal] Formal breach notice received from Regional Data Protection Authority',
      '[10:33:10] ALERT    [posh-committee] Internal whistleblower hotline received 8 urgent executive inquiries',
      '[10:33:40] ERROR    [workday-sync] Automated payroll disbursement locked due to security freeze'
    ],
    actions: [
      {
        id: 'act-hr-1',
        title: '1. Revoke Staging API Tokens & Freeze Workday Export Endpoints',
        subtitle: 'Instantly cut off active unauthorized data scraping sessions. (+10m SLA)',
        logMessage: 'Revoked all leaked HRIS bearer tokens and restricted export endpoints to internal VPN IP range.',
        slaBonus: 10,
        trustBonus: 4,
        reputationImpact: '+5 HR Reputation & Data Security'
      },
      {
        id: 'act-hr-2',
        title: '2. Convene Emergency POSH & Confidentiality Committee',
        subtitle: 'Initiate formal internal governance inquiry with Legal Counsel and Priya Sharma. (+8m SLA)',
        logMessage: 'Established protected inquiry channel with Director Priya Sharma and signed chain-of-custody audit logs.',
        slaBonus: 8,
        trustBonus: 5,
        reputationImpact: '+6 Management Trust'
      },
      {
        id: 'act-hr-3',
        title: '3. Issue Transparent Employee Advisory & 1:1 Executive Briefing',
        subtitle: 'Prevent social media panic and notify affected employees with support helpline. (+12m SLA)',
        logMessage: 'Dispatched clear, empathetic company-wide memo clarifying zero banking password compromise and offering credit monitoring.',
        slaBonus: 12,
        trustBonus: 6,
        reputationImpact: '+8 Team Trust & Morale'
      },
      {
        id: 'act-hr-4',
        title: '4. File Formal Statutory Compliance Report with Labor Regulators',
        subtitle: 'Submit verified remediation timeline to prevent commercial license penalty. (+15m SLA)',
        logMessage: 'Filed statutory Form-GDPR-72 incident declaration report with legal verification stamp.',
        slaBonus: 15,
        trustBonus: 7,
        reputationImpact: '+10 Professional Reputation'
      }
    ],
    resolutionSummary: 'Secured all employee PII records, closed the staging API vulnerability, satisfied statutory labor authority inquiries with zero fines, and restored team confidence.',
    involvedCharacters: ['Priya Sharma', 'Vikram Sengupta', 'Ananya Iyer'],
    achievementTitle: 'People & Compliance Guardian',
    achievementDesc: 'Resolved a SEV-1 workforce PII crisis and defended labor regulatory compliance under intense deadline pressure.'
  },

  FINANCE: {
    id: 'INC-FIN-802',
    roleCategory: 'FINANCE',
    categoryLabel: 'Corporate Finance, Treasury & Audit',
    title: 'SEV-1 Unreconciled ₹14.8 Cr Treasury Wire Failure & Fiscal Audit Freeze',
    severity: 'SEV-1',
    description: 'Automated quarterly vendor settlement batch failed mid-transit on SWIFT settlement gateway. ₹14.8 Crores in treasury transfers are stuck in unconfirmed clearing state, risking default on Tier-1 vendor supply contracts and immediate auditor qualification.',
    slaMinutesRemaining: 40,
    customerEscalationLevel: 3,
    stakeholderAlert: 'Chief Financial Officer & Senior Treasury Auditor have joined the emergency bridge.',
    affectedServices: [
      'SAP ERP Financial Ledger',
      'SWIFT Cross-Border Settlement Gateway',
      'Corporate Cash Reserve Treasury'
    ],
    logs: [
      '[10:31:40] ERROR  [swift-gateway] MT103 batch message rejected: checksum mismatch on transaction batch #9182',
      '[10:32:05] ALERT  [treasury-monitor] Unreconciled ledger balance disparity: ₹148,000,000.00 unconfirmed in escrow',
      '[10:32:30] WARN   [vendor-management] 14 Tier-1 logistics vendors triggered default notice payment warnings',
      '[10:33:15] ALERT  [audit-board] External statutory auditors paused quarterly financial signoff pending reconciliation',
      '[10:33:50] ERROR  [liquidity-engine] Working capital ratio dropped below contractual bond covenant threshold'
    ],
    actions: [
      {
        id: 'act-fin-1',
        title: '1. Reconcile Suspended SWIFT MT103 Packet Checksums with Central Bank',
        subtitle: 'Isolate corrupted transaction records and halt duplicate wire processing. (+10m SLA)',
        logMessage: 'Identified payload encoding mismatch in vendor routing IDs and isolated 14 suspended settlement records.',
        slaBonus: 10,
        trustBonus: 4,
        reputationImpact: '+5 Financial Accuracy'
      },
      {
        id: 'act-fin-2',
        title: '2. Deploy Secondary Reserve Liquidity Pool for Urgent Vendor Wires',
        subtitle: 'Release emergency contingency treasury tranche to avoid contractual supplier default. (+12m SLA)',
        logMessage: 'Approved dual-authorized transfer from auxiliary escrow reserve to clear Tier-1 urgent vendor invoices.',
        slaBonus: 12,
        trustBonus: 6,
        reputationImpact: '+7 Vendor Relationship Trust'
      },
      {
        id: 'act-fin-3',
        title: '3. Perform Double-Entry Ledger Forensic Balance Audit in SAP ERP',
        subtitle: 'Verify zero embezzlement and balance credit/debit balances to penny precision. (+10m SLA)',
        logMessage: 'Completed real-time journal entry verification; zero ledger variance confirmed across all asset accounts.',
        slaBonus: 10,
        trustBonus: 5,
        reputationImpact: '+8 Audit Compliance'
      },
      {
        id: 'act-fin-4',
        title: '4. Present Verified Audit Dossier to Statutory Board & Regulators',
        subtitle: 'Unlock quarterly financial signoff and present clean balance sheet verification. (+15m SLA)',
        logMessage: 'Executive audit clearance memo submitted and signed off by lead statutory partner.',
        slaBonus: 15,
        trustBonus: 8,
        reputationImpact: '+10 Executive Standing'
      }
    ],
    resolutionSummary: 'Successfully unlocked ₹14.8 Cr in escrow transfers, averted supplier contract defaults, and obtained clean quarterly audit certification from external regulators.',
    involvedCharacters: ['Anita Deshmukh', 'Rajesh Kulkarni', 'Sneha Rao'],
    achievementTitle: 'Treasury Crisis Master',
    achievementDesc: 'Resolved a SEV-1 multi-crore financial settlement failure and secured flawless statutory audit clearance.'
  },

  MARKETING: {
    id: 'INC-MKT-703',
    roleCategory: 'MARKETING',
    categoryLabel: 'Brand Strategy, Public Relations & Growth',
    title: 'SEV-1 Viral Social Media Backlash & Rogue Ad Spend Runaway',
    severity: 'SEV-1',
    description: 'An automated programmatic marketing algorithm misallocated regional campaign budgets, bidding ₹85 Lakhs on controversial keywords across global ad networks. Viral consumer boycott petitions on X (Twitter) and LinkedIn are surging with negative sentiment trending in top 5 topics.',
    slaMinutesRemaining: 35,
    customerEscalationLevel: 3,
    stakeholderAlert: 'VP of Global Brand and Corporate PR Director are demanding immediate containment.',
    affectedServices: [
      'Global Social Media Accounts',
      'Programmatic Ad Spend Bidding Engine',
      'Press Syndicate Communications Wire'
    ],
    logs: [
      '[10:31:10] CRITICAL [ad-spend-guard] Hourly budget cap breached: $112,000 burned in 22 minutes',
      '[10:31:45] ALERT    [social-listening] Brand sentiment index plummeted from +84 to -61 in 45 minutes',
      '[10:32:15] WARN     [press-ticker] 6 national business dailies picked up controversy hashtag #NexoraExposed',
      '[10:32:50] ALERT    [influencer-matrix] 12 top brand ambassadors paused active endorsement contracts',
      '[10:33:30] ERROR    [bidding-api] Google & Meta automated campaign bidding stuck in unthrottled loop'
    ],
    actions: [
      {
        id: 'act-mkt-1',
        title: '1. Execute Emergency Kill-Switch on Global Programmatic Ad Bidding',
        subtitle: 'Instantly freeze all automated credit card spend and stop unauthorized impressions. (+10m SLA)',
        logMessage: 'Executed API circuit breaker across Google Ads, Meta Business Manager, and LinkedIn Campaign Manager.',
        slaBonus: 10,
        trustBonus: 4,
        reputationImpact: '+6 Financial Prudence'
      },
      {
        id: 'act-mkt-2',
        title: '2. Draft Clear, Empathetic Brand Statement & Fact Clarification',
        subtitle: 'Provide verified facts showing algorithmic error without defensive corporate jargon. (+12m SLA)',
        logMessage: 'Published transparent explanation acknowledging the glitch, reiterating company values, and pledging ad credits to green tech NGOs.',
        slaBonus: 12,
        trustBonus: 6,
        reputationImpact: '+8 Public Trust'
      },
      {
        id: 'act-mkt-3',
        title: '3. Deploy Community Response Playbook Across Social Channels',
        subtitle: 'Empower customer care reps with authorized replies to de-escalate public tension. (+8m SLA)',
        logMessage: 'Dispatched approved de-escalation matrix to 20 community moderators; negative comment engagement resolved constructively.',
        slaBonus: 8,
        trustBonus: 4,
        reputationImpact: '+6 Community Rapport'
      },
      {
        id: 'act-mkt-4',
        title: '4. Coordinate Exclusive Media Interview with Corporate Affairs Lead',
        subtitle: 'Turn the crisis into a showcase of ethical brand responsibility and governance. (+15m SLA)',
        logMessage: 'Conducted live media briefing with Tier-1 tech journalists; narrative shifted from boycott to praise for rapid accountability.',
        slaBonus: 15,
        trustBonus: 8,
        reputationImpact: '+10 Brand Equity'
      }
    ],
    resolutionSummary: 'Halted runaway ad spend, de-escalated viral public hostility, and restored corporate brand sentiment above baseline metrics.',
    involvedCharacters: ['Anita Deshmukh', 'Priya Sharma', 'Karan Verma'],
    achievementTitle: 'Brand Reputation Protector',
    achievementDesc: 'Masterfully controlled a viral PR crisis and turned potential brand catastrophe into corporate accountability.'
  },

  ADMIN: {
    id: 'INC-ADM-604',
    roleCategory: 'ADMIN',
    categoryLabel: 'Corporate Facilities & Workplace Operations',
    title: 'SEV-1 Campus Power Grid Outage & Data Center Cooling Failure',
    severity: 'SEV-1',
    description: 'Catastrophic municipal substation transformer explosion severed main power to the 800-person regional corporate campus. On-premise enterprise server room ambient temperature spiked to 41°C, while biometric turnstiles locked hundreds of employees inside corridors.',
    slaMinutesRemaining: 40,
    customerEscalationLevel: 2,
    stakeholderAlert: 'VP of Corporate Services Anita Deshmukh & Head of Security are overseeing physical evacuation.',
    affectedServices: [
      'Building Management System (BMS)',
      'Server Room HVAC Chiller Matrix',
      'Campus Biometric Access Turnstiles'
    ],
    logs: [
      '[10:31:00] CRITICAL [grid-sensor] Incoming 11kV grid supply voltage dropped to 0V (Municipal substation failure)',
      '[10:31:25] ALERT    [bms-chiller] Secondary water chiller compressor tripped; server room temp rising +1.2°C/min',
      '[10:32:00] WARN     [security-turnstile] Fail-secure latch lock engaged on Towers A & B emergency exits',
      '[10:32:35] ALERT    [life-safety] Fire marshal panel sounding backup battery low alert',
      '[10:33:10] ERROR    [diesel-gen-2] Auxiliary diesel generator 2 failed automatic synchronizer transfer'
    ],
    actions: [
      {
        id: 'act-adm-1',
        title: '1. Trigger Emergency Fire-Safety Override on All Building Turnstiles',
        subtitle: 'Ensure immediate unhindered physical egress for all 800 employees and visitors. (+10m SLA)',
        logMessage: 'Activated manual master relay; all building turnstiles and electromagnetic doors unlocked to fail-safe state.',
        slaBonus: 10,
        trustBonus: 6,
        reputationImpact: '+8 Life Safety Compliance'
      },
      {
        id: 'act-adm-2',
        title: '2. Manual Hot-Start Transfer of Backup Diesel Generators 1 & 3',
        subtitle: 'Restore emergency power to critical data center cooling and emergency lighting. (+12m SLA)',
        logMessage: 'Bypassed failed automatic ATS; manually synchronized 500kVA Cummins generator; critical bus re-energized.',
        slaBonus: 12,
        trustBonus: 5,
        reputationImpact: '+7 Infrastructure Reliability'
      },
      {
        id: 'act-adm-3',
        title: '3. Engage Auxiliary Mobile Spot Cooling Units in Server Room',
        subtitle: 'Prevent thermal shutdown and hardware destruction of mission-critical server racks. (+10m SLA)',
        logMessage: 'Redirected emergency chilled glycol loop; server room ambient temperature stabilized down to 22°C.',
        slaBonus: 10,
        trustBonus: 5,
        reputationImpact: '+6 Asset Protection'
      },
      {
        id: 'act-adm-4',
        title: '4. Execute Safe Campus Evacuation & Activate Hybrid Work Protocol',
        subtitle: 'Coordinate employee cafeteria and transport shuttles, transitioning workforce to remote mode. (+15m SLA)',
        logMessage: 'Organized orderly campus departure with emergency transport shuttles; remote work continuity confirmed.',
        slaBonus: 15,
        trustBonus: 8,
        reputationImpact: '+10 Leadership Acumen'
      }
    ],
    resolutionSummary: 'Safely evacuated all campus personnel with zero injuries, saved server equipment from thermal damage, and restored power through auxiliary generators.',
    involvedCharacters: ['Anita Deshmukh', 'Deepak Joshi', 'Priya Sharma'],
    achievementTitle: 'Workplace Commander',
    achievementDesc: 'Resolved a dual power and life-safety campus crisis protecting hundreds of lives and critical hardware.'
  },

  SCADA: {
    id: 'INC-SCA-505',
    roleCategory: 'SCADA',
    categoryLabel: 'SCADA, Telemetry & Industrial Automation',
    title: 'SEV-1 Substation PLC Telemetry Blackout & Pressure Surge Alert',
    severity: 'SEV-1',
    description: 'Modbus TCP and IEC 60870-5-104 telemetry links collapsed across 4 solar pooling substations. High-voltage step-up transformers are reporting sudden oil temperature spikes, but automated SCADA trip interlocks are blind due to industrial network packet drops.',
    slaMinutesRemaining: 45,
    customerEscalationLevel: 3,
    stakeholderAlert: 'Engineering Manager Sneha Rao & Grid Dispatch Officer are on the emergency telemetry bridge.',
    affectedServices: [
      'Modbus TCP Telemetry Gateway',
      'Substation PLC-402 RTU Controller',
      'Emergency High-Voltage Trip Matrix'
    ],
    logs: [
      '[10:31:05] CRITICAL [scada-gateway] Modbus poll timeout on Slave ID #14 (Substation RTU 192.168.10.42:502)',
      '[10:31:30] ALERT    [historian] Missing 104-telecontrol frame heartbeat for 90 seconds (IEC 60870 link down)',
      '[10:32:00] WARN     [oil-temp-sensor] Analog register 40102 reported sudden rise from 65°C to 89°C before link dropped',
      '[10:32:40] ALERT    [state-grid-sla] Grid dispatch authority issued 45-minute trip order unless telemetry is restored',
      '[10:33:15] ERROR    [packet-loss] Industrial ring switch experiencing broadcast storm on VLAN 40 (Automation)'
    ],
    actions: [
      {
        id: 'act-sca-1',
        title: '1. Suppress Industrial Ethernet Broadcast Storm on VLAN 40 Switch',
        subtitle: 'Enable RSTP loop protection and kill looping multicast frames on managed switches. (+10m SLA)',
        logMessage: 'Isolated looping port 8 on Moxa switch; broadcast storm dropped from 100k fps to nominal 120 fps.',
        slaBonus: 10,
        trustBonus: 4,
        reputationImpact: '+6 Industrial Networking'
      },
      {
        id: 'act-sca-2',
        title: '2. Re-establish IEC 60870-5-104 Link with Golden Redundant Gateway',
        subtitle: 'Switch telemetry transport to secondary cellular VPN tunnel. (+12m SLA)',
        logMessage: 'Activated secondary telecontrol link; IEC 104 connection re-established with 100% frame delivery.',
        slaBonus: 12,
        trustBonus: 6,
        reputationImpact: '+8 Telemetry Uptime'
      },
      {
        id: 'act-sca-3',
        title: '3. Verify Transformer Temperature Registers & Trip Thresholds in Modbus Poll',
        subtitle: 'Query holding registers directly to verify genuine thermal status vs false alarm sensor drift. (+10m SLA)',
        logMessage: 'Polled register 40102; confirmed temperature stabilized at 68°C; false alarm trigger cleared.',
        slaBonus: 10,
        trustBonus: 5,
        reputationImpact: '+7 Plant Safety'
      },
      {
        id: 'act-sca-4',
        title: '4. Issue Validated Active Power Sync to State Grid Load Dispatch',
        subtitle: 'Transmit certified plant availability telemetry to avert commercial grid curtailment fine. (+15m SLA)',
        logMessage: 'Dispatched signed telemetry packet to Grid SLDC; full 150MW export capacity approved and certified.',
        slaBonus: 15,
        trustBonus: 8,
        reputationImpact: '+10 Engineering Reputation'
      }
    ],
    resolutionSummary: 'Eliminated industrial network packet storm, restored substation SCADA telemetry, and prevented severe grid curtailment penalties.',
    involvedCharacters: ['Sneha Rao', 'Deepak Joshi', 'Tanvi Menon'],
    achievementTitle: 'Industrial Telemetry Hero',
    achievementDesc: 'Resolved a critical SCADA blackout and prevented state grid curtailment penalties under SEV-1 conditions.'
  },

  SOFTWARE: {
    id: 'INC-DEV-406',
    roleCategory: 'SOFTWARE',
    categoryLabel: 'Cloud Platform, Backend & Infrastructure',
    title: 'SEV-1 Apex Global Gateway 504 Timeouts & Database Connection Deadlock',
    severity: 'SEV-1',
    description: 'Tier-1 enterprise trading integration is experiencing a catastrophic spike in 504 Gateway Timeouts. Database connection pool on AWS Aurora PostgreSQL reached 100% capacity with 400+ blocked queries, halting enterprise client transactions.',
    slaMinutesRemaining: 45,
    customerEscalationLevel: 3,
    stakeholderAlert: 'Engineering Manager Sneha Rao & Principal Architect Deepak Joshi are on the PagerDuty bridge.',
    affectedServices: [
      'API Gateway Proxy Pods',
      'Kafka Telemetry Ingestion Broker',
      'RDS Aurora PostgreSQL Pool'
    ],
    logs: [
      '[10:32:01] ALERT  [ingress-proxy] upstream connection reset by peer: 10.244.12.89:8080 (p99 > 8500ms)',
      '[10:32:14] ERROR  [db-pool] exhausted 100/100 active connections; waiting queue depth: 412',
      '[10:32:28] ALERT  [pagerduty] SEV-1 SLA breach imminent (Apex Global Tier 1 customer impacted)',
      '[10:33:02] WARN   [telemetry-worker] Kafka consumer offset lag exceeded critical threshold (+38,000)',
      '[10:33:35] CRITICAL [circuit-breaker] Apex trading gateway tripped into open failure state'
    ],
    actions: [
      {
        id: 'act-dev-1',
        title: '1. Trace Query Locks & Kill Blocking Transactions in PostgreSQL',
        subtitle: 'Isolate unindexed exclusive table lock causing downstream connection pool exhaustion. (+10m SLA)',
        logMessage: 'Executed pg_terminate_backend on PID 8412 holding transaction_ledger row exclusive lock.',
        slaBonus: 10,
        trustBonus: 4,
        reputationImpact: '+6 Backend Performance'
      },
      {
        id: 'act-dev-2',
        title: '2. Scale Aurora Connection Pool & Enable PgBouncer Connection Multiplexing',
        subtitle: 'Instantly relieve connection starvation for pending ingress API requests. (+12m SLA)',
        logMessage: 'Scaled pool limit from 100 to 250 connections and routed read replicas through PgBouncer.',
        slaBonus: 12,
        trustBonus: 5,
        reputationImpact: '+7 Cloud Architecture'
      },
      {
        id: 'act-dev-3',
        title: '3. Trigger Instant Rollback of Last Microservice Canary Commit',
        subtitle: 'Revert unindexed SQL query deployment back to stable production release v2.3. (+10m SLA)',
        logMessage: 'Triggered ArgoCD rollback to v2.3.1; ingress HTTP error rate dropped to 0.02%.',
        slaBonus: 10,
        trustBonus: 5,
        reputationImpact: '+8 Incident Triage'
      },
      {
        id: 'act-dev-4',
        title: '4. Drain Kafka Consumer Lag & Flush Ingestion Backlog',
        subtitle: 'Scale worker pods and verify end-to-end data processing within contractual SLA. (+15m SLA)',
        logMessage: 'Scaled consumer fleet to 8 replicas; 38,000 message lag consumed in 4 minutes; trading latency normalized to 38ms.',
        slaBonus: 15,
        trustBonus: 8,
        reputationImpact: '+10 Principal Engineering'
      }
    ],
    resolutionSummary: 'Eliminated database deadlock, rolled back flawed query release, normalized API latency to 38ms, and saved customer contract SLA.',
    involvedCharacters: ['Sneha Rao', 'Deepak Joshi', 'Vikramaditya Singhania'],
    achievementTitle: 'System Resilience Champion',
    achievementDesc: 'Resolved a SEV-1 cloud database deadlock and restored high-throughput enterprise APIs within SLA.'
  }
};

/**
 * Determine the appropriate incident based on the player's job title or department
 */
export function getRoleIncident(title: string = '', department: string = ''): RoleIncidentConfig {
  const t = (title + ' ' + department).toLowerCase();

  if (t.includes('hr') || t.includes('talent') || t.includes('people') || t.includes('culture') || t.includes('recruit')) {
    return ROLE_INCIDENTS.HR;
  }
  if (t.includes('finance') || t.includes('accounting') || t.includes('treasury') || t.includes('audit')) {
    return ROLE_INCIDENTS.FINANCE;
  }
  if (t.includes('market') || t.includes('brand') || t.includes('pr') || t.includes('growth') || t.includes('communication')) {
    return ROLE_INCIDENTS.MARKETING;
  }
  if (t.includes('admin') || t.includes('facility') || t.includes('workplace') || t.includes('operations coord')) {
    return ROLE_INCIDENTS.ADMIN;
  }
  if (t.includes('scada') || t.includes('automation') || t.includes('plc') || t.includes('telemetry') || t.includes('control')) {
    return ROLE_INCIDENTS.SCADA;
  }
  if (t.includes('software') || t.includes('cloud') || t.includes('backend') || t.includes('engineer') || t.includes('developer')) {
    return ROLE_INCIDENTS.SOFTWARE;
  }

  // Default fallback to SCADA/Software based on presence
  return ROLE_INCIDENTS.SOFTWARE;
}
