import React, { useState, useEffect, useMemo } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Search, Check,
  ChevronLeft, ChevronRight, Plus, X,
  Code2, FileText, ChevronDown
} from 'lucide-react';
import { CompanyLogo, LeetCodeLogo, GfgLogo } from '../components/CompanyLogos';

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
  topicId?: number;
  topicName?: string;
}

interface Topic {
  id: number;
  name: string;
  icon: string;
  problemCount: number;
}

interface TopicDetails {
  id: number;
  name: string;
  icon: string;
  subtopics: Array<{
    id: number;
    name: string;
    description: string;
    problems: Problem[];
  }>;
}

interface ProblemsPageProps {
  onSolve: (problem: any) => void;
}

const ITEMS_PER_PAGE = 12;

export const ProblemsPage: React.FC<ProblemsPageProps> = ({ onSolve }) => {
  const { user, updateUserStats } = useAuth();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All Difficulties');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);

  const [diffOpen, setDiffOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [showMoreTopics, setShowMoreTopics] = useState(false);

  // Store full topic detail (with subtopics) for pattern-wise view
  const [topicDetailsMap, setTopicDetailsMap] = useState<Record<number, TopicDetails>>({});


  // Notes state
  const [problemNotes, setProblemNotes] = useState<Record<number, string>>({});
  const [activeNoteProblem, setActiveNoteProblem] = useState<Problem | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const prefix = `notes_${user?.id || 'guest'}_`;
    const notes: Record<number, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const id = parseInt(key.replace(prefix, ''), 10);
        if (!isNaN(id)) notes[id] = localStorage.getItem(key) || '';
      }
    }
    setProblemNotes(notes);
  }, [user]);

  useEffect(() => {
    if (activeNoteProblem) setTempNoteText(problemNotes[activeNoteProblem.id] || '');
  }, [activeNoteProblem]);

  const saveNote = () => {
    if (!activeNoteProblem) return;
    const key = `notes_${user?.id || 'guest'}_${activeNoteProblem.id}`;
    if (tempNoteText.trim()) localStorage.setItem(key, tempNoteText);
    else localStorage.removeItem(key);
    setProblemNotes(prev => ({ ...prev, [activeNoteProblem.id]: tempNoteText }));
    setActiveNoteProblem(null);
  };

  // Load all topics and problems eagerly
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setLoadingProgress(0);
      try {
        const topicsRes = await api.get<Topic[]>('/problems/topics');
        setTopics(topicsRes.data);

        let completed = 0;
        const total = topicsRes.data.length;

        const detailResults = await Promise.all(
          topicsRes.data.map(t =>
            api.get<TopicDetails>(`/problems/topic/${t.id}`)
              .then(r => {
                completed++;
                setLoadingProgress(Math.round((completed / total) * 100));
                return { topicId: t.id, topicName: t.name, data: r.data };
              })
              .catch(() => {
                completed++;
                setLoadingProgress(Math.round((completed / total) * 100));
                return null;
              })
          )
        );

        const flat: Problem[] = [];
        const seen = new Set<number>();
        const detailsMap: Record<number, TopicDetails> = {};
        detailResults.forEach(result => {
          if (!result) return;
          detailsMap[result.topicId] = result.data;
          result.data.subtopics.forEach(sub => {
            sub.problems.forEach(p => {
              if (!seen.has(p.id)) {
                seen.add(p.id);
                flat.push({ ...p, topicId: result.topicId, topicName: result.topicName });
              }
            });
          });
        });
        setAllProblems(flat);
        setTopicDetailsMap(detailsMap);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const toggleSolved = async (id: number) => {
    setAllProblems(prev => prev.map(p => p.id === id ? { ...p, solved: !p.solved } : p));
    try { await api.post(`/problems/${id}/solve`); updateUserStats(); } catch {}
  };



  // Filtered list
  const filteredProblems = useMemo(() => {
    return allProblems.filter(p => {
      if (selectedTopicId !== null && p.topicId !== selectedTopicId) return false;
      if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (difficulty !== 'All Difficulties' && p.difficulty.toUpperCase() !== difficulty.toUpperCase()) return false;
      if (statusFilter === 'Solved' && !p.solved) return false;
      if (statusFilter === 'Unsolved' && p.solved) return false;
      return true;
    });
  }, [allProblems, selectedTopicId, search, difficulty, statusFilter]);

  // Pinned/Extra Topics logic
  const PINNED_NAMES = useMemo(() => ['array', 'string', 'binary search', 'stack', 'recursion'], []);
  const pinnedTopics = useMemo(() => {
    const pinned: Topic[] = [];
    PINNED_NAMES.forEach(name => {
      const match = topics.find(t => t.name.toLowerCase().includes(name));
      if (match) pinned.push(match);
    });
    return pinned;
  }, [topics, PINNED_NAMES]);

  const extraTopics = useMemo(() => {
    return topics.filter(t => !pinnedTopics.some(pt => pt.id === t.id));
  }, [topics, pinnedTopics]);


  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / ITEMS_PER_PAGE));
  const pagedProblems = filteredProblems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => setCurrentPage(1), [search, difficulty, statusFilter, selectedTopicId]);


  const getDiffBadge = (diff: string) => {
    const d = diff.toUpperCase();
    if (d === 'EASY') return 'text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/20';
    if (d === 'MEDIUM') return 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20';
    return 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20';
  };

  const getDiffLabel = (diff: string) => {
    const d = diff.toUpperCase();
    if (d === 'EASY') return 'Easy';
    if (d === 'MEDIUM') return 'Medium';
    return 'Hard';
  };

  const getPaginationNums = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => { setDiffOpen(false); setStatusOpen(false); setShowMoreTopics(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#4A6CF7]/30 animate-pulse">
          <Code2 className="w-7 h-7 text-white" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-white font-bold text-base">Loading Problems...</p>
          <p className="text-[#4A5580] text-xs">{loadingProgress}% complete</p>
        </div>
        <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4A6CF7] to-[#A78BFA] rounded-full transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 select-none" onClick={() => { setDiffOpen(false); setStatusOpen(false); setShowMoreTopics(false); }}>

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Problems</h1>
          <p className="text-[#4A5580] text-sm mt-0.5 font-medium">
            Practice coding problems and improve your skills
          </p>
        </div>
      </div>

      {/* ── TOPIC TABS ── */}
      <div className="space-y-3" onClick={e => e.stopPropagation()}>
        {/* Top row: Pinned topics + More button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All Problems */}
          <button
            onClick={() => { setSelectedTopicId(null); setShowMoreTopics(false); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              selectedTopicId === null
                ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
            All Problems
          </button>

          {/* Pinned topic tabs */}
          {pinnedTopics.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTopicId(t.id); setShowMoreTopics(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                selectedTopicId === t.id
                  ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                  : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-[11px]">{t.icon || '📋'}</span>
              {t.name}
              <span className={`text-[10px] font-black ml-0.5 ${selectedTopicId === t.id ? 'text-white/70' : 'text-[#4A5580]'}`}>
                {t.problemCount}
              </span>
            </button>
          ))}

          {/* More button */}
          {extraTopics.length > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setShowMoreTopics(v => !v); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                showMoreTopics || extraTopics.some(t => t.id === selectedTopicId)
                  ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                  : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              More <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showMoreTopics ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Second row: Expanded extra topics (inline below the topics) */}
        {extraTopics.length > 0 && showMoreTopics && (
          <div 
            className="bg-[#0D1224]/40 border border-white/[0.06] rounded-xl p-3"
          >
            <p className="text-[9px] font-bold text-[#4A5580] uppercase tracking-wider mb-2 px-1">Other Topics</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {extraTopics.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTopicId(t.id); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    selectedTopicId === t.id
                      ? 'bg-[#4A6CF7] text-white'
                      : 'text-[#7B8AB8] hover:text-white hover:bg-white/[0.04] border border-white/[0.06] bg-[#0F1526]/50'
                  }`}
                >
                  <span className="text-[11px] flex-shrink-0">{t.icon || '📋'}</span>
                  <span className="truncate">{t.name}</span>
                  <span className="ml-auto text-[9px] font-black text-[#4A5580] flex-shrink-0">{t.problemCount}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5580] pointer-events-none" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F1526] border border-white/[0.06] rounded-xl text-sm text-white placeholder-[#4A5580] focus:outline-none focus:border-[#4A6CF7]/40 transition-all"
          />
        </div>

        {/* Difficulty Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDiffOpen(v => !v); setStatusOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1526] border border-white/[0.06] rounded-xl text-sm text-[#7B8AB8] hover:text-white transition-all whitespace-nowrap"
          >
            {difficulty} <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {diffOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#0F1526] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 z-30 min-w-[160px] p-1.5">
              {['All Difficulties', 'Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setDiffOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    difficulty === d ? 'text-white bg-white/[0.06]' : 'text-[#7B8AB8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* All Companies (cosmetic) */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1526] border border-white/[0.06] rounded-xl text-sm text-[#7B8AB8] hover:text-white transition-all whitespace-nowrap">
          All Companies <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setStatusOpen(v => !v); setDiffOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1526] border border-white/[0.06] rounded-xl text-sm text-[#7B8AB8] hover:text-white transition-all whitespace-nowrap"
          >
            {statusFilter} <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {statusOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#0F1526] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 z-30 min-w-[140px] p-1.5">
              {['All Status', 'Solved', 'Unsolved'].map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s ? 'text-white bg-white/[0.06]' : 'text-[#7B8AB8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PATTERN-WISE VIEW (topic selected) ── */}
      {selectedTopicId !== null && topicDetailsMap[selectedTopicId] ? (
        <div className="space-y-5">
          {topicDetailsMap[selectedTopicId].subtopics
            .filter(sub => {
              const probs = sub.problems.filter(p => {
                if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
                if (difficulty !== 'All Difficulties' && p.difficulty.toUpperCase() !== difficulty.toUpperCase()) return false;
                if (statusFilter === 'Solved' && !p.solved) return false;
                if (statusFilter === 'Unsolved' && p.solved) return false;
                return true;
              });
              return probs.length > 0;
            })
            .map(sub => {
              // Use live solved state from allProblems
              const probs = sub.problems
                .map(p => allProblems.find(ap => ap.id === p.id) || p)
                .filter(p => {
                  if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
                  if (difficulty !== 'All Difficulties' && p.difficulty.toUpperCase() !== difficulty.toUpperCase()) return false;
                  if (statusFilter === 'Solved' && !p.solved) return false;
                  if (statusFilter === 'Unsolved' && p.solved) return false;
                  return true;
                });

              return (
                <div key={sub.id} className="bg-[#0F1526] border border-white/[0.05] rounded-xl overflow-hidden">
                  {/* Pattern Header */}
                  <div
                    className="w-full px-5 py-3.5 flex items-center justify-between bg-white/[0.015]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-5 rounded-full bg-[#4A6CF7] flex-shrink-0" />
                      <h3 className="text-[13px] font-bold text-white text-left">{sub.name}</h3>
                      {sub.description && (
                        <span className="text-[10px] text-[#4A5580] font-medium hidden sm:block">{sub.description}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] font-black text-[#4A5580] uppercase tracking-wider">
                        {probs.length} problem{probs.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-white/[0.06]" />

                  {/* Problems table for this pattern */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.01]">
                        <th className="py-2.5 px-3 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-12 border-r border-white/[0.05]">Status</th>
                        <th className="py-2.5 px-4 text-left text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider border-r border-white/[0.05] w-[180px] max-w-[180px]">Problem</th>
                        <th className="py-2.5 px-3 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-16 border-r border-white/[0.05]">Solve</th>
                        <th className="py-2.5 px-3 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-16 border-r border-white/[0.05]">Resource</th>
                        <th className="py-2.5 px-3 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-24 border-r border-white/[0.05]">Practice</th>
                        <th className="py-2.5 px-3 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-14 border-r border-white/[0.05]">Note</th>
                        <th className="py-2.5 px-4 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-36 border-r border-white/[0.05]">Companies</th>
                        <th className="py-2.5 px-4 text-center text-[10px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-24">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {probs.map((prob, idx) => (
                        <tr
                          key={prob.id}
                          className={`border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors duration-150 group ${
                            idx === probs.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          {/* Status */}
                          <td className="py-3 px-3 text-center align-middle w-12 border-r border-white/[0.05]">
                            <button
                              onClick={() => toggleSolved(prob.id)}
                              className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 ${
                                prob.solved
                                  ? 'bg-[#4ADE80]/10 border-[#4ADE80]/40 text-[#4ADE80]'
                                  : 'border-white/[0.10] text-transparent hover:border-[#4ADE80]/40 hover:text-[#4ADE80]/50'
                              }`}
                              title={prob.solved ? 'Mark as unsolved' : 'Mark as solved'}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            </button>
                          </td>

                          {/* Problem Title */}
                          <td className="py-3 px-4 align-middle border-r border-white/[0.05] w-[180px] max-w-[180px]">
                            <span
                              onClick={() => onSolve(prob)}
                              className="text-[13px] font-semibold text-[#C8D1E8] group-hover:text-white cursor-pointer transition-colors duration-150 truncate block"
                              title={prob.title}
                            >
                              {prob.title}
                            </span>
                          </td>

                          {/* Solve */}
                          <td className="py-3 px-3 text-center align-middle w-16 border-r border-white/[0.05]">
                            <button
                              onClick={() => onSolve(prob)}
                              className="px-2.5 py-1 bg-[#4A6CF7]/10 hover:bg-[#4A6CF7] border border-[#4A6CF7]/30 hover:border-[#4A6CF7] text-[#4A6CF7] hover:text-white rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              Solve
                            </button>
                          </td>

                          {/* Resource */}
                          <td className="py-3 px-3 text-center align-middle w-16 border-r border-white/[0.05]">
                            <button
                              onClick={() => onSolve(prob)}
                              className="w-7 h-7 mx-auto rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#4A5580] hover:text-[#A78BFA] hover:border-[#A78BFA]/30 hover:bg-[#A78BFA]/5 transition-all duration-200 hover:scale-105 active:scale-95"
                              title="Open Scratchpad & Resources"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </td>

                          {/* Practice */}
                          <td className="py-3 px-3 text-center align-middle w-24 border-r border-white/[0.05]">
                            <div className="flex items-center justify-center gap-6 scale-75 origin-center">
                              {prob.leetcodeUrl ? (
                                <a href={prob.leetcodeUrl} target="_blank" rel="noopener noreferrer" title="Solve on LeetCode" className="block hover:scale-110 active:scale-95 transition-transform duration-200">
                                  <LeetCodeLogo />
                                </a>
                              ) : (
                                <span title="Not available on LeetCode" className="opacity-25 cursor-not-allowed"><LeetCodeLogo disabled /></span>
                              )}
                              {prob.gfgUrl ? (
                                <a href={prob.gfgUrl} target="_blank" rel="noopener noreferrer" title="Solve on GeeksForGeeks" className="block hover:scale-110 active:scale-95 transition-transform duration-200">
                                  <GfgLogo />
                                </a>
                              ) : (
                                <span title="Not available on GFG" className="opacity-25 cursor-not-allowed"><GfgLogo disabled /></span>
                              )}
                            </div>
                          </td>

                          {/* Note */}
                          <td className="py-3 px-3 text-center align-middle w-14 border-r border-white/[0.05]">
                            <button
                              onClick={() => setActiveNoteProblem(prob)}
                              className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 ${
                                problemNotes[prob.id]
                                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-sm shadow-yellow-500/10'
                                  : 'border-white/[0.08] text-[#4A5580] hover:border-[#4A6CF7]/40 hover:text-[#4A6CF7] hover:bg-[#4A6CF7]/5'
                              }`}
                              title={problemNotes[prob.id] ? 'View/Edit Note' : 'Add Note'}
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </td>

                          {/* Companies */}
                          <td className="py-3 px-4 align-middle w-36 border-r border-white/[0.05]">
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                              {prob.companies && prob.companies.length > 0 ? (
                                prob.companies.slice(0, 4).map((c, i) => (
                                  <div key={i} className="relative group/logo">
                                    <CompanyLogo name={c} className="w-6 h-6" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-black/90 text-[9px] font-bold text-white px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/logo:opacity-100 pointer-events-none transition-opacity duration-150 z-20 border border-white/10">
                                      {c}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span className="text-[10px] text-[#4A5580] italic font-medium">General</span>
                              )}
                            </div>
                          </td>

                          {/* Difficulty */}
                          <td className="py-3 px-4 text-center align-middle w-24">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${getDiffBadge(prob.difficulty)}`}>
                              {getDiffLabel(prob.difficulty)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody></table>
                </div>
              );
            })}
          {/* Empty state for pattern view */}
          {topicDetailsMap[selectedTopicId].subtopics.every(sub =>
            sub.problems.filter(p => {
              if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
              if (difficulty !== 'All Difficulties' && p.difficulty.toUpperCase() !== difficulty.toUpperCase()) return false;
              if (statusFilter === 'Solved' && !p.solved) return false;
              if (statusFilter === 'Unsolved' && p.solved) return false;
              return true;
            }).length === 0
          ) && (
            <div className="bg-[#0F1526] border border-white/[0.05] rounded-xl py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#4A5580]" />
                </div>
                <p className="text-[#7B8AB8] font-bold text-sm">No problems found</p>
                <p className="text-[#4A5580] text-xs">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      ) : selectedTopicId === null ? (
        <>
      <div className="bg-[#0F1526] border border-white/[0.05] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {/* Status */}
              <th className="py-3.5 px-3 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-12 border-r border-white/[0.05]">Status</th>
              {/* Problem */}
              <th className="py-3.5 px-4 text-left text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider border-r border-white/[0.05] w-[180px] max-w-[180px]">Problem</th>
              {/* Solve */}
              <th className="py-3.5 px-3 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-16 border-r border-white/[0.05]">Solve</th>
              {/* Resource */}
              <th className="py-3.5 px-3 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-20 border-r border-white/[0.05]">Resource</th>
              {/* Practice */}
              <th className="py-3.5 px-3 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-24 border-r border-white/[0.05]">Practice</th>
              {/* Note */}
              <th className="py-3.5 px-3 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-16 border-r border-white/[0.05]">Note</th>
              {/* Companies */}
              <th className="py-3.5 px-4 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-36 border-r border-white/[0.05]">Companies</th>
              {/* Difficulty */}
              <th className="py-3.5 px-4 text-center text-[11px] font-extrabold text-[#7B8AB8] uppercase tracking-wider w-24">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {pagedProblems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center">
                      <Search className="w-5 h-5 text-[#4A5580]" />
                    </div>
                    <p className="text-[#7B8AB8] font-bold text-sm">No problems found</p>
                    <p className="text-[#4A5580] text-xs">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedProblems.map((prob) => (
                <tr
                  key={prob.id}
                  className="border-b border-white/[0.06] hover:bg-white/[0.025] transition-colors duration-150 group"
                >
                  {/* ── Status ── */}
                  <td className="py-3 px-3 text-center align-middle border-r border-white/[0.05]">
                    <button
                      onClick={() => toggleSolved(prob.id)}
                      className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 ${
                        prob.solved
                          ? 'bg-[#4ADE80]/10 border-[#4ADE80]/40 text-[#4ADE80]'
                          : 'border-white/[0.10] text-transparent hover:border-[#4ADE80]/40 hover:text-[#4ADE80]/50'
                      }`}
                      title={prob.solved ? 'Mark as unsolved' : 'Mark as solved'}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                    </button>
                  </td>

                  {/* ── Problem Title ── */}
                  <td className="py-3 px-4 align-middle border-r border-white/[0.05] w-[180px] max-w-[180px]">
                    <span
                      onClick={() => onSolve(prob)}
                      className="text-[13px] font-semibold text-[#C8D1E8] group-hover:text-white cursor-pointer transition-colors duration-150 truncate block"
                      title={prob.title}
                    >
                      {prob.title}
                    </span>
                  </td>

                  {/* ── Solve Button ── */}
                  <td className="py-3 px-3 text-center align-middle border-r border-white/[0.05]">
                    <button
                      onClick={() => onSolve(prob)}
                      className="px-2.5 py-1 bg-[#4A6CF7]/10 hover:bg-[#4A6CF7] border border-[#4A6CF7]/30 hover:border-[#4A6CF7] text-[#4A6CF7] hover:text-white rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-[#4A6CF7]/20"
                    >
                      Solve
                    </button>
                  </td>

                  {/* ── Resource (notebook icon) ── */}
                  <td className="py-3 px-3 text-center align-middle border-r border-white/[0.05]">
                    <button
                      onClick={() => onSolve(prob)}
                      className="w-7 h-7 mx-auto rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#4A5580] hover:text-[#A78BFA] hover:border-[#A78BFA]/30 hover:bg-[#A78BFA]/5 transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Open Scratchpad & Resources"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  {/* ── Practice (LeetCode + GFG) ── */}
                  <td className="py-3 px-3 text-center align-middle border-r border-white/[0.05]">
                    <div className="flex items-center justify-center gap-6 scale-75 origin-center">
                      {/* LeetCode */}
                      {prob.leetcodeUrl ? (
                        <a
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Solve on LeetCode"
                          className="block hover:scale-110 active:scale-95 transition-transform duration-200"
                        >
                          <LeetCodeLogo />
                        </a>
                      ) : (
                        <span title="Not available on LeetCode" className="opacity-25 cursor-not-allowed">
                          <LeetCodeLogo disabled />
                        </span>
                      )}
                      {/* GFG */}
                      {prob.gfgUrl ? (
                        <a
                          href={prob.gfgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Solve on GeeksForGeeks"
                          className="block hover:scale-110 active:scale-95 transition-transform duration-200"
                        >
                          <GfgLogo />
                        </a>
                      ) : (
                        <span title="Not available on GFG" className="opacity-25 cursor-not-allowed">
                          <GfgLogo disabled />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ── Note ── */}
                  <td className="py-3 px-3 text-center align-middle border-r border-white/[0.05]">
                    <button
                      onClick={() => setActiveNoteProblem(prob)}
                      className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 ${
                        problemNotes[prob.id]
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-sm shadow-yellow-500/10'
                          : 'border-white/[0.08] text-[#4A5580] hover:border-[#4A6CF7]/40 hover:text-[#4A6CF7] hover:bg-[#4A6CF7]/5'
                      }`}
                      title={problemNotes[prob.id] ? 'View/Edit Note' : 'Add Note'}
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  </td>

                  {/* ── Companies ── */}
                  <td className="py-3 px-4 align-middle border-r border-white/[0.05]">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      {prob.companies && prob.companies.length > 0 ? (
                        prob.companies.slice(0, 4).map((c, i) => (
                          <div key={i} className="relative group/logo">
                            <CompanyLogo name={c} className="w-6 h-6" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-black/90 text-[9px] font-bold text-white px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/logo:opacity-100 pointer-events-none transition-opacity duration-150 z-20 border border-white/10">
                              {c}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-[#4A5580] italic font-medium">General</span>
                      )}
                    </div>
                  </td>

                  {/* ── Difficulty ── */}
                  <td className="py-3 px-4 text-center align-middle">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${getDiffBadge(prob.difficulty)}`}>
                      {getDiffLabel(prob.difficulty)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPaginationNums().map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-[#4A5580] text-xs font-bold">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                    currentPage === p
                      ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                      : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        </>
      ) : (
        // Selected topic not yet loaded
        <div className="bg-[#0F1526] border border-white/[0.05] rounded-xl py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A6CF7]/10 border border-[#4A6CF7]/20 flex items-center justify-center animate-pulse">
              <Code2 className="w-5 h-5 text-[#4A6CF7]" />
            </div>
            <p className="text-[#7B8AB8] font-bold text-sm">Loading patterns...</p>
          </div>
        </div>
      )}

      {/* ── NOTE MODAL ── */}
      {activeNoteProblem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveNoteProblem(null)}
        >
          <div
            className="bg-[#0D1224] border border-white/[0.08] w-full max-w-md rounded-2xl shadow-[0_0_60px_rgba(74,108,247,0.2)] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Problem Notes</h3>
                <p className="text-[11px] text-[#7B8AB8] mt-0.5 line-clamp-1">{activeNoteProblem.title}</p>
              </div>
              <button
                onClick={() => setActiveNoteProblem(null)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <textarea
                value={tempNoteText}
                onChange={e => setTempNoteText(e.target.value)}
                placeholder="Write your notes, hints, or solution approach here..."
                className="w-full h-40 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#4A6CF7]/50 focus:bg-white/[0.03] transition-all resize-none font-medium leading-relaxed"
                autoFocus
              />
            </div>
            <div className="px-5 py-3.5 border-t border-white/[0.05] flex items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveNoteProblem(null)}
                className="px-3.5 py-1.5 border border-white/[0.08] hover:border-white/20 text-white/60 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-1.5 bg-[#4A6CF7] hover:bg-[#4A6CF7]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#4A6CF7]/25 transition-all active:scale-95"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
