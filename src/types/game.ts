import { CandidateProfile, JobApplication, JobOffer, JobOpening } from './jobMarket';
import { PersonalLifeState } from './smartphone';
import { PersonalCareerProfile } from './careerIntelligence';

export type Priority = 'SEV-1' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'REVIEW' | 'DONE';
export type ChannelType = 'direct' | 'channel' | 'meeting' | 'incident';
export type DifficultyLevel = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Executive';
export type CareerStage = 'JOB_SEARCH' | 'PROBATION' | 'CONFIRMED' | 'LEADERSHIP' | 'EXECUTIVE' | 'PIP' | 'TERMINATED' | 'RESIGNED';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface EscalationPath {
  problemType: string;
  targetRole: string;
  targetDepartment: string;
  targetCharacterId: string;
  targetCharacterName: string;
  description: string;
}

export interface JobRoleProfile {
  job_title: string;
  department: string;
  seniority: 'Associate / Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Manager' | 'Executive';
  job_description: string;
  primary_responsibilities: string[];
  secondary_responsibilities: string[];
  allowed_tasks: string[];
  restricted_tasks: string[];
  required_skills: string[];
  optional_skills: string[];
  tools: string[];
  technologies: string[];
  protocols: string[];
  kpis: string[];
  typical_projects: string[];
  common_problems: string[];
  escalation_roles: EscalationPath[];
  reports_to: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  company?: string;
  title: string;
  level: number;
  department: string;
  managerId: string;
  team: string;
  location: string;
  email: string;
  salary: number;
  currency: string;
  probationDaysLeft: number;
  probationPassed: boolean;
  joiningDate: string;
  xp: number;
  nextLevelXp: number;
  performanceScore: number;
  productivity: number;
  quality: number;
  communication: number;
  technicalSkills: number;
  leadership: number;
  reliability: number;
  teamwork: number;
  achievements: Achievement[];
  roleProfile?: JobRoleProfile;
}

export interface Reputation {
  managerTrust: number;
  teamTrust: number;
  customerTrust: number;
  professionalReputation: number;
  hrReputation: number;
}

export interface Character {
  id: string;
  name: string;
  age: number;
  role: string;
  department: string;
  avatar: string;
  color: string;
  personality: string;
  communicationStyle: string;
  quirks: string;
  trust: number;
  respect: number;
  rapport: number;
  friendship?: number;
  memories: string[];
  isOnline: boolean;
  statusText?: string;
  currentMood?: 'happy' | 'neutral' | 'curious' | 'confused' | 'concerned' | 'impatient' | 'frustrated' | 'impressed' | 'disappointed' | 'excited' | 'nervous' | 'angry' | 'relieved' | 'supportive';
  individualMemories?: string[];
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  emotion?: string;
  intent?: string;
  isPlayer?: boolean;
  followUpQuestion?: string;
  isSystemEvent?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  participantIds: string[];
  topic?: string;
  subtopic?: string;
  conversationStatus?: 'active' | 'resolving' | 'escalated' | 'idle';
  unresolvedQuestions?: string[];
  activePromises?: string[];
  unreadCount: number;
  incidentSeverity?: string;
}

export interface EmailThreadItem {
  sender: string;
  body: string;
  timestamp: string;
}

export interface Email {
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
  thread: EmailThreadItem[];
  requiresReply: boolean;
  replied: boolean;
}

export interface TrainingGuide {
  conceptTitle: string;
  summary: string;
  realWorldContext: string;
  keySteps: Array<{
    stepNumber: number;
    title: string;
    explanation: string;
    codeSnippet?: string;
    commonMistakeToAvoid?: string;
  }>;
  interactiveQuiz: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanationOnCorrect: string;
  };
  commandsToExecute: Array<{
    command: string;
    description: string;
    expectedOutput: string;
  }>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department?: string;
  owner_role?: string;
  assigned_employee?: string;
  required_skills?: string[];
  required_tools?: string[];
  priority: Priority;
  deadlineDay: number;
  deadlineHour: string;
  status: TaskStatus;
  estimatedHours: number;
  stakeholders: string[];
  impact: string;
  technicalContext?: string;
  trainingGuide?: TrainingGuide;
  isTrainingCompleted?: boolean;
  dependencies?: string[];
  escalation_role?: string;
  escalation_department?: string;
  isEscalated?: boolean;
  escalationResolution?: string;
}

export interface Incident {
  active: boolean;
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  description: string;
  slaMinutesRemaining: number;
  affectedServices: string[];
  customerEscalationLevel: number;
  logs: string[];
  status: 'ACTIVE' | 'MITIGATING' | 'RESOLVED';
}

export interface GameMemory {
  id: string;
  day: number;
  type: 'PROMISE' | 'MISTAKE' | 'ACHIEVEMENT' | 'CONFLICT' | 'DEADLINE' | 'DECISION';
  summary: string;
  involvedCharacters: string[];
  status: 'ACTIVE' | 'HONORED' | 'BROKEN';
}

export interface PerformanceReview {
  id: string;
  month: number;
  overallRating: number;
  strengths: string[];
  areasToImprove: string[];
  managerComment: string;
  hrComment: string;
  careerRecommendation: string;
  salaryIncrementOffered: number;
  promoted: boolean;
  newLevel?: number;
  newTitle?: string;
  accepted: boolean;
  timestamp: string;
}

export interface HiddenEvaluation {
  turnId: string;
  timestamp: string;
  professionalism: number;
  ownership: number;
  problemSolving: number;
  communication: number;
  emotionalIntelligence: number;
  technicalJudgment: number;
  integrity: number;
  confidence: number;
  summary: string;
}

export interface CareerEnding {
  id: string;
  title: string;
  badge: string;
  description: string;
  date: string;
  type: 'VICTORY' | 'TRAGEDY' | 'AVERAGE';
  quote: string;
}

export interface NewsAction {
  id: string;
  label: string;
  description: string;
  reputationImpact: {
    managerTrustDelta: number;
    professionalReputationDelta: number;
    teamTrustDelta?: number;
    customerTrustDelta?: number;
  };
  xpGain: number;
  memorySummary: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: 'Cloud & Infrastructure' | 'AI & Enterprise Software' | 'Cybersecurity & Regulations' | 'Market & Economy';
  relevanceToNexora: string;
  sourceName: string;
  sourceUrl?: string;
  publishedTime: string;
  actions: NewsAction[];
  actionTaken?: string;
}

export interface GameState {
  player: PlayerProfile;
  reputation: Reputation;
  characters: Character[];
  channels: Channel[];
  messages: Record<string, Message[]>;
  emails: Email[];
  tasks: Task[];
  incident: Incident;
  reviews: PerformanceReview[];
  memories: GameMemory[];
  evaluations: HiddenEvaluation[];
  newsItems?: NewsItem[];
  candidateProfile?: CandidateProfile;
  applications?: JobApplication[];
  offers?: JobOffer[];
  isHired: boolean;
  currentDay: number;
  currentHour: number;
  currentMinute: number;
  difficulty: DifficultyLevel;
  careerStage: CareerStage;
  activeEnding?: CareerEnding;
  isRomanceModeEnabled: boolean;
  gameStarted: boolean;
  personalLife?: PersonalLifeState;
  personalCareerProfile?: PersonalCareerProfile;
}
