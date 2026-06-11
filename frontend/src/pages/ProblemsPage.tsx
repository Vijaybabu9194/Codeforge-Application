import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Menu, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

import TopicSidebar from '../components/problems/TopicSidebar';
import ProblemFilters from '../components/problems/ProblemFilters';
import QuestionTable from '../components/problems/QuestionTable';

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
  const { updateUserStats } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [topicDetails, setTopicDetails] = useState<TopicDetails | null>(null);
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<number, boolean>>({});
  
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch topics list on initial load
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get<Topic[]>('/problems/topics');
        setTopics(response.data);
        if (response.data.length > 0 && selectedTopic === null) {
          setSelectedTopic(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch topic details when selected topic changes
  useEffect(() => {
    if (selectedTopic === null) return;
    const fetchTopicDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get<TopicDetails>(`/problems/topic/${selectedTopic}`);
        setTopicDetails(response.data);
      } catch (err) {
        console.error('Error fetching topic details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicDetails();
  }, [selectedTopic]);

  // Expand all subtopics by default when a new topic is loaded
  useEffect(() => {
    if (topicDetails && topicDetails.subtopics) {
      const initial: Record<number, boolean> = {};
      topicDetails.subtopics.forEach((sub) => {
        initial[sub.id] = true;
      });
      setExpandedSubtopics(initial);
    }
  }, [topicDetails]);

  const toggleBookmark = async (id: number) => {
    if (!topicDetails) return;
    try {
      // Optimistic update in topicDetails
      setTopicDetails((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subtopics: prev.subtopics.map((sub) => ({
            ...sub,
            problems: sub.problems.map((p) => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)
          }))
        };
      });
      await api.post(`/problems/${id}/bookmark`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const toggleSolved = async (id: number) => {
    if (!topicDetails) return;
    try {
      // Optimistic update in topicDetails
      setTopicDetails((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subtopics: prev.subtopics.map((sub) => ({
            ...sub,
            problems: sub.problems.map((p) => p.id === id ? { ...p, solved: !p.solved } : p)
          }))
        };
      });
      await api.post(`/problems/${id}/solve`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to toggle solved status:', err);
    }
  };

  const toggleSubtopic = (id: number) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter subtopics and problems in the frontend based on user filter options
  const getFilteredSubtopics = () => {
    if (!topicDetails || !topicDetails.subtopics) return [];

    return topicDetails.subtopics.map((sub) => {
      const filteredProblems = sub.problems.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty = difficulty === 'All' || p.difficulty.toUpperCase() === difficulty.toUpperCase();
        const matchesBookmark = !showBookmarkedOnly || p.bookmarked;
        return matchesSearch && matchesDifficulty && matchesBookmark;
      });
      return {
        ...sub,
        problems: filteredProblems
      };
    }).filter((sub) => sub.problems.length > 0 || search === '');
  };

  const filteredSubtopics = getFilteredSubtopics();

  // Compute overall topic stats
  const totalTopicProblems = topicDetails?.subtopics?.reduce((acc, sub) => acc + sub.problems.length, 0) || 0;
  const totalTopicSolved = topicDetails?.subtopics?.reduce((acc, sub) => acc + sub.problems.filter((p) => p.solved).length, 0) || 0;
  const progressPercent = totalTopicProblems > 0 ? Math.round((totalTopicSolved / totalTopicProblems) * 100) : 0;

  return (
    <div className="flex min-h-[calc(100vh-64px)] select-none">
      {/* LEFT SIDEBAR: TOPICS */}
      <TopicSidebar
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={(id) => { setSelectedTopic(id); }}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />

      {/* MAIN MAIN AREA */}
      <main className="flex-1 bg-[#FAFBFC] p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
        {/* Toggle Sidebar Button (if closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-white border border-border p-2 rounded-premium shadow-card hover:text-primary transition flex items-center gap-2 text-xs font-semibold"
          >
            <Menu className="w-4 h-4" />
            <span>Show Topics</span>
          </button>
        )}

        {/* TOPIC HEADER & PROGRESS CARD */}
        <div className="bg-white border border-[#E5E7EB] rounded-premium p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-sm">
              {topicDetails?.icon || '💻'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">{topicDetails?.name || 'Loading Topic...'}</h1>
              <p className="text-xs text-secondaryText mt-0.5">Master your skills topic by topic with structured problems.</p>
            </div>
          </div>
          
          {/* Topic Progress Bar */}
          {topicDetails && (
            <div className="flex flex-col w-full md:w-64 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-secondaryText">TOPIC PROGRESS</span>
                <span className="text-primary">{totalTopicSolved} / {totalTopicProblems} Solved ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-secondaryBg rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
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

        {/* SUBTOPIC ACCORDIONS */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 bg-white border border-border rounded-premium" />
              <div className="h-16 bg-white border border-[#E5E7EB] rounded-premium" />
              <div className="h-16 bg-white border border-border rounded-premium" />
            </div>
          ) : filteredSubtopics.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-premium p-12 text-center shadow-card">
              <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="font-bold text-base text-text">No Problems Match Your Filters</p>
              <p className="text-xs text-secondaryText mt-1">Try adjusting the search query or difficulty filters.</p>
            </div>
          ) : (
            filteredSubtopics.map((sub) => {
              const isExpanded = expandedSubtopics[sub.id] !== false;
              const subProblemsCount = sub.problems.length;
              const subSolvedCount = sub.problems.filter((p) => p.solved).length;
              const subProgressPercent = subProblemsCount > 0 ? Math.round((subSolvedCount / subProblemsCount) * 100) : 0;

              return (
                <div key={sub.id} className="border border-[#E5E7EB] rounded-premium bg-white shadow-card overflow-hidden transition-all duration-300">
                  {/* Accordion Header */}
                  <div 
                    onClick={() => toggleSubtopic(sub.id)}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition border-b border-transparent select-none"
                  >
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      <div className="text-slate-400 hover:text-text transition-colors">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-text truncate">{sub.name}</h3>
                        {sub.description && (
                          <p className="text-xs text-secondaryText truncate max-w-xl mt-0.5">{sub.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Subtopic Solved Badge and Mini progress bar */}
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <span className="text-xs font-bold text-secondaryText whitespace-nowrap">
                        {subSolvedCount} / {subProblemsCount} Solved
                      </span>
                      
                      {/* Mini bar */}
                      <div className="w-20 h-2 bg-secondaryBg rounded-full overflow-hidden border border-border hidden sm:block">
                        <div 
                          className="h-full bg-success rounded-full transition-all duration-300"
                          style={{ width: `${subProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/20 border-t border-border">
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
      </main>
    </div>
  );
};

export default ProblemsPage;
