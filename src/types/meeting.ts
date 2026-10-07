export type ResponseStyle = 'passive' | 'assertive' | 'collaborative';

export type MeetingType =
  | 'standup'
  | 'tech-triage'
  | 'client-review'
  | 'one-on-one'
  | 'retro'
  | 'incident-war-room';

export interface MeetingImpact {
  managerTrustDelta: number;
  teamTrustDelta: number;
  customerTrustDelta: number;
  hrReputationDelta: number;
}

export interface CharacterRelImpact {
  trustDelta: number;
  respectDelta: number;
  rapportDelta: number;
  reason: string;
}

export interface PerformanceEvaluationImpact {
  leadershipDelta: number;
  ownershipDelta: number;
  communicationDelta: number;
  problemSolvingDelta: number;
  summary: string;
}

export interface MeetingOption {
  style: ResponseStyle;
  label: string;
  dialogue: string;
  rationale: string;
  immediateReaction: string;
  speakerReactionId: string;
  reactionEmotion: 'happy' | 'neutral' | 'curious' | 'demanding' | 'impressed' | 'disappointed' | 'supportive' | 'impatient' | 'concerned' | 'skeptical' | 'irritated';
  reputationImpact: MeetingImpact;
  relationshipImpact: Record<string, CharacterRelImpact>;
  performanceEvaluation: PerformanceEvaluationImpact;
  consequenceToast: string;
}

export interface SlideContext {
  title: string;
  subtitle: string;
  bullets: string[];
  tag: string;
  metricBadge?: { label: string; value: string; isAlert?: boolean };
}

export interface MeetingAgendaRound {
  roundNumber: number;
  phaseTitle: string;
  speaker: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    color: string;
  };
  speakerPrompt: string;
  slideContext?: SlideContext;
  options: Record<ResponseStyle, MeetingOption>;
}

export interface MeetingAttendee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  department: string;
}

export interface MeetingSession {
  id: string;
  calendarEventId: string;
  title: string;
  type: MeetingType;
  hour: number;
  minute: number;
  timeString: string;
  durationMinutes: number;
  channelId: string;
  organizer: {
    id: string;
    name: string;
    role: string;
  };
  attendees: MeetingAttendee[];
  description: string;
  location: string;
  agendaRounds: MeetingAgendaRound[];
}

export interface MeetingColleagueDebrief {
  characterId: string;
  characterName: string;
  role: string;
  avatar: string;
  color: string;
  reactionComment: string;
  trustDelta: number;
  respectDelta: number;
  rapportDelta: number;
}

export interface MeetingDebrief {
  meetingId: string;
  title: string;
  type: MeetingType;
  durationMinutes: number;
  turnsPlayed: Array<{
    roundNumber: number;
    chosenStyle: ResponseStyle;
    playerSpeech: string;
  }>;
  styleDistribution: {
    passive: number;
    assertive: number;
    collaborative: number;
  };
  primaryStyle: ResponseStyle;
  colleagueDebriefs: MeetingColleagueDebrief[];
  reputationDeltas: MeetingImpact;
  performanceImpact: {
    overallRatingDelta: number;
    leadershipScore: number;
    ownershipScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    evaluationSummary: string;
  };
  minutesSummary: string[];
  actionItems: string[];
  timestamp: string;
}
