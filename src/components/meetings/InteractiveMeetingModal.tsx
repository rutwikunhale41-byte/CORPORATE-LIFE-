import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Users,
  MessageSquare,
  Shield,
  Flame,
  HandHeart,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  TrendingUp,
  BarChart2,
  Send,
  Layers,
  Award,
  Zap,
  Info,
  Edit3,
  ThumbsUp,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { GameState, HiddenEvaluation, GameMemory, Email } from '../../types/game';
import {
  MeetingSession,
  ResponseStyle,
  MeetingOption,
  MeetingDebrief,
  MeetingColleagueDebrief
} from '../../types/meeting';
import { sendMeetingTurn } from '../../services/api';

interface InteractiveMeetingModalProps {
  meeting: MeetingSession;
  gameState: GameState;
  onClose: () => void;
  onCompleteMeeting: (debrief: MeetingDebrief) => void;
  hasGeminiKey?: boolean;
}

export const InteractiveMeetingModal: React.FC<InteractiveMeetingModalProps> = ({
  meeting,
  gameState,
  onClose,
  onCompleteMeeting,
  hasGeminiKey = false,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<ResponseStyle>('collaborative');
  const [customDialogue, setCustomDialogue] = useState<string>('');
  const [isEditingDialogue, setIsEditingDialogue] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [turnHistory, setTurnHistory] = useState<
    Array<{
      roundNumber: number;
      chosenStyle: ResponseStyle;
      playerSpeech: string;
      speakerPrompt: string;
      immediateReaction: string;
      speakerFollowUp: string;
      option: MeetingOption;
    }>
  >([]);

  // Turn resolution state
  const [turnResolved, setTurnResolved] = useState(false);
  const [currentTurnResult, setCurrentTurnResult] = useState<{
    immediateReaction: string;
    speakerFollowUp: string;
    consequenceToast: string;
    reactionEmotion: string;
  } | null>(null);

  // Audio / Video toggles
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'slide' | 'grid'>('split');
  const [floatingReactions, setFloatingReactions] = useState<string[]>([]);
  const [showDebrief, setShowDebrief] = useState(false);
  const [debriefData, setDebriefData] = useState<MeetingDebrief | null>(null);

  const currentRound = meeting.agendaRounds[currentRoundIdx];
  const totalRounds = meeting.agendaRounds.length;

  // Sync default dialogue when round changes
  useEffect(() => {
    if (currentRound && currentRound.options[selectedStyle]) {
      setCustomDialogue(currentRound.options[selectedStyle].dialogue);
    }
  }, [currentRoundIdx, selectedStyle, currentRound]);

  // Handle player choice select
  const handleSelectStyle = (style: ResponseStyle) => {
    setSelectedStyle(style);
    if (currentRound && currentRound.options[style]) {
      setCustomDialogue(currentRound.options[style].dialogue);
      setIsEditingDialogue(false);
    }
  };

  // Deliver response in meeting
  const handleDeliverResponse = async () => {
    if (!currentRound || isDelivering) return;
    setIsDelivering(true);
    setIsMicMuted(false);

    const chosenOption = currentRound.options[selectedStyle];
    const dialogueToUse = customDialogue.trim() || chosenOption.dialogue;

    // Trigger floating reactions
    const emojis = selectedStyle === 'collaborative'
      ? ['🤝', '💡', '👍', '👏']
      : selectedStyle === 'assertive'
      ? ['⚡', '🎯', '🔥', '👀']
      : ['🤫', '📝', '👌'];
    setFloatingReactions(emojis);
    setTimeout(() => setFloatingReactions([]), 3000);

    let result = {
      immediateReaction: chosenOption.immediateReaction,
      speakerFollowUp: `Understood, ${gameState.player.name.split(' ')[0]}. Thank you for laying that out.`,
      consequenceToast: chosenOption.consequenceToast,
      reactionEmotion: chosenOption.reactionEmotion,
    };

    try {
      const apiRes = await sendMeetingTurn({
        meetingTitle: meeting.title,
        meetingType: meeting.type,
        currentSpeaker: currentRound.speaker,
        speakerPrompt: currentRound.speakerPrompt,
        playerChoice: selectedStyle,
        playerDialogue: dialogueToUse,
        attendees: meeting.attendees,
        roundNumber: currentRound.roundNumber,
        player: gameState.player,
        reputation: gameState.reputation,
      });

      if (apiRes && apiRes.immediateReaction) {
        result = {
          immediateReaction: apiRes.immediateReaction,
          speakerFollowUp: apiRes.speakerFollowUp || result.speakerFollowUp,
          consequenceToast: apiRes.consequenceToast || chosenOption.consequenceToast,
          reactionEmotion: apiRes.reactionEmotion || chosenOption.reactionEmotion,
        };
      }
    } catch (err) {
      console.warn('Meeting turn API fallback engaged:', err);
    }

    const recordedTurn = {
      roundNumber: currentRound.roundNumber,
      chosenStyle: selectedStyle,
      playerSpeech: dialogueToUse,
      speakerPrompt: currentRound.speakerPrompt,
      immediateReaction: result.immediateReaction,
      speakerFollowUp: result.speakerFollowUp,
      option: chosenOption,
    };

    setTurnHistory(prev => [...prev, recordedTurn]);
    setCurrentTurnResult(result);
    setTurnResolved(true);
    setIsDelivering(false);
  };

  // Advance to next round or finish meeting
  const handleNextRound = () => {
    if (currentRoundIdx + 1 < totalRounds) {
      setCurrentRoundIdx(prev => prev + 1);
      setTurnResolved(false);
      setCurrentTurnResult(null);
      setIsMicMuted(true);
      setSelectedStyle('collaborative');
    } else {
      // Build debrief
      finishMeeting();
    }
  };

  // Compile full debrief at end of meeting
  const finishMeeting = () => {
    const history = turnHistory;
    const styleCount = {
      passive: history.filter(h => h.chosenStyle === 'passive').length,
      assertive: history.filter(h => h.chosenStyle === 'assertive').length,
      collaborative: history.filter(h => h.chosenStyle === 'collaborative').length,
    };

    let primary: ResponseStyle = 'collaborative';
    if (styleCount.assertive >= styleCount.collaborative && styleCount.assertive >= styleCount.passive) {
      primary = 'assertive';
    } else if (styleCount.passive > styleCount.collaborative && styleCount.passive > styleCount.assertive) {
      primary = 'passive';
    }

    // Cumulative reputation deltas
    const totalRepImpact = {
      managerTrustDelta: 0,
      teamTrustDelta: 0,
      customerTrustDelta: 0,
      hrReputationDelta: 0,
    };

    // Cumulative relationship deltas
    const charDeltas: Record<string, { trust: number; respect: number; rapport: number; comments: string[] }> = {};

    let totalLead = 0;
    let totalOwn = 0;
    let totalComm = 0;
    let totalProb = 0;

    history.forEach(item => {
      const opt = item.option;
      totalRepImpact.managerTrustDelta += opt.reputationImpact.managerTrustDelta;
      totalRepImpact.teamTrustDelta += opt.reputationImpact.teamTrustDelta;
      totalRepImpact.customerTrustDelta += opt.reputationImpact.customerTrustDelta;
      totalRepImpact.hrReputationDelta += opt.reputationImpact.hrReputationDelta;

      totalLead += opt.performanceEvaluation.leadershipDelta;
      totalOwn += opt.performanceEvaluation.ownershipDelta;
      totalComm += opt.performanceEvaluation.communicationDelta;
      totalProb += opt.performanceEvaluation.problemSolvingDelta;

      Object.entries(opt.relationshipImpact).forEach(([charId, impact]) => {
        if (!charDeltas[charId]) {
          charDeltas[charId] = { trust: 0, respect: 0, rapport: 0, comments: [] };
        }
        charDeltas[charId].trust += impact.trustDelta;
        charDeltas[charId].respect += impact.respectDelta;
        charDeltas[charId].rapport += impact.rapportDelta;
        if (impact.reason && !charDeltas[charId].comments.includes(impact.reason)) {
          charDeltas[charId].comments.push(impact.reason);
        }
      });
    });

    const colleagueDebriefs: MeetingColleagueDebrief[] = meeting.attendees
      .filter(a => a.id !== 'player')
      .map(att => {
        const d = charDeltas[att.id] || { trust: 1, respect: 2, rapport: 2, comments: ['Participated in meeting discussion.'] };
        let comment = d.comments.join('. ') || 'Constructive alignment on meeting deliverables.';
        return {
          characterId: att.id,
          characterName: att.name,
          role: att.role,
          avatar: att.avatar,
          color: att.color,
          reactionComment: comment,
          trustDelta: d.trust,
          respectDelta: d.respect,
          rapportDelta: d.rapport,
        };
      });

    const evalSummary = primary === 'assertive'
      ? `Demonstrated commanding executive presence and technical backbone in ${meeting.title}. Proactively defended code standards and held colleagues accountable.`
      : primary === 'collaborative'
      ? `Showcased exceptional cross-functional empathy and solution synthesis in ${meeting.title}. Championed high team morale and balanced stakeholder needs.`
      : `Maintained safe compliance in ${meeting.title}. Avoided confrontation, though evaluation notes suggest a need for bolder proactivity and ownership.`;

    const debrief: MeetingDebrief = {
      meetingId: meeting.id,
      title: meeting.title,
      type: meeting.type,
      durationMinutes: meeting.durationMinutes,
      turnsPlayed: history.map(h => ({
        roundNumber: h.roundNumber,
        chosenStyle: h.chosenStyle,
        playerSpeech: h.playerSpeech,
      })),
      styleDistribution: styleCount,
      primaryStyle: primary,
      colleagueDebriefs,
      reputationDeltas: totalRepImpact,
      performanceImpact: {
        overallRatingDelta: primary === 'collaborative' || primary === 'assertive' ? 0.3 : 0.05,
        leadershipScore: totalLead,
        ownershipScore: totalOwn,
        communicationScore: totalComm,
        problemSolvingScore: totalProb,
        evaluationSummary: evalSummary,
      },
      minutesSummary: [
        `Meeting successfully concluded with ${meeting.attendees.length} active participants.`,
        `Primary communication strategy demonstrated by ${gameState.player.name}: ${primary.toUpperCase()}.`,
        history.map(h => `Round ${h.roundNumber}: ${h.speakerPrompt.slice(0, 75)}... -> Handled with ${h.chosenStyle} stance.`).join(' '),
      ],
      actionItems: [
        'Document telemetry architecture decisions in Confluence under platform RFCs.',
        'Deliver agreed pull request / staging validation by committed timeline.',
        'Synchronize cross-functional action items with Jira sprint tracker.',
      ],
      timestamp: `Day ${gameState.currentDay}, ${meeting.timeString}`,
    };

    setDebriefData(debrief);
    setShowDebrief(true);
  };

  const handleApplyDebriefAndClose = () => {
    if (debriefData) {
      onCompleteMeeting(debriefData);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fade-in select-none">
      {/* Container: Video Conference Stage */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[92vh] max-h-[880px] flex flex-col shadow-2xl overflow-hidden relative text-slate-100">

        {/* 1. Header: Meeting Room Banner */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>REC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>{meeting.title}</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-400/20 uppercase">
                  {meeting.type.replace('-', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{meeting.location}</span>
                <span>•</span>
                <span>Organized by {meeting.organizer.name} ({meeting.organizer.role})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Round Indicator */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-semibold">
                Agenda Phase: <span className="text-blue-400 font-bold">{currentRoundIdx + 1}</span> of {totalRounds}
              </span>
            </div>

            {/* Leave / Close button */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Leave Meeting"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>

        {/* 2. Main Meeting Workspace or Debrief View */}
        {!showDebrief ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Screen Share / Active Speaker Spotlight & Agenda */}
            <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 border-r border-slate-800/80 bg-slate-900/60">

              {/* Active Speaker Card */}
              {currentRound && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${currentRound.speaker.color} flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-blue-500/50`}>
                        {currentRound.speaker.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{currentRound.speaker.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/20 text-blue-300">
                            Speaking
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{currentRound.speaker.role}</span>
                      </div>
                    </div>

                    {/* Animated voice wave */}
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 rounded-full bg-blue-400 animate-pulse" />
                      <span className="w-1 h-5 rounded-full bg-blue-400 animate-pulse delay-75" />
                      <span className="w-1 h-4 rounded-full bg-blue-400 animate-pulse delay-150" />
                      <span className="w-1 h-2 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Speaker prompt dialogue bubble */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-900/40 text-slate-200 text-xs sm:text-sm leading-relaxed relative">
                    <span className="text-blue-400 font-bold mr-1.5">“</span>
                    {currentRound.speakerPrompt}
                    <span className="text-blue-400 font-bold ml-1.5">”</span>
                  </div>

                  {/* Slide Context Artifact (if present) */}
                  {currentRound.slideContext && (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-bold text-slate-200">{currentRound.slideContext.title}</span>
                        </div>
                        {currentRound.slideContext.metricBadge && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            currentRound.slideContext.metricBadge.isAlert
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {currentRound.slideContext.metricBadge.label}: {currentRound.slideContext.metricBadge.value}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        {currentRound.slideContext.subtitle}
                      </p>
                      <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-300">
                        {currentRound.slideContext.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Player Turn: Decision Console */}
              <div className="flex-1 flex flex-col space-y-3">
                {!turnResolved ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Your Turn to Respond: Choose Your Strategic Stance
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Impacts Performance Review & Relationships
                      </span>
                    </div>

                    {/* 3 Strategic Option Cards */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {/* 1. PASSIVE CARD */}
                      {currentRound && (
                        <div
                          onClick={() => handleSelectStyle('passive')}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                            selectedStyle === 'passive'
                              ? 'bg-slate-800/90 border-amber-400/80 ring-2 ring-amber-400/20 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded bg-amber-500/20 text-amber-300 text-xs">
                                <Shield className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-bold text-amber-300">
                                Passive / Deferential
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">
                              Low Visibility • Conflict Avoidant
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic mb-2 line-clamp-2">
                            "{currentRound.options.passive.dialogue}"
                          </p>
                          <p className="text-[11px] text-slate-400">
                            <strong className="text-slate-300">Strategy:</strong> {currentRound.options.passive.rationale}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              Leadership: -2 to -4
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              Team Conflict: Low
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 2. ASSERTIVE CARD */}
                      {currentRound && (
                        <div
                          onClick={() => handleSelectStyle('assertive')}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                            selectedStyle === 'assertive'
                              ? 'bg-slate-800/90 border-rose-500/80 ring-2 ring-rose-500/20 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded bg-rose-500/20 text-rose-300 text-xs">
                                <Flame className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-bold text-rose-400">
                                Assertive / Direct Ownership
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-rose-300">
                              High Respect • Defends Standards
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic mb-2 line-clamp-2">
                            "{currentRound.options.assertive.dialogue}"
                          </p>
                          <p className="text-[11px] text-slate-400">
                            <strong className="text-slate-300">Strategy:</strong> {currentRound.options.assertive.rationale}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                              Leadership: +7 to +10
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                              Ownership: +8 to +10
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              Manager Respect: +++
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 3. COLLABORATIVE CARD */}
                      {currentRound && (
                        <div
                          onClick={() => handleSelectStyle('collaborative')}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                            selectedStyle === 'collaborative'
                              ? 'bg-slate-800/90 border-emerald-400/80 ring-2 ring-emerald-400/20 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300 text-xs">
                                <HandHeart className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-bold text-emerald-400">
                                Collaborative / Win-Win Synergy
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-300">
                              High Team Trust • Cross-Functional
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic mb-2 line-clamp-2">
                            "{currentRound.options.collaborative.dialogue}"
                          </p>
                          <p className="text-[11px] text-slate-400">
                            <strong className="text-slate-300">Strategy:</strong> {currentRound.options.collaborative.rationale}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                              Team Trust: +6 to +8
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                              Communication: +8 to +10
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              Peer Rapport: +++
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dialogue Customizer Toggle */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <button
                          onClick={() => setIsEditingDialogue(prev => !prev)}
                          className="hover:text-blue-300 flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isEditingDialogue ? 'Hide Speech Editor' : 'Fine-Tune Your Spoken Words'}</span>
                        </button>
                      </div>

                      {isEditingDialogue && (
                        <textarea
                          value={customDialogue}
                          onChange={e => setCustomDialogue(e.target.value)}
                          rows={3}
                          className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                          placeholder="Adjust your exact words before delivering..."
                        />
                      )}
                    </div>

                    {/* Deliver Response Button */}
                    <button
                      onClick={handleDeliverResponse}
                      disabled={isDelivering}
                      className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isDelivering
                          ? 'bg-blue-600/50 text-slate-300 cursor-not-allowed'
                          : selectedStyle === 'assertive'
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                          : selectedStyle === 'collaborative'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                      }`}
                    >
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>
                        {isDelivering ? 'Delivering Response in Meeting...' : `Speak into Meeting (${selectedStyle.toUpperCase()} Stance)`}
                      </span>
                    </button>
                  </>
                ) : (
                  /* Turn Resolved / Meeting Reaction Screen */
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Response Delivered ({selectedStyle.toUpperCase()} STANCE)
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                        {currentTurnResult?.consequenceToast}
                      </span>
                    </div>

                    {/* Room Reaction Feedback */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Room & Colleague Reaction
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        {currentTurnResult?.immediateReaction}
                      </p>
                      {currentTurnResult?.speakerFollowUp && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-blue-300">
                          <strong>{currentRound?.speaker.name}:</strong> "{currentTurnResult.speakerFollowUp}"
                        </div>
                      )}
                    </div>

                    {/* Performance & Relationship Impact Breakdown */}
                    {currentRound && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <span className="font-bold text-slate-300 block mb-1 text-[11px]">
                            Performance Appraisal Impact:
                          </span>
                          <p className="text-[11px] text-slate-400 mb-1.5">
                            {currentRound.options[selectedStyle].performanceEvaluation.summary}
                          </p>
                          <div className="flex flex-wrap gap-1.5 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                              Leadership: {currentRound.options[selectedStyle].performanceEvaluation.leadershipDelta > 0 ? '+' : ''}
                              {currentRound.options[selectedStyle].performanceEvaluation.leadershipDelta}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                              Ownership: {currentRound.options[selectedStyle].performanceEvaluation.ownershipDelta > 0 ? '+' : ''}
                              {currentRound.options[selectedStyle].performanceEvaluation.ownershipDelta}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                              Communication: {currentRound.options[selectedStyle].performanceEvaluation.communicationDelta > 0 ? '+' : ''}
                              {currentRound.options[selectedStyle].performanceEvaluation.communicationDelta}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <span className="font-bold text-slate-300 block mb-1 text-[11px]">
                            Colleague Trust & Respect Changes:
                          </span>
                          <div className="space-y-1 text-[11px]">
                            {Object.entries(currentRound.options[selectedStyle].relationshipImpact).map(([cid, imp]) => {
                              const charObj = meeting.attendees.find(a => a.id === cid);
                              return (
                                <div key={cid} className="flex items-center justify-between text-slate-300">
                                  <span>{charObj?.name || cid}:</span>
                                  <span className="font-semibold text-emerald-400">
                                    {imp.respectDelta > 0 ? `+${imp.respectDelta} Respect` : `${imp.respectDelta} Respect`}
                                    {imp.trustDelta !== 0 && ` • ${imp.trustDelta > 0 ? '+' : ''}${imp.trustDelta} Trust`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Next Action Button */}
                    <button
                      onClick={handleNextRound}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <span>
                        {currentRoundIdx + 1 < totalRounds
                          ? `Advance to Next Agenda Item (${currentRoundIdx + 2}/${totalRounds})`
                          : 'Complete Meeting & Review 360° Debrief'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Participant Video Grid */}
            <div className="w-full md:w-80 p-4 bg-slate-950/80 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Meeting Attendees ({meeting.attendees.length})
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Connected
                </span>
              </div>

              {/* Player Self Tile */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 relative overflow-hidden">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white ring-2 ring-blue-500">
                    {gameState.player.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">{gameState.player.name}</span>
                      <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300 shrink-0">You</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{gameState.player.title}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    {!isMicMuted ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <Mic className="w-3 h-3" /> Unmuted
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <MicOff className="w-3 h-3" /> Muted
                      </span>
                    )}
                  </span>
                  <span className="text-slate-400">
                    Stance: <strong className="text-blue-400 capitalize">{selectedStyle}</strong>
                  </span>
                </div>
              </div>

              {/* Attendees List Tiles */}
              <div className="space-y-2.5 flex-1">
                {meeting.attendees.map(attendee => {
                  const isCurrentSpeaker = currentRound && currentRound.speaker.id === attendee.id;
                  return (
                    <div
                      key={attendee.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isCurrentSpeaker
                          ? 'bg-blue-950/40 border-blue-500 shadow-xs ring-1 ring-blue-500/40'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${attendee.color} flex items-center justify-center font-bold text-xs text-white shrink-0`}>
                          {attendee.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-200 truncate">
                              {attendee.name}
                            </span>
                            {isCurrentSpeaker && (
                              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {attendee.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Emojis */}
              {floatingReactions.length > 0 && (
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-center animate-bounce flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400">Colleague Reactions:</span>
                  <span className="text-lg">{floatingReactions.join(' ')}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 3. Meeting Debrief & Minutes Screen */
          debriefData && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900 text-slate-100 animate-fade-in">
              {/* Top Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-800/60 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30">
                        Meeting Concluded & Evaluated
                      </span>
                      <span className="text-xs text-slate-400">{debriefData.timestamp}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {debriefData.title} — Executive Debrief
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                      {debriefData.performanceImpact.evaluationSummary}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Primary Communication Stance
                    </span>
                    <span className="text-lg font-black text-blue-400 uppercase">
                      {debriefData.primaryStyle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance & Colleague Relationship Impacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Performance Evaluation Delta */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Award className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      360° Performance Review Impact
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Leadership Score</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {debriefData.performanceImpact.leadershipScore >= 0 ? '+' : ''}
                        {debriefData.performanceImpact.leadershipScore}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ownership Rating</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {debriefData.performanceImpact.ownershipScore >= 0 ? '+' : ''}
                        {debriefData.performanceImpact.ownershipScore}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Communication & Diplomacy</span>
                      <span className="text-sm font-bold text-blue-400">
                        {debriefData.performanceImpact.communicationScore >= 0 ? '+' : ''}
                        {debriefData.performanceImpact.communicationScore}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Technical Problem Solving</span>
                      <span className="text-sm font-bold text-blue-400">
                        {debriefData.performanceImpact.problemSolvingScore >= 0 ? '+' : ''}
                        {debriefData.performanceImpact.problemSolvingScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    * Logged to your hidden HR talent file and factored into quarterly appraisal calibrations.
                  </p>
                </div>

                {/* Colleague Relationship Impact Cards */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Colleague Perception & Trust Shifts
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {debriefData.colleagueDebriefs.map(colleague => (
                      <div
                        key={colleague.characterId}
                        className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${colleague.color} flex items-center justify-center font-bold text-[10px] text-white shrink-0`}>
                            {colleague.avatar}
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block text-xs">{colleague.characterName}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">{colleague.reactionComment}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-[10px] font-semibold">
                          <span className="text-emerald-400 block">
                            {colleague.respectDelta >= 0 ? '+' : ''}{colleague.respectDelta} Respect
                          </span>
                          <span className="text-blue-300 block">
                            {colleague.trustDelta >= 0 ? '+' : ''}{colleague.trustDelta} Trust
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Official Meeting Minutes & Action Items */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Meeting Minutes & Action Items
                  </h3>
                </div>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-300 text-[11px]">
                  {debriefData.actionItems.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Complete & Return to Workday */}
              <button
                onClick={handleApplyDebriefAndClose}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Performance Record & Return to Workday</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
