import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

interface Topic {
  id: number;
  name: string;
  icon: string;
  problemCount: number;
}

export const ProblemsPage: React.FC = () => {
  const { updateUserStats } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  // Fetch topics list
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get<Topic[]>('/problems/topics');
        setTopics(response.data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch problems list on filter/page changes
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: currentPage,
          size: pageSize,
        };
        if (selectedTopic) params.topicId = selectedTopic;
        if (difficulty !== 'All') params.difficulty = difficulty.toUpperCase();
        if (search) params.search = search;

        const response = await api.get<{
          problems: Problem[];
          totalPages: number;
          totalElements: number;
          currentPage: number;
        }>('/problems', { params });

        let data = response.data.problems;
        if (showBookmarkedOnly) {
          data = data.filter(p => p.bookmarked);
        }

        setProblems(data);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [selectedTopic, search, difficulty, showBookmarkedOnly, currentPage]);

  const toggleBookmark = async (id: number) => {
    try {
      // Optimistic update
      setProblems(prev => prev.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
      await api.post(`/problems/${id}/bookmark`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const toggleSolved = async (id: number) => {
    try {
      // Optimistic update
      setProblems(prev => prev.map(p => p.id === id ? { ...p, solved: !p.solved } : p));
      await api.post(`/problems/${id}/solve`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to toggle solved status:', err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] select-none">
      {/* LEFT SIDEBAR: TOPICS */}
      <TopicSidebar
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={(id) => { setSelectedTopic(id); setCurrentPage(0); }}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />

      {/* MAIN MAIN AREA */}
      <main className="flex-1 bg-[#FAFBFC] p-8 space-y-6">
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

        {/* SEARCH AND FILTERS */}
        <ProblemFilters
          search={search}
          onSearchChange={(val) => { setSearch(val); setCurrentPage(0); }}
          difficulty={difficulty}
          onDifficultyChange={(val) => { setDifficulty(val); setCurrentPage(0); }}
          showBookmarkedOnly={showBookmarkedOnly}
          onBookmarkedToggle={() => { setShowBookmarkedOnly(prev => !prev); setCurrentPage(0); }}
        />

        {/* QUESTION TABLE */}
        <QuestionTable
          problems={problems}
          loading={loading}
          onSolveToggle={toggleSolved}
          onBookmarkToggle={toggleBookmark}
        />

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="bg-[#F5F7FA] border border-[#E5E7EB] rounded-premium px-6 py-4 flex items-center justify-between shadow-card bg-white">
            <span className="text-xs font-medium text-secondaryText">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 0 || loading}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="p-2 border border-border bg-white rounded-premium hover:bg-secondaryBg text-secondaryText disabled:opacity-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages - 1 || loading}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="p-2 border border-border bg-white rounded-premium hover:bg-secondaryBg text-secondaryText disabled:opacity-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default ProblemsPage;
