import React, { useState } from 'react';
import { PersonalLifeState, GoogleMeetInterview } from '../../types/smartphone';
import { sendInterviewMessage } from '../../services/api';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Clock, 
  Building2, 
  Sparkles, 
  UserCheck, 
  AlertCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface GoogleMeetAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  onAcceptOfferAndJoin?: (roleTitle: string, companyName: string, salary: number) => void;
}

export const GoogleMeetApp: React.FC<GoogleMeetAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  onAcceptOfferAndJoin,
}) => {
  const interviews = personalLife.googleMeetInterviews || [];
  const activeSession = personalLife.activeMeetSession;

  const [playerAnswerInput, setPlayerAnswerInput] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const candidateName = personalLife.candidateName || personalLife.candidateProfile?.name || 'Candidate';
  const firstName = candidateName.split(' ')[0] || 'Candidate';
  const candidateInitials = candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join('') || 'CA';

  const handleStartMeeting = (interview: GoogleMeetInterview) => {
    const roleLower = interview.roleTitle.toLowerCase();
    let initialGreeting = `Hello ${firstName}! Welcome to your ${interview.roundName} for ${interview.roleTitle} at ${interview.companyName}. I'm ${interview.interviewerName}, ${interview.interviewerTitle}. Let's get started. Could you introduce yourself, highlight your background in ${personalLife.candidateProfile?.degree || 'your field'}, and tell me what drives your interest in this role at ${interview.companyName}?`;

    if (roleLower.includes('hr') || roleLower.includes('talent') || roleLower.includes('people')) {
      initialGreeting = `Hello ${firstName}! Welcome to your ${interview.roundName} for ${interview.roleTitle} at ${interview.companyName}. I'm ${interview.interviewerName}. Let's begin by walking through your experience with talent sourcing, employee onboarding, and how you manage cross-department HR compliance.`;
    } else if (roleLower.includes('admin') || roleLower.includes('facility') || roleLower.includes('workplace')) {
      initialGreeting = `Hello ${firstName}! Welcome to your ${interview.roundName} for ${interview.roleTitle} at ${interview.companyName}. I'm ${interview.interviewerName}. Tell us about your operational experience in managing office logistics, vendor SLAs, and asset tracking.`;
    } else if (roleLower.includes('finance') || roleLower.includes('account') || roleLower.includes('tax')) {
      initialGreeting = `Hello ${firstName}! Welcome to your ${interview.roundName} for ${interview.roleTitle} at ${interview.companyName}. I'm ${interview.interviewerName}. Could you walk me through your expertise in financial statement analysis, MIS reporting, and auditing workflows?`;
    }

    onUpdatePersonalLife(prev => ({
      ...prev,
      googleMeetInterviews: prev.googleMeetInterviews?.map(i =>
        i.id === interview.id ? { ...i, status: 'IN_PROGRESS' } : i
      ),
      activeMeetSession: {
        interview,
        chatHistory: [
          { speaker: interview.interviewerName, text: initialGreeting, isPlayer: false },
        ],
        isMuted: false,
        isVideoOff: false,
        turnCount: 1,
      },
    }));
  };

  const handleSendAnswer = async () => {
    if (!playerAnswerInput.trim() || !activeSession || isThinking) return;

    const answer = playerAnswerInput.trim();
    const currentInterview = activeSession.interview;
    const turn = activeSession.turnCount + 1;
    const isFinalTurn = turn >= 4;

    setPlayerAnswerInput('');
    setIsThinking(true);

    const historyForAi = activeSession.chatHistory.map(m => ({
      sender: m.speaker,
      text: m.text,
    }));

    let interviewerFollowUp = '';
    let isPassed = answer.length > 20;

    try {
      const aiRes = await sendInterviewMessage({
        job: {
          title: currentInterview.roleTitle,
          company: currentInterview.companyName,
          skillsRequired: personalLife.candidateProfile?.technicalSkills || ['Professional Skills'],
        },
        candidate: {
          name: candidateName,
          degree: personalLife.candidateProfile?.degree || 'Graduate Degree',
          specialization: personalLife.candidateProfile?.specialization || 'Professional Field',
          experienceYears: 1,
          technicalSkills: personalLife.candidateProfile?.technicalSkills || [],
        },
        roundType: currentInterview.roundName.includes('HR') ? 'HR_SCREEN' : 'TECHNICAL_INTERVIEW',
        interviewer: {
          name: currentInterview.interviewerName,
          role: currentInterview.interviewerTitle,
          personality: currentInterview.interviewerPersonality,
        },
        conversationHistory: historyForAi,
        playerAnswer: answer,
        questionIndex: activeSession.turnCount,
        hiddenScores: { technicalKnowledge: 80, communication: 82, confidence: 78, problemSolving: 80 },
      });

      if (aiRes && aiRes.nextQuestion) {
        interviewerFollowUp = aiRes.nextQuestion;
      } else if (aiRes && (aiRes as any).replyText) {
        interviewerFollowUp = (aiRes as any).replyText;
      }
      if (aiRes && typeof (aiRes as any).interviewPassed === 'boolean') {
        isPassed = (aiRes as any).interviewPassed || isPassed;
      }
    } catch (e) {
      console.warn('AI interview engine error in GoogleMeetApp:', e);
    }

    if (!interviewerFollowUp) {
      if (turn === 2) {
        interviewerFollowUp = `Thank you for detailing that, ${firstName}. Could you give an example of a challenging conflict or tight deadline you navigated, and how you communicated with the stakeholders involved?`;
      } else if (turn === 3) {
        interviewerFollowUp = `Very clear explanation. How do you approach prioritizing multiple urgent requests when priorities shift without warning?`;
      } else {
        interviewerFollowUp = `Thank you, ${firstName}! That gives me a thorough understanding of your qualifications, problem-solving, and culture fit for ${currentInterview.companyName}. I am wrapping up our session now and submitting my recommendation to talent acquisition.`;
      }
    }

    const updatedHistory = [
      ...activeSession.chatHistory,
      { speaker: candidateName, text: answer, isPlayer: true },
      { speaker: currentInterview.interviewerName, text: interviewerFollowUp, isPlayer: false },
    ];

    setIsThinking(false);

    if (isFinalTurn) {
      const scorecard = {
        technicalScore: isPassed ? 94 : 70,
        communicationScore: 92,
        roleFitScore: isPassed ? 95 : 68,
        confidenceScore: 90,
        feedbackSummary: isPassed
          ? `Outstanding domain clarity, executive communication, and high ownership. Strongly recommended for employment offer at ${currentInterview.companyName}.`
          : `Candidate shared good foundational insights, but would benefit from further practical depth.`,
        passed: isPassed,
      };

      onUpdatePersonalLife(prev => {
        const updatedInterviews = prev.googleMeetInterviews?.map(i =>
          i.id === currentInterview.id
            ? { ...i, status: isPassed ? ('PASSED' as const) : ('REJECTED' as const), scorecard }
            : i
        );

        const newNotif = {
          id: `notif-offer-${Date.now()}`,
          app: 'work' as const,
          title: isPassed ? '🎉 Google Meet: Interview Cleared!' : 'Google Meet: Interview Feedback',
          message: isPassed
            ? `Congratulations! ${currentInterview.companyName} selected you for ${currentInterview.roleTitle}! Tap in Google Meet or LinkedIn to accept your offer.`
            : `Thank you for interviewing with ${currentInterview.companyName}.`,
          timestamp: 'Just now',
          isRead: false,
        };

        return {
          ...prev,
          googleMeetInterviews: updatedInterviews,
          notifications: [newNotif, ...prev.notifications],
          activeMeetSession: undefined,
        };
      });
    } else {
      onUpdatePersonalLife(prev => ({
        ...prev,
        activeMeetSession: {
          ...activeSession,
          chatHistory: updatedHistory,
          turnCount: turn,
        },
      }));
    }
  };

  const handleLeaveMeeting = () => {
    onUpdatePersonalLife(prev => ({
      ...prev,
      activeMeetSession: undefined,
    }));
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-sans text-xs overflow-hidden">
      {/* Top App Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-[10px]">
            🎥
          </div>
          <span className="font-extrabold text-sm text-slate-100">Google Meet</span>
        </div>
        {activeSession && (
          <div className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-bold text-[9px] flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>LIVE INTERVIEW</span>
          </div>
        )}
      </div>

      {/* Main Viewport */}
      {activeSession ? (
        /* LIVE MEETING VIEW */
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* Video Frames Grid */}
          <div className="p-2 grid grid-cols-2 gap-2 h-44 shrink-0 bg-slate-900/60 border-b border-slate-800">
            {/* Interviewer Camera Frame */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-col items-center justify-between relative overflow-hidden shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl my-auto border-2 border-slate-600">
                {activeSession.interview.interviewerAvatar}
              </div>
              <div className="w-full flex items-center justify-between text-[9px] bg-slate-950/80 px-2 py-1 rounded text-slate-200">
                <span className="font-bold truncate">{activeSession.interview.interviewerName}</span>
                <span className="text-emerald-400">● Mic On</span>
              </div>
            </div>

            {/* Candidate (Player) Camera Frame */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-col items-center justify-between relative overflow-hidden shadow">
              {isVideoOff ? (
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 my-auto">
                  <VideoOff className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-sm my-auto border-2 border-slate-600">
                  {candidateInitials}
                </div>
              )}
              <div className="w-full flex items-center justify-between text-[9px] bg-slate-950/80 px-2 py-1 rounded text-slate-200">
                <span className="font-bold truncate">You ({firstName})</span>
                <span className={isMuted ? 'text-red-400' : 'text-emerald-400'}>
                  {isMuted ? 'Muted' : '● Mic On'}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Interview Speech/Transcript Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            <div className="text-[10px] text-slate-400 text-center font-medium">
              Google Meet Encrypted • {activeSession.interview.companyName} {activeSession.interview.roundName}
            </div>

            {activeSession.chatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs ${
                  m.isPlayer
                    ? 'bg-blue-950/80 border-blue-800/80 text-blue-100 ml-4'
                    : 'bg-slate-900 border-slate-800 text-slate-200 mr-4'
                }`}
              >
                <div className="font-bold text-[10px] text-amber-400 mb-1">{m.speaker}</div>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            ))}

            {isThinking && (
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 italic animate-pulse">
                {activeSession.interview.interviewerName} is evaluating your response...
              </div>
            )}
          </div>

          {/* Answer Input Controls */}
          <div className="p-2 bg-slate-900 border-t border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={playerAnswerInput}
                onChange={e => setPlayerAnswerInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendAnswer()}
                disabled={isThinking}
                placeholder="Speak/Type your answer to interviewer..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendAnswer}
                disabled={isThinking}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1 shadow cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Answer</span>
              </button>
            </div>

            {/* Media Control Dock */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-full border transition cursor-pointer ${
                  isMuted ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2.5 rounded-full border transition cursor-pointer ${
                  isVideoOff ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

              <button
                onClick={handleLeaveMeeting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full flex items-center gap-1 shadow cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* INTERVIEW LIST / SCHEDULE VIEW */
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-100 text-xs">Virtual Recruiter & Technical Rounds</div>
              <div className="text-[10px] text-slate-400">Scheduled Google Meet Video Calls</div>
            </div>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>

          {interviews.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800 space-y-1">
              <p className="font-bold text-slate-400">No active interviews scheduled.</p>
              <p className="text-[10px]">Apply for jobs on LinkedIn or the ATS portal to receive Google Meet interview invites!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {interviews.map(meet => (
                <div
                  key={meet.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-emerald-500/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-100 text-xs">{meet.roleTitle}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{meet.companyName} • {meet.roundName}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        meet.status === 'PASSED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : meet.status === 'REJECTED'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {meet.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-xl">{meet.interviewerAvatar}</span>
                    <div>
                      <div className="font-bold text-slate-200">{meet.interviewerName}</div>
                      <div className="text-[9px] text-slate-400">{meet.interviewerTitle} ({meet.interviewerPersonality})</div>
                    </div>
                  </div>

                  {/* Scorecard breakdown if completed */}
                  {meet.scorecard && (
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-[10px]">
                      <div className="font-bold text-amber-400 flex items-center justify-between">
                        <span>Scorecard Feedback:</span>
                        <span className={meet.scorecard.passed ? 'text-emerald-400 font-extrabold' : 'text-red-400'}>
                          {meet.scorecard.passed ? 'RECOMMENDED FOR HIRE ✓' : 'FAILED'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-300">
                        <span>Technical: {meet.scorecard.technicalScore}%</span>
                        <span>Communication: {meet.scorecard.communicationScore}%</span>
                        <span>Role Fit: {meet.scorecard.roleFitScore}%</span>
                        <span>Confidence: {meet.scorecard.confidenceScore}%</span>
                      </div>
                      <p className="text-[9px] text-slate-400 italic pt-0.5">{meet.scorecard.feedbackSummary}</p>

                      {/* Official Offer acceptance button right inside Google Meet! */}
                      {meet.scorecard.passed && onAcceptOfferAndJoin && (
                        <div className="pt-2 border-t border-slate-800">
                          <button
                            onClick={() => onAcceptOfferAndJoin(meet.roleTitle, meet.companyName, 650000)}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Accept Offer & Start Career at {meet.companyName}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {meet.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleStartMeeting(meet)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Google Meet Interview Now</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
