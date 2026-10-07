import React, { useState } from 'react';
import {
  Mail,
  Send,
  Reply,
  Star,
  Trash2,
  Archive,
  Inbox,
  SendHorizontal,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GameState, Email } from '../types/game';
import { evaluateEmailReply } from '../services/api';

interface EmailViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
}

export const EmailView: React.FC<EmailViewProps> = ({ gameState, onUpdateGameState }) => {
  const { emails, characters, player, reputation, memories, currentDay, currentHour, currentMinute } = gameState;
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'flagged'>('inbox');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<any>(null);

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  // Mark email as read on click
  const handleSelectEmail = (email: Email) => {
    setSelectedEmailId(email.id);
    setReplyText('');
    setLastFeedback(null);

    if (!email.isRead) {
      onUpdateGameState(prev => ({
        ...prev,
        emails: prev.emails.map(e => (e.id === email.id ? { ...e, isRead: true } : e)),
      }));
    }
  };

  const handleToggleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateGameState(prev => ({
      ...prev,
      emails: prev.emails.map(e => (e.id === emailId ? { ...e, isFlagged: !e.isFlagged } : e)),
    }));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedEmail || isSending) return;

    setIsSending(true);
    const senderChar = characters.find(c => c.id === selectedEmail.fromId) || {
      id: selectedEmail.fromId,
      name: selectedEmail.fromName,
      role: 'Colleague',
      department: 'Corporate',
    };

    try {
      const result = await evaluateEmailReply({
        email: selectedEmail,
        playerReplyText: replyText,
        player,
        reputation,
        senderCharacter: senderChar,
        memories,
      });

      setLastFeedback(result);

      // Append reply and sender response to email thread
      onUpdateGameState(prev => {
        const timeNow = `Day ${currentDay}, ${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
        const newThread = [
          ...(selectedEmail.thread || []),
          {
            sender: player.name,
            body: replyText,
            timestamp: timeNow,
          },
        ];

        if (result.replyEmail?.body) {
          newThread.push({
            sender: result.replyEmail.fromName,
            body: result.replyEmail.body,
            timestamp: `Day ${currentDay}, ${currentHour}:${(currentMinute + 5).toString().padStart(2, '0')}`,
          });
        }

        const newReputation = {
          ...prev.reputation,
          professionalReputation: Math.min(100, Math.max(0, prev.reputation.professionalReputation + (result.trustDelta || 0))),
          managerTrust: Math.min(100, Math.max(0, prev.reputation.managerTrust + (result.managerTrustDelta || 0))),
        };

        const newMem = result.newMemory
          ? [
              {
                id: `mem-email-${Date.now()}`,
                day: currentDay,
                type: 'PROMISE' as const,
                summary: result.newMemory,
                involvedCharacters: [selectedEmail.fromName],
                status: 'ACTIVE' as const,
              },
            ]
          : [];

        return {
          ...prev,
          emails: prev.emails.map(e =>
            e.id === selectedEmail.id
              ? {
                  ...e,
                  replied: true,
                  thread: newThread,
                }
              : e
          ),
          reputation: newReputation,
          memories: [...prev.memories, ...newMem],
          player: {
            ...prev.player,
            xp: prev.player.xp + 20,
            communication: Math.min(100, prev.player.communication + 1),
          },
        };
      });

      setReplyText('');
    } catch (err) {
      console.error('Failed to send email reply:', err);
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = emails.filter(e => {
    if (activeFolder === 'flagged') return e.isFlagged;
    if (activeFolder === 'sent') return e.replied;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900 select-none overflow-hidden">
      {/* Email Folder Column */}
      <div className="w-48 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 space-y-1 shrink-0 text-xs font-semibold">
        <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
          Mailbox
        </div>

        <button
          onClick={() => setActiveFolder('inbox')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
            activeFolder === 'inbox'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
          </div>
          {emails.filter(e => !e.isRead).length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeFolder === 'inbox' ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
            }`}>
              {emails.filter(e => !e.isRead).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveFolder('flagged')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
            activeFolder === 'flagged'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Flagged</span>
          </div>
        </button>

        <button
          onClick={() => setActiveFolder('sent')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
            activeFolder === 'sent'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SendHorizontal className="w-4 h-4" />
            <span>Sent & Replied</span>
          </div>
        </button>
      </div>

      {/* Email List Column */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 overflow-y-auto shrink-0 bg-white dark:bg-slate-900">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {activeFolder} ({filteredEmails.length})
          </span>
          <span className="text-[10px] text-slate-400">Nexora Mail</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 italic">
              No emails in this folder.
            </div>
          ) : (
            filteredEmails.map(email => {
              const isSelected = email.id === selectedEmail?.id;

              return (
                <div
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={`p-3.5 transition-colors cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : !email.isRead
                      ? 'bg-slate-50/80 dark:bg-slate-800/40 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                      {email.fromName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={e => handleToggleStar(email.id, e)}
                        className="text-slate-300 hover:text-amber-500 transition-colors"
                      >
                        <Star className={`w-3.5 h-3.5 ${email.isFlagged ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {email.timestamp.split(',')[1] || email.timestamp}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {email.subject}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {email.body.replace(/\n+/g, ' ')}
                  </p>

                  {email.replied && (
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Replied</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reading & Reply Pane */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
        {selectedEmail ? (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            {/* Header info */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedEmail.subject}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {selectedEmail.timestamp}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedEmail.fromName} <span className="font-normal text-slate-500">&lt;{selectedEmail.fromEmail}&gt;</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    To: {selectedEmail.toEmail}
                  </div>
                </div>

                {selectedEmail.requiresReply && !selectedEmail.replied && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                    Action Required
                  </span>
                )}
              </div>
            </div>

            {/* Email original body */}
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {selectedEmail.body}
            </div>

            {/* Threaded history if replied */}
            {selectedEmail.thread && selectedEmail.thread.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email Thread History
                </h3>
                {selectedEmail.thread.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      item.sender === player.name
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 ml-4'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 mr-4'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1.5">
                      <span>{item.sender}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback notification if just sent */}
            {lastFeedback && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Email Sent & AI Evaluated</span>
                </div>
                <div className="text-emerald-700 dark:text-emerald-300">
                  {lastFeedback.feedback}
                </div>
                <div className="flex gap-4 pt-1 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
                  <span>Professionalism: {lastFeedback.scores?.professionalism}%</span>
                  <span>Clarity: {lastFeedback.scores?.clarity}%</span>
                  <span>Tone: {lastFeedback.scores?.tone}</span>
                </div>
              </div>
            )}

            {/* Reply Composer Box */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-blue-600" />
                  <span>Draft Formal Response</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">
                  Write professionally. Stakeholders review your communication style.
                </span>
              </div>

              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Dear ${selectedEmail.fromName},\n\nThank you for the update... (Type your formal corporate reply here)`}
                rows={5}
                disabled={isSending}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-xs"
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setReplyText(`Dear ${selectedEmail.fromName},\n\nThank you for bringing this to my attention. I am actively investigating this and will share a root cause update with the team before 4 PM today.\n\nBest regards,\n${player.name}`)}
                    className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Insert Proactive ETA Draft
                  </button>
                </div>

                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending & Evaluating...' : 'Send Corporate Email'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Select an email to view.
          </div>
        )}
      </div>
    </div>
  );
};
