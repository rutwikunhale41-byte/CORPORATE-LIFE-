import {
  UniversalConversationRequest,
  UniversalAiResponse,
  GroupConversationDecision,
  ConversationTurnMessage,
} from '../types/aiConversation';
import { memorySystem } from './memorySystem';
import { gossipEngine } from './gossipEngine';
import { GameState, Character } from '../types/game';
import { embeddedLocalAIProvider, AIProvider, AIProviderStatus } from './aiInference';

/**
 * UniversalAiEngine
 * 
 * Central In-Game AI Controller
 * Architecture:
 *   Game Systems -> UniversalAiEngine -> AIProvider -> Embedded Local AI Runtime -> LFM2.5
 * 
 * Completely decoupled from localhost HTTP servers, external bridges, and cloud backends.
 */
class UniversalAiEngine {
  private lastLatencyMs: number = 0;
  private totalTokensGenerated: number = 0;
  private provider: AIProvider = embeddedLocalAIProvider;

  constructor() {
    this.checkConnection();
  }

  public async checkConnection(): Promise<{
    connected: boolean;
    model: string;
    latencyMs: number;
    message: string;
    providerStatus: AIProviderStatus;
  }> {
    const status = this.provider.getStatus();
    const isReady = status.isReady;

    return {
      connected: isReady,
      model: status.model,
      latencyMs: this.lastLatencyMs,
      message: status.description,
      providerStatus: status,
    };
  }

  public getStats() {
    const status = this.provider.getStatus();
    return {
      connected: status.isReady,
      model: status.model,
      latencyMs: this.lastLatencyMs,
      tokens: this.totalTokensGenerated,
      memoryCount: memorySystem.getAllMemories().length,
      platform: status.platform,
    };
  }

  public getProvider(): AIProvider {
    return this.provider;
  }

  /**
   * Raw completion interface for game sub-systems (email evaluation, performance review, tasks).
   * Directly routes to the embedded local AI provider.
   */
  public async generateRawCompletion(params: {
    systemInstruction: string;
    prompt: string;
    temperature?: number;
    max_tokens?: number;
  }): Promise<{ content: string; model: string }> {
    const res = await this.provider.generateResponse(
      [
        { role: 'system', content: params.systemInstruction },
        { role: 'user', content: params.prompt },
      ],
      {
        temperature: params.temperature,
        maxTokens: params.max_tokens,
      }
    );
    return {
      content: res.content,
      model: res.model,
    };
  }

  /**
   * PRIMARY UNIVERSAL AI CONVERSATION METHOD
   * Every in-game conversational system (WhatsApp, Instagram, Snapchat, Email,
   * Work chat, Recruiter chat, Interviews, Meetings) flows through this method.
   */
  public async generateCharacterReply(
    params: UniversalConversationRequest,
    gameState: GameState,
    conversationHistory: ConversationTurnMessage[] = []
  ): Promise<UniversalAiResponse> {
    const { playerMessage, characterId, app, context } = params;

    // 1. Resolve Target Character
    const character = gameState.characters.find(c => c.id === characterId) || {
      id: characterId,
      name: characterId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      age: 28,
      role: 'Colleague',
      department: 'Enterprise Operations',
      personality: 'Professional and collaborative',
      communicationStyle: 'Direct and concise',
      trust: 60,
      respect: 60,
      rapport: 60,
      currentMood: 'neutral',
    };

    // 2. Retrieve ONLY memories accessible to this character (Strict Information Boundaries)
    const relevantMemories = memorySystem.retrieveRelevantMemories({
      characterId: character.id,
      query: playerMessage,
      limit: 5,
      appContext: app,
    });

    // 3. Extract recent messages (sliding window for local model efficiency)
    const recentMessages = conversationHistory.slice(-8);

    const systemInstruction = `You are the authentic character "${character.name}" in a living life & career simulator game.
Role: ${character.role}, Department: ${character.department}.
Personality: ${character.personality}.
Communication Style: ${character.communicationStyle}.
Current Mood: ${character.currentMood || 'neutral'}.
Relationship with Player: Trust ${character.trust}/100, Respect ${character.respect}/100, Rapport ${character.rapport}/100.
Medium: ${app}

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
Name: ${gameState.player.name}
Title: ${gameState.player.title} (${gameState.player.department})
Company: ${gameState.player.company}
Location: ${gameState.player.location}

CURRENT SITUATION:
App/Medium: ${app}
Time: Day ${gameState.currentDay}, ${gameState.currentHour.toString().padStart(2, '0')}:${gameState.currentMinute.toString().padStart(2, '0')}
Incident: ${gameState.incident.active ? gameState.incident.title : 'None'}
Location: ${context?.location || 'Office / Hybrid Workspace'}

CHARACTER'S MEMORIES (What ${character.name} personally knows):
${(relevantMemories || []).map((m: any) => `- [${m.type}] ${m.content} (Source: ${m.source})`).join('\n') || 'No previous specific memories recorded.'}

RECENT CONVERSATION HISTORY:
${(recentMessages || []).map((m: any) => `${m.senderName}: "${m.text}"`).join('\n') || 'Start of conversation.'}

NEW MESSAGE FROM ${gameState.player.name}:
"${playerMessage}"

Generate ${character.name}'s authentic JSON response:`;

    const startTime = Date.now();

    try {
      const messages = [
        { role: 'system' as const, content: systemInstruction },
        ...recentMessages.map(m => ({
          role: (m.senderName === gameState.player.name ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        })),
        { role: 'user' as const, content: prompt },
      ];

      const result = await this.provider.generateResponse(messages, {
        characterId: character.id,
        characterName: character.name,
        role: character.role,
        department: character.department,
        mood: character.currentMood,
        app,
        temperature: 0.7,
        maxTokens: 350,
      });

      this.lastLatencyMs = Date.now() - startTime;
      this.totalTokensGenerated += 120;

      // Safe JSON output cleaner
      let cleaned = (result.content || '').trim();
      const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        cleaned = codeBlockMatch[1].trim();
      } else {
        const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
        if (jsonMatch) {
          cleaned = jsonMatch[1].trim();
        }
      }

      const aiResponse: UniversalAiResponse = JSON.parse(cleaned);

      // Post-process: Add new memory candidates to memorySystem
      if (aiResponse.memory_candidates && aiResponse.memory_candidates.length > 0) {
        aiResponse.memory_candidates.forEach(cand => {
          memorySystem.addMemory({
            characterId: character.id,
            type: cand.type,
            content: cand.content,
            importance: cand.importance,
            source: `conversation_on_${app}`,
            visibility: cand.visibility,
            relatedCharacterIds: cand.related_character_ids,
            confidence: cand.confidence,
            appContext: app,
            timeStr: `Day ${gameState.currentDay}, ${gameState.currentHour}:${gameState.currentMinute}`,
          });
        });
      }

      // Post-process: Handle gossip generation
      if (aiResponse.gossip_candidates && aiResponse.gossip_candidates.length > 0) {
        aiResponse.gossip_candidates.forEach(g => {
          gossipEngine.addFact({
            originCharacterId: character.id,
            subjectCharacterId: g.targetCharacterId,
            content: g.rumorContent,
            isSecret: false,
            importance: 7,
            initialKnownBy: [character.id],
          });
        });
      }

      return aiResponse;
    } catch (err: any) {
      console.warn('[UniversalAiEngine] Embedded Local AI runtime response:', err?.message || err);

      return {
        message: "Embedded Local AI (LFM2.5) is awaiting standalone native packaging (Windows .exe or Android .apk).",
        emotion: 'worried',
        intent: 'offline_alert',
        topic: 'connection',
        follow_up_required: false,
        follow_up_question: null,
        memory_candidates: [],
        conversation_status: 'idle',
      };
    }
  }

  /**
   * Autonomous Group Chat Turn Generation
   */
  public async generateGroupChatDecisions(params: {
    channelId: string;
    topic: string;
    participants: Character[];
    lastMessage: { senderName: string; text: string };
    recentMessages: ConversationTurnMessage[];
    gameState: GameState;
  }): Promise<GroupConversationDecision[]> {
    const decisions: GroupConversationDecision[] = [];
    const textLower = params.lastMessage.text.toLowerCase();

    for (const p of params.participants) {
      if (p.name === params.lastMessage.senderName) continue;

      const isDirectlyAddressed = textLower.includes(p.name.toLowerCase().split(' ')[0]);
      const isRoleRelevant =
        (textLower.includes('sla') || textLower.includes('outage') || textLower.includes('db')) &&
        (p.department.includes('Cloud') || p.department.includes('Engineering'));
      const isHrRelevant =
        (textLower.includes('policy') || textLower.includes('leave') || textLower.includes('offer')) &&
        p.department.includes('People');

      const shouldSpeak = isDirectlyAddressed || isRoleRelevant || isHrRelevant || Math.random() < 0.25;

      if (shouldSpeak) {
        let reply = `I agree with this point. Let's make sure we track the next milestone closely.`;
        if (p.id === 'deepak-joshi') {
          reply = `From a technical standpoint, that makes sense. Let's double check our connection pool limits before applying.`;
        } else if (p.id === 'sneha-rao') {
          reply = `Understood. Keep me posted on any SLA risks or blockers immediately.`;
        } else if (p.id === 'ananya-iyer') {
          reply = `Makes sense! I'll update the stakeholder backlog accordingly.`;
        }

        decisions.push({
          characterId: p.id,
          characterName: p.name,
          shouldSpeak: true,
          reasonForSilenceOrSpeaking: isDirectlyAddressed ? 'Directly mentioned by name' : 'Role-relevant subject expertise',
          reply,
          emotion: 'focused',
          reactionEmoji: '👍',
        });
      } else {
        decisions.push({
          characterId: p.id,
          characterName: p.name,
          shouldSpeak: false,
          reasonForSilenceOrSpeaking: 'No immediate comment required; actively listening',
        });
      }
    }

    return decisions;
  }
}

export const universalAiEngine = new UniversalAiEngine();
