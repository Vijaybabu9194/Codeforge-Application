import React, { useState, useEffect, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import {
  Play, Send, ChevronLeft, ChevronRight, Lightbulb, FileText, History,
  CheckCircle2, XCircle, Clock, Cpu, RefreshCw, ChevronDown,
  ChevronUp, Code2, Sun, Moon, Shuffle, AlertTriangle, Maximize2, Minimize2,
  Expand, Download, Sparkles, ArrowLeft, BarChart2, Check
} from 'lucide-react';
import api from '../lib/api';
import { useTheme } from '../context/ThemeContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SampleCase {
  input: string;
  output: string;
  explanation?: string;
}

interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  status: string;
  time?: number;
  memory?: number;
}

interface SubmitResult {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
  overallStatus: string;
  errorDetails?: string;
}

interface SubmissionRecord {
  id: number;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  sourceCode: string;
  submittedAt: string;
}

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
  youtubeUrl?: string;
  articleUrl?: string;
  description?: string;
  problemStatement?: string;
  sampleTestCases?: string;
  constraints?: string;
  hints?: string;
  starterCode?: string;
}

interface ProblemEditorPageProps {
  problem: Problem;
  onBack: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_CODE: Record<string, string> = {
  java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n`,
  python: `# Write your Python solution here\ndef solution():\n    pass\n\nif __name__ == '__main__':\n    solution()\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Write your solution here\n    return 0;\n}\n`,
};

const LANG_IDS: Record<string, number> = { java: 62, python: 71, cpp: 54 };

const DIFFICULTY_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  EASY:   { label: 'Easy',   bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  MEDIUM: { label: 'Medium', bg: 'bg-amber-500/10',   text: 'text-amber-600',   border: 'border-amber-500/20' },
  HARD:   { label: 'Hard',   bg: 'bg-rose-500/10',    text: 'text-rose-600',    border: 'border-rose-500/20' },
};

// ─── Helper: Light Code Formatter ─────────────────────────────────────────────

const formatCodeString = (source: string, lang: string): string => {
  if (!source) return '';
  const lines = source.split('\n');
  let formatted = '';
  let indent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      formatted += '\n';
      continue;
    }
    if (lang === 'java' || lang === 'cpp') {
      if (line.startsWith('}') || line.startsWith('});')) indent = Math.max(0, indent - 1);
      formatted += '    '.repeat(indent) + line + '\n';
      if (line.endsWith('{') || line.endsWith('{ ') || line.includes('{ //')) indent++;
    } else {
      formatted += line + '\n';
    }
  }
  return formatted.trim() + '\n';
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ProblemEditorPage: React.FC<ProblemEditorPageProps> = ({ problem, onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  // Theme-aware LeetCode White & Sky Blue Tokens
  const bgMain        = dark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]';
  const bgNav         = dark ? 'bg-[#1E293B]' : 'bg-white';
  const bgPanel       = dark ? 'bg-[#1E293B]' : 'bg-white';
  const bgEditor      = dark ? 'bg-[#0F172A]' : 'bg-white';
  const bgInput       = dark ? 'bg-[#0F172A]' : 'bg-[#F0F9FF]';
  const border        = dark ? 'border-slate-800' : 'border-[#E2E8F0]';
  const borderSky     = dark ? 'border-sky-900/40' : 'border-sky-100';
  const textPrimary   = dark ? 'text-slate-100' : 'text-[#0F172A]';
  const textSecondary = dark ? 'text-slate-400' : 'text-[#475569]';
  
  const tabActive     = dark ? 'border-sky-400 text-sky-400 font-bold' : 'border-sky-500 text-sky-600 font-bold';
  const tabInactive   = dark ? `border-transparent ${textSecondary} hover:text-slate-200`
                             : `border-transparent ${textSecondary} hover:text-[#0F172A]`;
  
  const codeText  = dark ? 'text-sky-300' : 'text-sky-950';
  const codeGreen = dark ? 'text-emerald-400' : 'text-emerald-600';
  const btnHover  = dark ? 'hover:bg-slate-800' : 'hover:bg-sky-50/80';
  const selectBg  = dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-sky-300';
  const cardBg    = dark ? 'bg-slate-900/60 border-slate-800' : 'bg-[#F0F9FF] border-[#E0F2FE]';

  const monacoTheme = dark ? 'vs-dark' : 'vs-light';

  // ── State ────────────────────────────────────────────────────────────────
  const [leftTab, setLeftTab] = useState<'desc' | 'submissions' | 'hints' | 'notes'>('desc');
  const [language, setLanguage] = useState<'java' | 'python' | 'cpp'>('java');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<SubmitResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [enrichedProblem, setEnrichedProblem] = useState<Problem>(problem);
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedSubmissionRecord, setSelectedSubmissionRecord] = useState<SubmissionRecord | null>(null);

  // Panel resizing & Layout modes
  const [leftWidth, setLeftWidth] = useState(45);
  const [consoleHeight, setConsoleHeight] = useState(40);
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);

  const editorRef = useRef<any>(null);

  // Parse JSON fields
  const sampleCases: SampleCase[] = (() => {
    try { return JSON.parse(enrichedProblem.sampleTestCases || '[]'); } catch { return []; }
  })();
  const hints: string[] = (() => {
    try { return JSON.parse(enrichedProblem.hints || '[]'); } catch { return []; }
  })();
  const starterCodeMap: Record<string, string> = (() => {
    try { return JSON.parse(enrichedProblem.starterCode || '{}'); } catch { return {}; }
  })();

  const diff = DIFFICULTY_CONFIG[enrichedProblem.difficulty] || DIFFICULTY_CONFIG.EASY;

  // Fetch enriched problem details, submission history, and persistent DB note on mount or problem change
  useEffect(() => {
    api.get<Problem>(`/problems/${enrichedProblem.id}`)
      .then(res => setEnrichedProblem(res.data))
      .catch(() => {});

    fetchSubmissionHistory(enrichedProblem.id);
    fetchNoteFromDB(enrichedProblem.id);
  }, [enrichedProblem.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`cf_code_${enrichedProblem.id}_${language}`);
    if (saved) { setCode(saved); if (editorRef.current) editorRef.current.setValue(saved); return; }
    if (starterCodeMap[language]) { setCode(starterCodeMap[language]); if (editorRef.current) editorRef.current.setValue(starterCodeMap[language]); return; }
    const def = DEFAULT_CODE[language];
    setCode(def);
    if (editorRef.current) editorRef.current.setValue(def);
  }, [enrichedProblem.id, language, enrichedProblem.starterCode]);

  // Handle Drag Resizing for Panels
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingH) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 70) setLeftWidth(newWidth);
      }
      if (isDraggingV) {
        const newHeight = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
        if (newHeight > 15 && newHeight < 70) setConsoleHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingH(false);
      setIsDraggingV(false);
    };
    if (isDraggingH || isDraggingV) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingH, isDraggingV]);

  const fetchSubmissionHistory = async (pId: number) => {
    setLoadingHistory(true);
    try {
      const res = await api.get<SubmissionRecord[]>(`/problems/${pId}/submissions`);
      setSubmissionHistory(res.data);
    } catch {
    } finally { setLoadingHistory(false); }
  };

  const fetchNoteFromDB = async (pId: number) => {
    try {
      const res = await api.get<{ content: string }>(`/problems/${pId}/note`);
      if (res.data.content) setNotes(res.data.content);
      else setNotes('');
    } catch {}
  };

  const saveNoteToDB = async () => {
    try {
      await api.post(`/problems/${enrichedProblem.id}/note`, { content: notes });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {}
  };

  const [allProblemsList, setAllProblemsList] = useState<{ id: number; title: string }[]>([]);

  // Fetch list of all problem IDs for exact, continuous navigation
  useEffect(() => {
    api.get<any>('/problems?size=1000')
      .then(res => {
        if (res.data && res.data.problems) {
          setAllProblemsList(res.data.problems);
        }
      })
      .catch(() => {});
  }, []);

  // Problem Navigation Handler ('prev' | 'next' | 'random')
  const navigateToProblem = async (direction: 'next' | 'prev' | 'random') => {
    let list = allProblemsList;
    if (list.length === 0) {
      try {
        const pRes = await api.get<any>('/problems?size=1000');
        if (pRes.data && pRes.data.problems) {
          list = pRes.data.problems;
          setAllProblemsList(list);
        }
      } catch {}
    }

    let targetId = enrichedProblem.id;
    if (list.length > 0) {
      const idx = list.findIndex(p => p.id === enrichedProblem.id);
      if (direction === 'next') {
        const nextIdx = idx >= 0 ? (idx + 1) % list.length : 0;
        targetId = list[nextIdx].id;
      } else if (direction === 'prev') {
        const prevIdx = idx >= 0 ? (idx - 1 + list.length) % list.length : list.length - 1;
        targetId = list[prevIdx].id;
      } else {
        const randIdx = Math.floor(Math.random() * list.length);
        targetId = list[randIdx].id;
      }
    } else {
      const cur = Number(enrichedProblem.id) || 1;
      targetId = direction === 'next' ? cur + 1 : direction === 'prev' ? Math.max(1, cur - 1) : Math.floor(Math.random() * 380) + 1;
    }

    try {
      const res = await api.get<Problem>(`/problems/${targetId}`);
      if (res.data && res.data.id) {
        setEnrichedProblem(res.data);
        setRunResult(null);
        setSubmitResult(null);
        setSelectedSubmissionRecord(null);
      }
    } catch {}
  };

  const handleCodeChange = (value: string | undefined) => {
    const v = value ?? '';
    setCode(v);
    localStorage.setItem(`cf_code_${enrichedProblem.id}_${language}`, v);
  };

  const encodeB64 = (str: string) => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };

  const handleRun = async () => {
    setRunning(true); setRunResult(null); setConsoleOpen(true);
    try {
      const res = await api.post<SubmitResult>(`/problems/${enrichedProblem.id}/run`, {
        sourceCode: encodeB64(code), languageId: LANG_IDS[language],
      });
      setRunResult(res.data);
    } catch {
      setRunResult({ allPassed: false, passedCount: 0, totalCount: 0, results: [], overallStatus: 'Runtime Error' });
    } finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitResult(null); setConsoleOpen(true);
    localStorage.setItem(`cf_last_submitted_${enrichedProblem.id}`, code);
    try {
      const res = await api.post<SubmitResult>(`/problems/${enrichedProblem.id}/submit`, {
        sourceCode: encodeB64(code), languageId: LANG_IDS[language],
      });
      setSubmitResult(res.data);
      setLeftTab('submissions'); // Auto open submissions tab
      setSelectedSubmissionRecord(null); // Show latest submission summary
      fetchSubmissionHistory(enrichedProblem.id); // Refresh history table
      if (res.data.allPassed) setEnrichedProblem(p => ({ ...p, solved: true }));
    } catch {
      setSubmitResult({ allPassed: false, passedCount: 0, totalCount: 0, results: [], overallStatus: 'Runtime Error' });
      setLeftTab('submissions');
    } finally { setSubmitting(false); }
  };

  // ── 6 Specialized Editor Toolbar Actions ───────────────────────────────────

  // 1. Format Code Action (High-Speed Formatting)
  const handleFormatCode = () => {
    const formatted = formatCodeString(code, language);
    setCode(formatted);
    if (editorRef.current) {
      editorRef.current.setValue(formatted);
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
    localStorage.setItem(`cf_code_${enrichedProblem.id}_${language}`, formatted);
  };

  // 2. Retrieve Last Submitted Code (Instant Memory & Local Cache + Async Sync)
  const handleRetrieveLastSubmittedCode = async () => {
    let targetCode = submissionHistory[0]?.sourceCode || localStorage.getItem(`cf_last_submitted_${enrichedProblem.id}`) || '';
    
    if (targetCode) {
      setCode(targetCode);
      if (editorRef.current) editorRef.current.setValue(targetCode);
      localStorage.setItem(`cf_code_${enrichedProblem.id}_${language}`, targetCode);
    }

    try {
      const res = await api.get<{ code: string }>(`/problems/${enrichedProblem.id}/last-submission`);
      if (res.data && res.data.code) {
        setCode(res.data.code);
        if (editorRef.current) editorRef.current.setValue(res.data.code);
        localStorage.setItem(`cf_code_${enrichedProblem.id}_${language}`, res.data.code);
      }
    } catch {}
  };

  // 3. Exam Portal Fullscreen Mode
  const handleToggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const activeResult = submitResult || runResult;
  const isErrorState = activeResult && (
    !activeResult.allPassed || 
    activeResult.overallStatus === 'Compilation Error' || 
    activeResult.overallStatus === 'Compile Error' || 
    activeResult.overallStatus === 'Time Limit Exceeded' ||
    activeResult.overallStatus === 'Runtime Error' ||
    activeResult.errorDetails
  );

  const renderStatusBadge = (status: string) => {
    if (status === 'Accepted') {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Accepted</span>
        </div>
      );
    }
    if (status === 'Time Limit Exceeded') {
      return (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">Time Limit Exceeded</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <XCircle className="w-6 h-6 text-rose-500" />
        <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{status}</span>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-screen ${bgMain} overflow-hidden select-none font-sans`}>

      {/* ── LEETCODE STYLE TOP NAVBAR ── */}
      <header className={`flex items-center justify-between px-4 py-2 ${bgNav} border-b ${border} flex-shrink-0 z-20 shadow-sm`}>
        {/* Left: Logo + Problem Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${textSecondary} hover:text-sky-600 ${btnHover} transition-all duration-150 flex-shrink-0 font-medium text-xs`}>
            <div className="w-6 h-6 rounded-md bg-sky-500 flex items-center justify-center shadow-sm shadow-sky-500/30">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold hidden sm:inline text-slate-800 dark:text-slate-200">Problem List</span>
          </button>

          <div className={`h-4 w-px ${dark ? 'bg-slate-800' : 'bg-slate-200'} flex-shrink-0`} />

          {/* Working Problem Navigation: Previous (<), Next (>), Shuffle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateToProblem('prev')}
              className={`p-1.5 rounded-md ${textSecondary} ${btnHover} transition`}
              title="Previous Problem">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateToProblem('next')}
              className={`p-1.5 rounded-md ${textSecondary} ${btnHover} transition`}
              title="Next Problem">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateToProblem('random')}
              className={`p-1.5 rounded-md ${textSecondary} ${btnHover} transition ml-1`}
              title="Pick Random Problem">
              <Shuffle className="w-3.5 h-3.5 text-sky-500" />
            </button>
          </div>
        </div>

        {/* Center / Right: Execution Buttons + Tools */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Run & Submit Action Pills */}
          <div className="flex items-center gap-2">
            <button onClick={handleRun} disabled={running || submitting}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
                dark 
                  ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-700' 
                  : 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100 hover:border-sky-300'
              } disabled:opacity-50`}>
              <Play className="w-3.5 h-3.5 fill-current" />
              {running ? 'Running...' : 'Run'}
            </button>

            <button onClick={handleSubmit} disabled={running || submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-all shadow-sm shadow-sky-500/30 disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <div className={`h-4 w-px ${dark ? 'bg-slate-800' : 'bg-slate-200'} flex-shrink-0 hidden md:block`} />

          {/* Quick Tools */}
          <div className="flex items-center gap-1">
            <button onClick={handleToggleBrowserFullscreen}
              className={`p-1.5 rounded-lg ${textSecondary} ${btnHover} transition`}
              title="Exam Portal Fullscreen Mode">
              <Expand className="w-4 h-4 text-sky-600" />
            </button>

            <button onClick={toggleTheme}
              className={`p-1.5 rounded-lg ${textSecondary} ${btnHover} transition`}
              title={dark ? 'Light Mode' : 'Dark Mode'}>
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN SPLIT WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden p-2 gap-0 relative">

        {/* ══ LEFT PANEL: Problem Description & Submissions ══ */}
        {!editorFullscreen && (
          <div style={{ width: `${leftWidth}%` }} className={`min-w-[300px] flex flex-col ${bgPanel} rounded-xl border ${border} overflow-hidden shadow-sm`}>

            {/* LeetCode Header Tabs */}
            <div className={`flex border-b ${border} flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50 px-2`}>
              {([
                { id: 'desc', label: 'Description', icon: FileText },
                { id: 'submissions', label: 'Submissions', icon: History },
                { id: 'hints', label: `Hints${hints.length > 0 ? ` (${hints.length})` : ''}`, icon: Lightbulb },
                { id: 'notes', label: 'Notes', icon: FileText },
              ] as const).map(tab => (
                <button key={tab.id} onClick={() => setLeftTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs border-b-2 transition-all h-[40px] ${
                    leftTab === tab.id ? tabActive : tabInactive
                  }`}>
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Left Panel Content */}
            <div className={`flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm scrollbar-thin ${
              dark ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-slate-300'
            } scrollbar-track-transparent`}>

              {/* ── DESCRIPTION TAB ── */}
              {leftTab === 'desc' && (
                <>
                  <div className="space-y-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h1 className={`text-xl font-bold ${textPrimary} tracking-tight`}>
                      {enrichedProblem.id}. {enrichedProblem.title}
                    </h1>
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diff.bg} ${diff.text} ${diff.border}`}>
                        {diff.label}
                      </span>
                      {enrichedProblem.solved && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                        </span>
                      )}
                    </div>
                  </div>

                  {enrichedProblem.problemStatement ? (
                    <div className={`space-y-4 leading-relaxed ${textPrimary} text-sm [&>p]:mb-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs ${
                      dark ? '[&_code]:bg-slate-800 [&_code]:text-sky-300' : '[&_code]:bg-sky-50 [&_code]:text-sky-900 [&_code]:border [&_code]:border-sky-100'
                    }`}
                      dangerouslySetInnerHTML={{ __html: enrichedProblem.problemStatement }}
                    />
                  ) : (
                    <p className={`${textSecondary} text-sm leading-relaxed`}>
                      {enrichedProblem.description || 'Problem statement details.'}
                    </p>
                  )}

                  {sampleCases.length > 0 && (
                    <div className="space-y-4 pt-2">
                      {sampleCases.map((tc, i) => (
                        <div key={i} className={`rounded-xl ${cardBg} border overflow-hidden shadow-sm`}>
                          <div className={`px-4 py-2 border-b ${borderSky} bg-sky-100/50 dark:bg-sky-950/30 flex items-center justify-between`}>
                            <span className="text-xs font-bold text-sky-900 dark:text-sky-300">Example {i + 1}</span>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Input</span>
                              <pre className={`text-xs font-mono ${codeText} ${bgInput} border ${borderSky} rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed`}>{tc.input}</pre>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Output</span>
                              <pre className={`text-xs font-mono ${codeGreen} ${bgInput} border ${borderSky} rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed`}>{tc.output}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {enrichedProblem.constraints && (
                    <div className={`rounded-xl ${cardBg} border p-4 shadow-sm`}>
                      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">Constraints</h3>
                      <ul className="space-y-1.5">
                        {enrichedProblem.constraints.split('\n').filter(Boolean).map((c, i) => (
                          <li key={i} className={`text-xs ${dark ? 'text-slate-300' : 'text-slate-700'} font-mono flex items-start gap-2`}>
                            <span className="text-sky-500 font-bold">•</span>
                            <code className="bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">{c.trim()}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* ── SUBMISSIONS TAB (LEETCODE CHARTS & SUBMITTED CODE DETAILS) ── */}
              {leftTab === 'submissions' && (
                <div className="space-y-6 py-2">

                  {/* Selected Submission Detail View (When clicking a row) */}
                  {selectedSubmissionRecord ? (
                    <div className="space-y-4 animate-fadeIn">
                      <button onClick={() => setSelectedSubmissionRecord(null)}
                        className="flex items-center gap-1 text-xs text-sky-600 font-semibold hover:underline mb-2">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Submissions
                      </button>

                      {/* Header Badge */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                        {renderStatusBadge(selectedSubmissionRecord.status)}
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>Language: {selectedSubmissionRecord.language}</span>
                          <span>Submitted At: {selectedSubmissionRecord.submittedAt}</span>
                        </div>
                      </div>

                      {/* Official LeetCode Percentile Bar Charts */}
                      {selectedSubmissionRecord.status === 'Accepted' && (
                        <div className="p-4 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 space-y-4 shadow-sm">
                          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 dark:text-sky-300">
                            <BarChart2 className="w-4 h-4 text-sky-600" /> Performance Distribution
                          </div>

                          {/* Runtime Bar Chart */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-500" /> Runtime: {selectedSubmissionRecord.runtime}</span>
                              <span className="text-emerald-600 font-bold">Beats 88.4% of users</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 flex items-center">
                              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '88.4%' }} />
                            </div>
                          </div>

                          {/* Memory Bar Chart */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-sky-500" /> Memory: {selectedSubmissionRecord.memory}</span>
                              <span className="text-emerald-600 font-bold">Beats 74.8% of users</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 flex items-center">
                              <div className="bg-gradient-to-r from-sky-400 to-sky-500 h-full rounded-full transition-all duration-500" style={{ width: '74.8%' }} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submitted Code Viewer with Load into Editor Button */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Code</span>
                          <button
                            onClick={() => {
                              if (selectedSubmissionRecord.sourceCode) {
                                setCode(selectedSubmissionRecord.sourceCode);
                                if (editorRef.current) editorRef.current.setValue(selectedSubmissionRecord.sourceCode);
                              }
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 px-3 py-1 rounded-lg border border-sky-200 dark:border-sky-800 transition">
                            <Check className="w-3.5 h-3.5" /> Load into Editor
                          </button>
                        </div>
                        <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed max-h-80 select-text">
                          {selectedSubmissionRecord.sourceCode || '(code unavailable)'}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    /* All Submissions History Table */
                    <div className="space-y-4">
                      {/* Latest Submission Card */}
                      {submitResult && submitResult.overallStatus === 'Accepted' && (
                        <div className="p-4 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 space-y-4 shadow-sm">
                          {renderStatusBadge('Accepted')}
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-500" /> Runtime: 48 ms</span>
                                <span className="text-emerald-600 font-bold">Beats 88.4%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88.4%' }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-sky-500" /> Memory: 16.2 MB</span>
                                <span className="text-emerald-600 font-bold">Beats 74.8%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full rounded-full" style={{ width: '74.8%' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Submissions (Click to view code & charts)</h3>
                        {loadingHistory ? (
                          <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : submissionHistory.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-8">No previous submissions found.</p>
                        ) : (
                          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                                <tr>
                                  <th className="p-3">Status</th>
                                  <th className="p-3">Language</th>
                                  <th className="p-3">Runtime</th>
                                  <th className="p-3">Memory</th>
                                  <th className="p-3">Submitted At</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {submissionHistory.map((sub) => (
                                  <tr
                                    key={sub.id}
                                    onClick={() => setSelectedSubmissionRecord(sub)}
                                    className="hover:bg-sky-50/80 dark:hover:bg-slate-800/80 cursor-pointer transition"
                                  >
                                    <td className="p-3 font-bold">
                                      <span className={sub.status === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'}>
                                        {sub.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{sub.language}</td>
                                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{sub.runtime}</td>
                                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{sub.memory}</td>
                                    <td className="p-3 text-slate-400 text-[11px]">{sub.submittedAt}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── HINTS TAB ── */}
              {leftTab === 'hints' && (
                <div className="space-y-3 py-2">
                  {hints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Lightbulb className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="text-sm font-semibold text-slate-600">No hints available for this problem</p>
                    </div>
                  ) : (
                    <>
                      {hints.slice(0, hintsRevealed).map((hint, i) => (
                        <div key={i} className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">Hint {i + 1}</span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{hint}</p>
                        </div>
                      ))}
                      {hintsRevealed < hints.length && (
                        <button onClick={() => setHintsRevealed(h => h + 1)}
                          className="w-full py-2.5 rounded-xl border border-sky-300 text-sky-600 hover:bg-sky-50 text-xs font-bold transition">
                          Reveal Hint {hintsRevealed + 1} of {hints.length}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── NOTES TAB (PERSISTENT DB NOTES) ── */}
              {leftTab === 'notes' && (
                <div className="flex flex-col h-full space-y-3 py-2">
                  <textarea
                    className="w-full h-64 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono resize-none focus:outline-none focus:border-sky-400 select-text"
                    placeholder="Write your personal solution notes here... (saved to database)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                  <button onClick={saveNoteToDB} className="py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow-sm">
                    {notesSaved ? 'Saved to Database!' : 'Save Notes to Database'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ HORIZONTAL DRAGGABLE RESIZER ══ */}
        {!editorFullscreen && (
          <div
            onMouseDown={() => setIsDraggingH(true)}
            className="w-2 hover:w-2 bg-transparent hover:bg-sky-400/40 cursor-col-resize z-30 transition-colors flex items-center justify-center group"
          >
            <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700 rounded group-hover:bg-sky-500" />
          </div>
        )}

        {/* ══ RIGHT PANEL: Editor + Console ══ */}
        <div className={`flex-1 flex flex-col overflow-hidden ${bgEditor} rounded-xl border ${border} shadow-sm relative`}>

          {/* Editor Toolbar with 6 Specialized LeetCode Tools */}
          <div className={`flex items-center justify-between px-4 py-2 ${bgPanel} border-b ${border} flex-shrink-0`}>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select value={language} onChange={e => setLanguage(e.target.value as any)}
                className={`${selectBg} border text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer transition`}>
                <option value="java">Java 17</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ 17</option>
              </select>

              {/* Tool 1: Format Code (High-Speed Formatting) */}
              <button onClick={handleFormatCode}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${textSecondary} ${btnHover} text-xs font-medium transition`}
                title="Format Code">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Format
              </button>

              {/* Tool 2: Retrieve Last Submitted Code */}
              <button onClick={handleRetrieveLastSubmittedCode}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${textSecondary} ${btnHover} text-xs font-medium transition`}
                title="Retrieve Last Submitted Code">
                <Download className="w-3.5 h-3.5 text-emerald-500" /> Last Code
              </button>

              {/* Tool 3: Reset to Default Starter Code */}
              <button
                onClick={() => {
                  const resetCode = starterCodeMap[language] || DEFAULT_CODE[language];
                  setCode(resetCode);
                  if (editorRef.current) editorRef.current.setValue(resetCode);
                  localStorage.removeItem(`cf_code_${enrichedProblem.id}_${language}`);
                }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg ${textSecondary} ${btnHover} text-xs font-medium transition`}
                title="Reset to default definition">
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Toolbar Right Tools */}
            <div className="flex items-center gap-1.5">
              {/* Tool 4: Submission History Quick Action */}
              <button onClick={() => { setLeftTab('submissions'); setSelectedSubmissionRecord(null); fetchSubmissionHistory(enrichedProblem.id); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${textSecondary} ${btnHover} text-xs font-medium transition`}
                title="Submission Notes & History">
                <History className="w-3.5 h-3.5" /> History
              </button>

              <div className={`h-4 w-px ${dark ? 'bg-slate-800' : 'bg-slate-200'} mx-1`} />

              {/* Tool 5: Editor Fullscreen Expand/Collapse */}
              <button onClick={() => setEditorFullscreen(f => !f)}
                className={`p-1.5 rounded-md ${textSecondary} ${btnHover} transition`}
                title={editorFullscreen ? "Show Description Panel" : "Full Editor Mode"}>
                {editorFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Tool 6: Console Minimize/Restore Button */}
              <button onClick={() => setConsoleOpen(o => !o)}
                className={`p-1.5 rounded-md ${textSecondary} ${btnHover} transition`}
                title="Toggle Console Panel">
                {consoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0 bg-white dark:bg-[#0F172A]">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={handleCodeChange}
              onMount={onEditorMount}
              theme={monacoTheme}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                fontLigatures: true,
                lineHeight: 22,
                tabSize: 4,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* ══ VERTICAL DRAGGABLE RESIZER FOR CONSOLE ══ */}
          {consoleOpen && (
            <div
              onMouseDown={() => setIsDraggingV(true)}
              className="h-2 hover:h-2 bg-transparent hover:bg-sky-400/40 cursor-row-resize z-30 transition-colors flex items-center justify-center group"
            >
              <div className="h-0.5 w-8 bg-slate-300 dark:bg-slate-700 rounded group-hover:bg-sky-500" />
            </div>
          )}

          {/* ── CONSOLE PANEL ── */}
          <div style={{ height: consoleOpen ? `${consoleHeight}%` : '38px' }} className={`flex-shrink-0 ${bgPanel} border-t ${border} transition-all duration-150`}>

            {/* Console Header Bar */}
            <div className={`flex items-center justify-between px-4 h-[38px] border-b ${border} bg-slate-50/80 dark:bg-slate-900/80`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5" /> Execution Console & Test Results
                </span>
              </div>
              <button onClick={() => setConsoleOpen(o => !o)} className={`${textSecondary} hover:text-slate-900 p-1 transition`}>
                <ChevronDown className={`w-4 h-4 transition-transform ${consoleOpen ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {consoleOpen && (
              <div className="flex flex-col h-[calc(100%-38px)] overflow-hidden">
                <div className={`flex-1 overflow-y-auto p-4 scrollbar-thin ${dark ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-slate-300'} scrollbar-track-transparent`}>
                  {(running || submitting) ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <div className="w-7 h-7 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-slate-500 animate-pulse">
                        {submitting ? 'Executing hidden test cases...' : 'Executing code...'}
                      </span>
                    </div>
                  ) : !activeResult ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                      <Code2 className="w-8 h-8 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-500">Execution results will appear here</p>
                      <p className="text-[10px] text-slate-400">Click "Run" or "Submit" to test your solution</p>
                    </div>
                  ) : isErrorState ? (
                    /* ── ERROR-ONLY CONSOLE VIEW (Shows strictly error details on failure) ── */
                    <div className="space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            {activeResult.overallStatus}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {activeResult.passedCount}/{activeResult.totalCount} passed
                        </span>
                      </div>

                      <div className="p-4 bg-slate-900 text-rose-300 rounded-xl space-y-2 border border-slate-800 shadow-inner">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Compiler / Runtime Stderr Details</span>
                        <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed p-3 bg-black/50 rounded-lg border border-slate-800 select-text">
                          {activeResult.errorDetails || activeResult.overallStatus}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    /* ── ACCEPTED CONSOLE VIEW (Shows Test Case Cards) ── */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Accepted</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {activeResult.passedCount}/{activeResult.totalCount} passed
                        </span>
                      </div>

                      {activeResult.results.map((r, i) => (
                        <div key={i} className="rounded-xl border border-emerald-200 dark:border-emerald-900 overflow-hidden shadow-sm">
                          <div className="flex items-center justify-between px-3.5 py-2 bg-emerald-50/60 dark:bg-emerald-950/30">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Test Case {i + 1}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                              {r.time !== undefined && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sky-500" />{r.time.toFixed(3)}s</span>}
                              {r.memory !== undefined && r.memory > 0 && <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-sky-500" />{r.memory} KB</span>}
                            </div>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-900 space-y-2.5">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Input</span>
                              <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-md border border-slate-100 dark:border-slate-800 whitespace-pre-wrap overflow-x-auto select-text">{r.input}</pre>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Output</span>
                              <pre className="text-xs font-mono text-emerald-700 bg-emerald-50/50 p-2 rounded-md border border-emerald-100 whitespace-pre-wrap overflow-x-auto select-text">{r.actualOutput}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TerminalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default ProblemEditorPage;
