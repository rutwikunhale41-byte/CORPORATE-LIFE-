import { universalAiEngine } from './universalAiEngine';

export interface ChatRequestPayload {
  channel: any;
  activeCharacters: any[];
  conversationHistory: any[];
  playerMessage: string;
  player: any;
  reputation: any;
  memories: any[];
  currentTime: { day: number; hour: number; minute: number };
  difficulty: string;
  activeIncident?: any;
  tasks?: any[];
}

export interface ChatResponsePayload {
  replies: Array<{
    characterId: string;
    characterName: string;
    text: string;
    emotion?: string;
    intent?: string;
    followUpQuestion?: string | null;
  }>;
  conversationState?: {
    topic?: string;
    subtopic?: string;
    unresolvedQuestions?: string[];
    activePromises?: string[];
    conversationStatus?: string;
  };
  playerAnalysis?: {
    intent?: string;
    emotion?: string;
    action?: string;
    isQuestion?: boolean;
    committedAction?: string | null;
    riskLevel?: string;
  };
  taskActions?: Array<{
    action: 'CREATE' | 'UPDATE' | 'COMPLETE';
    taskId: string;
    title?: string;
    deadlineHour?: string;
    assignedToPlayer?: boolean;
  }>;
  relationshipChanges?: Record<string, { trustDelta: number; respectDelta: number; rapportDelta?: number; reason?: string }>;
  reputationChanges?: {
    managerTrustDelta?: number;
    teamTrustDelta?: number;
    customerTrustDelta?: number;
    hrReputationDelta?: number;
  };
  performanceEffect?: {
    scoreDelta: number;
    reason: string;
  };
  hiddenEvaluation?: {
    professionalism: number;
    ownership: number;
    problemSolving: number;
    communication: number;
    emotionalIntelligence: number;
    technicalJudgment: number;
    integrity: number;
    confidence: number;
    summary: string;
  };
  newMemories?: Array<{
    type: 'PROMISE' | 'MISTAKE' | 'ACHIEVEMENT' | 'CONFLICT' | 'DEADLINE' | 'DECISION';
    summary: string;
    involvedCharacters: string[];
  }>;
}

// Helper to sanitize and clean JSON code block outputs from LFM2.5 local model
function cleanJsonOutput(text: string): any {
  let cleaned = (text || '').trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  } else {
    const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) {
      cleaned = jsonMatch[1].trim();
    }
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse raw LFM model JSON:", text);
    throw new Error(`Invalid local model JSON format. Raw output received: ${text.slice(0, 100)}`);
  }
}

export async function checkServerStatus() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', localAiConnected: false };
  }
}

/**
 * 1. GAME CONVERSATIONS DIRECT IN-BROWSER PIPELINE
 */
export async function sendChatMessage(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
  const { channel, activeCharacters, conversationHistory, playerMessage, player, reputation, memories, currentTime, difficulty, activeIncident, tasks } = payload;

  const characterContext = (activeCharacters || [])
    .map(
      (c: any) =>
        `Character: ${c.name} (ID: ${c.id}, Role: ${c.role}, Dept: ${c.department}, Age: ${c.age || 30})
Personality: ${c.personality}
Speaking Style: ${c.communicationStyle}
Current Mood: ${c.currentMood || 'neutral'}
Current Trust with Player: ${c.trust || 50}/100, Respect: ${c.respect || 50}/100, Rapport: ${c.rapport || 50}/100
Personal Quirks: ${c.quirks || 'Professional'}
Private Memories regarding Player: ${(c.individualMemories || []).slice(-4).join('; ') || 'None yet'}`
    )
    .join('\n\n');

  const memorySummary =
    memories && memories.length > 0
      ? memories
          .slice(-12)
          .map((m: any) => `[Day ${m.day} - ${m.type}]: ${m.summary} (Involved: ${m.involvedCharacters?.join(', ') || 'Team'})`)
          .join('\n')
      : 'No major previous incidents or promises recorded yet.';

  const incidentContext = activeIncident && activeIncident.active
    ? `ALERT: THERE IS AN ACTIVE PRODUCTION INCIDENT!
Severity: ${activeIncident.severity}
Title: ${activeIncident.title}
SLA Remaining: ${activeIncident.slaMinutesRemaining} mins
Customer Escalation: Level ${activeIncident.customerEscalationLevel || 1}`
    : 'Normal operations. No active SEV outage.';

  const tasksContext = tasks && tasks.length > 0
    ? tasks
        .map((t: any) => `[${t.id}] ${t.title} (Status: ${t.status}, Priority: ${t.priority}, Deadline: Day ${t.deadlineDay} at ${t.deadlineHour})`)
        .join('\n')
    : 'No specific sprint tasks assigned yet.';

  const systemInstruction = `You are the Game Master and Character Engine for "CORPORATE LIFE AI — MNC SIMULATOR" at Nexora Global (a tier-1 global tech MNC).
You control all non-player characters participating in this conversation.

CRITICAL ADVANCED CONVERSATION RULES:
1. NEVER GIVE A SCRIPTED OR GENERIC ONE-OFF REPLY. Every response must be a living, multi-turn human conversation.
2. ANALYZE THE EXACT PLAYER MESSAGE:
   - What is the player's true intent?
   - What emotion are they expressing?
   - Are they asking a question? If so, ANSWER IT DIRECTLY and realistically based on the character's role and corporate knowledge.
   - Did they report a finding, status, or problem? If so, DO NOT just say "Okay keep me updated". ASK A SPECIFIC, LOGICAL FOLLOW-UP QUESTION!
   - Did they make a promise or commitment? Hold them to it, acknowledge the specific deadline, and record a MEMORY.
   - Did they give an excuse or deflect blame? Call it out appropriately based on character personality (Sarah dislikes excuses, Daniel dislikes hand-holding).
3. SHORT-TERM & LONG-TERM MEMORY:
   - Remember what was just said in recent messages. Never ask a question the player already answered 2 turns ago.
   - Reference previous promises, past mistakes, or praise naturally.
4. PERSONALITY & COMMUNICATION STYLE CALIBRATION:
   - Emily Carter (Colleague / BA): Casual, warm, empathetic, uses occasional emojis (😂, 😭, 👍), relatable workplace humor, chats about lunch/coffee, vents about workload, talks like an actual 27-year-old coworker.
   - Sarah Williams (Manager): Demanding, sharp, fair, professional, rewards ownership, follows up on commitments, expects clear ETAs and technical clarity.
   - Daniel Thomas (Tech Lead): Analytical, pragmatic, asks probing technical questions (e.g. Modbus RTU/TCP, RS485 daisy-chain termination, Kafka partition lag, DB connection pool deadlock, Docker/Kubernetes health), dislikes spoon-feeding.
   - Michael Anderson (Enterprise Client): Formal, executive, business-impact focused, impatient when client systems suffer lag, demands SLA guarantees.
   - Priya Sharma (HR BP): Professional, empathetic, supportive, focused on policy, probation milestones, team ethics.
5. GROUP CHAT PARTICIPATION LOGIC:
   - In group channels (#general, #automation-team, #core-eng-standup, #incident-sev1-war-room, #watercooler-social), NOT all characters should reply!
   - Pick 1 or 2 characters who have the greatest stake in the message to reply in turn.
   - Characters can speak to each other as well as to the player.
6. NO ROBOTIC CANNED PHRASES:
   - NEVER say: "That's a great point!", "I completely understand", "Thank you for letting me know", "Keep me posted", "Absolutely!".
   - Speak naturally like a real human sitting in an MNC office.
7. MATCH LENGTH: Normal chat: 1-3 sentences. Technical/troubleshooting: 2-5 sentences.

Return strictly valid JSON conforming to the schema.`;

  const prompt = `Conversation Context:
Channel: ${channel.name} (Type: ${channel.type})
Current Channel Topic: ${channel.topic || 'General workplace discussion'}
Current Subtopic: ${channel.subtopic || 'None'}
Unresolved Questions in Thread: ${(channel.unresolvedQuestions || []).join('; ') || 'None'}
Active Promises in Thread: ${(channel.activePromises || []).join('; ') || 'None'}
Simulated Date/Time: Day ${currentTime.day}, ${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}
Difficulty: ${difficulty || 'Normal'}
Player: ${player.name} (Title: ${player.title}, Level: ${player.level}, Dept: ${player.department}, Company: ${player.company || 'Nexora Global'})
Reputation: Manager Trust: ${reputation.managerTrust}/100, Team Trust: ${reputation.teamTrust}/100, Customer Trust: ${reputation.customerTrust}/100, HR: ${reputation.hrReputation}/100

Active Sprint Tasks:
${tasksContext}

Incident State:
${incidentContext}

Known Memories:
${memorySummary}

Active Participants in Room:
${characterContext}

Recent Conversation History (Past 30 Messages):
${(conversationHistory || [])
  .slice(-30)
  .map((m: any) => `${m.senderName}: "${m.text}"`)
  .join('\n')}

Player just said:
"${playerMessage}"

Analyze the player's message and generate natural, contextual continuation replies.
Return JSON with this exact schema:
{
  "replies": [
    {
      "characterId": "character-id",
      "characterName": "Full Name",
      "text": "Natural human response (1-4 sentences) addressing the player's exact message, asking a specific follow-up question or giving a direct answer.",
      "emotion": "happy" | "neutral" | "curious" | "confused" | "concerned" | "impatient" | "frustrated" | "impressed" | "disappointed" | "excited" | "nervous" | "angry" | "relieved" | "supportive",
      "intent": "What the character is trying to accomplish",
      "followUpQuestion": "Specific follow-up question if character asked one, or null"
    }
  ],
  "conversationState": {
    "topic": "Current updated topic",
    "subtopic": "Specific technical or business subtopic",
    "unresolvedQuestions": ["Array of pending questions that still need answers"],
    "activePromises": ["Array of promises made with time/ETA"],
    "conversationStatus": "active" | "resolving" | "escalated"
  },
  "playerAnalysis": {
    "intent": "What player was trying to achieve",
    "emotion": "Player's perceived tone",
    "action": "question | promise | excuse | technical_update | agreement | complaint | casual_banter",
    "isQuestion": boolean,
    "committedAction": "string description of commitment or null",
    "riskLevel": "low" | "medium" | "high"
  },
  "taskActions": [
    {
      "action": "CREATE" | "UPDATE" | "COMPLETE",
      "taskId": "e.g. TASK-101",
      "title": "Task title if created",
      "deadlineHour": "e.g. 16:00",
      "assignedToPlayer": boolean
    }
  ],
  "relationshipChanges": {
    "characterId": {
      "trustDelta": number,
      "respectDelta": number,
      "rapportDelta": number,
      "reason": "Short reason"
    }
  },
  "reputationChanges": {
    "managerTrustDelta": number,
    "teamTrustDelta": number,
    "customerTrustDelta": number,
    "hrReputationDelta": number
  },
  "performanceEffect": {
    "scoreDelta": number,
    "reason": "Short reason"
  },
  "hiddenEvaluation": {
    "professionalism": number,
    "ownership": number,
    "problemSolving": number,
    "communication": number,
    "emotionalIntelligence": number,
    "technicalJudgment": number,
    "integrity": number,
    "confidence": number,
    "summary": "1 sentence evaluation"
  },
  "newMemories": [
    {
      "type": "PROMISE" | "MISTAKE" | "ACHIEVEMENT" | "CONFLICT" | "DEADLINE" | "DECISION",
      "summary": "Specific fact to remember",
      "involvedCharacters": ["Character Name"]
    }
  ]
}`;

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.7,
    max_tokens: 500,
  });
  return cleanJsonOutput(res.content);
}

/**
 * 2. EMAIL EVALUATION DIRECT IN-BROWSER PIPELINE
 */
export async function evaluateEmailReply(payload: {
  email: any;
  playerReplyText: string;
  player: any;
  reputation: any;
  senderCharacter: any;
  memories: any[];
}): Promise<any> {
  const { email, playerReplyText, player, senderCharacter } = payload;

  const prompt = `You are evaluating an employee's email response in a multinational corporation.
Sender of incoming email: ${senderCharacter?.name || 'Manager'} (${senderCharacter?.role || 'Engineering Lead'}, Dept: ${senderCharacter?.department || 'Engineering'})
Original Subject: ${email?.subject || 'Update'}
Original Email Body:
"${email?.body || ''}"

Player Name: ${player?.name || 'Rutwik'} (${player?.title || 'Engineer'}, Department: ${player?.department || 'Engineering'})
Player's Email Draft:
"${playerReplyText || ''}"

Evaluate the professional email. Does it address the questions? Is the tone appropriate (not overly defensive, not sloppy)?
Return a JSON object:
{
  "replyEmail": {
    "fromName": "${senderCharacter?.name || 'Manager'}",
    "subject": "Re: ${email?.subject || 'Update'}",
    "body": "Realistic written email response following up on player's email.",
    "requiresFurtherAction": boolean
  },
  "scores": {
    "professionalism": number,
    "clarity": number,
    "ownership": number,
    "tone": "Formal" | "Defensive" | "Proactive" | "Casual" | "Vague"
  },
  "trustDelta": number,
  "managerTrustDelta": number,
  "feedback": "Concise feedback on the email communication",
  "newMemory": "Summary of any commitment made in this email"
}`;

  const systemInstruction = 'You are a professional Email Evaluation Engine in a multinational corporation. Evaluate the player\'s email draft and generate realistic follow-up and scores.';

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.5,
    max_tokens: 450,
  });
  return cleanJsonOutput(res.content);
}

/**
 * 3. MONTHLY APPRAISAL DIRECT IN-BROWSER PIPELINE
 */
export async function generateMonthlyReview(payload: {
  player: any;
  reputation: any;
  memories: any[];
  tasksCompleted: number;
  tasksFailed: number;
  monthNumber: number;
  evaluations: any[];
}): Promise<any> {
  const { player, reputation, memories, tasksCompleted, tasksFailed, monthNumber } = payload;

  const prompt = `Generate a realistic 360-degree Monthly Performance Review for an employee at Nexora Global MNC.
Employee: ${player.name} (${player.title}, Level ${player.level}, Department: ${player.department})
Current Salary: ₹${player.salary?.toLocaleString()}/yr
Tasks Finished: ${tasksCompleted}, Missed/Escalated: ${tasksFailed}
Manager Trust: ${reputation.managerTrust}/100, Team Trust: ${reputation.teamTrust}/100, Customer Trust: ${reputation.customerTrust}/100, HR: ${reputation.hrReputation}/100
Review Month: Month ${monthNumber}

Recent Notable Memories and Incidents:
${(memories || []).slice(-10).map((m: any) => `- [${m.type}]: ${m.summary}`).join('\n')}

Recent Average Evaluation Scores:
Professionalism: ${reputation.professionalReputation || 70}/100

Generate a structured review JSON:
{
  "overallRating": number,
  "strengths": ["string", "string", "string"],
  "areasToImprove": ["string", "string"],
  "managerComment": "Direct, fair evaluation written by Engineering Manager Sarah Williams.",
  "hrComment": "Observational assessment by HR Business Partner Priya Sharma.",
  "careerRecommendation": "Fast-Track Promotion" | "High Potential" | "Solid Contributor" | "Needs Improvement" | "Performance Improvement Plan (PIP)",
  "salaryIncrementOffered": number,
  "promoted": boolean,
  "newLevel": number,
  "newTitle": "string"
}`;

  const systemInstruction = 'You are a professional HR and Managerial Appraisal System at a global technology MNC.';

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.5,
    max_tokens: 500,
  });
  return cleanJsonOutput(res.content);
}

/**
 * 4. SALARY INCREASE DIRECT IN-BROWSER PIPELINE
 */
export async function negotiateSalary(payload: {
  player: any;
  playerArgument: string;
  reputation: any;
  currentSalary: number;
  requestedSalary: number;
}): Promise<any> {
  const { player, playerArgument, reputation, currentSalary, requestedSalary } = payload;

  const prompt = `You are Senior Manager Sneha Rao negotiating a salary increase with your report ${player.name} (${player.title}).
Current Salary: ₹${currentSalary.toLocaleString()}/yr
Requested Salary: ₹${requestedSalary.toLocaleString()}/yr
Candidate Justification: "${playerArgument}"
Manager Trust: ${reputation.managerTrust}/100, Respect: ${reputation.teamTrust}/100

Return JSON:
{
  "status": "ACCEPTED" | "COUNTERED" | "HELD_FIRM",
  "agreedSalary": number,
  "speakerName": "Sneha Rao (Manager)",
  "dialogue": "Written in-character dialogue explaining decision.",
  "trustDelta": number
}`;

  const systemInstruction = 'You are a professional manager negotiating a salary revision with your team member.';

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.6,
    max_tokens: 350,
  });
  return cleanJsonOutput(res.content);
}

/**
 * 5. CORPORATE NEWS (DUMMY LOCAL PARSING OF GENERAL SYSTEM CONTEXT)
 */
export async function fetchCorporateNews(payload: {
  category?: string;
  currentDay?: number;
  playerTitle?: string;
}) {
  // Simple payload reflection to avoid calling server backend local ports
  try {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  return {
    news: [
      {
        id: `news-fallback-1`,
        headline: 'Global Security Governance audits Telemetry Privacy Enclaves',
        summary: 'MNC organizations enforce end-to-end token scrubbing policies for all microservices in the telemetry workspace.',
        category: 'Cybersecurity',
        relevanceToNexora: 'Directly impacts our active Standup sprint targets.',
        sourceName: 'Enterprise Security Gazette',
        sourceUrl: 'https://news.google.com',
        publishedTime: `Day ${payload.currentDay || 1} • Market Pulse`,
        actions: [
          {
            id: 'act-fall-1',
            label: 'Review System Credentials For Telemetry Sprint',
            description: 'Check environment parameters for credentials to meet strict compliance guidelines.',
            reputationImpact: { managerTrustDelta: 3, professionalReputationDelta: 4 },
            xpGain: 35,
            memorySummary: 'Performed manual verification check on local code privacy boundaries.',
          }
        ]
      }
    ]
  };
}

/**
 * 6. CANDIDATE JOB INTERVIEW DIRECT IN-BROWSER PIPELINE
 */
export async function sendInterviewMessage(payload: {
  job: any;
  candidate: any;
  roundType: string;
  interviewer: any;
  conversationHistory: any[];
  playerAnswer: string;
  questionIndex: number;
  hiddenScores: any;
}): Promise<any> {
  const { job, candidate, roundType, interviewer, conversationHistory, playerAnswer, questionIndex, hiddenScores } = payload;

  const isTechnical = roundType === 'TECHNICAL_INTERVIEW';
  const isHR = roundType === 'HR_SCREEN';
  const isManager = roundType === 'MANAGER_ROUND';

  const systemInstruction = `You are ${interviewer.name}, acting as the ${interviewer.role} at ${job.company} conducting a ${roundType.replace('_', ' ')} for the position of "${job.title}".
Interviewer Personality: ${interviewer.personality || 'PROFESSIONAL'}.

REALISM RULES:
1. Speak authentically like an experienced corporate MNC interviewer. Do NOT sound like an enthusiastic sycophantic chatbot.
2. NEVER use fake filler phrases like "Great answer!", "That's fantastic!".
3. ${isTechnical ? `Ask real, domain-specific engineering questions about: ${job.skillsRequired.join(', ')}. Edge cases, troubleshooting, packet drops, or failure modes.` : ''}
4. ${isHR ? 'Focus on career motivation, past teamwork conflicts, notice periods.' : ''}
5. ${isManager ? 'Focus on ownership, handling missed deadlines, dealing with difficult clients.' : ''}
6. Total interview length is 3 to 4 questions. This is question #${(questionIndex || 0) + 1}.

Return strictly valid JSON:
{
  "replyText": "Your dialogue spoken to the candidate. Can react, challenge, or ask the next question.",
  "emotion": "neutral" | "impressed" | "skeptical" | "challenging" | "warm",
  "scoreDeltas": {
    "technicalKnowledge": number,
    "communication": number,
    "confidence": number,
    "problemSolving": number,
    "cultureFit": number
  },
  "isRoundComplete": boolean,
  "roundResult": "PASS" | "FAIL" | "IN_PROGRESS",
  "feedbackNote": "Constructive 1-sentence note."
}`;

  const historyContext = (conversationHistory || [])
    .slice(-6)
    .map((m: any) => `${m.sender}: "${m.text}"`)
    .join('\n');

  const prompt = `Interview History:
${historyContext}

Candidate (${candidate.name}) just answered:
"${playerAnswer}"

Current scores:
Technical Knowledge: ${hiddenScores?.technicalKnowledge || 70}/100
Communication: ${hiddenScores?.communication || 75}/100

Generate your interviewer response:`;

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.7,
    max_tokens: 450,
  });
  return cleanJsonOutput(res.content);
}

/**
 * 7. INTERVIEW SALARY NEGOTIATION DIRECT IN-BROWSER PIPELINE
 */
export async function negotiateInitialOffer(payload: {
  job: any;
  candidate: any;
  currentOffer: any;
  requestedSalary: number;
  playerArgument: string;
  negotiationCount: number;
}): Promise<any> {
  const { job, candidate, currentOffer, requestedSalary, playerArgument, negotiationCount } = payload;

  const prompt = `You are the Lead Talent Acquisition Partner at ${job?.company || 'our company'} negotiating an employment offer with candidate ${candidate?.name || 'the candidate'} for the position of "${job?.title || 'Engineer'}".
Initial Base Offer: ₹${(currentOffer?.baseSalary || 600000).toLocaleString()} (Max Band: ₹${(job?.maxSalary || 900000).toLocaleString()})
Candidate Requested: ₹${(requestedSalary || 700000).toLocaleString()}
Negotiation Round: #${(negotiationCount || 0) + 1}
Candidate's Justification: "${playerArgument}"

Return JSON:
{
  "status": "ACCEPTED" | "COUNTERED" | "HELD_FIRM" | "WITHDRAWN",
  "revisedSalary": number,
  "signingBonusDelta": number,
  "recruiterResponse": "Realistic reply",
  "isFinal": boolean
}`;

  const systemInstruction = 'You are a professional corporate talent acquisition recruiter negotiating salary with a candidate.';

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.6,
    max_tokens: 350,
  });
  const parsed = cleanJsonOutput(res.content);
  return {
    status: parsed.status,
    revisedOffer: {
      ...currentOffer,
      baseSalary: parsed.revisedSalary || currentOffer.baseSalary,
      signingBonus: (currentOffer.signingBonus || 0) + (parsed.signingBonusDelta || 0),
    },
    recruiterDialogue: parsed.recruiterResponse,
  };
}

/**
 * 8. STANDUP MEETING TURN DIRECT IN-BROWSER PIPELINE
 */
export async function sendMeetingTurn(payload: {
  meetingTitle: string;
  meetingType: string;
  currentSpeaker: any;
  speakerPrompt: string;
  playerChoice: 'passive' | 'assertive' | 'collaborative';
  playerDialogue: string;
  attendees: any[];
  roundNumber: number;
  player: any;
  reputation: any;
}): Promise<any> {
  const { meetingTitle, meetingType, currentSpeaker, speakerPrompt, playerChoice, playerDialogue, attendees, roundNumber, player } = payload;

  const prompt = `You are the Meeting Engine for a multinational corporation (MNC) simulation game.
Meeting: "${meetingTitle}" (Type: ${meetingType}, Round #${roundNumber})
Attendee List: ${(attendees || []).map((a: any) => `${a.name} (${a.role})`).join(', ')}
Current Speaker: ${currentSpeaker?.name || 'Manager'} (${currentSpeaker?.role || 'Lead'})
What they asked/presented:
"${speakerPrompt}"

Player: ${player?.name || 'Rutwik'}
Player's Communication Stance: "${playerChoice.toUpperCase()}"
Player's Actual Speech in Meeting: "${playerDialogue}"

Return JSON:
{
  "immediateReaction": "1-2 sentences conference room reaction.",
  "speakerFollowUp": "1-3 sentences spoken response from ${currentSpeaker?.name}.",
  "secondaryReaction": {
    "characterId": "another-attendee-id-or-null",
    "characterName": "Name or null",
    "text": "Brief reaction, or null",
    "emotion": "happy" | "neutral" | "impressed"
  },
  "reactionEmotion": "impressed" | "supportive" | "neutral",
  "consequenceToast": "Short badge summary (e.g. 'Assertive: Sarah noted technical backbone!')"
}`;

  const systemInstruction = 'You are a professional Meeting Evaluation and Reaction Engine for an enterprise corporation simulation game.';

  const res = await universalAiEngine.generateRawCompletion({
    systemInstruction,
    prompt,
    temperature: 0.7,
    max_tokens: 450,
  });
  const parsed = cleanJsonOutput(res.content);
  return {
    speakerReaction: parsed.speakerFollowUp,
    colleagueReactions: (attendees || []).map(a => {
      const isSecondary = parsed.secondaryReaction && parsed.secondaryReaction.characterId === a.id;
      return {
        characterId: a.id,
        reaction: isSecondary ? parsed.secondaryReaction.text : `${a.name} nods as the discussion continues.`,
        trustDelta: parsed.reactionEmotion === 'impressed' ? 3 : parsed.reactionEmotion === 'supportive' ? 2 : 1,
        respectDelta: parsed.reactionEmotion === 'impressed' ? 3 : 1,
      };
    }),
    consequenceToast: parsed.consequenceToast,
    immediateReaction: parsed.immediateReaction
  };
}
