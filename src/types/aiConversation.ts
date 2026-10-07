export type MemoryCategory =
  | 'PERSONAL_MEMORY'
  | 'CONVERSATION_MEMORY'
  | 'RELATIONSHIP_MEMORY'
  | 'WORK_MEMORY'
  | 'SOCIAL_MEMORY'
  | 'WORLD_MEMORY'
  | 'PRIVATE_MEMORY'
  | 'SHARED_MEMORY'
  | 'GOSSIP_MEMORY'
  | 'PROMISE_COMMITMENT_MEMORY';

export type MemoryVisibility = 'PRIVATE' | 'SHARED' | 'PUBLIC';

export interface NpcMemory {
  id: string;
  character_id: string;
  type: MemoryCategory;
  content: string;
  importance: number; // 1 to 10
  created_at: string;
  last_referenced: string;
  source: string; // e.g. 'direct_conversation', 'sarah_told_me', 'observed', 'email'
  visibility: MemoryVisibility;
  related_character_ids: string[];
  confidence: number; // 0.0 to 1.0
  app_context?: string;
  emotional_valence?: number; // -5 to +5
}

export type ConversationAppType =
  | 'whatsapp'
  | 'instagram'
  | 'snapchat'
  | 'facebook'
  | 'linkedin'
  | 'dating'
  | 'phone_call'
  | 'email'
  | 'workplace_chat'
  | 'recruiter_chat'
  | 'interview'
  | 'manager_meeting'
  | 'group_chat'
  | 'standup'
  | 'incident_war_room';

export interface ConversationTurnMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  emotion?: string;
  intent?: string;
  isPlayer?: boolean;
  appContext?: ConversationAppType;
}

export interface UniversalConversationRequest {
  playerMessage: string;
  characterId: string;
  conversationId: string;
  app: ConversationAppType;
  context?: {
    location?: string;
    peoplePresent?: string[];
    ongoingTaskId?: string;
    activeIncidentId?: string;
    callType?: 'incoming' | 'outgoing';
    interviewRound?: string;
    jobTitle?: string;
    company?: string;
    socialPostId?: string;
    mediaAttached?: string;
    transactionAmount?: number;
    transactionPurpose?: string;
  };
  worldState?: {
    currentDay: number;
    currentHour: number;
    currentMinute: number;
    company: string;
    difficulty: string;
  };
}

export interface UniversalAiResponse {
  message: string;
  emotion: string;
  intent: string;
  topic: string;
  follow_up_required: boolean;
  follow_up_question?: string | null;
  memory_candidates: Array<{
    type: MemoryCategory;
    content: string;
    importance: number;
    visibility: MemoryVisibility;
    related_character_ids: string[];
    confidence: number;
  }>;
  relationship_change?: {
    trustDelta?: number;
    respectDelta?: number;
    rapportDelta?: number;
    attractionDelta?: number;
    conflictDelta?: number;
    reason?: string;
  };
  gossip_candidates?: Array<{
    targetCharacterId: string;
    rumorContent: string;
    probability: number;
  }>;
  call_availability?: {
    status: 'ANSWERED' | 'BUSY' | 'DECLINED' | 'MISSED' | 'VOICEMAIL';
    reason?: string;
  };
  interview_evaluation?: {
    technicalScore: number;
    cultureScore: number;
    detectedInconsistencies?: string[];
    decision?: 'ADVANCE' | 'REJECT' | 'NEUTRAL' | 'OFFER';
    feedbackNotes?: string;
  };
  conversation_status: 'active' | 'resolved' | 'idle' | 'escalated';
}

export interface GroupConversationDecision {
  characterId: string;
  characterName: string;
  shouldSpeak: boolean;
  reasonForSilenceOrSpeaking: string;
  reply?: string;
  emotion?: string;
  reactionEmoji?: string;
  interrupts?: boolean;
}

export interface AutonomousNpcInteraction {
  id: string;
  characterAId: string;
  characterBId: string;
  topic: string;
  summary: string;
  dialogue: Array<{ senderId: string; text: string; emotion: string }>;
  gossipTransferred?: {
    aboutCharacterId: string;
    fact: string;
    wasSecret: boolean;
  };
  timestamp: string;
  day: number;
}
