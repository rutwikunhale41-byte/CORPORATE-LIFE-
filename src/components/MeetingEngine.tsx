import React from 'react';
import { InteractiveMeetingModal } from './meetings/InteractiveMeetingModal';
import { MeetingSession, MeetingDebrief, ResponseStyle } from '../types/meeting';
import { GameState, Task, Email, HiddenEvaluation, GameMemory } from '../types/game';
import { SCHEDULED_MEETINGS } from '../data/meetingsData';
import { parseMeetingOutcome, ParsedMeetingOutcome } from '../services/meetingOutcomeParser';

export interface MeetingEngineProps {
  meeting: MeetingSession;
  gameState: GameState;
  onClose: () => void;
  onCompleteMeeting: (debrief: MeetingDebrief) => void;
  onUpdateGameState?: (updater: (prev: GameState) => GameState) => void;
  hasGeminiKey?: boolean;
}

export interface OutcomeParserResult {
  updatedGameState: GameState;
  newTasks: Task[];
  newEmails: Email[];
  summaryMessage: string;
}

/**
 * outcomeParser:
 * Analyzes the selected player response style ('passive', 'assertive', or 'collaborative')
 * and produces follow-up side effects on the game state:
 * - If Assertive: generates new high-priority tasks for the player in Jira.
 * - If Collaborative: generates a thank-you email thread from a colleague to the team.
 * - Updates PerformanceView evaluations and colleague relationship variables.
 */
export function outcomeParser(
  debrief: MeetingDebrief,
  gameState: GameState
): OutcomeParserResult {
  const { currentDay, currentHour, player } = gameState;
  const parsed = parseMeetingOutcome(debrief, player, currentDay, currentHour);
  const primaryStyle = debrief.primaryStyle;
  const timestampStr = `Day ${currentDay}, ${currentHour.toString().padStart(2, '0')}:00`;
  const playerShortName = player.name.split(' ')[0] || 'Rutwik';
  const playerEmail = player.email || `${playerShortName.toLowerCase()}@nexoraglobal.com`;

  let newTasks: Task[] = [...parsed.tasks];
  let newEmails: Email[] = [...parsed.emails];

  // Specific side-effect guarantees:
  // 1. If Assertive: Guarantee at least one explicit HIGH-priority task
  if (primaryStyle === 'assertive') {
    const hasHighPriority = newTasks.some(t => t.priority === 'HIGH' || t.priority === 'SEV-1');
    if (!hasHighPriority) {
      newTasks.unshift({
        id: `TASK-ASSERTIVE-${Date.now()}`,
        title: `Deliver Actionable Findings on ${debrief.title}`,
        description: `Execute the technical commitments made during ${debrief.title} and verify pipeline stability.`,
        priority: 'HIGH',
        deadlineDay: currentDay,
        deadlineHour: '17:00',
        status: 'IN_PROGRESS',
        estimatedHours: 3,
        stakeholders: ['Sneha Rao', 'Deepak Joshi'],
        impact: 'Demonstrates technical leadership and ownership of critical deliverables.',
      });
    }
  }

  // 2. If Collaborative: Guarantee a colleague thank-you email thread to the team
  if (primaryStyle === 'collaborative') {
    const thankYouEmail: Email = {
      id: `email-thankyou-${Date.now()}`,
      fromId: 'ananya-iyer',
      fromName: 'Ananya Iyer (Senior BA)',
      fromEmail: 'ananya.iyer@nexoraglobal.com',
      toEmail: `${playerEmail}, automation-team@nexoraglobal.com`,
      subject: `Thank you: Great collaboration during ${debrief.title}!`,
      body: `Hi ${playerShortName} & Team,\n\nJust wanted to send a quick note of thanks for your collaborative attitude during today's session (${debrief.title}). Taking the time to align on cross-functional dependencies and pairing with the team makes a huge difference to sprint velocity.\n\nLooking forward to crushing the release together!\n\nBest,\nAnanya Iyer\nSenior Business Analyst | Automation Platform`,
      timestamp: timestampStr,
      isRead: false,
      isFlagged: false,
      thread: [
        {
          sender: 'Ananya Iyer',
          body: `Super smooth alignment in the meeting today. Let's keep this momentum going!`,
          timestamp: timestampStr,
        },
      ],
      requiresReply: false,
      replied: false,
    };
    newEmails.unshift(thankYouEmail);
  }

  // 3. Update character relationship deltas and moods
  const updatedCharacters = gameState.characters.map(char => {
    const colleague = debrief.colleagueDebriefs.find(c => c.characterId === char.id);
    if (!colleague) return char;

    const newTrust = Math.min(100, Math.max(0, char.trust + colleague.trustDelta));
    const newRespect = Math.min(100, Math.max(0, char.respect + colleague.respectDelta));
    const newRapport = Math.min(100, Math.max(0, char.rapport + colleague.rapportDelta));
    const newMood =
      colleague.respectDelta > 2
        ? 'impressed'
        : colleague.rapportDelta > 2
        ? 'happy'
        : char.currentMood;

    return {
      ...char,
      trust: newTrust,
      respect: newRespect,
      rapport: newRapport,
      currentMood: newMood as any,
      memories: [
        ...char.memories,
        `Attended ${debrief.title}: ${colleague.reactionComment}`,
      ],
    };
  });

  // 4. Update reputation
  const newReputation = {
    ...gameState.reputation,
    managerTrust: Math.min(
      100,
      Math.max(0, gameState.reputation.managerTrust + debrief.reputationDeltas.managerTrustDelta)
    ),
    teamTrust: Math.min(
      100,
      Math.max(0, gameState.reputation.teamTrust + debrief.reputationDeltas.teamTrustDelta)
    ),
    customerTrust: Math.min(
      100,
      Math.max(0, gameState.reputation.customerTrust + debrief.reputationDeltas.customerTrustDelta)
    ),
    hrReputation: Math.min(
      100,
      Math.max(0, gameState.reputation.hrReputation + debrief.reputationDeltas.hrReputationDelta)
    ),
  };

  // 5. Create hidden evaluation for PerformanceView 360 review
  const newEval: HiddenEvaluation = {
    turnId: `eval-meet-${Date.now()}`,
    timestamp: `Day ${currentDay}, ${debrief.timestamp}`,
    professionalism: Math.min(
      100,
      Math.max(20, 80 + (primaryStyle === 'passive' ? -5 : 10))
    ),
    ownership: Math.min(100, Math.max(20, 75 + debrief.performanceImpact.ownershipScore)),
    problemSolving: Math.min(
      100,
      Math.max(20, 75 + debrief.performanceImpact.problemSolvingScore)
    ),
    communication: Math.min(
      100,
      Math.max(20, 75 + debrief.performanceImpact.communicationScore)
    ),
    emotionalIntelligence:
      primaryStyle === 'collaborative' ? 95 : primaryStyle === 'assertive' ? 80 : 70,
    technicalJudgment:
      primaryStyle === 'assertive' ? 92 : primaryStyle === 'collaborative' ? 86 : 72,
    integrity: 90,
    confidence:
      primaryStyle === 'assertive' ? 95 : primaryStyle === 'collaborative' ? 88 : 50,
    summary: `[Meeting: ${debrief.title}] ${debrief.performanceImpact.evaluationSummary}`,
  };

  // 6. Game Memory
  const newMemory: GameMemory = {
    id: `mem-meet-${Date.now()}`,
    day: currentDay,
    type: primaryStyle === 'assertive' ? 'DECISION' : 'ACHIEVEMENT',
    summary: `Participated in ${debrief.title} with a ${primaryStyle.toUpperCase()} stance. ${debrief.performanceImpact.evaluationSummary.slice(0, 110)}...`,
    involvedCharacters: debrief.colleagueDebriefs.map(c => c.characterName),
    status: 'ACTIVE',
  };

  // 7. Meeting Minutes email
  const organizerName = debrief.title.includes('Client') ? 'Vikramaditya Singhania' : 'Sneha Rao';
  const organizerEmail = debrief.title.includes('Client')
    ? 'vikramaditya.singhania@apexglobal.com'
    : 'sneha.rao@nexoraglobal.com';

  const minutesEmail: Email = {
    id: `email-meeting-${Date.now()}`,
    fromId: 'sneha-rao',
    fromName: organizerName,
    fromEmail: organizerEmail,
    toEmail: playerEmail,
    subject: `Meeting Minutes: ${debrief.title}`,
    body: `Hi Team,\n\nHere are the synthesized meeting minutes from today's session (${debrief.title}):\n\n${debrief.minutesSummary.join('\n\n')}\n\nAction Items:\n${debrief.actionItems.map(a => `• ${a}`).join('\n')}\n\nBest regards,\n${organizerName}`,
    timestamp: debrief.timestamp,
    isRead: false,
    isFlagged: false,
    thread: [],
    requiresReply: false,
    replied: false,
  };

  // 8. Merge messages
  const targetChannel =
    debrief.meetingId === 'meeting-client-review'
      ? 'direct-vikramaditya'
      : debrief.meetingId === 'meeting-standup'
      ? 'channel-standup'
      : 'direct-sneha';

  const defaultChatMessage = {
    id: `msg-meet-${Date.now()}`,
    channelId: targetChannel,
    senderId: 'sneha-rao',
    senderName: organizerName,
    text: `Meeting concluded for "${debrief.title}". Thanks ${playerShortName} for the active participation (${primaryStyle} stance). Action items logged.`,
    timestamp: debrief.timestamp,
    emotion: primaryStyle === 'collaborative' ? ('happy' as const) : ('impressed' as const),
  };

  const mergedMessages = { ...gameState.messages };
  mergedMessages[targetChannel] = [...(mergedMessages[targetChannel] || []), defaultChatMessage];
  Object.entries(parsed.chatMessages).forEach(([chId, msgs]) => {
    mergedMessages[chId] = [...(mergedMessages[chId] || []), ...msgs];
  });

  const updatedGameState: GameState = {
    ...gameState,
    characters: updatedCharacters,
    reputation: newReputation,
    tasks: [...newTasks, ...gameState.tasks],
    emails: [...newEmails, minutesEmail, ...gameState.emails],
    evaluations: [newEval, ...gameState.evaluations],
    memories: [newMemory, ...gameState.memories],
    messages: mergedMessages,
    player: {
      ...gameState.player,
      xp: gameState.player.xp + 250,
      performanceScore: Math.min(
        100,
        gameState.player.performanceScore + (primaryStyle === 'passive' ? 1 : 3)
      ),
    },
  };

  const summaryMessage =
    primaryStyle === 'assertive'
      ? `High-priority task assigned & ${newTasks.length} action items logged!`
      : primaryStyle === 'collaborative'
      ? `Colleague thank-you email received & team rapport boosted!`
      : `Meeting debrief and feedback logged.`;

  return {
    updatedGameState,
    newTasks,
    newEmails,
    summaryMessage,
  };
}

/**
 * MeetingEngine:
 * Core interactive video conference simulation component for calendar-scheduled meetings.
 */
export const MeetingEngine: React.FC<MeetingEngineProps> = ({
  meeting,
  gameState,
  onClose,
  onCompleteMeeting,
  onUpdateGameState,
  hasGeminiKey = false,
}) => {
  const handleComplete = (debrief: MeetingDebrief) => {
    if (onUpdateGameState) {
      const outcome = outcomeParser(debrief, gameState);
      onUpdateGameState(() => outcome.updatedGameState);
    }
    onCompleteMeeting(debrief);
  };

  return (
    <InteractiveMeetingModal
      meeting={meeting}
      gameState={gameState}
      onClose={onClose}
      onCompleteMeeting={handleComplete}
      hasGeminiKey={hasGeminiKey}
    />
  );
};

export { SCHEDULED_MEETINGS, parseMeetingOutcome };
export type { MeetingSession, MeetingDebrief, ResponseStyle };
