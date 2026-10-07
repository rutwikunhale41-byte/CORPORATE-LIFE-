import { MeetingSession } from '../types/meeting';

export const SCHEDULED_MEETINGS: MeetingSession[] = [
  // 1. Daily Core Engineering Standup (09:15 AM)
  {
    id: 'meeting-standup',
    calendarEventId: 'cal-standup-0915',
    title: 'Daily Core Engineering Standup (15m)',
    type: 'standup',
    hour: 9,
    minute: 15,
    timeString: '09:15 AM',
    durationMinutes: 15,
    channelId: 'channel-standup',
    location: 'Microsoft Teams • Room 402 Bridge',
    organizer: {
      id: 'sneha-rao',
      name: 'Sneha Rao',
      role: 'Engineering Manager',
    },
    attendees: [
      {
        id: 'sneha-rao',
        name: 'Sneha Rao',
        role: 'Engineering Manager',
        avatar: 'SR',
        color: 'from-amber-600 to-rose-600',
        department: 'Cloud Platform & Infrastructure',
      },
      {
        id: 'deepak-joshi',
        name: 'Deepak Joshi',
        role: 'Senior Staff Engineer',
        avatar: 'DJ',
        color: 'from-blue-600 to-indigo-600',
        department: 'Cloud Platform & Infrastructure',
      },
      {
        id: 'ananya-iyer',
        name: 'Ananya Iyer',
        role: 'Senior Business Analyst',
        avatar: 'AI',
        color: 'from-emerald-500 to-teal-700',
        department: 'Product & Customer Solutions',
      },
      {
        id: 'aisha-patel',
        name: 'Aisha Patel',
        role: 'Associate Software Engineer',
        avatar: 'AP',
        color: 'from-rose-500 to-orange-500',
        department: 'Cloud Platform & Infrastructure',
      },
    ],
    description: 'Sprint alignment on staging pipeline health, Kafka latency blockers, and today’s release commitments.',
    agendaRounds: [
      {
        roundNumber: 1,
        phaseTitle: 'Sprint Blocker & Staging Status Check-in',
        speaker: {
          id: 'sneha-rao',
          name: 'Sneha Rao',
          role: 'Engineering Manager',
          avatar: 'SR',
          color: 'from-amber-600 to-rose-600',
        },
        speakerPrompt:
          "Good morning everyone. Let's keep it tight. Rutwik, we saw sporadic timeouts on the telemetry ingestion pipeline during the overnight staging run. What is your blocker status, and are we safe to trigger the release build by 2 PM?",
        slideContext: {
          title: 'Sprint 24 Burndown & Staging Telemetry',
          subtitle: 'Staging Environment Health • Ingestion Pipeline Cluster B',
          bullets: [
            'Telemetry gateway packet drops: 1.4% spike between 03:00 and 04:30 AM',
            'Pending PR #412: Ingestion retry backoff buffer by Rutwik',
            'Target deployment window: Today 14:00 UTC',
          ],
          tag: 'STANDUP BLOCKER',
          metricBadge: { label: 'Packet Drop Rate', value: '1.4%', isAlert: true },
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Defer & Follow Lead: Take notes and let Deepak investigate',
            dialogue:
              "I haven't fully looked into the 3 AM logs yet. If Deepak has time to check the Kafka broker logs, I can just shadow him and follow whatever approach he suggests.",
            rationale:
              'Avoids making any early commitments or taking blame. Keeps personal stress low, but signals a lack of initiative.',
            immediateReaction:
              'Sneha notes down your hesitation and exchanges a quick glance with Deepak. Deepak sighs softly and pulls up the terminal.',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'disappointed',
            reputationImpact: {
              managerTrustDelta: -2,
              teamTrustDelta: 0,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: -2, respectDelta: -3, rapportDelta: 0, reason: 'Deferred analysis on an assigned staging blocker' },
              'deepak-joshi': { trustDelta: -1, respectDelta: -4, rapportDelta: -1, reason: 'Expected independent investigation before asking for hand-holding' },
            },
            performanceEvaluation: {
              leadershipDelta: -3,
              ownershipDelta: -4,
              communicationDelta: 0,
              problemSolvingDelta: -2,
              summary: 'Showed hesitation in standup; deferred blocker diagnosis rather than demonstrating early ownership.',
            },
            consequenceToast: 'Passive response: Avoided conflict, but lost ownership rating with Sneha & Deepak.',
          },
          assertive: {
            style: 'assertive',
            label: 'Take Firm Ownership: Call out the root cause and commit to 12 PM fix',
            dialogue:
              'I analyzed the 3 AM dump before standup. It’s not a code bug in our PR—the staging database connection pool was starved by an unindexed query. I am locking down the connection leak now and will have green CI by 12:00 PM sharp. We will hit the 2 PM release.',
            rationale:
              'Direct, confident, and demonstrates preparation. High ownership and clear accountability.',
            immediateReaction:
              'Sneha’s eyebrows lift with approval. Deepak nods appreciatively, closing his troubleshooting tab.',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 2,
              customerTrustDelta: 1,
              hrReputationDelta: 1,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 4, respectDelta: 6, rapportDelta: 2, reason: 'Demonstrated proactive root-cause analysis and clear ETA' },
              'deepak-joshi': { trustDelta: 3, respectDelta: 5, rapportDelta: 2, reason: 'Respected technical clarity and direct root-cause identification' },
            },
            performanceEvaluation: {
              leadershipDelta: 7,
              ownershipDelta: 8,
              communicationDelta: 6,
              problemSolvingDelta: 7,
              summary: 'Outstanding proactive ownership in standup: analyzed pre-standup logs and gave crisp 12:00 PM commitment.',
            },
            consequenceToast: 'Assertive response: High respect gain! Sneha noted your crisp technical ownership.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Cross-Functional Synergy: Propose quick pair-triage with Aisha & update Ananya',
            dialogue:
              "I spotted connection pool contention in the 3 AM logs. Aisha worked on the query service last week—if Aisha and I pair for 20 minutes right after standup, we can patch the index and verify on staging. Ananya, I'll ping you in #automation-team at 11:30 AM so you know we're on track for 2 PM release.",
            rationale:
              'Leverages team strengths, brings in junior peers constructively, and keeps business stakeholders informed.',
            immediateReaction:
              'Aisha smiles gratefully for the inclusion. Ananya flashes a thumbs-up emoji in the Teams chat.',
            speakerReactionId: 'ananya-iyer',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 4,
              teamTrustDelta: 6,
              customerTrustDelta: 2,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 3, respectDelta: 4, rapportDelta: 3, reason: 'Appreciated structured teamwork and clear stakeholder touchpoint' },
              'aisha-patel': { trustDelta: 6, respectDelta: 4, rapportDelta: 7, reason: 'Appreciated collaborative pairing invitation instead of working in silos' },
              'ananya-iyer': { trustDelta: 5, respectDelta: 4, rapportDelta: 6, reason: 'Loved proactive communication loop for client release' },
            },
            performanceEvaluation: {
              leadershipDelta: 5,
              ownershipDelta: 6,
              communicationDelta: 8,
              problemSolvingDelta: 6,
              summary: 'Exemplary collaborative leadership: engaged team members, synchronized stakeholder updates, and outlined clear action plan.',
            },
            consequenceToast: 'Collaborative response: Team trust skyrocketed! Aisha and Ananya appreciated the synergy.',
          },
        },
      },
      {
        roundNumber: 2,
        phaseTitle: 'Debate: Fast-track Release vs Thorough Regression Testing',
        speaker: {
          id: 'deepak-joshi',
          name: 'Deepak Joshi',
          role: 'Senior Staff Engineer',
          avatar: 'DJ',
          color: 'from-blue-600 to-indigo-600',
        },
        speakerPrompt:
          'If we patch this at noon, running the full end-to-end regression suite takes 90 minutes. That cuts uncomfortably close to the 2 PM customer window. Should we skip the legacy Modbus integration tests for this cycle to guarantee on-time deployment?',
        slideContext: {
          title: 'CI/CD Pipeline Regression Suite Timings',
          subtitle: 'Test Execution Overhead • Modbus Legacy Suite vs Core API',
          bullets: [
            'Core API & Ingestion Tests: 18 mins (Parallelized)',
            'Legacy Modbus RTU/TCP Simulator Suite: 72 mins (Serial execution)',
            'Risk of skipping: Potential undetected regressions in edge gateway telemetry',
          ],
          tag: 'ARCHITAITURE DAIISION',
          metricBadge: { label: 'Regression Runtime', value: '90 mins', isAlert: true },
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Agree with Senior: Whatever Deepak decides is fine by me',
            dialogue:
              'Deepak is the Staff Engineer and knows the system architecture far better than I do. Whatever he and Sneha decide on the test suite, I will just execute.',
            rationale:
              'Safe compliance. Leaves all technical liability on senior shoulders.',
            immediateReaction:
              'Deepak furrows his brow slightly, hoping for engineering debate rather than blind acquiescence.',
            speakerReactionId: 'deepak-joshi',
            reactionEmotion: 'neutral',
            reputationImpact: {
              managerTrustDelta: 0,
              teamTrustDelta: -1,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'deepak-joshi': { trustDelta: 0, respectDelta: -2, rapportDelta: 0, reason: 'Hoped for technical input from the engineer writing the PR' },
              'sneha-rao': { trustDelta: 0, respectDelta: -1, rapportDelta: 0, reason: 'Looking for conviction in engineering judgment' },
            },
            performanceEvaluation: {
              leadershipDelta: -2,
              ownershipDelta: -1,
              communicationDelta: 0,
              problemSolvingDelta: -2,
              summary: 'Avoided technical stance on test governance; deferred entirely to senior colleague.',
            },
            consequenceToast: 'Passive response: Neutral, but Deepak wanted to see your technical conviction.',
          },
          assertive: {
            style: 'assertive',
            label: 'Firm Architectural Standard: Under no circumstances do we skip regression tests',
            dialogue:
              'No, we cannot skip the Modbus suite. The last time this team bypassed integration tests before an afternoon release, we had a SEV-2 rollback that hurt customer SLA. If we run tests on two dedicated runners, we can trim it to 45 minutes. I will stand behind quality over artificial urgency.',
            rationale:
              'Stands up for production safety, recalls past technical lessons, and proposes concrete runner optimization.',
            immediateReaction:
              'Vijay Menon (listening in on the bridge) nods approvingly. Deepak smiles faintly at the backbone shown.',
            speakerReactionId: 'deepak-joshi',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 4,
              teamTrustDelta: 2,
              customerTrustDelta: 3,
              hrReputationDelta: 1,
            },
            relationshipImpact: {
              'deepak-joshi': { trustDelta: 4, respectDelta: 6, rapportDelta: 2, reason: 'Admired principled stand on regression testing integrity' },
              'sneha-rao': { trustDelta: 3, respectDelta: 5, rapportDelta: 1, reason: 'Pleased that engineering guardrails are being actively defended' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 7,
              communicationDelta: 6,
              problemSolvingDelta: 7,
              summary: 'Defended code quality and production stability; pushed back assertively against cutting testing corners.',
            },
            consequenceToast: 'Assertive response: Earned massive respect from Deepak for technical integrity!',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Balanced Compromise: Targeted test matrix + staged canary deployment',
            dialogue:
              'What if we take a hybrid approach? We run the core pipeline plus the top 15 high-risk Modbus inverter tests now—that takes only 25 minutes. We deploy to Canary cluster at 1:45 PM with live synthetic telemetry. Meanwhile, the rest of the legacy suite finishes in background before we flip 100% traffic.',
            rationale:
              'Solves both Deepak’s time constraint and Sneha’s risk appetite through canary testing.',
            immediateReaction:
              'Sneha taps the desk approvingly: "That’s smart engineering diplomacy. Let’s do canary."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 5,
              customerTrustDelta: 3,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 5, respectDelta: 5, rapportDelta: 4, reason: 'Loved the pragmatic canary deployment compromise' },
              'deepak-joshi': { trustDelta: 4, respectDelta: 5, rapportDelta: 3, reason: 'Practical engineering trade-off that protects velocity and safety' },
              'ananya-iyer': { trustDelta: 4, respectDelta: 4, rapportDelta: 4, reason: 'Allows marketing and customer team to announce on-schedule rollout' },
            },
            performanceEvaluation: {
              leadershipDelta: 7,
              ownershipDelta: 6,
              communicationDelta: 8,
              problemSolvingDelta: 8,
              summary: 'Proposed ingenious canary deployment compromise balancing delivery deadline with regression risk.',
            },
            consequenceToast: 'Collaborative response: Brilliant compromise! Canary deployment adopted by Sneha.',
          },
        },
      },
      {
        roundNumber: 3,
        phaseTitle: 'Sprint Wrap-up: Weekend On-Call Rota & Ownership',
        speaker: {
          id: 'sneha-rao',
          name: 'Sneha Rao',
          role: 'Engineering Manager',
          avatar: 'SR',
          color: 'from-amber-600 to-rose-600',
        },
        speakerPrompt:
          'Lastly, since this release touches our core telemetry layer, we need secondary on-call coverage this Saturday in case the Apex Global inverters flap. Who is stepping up as secondary backup to Deepak?',
        slideContext: {
          title: 'Weekend On-Call Duty Roster',
          subtitle: 'Core Platform Rotation • Saturday 08:00 to Sunday 20:00',
          bullets: [
            'Primary On-Call: Deepak Joshi (Hardware & Network triage)',
            'Secondary On-Call: OPEN POSITION (Telemetry ingestion & DB alerts)',
            'On-call allowance: ₹12,000 weekend stipend + 1 comp-off day',
          ],
          tag: 'ON-CALL OWNERSHIP',
          metricBadge: { label: 'Weekend Stipend', value: '₹12,000 + Comp-Off', isAlert: false },
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Stay Silent: Wait for someone else to volunteer',
            dialogue:
              '... (Keep microphone muted, waiting to see if Aisha or another engineer volunteers first.)',
            rationale:
              'Protects personal weekend free time. Zero commitment made.',
            immediateReaction:
              'A pause lingers. Sneha looks around the virtual room, sighs, and assigns the slot to a shared rotation pool.',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'neutral',
            reputationImpact: {
              managerTrustDelta: 0,
              teamTrustDelta: 0,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: -1, respectDelta: -1, rapportDelta: 0, reason: 'Noticeable silence during critical team coverage need' },
            },
            performanceEvaluation: {
              leadershipDelta: -3,
              ownershipDelta: -3,
              communicationDelta: -1,
              problemSolvingDelta: 0,
              summary: 'Kept quiet during emergency on-call volunteer request; missed opportunity to exhibit proactivity.',
            },
            consequenceToast: 'Passive response: Protected your weekend, but missed an ownership brownie point.',
          },
          assertive: {
            style: 'assertive',
            label: 'Step Up Decisively: Take the Saturday slot as code owner',
            dialogue:
              'Put me down for Saturday secondary, Sneha. It’s my code going to production today, so I should be the one triaging if anything behaves abnormally over the weekend.',
            rationale:
              'Absolute textbook engineering accountability. "You build it, you run it."',
            immediateReaction:
              'Sneha writes your name in bold on the sprint board: "That’s what I like to hear, Rutwik. True ownership."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 3,
              customerTrustDelta: 2,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 6, respectDelta: 8, rapportDelta: 4, reason: 'Volunteered for weekend on-call coverage for own PR' },
              'deepak-joshi': { trustDelta: 5, respectDelta: 6, rapportDelta: 3, reason: 'Grateful to have the code author as secondary on-call partner' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 10,
              communicationDelta: 7,
              problemSolvingDelta: 6,
              summary: 'Highest ownership demonstration: volunteered for weekend on-call duty backing their own production changes.',
            },
            consequenceToast: 'Assertive response: Sneha gave highest praise for ownership! +6 Manager Trust.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Collaborative Shared Coverage: Split Saturday with Aisha',
            dialogue:
              'I can take the Saturday daytime shift from 8 AM to 3 PM, and if Aisha is open to it, we can split the compensation and hand over at 3 PM. That way neither of us gets burned out, and we both gain live production incident exposure.',
            rationale:
              'Thoughtful team distribution that prevents burnout and mentors peers.',
            immediateReaction:
              'Aisha readily agrees: "That works really well for me! Thanks Rutwik." Sneha smiles warmly: "Great teamwork, split logged."',
            speakerReactionId: 'aisha-patel',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 4,
              teamTrustDelta: 6,
              customerTrustDelta: 1,
              hrReputationDelta: 3,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 4, respectDelta: 5, rapportDelta: 3, reason: 'Appreciated sustainable workload distribution and mentoring' },
              'aisha-patel': { trustDelta: 7, respectDelta: 5, rapportDelta: 8, reason: 'Felt included and supported in sharing weekend on-call perks' },
            },
            performanceEvaluation: {
              leadershipDelta: 7,
              ownershipDelta: 7,
              communicationDelta: 8,
              problemSolvingDelta: 7,
              summary: 'Demonstrated collaborative resource management by splitting on-call shifts fairly with peer.',
            },
            consequenceToast: 'Collaborative response: Aisha and Sneha thrilled with fair shift sharing!',
          },
        },
      },
    ],
  },

  // 2. TASK-101: Telemetry Pipeline Kafka Architecture Triage (11:00 AM)
  {
    id: 'meeting-tech-triage',
    calendarEventId: 'cal-tech-triage-1100',
    title: 'TASK-101: Telemetry Pipeline Kafka Architecture Triage',
    type: 'tech-triage',
    hour: 11,
    minute: 0,
    timeString: '11:00 AM',
    durationMinutes: 30,
    channelId: 'direct-deepak',
    location: 'Architecture War Room • Zoom Conference',
    organizer: {
      id: 'deepak-joshi',
      name: 'Deepak Joshi',
      role: 'Senior Staff Engineer',
    },
    attendees: [
      {
        id: 'deepak-joshi',
        name: 'Deepak Joshi',
        role: 'Senior Staff Engineer',
        avatar: 'DJ',
        color: 'from-blue-600 to-indigo-600',
        department: 'Cloud Platform & Infrastructure',
      },
      {
        id: 'vijay-menon',
        name: 'Vijay Menon',
        role: 'Principal Enterprise Architect',
        avatar: 'VM',
        color: 'from-slate-700 to-zinc-900',
        department: 'Office of the CTO',
      },
      {
        id: 'sneha-rao',
        name: 'Sneha Rao',
        role: 'Engineering Manager',
        avatar: 'SR',
        color: 'from-amber-600 to-rose-600',
        department: 'Cloud Platform & Infrastructure',
      },
    ],
    description: 'Deep technical investigation into distributed Kafka partition lag, Modbus converter concurrency, and database lock contention.',
    agendaRounds: [
      {
        roundNumber: 1,
        phaseTitle: 'Partition Lag Diagnosis & DB Deadlock Investigation',
        speaker: {
          id: 'deepak-joshi',
          name: 'Deepak Joshi',
          role: 'Senior Staff Engineer',
          avatar: 'DJ',
          color: 'from-blue-600 to-indigo-600',
        },
        speakerPrompt:
          'Let’s pull up the Grafana dashboard. Partition 3 consumer lag is fluctuating wildly between 1,200 and 18,000 offset items during peak solar hours. Rutwik, you wrote the latest consumer listener. Is the bottleneck in the message serialization or in our Postgres upsert statement?',
        slideContext: {
          title: 'Grafana Telemetry Pipeline Dashboard',
          subtitle: 'Cluster: prod-kafka-eu-west-1 • Consumer Group: solar-inverter-ingest',
          bullets: [
            'Partition 3 consumer lag: 18,240 records behind high watermark',
            'Postgres lock wait time: 420ms average on table telemetry_raw_1sec',
            'Serialization throughput: 4,200 msg/sec (CPU usage 38%)',
          ],
          tag: 'PERFORVSNCE TRACE',
          metricBadge: { label: 'Consumer Lag', value: '18,240 records', isAlert: true },
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Uncertain & Deferential: It could be either, I can benchmark whatever you recommend',
            dialogue:
              'I am not 100% sure yet. The serialization code followed the standard template, but maybe the Postgres upsert is locking rows. Deepak, you have more experience profiling the JVM; whatever profiling command you want me to run, send it over.',
            rationale:
              'Plays it very safe to avoid making a wrong technical diagnosis in front of the Principal Architect.',
            immediateReaction:
              'Vijay Menon leans back and taps his pen impatiently on his notebook: "We don’t need guesses, we need memory profiler stats."',
            speakerReactionId: 'vijay-menon',
            reactionEmotion: 'disappointed',
            reputationImpact: {
              managerTrustDelta: -1,
              teamTrustDelta: 0,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'vijay-menon': { trustDelta: -3, respectDelta: -4, rapportDelta: 0, reason: 'Dislikes speculative answers without benchmark evidence' },
              'deepak-joshi': { trustDelta: -1, respectDelta: -2, rapportDelta: 0, reason: 'Expected clear distinction between CPU and I/O wait' },
            },
            performanceEvaluation: {
              leadershipDelta: -2,
              ownershipDelta: -2,
              communicationDelta: -1,
              problemSolvingDelta: -3,
              summary: 'Hesitant technical communication; failed to distinguish between serialization CPU usage and database I/O lock wait.',
            },
            consequenceToast: 'Passive response: Vijay Menon was unimpressed with the lack of definitive data.',
          },
          assertive: {
            style: 'assertive',
            label: 'Data-Backed Technical Defense: The bottleneck is unequivocally the DB lock contention',
            dialogue:
              'It is unequivocally the Postgres upsert lock. Serialization CPU utilization is sitting quietly at 38%, which rules out JSON or Protobuf overhead. The telemetry_raw_1sec table has a composite primary key on timestamp and inverter_id without index partitioning, causing row-level lock escalation under 4,000 writes/sec. We need declarative table partitioning, not JVM micro-optimizations.',
            rationale:
              'Crisp, technically precise, eliminates red herrings with hard metrics, and proposes an architectural remedy.',
            immediateReaction:
              'Vijay Menon stops tapping his pen and grins: "Finally, someone who understands relational storage concurrency." Deepak nods vigorously.',
            speakerReactionId: 'vijay-menon',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 3,
              customerTrustDelta: 2,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'vijay-menon': { trustDelta: 6, respectDelta: 9, rapportDelta: 3, reason: 'Impressed by deep database lock escalation and indexing knowledge' },
              'deepak-joshi': { trustDelta: 4, respectDelta: 7, rapportDelta: 3, reason: 'Appreciated data-backed elimination of serialization theory' },
              'sneha-rao': { trustDelta: 4, respectDelta: 5, rapportDelta: 2, reason: 'Pleased to see team defend technical positions with metrics' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 8,
              communicationDelta: 8,
              problemSolvingDelta: 9,
              summary: 'Showcased elite systems diagnosis: identified database table lock escalation with metrics and proposed declarative partitioning.',
            },
            consequenceToast: 'Assertive response: Vijay Menon and Deepak were blown away by your technical precision!',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Multi-Pronged Remediation: Buffer in Redis while pairing with DBA',
            dialogue:
              'Looking at the metrics together, CPU is low at 38% but I/O lock wait is 420ms. To address this safely without risking prod downtime, I suggest we introduce a Redis batch buffer to flush writes every 500ms. I will sync with Vijay’s DBA team on the partition migration script while Deepak reviews my Redis batch consumer PR.',
            rationale:
              'Provides an immediate tactical de-bottlenecking (batching) while coordinating long-term schema migration.',
            immediateReaction:
              'Sneha smiles: "That protects our write throughput while giving us room to execute the migration properly."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 6,
              customerTrustDelta: 2,
              hrReputationDelta: 1,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 5, respectDelta: 6, rapportDelta: 4, reason: 'Valued practical staged rollout preventing production disruption' },
              'deepak-joshi': { trustDelta: 4, respectDelta: 5, rapportDelta: 4, reason: 'Agreed that batching addresses the immediate write pressure' },
              'vijay-menon': { trustDelta: 4, respectDelta: 5, rapportDelta: 3, reason: 'Approved of consulting DBA team before altering prod schema' },
            },
            performanceEvaluation: {
              leadershipDelta: 7,
              ownershipDelta: 7,
              communicationDelta: 8,
              problemSolvingDelta: 8,
              summary: 'Synthesized immediate Redis batch buffer mitigation with long-term DBA schema migration strategy.',
            },
            consequenceToast: 'Collaborative response: Sneha loved the tactical safety buffer and DBA alignment!',
          },
        },
      },
      {
        roundNumber: 2,
        phaseTitle: 'Vijay Menon’s Architectural Challenge: Complexity vs Simplicity',
        speaker: {
          id: 'vijay-menon',
          name: 'Vijay Menon',
          role: 'Principal Enterprise Architect',
          avatar: 'VM',
          color: 'from-slate-700 to-zinc-900',
        },
        speakerPrompt:
          'Every time junior engineers see latency, their instinct is to throw another distributed caching layer or Kafka topic at it. Do you realize that introducing Redis creates another point of network failure, another cache invalidation edge case, and another node to monitor?',
        slideContext: {
          title: 'Infrastructure Footprint & Failure Domains',
          subtitle: 'Architecture Review Board • RFC 312 Failure Modes',
          bullets: [
            'Current state: Ingestion -> Kafka -> Consumer -> PostgreSQL',
            'Proposed state with Redis: Ingestion -> Kafka -> Consumer -> Redis Buffer -> PostgreSQL',
            'Vijay’s Law: "Every layer of indirection is another 3 AM page for the on-call engineer."',
          ],
          tag: 'ARCHITAITURE PRINCIPLE',
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Back Down Immediately: You’re right Vijay, let’s discard the Redis idea',
            dialogue:
              'You are completely right Vijay. I defer to your architectural experience. We can drop the Redis proposal and just hope the Postgres tuning is enough.',
            rationale:
              'Complete capitulation to authority. Avoids arguing with the Principal Architect.',
            immediateReaction:
              'Vijay shakes his head: "I am challenging your thinking, not asking you to fold like a wet towel."',
            speakerReactionId: 'vijay-menon',
            reactionEmotion: 'disappointed',
            reputationImpact: {
              managerTrustDelta: -2,
              teamTrustDelta: -1,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'vijay-menon': { trustDelta: -3, respectDelta: -5, rapportDelta: -2, reason: 'Disrespects engineers who abandon their technical proposals without defending them' },
              'deepak-joshi': { trustDelta: -1, respectDelta: -3, rapportDelta: -1, reason: 'Wanted to see technical defense against the architecture board' },
            },
            performanceEvaluation: {
              leadershipDelta: -4,
              ownershipDelta: -3,
              communicationDelta: -2,
              problemSolvingDelta: -2,
              summary: 'Folded under challenge from Principal Architect; failed to articulate architectural trade-offs.',
            },
            consequenceToast: 'Passive response: Vijay criticized you for folding without defending your proposal.',
          },
          assertive: {
            style: 'assertive',
            label: 'Stand Ground with Trade-Off Matrix: Direct telemetry writes cannot survive peak load',
            dialogue:
              'I respect the simplicity principle, Vijay, but telemetry ingestion is an append-only write-heavy time-series workload. Standard Postgres WAL flushes cannot sustain 15,000 IOPS during solar noon without buffering. Redis is already deployed in our VPC with 99.99% availability. If Redis fails, our consumer falls back to direct batch inserts. The risk is bounded, and the SLA upside is measurable.',
            rationale:
              'Addresses the criticism directly, explains the fallback mode, and defends the trade-off rationally.',
            immediateReaction:
              'Vijay pauses, then writes in his notebook: "Fallback to direct batch insert on Redis timeout. That satisfies failure domain isolation. Proceed."',
            speakerReactionId: 'vijay-menon',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 4,
              customerTrustDelta: 3,
              hrReputationDelta: 1,
            },
            relationshipImpact: {
              'vijay-menon': { trustDelta: 6, respectDelta: 8, rapportDelta: 4, reason: 'Admired the concrete fallback mechanism and firm engineering trade-off defense' },
              'deepak-joshi': { trustDelta: 5, respectDelta: 7, rapportDelta: 4, reason: 'Proud of teammate standing up to Vijay with sound architecture' },
              'sneha-rao': { trustDelta: 5, respectDelta: 6, rapportDelta: 3, reason: 'Excited by the high caliber of technical debate' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 8,
              communicationDelta: 9,
              problemSolvingDelta: 9,
              summary: 'Stood firm against Principal Architect with rigorous fallback architecture and bounded risk analysis.',
            },
            consequenceToast: 'Assertive response: Vijay Menon officially signed off on your architecture RFC!',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Co-Design with Vijay: Micro-benchmark TimescaleDB vs Redis with Vijay’s criteria',
            dialogue:
              'Vijay’s critique is spot-on regarding failure domains. What if we do this: we run an in-memory ring-buffer inside the JVM consumer process first—zero new network hops. If and only if heap pressure exceeds 60%, we evaluate external Redis. Deepak, could you review the memory leak risk of the in-process ring buffer while Vijay reviews the heap boundaries?',
            rationale:
              'Eliminates the external dependency entirely by using in-process memory, addressing Vijay’s core objection collaboratively.',
            immediateReaction:
              'Vijay nods warmly: "An in-process LVSX disruptor ring buffer. Elegant, zero network hops, and keeps ops simple. I like that."',
            speakerReactionId: 'vijay-menon',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 6,
              customerTrustDelta: 2,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'vijay-menon': { trustDelta: 7, respectDelta: 7, rapportDelta: 6, reason: 'Loved the in-process zero-network-hop ring buffer proposal' },
              'deepak-joshi': { trustDelta: 5, respectDelta: 6, rapportDelta: 5, reason: 'Appreciated high-performance LVSX disruptor pattern' },
              'sneha-rao': { trustDelta: 4, respectDelta: 5, rapportDelta: 4, reason: 'Cost-effective solution with zero added cloud infrastructure bills' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 7,
              communicationDelta: 8,
              problemSolvingDelta: 10,
              summary: 'Pioneered elegant in-process ring buffer solution that honored Principal Architect principles with zero added cloud cost.',
            },
            consequenceToast: 'Collaborative response: Vijay praised your in-process ring buffer solution as elegant engineering!',
          },
        },
      },
      {
        roundNumber: 3,
        phaseTitle: 'Action Item & Code Review Timeline',
        speaker: {
          id: 'deepak-joshi',
          name: 'Deepak Joshi',
          role: 'Senior Staff Engineer',
          avatar: 'DJ',
          color: 'from-blue-600 to-indigo-600',
        },
        speakerPrompt:
          'Great consensus. We have a solid direction. Rutwik, how long will it take you to implement the buffer prototype and push an RFC document to Confluence for team sign-off?',
        slideContext: {
          title: 'Architecture RFC Sign-off Checklist',
          subtitle: 'RFC-408: High-Throughput In-Process Telemetry Buffering',
          bullets: [
            'Prototype implementation on staging cluster',
            'Confluence RFC document with benchmarking metrics',
            'Sign-off required: Deepak Joshi & Vijay Menon',
          ],
          tag: 'ACTION ITEM',
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Vague Estimate: Sometime next week when sprint tasks calm down',
            dialogue:
              'I have quite a few Jira tickets right now, so probably sometime next week. I will try to squeeze it in whenever I get free time.',
            rationale:
              'Non-committal, leaves timeline open to avoid deadline pressure.',
            immediateReaction:
              'Deepak frowns: "Partition lag is happening today. We can’t wait a week for an architectural fix."',
            speakerReactionId: 'deepak-joshi',
            reactionEmotion: 'impatient',
            reputationImpact: {
              managerTrustDelta: -2,
              teamTrustDelta: -1,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'deepak-joshi': { trustDelta: -3, respectDelta: -3, rapportDelta: -1, reason: 'Frustrated by vague "sometime next week" commitment on critical issue' },
              'sneha-rao': { trustDelta: -2, respectDelta: -2, rapportDelta: 0, reason: 'Expected proactive sprint task prioritization' },
            },
            performanceEvaluation: {
              leadershipDelta: -3,
              ownershipDelta: -4,
              communicationDelta: -2,
              problemSolvingDelta: 0,
              summary: 'Provided vague commitment timeline on high-severity architecture triage.',
            },
            consequenceToast: 'Passive response: Deepak pushed back against the vague timeline.',
          },
          assertive: {
            style: 'assertive',
            label: 'Committed Hard Deadline: PR ready by 4:30 PM today with benchmark suite',
            dialogue:
              'I will have the working prototype and benchmark numbers pushed to Git branch telemetry-ring-buffer by 4:30 PM today. Deepak, if you can block 30 minutes at 5:00 PM for code review, we can have Vijay’s final stamp before EOD.',
            rationale:
              'High velocity, clear time-boxing, and proactively schedules the stakeholder review.',
            immediateReaction:
              'Deepak smiles: "Calendar invite accepted for 5 PM. Let’s ship it."',
            speakerReactionId: 'deepak-joshi',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 5,
              teamTrustDelta: 3,
              customerTrustDelta: 2,
              hrReputationDelta: 1,
            },
            relationshipImpact: {
              'deepak-joshi': { trustDelta: 6, respectDelta: 7, rapportDelta: 4, reason: 'Loved the crisp 4:30 PM commitment and proactive 5 PM review invite' },
              'sneha-rao': { trustDelta: 4, respectDelta: 6, rapportDelta: 3, reason: 'Impressed by sprint velocity and clear coordination' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 9,
              communicationDelta: 8,
              problemSolvingDelta: 7,
              summary: 'Committed to crisp same-day delivery and proactive calendar review sync with Senior Staff Engineer.',
            },
            consequenceToast: 'Assertive response: Deepak locked in 5 PM code review. Fantastic ownership!',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Sprint Priority Rebalancing: Request Sneha re-sequence low-priority tickets',
            dialogue:
              'I can deliver the prototype by 3:00 PM tomorrow if Sneha can help reassign my two non-critical documentation tickets to Aisha. That lets me focus 100% on benchmarking and ensures the code is rock-solid. Sneha, does that sprint trade-off work for you?',
            rationale:
              'Transparent capacity management. Protects delivery quality by openly negotiating sprint workload with manager.',
            immediateReaction:
              'Sneha nods immediately: "Done. I will move the docs tickets to Aisha. Focus on the buffer."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 4,
              teamTrustDelta: 4,
              customerTrustDelta: 1,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 5, respectDelta: 6, rapportDelta: 4, reason: 'Appreciated transparent capacity negotiation rather than silent slippage' },
              'deepak-joshi': { trustDelta: 4, respectDelta: 5, rapportDelta: 3, reason: 'Realistic timeline with protected focus time' },
            },
            performanceEvaluation: {
              leadershipDelta: 7,
              ownershipDelta: 7,
              communicationDelta: 8,
              problemSolvingDelta: 7,
              summary: 'Skillfully negotiated sprint capacity with manager to protect high-impact architectural delivery.',
            },
            consequenceToast: 'Collaborative response: Sneha rebalanced sprint tickets to give you dedicated focus time.',
          },
        },
      },
    ],
  },

  // 3. Apex Global Client Reliability Review (02:30 PM - High Stakes!)
  {
    id: 'meeting-client-review',
    calendarEventId: 'cal-client-review-1430',
    title: 'Apex Global Client Reliability Review',
    type: 'client-review',
    hour: 14,
    minute: 30,
    timeString: '02:30 PM',
    durationMinutes: 45,
    channelId: 'direct-vikramaditya',
    location: 'Executive Client Boardroom • Cisco Webex Bridge',
    organizer: {
      id: 'vikramaditya-singhania',
      name: 'Vikramaditya Singhania',
      role: 'VP of Technology (Apex Global)',
    },
    attendees: [
      {
        id: 'vikramaditya-singhania',
        name: 'Vikramaditya Singhania',
        role: 'VP of Technology (Apex Global)',
        avatar: 'VS',
        color: 'from-purple-700 to-pink-700',
        department: 'Enterprise Customer',
      },
      {
        id: 'sneha-rao',
        name: 'Sneha Rao',
        role: 'Engineering Manager',
        avatar: 'SR',
        color: 'from-amber-600 to-rose-600',
        department: 'Cloud Platform & Infrastructure',
      },
      {
        id: 'deepak-joshi',
        name: 'Deepak Joshi',
        role: 'Senior Staff Engineer',
        avatar: 'DJ',
        color: 'from-blue-600 to-indigo-600',
        department: 'Cloud Platform & Infrastructure',
      },
      {
        id: 'ananya-iyer',
        name: 'Ananya Iyer',
        role: 'Senior Business Analyst',
        avatar: 'AI',
        color: 'from-emerald-500 to-teal-700',
        department: 'Product & Customer Solutions',
      },
    ],
    description: 'High-stakes executive escalation with enterprise customer VP over solar SCADA telemetry dropouts and SLA penalties.',
    agendaRounds: [
      {
        roundNumber: 1,
        phaseTitle: 'Opening Cross-Examination: Telemetry Lag & Trading Desk Impact',
        speaker: {
          id: 'vikramaditya-singhania',
          name: 'Vikramaditya Singhania',
          role: 'VP of Technology (Apex Global)',
          avatar: 'VS',
          color: 'from-purple-700 to-pink-700',
        },
        speakerPrompt:
          'Let’s get right to the point. Our automated power trading algorithms experienced a 42-second telemetry feed blackout during peak European market trading yesterday. That cost Apex Global over €85,000 in unhedged power exposure. Your SLA contract promises four-nines reliability. Rutwik, why was our feed delayed, and who authorized the gateway restart during live market hours?',
        slideContext: {
          title: 'Apex Global High-Frequency Trading Telemetry Log',
          subtitle: 'Incident Timestamp: Yesterday 13:42:10 - 13:42:52 IST',
          bullets: [
            'Packet latency spike: 22ms normal -> 42,800ms blackout',
            'Unhedged power trading exposure: €85,200 estimated losses',
            'Contractual penalty clause 7.3: Up to 15% monthly subscription rebate',
          ],
          tag: 'EXAIUTIVE ESCALATION',
          metricBadge: { label: 'Client Trading Loss', value: '€85,200', isAlert: true },
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Apologetic & Defensive: Apologize profusely and defer to management',
            dialogue:
              'I am so sorry to hear that, Mr. Singhania. That is terrible. I wasn’t the one who authorized the gateway restart yesterday, so Sneha or Deepak would have to speak to the commercial decisions. I just work on the backend code.',
            rationale:
              'Attempts to deflect personal blame and appease the client with apologies.',
            immediateReaction:
              'Vikramaditya scowls: "I don’t care who sits in what cubicle, I care about my trading desk." Sneha winces slightly at the blame-shifting.',
            speakerReactionId: 'vikramaditya-singhania',
            reactionEmotion: 'demanding',
            reputationImpact: {
              managerTrustDelta: -3,
              teamTrustDelta: -2,
              customerTrustDelta: -5,
              hrReputationDelta: -1,
            },
            relationshipImpact: {
              'vikramaditya-singhania': { trustDelta: -6, respectDelta: -7, rapportDelta: -4, reason: 'Felt dismissive of client financial impact and deflected responsibility' },
              'sneha-rao': { trustDelta: -4, respectDelta: -5, rapportDelta: -2, reason: 'Distressed by junior engineer passing the buck in front of enterprise client' },
            },
            performanceEvaluation: {
              leadershipDelta: -5,
              ownershipDelta: -6,
              communicationDelta: -4,
              problemSolvingDelta: -2,
              summary: 'Shifted blame and gave overly defensive apology during executive client escalation.',
            },
            consequenceToast: 'Passive response: Vikramaditya was infuriated by deflection, and Sneha lost trust in your client presence.',
          },
          assertive: {
            style: 'assertive',
            label: 'Fact-Based Professional Composure: Clarify network telemetry vs gateway restart',
            dialogue:
              'Mr. Singhania, we deeply respect the financial gravity of yesterday’s 42-second lag. To be completely accurate: no engineer on our team restarted the gateway during market hours. Our firewall audit logs show that Apex Global’s regional Mumbai ISP experienced a BGP route re-convergence at 13:42 IST, triggering TCP packet retransmission on your ingress. We mitigated by rerouting telemetry through our Bangalore edge within 42 seconds. Let’s review the timestamped network trace together.',
            rationale:
              'Calm, firm, backed by undeniable firewall packet evidence, and counters unfair customer accusations without being rude.',
            immediateReaction:
              'Vikramaditya pauses, looks at his own network operations manager off-camera, and adjusts his posture: "...Show me the BGP packet timestamps."',
            speakerReactionId: 'vikramaditya-singhania',
            reactionEmotion: 'neutral',
            reputationImpact: {
              managerTrustDelta: 7,
              teamTrustDelta: 6,
              customerTrustDelta: 4,
              hrReputationDelta: 3,
            },
            relationshipImpact: {
              'vikramaditya-singhania': { trustDelta: 5, respectDelta: 8, rapportDelta: 3, reason: 'Impressed by unflappable composure and irrefutable technical network proof' },
              'sneha-rao': { trustDelta: 7, respectDelta: 8, rapportDelta: 5, reason: 'Incredible poise defending the company against an unfair SLA penalty threat' },
              'deepak-joshi': { trustDelta: 6, respectDelta: 7, rapportDelta: 4, reason: 'Loved the crisp BGP routing analysis presented to the client' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 9,
              communicationDelta: 9,
              problemSolvingDelta: 9,
              summary: 'Masterclass in client de-escalation: proved ISP BGP route flaw with packet logs, defending company from €85k penalty.',
            },
            consequenceToast: 'Assertive response: Incredible! You proved the ISP fault and saved the company from penalties.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Partnering on Shared Resilience: Acknowledge pain & propose dual-redundant multi-pathing',
            dialogue:
              'Mr. Singhania, any trading disruption is unacceptable, regardless of whether the latency originated in the upstream transit or our ingestion layer. While our telemetry trace shows an external transit blip, the fact is your trading algorithms felt it. To ensure Apex Global never faces this exposure again, Ananya and I have drawn up a dual-homed redundant streaming protocol that hot-swaps between AWS DirectConnect and Azure ExpressRoute with zero packet drop. Can we walk your technical team through the failover test tomorrow?',
            rationale:
              'Acknowledges customer pain, takes the high road, and proposes a proactive architectural upgrade that transforms conflict into a customer win.',
            immediateReaction:
              'Vikramaditya nods slowly: "That is the level of proactive engineering partnership I expect from Nexora. Send the architecture spec to Sangeeta."',
            speakerReactionId: 'vikramaditya-singhania',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 7,
              customerTrustDelta: 8,
              hrReputationDelta: 4,
            },
            relationshipImpact: {
              'vikramaditya-singhania': { trustDelta: 8, respectDelta: 7, rapportDelta: 8, reason: 'Felt truly heard and excited about the dual-homed enterprise failover' },
              'sneha-rao': { trustDelta: 6, respectDelta: 7, rapportDelta: 6, reason: 'Turned a potential customer contract disaster into an upsell opportunity' },
              'ananya-iyer': { trustDelta: 8, respectDelta: 6, rapportDelta: 9, reason: 'Thrilled with the joint product partnership presentation' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 8,
              communicationDelta: 10,
              problemSolvingDelta: 9,
              summary: 'Transformed volatile executive customer crisis into long-term strategic partnership through redundant streaming proposal.',
            },
            consequenceToast: 'Collaborative response: Vikramaditya Singhania was delighted! +8 Customer Trust.',
          },
        },
      },
      {
        roundNumber: 2,
        phaseTitle: 'Commercial Dispute: Contractual SLA Penalty Demand',
        speaker: {
          id: 'vikramaditya-singhania',
          name: 'Vikramaditya Singhania',
          role: 'VP of Technology (Apex Global)',
          avatar: 'VS',
          color: 'from-purple-700 to-pink-700',
        },
        speakerPrompt:
          'Even with multi-homed routing, my Board is breathing down my neck. Clause 7.3 states that any breach of monthly 99.9% uptime entitles Apex Global to a 15% invoice rebate this quarter. Are you willing to endorse that rebate right now, or do we need to escalate to your Vice President Rajesh Kulkarni?',
        slideContext: {
          title: 'Master Services Agreement • Clause 7.3 Penalty Terms',
          subtitle: 'Contract Value: ₹2.4 Crore / Year • Q3 Rebate Value: ₹9,00,000',
          bullets: [
            'Client position: 42-second drop triggers full monthly penalty tier',
            'Nexora legal position: External network force majeure clause applies',
            'Sneha’s whisper to Rutwik in private chat: "Be careful—commercial discounts require Rajesh Kulkarni’s approval."',
          ],
          tag: 'LEGAL & COMMERCIAL',
          metricBadge: { label: 'Rebate at Stake', value: '₹9,00,000', isAlert: true },
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Accede to Pressure: If you feel that’s fair, we understand',
            dialogue:
              'If your Board requires the 15% rebate to feel comfortable, I suppose we can understand your perspective. We just want to keep Apex Global happy as a customer.',
            rationale:
              'Caves in to avoid client displeasure, but violates internal commercial authority limits.',
            immediateReaction:
              'Sneha jumps in on the microphone, clearly alarmed: "Rutwik is speaking from engineering empathy, but commercial credits must be evaluated by our commercial directors."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'demanding',
            reputationImpact: {
              managerTrustDelta: -6,
              teamTrustDelta: -2,
              customerTrustDelta: 2,
              hrReputationDelta: -4,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: -7, respectDelta: -7, rapportDelta: -3, reason: 'Gave away commercial negotiating leverage without authority' },
              'vikramaditya-singhania': { trustDelta: 2, respectDelta: -3, rapportDelta: 1, reason: 'Pleased with rebate hint, but saw vulnerability and lack of executive protocol' },
            },
            performanceEvaluation: {
              leadershipDelta: -6,
              ownershipDelta: -4,
              communicationDelta: -5,
              problemSolvingDelta: -4,
              summary: 'Conceded commercial discount unauthorizedly in front of enterprise customer, damaging manager trust.',
            },
            consequenceToast: 'Passive response: Critical error! You verbally conceded a ₹9L rebate without commercial approval.',
          },
          assertive: {
            style: 'assertive',
            label: 'Firm Protocol Boundary: Commercials sit with VP Rajesh; engineering delivers technical SLA report',
            dialogue:
              'Mr. Singhania, as engineers, our job is to deliver rigorous technical truths. Under the Master Services Agreement, commercial rebate determinations are governed by formal RCA sign-offs between Rajesh Kulkarni and yourself. We will deliver the complete forensic network audit by 5 PM today so both executive teams have verifiable telemetry data before discussing financial credits. That protects both organizations.',
            rationale:
              'Respects governance, defends company commercial boundaries, and keeps the discussion anchored to objective data.',
            immediateReaction:
              'Vikramaditya nods curtly: "Fair enough. Fair points. Deliver the RCA by 5 PM, and I will sync directly with Rajesh."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 4,
              customerTrustDelta: 3,
              hrReputationDelta: 4,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 8, respectDelta: 8, rapportDelta: 5, reason: 'Flawlessly protected commercial protocol while keeping customer respectful' },
              'vikramaditya-singhania': { trustDelta: 4, respectDelta: 6, rapportDelta: 2, reason: 'Respected disciplined adherence to executive governance' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 8,
              communicationDelta: 9,
              problemSolvingDelta: 8,
              summary: 'Maintained impeccable commercial governance protocol; deferred financial negotiation to VP while committing to forensic technical RCA.',
            },
            consequenceToast: 'Assertive response: Sneha breathed a huge sigh of relief! Flawless commercial boundaries.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Value-Add Alternative: Propose re-investing rebate into dedicated VIP monitoring tier',
            dialogue:
              'Rather than a standard financial rebate that does nothing to protect your next trading cycle, what if Rajesh and Sneha propose converting any eligible credit into 6 months of our dedicated VIP White-Glove Observability tier? That gives Apex Global direct access to our 24/7 Tier-3 engineering bridge and custom Prometheus alerting at zero additional billing.',
            rationale:
              'Ingenious corporate solution: substitutes a cash loss with high-margin service provisioning that locks the client in deeper.',
            immediateReaction:
              'Ananya’s eyes widen in delight: "That’s brilliant." Vikramaditya rubs his chin: "That actually provides real operational value to my trading desk. Put that on Rajesh’s desk."',
            speakerReactionId: 'ananya-iyer',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 7,
              teamTrustDelta: 6,
              customerTrustDelta: 7,
              hrReputationDelta: 4,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 7, respectDelta: 8, rapportDelta: 6, reason: 'Masterful commercial creativity: replaced cash refund with sticky SaaS service tier' },
              'ananya-iyer': { trustDelta: 8, respectDelta: 7, rapportDelta: 8, reason: 'Loved the innovative commercial account management thinking' },
              'vikramaditya-singhania': { trustDelta: 6, respectDelta: 7, rapportDelta: 6, reason: 'Appreciated tangible trading desk operational benefits over pure paperwork credits' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 9,
              communicationDelta: 10,
              problemSolvingDelta: 10,
              summary: 'Inventive corporate commercial diplomacy: proposed reallocating dispute funds into high-touch observability tier.',
            },
            consequenceToast: 'Collaborative response: Commercial genius! Transformed rebate dispute into VIP service tier.',
          },
        },
      },
      {
        roundNumber: 3,
        phaseTitle: 'Meeting Wrap-Up: Remediation Milestone & SLA Commitment',
        speaker: {
          id: 'vikramaditya-singhania',
          name: 'Vikramaditya Singhania',
          role: 'VP of Technology (Apex Global)',
          avatar: 'VS',
          color: 'from-purple-700 to-pink-700',
        },
        speakerPrompt:
          'Alright. We have an agreed path forward. Rutwik, I want your personal commitment: when will the staging validation for the new dual-redundant pipeline be live for my integration engineers to stress-test?',
        slideContext: {
          title: 'Remediation Roadmap Deliverables',
          subtitle: 'Apex Global High-Reliability SLA Commitment',
          bullets: [
            'Deliverable 1: Forensic RCA document by 17:00 IST',
            'Deliverable 2: Dual-redundant pipeline staging deployment',
            'Deliverable 3: Live failover chaos-engineering test with Apex technical leads',
          ],
          tag: 'EXAIUTIVE COMMITMENT',
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Non-Committal: As soon as the sprint schedule allows',
            dialogue:
              'We will get it to you as soon as our sprint velocity allows, hopefully in a week or two depending on team workload.',
            rationale:
              'Treats an enterprise VP like a generic queue ticket.',
            immediateReaction:
              'Vikramaditya sighs in exasperation: "A week or two? I have live trading markets running every 8 hours."',
            speakerReactionId: 'vikramaditya-singhania',
            reactionEmotion: 'demanding',
            reputationImpact: {
              managerTrustDelta: -3,
              teamTrustDelta: -1,
              customerTrustDelta: -4,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'vikramaditya-singhania': { trustDelta: -5, respectDelta: -5, rapportDelta: -3, reason: 'Disappointed by lack of urgency on multi-million dollar trading line' },
              'sneha-rao': { trustDelta: -3, respectDelta: -3, rapportDelta: -1, reason: 'Expected urgency during high-profile customer closeout' },
            },
            performanceEvaluation: {
              leadershipDelta: -4,
              ownershipDelta: -4,
              communicationDelta: -3,
              problemSolvingDelta: -2,
              summary: 'Failed to demonstrate urgency when closing high-stakes executive customer review.',
            },
            consequenceToast: 'Passive response: Vikramaditya was dissatisfied with the non-committal answer.',
          },
          assertive: {
            style: 'assertive',
            label: 'Concrete Milestones: Staging sandbox live by Friday 11:00 AM IST with stress harness',
            dialogue:
              'You have my personal word, Mr. Singhania. The staging sandbox with simulated 50,000 packet/sec load will be live for your team this Friday at 11:00 AM IST. I will email the API endpoints and Grafana observability links directly to Sangeeta. We will prove four-nines stability in writing.',
            rationale:
              'Direct, executive-grade commitment with specific dates, times, and delivery channels.',
            immediateReaction:
              'Vikramaditya offers a rare smile and nods: "Friday 11 AM IST. You have a deal, Rutwik. Thank you for stepping up."',
            speakerReactionId: 'vikramaditya-singhania',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 7,
              teamTrustDelta: 4,
              customerTrustDelta: 8,
              hrReputationDelta: 3,
            },
            relationshipImpact: {
              'vikramaditya-singhania': { trustDelta: 9, respectDelta: 9, rapportDelta: 7, reason: 'Gained tremendous trust through rock-solid executive commitment' },
              'sneha-rao': { trustDelta: 7, respectDelta: 8, rapportDelta: 5, reason: 'Immensely proud of engineer commanding the room and closing on high note' },
            },
            performanceEvaluation: {
              leadershipDelta: 10,
              ownershipDelta: 10,
              communicationDelta: 9,
              problemSolvingDelta: 8,
              summary: 'Closed enterprise customer escalation with flawless executive accountability, locking in Friday 11 AM deliverable.',
            },
            consequenceToast: 'Assertive response: Standing ovation from Sneha! Vikramaditya Singhania became a key champion.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Joint Pilot Sync: Propose co-testing on Thursday with Sangeeta’s team',
            dialogue:
              'Let’s do it jointly on Thursday afternoon at 3 PM IST. Deepak and I will host an open Webex bridge with Sangeeta and your trading engineers. We will inject synthetic network drops in real-time so your team verifies zero packet loss firsthand. Ananya will send the calendar placeholder right after this call.',
            rationale:
              'Invites the customer’s technical team into the kitchen to build shared trust through live joint chaos testing.',
            immediateReaction:
              'Vikramaditya smiles warmly: "A joint chaos test on Thursday—that is brilliant. Sangeeta will be thrilled. Meeting adjourned on a very positive note."',
            speakerReactionId: 'vikramaditya-singhania',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 7,
              customerTrustDelta: 9,
              hrReputationDelta: 4,
            },
            relationshipImpact: {
              'vikramaditya-singhania': { trustDelta: 10, respectDelta: 8, rapportDelta: 9, reason: 'Felt total partnership transparency through joint live chaos testing' },
              'sneha-rao': { trustDelta: 7, respectDelta: 7, rapportDelta: 7, reason: 'Pleased by the seamless alignment between engineering and customer success' },
              'ananya-iyer': { trustDelta: 8, respectDelta: 7, rapportDelta: 9, reason: 'Delighted to anchor customer relationship with concrete joint milestone' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 8,
              communicationDelta: 10,
              problemSolvingDelta: 9,
              summary: 'Pioneered joint live chaos testing session with client engineering team, cementing enterprise customer loyalty.',
            },
            consequenceToast: 'Collaborative response: Highest customer rating achieved! Joint test scheduled.',
          },
        },
      },
    ],
  },

  // 4. Weekly 1:1 Manager Sync with Sneha Rao (04:30 PM)
  {
    id: 'meeting-manager-1on1',
    calendarEventId: 'cal-manager-1on1-1630',
    title: 'Weekly 1:1 Manager Sync with Sneha',
    type: 'one-on-one',
    hour: 16,
    minute: 30,
    timeString: '04:30 PM',
    durationMinutes: 30,
    channelId: 'direct-sneha',
    location: 'Sneha’s Office • Room 418 (or Private 1:1 Video Bridge)',
    organizer: {
      id: 'sneha-rao',
      name: 'Sneha Rao',
      role: 'Engineering Manager',
    },
    attendees: [
      {
        id: 'sneha-rao',
        name: 'Sneha Rao',
        role: 'Engineering Manager',
        avatar: 'SR',
        color: 'from-amber-600 to-rose-600',
        department: 'Cloud Platform & Infrastructure',
      },
    ],
    description: 'Weekly direct manager check-in covering probation milestones, workload balance, peer feedback, and career growth roadmap.',
    agendaRounds: [
      {
        roundNumber: 1,
        phaseTitle: 'Probation Progress & Workload Sentiment',
        speaker: {
          id: 'sneha-rao',
          name: 'Sneha Rao',
          role: 'Engineering Manager',
          avatar: 'SR',
          color: 'from-amber-600 to-rose-600',
        },
        speakerPrompt:
          'Close the door and take a seat, Rutwik. We do these 1:1s weekly so there are never any surprises when your 6-month probation review arrives. How are you honestly feeling about the technical pace here at Nexora, and is the workload sustainable?',
        slideContext: {
          title: 'Employee Career & Probation Scorecard',
          subtitle: 'Employee: Rutwik Unhale • Role: Core Engineering',
          bullets: [
            'Probation Period: Month 1 of 6',
            'Completed Sprint Deliverables: 94% on-time milestone delivery',
            'Cross-functional peer feedback: Positive collaboration with Ananya and Deepak',
          ],
          tag: '1:1 APPRAISAL',
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Compliant & Guarded: Everything is fine, no complaints at all',
            dialogue:
              'Everything is great, Sneha. No issues at all. The workload is fine, and I just try to do whatever tasks are assigned to me on Jira without making any noise.',
            rationale:
              'Plays it safe to avoid showing any sign of weakness or fatigue.',
            immediateReaction:
              'Sneha leans back and smiles wryly: "Rutwik, this is a 1:1, not a corporate press release. I need real signals, not scripted perfection."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'neutral',
            reputationImpact: {
              managerTrustDelta: 0,
              teamTrustDelta: 0,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 0, respectDelta: -1, rapportDelta: -1, reason: 'Wished for authentic dialogue rather than safe corporate platitudes' },
            },
            performanceEvaluation: {
              leadershipDelta: -1,
              ownershipDelta: 0,
              communicationDelta: -1,
              problemSolvingDelta: 0,
              summary: 'Gave guarded, generic answers during 1:1 manager sync; missed chance to share strategic perspective.',
            },
            consequenceToast: 'Passive response: Sneha noticed you were putting up a corporate guard.',
          },
          assertive: {
            style: 'assertive',
            label: 'Honest Strategic Assessment: High pace is energizing, but context-switching hurts deep work',
            dialogue:
              'I am loving the technical complexity, Sneha, but I want to give you an honest operational insight: the constant ad-hoc Slack pings and unexpected mid-sprint SEV-2 triage tickets are costing our team about 30% of deep focus time. If we could institute quiet engineering focus blocks on Tuesday and Thursday mornings, our PR velocity would increase noticeably.',
            rationale:
              'Honest, constructive, doesn’t complain without offering a systemic workplace solution.',
            immediateReaction:
              'Sneha leans forward and jots notes: "That is sharp. In fact, Deepak mentioned something similar yesterday. Let’s pilot focus blocks next sprint."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 4,
              customerTrustDelta: 1,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 7, respectDelta: 8, rapportDelta: 5, reason: 'Loved the candid, constructive feedback on team focus time' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 8,
              communicationDelta: 8,
              problemSolvingDelta: 8,
              summary: 'Provided mature managerial feedback on context-switching and proposed team focus blocks.',
            },
            consequenceToast: 'Assertive response: Sneha loved your initiative! Focus blocks will be piloted.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Vulnerable & Growth-Oriented: Discussing growth areas & mentorship synergy with Deepak',
            dialogue:
              'The technical pace is high, but working alongside Deepak and Ananya has been an incredible accelerator for my growth. I am confident in backend distributed systems, but I want to sharpen my architectural RFC writing and client communication skills. Could we set a development goal where Deepak reviews my system designs and Ananya shadows me on client syncs?',
            rationale:
              'Shows emotional maturity, self-awareness of strengths and growth edges, and values peer mentorship.',
            immediateReaction:
              'Sneha smiles warmly: "I love that self-awareness, Rutwik. That’s how engineers fast-track to Senior level here. I will formalize that in your development plan."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 5,
              customerTrustDelta: 2,
              hrReputationDelta: 4,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 8, respectDelta: 7, rapportDelta: 8, reason: 'Extremely impressed by self-awareness and structured career development proposal' },
            },
            performanceEvaluation: {
              leadershipDelta: 7,
              ownershipDelta: 8,
              communicationDelta: 9,
              problemSolvingDelta: 7,
              summary: 'Exhibited exceptional emotional intelligence and proactive personal career development planning.',
            },
            consequenceToast: 'Collaborative response: Sneha added mentorship goals to fast-track your promotion!',
          },
        },
      },
      {
        roundNumber: 2,
        phaseTitle: 'Peer Dynamics & Cross-Functional Feedback',
        speaker: {
          id: 'sneha-rao',
          name: 'Sneha Rao',
          role: 'Engineering Manager',
          avatar: 'SR',
          color: 'from-amber-600 to-rose-600',
        },
        speakerPrompt:
          'Between us, Ananya mentioned that during the client roadmap meeting yesterday, the Product team felt engineering was being a bit dismissive of their delivery deadlines. How do you view our collaboration with Product and Business Analysis right now?',
        slideContext: {
          title: '360° Peer Feedback Synthesis',
          subtitle: 'Engineering & Product Cross-Functional Alignment',
          bullets: [
            'Product sentiment: Engineering pushback on Q3 feature commitments',
            'Engineering sentiment: Scope creep without formal sprint story estimation',
            'Manager goal: Foster healthy cross-functional empathy without burning engineering',
          ],
          tag: '360° REVIEW',
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Neutral Bypass: I try to stay out of Product versus Engineering politics',
            dialogue:
              'I try not to get involved in any of the tension between Product and Engineering. I just keep my head down and work on whatever code tickets appear in my sprint backlog.',
            rationale:
              'Refuses to take a position to avoid taking heat.',
            immediateReaction:
              'Sneha notes: "Keeping your head down is safe, but as you grow here, bridging functional silos is what defines senior talent."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'neutral',
            reputationImpact: {
              managerTrustDelta: -1,
              teamTrustDelta: 0,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: -1, respectDelta: -2, rapportDelta: 0, reason: 'Wished for broader organizational empathy rather than siloed head-down attitude' },
            },
            performanceEvaluation: {
              leadershipDelta: -2,
              ownershipDelta: -1,
              communicationDelta: -1,
              problemSolvingDelta: -1,
              summary: 'Maintained siloed engineering view; opted not to engage in cross-functional alignment.',
            },
            consequenceToast: 'Passive response: Sneha advised that senior roles require bridging silos.',
          },
          assertive: {
            style: 'assertive',
            label: 'Enforce Scope Discipline: Product cannot keep adding scope without bumping deadlines',
            dialogue:
              'Sneha, I respect Ananya tremendously, but the problem is simple: Product commits features to clients before engineering provides story point estimates. When we push back, it isn’t hostility—it’s protecting production stability. If Product wants feature X, they must formally agree to de-scope feature Y. We need you to back us up on that discipline.',
            rationale:
              'Firm, principled, protects team from burnout, and demands managerial air cover.',
            immediateReaction:
              'Sneha nods firmly: "You’re right. I need to hold that boundary with the Product Directors. I appreciate you saying it plainly."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 6,
              teamTrustDelta: 5,
              customerTrustDelta: 0,
              hrReputationDelta: 2,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 7, respectDelta: 8, rapportDelta: 4, reason: 'Valued courageous engineering boundary enforcement' },
              'deepak-joshi': { trustDelta: 4, respectDelta: 5, rapportDelta: 3, reason: 'Pleased to have peer reinforce sprint scope discipline' },
            },
            performanceEvaluation: {
              leadershipDelta: 8,
              ownershipDelta: 8,
              communicationDelta: 7,
              problemSolvingDelta: 7,
              summary: 'Assertively advocated for sprint discipline and scope trade-off governance.',
            },
            consequenceToast: 'Assertive response: Sneha committed to defending engineering scope with Product leaders.',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Co-Creation Session: Propose weekly 30-min pre-grooming with Ananya',
            dialogue:
              'I understand where Ananya is coming from—she is under immense pressure from enterprise clients. The friction happens because we only review stories at sprint planning when it’s already too late. What if Ananya and I do a quick 30-minute informal coffee sync every Tuesday to co-refine user stories before sprint grooming? That way Product gets technical reality early, and Engineering isn’t blindsided.',
            rationale:
              'High empathy, builds direct bridge with business counterpart, and dissolves political friction with collaborative routine.',
            immediateReaction:
              'Sneha’s face brightens: "That is pure gold, Rutwik. Ananya will love that, and it removes so much friction before it starts. Please do that."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 7,
              teamTrustDelta: 8,
              customerTrustDelta: 3,
              hrReputationDelta: 4,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 8, respectDelta: 7, rapportDelta: 8, reason: 'Extremely impressed by empathetic cross-functional diplomacy' },
              'ananya-iyer': { trustDelta: 9, respectDelta: 7, rapportDelta: 10, reason: 'Delighted by proactive coffee grooming partnership' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 8,
              communicationDelta: 10,
              problemSolvingDelta: 9,
              summary: 'Exemplified cross-functional leadership by initiating pre-grooming synergy with Senior Business Analyst.',
            },
            consequenceToast: 'Collaborative response: Sneha marked you as having standout emotional intelligence & leadership!',
          },
        },
      },
      {
        roundNumber: 3,
        phaseTitle: 'Career Ambitions & Next Promotion Cycle',
        speaker: {
          id: 'sneha-rao',
          name: 'Sneha Rao',
          role: 'Engineering Manager',
          avatar: 'SR',
          color: 'from-amber-600 to-rose-600',
        },
        speakerPrompt:
          'To wrap up: when your probation converts at Month 6, we open up annual appraisal calibrations. Where do you want to be heading? Are you aiming for technical depth along the Staff Architect path, or do you want to start mentoring and moving toward Team Lead?',
        slideContext: {
          title: 'Engineering Career Ladder & Appraisal Tracks',
          subtitle: 'Nexora Global Career Framework',
          bullets: [
            'Individual Contributor Track: Senior Engineer -> Staff Engineer -> Principal Architect',
            'Leadership Track: Senior Engineer -> Tech Lead -> Engineering Manager',
            'Next calibration cycle: Month 6 Performance Appraisal & Compensation Review',
          ],
          tag: 'CAREER PATHWAY',
        },
        options: {
          passive: {
            style: 'passive',
            label: 'Modest Deferral: I am happy with whatever the company thinks is best for me',
            dialogue:
              'I am really happy just learning the ropes right now. Whatever path you and HR think suits me best when the time comes, I will gladly follow.',
            rationale:
              'Displays modesty, but signals a lack of clear ambition or career vision.',
            immediateReaction:
              'Sneha smiles gently: "Take ownership of your own trajectory, Rutwik. Those who know what they want get sponsored faster."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'neutral',
            reputationImpact: {
              managerTrustDelta: 0,
              teamTrustDelta: 0,
              customerTrustDelta: 0,
              hrReputationDelta: 0,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 0, respectDelta: -1, rapportDelta: 0, reason: 'Wished for bolder self-advocacy and career ambition' },
            },
            performanceEvaluation: {
              leadershipDelta: -1,
              ownershipDelta: -1,
              communicationDelta: 0,
              problemSolvingDelta: 0,
              summary: 'Showed passivity regarding career roadmap; deferred promotion direction entirely to management.',
            },
            consequenceToast: 'Passive response: Sneha advised you to advocate more boldly for your ambitions.',
          },
          assertive: {
            style: 'assertive',
            label: 'Targeted Senior Technical Trajectory: Clear goal to lead core telemetry architecture',
            dialogue:
              'My goal is clear, Sneha: I want to own the core telemetry and SCADA distributed ingestion architecture. By Month 6, I want to lead our migration to zero-copy Protobuf pipelines, mentor incoming associate engineers, and demonstrate the business impact required for a Senior Engineer promotion band and top-tier appraisal rating.',
            rationale:
              'Unapologetically ambitious, backed by tangible technical milestones that benefit the company.',
            immediateReaction:
              'Sneha smiles with genuine satisfaction: "I love clear ambitions. If you hit those metrics, I will fight for your Senior title at calibration."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'impressed',
            reputationImpact: {
              managerTrustDelta: 7,
              teamTrustDelta: 4,
              customerTrustDelta: 2,
              hrReputationDelta: 3,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 8, respectDelta: 9, rapportDelta: 6, reason: 'Loved the unambiguous ambition, concrete metrics, and drive for Senior promotion' },
            },
            performanceEvaluation: {
              leadershipDelta: 9,
              ownershipDelta: 10,
              communicationDelta: 9,
              problemSolvingDelta: 8,
              summary: 'Articulated crisp, compelling career vision targeting Senior promotion through measurable architecture deliverables.',
            },
            consequenceToast: 'Assertive response: Sneha agreed to sponsor your Senior promotion at calibration!',
          },
          collaborative: {
            style: 'collaborative',
            label: 'Dual Impact Track: Anchor technical excellence while developing team culture',
            dialogue:
              'I see my best impact at the intersection: delivering high-scale technical architecture while helping cultivate a psychologically safe, high-ownership team culture. Over the next two quarters, I want to co-author our engineering best practices guide with Deepak and run our weekly brown-bag knowledge shares. That prepares me to step up as Tech Lead when the team expands.',
            rationale:
              'Balances technical mastery with multiplier effects on team culture and developer enablement.',
            immediateReaction:
              'Sneha stands up and shakes your hand: "That is the mark of a true future leader at Nexora. Let’s make that happen."',
            speakerReactionId: 'sneha-rao',
            reactionEmotion: 'happy',
            reputationImpact: {
              managerTrustDelta: 8,
              teamTrustDelta: 7,
              customerTrustDelta: 2,
              hrReputationDelta: 5,
            },
            relationshipImpact: {
              'sneha-rao': { trustDelta: 9, respectDelta: 8, rapportDelta: 9, reason: 'Excited by multiplier vision combining architecture with team knowledge sharing' },
            },
            performanceEvaluation: {
              leadershipDelta: 10,
              ownershipDelta: 9,
              communicationDelta: 10,
              problemSolvingDelta: 9,
              summary: 'Outstanding holistic leadership vision: combining technical architecture with team enablement and brown-bag knowledge shares.',
            },
            consequenceToast: 'Collaborative response: Sneha marked you as top-tier talent for the Tech Lead track!',
          },
        },
      },
    ],
  },
];
