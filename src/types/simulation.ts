export type MemoryType = 'PERSONAL' | 'SHARED' | 'PRIVATE' | 'WORLD' | 'SOCIAL_GOSSIP';

export type MemoryVisibility = 'PUBLIC' | 'TEAM' | 'DEPARTMENT' | 'PRIVATE' | 'CONFIDENTIAL' | 'CHARACTER_ONLY';

export interface MemoryCommitment {
  id: string;
  ownerId: string;
  recipientId: string;
  action: string;
  deadline: string;
  status: 'PENDING' | 'HONORED' | 'BROKEN';
  createdTimestamp: string;
  resolvedTimestamp?: string;
}

export interface SimulationMemory {
  id: string;
  ownerId: string; // The character who holds or experienced this memory
  sourceId?: string; // Who originated this memory
  knownByIds: string[]; // List of character IDs who know this memory
  type: MemoryType;
  visibility: MemoryVisibility;
  topic: string;
  content: string;
  confidence: number; // 0 - 100 (100 for verified facts, lower for rumors/gossip)
  importance: number; // 1 - 10
  timestamp: string;
  isSecret?: boolean;
  commitment?: MemoryCommitment;
  relatedCharacters: string[];
}

export interface GossipEvent {
  id: string;
  sourceCharacterId: string;
  recipientCharacterId: string;
  subjectCharacterId: string;
  information: string;
  confidence: number;
  timestamp: string;
  isConfirmed: boolean;
  spreadCount: number;
}

export interface RelationshipMetrics {
  trust: number; // 0-100
  respect: number; // 0-100
  liking: number; // 0-100
  friendship: number; // 0-100
  professionalRelationship: number; // 0-100
  romanticInterest: number; // 0-100
  conflict: number; // 0-100
  reliability: number; // 0-100
  opinions: string[];
  secretsKnown: string[];
  lastInteraction?: string;
}

export interface CharacterPersonality {
  vocabulary: string;
  responseLength: 'short' | 'medium' | 'detailed';
  humor: number; // 1-10
  patience: number; // 1-10
  directness: number; // 1-10
  riskTolerance: number; // 1-10
  empathy: number; // 1-10
  ambition: number; // 1-10
}

export interface CharacterScheduleItem {
  timeStart: string;
  timeEnd: string;
  activity: 'commuting' | 'working' | 'in_meeting' | 'lunch' | 'personal_time' | 'on_leave' | 'sleeping';
  location: string;
  statusText: string;
}

export interface SimulationCharacter {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  company: string;
  department: string;
  job_title: string;
  seniority: string;
  managerId?: string;
  avatar: string;
  color: string;
  personality: CharacterPersonality;
  communicationStyle: string;
  values: string[];
  goals: string[];
  fears: string[];
  currentMood: 'happy' | 'neutral' | 'stressed' | 'anxious' | 'confident' | 'frustrated' | 'relieved' | 'curious' | 'disappointed' | 'suspicious';
  currentActivity: 'working' | 'in_meeting' | 'commuting' | 'lunch' | 'personal_time' | 'on_leave' | 'sleeping';
  knowledgeBoundaries: string[]; // List of topic keywords or scopes character is authorized to know
  relationships: Record<string, RelationshipMetrics>;
  schedule: CharacterScheduleItem[];
  isOnline: boolean;
  statusText: string;
}

export interface AIModelRouterLog {
  id: string;
  timestamp: string;
  modelUsed: string;
  tier: 'high_reasoning' | 'workhorse' | 'lightweight';
  latencyMs: number;
  routingReason: string;
  channel: string;
  speakerId: string;
  promptTokensEstimate?: number;
  toolCallsExecuted: string[];
}

export interface FinancialTransaction {
  id: string;
  senderName: string;
  recipientName: string;
  amount: number;
  currency: string;
  purpose: string;
  timestamp: string;
  status: 'PAID' | 'FAILED' | 'PENDING';
  receiptId: string;
  category: 'SALARY' | 'BILLS' | 'TRANSFER' | 'SHOPPING' | 'FOOD' | 'TRAVEL';
}

export interface BillPaymentItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  dueDate: string;
  category: 'UTILITIES' | 'RENT' | 'SUBSCRIPTION' | 'CREDIT_CARD';
  status: 'UNPAID' | 'PAID';
  paidAt?: string;
  receiptId?: string;
}
