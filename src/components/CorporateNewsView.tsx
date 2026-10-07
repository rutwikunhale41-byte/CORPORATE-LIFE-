import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Globe,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';
import { GameState, NewsItem, NewsAction } from '../types/game';
import { fetchCorporateNews } from '../services/api';

interface CorporateNewsViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  hasGeminiKey: boolean;
}

export const CorporateNewsView: React.FC<CorporateNewsViewProps> = ({
  gameState,
  onUpdateGameState,
  hasGeminiKey,
}) => {
  const { newsItems = [], currentDay, player, reputation } = gameState;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const categories = [
    'ALL',
    'Cloud & Infrastructure',
    'AI & Enterprise Software',
    'Cybersecurity & Regulations',
    'Market & Economy',
  ];

  // Fetch initial news if empty
  useEffect(() => {
    if (!newsItems || newsItems.length === 0) {
      handleFetchNews();
    }
  }, []);

  const handleFetchNews = async (cat?: string) => {
    setIsLoading(true);
    try {
      const result = await fetchCorporateNews({
        category: cat || selectedCategory,
        currentDay,
        playerTitle: player.title,
      });

      if (result.news && Array.isArray(result.news)) {
        onUpdateGameState(prev => ({
          ...prev,
          newsItems: result.news,
        }));
      }

      if (result.searchQueries) {
        setSearchQueries(result.searchQueries);
      }
    } catch (err) {
      console.error('Failed to fetch corporate news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeAction = (newsItem: NewsItem, action: NewsAction) => {
    // Prevent duplicate action execution on same news item
    if (newsItem.actionTaken) return;

    onUpdateGameState(prev => {
      const repImpact = action.reputationImpact;
      const updatedReputation = {
        managerTrust: Math.min(100, Math.max(0, prev.reputation.managerTrust + (repImpact.managerTrustDelta || 0))),
        professionalReputation: Math.min(100, Math.max(0, prev.reputation.professionalReputation + (repImpact.professionalReputationDelta || 0))),
        teamTrust: Math.min(100, Math.max(0, prev.reputation.teamTrust + (repImpact.teamTrustDelta || 0))),
        customerTrust: Math.min(100, Math.max(0, prev.reputation.customerTrust + (repImpact.customerTrustDelta || 0))),
        hrReputation: prev.reputation.hrReputation,
      };

      const updatedNewsItems = (prev.newsItems || []).map(item =>
        item.id === newsItem.id ? { ...item, actionTaken: action.label } : item
      );

      const newMemory = {
        id: `mem-news-${Date.now()}`,
        day: currentDay,
        type: 'ACHIEVEMENT' as const,
        summary: action.memorySummary || `Acted on industry report: ${newsItem.headline}`,
        involvedCharacters: ['Sneha Rao', 'Leadership'],
        status: 'HONORED' as const,
      };

      return {
        ...prev,
        reputation: updatedReputation,
        newsItems: updatedNewsItems,
        memories: [...prev.memories, newMemory],
        player: {
          ...prev.player,
          xp: prev.player.xp + action.xpGain,
          performanceScore: Math.min(100, prev.player.performanceScore + 2),
        },
      };
    });

    setActionSuccessNotice(
      `Strategic Action Executed: "${action.label}". Professional Reputation increased!`
    );
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  const filteredNews = (newsItems || []).filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl border border-blue-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-400/30 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Search Grounding Engine</span>
            </span>
            <span className="text-xs text-blue-200">Real-Time Market Radar</span>
          </div>

          <h1 className="text-2xl font-black mt-1.5 tracking-tight flex items-center gap-2.5">
            <span>Corporate News & Industry Intelligence</span>
          </h1>

          <p className="text-xs text-blue-200/80 mt-1 max-w-2xl leading-relaxed">
            Live enterprise technology news, cloud infrastructure outages, cybersecurity mandates, and market shifts grounded in Google Search. Proactive strategic actions directly elevate your professional standing and manager trust.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleFetchNews()}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Grounding via Google Search...' : 'Fetch Latest Industry News'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Reputation Impact Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Manager Trust</div>
            <div className="font-extrabold text-slate-900 dark:text-white">Sneha Rao</div>
            <div className="text-[11px] text-slate-500">Briefing on cloud risks</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Reputation</div>
            <div className="font-extrabold text-slate-900 dark:text-white">Professional Stature</div>
            <div className="text-[11px] text-slate-500">Leading architecture memos</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Customer Trust</div>
            <div className="font-extrabold text-slate-900 dark:text-white">Apex Global</div>
            <div className="text-[11px] text-slate-500">Preemptive SLA protection</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Team Trust</div>
            <div className="font-extrabold text-slate-900 dark:text-white">Deepak & SRE</div>
            <div className="text-[11px] text-slate-500">Sharing outage learnings</div>
          </div>
        </div>
      </div>

      {/* Search Queries Telemetry pill */}
      {searchQueries && searchQueries.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs flex flex-wrap items-center gap-2">
          <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Search Grounding Queries:</span>
          </span>
          {searchQueries.map((q, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-blue-200 dark:border-blue-800 shadow-2xs"
            >
              "{q}"
            </span>
          ))}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              handleFetchNews(cat);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Success Banner when action executed */}
      {actionSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessNotice}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Reputation Updated
          </span>
        </div>
      )}

      {/* News Feed Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Grounding Industry News with Google Search...
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Scanning enterprise technology feeds, regulatory releases, and cloud telemetry reports.
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              No news updates in this category.
            </div>
            <button
              onClick={() => handleFetchNews('ALL')}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Reset filter to All News
            </button>
          </div>
        ) : (
          filteredNews.map(item => {
            const hasActionTaken = Boolean(item.actionTaken);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/80 transition-all space-y-4"
              >
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.publishedTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.sourceName}</span>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-0.5 font-medium ml-1"
                        title="View Grounded Web Source"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-[11px]">Source</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Headline & Summary */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {item.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Relevance to Nexora */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Relevance to Nexora Global & Your Engineering Team</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.relevanceToNexora}
                  </p>
                </div>

                {/* Strategic Action Choices */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                      Professional Initiatives (Take Action to Shape Reputation)
                    </span>
                    {hasActionTaken && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Action Executed: {item.actionTaken}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.actions.map(act => (
                      <button
                        key={act.id}
                        disabled={hasActionTaken}
                        onClick={() => handleTakeAction(item, act)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          hasActionTaken
                            ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                            : 'bg-white dark:bg-slate-800 hover:border-blue-500 hover:shadow-xs border-slate-200 dark:border-slate-700 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            <span>{act.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {act.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <div className="flex gap-2">
                            {act.reputationImpact.managerTrustDelta && (
                              <span>+{act.reputationImpact.managerTrustDelta}% Manager Trust</span>
                            )}
                            {act.reputationImpact.professionalReputationDelta && (
                              <span>+{act.reputationImpact.professionalReputationDelta}% Reputation</span>
                            )}
                            {act.reputationImpact.customerTrustDelta && (
                              <span>+{act.reputationImpact.customerTrustDelta}% Customer</span>
                            )}
                          </div>
                          <span className="font-mono text-blue-600 font-bold">+{act.xpGain} XP</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
