import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Building2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { JobApplication, InterviewMessage, CandidateProfile } from '../../types/jobMarket';
import { sendInterviewMessage } from '../../services/api';

interface InterviewRoomModalProps {
  application: JobApplication;
  candidate: CandidateProfile;
  onClose: () => void;
  onUpdateApplication: (updatedApp: JobApplication) => void;
  onOpenOffer: (application: JobApplication) => void;
  hasGeminiKey: boolean;
}

export const InterviewRoomModal: React.FC<InterviewRoomModalProps> = ({
  application,
  candidate,
  onClose,
  onUpdateApplication,
  onOpenOffer,
  hasGeminiKey,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typingInterviewer, setTypingInterviewer] = useState<string | null>(null);
  const [roundCompletedModal, setRoundCompletedModal] = useState<{
    result: 'PASS' | 'FAIL';
    feedback: string;
    nextRoundName?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessages = application.interviewChat || [];
  const questionCount = chatMessages.filter(m => !m.isPlayer).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length, typingInterviewer]);

  const interviewerName = application.interviewerName || 'Priya Sharma';
  const interviewerRole = application.interviewerRole || 'Lead Talent Partner';
  const roundName =
    application.currentStage === 'TECHNICAL_INTERVIEW'
      ? 'Technical Domain Interview'
      : application.currentStage === 'MANAGER_ROUND'
      ? 'Managerial & Cultural Fit Round'
      : 'HR Screening Discussion';

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const answerText = inputText.trim();
    setInputText('');
    setIsSending(true);

    const playerMsg: InterviewMessage = {
      id: `msg-player-${Date.now()}`,
      sender: candidate.name,
      senderRole: 'Candidate',
      text: answerText,
      timestamp: 'Just Now',
      isPlayer: true,
    };

    const updatedHistory = [...chatMessages, playerMsg];

    // Optimistically update
    const tempApp: JobApplication = {
      ...application,
      interviewChat: updatedHistory,
    };
    onUpdateApplication(tempApp);

    setTypingInterviewer(`${interviewerName} is evaluating...`);

    try {
      const response = await sendInterviewMessage({
        job: application.job,
        candidate,
        roundType: application.currentStage,
        interviewer: {
          name: interviewerName,
          role: interviewerRole,
          personality: application.interviewerPersonality || 'STRICT',
        },
        conversationHistory: updatedHistory,
        playerAnswer: answerText,
        questionIndex: questionCount,
        hiddenScores: application.hiddenImpression,
      });

      setTypingInterviewer(null);

      const interviewerReply: InterviewMessage = {
        id: `msg-interviewer-${Date.now()}`,
        sender: interviewerName,
        senderRole: interviewerRole,
        text: response.replyText || 'Thank you for your response.',
        timestamp: 'Just Now',
        emotion: response.emotion || 'neutral',
      };

      const finalHistory = [...updatedHistory, interviewerReply];

      // Update hidden impression scores
      const scoreDeltas = response.scoreDeltas || {};
      const newImpression = {
        technicalKnowledge: Math.min(100, Math.max(0, application.hiddenImpression.technicalKnowledge + (scoreDeltas.technicalKnowledge || 0))),
        communication: Math.min(100, Math.max(0, application.hiddenImpression.communication + (scoreDeltas.communication || 0))),
        confidence: Math.min(100, Math.max(0, application.hiddenImpression.confidence + (scoreDeltas.confidence || 0))),
        problemSolving: Math.min(100, Math.max(0, application.hiddenImpression.problemSolving + (scoreDeltas.problemSolving || 0))),
        cultureFit: Math.min(100, Math.max(0, application.hiddenImpression.cultureFit + (scoreDeltas.cultureFit || 0))),
      };

      const isRoundDone = response.isRoundComplete || questionCount >= 3;

      if (isRoundDone) {
        // Calculate pass vs fail based on cumulative impression
        const avgScore = (newImpression.communication + newImpression.technicalKnowledge + newImpression.problemSolving) / 3;
        const didPass = response.roundResult === 'PASS' || avgScore >= 66;

        if (didPass) {
          // If passed current round, advance to next stage or extend offer!
          if (application.currentStage === 'HR_SCREEN') {
            const nextApp: JobApplication = {
              ...application,
              currentStage: 'TECHNICAL_INTERVIEW',
              currentRoundIndex: 1,
              interviewerName: application.job.reportingManager || 'Deepak Joshi',
              interviewerRole: application.job.managerRole || 'Senior Staff Engineer',
              interviewerPersonality: 'TECHNICAL',
              interviewChat: [
                ...finalHistory,
                {
                  id: `msg-tech-invite`,
                  sender: application.job.reportingManager || 'Deepak Joshi',
                  senderRole: 'Technical Interviewer',
                  text: `Hello ${candidate.name}, welcome to the technical round for ${application.job.title} at ${application.job.company}. Let's discuss your hands-on experience with ${application.job.skillsRequired.slice(0, 3).join(', ')}. To start, could you walk me through your most complex technical troubleshooting scenario?`,
                  timestamp: 'Just Now',
                  emotion: 'neutral',
                },
              ],
              hiddenImpression: newImpression,
            };
            onUpdateApplication(nextApp);
            setRoundCompletedModal({
              result: 'PASS',
              feedback: response.feedbackNote || 'Strong communication and motivation demonstrated.',
              nextRoundName: 'Technical Domain Interview with Engineering Lead',
            });
          } else if (application.currentStage === 'TECHNICAL_INTERVIEW') {
            const nextApp: JobApplication = {
              ...application,
              currentStage: 'MANAGER_ROUND',
              currentRoundIndex: 2,
              interviewerName: 'Sneha Rao',
              interviewerRole: 'Engineering Manager',
              interviewerPersonality: 'SENIOR_MANAGER',
              interviewChat: [
                ...finalHistory,
                {
                  id: `msg-mgr-invite`,
                  sender: 'Sneha Rao',
                  senderRole: 'Engineering Manager',
                  text: `Hi ${candidate.name}. The technical panel gave positive marks on your engineering rigor. In this final discussion, I want to understand how you handle high-pressure deadlines, customer escalations, and ownership. Tell me about a time you took accountability for an unexpected failure.`,
                  timestamp: 'Just Now',
                  emotion: 'warm',
                },
              ],
              hiddenImpression: newImpression,
            };
            onUpdateApplication(nextApp);
            setRoundCompletedModal({
              result: 'PASS',
              feedback: response.feedbackNote || 'Solid technical problem solving demonstrated.',
              nextRoundName: 'Final Managerial Fit Round with Engineering Manager',
            });
          } else {
            // Passed Manager Round -> JOB OFFER EXTENDED!
            const offer = {
              id: `offer-${Date.now()}`,
              jobId: application.job.id,
              company: application.job.company,
              title: application.job.title,
              department: application.job.department,
              location: application.job.location,
              baseSalary: Math.round(application.job.minSalary * 1.1),
              variableBonus: 50000,
              joiningBonus: 30000,
              probationMonths: 6,
              noticePeriodDays: 30,
              reportingManager: application.job.reportingManager,
              managerRole: application.job.managerRole,
              currency: '₹',
              benefits: application.job.benefits,
              status: 'PENDING' as const,
              negotiationCount: 0,
            };

            const offerApp: JobApplication = {
              ...application,
              currentStage: 'OFFER_EXTENDED',
              offer,
              interviewChat: finalHistory,
              hiddenImpression: newImpression,
            };
            onUpdateApplication(offerApp);
            setRoundCompletedModal({
              result: 'PASS',
              feedback: 'Outstanding interview performance across all rounds. Formal Job Offer Extended!',
              nextRoundName: 'Job Offer Review & Salary Negotiation',
            });
          }
        } else {
          // Failed round -> Realistic Rejection
          const rejectedApp: JobApplication = {
            ...application,
            currentStage: 'REJECTED',
            rejectionReason: response.feedbackNote || `Looking for deeper troubleshooting and structured communication for the ${application.job.title} role.`,
            interviewChat: finalHistory,
            hiddenImpression: newImpression,
          };
          onUpdateApplication(rejectedApp);
          setRoundCompletedModal({
            result: 'FAIL',
            feedback: response.feedbackNote || `We've decided to proceed with other candidates whose practical experience more closely matches our project requirements.`,
          });
        }
      } else {
        // Round in progress
        onUpdateApplication({
          ...application,
          interviewChat: finalHistory,
          hiddenImpression: newImpression,
        });
      }
    } catch (err) {
      console.error('Failed to process interview message:', err);
      setTypingInterviewer(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden relative">
        {/* Interview Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Video className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {interviewerName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  {roundName}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {interviewerRole} • {application.job.company} ({application.job.title})
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold p-1"
          >
            Leave Room
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {chatMessages.map(msg => {
            const isMe = msg.isPlayer;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs ${
                    isMe
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                      : 'bg-gradient-to-tr from-slate-700 to-slate-900'
                  }`}
                >
                  {isMe ? candidate.name[0] : interviewerName[0]}
                </div>

                <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                  <div className={`flex items-center gap-2 text-xs ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.senderRole}
                    </span>

                    {msg.emotion && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                        msg.emotion === 'impressed' || msg.emotion === 'warm'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : msg.emotion === 'skeptical' || msg.emotion === 'challenging'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {msg.emotion}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {typingInterviewer && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic py-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>{typingInterviewer}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Freeform Answer Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 bg-white dark:bg-slate-800/80 shadow-xs transition-all">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Answer ${interviewerName}... (Type your real answer naturally. Enter to send)`}
              disabled={isSending || Boolean(roundCompletedModal)}
              rows={3}
              className="w-full p-3.5 pr-14 text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none text-slate-900 dark:text-white placeholder-slate-400"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isSending || Boolean(roundCompletedModal)}
              className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>
              Real-time AI Interview. The interviewer evaluates your communication, technical validity, and problem solving.
            </span>
            <span className="font-mono">
              {hasGeminiKey ? 'Gemini 3.8 Flash' : 'Sim Heuristic Engine'}
            </span>
          </div>
        </div>

        {/* Round Completion Result Modal Overlay */}
        {roundCompletedModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-30">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white ${
                roundCompletedModal.result === 'PASS'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25'
                  : 'bg-gradient-to-tr from-rose-600 to-red-600 shadow-lg shadow-rose-500/25'
              }`}>
                {roundCompletedModal.result === 'PASS' ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {roundCompletedModal.result === 'PASS'
                    ? application.currentStage === 'OFFER_EXTENDED'
                      ? 'Congratulations! Job Offer Extended'
                      : 'Round Cleared Successfully!'
                    : 'Interview Not Selected'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {roundCompletedModal.feedback}
                </p>
              </div>

              {roundCompletedModal.nextRoundName && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                  Next Step: {roundCompletedModal.nextRoundName}
                </div>
              )}

              <div className="pt-2">
                {application.currentStage === 'OFFER_EXTENDED' ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOffer(application);
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    Open Official Offer Letter
                  </button>
                ) : roundCompletedModal.result === 'PASS' ? (
                  <button
                    onClick={() => setRoundCompletedModal(null)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    Continue to Next Round
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-colors"
                  >
                    Back to Application Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
