import { memorySystem } from './memorySystem';
import { AutonomousNpcInteraction } from '../types/aiConversation';

export interface GossipFact {
  id: string;
  originCharacterId: string; // e.g. 'player' or 'sneha-rao'
  subjectCharacterId: string; // who the gossip is about
  content: string;
  isSecret: boolean;
  importance: number;
  knownByCharacterIds: string[];
}

export interface GossipTransmissionEvent {
  fromCharacterId: string;
  toCharacterId: string;
  fact: GossipFact;
  timestamp: string;
  channel: string;
}

class GossipEngine {
  private activeGossip: Map<string, GossipFact> = new Map();
  private history: GossipTransmissionEvent[] = [];

  constructor() {
    this.initDefaultGossip();
  }

  private initDefaultGossip() {
    // Initial known facts
    this.addFact({
      id: 'fact-apex-audit',
      originCharacterId: 'sneha-rao',
      subjectCharacterId: 'vikramaditya-singhania',
      content: 'Apex Global executive board is conducting a high-stakes Q2 uptime audit with heavy SLA penalty clauses.',
      isSecret: false,
      importance: 8,
      initialKnownBy: ['sneha-rao', 'deepak-joshi', 'priya-sharma'],
    });
  }

  public addFact(params: {
    id?: string;
    originCharacterId: string;
    subjectCharacterId: string;
    content: string;
    isSecret: boolean;
    importance: number;
    initialKnownBy: string[];
  }): GossipFact {
    const fact: GossipFact = {
      id: params.id || `gossip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      originCharacterId: params.originCharacterId,
      subjectCharacterId: params.subjectCharacterId,
      content: params.content,
      isSecret: params.isSecret,
      importance: params.importance,
      knownByCharacterIds: [...params.initialKnownBy],
    };

    this.activeGossip.set(fact.id, fact);

    // Add memory to initial knowers
    params.initialKnownBy.forEach(charId => {
      memorySystem.addMemory({
        characterId: charId,
        type: params.isSecret ? 'PRIVATE_MEMORY' : 'WORK_MEMORY',
        content: params.content,
        importance: params.importance,
        source: charId === params.originCharacterId ? 'direct_knowledge' : `told_by_${params.originCharacterId}`,
        visibility: params.isSecret ? 'PRIVATE' : 'SHARED',
        relatedCharacterIds: [params.subjectCharacterId],
      });
    });

    return fact;
  }

  /**
   * Check if a specific character knows a fact
   */
  public doesCharacterKnow(characterId: string, factId: string): boolean {
    const fact = this.activeGossip.get(factId);
    if (!fact) return false;
    return fact.knownByCharacterIds.includes(characterId);
  }

  /**
   * Explicitly transfer a secret/fact from Character A to Character B
   */
  public propagateGossip(params: {
    fromCharacterId: string;
    toCharacterId: string;
    factId: string;
    timeStr?: string;
  }): { success: boolean; memoryAdded?: any; message: string } {
    const { fromCharacterId, toCharacterId, factId, timeStr } = params;
    const fact = this.activeGossip.get(factId);

    if (!fact) {
      return { success: false, message: 'Fact not found in active rumors' };
    }

    if (!fact.knownByCharacterIds.includes(fromCharacterId)) {
      return {
        success: false,
        message: `${fromCharacterId} cannot share this information because they do not know it! (Strict boundary maintained)`,
      };
    }

    if (fact.knownByCharacterIds.includes(toCharacterId)) {
      return { success: true, message: `${toCharacterId} already knows this fact.` };
    }

    // Add recipient to known list
    fact.knownByCharacterIds.push(toCharacterId);

    // Create memory for recipient with preserved source
    const newMem = memorySystem.transferGossip({
      fromCharacterId,
      toCharacterId,
      fact: fact.content,
      importance: fact.importance,
      timeStr,
    });

    this.history.push({
      fromCharacterId,
      toCharacterId,
      fact,
      timestamp: timeStr || new Date().toLocaleTimeString(),
      channel: 'direct_dialogue',
    });

    return {
      success: true,
      memoryAdded: newMem,
      message: `Information naturally shared: ${fromCharacterId} informed ${toCharacterId}. Source preserved.`,
    };
  }

  /**
   * Autonomous Gossip Cycle: Check active pairs and randomly propagate gossip according to relationship intimacy
   */
  public stepAutonomousGossip(activeCharacters: Array<{ id: string; trust: number; department: string; name: string }>): AutonomousNpcInteraction[] {
    const interactions: AutonomousNpcInteraction[] = [];

    // Form pairs
    for (let i = 0; i < activeCharacters.length; i++) {
      for (let j = i + 1; j < activeCharacters.length; j++) {
        const charA = activeCharacters[i];
        const charB = activeCharacters[j];

        // Only characters in same department or high trust discuss sensitive things
        const sameDept = charA.department === charB.department;
        const avgTrust = (charA.trust + charB.trust) / 2;

        for (const [factId, fact] of this.activeGossip.entries()) {
          const aKnows = fact.knownByCharacterIds.includes(charA.id);
          const bKnows = fact.knownByCharacterIds.includes(charB.id);

          // If A knows but B doesn't, chance to share
          if (aKnows && !bKnows) {
            const shareProbability = fact.isSecret ? (avgTrust > 75 ? 0.35 : 0.05) : (sameDept ? 0.45 : 0.2);

            if (Math.random() < shareProbability) {
              const result = this.propagateGossip({
                fromCharacterId: charA.id,
                toCharacterId: charB.id,
                factId,
              });

              if (result.success) {
                interactions.push({
                  id: `npc-auto-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                  characterAId: charA.id,
                  characterBId: charB.id,
                  topic: `Discussions about ${fact.content.slice(0, 35)}...`,
                  summary: `${charA.name} shared workplace insights with ${charB.name}.`,
                  dialogue: [
                    { senderId: charA.id, text: `Hey, did you hear? ${fact.content}`, emotion: 'curious' },
                    { senderId: charB.id, text: `Wait, really? Thanks for telling me, I'll keep that in mind.`, emotion: 'surprised' },
                  ],
                  gossipTransferred: {
                    aboutCharacterId: fact.subjectCharacterId,
                    fact: fact.content,
                    wasSecret: fact.isSecret,
                  },
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  day: 1,
                });
              }
            }
          }
        }
      }
    }

    return interactions;
  }

  public getActiveGossip(): GossipFact[] {
    return Array.from(this.activeGossip.values());
  }

  public getHistory(): GossipTransmissionEvent[] {
    return this.history;
  }
}

export const gossipEngine = new GossipEngine();
