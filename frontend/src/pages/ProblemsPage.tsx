import { useState, useEffect } from 'react';
import { problemsApi } from '@/lib/api';
import TopicSidebar from '@/components/problems/TopicSidebar';
import ProblemFilters from '@/components/problems/ProblemFilters';
import QuestionTable from '@/components/problems/QuestionTable';

export default function ProblemsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [problems, setProblems] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    problemsApi.getTopics()
      .then((res) => setTopics(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page, size: 20 };
    if (selectedTopic) params.topicId = selectedTopic;
    if (difficulty) params.difficulty = difficulty;
    if (search) params.search = search;

    problemsApi.getProblems(params)
      .then((res) => setProblems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTopic, difficulty, search, page]);

  const handleBookmark = async (id: number) => {
    try {
      await problemsApi.toggleBookmark(id);
      // Refresh
      const params: any = { page, size: 20 };
      if (selectedTopic) params.topicId = selectedTopic;
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;
      const res = await problemsApi.getProblems(params);
      setProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSolve = async (id: number) => {
    try {
      await problemsApi.markSolved(id);
      const params: any = { page, size: 20 };
      if (selectedTopic) params.topicId = selectedTopic;
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;
      const res = await problemsApi.getProblems(params);
      setProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-6 -mx-6 -mt-8 min-h-[calc(100vh-80px)]">
      <TopicSidebar
        topics={topics}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setPage={setPage}
      />

      {/* Main content area */}
      <div className="flex-1 px-6 py-8">
        <ProblemFilters
          search={search}
          setSearch={setSearch}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setPage={setPage}
        />

        <QuestionTable
          problems={problems}
          loading={loading}
          page={page}
          setPage={setPage}
          onBookmark={handleBookmark}
          onSolve={handleSolve}
        />
      </div>
    </div>
  );
}

