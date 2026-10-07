import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { GameState, PerformanceReview } from '../types/game';
import { generateMonthlyReview } from '../services/api';

interface PerformanceViewProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ gameState, onUpdateGameState }) => {
  const { player, reputation, reviews, evaluations, memories, tasks, currentDay } = gameState;
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'appraisal' | 'evaluations'>('appraisal');

  const handleRequestReview = async () => {
    setIsGenerating(true);
    const completedCount = tasks.filter(t => t.status === 'DONE').length;
    const failedCount = tasks.filter(t => t.status !== 'DONE' && t.deadlineDay < currentDay).length;

    try {
      const reviewResult = await generateMonthlyReview({
        player,
        reputation,
        memories,
        tasksCompleted: completedCount,
        tasksFailed: failedCount,
        monthNumber: Math.max(1, Math.floor(currentDay / 30) + 1),
        evaluations,
      });

      const newReview: PerformanceReview = {
        id: `rev-${Date.now()}`,
        month: Math.max(1, Math.floor(currentDay / 30) + 1),
        overallRating: reviewResult.overallRating || 4.2,
        strengths: reviewResult.strengths || ['High ownership', 'System stability triage'],
        areasToImprove: reviewResult.areasToImprove || ['Proactive updates before deadline'],
        managerComment: reviewResult.managerComment || 'Good progress this cycle.',
        hrComment: reviewResult.hrComment || 'Maintains high code-of-conduct adherence.',
        careerRecommendation: reviewResult.careerRecommendation || 'High Potential',
        salaryIncrementOffered: reviewResult.salaryIncrementOffered || 10,
        promoted: Boolean(reviewResult.promoted),
        newLevel: reviewResult.newLevel,
        newTitle: reviewResult.newTitle,
        accepted: false,
        timestamp: `Day ${currentDay}`,
      };

      onUpdateGameState(prev => {
        const updatedSalary = newReview.salaryIncrementOffered
          ? Math.round(prev.player.salary * (1 + newReview.salaryIncrementOffered / 100))
          : prev.player.salary;

        return {
          ...prev,
          reviews: [newReview, ...prev.reviews],
          player: {
            ...prev.player,
            level: newReview.promoted && newReview.newLevel ? newReview.newLevel : prev.player.level,
            title: newReview.promoted && newReview.newTitle ? newReview.newTitle : prev.player.title,
            salary: updatedSalary,
            xp: prev.player.xp + 300,
            performanceScore: Math.round(newReview.overallRating * 20),
          },
        };
      });
    } catch (err) {
      console.error('Failed to generate review:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] select-none">
      {/* Top Title & Appraisal Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>360° Corporate Performance & Evaluation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic appraisal compiled from manager feedback, customer SLA adherence, and team collaboration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestReview}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>{isGenerating ? 'Sneha & Priya Evaluating...' : 'Generate 360° Monthly Review'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('appraisal')}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'appraisal'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Performance Appraisal Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'evaluations'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Hidden AI Evaluation Telemetry ({evaluations.length} turns)
        </button>
      </div>

      {activeTab === 'appraisal' ? (
        <div className="space-y-6">
          {/* Key Competencies Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Core Engineering Competencies Radar
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Productivity', score: player.productivity, color: 'bg-blue-500' },
                { label: 'Quality', score: player.quality, color: 'bg-emerald-500' },
                { label: 'Communication', score: player.communication, color: 'bg-purple-500' },
                { label: 'Technical', score: player.technicalSkills, color: 'bg-cyan-500' },
                { label: 'Leadership', score: player.leadership, color: 'bg-amber-500' },
                { label: 'Reliability', score: player.reliability, color: 'bg-rose-500' },
                { label: 'Teamwork', score: player.teamwork, color: 'bg-indigo-500' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center"
                >
                  <div className="text-[10px] text-slate-400 font-bold uppercase truncate">
                    {item.label}
                  </div>
                  <div className="text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                    {item.score}%
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No Monthly Reviews Generated Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Click "Generate 360° Monthly Review" to have Sneha Rao and Priya Sharma formally evaluate your engineering ownership, communication tone, and customer handling.
              </p>
            </div>
          ) : (
            reviews.map(review => (
              <div
                key={review.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5"
              >
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-mono font-black text-xl shadow-xs">
                      {review.overallRating}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          Cycle Month {review.month} Review
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                          {review.careerRecommendation}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Manager: Sneha Rao • HR BP: Priya Sharma
                      </div>
                    </div>
                  </div>

                  {review.salaryIncrementOffered > 0 && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        Salary Revision Approved
                      </div>
                      <div className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                        +{review.salaryIncrementOffered}% Increment
                      </div>
                    </div>
                  )}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                    <h4 className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Key Demonstrated Strengths</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-800 dark:text-slate-200">
                      {review.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
                    <h4 className="font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Areas for Continued Growth</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-800 dark:text-slate-200">
                      {review.areasToImprove.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sneha Rao Comment */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-[10px] text-white font-bold">
                      SW
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Sneha Rao (Engineering Manager)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed pl-8">
                    "{review.managerComment}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Hidden Evaluation Telemetry View */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
            <span className="font-bold">About Hidden AI Evaluation:</span> The MNC simulator evaluates your messages secretly on every turn for ownership, professionalism, problem solving, emotional intelligence, and technical judgment.
          </div>

          <div className="space-y-3">
            {evaluations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No conversation evaluations recorded yet. Start chatting in Messages or replying to Emails!
              </div>
            ) : (
              evaluations.slice(-10).reverse().map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-semibold">{ev.timestamp}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{ev.summary}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Ownership</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.ownership}%</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Professional</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.professionalism}%</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Tech Judgment</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.technicalJudgment}%</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Integrity</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.integrity}%</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">EQ</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.emotionalIntelligence}%</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Problem Solving</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.problemSolving}%</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Confidence</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{ev.confidence}%</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
