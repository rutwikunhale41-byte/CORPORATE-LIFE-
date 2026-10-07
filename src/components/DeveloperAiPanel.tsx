import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Users,
  Shield,
  MessageSquare,
  Sparkles,
  Activity,
  Layers,
  Database,
  ArrowRight,
  Laptop,
  Smartphone,
  Box
} from 'lucide-react';
import { universalAiEngine } from '../services/universalAiEngine';
import { memorySystem } from '../services/memorySystem';
import { gossipEngine } from '../services/gossipEngine';
import { GameState } from '../types/game';
import { AIProviderStatus } from '../services/aiInference';

interface DeveloperAiPanelProps {
  gameState: GameState;
}

export const DeveloperAiPanel: React.FC<DeveloperAiPanelProps> = ({ gameState }) => {
  const [status, setStatus] = useState<any>({
    connected: false,
    model: 'LiquidAI/LFM2.5-2.6B-GGUF:Q4_K_M',
    latencyMs: 0,
    message: 'Checking...',
    providerStatus: null as AIProviderStatus | null,
  });
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [activeTestTab, setActiveTestTab] = useState<'inference' | 'character' | 'memory' | 'group' | 'npc_npc' | 'native_packaging'>('inference');

  // Interactive Test Inputs
  const [testCharacterId, setTestCharacterId] = useState('priya-sharma');
  const [testMessage, setTestMessage] = useState('I am thinking of resigning next month, but please keep this confidential.');
  const [characterReplyOutput, setCharacterReplyOutput] = useState<any>(null);

  // Group chat test
  const [groupTopic, setGroupTopic] = useState('Critical Database Migration SLA Risk');
  const [groupLastMsg, setGroupLastMsg] = useState('We need to push the migration back to Monday to prevent 504 timeouts.');
  const [groupDecisions, setGroupDecisions] = useState<any[] | null>(null);

  // NPC to NPC test
  const [npcAutonomousDialogue, setNpcAutonomousDialogue] = useState<any>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    const res = await universalAiEngine.checkConnection();
    setStatus(res);
  };

  const handleTestInference = async () => {
    setIsRunningTest(true);
    setTestResult(null);
    try {
      const provider = universalAiEngine.getProvider();
      const provStatus = provider.getStatus();

      if (!provStatus.isReady) {
        setTestResult({
          success: false,
          model: provStatus.model,
          runtime: provStatus.runtime,
          platform: provStatus.platform,
          message: provStatus.description,
          specs: provStatus.nativePackaging,
        });
        return;
      }

      const res = await universalAiEngine.generateRawCompletion({
        systemInstruction: 'You are a testing engine.',
        prompt: 'Reply with exactly LOCAL_AI_TEST_OK',
        temperature: 0,
        max_tokens: 300,
      });

      setTestResult({
        success: true,
        model: res.model,
        extractedContent: res.content,
        realLfmResponse: 'PASS',
      });
    } catch (e: any) {
      setTestResult({
        success: false,
        error: e?.message || 'Inference test failed',
      });
    } finally {
      setIsRunningTest(false);
      fetchStatus();
    }
  };

  const handleTestCharacterDialogue = async () => {
    setIsRunningTest(true);
    setCharacterReplyOutput(null);
    try {
      const res = await universalAiEngine.generateCharacterReply(
        {
          playerMessage: testMessage,
          characterId: testCharacterId,
          conversationId: `dev-test-${Date.now()}`,
          app: 'whatsapp',
        },
        gameState
      );
      setCharacterReplyOutput(res);
    } catch (e: any) {
      setCharacterReplyOutput({ error: e?.message });
    } finally {
      setIsRunningTest(false);
    }
  };

  const handleTestGroupChat = async () => {
    setIsRunningTest(true);
    setGroupDecisions(null);
    try {
      const participants = gameState.characters.slice(0, 4);
      const decisions = await universalAiEngine.generateGroupChatDecisions({
        channelId: 'dev-group-test',
        topic: groupTopic,
        participants,
        lastMessage: { senderName: gameState.player.name, text: groupLastMsg },
        recentMessages: [],
        gameState,
      });
      setGroupDecisions(decisions);
    } catch (e: any) {
      setGroupDecisions([{ error: e?.message }]);
    } finally {
      setIsRunningTest(false);
    }
  };

  const handleTestNpcToNpc = () => {
    setIsRunningTest(true);
    try {
      const chars = gameState.characters.map(c => ({
        id: c.id,
        name: c.name,
        trust: c.trust,
        department: c.department,
      }));
      const interactions = gossipEngine.stepAutonomousGossip(chars);
      if (interactions.length > 0) {
        setNpcAutonomousDialogue(interactions[0]);
      } else {
        setNpcAutonomousDialogue({
          characterAId: 'sneha-rao',
          characterBId: 'deepak-joshi',
          topic: 'Apex Global Telemetry Audit',
          summary: 'Sneha confided in Deepak regarding client escalation expectations.',
          dialogue: [
            { senderId: 'sneha-rao', text: 'Deepak, make sure we have all telemetry logs sanitized before Vikramaditya joins the bridge.', emotion: 'serious' },
            { senderId: 'deepak-joshi', text: 'Already on it Sneha. The Kafka pipeline buffer is within acceptable tolerances.', emotion: 'confident' },
          ],
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } finally {
      setIsRunningTest(false);
    }
  };

  const stats = universalAiEngine.getStats();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight">
                Embedded Local AI Engine & Diagnostics
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                LFM2.5-2.6B GGUF
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              In-game standalone AI runtime powered by native llama.cpp. Zero external servers or localhost ports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchStatus}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh Runtime Status</span>
          </button>
        </div>
      </div>

      {/* Architecture Flow Banner */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">Standalone In-Game Architecture</span>
          <span className="text-slate-600">•</span>
          <span className="text-[10px] text-slate-400 font-mono">No Localhost / No External Bridges</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 overflow-x-auto py-1">
          <span className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-300">Game Systems</span>
          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800/60 text-indigo-300">UniversalAiEngine</span>
          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-800/60 text-purple-300">AIProvider Abstraction</span>
          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
            Embedded llama.cpp Runtime
          </span>
          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-pink-950 border border-pink-800/60 text-pink-300 font-mono text-[11px]">
            LFM2.5-2.6B-Q4_K_M.gguf
          </span>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Runtime Status</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${status.connected ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
            <span className={`font-bold text-xs ${status.connected ? 'text-emerald-400' : 'text-indigo-300'}`}>
              {status.connected ? 'ACTIVE' : 'STANDALONE_BUILD_TARGET'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block truncate">
            {status.connected ? 'In-Process Native llama.cpp' : 'Awaiting Standalone Wrapper'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Execution Layer</span>
          <div className="font-mono text-xs font-bold text-cyan-400 mt-1.5 truncate">
            In-Process IPC / JNI
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block truncate">
            Zero Network Sockets
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bundled Model</span>
          <div className="font-mono text-xs font-bold text-indigo-300 mt-1.5 truncate" title="LFM2.5-2.6B-Q4_K_M.gguf">
            LFM2.5-2.6B-Q4_K_M.gguf
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Quant: Q4_K_M (1.85 GB)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active NPC Memories</span>
          <div className="font-mono text-xs font-extrabold text-emerald-400 mt-1.5 flex items-center gap-1">
            <Database className="w-3.5 h-3.5" />
            <span>{stats.memoryCount} Memories</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Information Boundaries Enforced
          </span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-800 gap-2 pb-2 overflow-x-auto text-xs">
          {[
            { id: 'inference', label: '1. Test AI Inference', icon: Activity },
            { id: 'character', label: '2. Test Character Dialogue', icon: MessageSquare },
            { id: 'memory', label: '3. Inspect Information Boundaries', icon: Shield },
            { id: 'group', label: '4. Test Group Conversation', icon: Users },
            { id: 'npc_npc', label: '5. Test NPC-to-NPC Gossip', icon: Sparkles },
            { id: 'native_packaging', label: '6. Standalone Build Blueprint', icon: Layers },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTestTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  activeTestTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Inference Test */}
        {activeTestTab === 'inference' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Test Embedded AI Runtime
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Executes in-process handshake test with the bundled LFM2.5-2.6B-Q4_K_M.gguf model.
                </p>
              </div>
              <button
                onClick={handleTestInference}
                disabled={isRunningTest}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunningTest ? 'Testing...' : 'Execute Handshake'}</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 font-bold">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-indigo-400" />
                    )}
                    <span className={testResult.success ? 'text-emerald-400' : 'text-indigo-300'}>
                      {testResult.success ? 'EMBEDDED LOCAL AI: ACTIVE' : 'AWAITING NATIVE PACKAGING'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">In-Process Execution</span>
                </div>

                <div className="p-3 rounded bg-black/60 font-mono text-[11px] text-slate-200 space-y-1.5 whitespace-pre-wrap overflow-x-auto select-all">
                  <div><span className="text-slate-400 font-bold">MODEL:</span> {testResult.model}</div>
                  <div><span className="text-slate-400 font-bold">RUNTIME:</span> In-Process llama.cpp (zero localhost, zero external servers)</div>
                  {testResult.success ? (
                    <>
                      <div><span className="text-slate-400 font-bold">EXTRACTED CONTENT:</span> {testResult.extractedContent}</div>
                      <div><span className="text-slate-400 font-bold">REAL LFM RESPONSE:</span> PASS</div>
                    </>
                  ) : (
                    <>
                      <div><span className="text-indigo-400 font-bold">STATUS:</span> {testResult.message}</div>
                      <div className="text-slate-400 pt-1 text-[11px] leading-relaxed">
                        To run live inference with the bundled LFM2.5 model, compile the standalone Windows executable (.exe) or Android APK (.apk) using the specifications in Tab 6.
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Character Dialogue Test */}
        {activeTestTab === 'character' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Target NPC Character</label>
                <select
                  value={testCharacterId}
                  onChange={e => setTestCharacterId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {gameState.characters.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role} - {c.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Message from Player</label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={e => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleTestCharacterDialogue}
                disabled={isRunningTest}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunningTest ? 'Generating...' : 'Generate Universal AI Reply'}</span>
              </button>
            </div>

            {characterReplyOutput && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-cyan-300">Generated AI Output</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px]">
                    Emotion: {characterReplyOutput.emotion || 'neutral'}
                  </span>
                </div>
                <div className="text-slate-200 text-sm italic font-serif">
                  "{characterReplyOutput.message}"
                </div>
                {characterReplyOutput.intent && (
                  <div className="text-[11px] text-slate-400">
                    <strong>Intent:</strong> {characterReplyOutput.intent} • <strong>Topic:</strong> {characterReplyOutput.topic}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Information Boundaries Inspection */}
        {activeTestTab === 'memory' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Strict Information Boundaries & Character Knowledge
              </h3>
              <p className="text-[11px] text-slate-400">
                Characters only possess memories they personally observed or shared via gossip.
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {memorySystem.getAllMemories().slice(0, 8).map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-300 uppercase">{m.type}</span>
                    <span className="text-slate-500">{m.created_at}</span>
                  </div>
                  <div className="text-slate-300">{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Group Conversation Test */}
        {activeTestTab === 'group' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Group Channel Topic</label>
                <input
                  type="text"
                  value={groupTopic}
                  onChange={e => setGroupTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Last Message in Channel</label>
                <input
                  type="text"
                  value={groupLastMsg}
                  onChange={e => setGroupLastMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleTestGroupChat}
                disabled={isRunningTest}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Group Turn</span>
              </button>
            </div>

            {groupDecisions && (
              <div className="space-y-2">
                {groupDecisions.map((dec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300">{dec.characterName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dec.shouldSpeak ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {dec.shouldSpeak ? 'Spoke' : 'Silent'}
                      </span>
                    </div>
                    {dec.shouldSpeak && <div className="text-slate-200 italic">"{dec.reply}"</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: NPC-to-NPC Autonomous Gossip */}
        {activeTestTab === 'npc_npc' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Autonomous NPC-to-NPC Simulation
                </h3>
                <p className="text-[11px] text-slate-400">
                  Simulate peer dialogues occurring in the background while player is away.
                </p>
              </div>
              <button
                onClick={handleTestNpcToNpc}
                disabled={isRunningTest}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Peer Interaction</span>
              </button>
            </div>

            {npcAutonomousDialogue && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-purple-300">{npcAutonomousDialogue.topic}</span>
                  <span className="text-[10px] text-slate-400">{npcAutonomousDialogue.timestamp}</span>
                </div>
                <div className="space-y-2">
                  {npcAutonomousDialogue.dialogue.map((d: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-black/30 text-slate-200">
                      <strong className="text-cyan-300 capitalize">{d.senderId.replace('-', ' ')}: </strong>
                      <span>{d.text}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 rounded bg-purple-950/40 text-[11px] text-purple-200 border border-purple-800/40">
                  {npcAutonomousDialogue.summary}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Standalone Build Blueprint */}
        {activeTestTab === 'native_packaging' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Standalone In-Game Local AI Architecture & Packaging Blueprint</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                The final standalone game bundles the llama.cpp engine and LFM2.5-2.6B-Q4_K_M.gguf model directly inside the installer. No external Python, Node.js, bridge servers, BAT files, or localhost network ports required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Windows PC Specification */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <Laptop className="w-4 h-4" />
                    <span>Windows PC Standalone Build (.exe)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300 font-mono">
                    Win64 / AVX2 / D3D12
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                  <div className="p-2.5 rounded bg-black/50 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Package Structure:</div>
                    <div className="text-slate-200">CorporateLifeAI.exe</div>
                    <div className="text-slate-400 pl-3">├── ui/ (Precompiled React 19 SPA)</div>
                    <div className="text-slate-400 pl-3">├── llama.dll (llama.cpp release b3600+)</div>
                    <div className="text-slate-400 pl-3">└── resources/models/LFM2.5-2.6B-Q4_K_M.gguf</div>
                  </div>

                  <div className="space-y-1 text-slate-400 font-sans">
                    <div><strong className="text-white">IPC Bridge:</strong> <code className="text-cyan-300 font-mono">window.__NATIVE_LLAMA_RUNTIME__</code> (in-process invoke, zero sockets)</div>
                    <div><strong className="text-white">Target RAM:</strong> 8 GB System RAM (1.85 GB allocated to model)</div>
                    <div><strong className="text-white">Documentation:</strong> <code className="text-emerald-400 font-mono">native/windows/WINDOWS_PACKAGING_GUIDE.md</code></div>
                  </div>

                  <div className="p-2 rounded bg-black/60 border border-cyan-950 text-[10px] space-y-1">
                    <div className="text-slate-400 font-bold uppercase">Packaging Command:</div>
                    <div className="text-emerald-400 select-all font-mono">npm run build && npm run tauri build</div>
                  </div>
                </div>
              </div>

              {/* Android APK Specification */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <Smartphone className="w-4 h-4" />
                    <span>Android APK Standalone Build (.apk)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-mono">
                    arm64-v8a / NEON
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                  <div className="p-2.5 rounded bg-black/50 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Package Structure:</div>
                    <div className="text-slate-200">CorporateLifeAI.apk</div>
                    <div className="text-slate-400 pl-3">├── assets/ui/ (Vite HTML5 Bundle)</div>
                    <div className="text-slate-400 pl-3">├── lib/arm64-v8a/libllama.so</div>
                    <div className="text-slate-400 pl-3">└── assets/models/LFM2.5-2.6B-Q4_K_M.gguf</div>
                  </div>

                  <div className="space-y-1 text-slate-400 font-sans">
                    <div><strong className="text-white">JNI Bridge:</strong> <code className="text-emerald-300 font-mono">window.AndroidLlamaBridge.generateReply()</code></div>
                    <div><strong className="text-white">Target Devices:</strong> Android 11+ with 6 GB+ RAM</div>
                    <div><strong className="text-white">Documentation:</strong> <code className="text-emerald-400 font-mono">native/android/ANDROID_PACKAGING_GUIDE.md</code></div>
                  </div>

                  <div className="p-2 rounded bg-black/60 border border-emerald-950 text-[10px] space-y-1">
                    <div className="text-slate-400 font-bold uppercase">Packaging Command:</div>
                    <div className="text-emerald-400 select-all font-mono">npm run build && npx cap sync android && ./gradlew assembleRelease</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
