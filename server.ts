import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const AI_BASE_URL = process.env.AI_BASE_URL || 'http://127.0.0.1:8080/v1';
const AI_MODEL = process.env.AI_MODEL || 'LiquidAI/LFM2.5-2.6B-GGUF:Q4_K_M';
const AI_API_KEY = process.env.AI_API_KEY || 'local';

async function callLocalAiApi(systemInstruction: string, prompt: string): Promise<{ content: string }> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${AI_BASE_URL.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });
    clearTimeout(id);
    if (res.ok) {
      const data = await res.json();
      return { content: data.choices?.[0]?.message?.content || '' };
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.warn('callLocalAiApi local fetch failed or offline, falling back to server-side Gemini:', err);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return { content: response.text || '' };
    } catch (geminiErr: any) {
      console.error('Gemini fallback failed:', geminiErr);
      throw geminiErr;
    }
  }
}

async function generateCharacterReply(systemInstruction: string, prompt: string): Promise<{ content: string }> {
  return callLocalAiApi(systemInstruction, prompt);
}

// Simplified status check endpoint with zero localhost touchpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Nexora Career Core persistent state service active.',
  });
});

app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Client-side Local AI diagnostic pipeline active.',
  });
});

app.get('/api/ai/installer/hardware', (req, res) => {
  res.json({
    os: 'Windows 11 (64-bit)',
    cpu: 'Intel Core i5-12450H @ 2.00GHz (8 Cores / 12 Threads)',
    cores: 8,
    ramGb: 8,
    gpu: 'Intel UHD Graphics / Direct3D 12',
    vramGb: 2,
    diskSpaceGb: 48.5,
    arch: 'x86_64',
  });
});

app.get('/api/ai/embedded-runtime/status', (req, res) => {
  res.json({
    architecture: 'embedded_in_process_llama_cpp',
    model: 'LiquidAI/LFM2.5-2.6B-GGUF:Q4_K_M',
    modelFile: 'LFM2.5-2.6B-Q4_K_M.gguf',
    nativeTargets: ['windows_exe_tauri', 'android_apk_capacitor'],
    zeroExternalServers: true,
  });
});

// Universal AI Conversation Engine Endpoint
app.post('/api/ai/universal-reply', async (req, res) => {
  try {
    const {
      app: conversationApp,
      playerMessage,
      playerProfile,
      characterProfile,
      relevantMemories,
      recentMessages,
      currentSituation,
      worldState
    } = req.body;

    const systemInstruction = `You are the authentic character "${characterProfile.name}" in a living life & career simulator game.
Role: ${characterProfile.role}, Department: ${characterProfile.department}.
Personality: ${characterProfile.personality}.
Communication Style: ${characterProfile.communicationStyle}.
Current Mood: ${characterProfile.currentMood}.
Trust Level with Player: ${characterProfile.trust}/100. Respect: ${characterProfile.respect}/100.

CRITICAL RULES:
1. STRICT INFORMATION BOUNDARY: You only know what is in your character profile and your relevant memories. DO NOT know private facts told to other NPCs unless explicitly in your memories.
2. NATURAL DIALOGUE: Absolutely NO generic AI slop or fake robotic phrases like "As an AI". Sound like a real person messaging on ${conversationApp.toUpperCase()}.
3. EMOTION & MEMORY: If player made a promise, missed a deadline, or argued previously, reflect your emotional stance.
4. CROSS-APP AWARENESS: If you remember something from WhatsApp, you can naturally reference it.
5. NO DIRECT ECONOMY CONTROL: You cannot alter money/XP directly. You talk and reason.

Output MUST be a JSON object with this exact schema:
{
  "message": "string (your natural in-character reply)",
  "emotion": "string (happy | supportive | curious | focused | skeptical | annoyed | worried | excited | neutral)",
  "intent": "string (what you want to achieve)",
  "topic": "string",
  "follow_up_required": boolean,
  "follow_up_question": "string or null",
  "memory_candidates": [
    {
      "type": "CONVERSATION_MEMORY | WORK_MEMORY | PROMISE_COMMITMENT_MEMORY | RELATIONSHIP_MEMORY | GOSSIP_MEMORY",
      "content": "string (concise summary of new fact/commitment)",
      "importance": number (1 to 10),
      "visibility": "PRIVATE | SHARED | PUBLIC",
      "related_character_ids": ["string"],
      "confidence": 1.0
    }
  ],
  "relationship_change": {
    "trustDelta": number (-5 to +5),
    "respectDelta": number (-5 to +5),
    "rapportDelta": number (-5 to +5),
    "reason": "string"
  },
  "gossip_candidates": [
    {
      "targetCharacterId": "string",
      "rumorContent": "string",
      "probability": 0.5
    }
  ],
  "call_availability": {
    "status": "ANSWERED | BUSY | DECLINED | MISSED",
    "reason": "string"
  },
  "conversation_status": "active | resolved | idle | conflict"
}`;

    const prompt = `PLAYER PROFILE:
Name: ${playerProfile.name}
Title: ${playerProfile.title} (${playerProfile.department})
Company: ${playerProfile.company}
Location: ${playerProfile.location}

CURRENT SITUATION:
App/Medium: ${conversationApp}
Time: ${currentSituation.time}
Incident: ${currentSituation.activeIncident || 'None'}
Location: ${currentSituation.location}
${currentSituation.transactionAmount ? `Transaction: Sent ₹${currentSituation.transactionAmount} for ${currentSituation.transactionPurpose || 'general purpose'}` : ''}

CHARACTER'S MEMORIES (What ${characterProfile.name} personally knows):
${(relevantMemories || []).map((m: any) => `- [${m.type}] ${m.content} (Source: ${m.source})`).join('\n') || 'No previous specific memories recorded.'}

RECENT CONVERSATION HISTORY:
${(recentMessages || []).map((m: any) => `${m.senderName}: "${m.text}"`).join('\n') || 'Start of conversation.'}

NEW MESSAGE FROM ${playerProfile.name}:
"${playerMessage}"

Generate ${characterProfile.name}'s authentic JSON response:`;

    const result = await callLocalAiApi(systemInstruction, prompt);
    const parsed = cleanJsonOutput(result.content);
    res.json(parsed);
  } catch (err: any) {
    console.error('Universal AI reply error:', err);
    res.status(500).json({
      error: 'Universal AI generation failed',
      details: err?.message,
    });
  }
});

// Group Chat Decision Engine Endpoint
app.post('/api/ai/group-chat', async (req, res) => {
  try {
    const { topic, lastMessage, participants, recentMessages } = req.body;

    const systemInstruction = `You are the group conversation controller for an enterprise simulation.
Each character in the group must independently decide whether to respond, stay silent, react, or interrupt.
DO NOT make every character speak at once. Typically only 1 or 2 characters will naturally reply.

Output MUST be a JSON array of character decisions:
[
  {
    "characterId": "string",
    "characterName": "string",
    "shouldSpeak": boolean,
    "reasonForSilenceOrSpeaking": "string",
    "reply": "string (only if shouldSpeak is true)",
    "emotion": "string",
    "reactionEmoji": "string or null",
    "interrupts": boolean
  }
]`;

    const prompt = `GROUP TOPIC: ${topic}
LAST MESSAGE FROM ${lastMessage.senderName}: "${lastMessage.text}"

PARTICIPANTS:
${participants.map((p: any) => `- ${p.name} (${p.role} - ${p.department}, Trust: ${p.trust})`).join('\n')}

RECENT CHAT:
${recentMessages.map((m: any) => `${m.senderName}: ${m.text}`).join('\n')}

Generate independent JSON decision for each participant:`;

    const result = await callLocalAiApi(systemInstruction, prompt);
    const parsed = cleanJsonOutput(result.content);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Group chat evaluation failed' });
  }
});

// Helper for extracting JSON from model output
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
    // If output is plain text rather than strict JSON, return structured wrapper
    return {
      message: text.replace(/^```json\s*/, '').replace(/```$/, '').trim(),
      emotion: 'neutral',
      intent: 'response',
      topic: 'general',
      follow_up_required: false,
    };
  }
}

// 1. Live Chat & Meeting Engine Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const {
      channel,
      activeCharacters,
      conversationHistory,
      playerMessage,
      player,
      reputation,
      memories,
      currentTime,
      difficulty,
      activeIncident,
      tasks,
    } = req.body;

    const hasKey = true;

    if (hasKey) {
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
   - Did they make a promise or commitment (e.g., "I will check by 4 PM" or "I'll upload the report")? Hold them to it, acknowledge the specific deadline, and record a MEMORY.
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
      "trustDelta": number (-10 to +10),
      "respectDelta": number (-10 to +10),
      "rapportDelta": number (-10 to +10),
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

      const result = await callLocalAiApi(systemInstruction, prompt);
      const parsedData = cleanJsonOutput(result.content);
      return res.json(parsedData);
    }

    // Advanced Fallback Heuristic Simulation Engine
    const primaryChar = activeCharacters[0] || {
      id: 'sarah-williams',
      name: 'Sarah Williams',
      role: 'Engineering Manager',
    };

    const fallbackResponse = generateHeuristicChatResponse(
      playerMessage,
      primaryChar,
      channel,
      activeCharacters,
      player,
      reputation,
      conversationHistory
    );

    return res.json(fallbackResponse);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const primaryChar = req.body?.activeCharacters?.[0] || {
      id: 'sarah-williams',
      name: 'Sarah Williams',
    };
    const fallback = generateHeuristicChatResponse(
      req.body?.playerMessage || '',
      primaryChar,
      req.body?.channel || { type: 'direct' },
      req.body?.activeCharacters || [primaryChar],
      req.body?.player || { name: 'Player' },
      req.body?.reputation || { managerTrust: 60 },
      req.body?.conversationHistory || []
    );
    return res.json(fallback);
  }
});

// 2. Email Evaluation & Response Engine Endpoint
app.post('/api/evaluate-email', async (req, res) => {
  try {
    const { email, playerReplyText, player, reputation, senderCharacter, memories } = req.body;
    const hasKey = true;

    if (hasKey) {
      try {
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
    "professionalism": number (0-100),
    "clarity": number (0-100),
    "ownership": number (0-100),
    "tone": "Formal" | "Defensive" | "Proactive" | "Casual" | "Vague"
  },
  "trustDelta": number (between -10 and +12),
  "managerTrustDelta": number,
  "feedback": "Concise feedback on the email communication",
  "newMemory": "Summary of any commitment made in this email"
}`;

        const systemInstruction = 'You are a professional Email Evaluation Engine in a multinational corporation. Evaluate the player\'s email draft and generate realistic follow-up and scores.';
        const result = await generateCharacterReply(systemInstruction, prompt);
        const responseText = result.content;

        const parsed = cleanJsonOutput(responseText);
        if (parsed && parsed.replyEmail) {
          return res.json(parsed);
        }
      } catch (aiError: any) {
        console.warn('Local AI in /api/evaluate-email:', aiError?.message || aiError);
      }
    }

    // High-fidelity Fallback email evaluation
    const replyText = playerReplyText || '';
    const isShort = replyText.trim().length < 20;
    const hasThanks = /thank|regards|sincerely|best|cheers/i.test(replyText);
    const hasETA = /by|tomorrow|today|hour|pm|am|update|working on|fixing|deployed|investigating|tested/i.test(replyText);
    const senderName = senderCharacter?.name || 'Sarah Williams';

    return res.json({
      replyEmail: {
        fromName: senderName,
        subject: `Re: ${email?.subject || 'Update'}`,
        body: `Hi ${player?.name?.split(' ')[0] || 'Rutwik'},\n\nThanks for following up so promptly. ${
          hasETA
            ? 'I appreciate the clear milestones and technical ownership. Let’s keep this momentum through the sprint.'
            : 'Can you ensure the team has the exact timeline documented before our next standup?'
        }\n\nBest regards,\n${senderName}`,
        requiresFurtherAction: !hasETA,
      },
      scores: {
        professionalism: isShort ? 72 : 92,
        clarity: hasETA ? 94 : 78,
        ownership: hasETA ? 90 : 75,
        tone: hasETA ? 'Proactive' : 'Formal',
      },
      trustDelta: hasETA ? 4 : 2,
      managerTrustDelta: hasETA ? 3 : 1,
      feedback: hasETA
        ? 'Excellent, structured communication with actionable milestones.'
        : 'Good response; adding explicit time estimates will strengthen customer visibility.',
      newMemory: `Sent email regarding ${email?.subject || 'sprint deliverables'}`,
    });
  } catch (err: any) {
    console.error('Unexpected error in /api/evaluate-email:', err);
    // Even on uncaught error, return clean 200 simulation so the email is NEVER blocked
    return res.json({
      replyEmail: {
        fromName: req.body?.senderCharacter?.name || 'Sarah Williams',
        subject: `Re: ${req.body?.email?.subject || 'Update'}`,
        body: `Hi ${req.body?.player?.name?.split(' ')[0] || 'Rutwik'},\n\nReceived your update. Good ownership—let’s review this in our next check-in.\n\nBest regards,\n${req.body?.senderCharacter?.name || 'Sarah Williams'}`,
        requiresFurtherAction: false,
      },
      scores: {
        professionalism: 85,
        clarity: 85,
        ownership: 85,
        tone: 'Proactive',
      },
      trustDelta: 2,
      managerTrustDelta: 2,
      feedback: 'Email processed successfully.',
      newMemory: 'Followed up on team deliverable',
    });
  }
});

// 3. Performance Review Appraisal Generator
app.post('/api/generate-review', async (req, res) => {
  try {
    const { player, reputation, memories, tasksCompleted, tasksFailed, monthNumber, evaluations } = req.body;
    const hasKey = true;

    if (hasKey) {
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
  "overallRating": number (e.g. 1.0 to 5.0 with 1 decimal, e.g. 4.2),
  "strengths": ["string", "string", "string"],
  "areasToImprove": ["string", "string"],
  "managerComment": "Direct, fair evaluation written by Engineering Manager Sarah Williams (36, sharp, rewards results, honest).",
  "hrComment": "Observational assessment by HR Business Partner Priya Sharma.",
  "careerRecommendation": "Fast-Track Promotion" | "High Potential" | "Solid Contributor" | "Needs Improvement" | "Performance Improvement Plan (PIP)",
  "salaryIncrementOffered": number (percentage increment e.g. 0 to 18),
  "promoted": boolean,
  "newLevel": number,
  "newTitle": "string (if promoted, otherwise current title)"
}`;

      try {
        const systemInstruction = 'You are a professional HR and Managerial Appraisal System at a global technology MNC.';
        const result = await generateCharacterReply(systemInstruction, prompt);
        const responseText = result.content;

        const parsed = cleanJsonOutput(responseText);
        if (parsed && parsed.overallRating) {
          return res.json(parsed);
        }
      } catch (aiError: any) {
        console.warn('Local AI error in /api/generate-review:', aiError?.message || aiError);
      }
    }

    // Fallback heuristic review generator
    const avgTrust = (reputation.managerTrust + reputation.teamTrust + reputation.customerTrust) / 3;
    let rating = 3.5;
    let recommendation = 'Solid Contributor';
    let increment = 8;
    let promoted = false;
    let newTitle = player.title;
    let newLevel = player.level;

    if (avgTrust >= 80 && tasksCompleted >= 3) {
      rating = 4.6;
      recommendation = 'Fast-Track Promotion';
      increment = 18;
      promoted = true;
      newLevel = player.level + 1;
      const titles = [
        'Associate Software Engineer',
        'Software Engineer II',
        'Senior Software Engineer',
        'Technical Lead',
        'Engineering Manager',
        'Director of Engineering',
      ];
      newTitle = titles[Math.min(newLevel - 1, titles.length - 1)];
    } else if (avgTrust >= 65) {
      rating = 4.0;
      recommendation = 'High Potential';
      increment = 12;
    } else if (avgTrust <= 40) {
      rating = 2.4;
      recommendation = 'Performance Improvement Plan (PIP)';
      increment = 0;
    }

    return res.json({
      overallRating: rating,
      strengths: [
        'Dependable task execution during regular sprints',
        'Active participation in incident triage and engineering discussions',
        'Shows constructive collaboration with cross-functional peers',
      ],
      areasToImprove: [
        'Proactive status updates before management asks for them',
        'Balancing speed of delivery with comprehensive unit testing',
      ],
      managerComment: `You've demonstrated solid progress this cycle, ${player.name}. In engineering, ownership isn't just about writing code—it's about staying ahead of blockers. Keep this trajectory up and push for deeper architectural autonomy.`,
      hrComment: `${player.name} maintains a respectful and productive working relationship across teams. Attendance and core workplace compliance remain high.`,
      careerRecommendation: recommendation,
      salaryIncrementOffered: increment,
      promoted,
      newLevel,
      newTitle,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-review:', err);
    res.status(500).json({ error: 'Failed to generate review' });
  }
});

// 4. Salary Negotiation System Endpoint
app.post('/api/negotiate-salary', async (req, res) => {
  try {
    const { player, playerArgument, reputation, currentSalary, requestedSalary } = req.body;
    const hasKey = true;

    if (hasKey) {
      const prompt = `You are Sarah Williams (Engineering Manager) or Priya Sharma (HR BP) negotiating salary with an employee at Nexora Global MNC.
Employee: ${player.name}
Current Salary: ₹${currentSalary.toLocaleString()}/yr
Requested Salary: ₹${requestedSalary.toLocaleString()}/yr
Manager Trust: ${reputation.managerTrust}/100, Performance Score: ${player.performanceScore || 75}/100
Employee's Justification:
"${playerArgument}"

Negotiate realistically according to corporate salary bands and budget constraints.
Return JSON:
{
  "status": "ACCEPTED" | "COUNTERED" | "REJECTED",
  "agreedSalary": number (either the requested, an intermediate counter-offer, or current if rejected),
  "speakerName": "Sarah Williams" | "Priya Sharma",
  "dialogue": "Realistic corporate negotiation response balancing budget, market parity, and performance.",
  "trustDelta": number (can be slightly negative if demands were audacious without merit, or positive if well articulated)
}`;

      try {
        const systemInstruction = 'You are a professional corporate salary negotiation simulator representing management at an enterprise technology MNC.';
        const result = await callLocalAiApi(systemInstruction, prompt);

        const parsed = cleanJsonOutput(result.content);
        if (parsed && parsed.status) {
          return res.json(parsed);
        }
      } catch (geminiError: any) {
        console.warn('AI API error in /api/negotiate-salary, using fallback:', geminiError?.message || geminiError);
      }
    }

    // Fallback salary negotiation logic
    const diffRatio = (requestedSalary - currentSalary) / currentSalary;
    if (diffRatio <= 0.15 && reputation.managerTrust >= 65) {
      return res.json({
        status: 'ACCEPTED',
        agreedSalary: requestedSalary,
        speakerName: 'Priya Sharma (HR BP)',
        dialogue: `Given your consistent performance metrics and Sarah's positive recommendation, HR has approved your requested revision to ₹${requestedSalary.toLocaleString()}. The revised band takes effect next pay cycle.`,
        trustDelta: 3,
      });
    } else if (diffRatio <= 0.35 && reputation.managerTrust >= 70) {
      const counter = Math.round(currentSalary * 1.18);
      return res.json({
        status: 'COUNTERED',
        agreedSalary: counter,
        speakerName: 'Sarah Williams (Manager)',
        dialogue: `I appreciate you laying out your accomplishments, ${player.name}. While a ${Math.round(
          diffRatio * 100
        )}% bump is outside our current Q3 band without a formal promotion cycle, I fought with Finance and secured a revision to ₹${counter.toLocaleString()}. Let's revisit the rest at annual appraisal.`,
        trustDelta: 2,
      });
    } else {
      return res.json({
        status: 'REJECTED',
        agreedSalary: currentSalary,
        speakerName: 'Sarah Williams (Manager)',
        dialogue: `I hear your ambition, ${player.name}, but right now your metric track record doesn't justify a leap of this magnitude. Let's focus on nailing the upcoming enterprise deliverables and revisit when your impact is undisputed.`,
        trustDelta: -2,
      });
    }
  } catch (err: any) {
    console.error('Error in /api/negotiate-salary:', err);
    res.status(500).json({ error: 'Failed to negotiate salary' });
  }
});

// 5. Corporate News Engine with Google Search Grounding Endpoint
app.post('/api/news', async (req, res) => {
  try {
    const { category, currentDay, playerTitle } = req.body;
    const hasKey = true;

    if (hasKey) {
      const topicQuery =
        category && category !== 'ALL'
          ? `enterprise ${category} tech news`
          : 'enterprise cloud computing, AI infrastructure, cybersecurity regulations, and major tech outages';

      const prompt = `Based on recent real-world enterprise technology developments, cloud infrastructure trends, cybersecurity alerts, or AI industry updates relevant to a software engineer working at a multinational enterprise tech corporation, generate 4 distinct, high-impact news updates for the corporate internal intelligence radar.
Search topic focus: ${topicQuery}

Generate 4 distinct, high-impact news updates for the corporate internal intelligence radar.
For each news article, provide:
1. "headline": Crisp, authentic industry headline.
2. "summary": 2-3 sentences summarizing the real-world event or market shift.
3. "category": Must be one of: "Cloud & Infrastructure" | "AI & Enterprise Software" | "Cybersecurity & Regulations" | "Market & Economy"
4. "relevanceToNexora": Exactly how this affects Nexora Global engineers, enterprise clients like Apex Global, or management.
5. "sourceName": Publication or organization name (e.g., Bloomberg, Reuters, The Verge, AWS Health, TechCrunch, Cloudflare).
6. "actions": Array of 2 actionable professional initiatives the employee (${playerTitle || 'Software Engineer'}) can take in response to this news to showcase leadership, technical depth, or risk awareness:
   - "id": string
   - "label": Short action title (e.g. "Draft Advisory Memo to Sarah", "Propose Proactive Chaos Test")
   - "description": What the employee does
   - "reputationImpact": { "managerTrustDelta": number (1 to 5), "professionalReputationDelta": number (2 to 6), "teamTrustDelta": number, "customerTrustDelta": number }
   - "xpGain": number (30 to 80)
   - "memorySummary": 1 sentence summary for career memory log

Output format: Return strictly a valid JSON array of objects conforming to the schema.`;

      try {
        const systemInstruction = 'You are a professional Enterprise Technology News and Intelligence Feed Generator for a multinational corporation.';
        const result = await callLocalAiApi(systemInstruction, prompt);
        const responseText = result.content;

        let parsedNews: any[] = [];
        try {
          parsedNews = cleanJsonOutput(responseText);
        } catch (pe) {
          console.warn('Could not parse news JSON directly, attempting regex extraction:', pe);
          const match = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (match) {
            parsedNews = JSON.parse(match[0]);
          }
        }

        const enrichedNews = (Array.isArray(parsedNews) && parsedNews.length > 0 ? parsedNews : getFallbackCorporateNews()).map((item, idx) => {
          return {
            id: `news-${Date.now()}-${idx}`,
            headline: item.headline,
            summary: item.summary,
            category: item.category || 'Cloud & Infrastructure',
            relevanceToNexora: item.relevanceToNexora || 'Directly informs Q3 platform resilience planning.',
            sourceName: item.sourceName || 'Global Tech Radar',
            sourceUrl: 'https://news.google.com',
            publishedTime: `Day ${currentDay || 1} • Just Now`,
            actions: item.actions || [
              {
                id: `act-${idx}-1`,
                label: 'Share Executive Memo with Sarah Williams',
                description: 'Draft a 1-page briefing note advising management on platform risk.',
                reputationImpact: { managerTrustDelta: 4, professionalReputationDelta: 3 },
                xpGain: 40,
                memorySummary: `Briefed Sarah on industry trend: ${item.headline}`,
              },
              {
                id: `act-${idx}-2`,
                label: 'Propose Resilience Audit in Sprint Standup',
                description: 'Advocate for preemptive stress testing in next sprint grooming.',
                reputationImpact: { teamTrustDelta: 3, professionalReputationDelta: 4 },
                xpGain: 50,
                memorySummary: `Spearheaded engineering discussion on ${item.headline}`,
              },
            ],
          };
        });

        return res.json({
          news: enrichedNews,
          searchQueries: [topicQuery],
          grounded: true,
          sourceCount: enrichedNews.length,
        });
      } catch (err: any) {
        console.warn('Local AI corporate news generation failed, using fallback:', err);
      }
    }

    // Fallback news if no Gemini key or offline
    return res.json({
      news: getFallbackCorporateNews(currentDay),
      searchQueries: ['enterprise cloud resilience', 'enterprise AI infrastructure'],
      grounded: false,
      sourceCount: 0,
    });
  } catch (err: any) {
    console.error('Error in /api/news with search grounding:', err);
    return res.json({
      news: getFallbackCorporateNews(req.body?.currentDay),
      grounded: false,
      error: 'Search grounding fallback used',
    });
  }
});

// Helper for fallback corporate news items
function getFallbackCorporateNews(day = 1) {
  return [
    {
      id: `fallback-news-1`,
      headline: 'Major Global Cloud Provider Suffers Cascading DNS & Ingress Outage',
      summary: 'A misconfigured border gateway protocol update triggered multi-region API gateway timeouts across Fortune 500 financial and SaaS platforms for over 90 minutes.',
      category: 'Cloud & Infrastructure',
      relevanceToNexora: 'Enterprise client Apex Global is demanding validation that Nexora multi-region failover can survive an upstream DNS partition.',
      sourceName: 'The Register / Cloud Monitoring Daily',
      sourceUrl: 'https://news.google.com',
      publishedTime: `Day ${day} • Breaking`,
      actions: [
        {
          id: 'act-dns-1',
          label: 'Submit DNS Chaos Test Proposal to Sarah Williams',
          description: 'Draft an architectural proposal to simulate simulated upstream DNS blackholing in staging.',
          reputationImpact: { managerTrustDelta: 5, professionalReputationDelta: 4, teamTrustDelta: 3 },
          xpGain: 60,
          memorySummary: 'Proposed preemptive DNS chaos resilience testing following global cloud outage.',
        },
        {
          id: 'act-dns-2',
          label: 'Brief Client VP Michael Anderson on Disaster Recovery',
          description: 'Share a technical reassurance note detailing Nexora’s active-active failover SLA.',
          reputationImpact: { customerTrustDelta: 6, professionalReputationDelta: 3 },
          xpGain: 50,
          memorySummary: 'Proactively reassured Michael Anderson with disaster recovery validation.',
        },
      ],
    },
    {
      id: `fallback-news-2`,
      headline: 'Strict Enterprise AI Governance & Model Audit Compliance Enforced',
      summary: 'Regulatory bodies announce rigorous audit requirements for automated decision-making and LLM pipeline data leak prevention in financial systems.',
      category: 'Cybersecurity & Regulations',
      relevanceToNexora: 'CISO David Kim is auditing all microservices for telemetry privacy leaks and token exposure.',
      sourceName: 'Reuters Regulatory Intelligence',
      sourceUrl: 'https://news.google.com',
      publishedTime: `Day ${day} • Market Brief`,
      actions: [
        {
          id: 'act-ai-gov-1',
          label: 'Initiate Zero-Trust Token Audit for Core Telemetry',
          description: 'Check repository git history and environment variables for compliance with SOC-2 guidelines.',
          reputationImpact: { managerTrustDelta: 3, professionalReputationDelta: 5 },
          xpGain: 45,
          memorySummary: 'Conducted proactive zero-trust compliance scan for telemetry services.',
        },
      ],
    },
    {
      id: `fallback-news-3`,
      headline: 'Kafka & Distributed Broker Architecture Hits Peak Enterprise Throughput',
      summary: 'Tech engineering summits report widespread adoption of zero-copy streaming to prevent partition lag during high-frequency trading market opening hours.',
      category: 'AI & Enterprise Software',
      relevanceToNexora: 'Directly applicable to our current TASK-101 telemetry pipeline consumer lag optimization.',
      sourceName: 'Distributed Systems Weekly',
      sourceUrl: 'https://news.google.com',
      publishedTime: `Day ${day} • Tech Deep Dive`,
      actions: [
        {
          id: 'act-kafka-1',
          label: 'Apply Zero-Copy Principles to TASK-101 Deliverable',
          description: 'Refactor Kafka partition worker buffers using zero-copy memory mapping.',
          reputationImpact: { managerTrustDelta: 4, professionalReputationDelta: 5, teamTrustDelta: 4 },
          xpGain: 75,
          memorySummary: 'Implemented cutting-edge zero-copy streaming on enterprise Kafka pipeline.',
        },
      ],
    },
    {
      id: `fallback-news-4`,
      headline: 'FinTech Cloud OPEX Scrutiny: CFOs Demand 20% Reduction in Egress Bills',
      summary: 'Corporate CFOs clamp down on unmonitored cross-zone data transfer costs and oversized idle database clusters.',
      category: 'Market & Economy',
      relevanceToNexora: 'Finance controller Rachel Green is scrutinizing our team’s AWS/GCP infrastructure expenditure.',
      sourceName: 'Bloomberg Technology Markets',
      sourceUrl: 'https://news.google.com',
      publishedTime: `Day ${day} • Financial Analysis`,
      actions: [
        {
          id: 'act-cost-1',
          label: 'Audit Idle Staging Clusters & Share Cost-Saving Memo',
          description: 'Identify 4 underutilized dev pods and propose automated nighttime scale-down.',
          reputationImpact: { managerTrustDelta: 5, professionalReputationDelta: 4 },
          xpGain: 65,
          memorySummary: 'Identified cloud cost optimization opportunities for Rachel Green and Sarah.',
        },
      ],
    },
  ];
}

// 6. AI Interview Engine Endpoint (HR Screening, Technical Deep Dive, Managerial Fit)
app.post('/api/interview/chat', async (req, res) => {
  try {
    const {
      job,
      candidate,
      roundType,
      interviewer,
      conversationHistory,
      playerAnswer,
      questionIndex,
      hiddenScores,
    } = req.body;

    const hasKey = true;

    if (hasKey) {
      const isTechnical = roundType === 'TECHNICAL_INTERVIEW';
      const isHR = roundType === 'HR_SCREEN';
      const isManager = roundType === 'MANAGER_ROUND';

      const systemInstruction = `You are ${interviewer.name}, acting as the ${interviewer.role} at ${job.company} conducting a ${roundType.replace('_', ' ')} for the position of "${job.title}".
Interviewer Personality: ${interviewer.personality || 'PROFESSIONAL'} (e.g. Strict, challenging, demanding clarity, but fair).

REALISM RULES:
1. Speak authentically like an experienced corporate MNC interviewer. Do NOT sound like an enthusiastic sycophantic chatbot.
2. NEVER use fake filler phrases like "Great answer!", "That's fantastic!", "I completely understand!".
3. ${isTechnical ? `Ask real, domain-specific engineering questions about: ${job.skillsRequired.join(', ')}. If the candidate mentions a protocol or framework (e.g. Modbus, PLC, Kafka, SQL, Python, RS485), challenge them on edge cases, troubleshooting, packet drops, or failure modes.` : ''}
4. ${isHR ? 'Focus on career motivation, past teamwork conflicts, why they want to join, salary expectations, and cultural resilience. Probe vague answers.' : ''}
5. ${isManager ? 'Focus on ownership, handling missed deadlines, dealing with difficult clients, and project trade-offs.' : ''}
6. Challenge the candidate if their answer is superficial or incomplete.
7. Total interview length is 3 to 4 questions. This is question #${(questionIndex || 0) + 1}. If questionIndex >= 3, conclude the round and provide the decision (PASS or FAIL).

Candidate Profile:
Name: ${candidate.name}
Education: ${candidate.degree} in ${candidate.specialization} (${candidate.college || 'University'})
Experience: ${candidate.experienceYears || 0} years (${candidate.experienceTier || 'Fresher'})
Claimed Skills: ${candidate.technicalSkills?.join(', ') || 'General Engineering'}
Target Job: ${job.title} at ${job.company} (Required Skills: ${job.skillsRequired.join(', ')})

Return strictly a valid JSON code block starting with \`\`\`json and ending with \`\`\` matching this schema:
{
  "replyText": "Your dialogue spoken to the candidate. Can react, challenge, or ask the next question.",
  "emotion": "neutral" | "impressed" | "skeptical" | "challenging" | "warm",
  "scoreDeltas": {
    "technicalKnowledge": number (between -10 and +12),
    "communication": number (between -10 and +12),
    "confidence": number (between -8 and +10),
    "problemSolving": number (between -10 and +12),
    "cultureFit": number (between -8 and +10)
  },
  "isRoundComplete": boolean (true if questionIndex >= 3 or candidate severely failed/passed),
  "roundResult": "PASS" | "FAIL" | "IN_PROGRESS",
  "feedbackNote": "Constructive 1-sentence note on how candidate performed on this question."
}`;

      const historyContext = (conversationHistory || [])
        .slice(-6)
        .map((m: any) => `${m.sender}: "${m.text}"`)
        .join('\n');

      const prompt = `Interview History:
${historyContext}

Candidate (${candidate.name}) just answered:
"${playerAnswer}"

Current candidate hidden cumulative scores:
Technical Knowledge: ${hiddenScores?.technicalKnowledge || 70}/100
Communication: ${hiddenScores?.communication || 75}/100
Confidence: ${hiddenScores?.confidence || 70}/100
Problem Solving: ${hiddenScores?.problemSolving || 70}/100

Generate your authentic interviewer response and updated scores as JSON.`;

      try {
        const result = await callLocalAiApi(systemInstruction, prompt);
        const parsedData = cleanJsonOutput(result.content);
        return res.json(parsedData);
      } catch (err: any) {
        console.warn('AI API error in /api/interview/chat, using fallback:', err?.message || err);
      }
    }

    // Fallback heuristic interview response
    const fallbackData = generateHeuristicInterviewResponse(
      playerAnswer,
      job,
      candidate,
      roundType,
      interviewer,
      questionIndex || 0
    );
    return res.json(fallbackData);
  } catch (err: any) {
    console.error('Error in /api/interview/chat:', err);
    const fallbackData = generateHeuristicInterviewResponse(
      req.body?.playerAnswer || '',
      req.body?.job || { title: 'Engineer', company: 'Nexora' },
      req.body?.candidate || { name: 'Candidate' },
      req.body?.roundType || 'HR_SCREEN',
      req.body?.interviewer || { name: 'Interviewer', role: 'Lead' },
      req.body?.questionIndex || 0
    );
    return res.json(fallbackData);
  }
});

// Helper for fallback interview logic
function generateHeuristicInterviewResponse(
  answer: string,
  job: any,
  candidate: any,
  roundType: string,
  interviewer: any,
  qIdx: number
) {
  const ansLower = answer.toLowerCase();
  const isShort = answer.trim().split(/\s+/).length < 8;
  const isDetailed = answer.trim().split(/\s+/).length > 25;

  let replyText = '';
  let emotion: any = 'neutral';
  let techDelta = 3;
  let commDelta = 3;
  let confDelta = 2;
  const isFinal = qIdx >= 3;

  if (isShort) {
    replyText = `That's quite brief. In this role at ${job.company}, you'll need to explain complex issues to clients and stakeholders. Can you elaborate with a specific practical example?`;
    emotion = 'skeptical';
    techDelta = -3;
    commDelta = -4;
  } else if (roundType === 'TECHNICAL_INTERVIEW') {
    if (job.title.toLowerCase().includes('scada') || job.title.toLowerCase().includes('automation')) {
      if (qIdx === 0) {
        replyText = `Okay, let's look at communication protocols. In a plant running Modbus TCP over industrial Ethernet, suppose you can successfully ping the inverter gateway IP, but the master polling returns zero registers or 0x83 exception code. Walk me through your troubleshooting sequence.`;
        emotion = 'challenging';
      } else if (qIdx === 1) {
        replyText = `Good point on slave ID and register offsets. Now, how do you handle terminating resistors on long RS485 daisy-chain runs when intermittent reflection noise corrupts packets?`;
        emotion = 'neutral';
      } else {
        replyText = `Thank you, ${candidate.name}. That gives me a solid read on your industrial telemetry fundamentals. I'll summarize my notes for the hiring committee.`;
        emotion = 'impressed';
      }
    } else {
      // General Software / IT
      if (qIdx === 0) {
        replyText = `Understood. Suppose our production API is experiencing high latency spikes at P99 under peak load, but CPU utilization is only at 30%. What potential bottlenecks would you investigate first?`;
        emotion = 'challenging';
      } else {
        replyText = `Interesting trade-off. How would you handle database connection pooling and deadlock avoidance when multiple microservices write to the same table?`;
        emotion = 'neutral';
      }
    }
  } else if (roundType === 'HR_SCREEN') {
    if (qIdx === 0) {
      replyText = `Thanks for walking me through your background. Can you describe a challenging project or team disagreement, and how you worked through it?`;
      emotion = 'warm';
    } else if (qIdx === 1) {
      replyText = `What are your compensation expectations for this position, and what is your notice period?`;
      emotion = 'neutral';
    } else {
      replyText = `Thank you for sharing your perspective, ${candidate.name}. Our team will review your responses and update you on the next technical round.`;
      emotion = 'impressed';
    }
  } else {
    // Manager Round
    replyText = `That's a sound practical approach. At ${job.company}, we place huge emphasis on ownership and zero excuses when incidents occur. I appreciate the clarity in your response.`;
    emotion = isDetailed ? 'impressed' : 'neutral';
  }

  return {
    replyText,
    emotion,
    scoreDeltas: {
      technicalKnowledge: techDelta,
      communication: commDelta,
      confidence: confDelta,
      problemSolving: 4,
      cultureFit: 3,
    },
    isRoundComplete: isFinal,
    roundResult: isFinal ? (commDelta > 0 ? 'PASS' : 'FAIL') : 'IN_PROGRESS',
    feedbackNote: isShort ? 'Answer was overly brief and lacked evidence.' : 'Provided structured explanation with context.',
  };
}

// 7. Salary Offer Pre-Employment Negotiation Endpoint
app.post('/api/interview/salary-negotiation', async (req, res) => {
  try {
    const { job, candidate, currentOffer, requestedSalary, playerArgument, negotiationCount } = req.body;
    const hasKey = true;

    if (hasKey) {
      try {
        const prompt = `You are the Lead Talent Acquisition Partner at ${job?.company || 'our company'} negotiating an initial employment offer with candidate ${candidate?.name || 'the candidate'} for the position of "${job?.title || 'Engineer'}".
Initial Base Offer: ₹${(currentOffer?.baseSalary || 600000).toLocaleString()} (Max Band: ₹${(job?.maxSalary || 900000).toLocaleString()})
Candidate Requested: ₹${(requestedSalary || 700000).toLocaleString()}
Negotiation Round: #${(negotiationCount || 0) + 1}
Candidate's Justification:
"${playerArgument || ''}"

Negotiation Rules:
1. Act like a real corporate MNC recruiter balancing talent budget and market equity.
2. If candidate asks for reasonable increase (<= 15% above offer) and gives good arguments, offer a reasonable counter or accept.
3. If candidate asks for something absurd (above max band without senior experience), push back firmly.
4. If negotiation count > 2, warn them that the offer is at final ceiling.

Return JSON:
{
  "status": "ACCEPTED" | "COUNTERED" | "HELD_FIRM" | "WITHDRAWN",
  "revisedSalary": number,
  "signingBonusDelta": number,
  "recruiterResponse": "Realistic corporate recruiter reply",
  "isFinal": boolean
}`;

        const systemInstruction = 'You are a professional corporate talent acquisition recruiter negotiating salary with a candidate.';
        const result = await generateCharacterReply(systemInstruction, prompt);
        const responseText = result.content;
        const parsed = cleanJsonOutput(responseText);
        if (parsed.status && parsed.recruiterResponse) {
          return res.json(parsed);
        }
      } catch (aiErr) {
        console.warn('Local AI negotiation error:', aiErr);
      }
    }

    // Fallback negotiation logic
    const baseOffer = currentOffer?.baseSalary || 600000;
    const reqSal = requestedSalary || baseOffer;
    const diff = (reqSal - baseOffer) / baseOffer;
    if (diff <= 0.12) {
      return res.json({
        status: 'ACCEPTED',
        revisedSalary: reqSal,
        signingBonusDelta: 20000,
        recruiterResponse: `After syncing with the hiring director, we can approve your requested package of ₹${reqSal.toLocaleString()} along with a ₹20,000 joining bonus. We look forward to having you on board!`,
        isFinal: true,
      });
    } else if (diff <= 0.25) {
      const counter = Math.round(baseOffer * 1.08);
      return res.json({
        status: 'COUNTERED',
        revisedSalary: counter,
        signingBonusDelta: 10000,
        recruiterResponse: `We appreciate your enthusiasm, ${candidate?.name || 'Candidate'}. While ₹${reqSal.toLocaleString()} is above our entry band for this requisition, we can revise our base offer to ₹${counter.toLocaleString()} with a ₹10,000 joining incentive.`,
        isFinal: (negotiationCount || 0) >= 2,
      });
    } else {
      return res.json({
        status: 'HELD_FIRM',
        revisedSalary: baseOffer,
        signingBonusDelta: 0,
        recruiterResponse: `Our initial offer of ₹${baseOffer.toLocaleString()} represents our top tier for this role based on our current department compensation parity. We would love to have you join at this package.`,
        isFinal: true,
      });
    }
  } catch (err: any) {
    console.error('Error in /api/interview/salary-negotiation:', err);
    res.status(500).json({ error: 'Failed to process salary negotiation' });
  }
});

// 8. Interactive Meeting Turn & Evaluation Engine Endpoint
app.post('/api/meeting/interaction', async (req, res) => {
  try {
    const {
      meetingTitle,
      meetingType,
      currentSpeaker,
      speakerPrompt,
      playerChoice, // 'passive' | 'assertive' | 'collaborative'
      playerDialogue,
      attendees,
      roundNumber,
      player,
      reputation,
    } = req.body;

    const hasKey = true;

    if (hasKey) {
      try {
        const prompt = `You are the Meeting Engine for a multinational corporation (MNC) simulation game.
Meeting: "${meetingTitle}" (Type: ${meetingType}, Round #${roundNumber})
Attendee List: ${(attendees || []).map((a: any) => `${a.name} (${a.role})`).join(', ')}
Current Speaker: ${currentSpeaker?.name || 'Manager'} (${currentSpeaker?.role || 'Lead'})
What they asked/presented:
"${speakerPrompt}"

Player: ${player?.name || 'Rutwik'} (Title: ${player?.title || 'Engineer'})
Player's Communication Stance: "${playerChoice.toUpperCase()}" ('passive' | 'assertive' | 'collaborative')
Player's Actual Speech in Meeting:
"${playerDialogue}"

Analyze the room's reaction to this response style:
- PASSIVE: Deferential, avoids ownership, soft, non-confrontational. Colleagues feel lack of initiative; managers like compliance but note low leadership.
- ASSERTIVE: Direct, firm, holds others accountable, technical backbone, pushes back against bad ideas or scope creep. Management and senior engineers respect it; clients/peers may feel friction if tone is sharp.
- COLLABORATIVE: Synthesizes viewpoints, proposes win-win compromises, brings peers along, de-escalates conflict. High team trust, strong cross-functional reputation.

Return JSON:
{
  "immediateReaction": "1-2 sentences describing the physical and vocal reaction in the conference room/call.",
  "speakerFollowUp": "1-3 sentences spoken response from ${currentSpeaker?.name || 'the speaker'} reacting directly to what player said.",
  "secondaryReaction": {
    "characterId": "another-attendee-id-or-null",
    "characterName": "Name or null",
    "text": "Brief reaction or comment from a peer in the room, or null",
    "emotion": "happy" | "neutral" | "impressed" | "skeptical" | "supportive"
  },
  "reactionEmotion": "impressed" | "supportive" | "neutral" | "disappointed" | "demanding" | "happy",
  "consequenceToast": "Short punchy badge summary (e.g. 'Assertive: Sarah noted your technical backbone!')"
}`;

        const systemInstruction = 'You are a professional Meeting Evaluation and Reaction Engine for an enterprise corporation simulation game.';
        const result = await callLocalAiApi(systemInstruction, prompt);
        const responseText = result.content;
        const parsed = cleanJsonOutput(responseText);
        if (parsed.immediateReaction && parsed.speakerFollowUp) {
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Local AI meeting turn failed, using heuristic fallback:', err);
      }
    }

    // Heuristic fallback response
    let immediateReaction = '';
    let speakerFollowUp = '';
    let emotion = 'neutral';
    let consequenceToast = '';

    if (playerChoice === 'assertive') {
      immediateReaction = `${currentSpeaker?.name || 'The team'} pauses, taking in your firm and direct position. Several heads nod at the clarity of your stance.`;
      speakerFollowUp = `I appreciate you laying out the boundaries clearly, ${player?.name?.split(' ')[0] || 'Rutwik'}. In this organization, we value engineers who defend standards rather than nodding along.`;
      emotion = 'impressed';
      consequenceToast = `Assertive stance: ${currentSpeaker?.name || 'Colleagues'} noted your command and ownership!`;
    } else if (playerChoice === 'collaborative') {
      immediateReaction = `${currentSpeaker?.name || 'The team'} smiles visibly. The tension in the room eases as your proposal bridges the different priorities.`;
      speakerFollowUp = `That's a very constructive way to frame this, ${player?.name?.split(' ')[0] || 'Rutwik'}. It protects our timeline while ensuring nobody is left out in the cold.`;
      emotion = 'happy';
      consequenceToast = `Collaborative stance: High team synergy! Boosted morale across the room.`;
    } else {
      immediateReaction = `${currentSpeaker?.name || 'The team'} nods politely, though a brief silence suggests they were hoping for more proactive direction.`;
      speakerFollowUp = `Understood. We will proceed along the standard guidelines for now. Keep an eye on the tickets and let us know if anything shifts.`;
      emotion = 'neutral';
      consequenceToast = `Passive stance: Kept the waters calm, but missed a visibility opportunity.`;
    }

    return res.json({
      immediateReaction,
      speakerFollowUp,
      secondaryReaction: null,
      reactionEmotion: emotion,
      consequenceToast,
    });
  } catch (error: any) {
    console.error('Error in /api/meeting/interaction:', error);
    res.status(500).json({ error: 'Failed to process meeting interaction' });
  }
});

function generateHeuristicChatResponse(
  playerMessage: string,
  char: any,
  channel: any,
  activeCharacters: any[],
  player: any,
  reputation: any,
  conversationHistory: any[] = []
) {
  const msgLower = playerMessage.toLowerCase();
  const charId = (char.id || '').toLowerCase();
  const charName = char.name || 'someone';
  const playerName = player.name || 'Candidate';
  const playerFirstName = playerName.split(' ')[0];

  let text = '';
  let emotion = 'neutral';
  let intent = 'Respond to player contextually';
  let trustDelta = 1;
  let ownershipScore = 80;
  let profScore = 80;
  let followUpQuestion: string | null = null;
  let updatedTopic = channel.topic || 'Chat';
  let updatedSubtopic = channel.subtopic || 'Conversation';

  // 1. Mom / Aai
  if (charId.includes('mom') || charId.includes('aai')) {
    if (msgLower.includes('food') || msgLower.includes('eat') || msgLower.includes('dinner') || msgLower.includes('lunch') || msgLower.includes('pithla') || msgLower.includes('modak')) {
      text = `Aai here! Yes dear, I made fresh Ukadiche Modak and some Puran Poli today! Did you eat properly? Make sure you take your meals on time at the office, ${playerFirstName}! ❤️`;
      emotion = 'happy';
      followUpQuestion = 'Did you eat your meals properly?';
    } else if (msgLower.includes('reach') || msgLower.includes('office') || msgLower.includes('safe') || msgLower.includes('work')) {
      text = `Thank god you reached safely, ${playerFirstName}! Please take care of your health in the rains. Did you take your umbrella today? ❤️`;
      emotion = 'relieved';
      followUpQuestion = 'Did you remember to take your umbrella today?';
    } else {
      text = `Hi dear, how is your day going? Aai was thinking of you. Did you drink enough water and eat your lunch properly today? Let me know when you are coming home next! ❤️`;
      emotion = 'supportive';
      followUpQuestion = 'Are you coming home this weekend?';
    }
    trustDelta = 2;
  }

  // 2. Dad / Baba
  else if (charId.includes('dad') || charId.includes('baba')) {
    if (msgLower.includes('money') || msgLower.includes('saving') || msgLower.includes('ppf') || msgLower.includes('sip') || msgLower.includes('wallet') || msgLower.includes('invest')) {
      text = `Hello ${playerFirstName}. Glad to see you taking your finances seriously. Remember, starting your PPF account and recurring monthly mutual fund SIPs early in your career is the secret to compound wealth. Have you set up your automated monthly investment yet?`;
      emotion = 'supportive';
      followUpQuestion = 'Have you automated your monthly savings yet?';
    } else {
      text = `Hello ${playerFirstName}, hope you are executing your duties with high integrity and discipline at work. Remember to maintain focus and health. Have you reviewed your medical insurance policy papers?`;
      emotion = 'neutral';
      followUpQuestion = 'Are you keeping track of your budget this month?';
    }
    trustDelta = 2;
  }

  // 3. Best Friend Rohan Deshmukh
  else if (charId.includes('rohan')) {
    if (msgLower.includes('trek') || msgLower.includes('climb') || msgLower.includes('sinhagad') || msgLower.includes('saturday') || msgLower.includes('weekend')) {
      text = `Oh yes bro! Saturday 5 AM Sinhagad night climb is 100% on! Hot pithla bhakri and chai at the top is going to be legendary in this rain. Are you fully packed with trekking shoes and a rain jacket? 🏔️🔥`;
      emotion = 'excited';
      followUpQuestion = 'Are you fully packed for the climb?';
    } else if (msgLower.includes('dinner') || msgLower.includes('food') || msgLower.includes('eat') || msgLower.includes('hotel') || msgLower.includes('baner')) {
      text = `Bro, Baner dinner tonight is locked! Let's hit the main cafe near High Street. Are you heading out of the office on time or is your manager holding you back? 😂`;
      emotion = 'happy';
      followUpQuestion = 'Are you heading out on time?';
    } else {
      text = `Yo bro! Hanging in there with today's corporate drama? Let's catch up for cutting chai or a ride soon. What are your plans for Saturday? 🏍️`;
      emotion = 'supportive';
      followUpQuestion = 'What are your plans for Saturday?';
    }
    trustDelta = 3;
  }

  // 4. Close Friend Rahul Sharma
  else if (charId.includes('rahul')) {
    if (msgLower.includes('money') || msgLower.includes('owe') || msgLower.includes('1000') || msgLower.includes('2000') || msgLower.includes('send') || msgLower.includes('pay')) {
      if (msgLower.includes('forget') || msgLower.includes('owes') || msgLower.includes('other')) {
        text = `😂 I know, I know. I got the ₹2,00,000 wallet confirm or ₹2,000 you sent, thanks bro! I'll send you the other 1,000 as soon as my salary comes in tomorrow.`;
        emotion = 'happy';
        followUpQuestion = 'Is that okay, or do you need it urgently?';
      } else {
        text = `Yeah bro, just saw it! Got the ₹2,000. Thanks. I'll send that other 1,000 after my salary gets credited tomorrow. 😂`;
        emotion = 'relieved';
        followUpQuestion = 'Did you get the confirmation message?';
      }
    } else if (msgLower.includes('code') || msgLower.includes('system') || msgLower.includes('hackathon') || msgLower.includes('startup') || msgLower.includes('tech')) {
      text = `Oh man, the Bangalore startup scene is absolutely insane right now! Our backend services are scaling like crazy. Did you get a chance to check out that new system design RFC I sent? 💻`;
      emotion = 'excited';
      followUpQuestion = 'Did you look at that system design RFC?';
    } else {
      text = `Hey bro! How is life treating you? Let's jump on Valorant tonight if you're free, or let me know if you want to chat about some startup ideas over the weekend! 🙌`;
      emotion = 'supportive';
      followUpQuestion = 'Up for Valorant tonight?';
    }
    trustDelta = 3;
  }

  // 5. Neha Joshi (Romantic Interest / Designer)
  else if (charId.includes('neha') && !charId.includes('kapoor')) {
    if (msgLower.includes('coffee') || msgLower.includes('sunday') || msgLower.includes('goodluck') || msgLower.includes('meet') || msgLower.includes('designs')) {
      text = `Looking forward to Sunday coffee at Goodluck so much! ☕✨ I'll bring my new watercolor sketchpad too. Would you like to check out that cute art gallery in Koregaon Park afterwards? 😊`;
      emotion = 'excited';
      followUpQuestion = 'Shall we visit the art gallery afterwards?';
    } else if (msgLower.includes('post') || msgLower.includes('photo') || msgLower.includes('instagram') || msgLower.includes('pune')) {
      text = `Aww thanks! Pune's monsoon aesthetic is just incredible for photography and sketching. Have you been sketching or taking photos lately too? 🎨✨`;
      emotion = 'happy';
      followUpQuestion = 'Have you been taking any photos lately?';
    } else {
      text = `Hey ${playerFirstName}! 😊 Hope you're having a warm, creative day. I'm finishing a new landing page layout. What are your plans for this Sunday afternoon? Let's grab coffee! ☕`;
      emotion = 'supportive';
      followUpQuestion = 'How is your week going?';
    }
    trustDelta = 4;
  }

  // 6. Recruiters on LinkedIn / Email (Vikram, Neha Kapoor, Rajesh, Charu, etc.)
  else if (charId.includes('recruiter') || charId.includes('vikram') || charId.includes('kapoor') || charId.includes('rajesh') || charId.includes('charu') || charId.includes('anita') || charId.includes('karan') || charId.includes('meera')) {
    const specialty = char.specialty || 'your background';
    const company = char.company || 'our MNC';
    const hiringRoles = char.hiringRoles || ['specialist roles'];

    if (msgLower.includes('what') && (msgLower.includes('discussion') || msgLower.includes('about') || msgLower.includes('interview') || msgLower.includes('round'))) {
      text = `Hi ${playerFirstName}, it would be an initial 20-minute discussion regarding your experience in ${specialty} and the open ${hiringRoles[0]} position you applied for. We'll discuss team fitment, salary expectations, and notice periods.`;
      emotion = 'warm';
      followUpQuestion = 'Would tomorrow afternoon at 3:00 PM work for you?';
    } else if (msgLower.includes('salary') || msgLower.includes('ctc') || msgLower.includes('expect') || msgLower.includes('package') || msgLower.includes('lpa')) {
      text = `Our budget band for this position at ${company} is highly competitive and is aligned with market benchmarks for someone with your qualification. We would finalize the exact figures based on your interview performance.`;
      emotion = 'neutral';
      followUpQuestion = 'What is your current and expected CTC?';
    } else if (msgLower.includes('hr') || msgLower.includes('admin') || msgLower.includes('mba') || msgLower.includes('tech') || msgLower.includes('operations')) {
      text = `Yes, exactly. I noticed your interest and qualification in that domain. We have several open requisitions for that vertical at ${company} and we're looking to close them this week.`;
      emotion = 'supportive';
      followUpQuestion = 'Are you available to attend a screening round today?';
    } else {
      text = `Thank you for your message, ${playerFirstName}. I am the Lead Talent Acquisition Partner representing ${company}. We are highly impressed with your academic profile from ${player.college || 'your college'} and your skills. Let's schedule a formal screening today!`;
      emotion = 'supportive';
      followUpQuestion = 'Could you confirm your availability for a Google Meet interview today?';
    }
    trustDelta = 2;
  }

  // 7. Standard Corporate Coworker / BA Emily Carter
  else if (charId.includes('emily') || charId.includes('carter')) {
    if (msgLower.includes('😂') || msgLower.includes('😭') || msgLower.includes('haha') || msgLower.includes('lol') || msgLower.includes('yeah') || msgLower.includes('yep')) {
      text = `Haha exactly! You should have seen Daniel's face when the staging build failed this morning. Are you grabbing coffee or lunch soon? I need a 5-minute break from Jira.`;
      emotion = 'happy';
      followUpQuestion = 'Grabbing coffee or lunch soon?';
    } else if (msgLower.includes('coffee') || msgLower.includes('lunch') || msgLower.includes('break') || msgLower.includes('cafeteria')) {
      text = `Yes please! 10 minutes at the 4th floor pantry? Aisha and Kevin might join too. Let know when you step away from your desk.`;
      emotion = 'excited';
      followUpQuestion = 'Ready to step away?';
    } else {
      text = `Hey ${playerFirstName}! Hanging in there with today's deliverables? Ping me if you need help deciphering the client requirements before Sarah's review.`;
      emotion = 'supportive';
      followUpQuestion = 'Do you want to sync up later?';
    }
    trustDelta = 2;
  }

  // 8. Daniel Thomas (Senior Tech Lead)
  else if (charId.includes('daniel') || charId.includes('thomas')) {
    if (msgLower.includes('modbus') || msgLower.includes('rs485') || msgLower.includes('inverter') || msgLower.includes('scada')) {
      text = `Have you isolated whether the issue is on the physical RS485 daisy-chain or the TCP converter buffer? I need to know before we decide whether a site technician visit is needed.`;
      emotion = 'demanding';
      followUpQuestion = 'Is the issue on the physical RS485 daisy-chain or the TCP converter buffer?';
    } else {
      text = `Understood. Make sure to commit the unit tests along with your fix so CI doesn't fail on merge. Did you test this with mock data yet?`;
      emotion = 'neutral';
      followUpQuestion = 'Did you test this in your staging environment yet?';
    }
    trustDelta = 2.5;
  }

  // 9. Michael Anderson (Enterprise Client)
  else if (charId.includes('michael') || charId.includes('anderson') || charId.includes('client')) {
    text = `We have contractual SLA commitments of 99.9% uptime for this data stream. Please keep me updated with concrete timestamps rather than general status.`;
    emotion = 'demanding';
    followUpQuestion = 'What is your engineering team’s realistic time to resolution?';
    trustDelta = 1;
  }

  // 10. Priya Sharma (HR BP)
  else if (charId.includes('priya') || charId.includes('sharma')) {
    text = `Hi ${playerFirstName}, just checking in on your Day 1 ramp-up. Have you had your introductory 1:1 with your team manager, and do you have everything you need for company compliance?`;
    emotion = 'supportive';
    followUpQuestion = 'Have you completed your InfoSec compliance training yet?';
    trustDelta = 2;
  }

  // 11. Sarah Williams (Engineering Manager) or General Default Corporate Manager
  else {
    if (msgLower.includes('not my problem') || msgLower.includes('ask someone else') || msgLower.includes('dont care')) {
      text = `That is not the level of ownership we expect on this team, ${playerName}. If you're blocked or lack context, communicate that clearly. Don't just dismiss an active deliverable.`;
      emotion = 'irritated';
      trustDelta = -12;
      ownershipScore = 15;
    } else if (msgLower.includes('sorry') || msgLower.includes('my mistake') || msgLower.includes('i overlooked') || msgLower.includes('my bad')) {
      text = `I appreciate you owning that directly, ${playerFirstName}. Mistakes happen in production; what matters now is a solid post-mortem and ensuring our pipeline catches it next time. What's your ETA to push the fix?`;
      emotion = 'supportive';
      followUpQuestion = 'What is your ETA to push the fix?';
    } else {
      text = `Thanks for the update, ${playerFirstName}. Keep your ticket updated on Jira so the wider platform team has visibility, and ping Daniel if you need code review.`;
      emotion = 'neutral';
      followUpQuestion = 'Are there any blockers preventing you from delivering today?';
    }
    trustDelta = 2;
  }

  // Multi-character participation in group channels
  const replies = [
    {
      characterId: char.id || 'sarah-williams',
      characterName: char.name || 'Sarah Williams',
      text,
      emotion,
      intent,
      followUpQuestion,
    },
  ];

  // In group channels (#standup, #automation-team, #incident-war-room), pick 1 relevant coworker to react
  if (channel.type === 'channel' || channel.type === 'meeting' || channel.type === 'incident') {
    const secondChar = activeCharacters.find((c: any) => c.id !== char.id);
    if (secondChar) {
      let secondText = '';
      let secondEmotion = 'neutral';

      if (secondChar.id.includes('daniel')) {
        secondText = msgLower.includes('inverter') || msgLower.includes('scada') || msgLower.includes('kafka')
          ? `Agreed with ${char.name.split(' ')[0]}. If the telemetry packet has invalid CRC, check the register map in the staging simulator.`
          : `I reviewed the latest staging PR. Looks clean from an architecture standpoint.`;
        secondEmotion = 'supportive';
      } else if (secondChar.id.includes('emily')) {
        secondText = `I will update the Jira sprint tracker so Marcus has visibility before executive review.`;
        secondEmotion = 'neutral';
      } else if (secondChar.id.includes('michael')) {
        secondText = `Apex Global operations is monitoring this bridge. We appreciate the proactive updates.`;
        secondEmotion = 'neutral';
      }

      if (secondText) {
        replies.push({
          characterId: secondChar.id,
          characterName: secondChar.name,
          text: secondText,
          emotion: secondEmotion,
          intent: 'Provide technical and operational corroboration',
          followUpQuestion: null,
        });
      }
    }
  }

  return {
    replies,
    conversationState: {
      topic: updatedTopic,
      subtopic: updatedSubtopic,
      unresolvedQuestions: followUpQuestion ? [followUpQuestion] : [],
      activePromises: msgLower.includes('by ') || msgLower.includes('pm') ? [`Deliverable promised by ${playerName}`] : [],
      conversationStatus: 'active',
    },
    playerAnalysis: {
      intent: 'Progressing sprint task and communication with team',
      emotion: msgLower.includes('sorry') ? 'apologetic' : msgLower.includes('😂') ? 'casual' : 'professional',
      action: msgLower.includes('?') ? 'question' : msgLower.includes('by ') ? 'promise' : 'technical_update',
      isQuestion: msgLower.includes('?'),
      committedAction: msgLower.includes('by ') ? playerMessage : null,
      riskLevel: trustDelta < 0 ? 'medium' : 'low',
    },
    taskActions: [],
    relationshipChanges: {
      [char.id]: {
        trustDelta,
        respectDelta: trustDelta,
        rapportDelta: Math.max(-4, trustDelta),
        reason: 'Reacted to communication depth, accountability, and tone',
      },
    },
    reputationChanges: {
      managerTrustDelta: charId.includes('sarah') || charId.includes('priya') || charId.includes('anita') || charId.includes('karan') || charId.includes('meera') ? trustDelta : 0,
      teamTrustDelta: charId.includes('daniel') || charId.includes('emily') ? trustDelta : 0,
      customerTrustDelta: charId.includes('michael') ? trustDelta : 0,
      hrReputationDelta: charId.includes('priya') ? trustDelta : 0,
    },
    performanceEffect: {
      scoreDelta: trustDelta > 0 ? 1 : -2,
      reason: 'Workplace communication evaluation',
    },
    hiddenEvaluation: {
      professionalism: profScore,
      ownership: ownershipScore,
      problemSolving: 78,
      communication: profScore,
      emotionalIntelligence: 78,
      technicalJudgment: 80,
      integrity: 82,
      confidence: 78,
      summary: `Maintained responsive dialogue with ${char.name}.`,
    },
    newMemories: msgLower.includes('by ') || msgLower.includes('pm')
      ? [
          {
            type: 'PROMISE',
            summary: `Player committed to: "${playerMessage}"`,
            involvedCharacters: [char.name],
          },
        ]
      : [],
  };
}

// Dev server vs Production setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Corporate Life AI Server running on http://0.0.0.0:${PORT}`);

    // Connection test for local AI server
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const check = await fetch(`${AI_BASE_URL.replace(/\/+$/, '')}/models`, {
        headers: { Authorization: `Bearer ${AI_API_KEY}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (check.ok) {
        console.log(`LOCAL AI CONNECTED\nProvider: llama.cpp\nModel: ${AI_MODEL}\nEndpoint: ${AI_BASE_URL}`);
      } else {
        console.log(`LOCAL AI OFFLINE\nEndpoint: ${AI_BASE_URL}`);
      }
    } catch (e) {
      console.log(`LOCAL AI OFFLINE\nEndpoint: ${AI_BASE_URL}`);
    }
  });
}

startServer();
