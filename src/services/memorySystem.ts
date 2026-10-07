import { NpcMemory, MemoryCategory, MemoryVisibility } from '../types/aiConversation';

const STORAGE_KEY = 'corporate_life_ai_npc_memories_v2';

// Baseline initial memories respecting strict boundaries
export const BASELINE_NPC_MEMORIES: NpcMemory[] = [
  {
    id: 'mem-priya-01',
    character_id: 'priya-sharma',
    type: 'WORK_MEMORY',
    content: 'Manages People Operations, regional labor law compliance, and corporate recruitment screening standards.',
    importance: 8,
    created_at: 'Day 1, 08:30 AM',
    last_referenced: 'Day 1, 09:00 AM',
    source: 'job_role_definition',
    visibility: 'PRIVATE',
    related_character_ids: ['priya-sharma'],
    confidence: 1.0,
  },
  {
    id: 'mem-priya-02',
    character_id: 'priya-sharma',
    type: 'RELATIONSHIP_MEMORY',
    content: 'Values professional integrity, prompt HRIS audit updates, and transparent communication above all.',
    importance: 7,
    created_at: 'Day 1, 08:30 AM',
    last_referenced: 'Day 1, 09:00 AM',
    source: 'personal_philosophy',
    visibility: 'PRIVATE',
    related_character_ids: ['priya-sharma'],
    confidence: 1.0,
  },
  {
    id: 'mem-sneha-01',
    character_id: 'sneha-rao',
    type: 'WORK_MEMORY',
    content: 'Manages Engineering & SRE platforms with strict 99.99% uptime SLA commitments for enterprise clients like Apex Global.',
    importance: 9,
    created_at: 'Day 1, 08:30 AM',
    last_referenced: 'Day 1, 09:00 AM',
    source: 'job_role_definition',
    visibility: 'PRIVATE',
    related_character_ids: ['sneha-rao'],
    confidence: 1.0,
  },
  {
    id: 'mem-deepak-01',
    character_id: 'deepak-joshi',
    type: 'WORK_MEMORY',
    content: 'Deep tech lead specializing in distributed systems, Kafka brokers, and database concurrency controls.',
    importance: 8,
    created_at: 'Day 1, 08:30 AM',
    last_referenced: 'Day 1, 09:00 AM',
    source: 'job_role_definition',
    visibility: 'PRIVATE',
    related_character_ids: ['deepak-joshi'],
    confidence: 1.0,
  },
  {
    id: 'mem-ananya-01',
    character_id: 'ananya-iyer',
    type: 'SOCIAL_MEMORY',
    content: 'Enjoys casual chai breaks and friendly office banter, but keeps confidential client product timelines strictly guarded.',
    importance: 6,
    created_at: 'Day 1, 08:30 AM',
    last_referenced: 'Day 1, 09:00 AM',
    source: 'personal_habit',
    visibility: 'PRIVATE',
    related_character_ids: ['ananya-iyer'],
    confidence: 1.0,
  },
  {
    id: 'mem-vikram-01',
    character_id: 'vikramaditya-singhania',
    type: 'WORK_MEMORY',
    content: 'Apex Global VP expecting zero tolerance for telemetry outage SLA breaches during quarterly financial audits.',
    importance: 9,
    created_at: 'Day 1, 08:30 AM',
    last_referenced: 'Day 1, 09:00 AM',
    source: 'client_mandate',
    visibility: 'PRIVATE',
    related_character_ids: ['vikramaditya-singhania'],
    confidence: 1.0,
  },
];

class MemorySystem {
  private memories: Map<string, NpcMemory> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: NpcMemory[] = JSON.parse(saved);
        parsed.forEach(m => this.memories.set(m.id, m));
      } else {
        BASELINE_NPC_MEMORIES.forEach(m => this.memories.set(m.id, m));
        this.saveToStorage();
      }
    } catch (e) {
      BASELINE_NPC_MEMORIES.forEach(m => this.memories.set(m.id, m));
    }
  }

  public saveToStorage() {
    try {
      const list = Array.from(this.memories.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to persist memories to localStorage:', e);
    }
  }

  public addMemory(params: {
    characterId: string;
    type: MemoryCategory;
    content: string;
    importance?: number;
    source?: string;
    visibility?: MemoryVisibility;
    relatedCharacterIds?: string[];
    confidence?: number;
    appContext?: string;
    emotionalValence?: number;
    timeStr?: string;
  }): NpcMemory {
    const memory: NpcMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      character_id: params.characterId,
      type: params.type,
      content: params.content,
      importance: params.importance ?? 5,
      created_at: params.timeStr || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      last_referenced: params.timeStr || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: params.source || 'direct_experience',
      visibility: params.visibility || 'PRIVATE',
      related_character_ids: params.relatedCharacterIds || [params.characterId],
      confidence: params.confidence ?? 1.0,
      app_context: params.appContext,
      emotional_valence: params.emotionalValence ?? 0,
    };

    this.memories.set(memory.id, memory);
    this.saveToStorage();
    return memory;
  }

  public getCharacterMemories(characterId: string): NpcMemory[] {
    return Array.from(this.memories.values()).filter(
      m =>
        m.character_id === characterId ||
        m.visibility === 'PUBLIC' ||
        (m.visibility === 'SHARED' && m.related_character_ids.includes(characterId))
    );
  }

  public getAllMemories(): NpcMemory[] {
    return Array.from(this.memories.values());
  }

  /**
   * Smart Boundary-Aware Memory Retrieval for Local AI
   * Retrieves ONLY what this specific NPC knows, ranked by importance and keyword match.
   */
  public retrieveRelevantMemories(params: {
    characterId: string;
    query: string;
    limit?: number;
    appContext?: string;
  }): NpcMemory[] {
    const { characterId, query, limit = 5, appContext } = params;
    const accessible = this.getCharacterMemories(characterId);

    const queryWords = query
      .toLowerCase()
      .split(/[\s,.;!?]+/)
      .filter(w => w.length > 3);

    const scored = accessible.map(mem => {
      let score = mem.importance * 1.5;

      const contentLower = mem.content.toLowerCase();
      queryWords.forEach(w => {
        if (contentLower.includes(w)) {
          score += 4.0;
        }
      });

      if (appContext && mem.app_context === appContext) {
        score += 2.0;
      }

      // Boost promise & conflict memories
      if (mem.type === 'PROMISE_COMMITMENT_MEMORY' || mem.type === 'RELATIONSHIP_MEMORY') {
        score += 2.5;
      }

      return { mem, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Update last_referenced on retrieved memories
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const topResults = scored.slice(0, limit).map(s => {
      s.mem.last_referenced = nowStr;
      return s.mem;
    });

    this.saveToStorage();
    return topResults;
  }

  /**
   * Transfer knowledge / Gossip from Character A to Character B
   */
  public transferGossip(params: {
    fromCharacterId: string;
    toCharacterId: string;
    fact: string;
    importance?: number;
    confidence?: number;
    timeStr?: string;
  }): NpcMemory {
    const memory = this.addMemory({
      characterId: params.toCharacterId,
      type: 'GOSSIP_MEMORY',
      content: params.fact,
      importance: params.importance || 6,
      source: `heard_from_${params.fromCharacterId}`,
      visibility: 'PRIVATE',
      relatedCharacterIds: [params.toCharacterId, params.fromCharacterId],
      confidence: params.confidence || 0.85,
      timeStr: params.timeStr,
    });
    return memory;
  }

  public clearAll() {
    this.memories.clear();
    BASELINE_NPC_MEMORIES.forEach(m => this.memories.set(m.id, m));
    this.saveToStorage();
  }
}

export const memorySystem = new MemorySystem();
