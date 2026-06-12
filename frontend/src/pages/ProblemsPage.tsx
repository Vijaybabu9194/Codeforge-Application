import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, ChevronRight, HelpCircle, Flame, Bookmark, CheckCircle } from 'lucide-react';

import QuestionTable from '../components/problems/QuestionTable';
import ProblemFilters from '../components/problems/ProblemFilters';

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  acceptanceRate: number;
  topics: string[];
  companies: string[];
  solved: boolean;
  bookmarked: boolean;
  leetcodeUrl?: string;
  gfgUrl?: string;
}

interface Topic {
  id: number;
  name: string;
  icon: string;
  problemCount: number;
}

interface Subtopic {
  id: number;
  name: string;
  description: string;
  problems: Problem[];
}

interface TopicDetails {
  id: number;
  name: string;
  icon: string;
  subtopics: Subtopic[];
}

interface ProblemsPageProps {
  onSolve: (problem: any) => void;
}

export const ProblemsPage: React.FC<ProblemsPageProps> = ({ onSolve }) => {
  const { user, updateUserStats } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadedTopicDetails, setLoadedTopicDetails] = useState<Record<number, TopicDetails>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<number, boolean>>({});
  const [loadingTopics, setLoadingTopics] = useState<Record<number, boolean>>({});
  
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [globalLoading, setGlobalLoading] = useState(true);

  // Fetch topics list and initial dashboard stats on mount
  useEffect(() => {
    const initPage = async () => {
      try {
        setGlobalLoading(true);
        const [topicsRes, statsRes] = await Promise.all([
          api.get<Topic[]>('/problems/topics'),
          api.get<{ bookmarks: number }>('/dashboard/stats')
        ]);
        setTopics(topicsRes.data);
        setBookmarkCount(statsRes.data.bookmarks);
        
      } catch (err) {
        console.error('Error initializing problems page:', err);
      } finally {
        setGlobalLoading(false);
      }
    };
    initPage();
  }, []);

  // Fetch topic details (subtopics and questions) on demand
  const fetchTopicDetails = async (topicId: number) => {
    if (loadedTopicDetails[topicId] || loadingTopics[topicId]) return;
    try {
      setLoadingTopics((prev) => ({ ...prev, [topicId]: true }));
      const response = await api.get<TopicDetails>(`/problems/topic/${topicId}`);
      
      setLoadedTopicDetails((prev) => ({
        ...prev,
        [topicId]: response.data
      }));
    } catch (err) {
      console.error(`Failed to fetch topic details for topic ${topicId}:`, err);
    } finally {
      setLoadingTopics((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  // Trigger loading of all topics when any filter is active to support global search
  useEffect(() => {
    const hasActiveFilters = search.trim() !== '' || difficulty !== 'All' || showBookmarkedOnly;
    if (hasActiveFilters && topics.length > 0) {
      topics.forEach((t) => {
        if (!loadedTopicDetails[t.id] && !loadingTopics[t.id]) {
          fetchTopicDetails(t.id);
        }
      });
    }
  }, [search, difficulty, showBookmarkedOnly, topics]);

  const toggleBookmark = async (id: number) => {
    try {
      // Find the topic containing this problem to update cache optimistically
      let foundTopicId: number | null = null;
      let isCurrentlyBookmarked = false;
      
      for (const tId in loadedTopicDetails) {
        const topic = loadedTopicDetails[tId];
        const hasProb = topic.subtopics.some(sub => sub.problems.some(p => p.id === id));
        if (hasProb) {
          foundTopicId = Number(tId);
          isCurrentlyBookmarked = topic.subtopics
            .flatMap(s => s.problems)
            .find(p => p.id === id)?.bookmarked || false;
          break;
        }
      }

      if (foundTopicId !== null) {
        setLoadedTopicDetails((prev) => {
          const currentTopic = prev[foundTopicId!];
          return {
            ...prev,
            [foundTopicId!]: {
              ...currentTopic,
              subtopics: currentTopic.subtopics.map((sub) => ({
                ...sub,
                problems: sub.problems.map((p) => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)
              }))
            }
          };
        });
      }

      // Optimistic update of bookmark counter
      setBookmarkCount((prev) => isCurrentlyBookmarked ? Math.max(0, prev - 1) : prev + 1);

      await api.post(`/problems/${id}/bookmark`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const toggleSolved = async (id: number) => {
    try {
      // Find the topic containing this problem to update cache optimistically
      let foundTopicId: number | null = null;
      for (const tId in loadedTopicDetails) {
        const topic = loadedTopicDetails[tId];
        const hasProb = topic.subtopics.some(sub => sub.problems.some(p => p.id === id));
        if (hasProb) {
          foundTopicId = Number(tId);
          break;
        }
      }

      if (foundTopicId !== null) {
        setLoadedTopicDetails((prev) => {
          const currentTopic = prev[foundTopicId!];
          return {
            ...prev,
            [foundTopicId!]: {
              ...currentTopic,
              subtopics: currentTopic.subtopics.map((sub) => ({
                ...sub,
                problems: sub.problems.map((p) => p.id === id ? { ...p, solved: !p.solved } : p)
              }))
            }
          };
        });
      }

      await api.post(`/problems/${id}/solve`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to toggle solved status:', err);
    }
  };

  const handleTopicToggle = (topicId: number) => {
    setExpandedTopics((prev) => {
      const isExpanded = !prev[topicId];
      if (isExpanded) {
        fetchTopicDetails(topicId);
      }
      return {
        ...prev,
        [topicId]: isExpanded
      };
    });
  };

  const toggleSubtopic = (id: number) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compute stats
  const totalProblems = topics.reduce((acc, t) => acc + t.problemCount, 0);
  const totalSolved = user?.problemsSolved || 0;
  const overallProgressPercent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
  
  const hasActiveFilters = search.trim() !== '' || difficulty !== 'All' || showBookmarkedOnly;

  // Determine if any problems match current filters across loaded details
  const hasAnyMatchingProblems = topics.some(t => {
    const details = loadedTopicDetails[t.id];
    if (!details) return false;
    return details.subtopics.some(sub => 
      sub.problems.some(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty = difficulty === 'All' || p.difficulty.toUpperCase() === difficulty.toUpperCase();
        const matchesBookmark = !showBookmarkedOnly || p.bookmarked;
        return matchesSearch && matchesDifficulty && matchesBookmark;
      })
    );
  });

  if (globalLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse select-none">
        <div className="h-20 bg-white border border-border rounded-premium" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white border border-border rounded-premium" />
          ))}
        </div>
        <div className="h-12 bg-white border border-border rounded-premium" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-border rounded-premium" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FAFBFC] p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* WELCOME / MAIN HEADER */}
        <div className="bg-white border border-[#E5E7EB] rounded-premium p-6 shadow-card flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-sm">
            🎯
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">Rising Brain DSA Sheet</h1>
            <p className="text-xs text-secondaryText mt-0.5">Master coding interview patterns topic-by-topic without limits.</p>
          </div>
        </div>

        {/* DYNAMIC STATS CARD ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Solved Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-premium p-5 shadow-card flex items-center justify-between group hover:border-success/30 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider block">Total Solved</span>
              <h3 className="text-2xl font-black text-text group-hover:text-success transition-colors">{totalSolved}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-success shadow-sm">
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>

          {/* Bookmarks Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-premium p-5 shadow-card flex items-center justify-between group hover:border-[#8B5CF6]/30 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider block">Bookmarks</span>
              <h3 className="text-2xl font-black text-text group-hover:text-[#8B5CF6] transition-colors">{bookmarkCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#8B5CF6] shadow-sm">
              <Bookmark className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-premium p-5 shadow-card flex items-center justify-between group hover:border-warning/30 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider block">Active Streak</span>
              <h3 className="text-2xl font-black text-text group-hover:text-warning transition-colors">{user?.currentStreak || 0} Days</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-warning shadow-sm">
              <Flame className="w-5 h-5 stroke-[2.5] animate-pulse" />
            </div>
          </div>

          {/* Curriculum Progress Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-premium p-5 shadow-card flex flex-col justify-between gap-3 group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider block">Overall Progress</span>
              <span className="text-xs font-bold text-primary">{overallProgressPercent}%</span>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-secondaryBg rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" 
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-secondaryText font-semibold">
                <span>{totalSolved} Solved</span>
                <span>{totalProblems} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <ProblemFilters
          search={search}
          onSearchChange={(val) => setSearch(val)}
          difficulty={difficulty}
          onDifficultyChange={(val) => setDifficulty(val)}
          showBookmarkedOnly={showBookmarkedOnly}
          onBookmarkedToggle={() => setShowBookmarkedOnly(prev => !prev)}
        />

        {/* TOPICS VERTICAL LIST */}
        <div className="space-y-6">
          {topics.map((t) => {
            const isTopicExpanded = !!expandedTopics[t.id];
            const details = loadedTopicDetails[t.id];
            const isLoading = !!loadingTopics[t.id];

            // Filter problems helper
            const getFilteredTopicSubtopics = () => {
              if (!details || !details.subtopics) return [];
              return details.subtopics.map((sub) => {
                const filtered = sub.problems.filter((p) => {
                  const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
                  const matchesDifficulty = difficulty === 'All' || p.difficulty.toUpperCase() === difficulty.toUpperCase();
                  const matchesBookmark = !showBookmarkedOnly || p.bookmarked;
                  return matchesSearch && matchesDifficulty && matchesBookmark;
                });
                return {
                  ...sub,
                  problems: filtered
                };
              }).filter((sub) => sub.problems.length > 0 || search === '');
            };

            const filteredSubtopics = getFilteredTopicSubtopics();
            const hasProblems = filteredSubtopics.some(sub => sub.problems.length > 0);

            // Skip rendering this topic if filters are active and no problems match
            if (hasActiveFilters && details && !hasProblems) {
              return null;
            }

            const topicSolvedCount = details 
              ? details.subtopics.reduce((acc, sub) => acc + sub.problems.filter((p) => p.solved).length, 0)
              : 0;
            
            const topicProgressPercent = details && t.problemCount > 0 
              ? Math.round((topicSolvedCount / t.problemCount) * 100) 
              : 0;

            return (
              <div key={t.id} className="border border-[#E5E7EB] rounded-premium bg-white shadow-card overflow-hidden transition-all duration-300">
                {/* Topic Header */}
                <div 
                  onClick={() => handleTopicToggle(t.id)}
                  className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition select-none"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-slate-400 hover:text-text transition-colors">
                      {isTopicExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-sm">
                      {t.icon || '💻'}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-text">{t.name}</h2>
                      <p className="text-xs text-secondaryText mt-0.5">
                        {t.problemCount} Curated Problems
                      </p>
                    </div>
                  </div>

                  {/* Progress info */}
                  <div className="flex items-center space-x-4">
                    {details ? (
                      <div className="flex items-center space-x-3.5">
                        <span className="text-xs font-bold text-secondaryText">
                          {topicSolvedCount} / {t.problemCount} Solved
                        </span>
                        <div className="w-24 h-2 bg-secondaryBg rounded-full overflow-hidden border border-border hidden sm:block">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${topicProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-secondaryText font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Expand Topic
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtopics and question list */}
                {isTopicExpanded && (
                  <div className="p-6 bg-slate-50/20 border-t border-border space-y-5">
                    {isLoading ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-16 bg-white border border-border rounded-premium" />
                        <div className="h-16 bg-white border border-[#E5E7EB] rounded-premium" />
                      </div>
                    ) : !details ? (
                      <div className="text-center py-4 text-xs text-secondaryText">
                        Failed to load problems. Please reload the page.
                      </div>
                    ) : filteredSubtopics.length === 0 ? (
                      <div className="text-center py-6 text-secondaryText">
                        <HelpCircle className="w-8 h-8 text-muted mx-auto mb-2" />
                        <p className="text-xs font-semibold">No subtopics match the filters</p>
                      </div>
                    ) : (
                      filteredSubtopics.map((sub) => {
                        const isSubExpanded = search.trim() !== '' ? true : !!expandedSubtopics[sub.id];
                        const subProblemsCount = sub.problems.length;
                        const subSolvedCount = sub.problems.filter((p) => p.solved).length;
                        const subProgressPercent = subProblemsCount > 0 ? Math.round((subSolvedCount / subProblemsCount) * 100) : 0;

                        return (
                          <div key={sub.id} className="border border-[#E5E7EB] rounded-premium bg-white shadow-sm overflow-hidden transition-all duration-300">
                            {/* Accordion Header */}
                            <div 
                              onClick={() => toggleSubtopic(sub.id)}
                              className={`px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/30 transition select-none ${
                                isSubExpanded ? 'border-l-4 border-l-primary' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="text-slate-400">
                                  {isSubExpanded ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-sm text-text truncate">{sub.name}</h3>
                                  {sub.description && (
                                    <p className="text-xs text-secondaryText truncate max-w-xl mt-0.5">{sub.description}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-3.5 flex-shrink-0">
                                <span className="text-[11px] font-bold text-secondaryText whitespace-nowrap">
                                  {subSolvedCount} / {subProblemsCount} Solved
                                </span>
                                <div className="w-16 h-1.5 bg-secondaryBg rounded-full overflow-hidden border border-border hidden sm:block">
                                  <div 
                                    className="h-full bg-success rounded-full transition-all duration-300"
                                    style={{ width: `${subProgressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Subtopic Table */}
                            {isSubExpanded && (
                              <div className="p-4 bg-slate-50/10 border-t border-[#E5E7EB]">
                                <QuestionTable
                                  problems={sub.problems}
                                  onSolveToggle={toggleSolved}
                                  onBookmarkToggle={toggleBookmark}
                                  onSolve={onSolve}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Empty State for search filter */}
        {hasActiveFilters && !hasAnyMatchingProblems && (
          <div className="bg-white border border-[#E5E7EB] rounded-premium p-12 text-center shadow-card">
            <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="font-bold text-base text-text">No Problems Match Your Filters</p>
            <p className="text-xs text-secondaryText mt-1">Try adjusting the search query or difficulty filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProblemsPage;
