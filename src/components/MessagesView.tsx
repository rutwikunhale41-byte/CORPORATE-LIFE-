import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Hash,
  User,
  Users,
  AlertTriangle,
  Sparkles,
  Paperclip,
  Smile,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  Flame,
  CheckCircle2,
  HelpCircle,
  Plus,
  Search,
  X,
  UserPlus,
  Briefcase,
  HeartHandshake,
  Check,
  Radio,
  Building2,
  PhoneCall
} from 'lucide-react';
import { GameState, Channel, Character, Message } from '../types/game';
import { sendChatMessage } from '../services/api';

interface MessagesViewProps {
  gameState: GameState;
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  hasGeminiKey: boolean;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  gameState,
  activeChannelId,
  onSelectChannel,
  onUpdateGameState,
  hasGeminiKey,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typingCharacter, setTypingCharacter] = useState<string | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'people'>('chats');
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isSelectPersonModalOpen, setIsSelectPersonModalOpen] = useState(false);

  // New channel modal state
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelTopic, setNewChannelTopic] = useState('');
  const [newChannelType, setNewChannelType] = useState<'channel' | 'incident'>('channel');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    channels,
    messages,
    characters,
    player,
    reputation,
    memories,
    currentDay,
    currentHour,
    currentMinute,
    difficulty,
    incident,
  } = gameState;

  // Active channel & messages with robust fallback
  const activeChannel =
    channels.find(c => c.id === activeChannelId) ||
    channels[0] || {
      id: 'channel-standup',
      name: '#core-eng-standup',
      type: 'channel' as const,
      participantIds: ['sneha-rao', 'deepak-joshi'],
      topic: 'Daily engineering blockers, PR reviews, and sprint status',
      unreadCount: 0,
    };

  const channelMessages = messages[activeChannel.id] || [];

  // Active participants with fallback
  const participantCharacters = characters.filter(c =>
    (activeChannel.participantIds || []).includes(c.id)
  );

  const effectiveParticipants =
    participantCharacters.length > 0
      ? participantCharacters
      : [
          characters.find(c => c.id === 'sneha-rao') ||
            characters[0] || {
              id: 'sneha-rao',
              name: 'Sneha Rao',
              role: 'Engineering Manager',
              department: 'SCADA, Automation & Renewable Energy',
              avatar: 'SR',
              color: 'from-amber-600 to-rose-600',
              trust: 60,
              respect: 60,
              rapport: 60,
              currentMood: 'neutral' as const,
              memories: [],
            },
        ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages.length, typingCharacter]);

  // Clear unread count on channel select
  useEffect(() => {
    if (activeChannel.unreadCount > 0) {
      onUpdateGameState(prev => ({
        ...prev,
        channels: prev.channels.map(c =>
          c.id === activeChannel.id ? { ...c, unreadCount: 0 } : c
        ),
      }));
    }
  }, [activeChannel.id]);

  // Open or create a direct 1:1 chat channel for a person
  const handleOpenDirectChat = (characterId: string) => {
    const char = characters.find(c => c.id === characterId);
    if (!char) return;

    const existingDm = channels.find(
      c => c.type === 'direct' && (c.participantIds || []).includes(characterId)
    );

    if (existingDm) {
      onSelectChannel(existingDm.id);
      setIsSelectPersonModalOpen(false);
      return;
    }

    // Create new DM channel
    const newDmChannel: Channel = {
      id: `direct-${characterId}`,
      name: `${char.name} (${char.role.split(' ')[0]})`,
      type: 'direct',
      participantIds: [characterId],
      topic: `1:1 direct conversation with ${char.name} • ${char.department}`,
      unreadCount: 0,
      conversationStatus: 'active',
    };

    const initialMsg: Message = {
      id: `msg-init-${Date.now()}`,
      channelId: newDmChannel.id,
      senderId: char.id,
      senderName: char.name,
      text: `Hi ${player.name.split(' ')[0]}, this is ${char.name} (${char.role}). Feel free to reach out anytime regarding ${char.department} deliverables.`,
      timestamp: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
      emotion: 'supportive',
    };

    onUpdateGameState(prev => ({
      ...prev,
      channels: [newDmChannel, ...prev.channels],
      messages: {
        ...prev.messages,
        [newDmChannel.id]: [initialMsg],
      },
    }));

    onSelectChannel(newDmChannel.id);
    setIsSelectPersonModalOpen(false);
  };

  // Create new group channel
  const handleCreateGroupChannel = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newChannelName.trim().replace(/^#/, '').toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;

    const channelId = `channel-${cleanName}-${Date.now()}`;
    const formattedName = `#${cleanName}`;
    const finalParticipants =
      selectedParticipantIds.length > 0
        ? selectedParticipantIds
        : ['sneha-rao', 'deepak-joshi'];

    const newGroupChannel: Channel = {
      id: channelId,
      name: formattedName,
      type: newChannelType,
      participantIds: finalParticipants,
      topic: newChannelTopic.trim() || `Group collaboration channel for ${formattedName}`,
      unreadCount: 0,
      conversationStatus: 'active',
      incidentSeverity: newChannelType === 'incident' ? 'SEV-1' : undefined,
    };

    const firstChar = characters.find(c => c.id === finalParticipants[0]) || characters[0];
    const greetingMsg: Message = {
      id: `msg-group-init-${Date.now()}`,
      channelId: channelId,
      senderId: firstChar.id,
      senderName: firstChar.name,
      text: `Created new group channel ${formattedName}. Welcome team! Let's align on our deliverables.`,
      timestamp: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
      emotion: 'supportive',
    };

    onUpdateGameState(prev => ({
      ...prev,
      channels: [newGroupChannel, ...prev.channels],
      messages: {
        ...prev.messages,
        [channelId]: [greetingMsg],
      },
    }));

    // Reset modal state
    setNewChannelName('');
    setNewChannelTopic('');
    setNewChannelType('channel');
    setSelectedParticipantIds([]);
    setIsCreateChannelModalOpen(false);

    onSelectChannel(channelId);
  };

  // Toggle participant selection in new channel modal
  const toggleParticipantSelection = (charId: string) => {
    setSelectedParticipantIds(prev =>
      prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]
    );
  };

  // Suggested contextual thoughts tailored to character and channel
  const getContextualSuggestions = () => {
    const channelId = activeChannel.id.toLowerCase();

    if (channelId.includes('ananya')) {
      return [
        'Haha yeah 😭 don\'t let Sneha catch us chatting!',
        'Coffee break at the 4th floor pantry in 10 mins?',
        'I\'m checking the user story on Confluence under Section 3.4 now.',
        'Still working on that report? Sneha always piles on before releases 😂',
      ];
    }
    if (channelId.includes('deepak')) {
      return [
        'RS485 physical line is stable. I\'m checking the Modbus TCP gateway baud rate now.',
        'The slave inverter returned a 0x83 exception code; checking the register offset mapping.',
        'Partition offset lag is clearing after restarting the consumer group in staging.',
        'Ran curl against staging ingress; latency normalized to 28ms.',
      ];
    }
    if (channelId.includes('vikramaditya')) {
      return [
        'Vikramaditya, our team is actively on the bridge; ETA 20 mins to clear the gateway buffer.',
        'Confirming zero telemetry data loss; readings are reconciling in the database now.',
        'We have isolated the root cause to connection pool starvation; patch is in review.',
      ];
    }
    if (channelId.includes('sneha')) {
      return [
        'I\'ve isolated the bottleneck to the gateway buffer; ETA 4 PM to push the fix.',
        'Taking full ownership of this deliverable; post-mortem doc is in progress.',
        'Do I need to attend the 3 PM client sync with Apex Global?',
        'The RS485 loop looks fine. I\'m checking the converter logs right now.',
      ];
    }
    if (channelId.includes('automation-team')) {
      return [
        'Raw telemetry values are updating normally; investigating the dashboard mapping.',
        'Deepak, should we reload the Modbus gateway configuration in staging?',
        'PR #842 is ready for review with end-to-end integration tests.',
        'Update: Apex Global telemetry latency dropped back to baseline.',
      ];
    }
    if (channelId.includes('incident')) {
      return [
        'Connection pool active count is 100/100; initiating immediate pod scale-up.',
        'Rollback to commit #7b31 initiated; waiting for canary verification.',
        'Client endpoint latency dropped from 2200ms to 45ms. Mitigating now.',
      ];
    }
    return [
      'Thanks for the update. I will check the documentation and report back.',
      'Could we hop on a quick 5-minute huddle so I can walk you through the logs?',
      'Understood. I will make sure this is tested across all edge cases before merging.',
    ];
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputText).trim();
    if (!textToSend || isSending) return;

    setInputText('');
    setIsSending(true);

    const playerMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId: activeChannel.id,
      senderId: 'player',
      senderName: player.name,
      text: textToSend,
      timestamp: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
      isPlayer: true,
    };

    // Optimistically update conversation
    onUpdateGameState(prev => {
      const updatedMessages = {
        ...prev.messages,
        [activeChannel.id]: [...(prev.messages[activeChannel.id] || []), playerMsg],
      };
      return {
        ...prev,
        messages: updatedMessages,
      };
    });

    const primaryChar = effectiveParticipants[0] || { name: 'Sneha Rao', id: 'sneha-rao' };
    setTypingCharacter(`${primaryChar.name} is analyzing...`);

    try {
      const response = await sendChatMessage({
        channel: activeChannel,
        activeCharacters: effectiveParticipants,
        conversationHistory: [...channelMessages, playerMsg],
        playerMessage: textToSend,
        player,
        reputation,
        memories,
        currentTime: { day: currentDay, hour: currentHour, minute: currentMinute },
        difficulty,
        activeIncident: incident,
        tasks: gameState.tasks,
      });

      setTypingCharacter(null);

      // Append character reply/replies with followUpQuestion and emotion
      const repliesList =
        response.replies && response.replies.length > 0
          ? response.replies
          : [
              {
                characterId: primaryChar.id,
                characterName: primaryChar.name,
                text: `Thanks for the update, ${player.name.split(' ')[0]}. Let's make sure all verification tests pass before the deployment cutoff.`,
                emotion: 'supportive',
                intent: 'update',
              },
            ];

      const newCharacterReplies: Message[] = repliesList.map((rep, idx) => ({
        id: `reply-${Date.now()}-${idx}`,
        channelId: activeChannel.id,
        senderId: rep.characterId,
        senderName: rep.characterName,
        text: rep.text,
        timestamp: `${currentHour.toString().padStart(2, '0')}:${(currentMinute + 1).toString().padStart(2, '0')}`,
        emotion: rep.emotion,
        intent: rep.intent,
        followUpQuestion: rep.followUpQuestion || undefined,
      }));

      // Compute consequences and state sync
      onUpdateGameState(prev => {
        // Updated reputation
        const repChanges = response.reputationChanges || {};
        const newReputation = {
          managerTrust: Math.min(100, Math.max(0, prev.reputation.managerTrust + (repChanges.managerTrustDelta || 0))),
          teamTrust: Math.min(100, Math.max(0, prev.reputation.teamTrust + (repChanges.teamTrustDelta || 0))),
          customerTrust: Math.min(100, Math.max(0, prev.reputation.customerTrust + (repChanges.customerTrustDelta || 0))),
          professionalReputation: Math.min(100, Math.max(0, prev.reputation.professionalReputation + (repChanges.managerTrustDelta || 0))),
          hrReputation: Math.min(100, Math.max(0, prev.reputation.hrReputation + (repChanges.hrReputationDelta || 0))),
        };

        // Updated character relationship deltas and moods
        const updatedCharacters = prev.characters.map(char => {
          const delta = response.relationshipChanges?.[char.id];
          const charReply = (response.replies || []).find(r => r.characterId === char.id);
          let updatedChar = { ...char };

          if (charReply && charReply.emotion) {
            updatedChar.currentMood = charReply.emotion as any;
          }

          if (delta) {
            updatedChar.trust = Math.min(100, Math.max(0, (char.trust || 50) + (delta.trustDelta || 0)));
            updatedChar.respect = Math.min(100, Math.max(0, (char.respect || 50) + (delta.respectDelta || 0)));
            updatedChar.rapport = Math.min(100, Math.max(0, (char.rapport || 50) + (delta.rapportDelta || 0)));
          }
          return updatedChar;
        });

        // Update active channel topic and conversation state
        const updatedChannels = prev.channels.map(c => {
          if (c.id === activeChannel.id) {
            return {
              ...c,
              topic: response.conversationState?.topic || c.topic,
              subtopic: response.conversationState?.subtopic || c.subtopic,
              unresolvedQuestions: response.conversationState?.unresolvedQuestions || c.unresolvedQuestions,
              activePromises: response.conversationState?.activePromises || c.activePromises,
              conversationStatus: (response.conversationState?.conversationStatus as any) || c.conversationStatus || 'active',
            };
          }
          return c;
        });

        // Sync tasks if task actions were generated
        let updatedTasks = [...prev.tasks];
        if (response.taskActions && Array.isArray(response.taskActions)) {
          for (const action of response.taskActions) {
            if (action.action === 'CREATE' && action.title) {
              updatedTasks.push({
                id: action.taskId || `TASK-${Date.now()}`,
                title: action.title,
                description: `Task assigned during team discussion with ${primaryChar.name}.`,
                priority: 'HIGH',
                deadlineDay: currentDay,
                deadlineHour: action.deadlineHour || '17:00',
                status: 'IN_PROGRESS',
                estimatedHours: 3,
                stakeholders: [primaryChar.name],
                impact: 'Directly impacts sprint deliverable and client SLA.',
              });
            } else if (action.action === 'COMPLETE') {
              updatedTasks = updatedTasks.map(t =>
                t.id === action.taskId ? { ...t, status: 'DONE' as const } : t
              );
            }
          }
        }

        // Hidden evaluation record
        const newEvaluations = response.hiddenEvaluation
          ? [
              ...prev.evaluations,
              {
                ...response.hiddenEvaluation,
                turnId: `turn-${Date.now()}`,
                timestamp: `Day ${currentDay}, ${currentHour}:${currentMinute}`,
              },
            ]
          : prev.evaluations;

        // New memories
        const newMems = (response.newMemories || []).map(m => ({
          id: `mem-${Date.now()}-${Math.random()}`,
          day: currentDay,
          type: m.type,
          summary: m.summary,
          involvedCharacters: m.involvedCharacters || [primaryChar.name],
          status: 'ACTIVE' as const,
        }));

        // Notification string
        if (response.hiddenEvaluation?.summary) {
          setRecentNotification(response.hiddenEvaluation.summary);
          setTimeout(() => setRecentNotification(null), 5000);
        }

        return {
          ...prev,
          messages: {
            ...prev.messages,
            [activeChannel.id]: [...(prev.messages[activeChannel.id] || []), ...newCharacterReplies],
          },
          channels: updatedChannels,
          characters: updatedCharacters,
          tasks: updatedTasks,
          reputation: newReputation,
          evaluations: newEvaluations,
          memories: [...prev.memories, ...newMems],
          player: {
            ...prev.player,
            xp: prev.player.xp + 15,
            performanceScore: Math.min(100, Math.max(0, prev.player.performanceScore + (response.performanceEffect?.scoreDelta || 0))),
          },
        };
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      setTypingCharacter(null);
      const fallbackReply: Message = {
        id: `reply-fb-${Date.now()}`,
        channelId: activeChannel.id,
        senderId: primaryChar.id,
        senderName: primaryChar.name,
        text: `Got your update, ${player.name.split(' ')[0]}. Let's verify these changes and keep the team posted in the channel.`,
        timestamp: `${currentHour.toString().padStart(2, '0')}:${(currentMinute + 1).toString().padStart(2, '0')}`,
        emotion: 'supportive',
        intent: 'update',
      };
      onUpdateGameState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [activeChannel.id]: [...(prev.messages[activeChannel.id] || []), fallbackReply],
        },
      }));
    } finally {
      setIsSending(false);
      setTypingCharacter(null);
    }
  };

  // Simulate proactive coworker follow-up / check-in
  const handleSimulateFollowUp = async () => {
    if (isSending) return;
    const primaryChar = effectiveParticipants[0] || { name: 'Sneha Rao', id: 'sneha-rao' };
    setIsSending(true);
    setTypingCharacter(`${primaryChar.name} is checking in on deliverables...`);

    try {
      const response = await sendChatMessage({
        channel: activeChannel,
        activeCharacters: effectiveParticipants,
        conversationHistory: channelMessages,
        playerMessage: `[System Event: ${primaryChar.name} proactively checks in on ${player.name} for status on active deliverables, deadlines, or open questions.]`,
        player,
        reputation,
        memories,
        currentTime: { day: currentDay, hour: currentHour, minute: currentMinute },
        difficulty,
        activeIncident: incident,
        tasks: gameState.tasks,
      });

      setTypingCharacter(null);

      const repliesList =
        response.replies && response.replies.length > 0
          ? response.replies
          : [
              {
                characterId: primaryChar.id,
                characterName: primaryChar.name,
                text: `Hey ${player.name.split(' ')[0]}, just checking in on the latest sprint tasks. Let me know if you are blocked on anything!`,
                emotion: 'supportive',
                intent: 'check-in',
              },
            ];

      const replies: Message[] = repliesList.map((rep, idx) => ({
        id: `ping-${Date.now()}-${idx}`,
        channelId: activeChannel.id,
        senderId: rep.characterId,
        senderName: rep.characterName,
        text: rep.text,
        timestamp: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
        emotion: rep.emotion,
        intent: rep.intent,
        followUpQuestion: rep.followUpQuestion || undefined,
      }));

      onUpdateGameState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [activeChannel.id]: [...(prev.messages[activeChannel.id] || []), ...replies],
        },
      }));
    } catch (e) {
      console.error(e);
      setTypingCharacter(null);
    } finally {
      setIsSending(false);
      setTypingCharacter(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter channels and characters by search query
  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.topic && c.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCharacters = characters.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChannels = filteredChannels.filter(c => c.type !== 'direct');

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* PERSISTENT LEFT SIDEBAR */}
      <div className="w-80 shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-col z-10 overflow-hidden">
        {/* Workspace Chat Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                Workspace Hub
              </span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Nexora Global Slack
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCreateChannelModalOpen(true)}
              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Create New Channel / Group Chat"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px]">Channel</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="p-2.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search contacts, channels, roles..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Chats vs People Directory */}
        <div className="p-2 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <div className="flex p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl gap-1">
            <button
              onClick={() => setSidebarTab('chats')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'chats'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Channels ({channels.length})</span>
            </button>
            <button
              onClick={() => setSidebarTab('people')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'people'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contacts ({characters.length})</span>
            </button>
          </div>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4 text-xs">
          {sidebarTab === 'chats' ? (
            <>
              {/* 1. GROUP CHANNELS SECTION (VISUALLY DISTINGUISHED) */}
              <div className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Team & Incident Channels
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {groupChannels.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {groupChannels.map(channel => {
                    const isActive = channel.id === activeChannel.id;
                    const isIncident = channel.type === 'incident';

                    return (
                      <button
                        key={channel.id}
                        onClick={() => onSelectChannel(channel.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-xs ring-1 ring-blue-500'
                            : isIncident
                            ? 'bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-100/80 font-bold'
                            : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isIncident ? (
                            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive
                                  ? 'bg-blue-700 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <Hash className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-bold">
                                {channel.name.replace(/^#/, '')}
                              </span>
                              {isIncident && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-red-600 text-white font-black uppercase">
                                  SEV-1
                                </span>
                              )}
                            </div>
                            {channel.topic && (
                              <span
                                className={`block text-[10px] truncate ${
                                  isActive
                                    ? 'text-blue-100'
                                    : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {channel.topic}
                              </span>
                            )}
                          </div>
                        </div>

                        {channel.unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 shadow-xs">
                            {channel.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. DIRECT CONTACTS SECTION (VISUALLY DISTINGUISHED WITH CIRCULAR AVATARS) */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <div className="px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Direct Contacts & Colleagues
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSelectPersonModalOpen(true)}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>+ Person</span>
                  </button>
                </div>

                <div className="space-y-1">
                  {characters
                    .filter(
                      char =>
                        !searchQuery ||
                        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        char.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        char.department.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(char => {
                      const dmChannel = channels.find(
                        c => c.type === 'direct' && (c.participantIds || []).includes(char.id)
                      );
                      const isActive = dmChannel ? dmChannel.id === activeChannel.id : false;
                      const unread = dmChannel ? dmChannel.unreadCount : 0;

                      return (
                        <button
                          key={char.id}
                          onClick={() => handleOpenDirectChat(char.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs ring-1 ring-blue-500'
                              : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Circular Contact Avatar */}
                            <div className="relative shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full bg-gradient-to-tr ${
                                  char.color || 'from-slate-600 to-slate-800'
                                } flex items-center justify-center text-xs font-bold text-white shadow-xs`}
                              >
                                {char.avatar || 'DM'}
                              </div>
                              {char.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-2xs" />
                              )}
                            </div>

                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate font-bold text-xs">{char.name}</span>
                                {char.currentMood && (
                                  <span
                                    className={`text-[9px] px-1 py-0.2 rounded uppercase font-semibold ${
                                      isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                    }`}
                                  >
                                    {char.currentMood}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`block text-[10px] truncate ${
                                  isActive
                                    ? 'text-blue-100'
                                    : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {char.role} • Trust {char.trust}%
                              </span>
                            </div>
                          </div>

                          {unread > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 shadow-xs">
                              {unread}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            /* FULL CONTACTS / PEOPLE DIRECTORY */
            <div className="space-y-2">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Nexora Colleague Directory</span>
                <span>{filteredCharacters.length} People</span>
              </div>

              {filteredCharacters.map(char => (
                <div
                  key={char.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-tr ${char.color} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs`}
                      >
                        {char.avatar}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                          {char.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{char.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenDirectChat(char.id)}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat</span>
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[150px]">{char.department}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Trust: {char.trust}% • Respect: {char.respect}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE CHAT WINDOW - FILLS ALL REMAINING SPACE */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Active Header */}
        <div className="h-14 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/90 shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {activeChannel.type === 'incident' ? (
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : activeChannel.type === 'direct' ? (
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${
                  effectiveParticipants[0]?.color || 'from-blue-600 to-indigo-600'
                } flex items-center justify-center text-xs text-white font-bold shadow-xs`}
              >
                {effectiveParticipants[0]?.avatar || 'DM'}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                <Hash className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {activeChannel.name}
                </span>
                {activeChannel.type === 'direct' && effectiveParticipants[0] && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {effectiveParticipants[0].role}
                  </span>
                )}
                {activeChannel.type === 'incident' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase">
                    SEV-1 LIVE
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-lg hidden sm:block">
                {activeChannel.topic || 'Workspace discussion'}
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateFollowUp}
              disabled={isSending}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shadow-2xs"
              title="Request coworker status check-in"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Coworker Check-In</span>
            </button>

            {/* Stakeholder Avatars */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              {effectiveParticipants.slice(0, 4).map(char => (
                <div
                  key={char.id}
                  title={`${char.name} (${char.role}) - Trust: ${char.trust}%`}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr ${char.color} flex items-center justify-center text-[10px] text-white font-bold shadow-xs cursor-help`}
                >
                  {char.avatar}
                </div>
              ))}
              {effectiveParticipants.length > 4 && (
                <span className="text-[11px] text-slate-400 font-semibold">
                  +{effectiveParticipants.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
          {channelMessages.map(msg => {
            const isMe = msg.isPlayer;
            const senderChar = characters.find(c => c.id === msg.senderId);

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs ${
                    isMe
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                      : senderChar
                      ? `bg-gradient-to-tr ${senderChar.color}`
                      : 'bg-slate-600'
                  }`}
                >
                  {isMe ? player.name.split(' ').map(n => n[0]).join('') : senderChar?.avatar || 'AI'}
                </div>

                {/* Bubble */}
                <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                  <div className={`flex items-center gap-2 text-xs ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {msg.senderName}
                    </span>
                    {senderChar && !isMe && (
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                        {senderChar.role.split(' ')[0]}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.timestamp}
                    </span>

                    {/* Emotion / tone pill */}
                    {msg.emotion && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                          msg.emotion === 'irritated' || msg.emotion === 'demanding'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : msg.emotion === 'supportive' ||
                              msg.emotion === 'impressed' ||
                              msg.emotion === 'relieved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {msg.emotion}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60 shadow-xs'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.followUpQuestion && !isMe && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Awaiting answer: "{msg.followUpQuestion}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingCharacter && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic py-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>{typingCharacter}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Live Hidden AI Evaluation Toast */}
        {recentNotification && (
          <div className="mx-5 mb-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-semibold text-[11px]">{recentNotification}</span>
            </div>
            <span className="text-[10px] text-blue-500 dark:text-blue-400 uppercase font-bold">
              AI Evaluation
            </span>
          </div>
        )}

        {/* Contextual Suggested Thoughts (Inspiration pills) */}
        <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <span className="text-slate-400 font-semibold uppercase text-[9px] shrink-0">
            Suggested:
          </span>
          {getContextualSuggestions().map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-xs transition-colors shrink-0 shadow-2xs"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Freeform Message Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white dark:bg-slate-800/60 shadow-xs transition-all">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeChannel.name}... (Type freely. Enter to send, Shift+Enter for newline)`}
              disabled={isSending}
              rows={2}
              className="w-full p-3 pr-14 text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none text-slate-900 dark:text-white placeholder-slate-400"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              className="absolute right-2.5 bottom-2.5 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-xs transition-colors"
              title="Send Response (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>
              Free text active. Coworkers evaluate professionalism, ownership, tone, and technical validity.
            </span>
            <span className="font-mono">
              {hasGeminiKey ? 'Gemini 2.5 Flash' : 'Sim Heuristic Engine'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Select Person to Chat (1:1 Direct Message) */}
      {isSelectPersonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Select Contact to Chat
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose any colleague or client to open a 1:1 direct message.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSelectPersonModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {characters.map(char => (
                <div
                  key={char.id}
                  onClick={() => handleOpenDirectChat(char.id)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${char.color} flex items-center justify-center text-xs font-bold text-white shadow-xs`}
                    >
                      {char.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {char.name}
                      </div>
                      <div className="text-xs text-slate-400">{char.role} • {char.department}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Trust: {char.trust}%
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold group-hover:underline">
                      Open Chat →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={() => setIsSelectPersonModalOpen(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Group Channel */}
      {isCreateChannelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGroupChannel}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Create New Group Channel
                  </h3>
                  <p className="text-xs text-slate-400">
                    Form a collaborative group channel with multiple team members.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateChannelModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Channel Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Channel Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">#</span>
                  <input
                    type="text"
                    required
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    placeholder="e.g. scada-monitoring, telemetry-revamp"
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Channel Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Purpose
                </label>
                <input
                  type="text"
                  value={newChannelTopic}
                  onChange={e => setNewChannelTopic(e.target.value)}
                  placeholder="e.g. Cross-functional sync for Q3 enterprise telemetry"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Channel Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Channel Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewChannelType('channel')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      newChannelType === 'channel'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Hash className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs">Team Channel</div>
                      <div className="text-[10px] text-slate-400">Regular sprint sync</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewChannelType('incident')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      newChannelType === 'incident'
                        ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-xs">Incident Bridge</div>
                      <div className="text-[10px] text-slate-400">High severity triage</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Multi-Select Participants */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Add Team Members ({selectedParticipantIds.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedParticipantIds(
                        selectedParticipantIds.length === characters.length
                          ? []
                          : characters.map(c => c.id)
                      )
                    }
                    className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedParticipantIds.length === characters.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
                  {characters.map(char => {
                    const isSelected = selectedParticipantIds.includes(char.id);
                    return (
                      <div
                        key={char.id}
                        onClick={() => toggleParticipantSelection(char.id)}
                        className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40'
                            : 'border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-tr ${char.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}
                          >
                            {char.avatar}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {char.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{char.role}</div>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateChannelModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newChannelName.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Create & Join Channel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
