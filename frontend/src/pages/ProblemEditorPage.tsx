import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft, Play, Send,
  ChevronLeft, ChevronRight,
  Lightbulb, FileText, BookOpen,
  CheckCircle2, XCircle,
  Clock, Cpu, Tag, Building2, ExternalLink,
  RefreshCw, ChevronDown, Code2,
  Eye, EyeOff, Bookmark, BookmarkCheck, Sun, Moon
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
  python: `# Write your Python solution here\ndef solution():\n    pass\n\nif __name__ == '__main__':\n    solution()\n`,
  java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Write your solution here\n    return 0;\n}\n`,
};

const LANG_IDS: Record<string, number> = { python: 71, java: 62, cpp: 54 };

const DIFFICULTY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  EASY:   { label: 'Easy',   bg: 'bg-emerald-500/15', text: 'text-emerald-500' },
  MEDIUM: { label: 'Medium', bg: 'bg-amber-500/15',   text: 'text-amber-500'   },
  HARD:   { label: 'Hard',   bg: 'bg-red-500/15',     text: 'text-red-500'     },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ProblemEditorPage: React.FC<ProblemEditorPageProps> = ({ problem, onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  // ── Theme-aware CSS helpers ──────────────────────────────────────────────
  const bg      = dark ? 'bg-[#1A1A2E]'   : 'bg-[#F0F2F5]';
  const bgNav   = dark ? 'bg-[#0F0F1A]'   : 'bg-white';
  const bgPanel = dark ? 'bg-[#0F0F1A]'   : 'bg-white';
  const bgEditor= dark ? 'bg-[#1A1A2E]'   : 'bg-[#F8FAFC]';
  const bgInput = dark ? 'bg-[#0B0B16]'   : 'bg-[#F1F5F9]';
  const border  = dark ? 'border-white/[0.07]' : 'border-[#E2E8F0]';
  const textPrimary   = dark ? 'text-white'    : 'text-[#1E293B]';
  const textSecondary = dark ? 'text-[#7B8AB8]': 'text-[#64748B]';
  const textMuted     = dark ? 'text-[#4A5580]': 'text-[#94A3B8]';
  const tabActive     = dark ? 'border-[#4A6CF7] text-white' : 'border-[#4A6CF7] text-[#4A6CF7]';
  const tabInactive   = dark ? `border-transparent ${textSecondary} hover:text-white`
                               : `border-transparent ${textSecondary} hover:text-[#1E293B]`;
  const codeText  = dark ? 'text-[#A5B4FC]' : 'text-[#4338CA]';
  const codeGreen = dark ? 'text-emerald-300' : 'text-emerald-600';
  const btnHover  = dark ? 'hover:bg-white/[0.10]' : 'hover:bg-[#F1F5F9]';
  const selectBg  = dark ? 'bg-white/[0.06] border-white/[0.10] text-white' : 'bg-white border-[#E2E8F0] text-[#1E293B]';
  const cardBg    = dark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-[#F8FAFC] border-[#E2E8F0]';
  const hintBg    = dark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200';
  const hintText  = dark ? 'text-amber-400' : 'text-amber-700';

  const monacoTheme = dark ? 'vs-dark' : 'vs-light';

  // ── State ────────────────────────────────────────────────────────────────
  const [leftTab, setLeftTab] = useState<'desc' | 'hints' | 'notes'>('desc');
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'results'>('testcases');
  const [language, setLanguage] = useState<'python' | 'java' | 'cpp'>('python');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<SubmitResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [activeTestIdx, setActiveTestIdx] = useState(0);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [enrichedProblem, setEnrichedProblem] = useState<Problem>(problem);
  const [isBookmarked, setIsBookmarked] = useState(problem.bookmarked);

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

  useEffect(() => {
    api.get<Problem>(`/problems/${problem.id}`)
      .then(res => setEnrichedProblem(res.data))
      .catch(() => {});
  }, [problem.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`cf_code_${problem.id}_${language}`);
    if (saved) { setCode(saved); return; }
    if (starterCodeMap[language]) { setCode(starterCodeMap[language]); return; }
    setCode(DEFAULT_CODE[language]);
  }, [problem.id, language, enrichedProblem.starterCode]);

  useEffect(() => {
    const saved = localStorage.getItem(`cf_notes_${problem.id}`);
    if (saved) setNotes(saved);
  }, [problem.id]);

  const handleCodeChange = (value: string | undefined) => {
    const v = value ?? '';
    setCode(v);
    localStorage.setItem(`cf_code_${problem.id}_${language}`, v);
  };

  const saveNotes = () => {
    localStorage.setItem(`cf_notes_${problem.id}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const encodeB64 = (str: string) => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };

  const handleRun = async () => {
    setRunning(true); setRunResult(null); setConsoleTab('results');
    try {
      const res = await api.post<SubmitResult>(`/problems/${problem.id}/run`, {
        sourceCode: encodeB64(code), languageId: LANG_IDS[language],
      });
      setRunResult(res.data);
    } catch {
      setRunResult({ allPassed: false, passedCount: 0, totalCount: 0, results: [], overallStatus: 'Runtime Error' });
    } finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitResult(null); setConsoleTab('results');
    try {
      const res = await api.post<SubmitResult>(`/problems/${problem.id}/submit`, {
        sourceCode: encodeB64(code), languageId: LANG_IDS[language],
      });
      setSubmitResult(res.data);
      if (res.data.allPassed) setEnrichedProblem(p => ({ ...p, solved: true }));
    } catch {
      setSubmitResult({ allPassed: false, passedCount: 0, totalCount: 0, results: [], overallStatus: 'Runtime Error' });
    } finally { setSubmitting(false); }
  };

  const handleBookmark = async () => {
    try { await api.post(`/problems/${problem.id}/bookmark`); setIsBookmarked(b => !b); } catch {}
  };

  const activeResult = submitResult || runResult;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`flex flex-col h-screen ${bg} overflow-hidden select-none font-sans`}>

      {/* ── TOP NAVBAR ── */}
      <header className={`flex items-center justify-between px-4 py-2.5 ${bgNav} border-b ${border} flex-shrink-0 z-20`}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo + Back */}
          <button onClick={onBack}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition-colors duration-150 flex-shrink-0`}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:block">Problems</span>
          </button>

          <div className={`h-4 w-px ${dark ? 'bg-white/10' : 'bg-[#E2E8F0]'} flex-shrink-0`} />

          {/* Problem title + difficulty */}
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-sm font-bold ${textPrimary} truncate max-w-[220px] md:max-w-md`}>
              {enrichedProblem.title}
            </span>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${diff.bg} ${diff.text}`}>
              {diff.label}
            </span>
            {enrichedProblem.solved && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {enrichedProblem.acceptanceRate > 0 && (
            <span className={`text-[10px] ${textSecondary} font-semibold hidden md:block`}>
              {enrichedProblem.acceptanceRate.toFixed(1)}% acceptance
            </span>
          )}

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/[0.06]' : 'hover:bg-[#F1F5F9]'} transition`}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {dark
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-[#64748B]" />
            }
          </button>

          <button onClick={handleBookmark}
            className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/[0.06]' : 'hover:bg-[#F1F5F9]'} transition`}>
            {isBookmarked
              ? <BookmarkCheck className="w-4 h-4 text-amber-400" />
              : <Bookmark className={`w-4 h-4 ${textSecondary}`} />
            }
          </button>

          {enrichedProblem.leetcodeUrl && (
            <a href={enrichedProblem.leetcodeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFA116]/15 text-[#FFA116] text-[10px] font-bold hover:bg-[#FFA116]/25 transition">
              LeetCode <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {enrichedProblem.gfgUrl && (
            <a href={enrichedProblem.gfgUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 text-[10px] font-bold hover:bg-emerald-500/25 transition">
              GFG <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </header>

      {/* ── MAIN SPLIT WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ══ LEFT PANEL ══ */}
        <div className={`w-[42%] min-w-[320px] flex flex-col ${bgPanel} border-r ${border} overflow-hidden`}>

          {/* Tabs */}
          <div className={`flex border-b ${border} flex-shrink-0`}>
            {([
              { id: 'desc', label: 'Description', icon: BookOpen },
              { id: 'hints', label: `Hints${hints.length > 0 ? ` (${hints.length})` : ''}`, icon: Lightbulb },
              { id: 'notes', label: 'Notes', icon: FileText },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setLeftTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors h-[44px] ${
                  leftTab === tab.id ? tabActive : tabInactive
                }`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={`flex-1 overflow-y-auto px-5 py-5 space-y-5 text-sm scrollbar-thin ${
            dark ? 'scrollbar-thumb-white/10' : 'scrollbar-thumb-slate-300'
          } scrollbar-track-transparent`}>

            {/* ── DESCRIPTION TAB ── */}
            {leftTab === 'desc' && (
              <>
                {enrichedProblem.problemStatement ? (
                  <div className={`space-y-3 leading-relaxed ${textPrimary} text-sm [&>p]:mb-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs ${dark ? '[&_code]:bg-white/10 [&_code]:text-[#A5B4FC]' : '[&_code]:bg-[#EEF2FF] [&_code]:text-[#4338CA]'}`}
                    dangerouslySetInnerHTML={{ __html: enrichedProblem.problemStatement }}
                  />
                ) : (
                  <p className={`${textSecondary} text-sm leading-relaxed`}>
                    {enrichedProblem.description || 'Problem statement will appear here once data is seeded.'}
                  </p>
                )}

                {/* Sample Test Cases */}
                {sampleCases.length > 0 && (
                  <div className="space-y-3">
                    {sampleCases.map((tc, i) => (
                      <div key={i} className={`rounded-xl ${cardBg} border overflow-hidden`}>
                        <div className={`px-3 py-2 ${dark ? 'bg-white/[0.02]' : 'bg-[#F1F5F9]'} border-b ${border}`}>
                          <span className={`text-[10px] font-extrabold ${textSecondary} uppercase tracking-widest`}>
                            Example {i + 1}
                          </span>
                        </div>
                        <div className="p-3 space-y-2">
                          <div>
                            <span className={`text-[10px] font-bold ${textSecondary} uppercase tracking-wider block mb-1`}>Input</span>
                            <pre className={`text-xs font-mono ${codeText} ${bgInput} rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap`}>{tc.input}</pre>
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold ${textSecondary} uppercase tracking-wider block mb-1`}>Output</span>
                            <pre className={`text-xs font-mono ${codeGreen} ${bgInput} rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap`}>{tc.output}</pre>
                          </div>
                          {tc.explanation && (
                            <div>
                              <span className={`text-[10px] font-bold ${textSecondary} uppercase tracking-wider block mb-1`}>Explanation</span>
                              <p className={`text-xs ${dark ? 'text-[#C8D1E8]' : 'text-[#475569]'} leading-relaxed`}>{tc.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {enrichedProblem.constraints && (
                  <div className={`rounded-xl ${cardBg} border p-4`}>
                    <h3 className={`text-[10px] font-extrabold ${textSecondary} uppercase tracking-widest mb-2`}>Constraints</h3>
                    <ul className="space-y-1">
                      {enrichedProblem.constraints.split('\n').filter(Boolean).map((c, i) => (
                        <li key={i} className={`text-xs ${dark ? 'text-[#C8D1E8]' : 'text-[#334155]'} font-mono flex items-start gap-2`}>
                          <span className="text-[#4A6CF7] mt-0.5">•</span>
                          <code className="leading-relaxed">{c.trim()}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topic Tags */}
                {enrichedProblem.topics?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Tag className={`w-3 h-3 ${textSecondary}`} />
                      <span className={`text-[10px] font-extrabold ${textSecondary} uppercase tracking-widest`}>Topics</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {enrichedProblem.topics.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-[#4A6CF7]/15 border border-[#4A6CF7]/30 text-[#4A6CF7] text-[10px] font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Tags */}
                {enrichedProblem.companies?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Building2 className={`w-3 h-3 ${textSecondary}`} />
                      <span className={`text-[10px] font-extrabold ${textSecondary} uppercase tracking-widest`}>Asked by</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {enrichedProblem.companies.slice(0, 8).map((c, i) => (
                        <span key={i} className={`px-2.5 py-1 rounded-full ${dark ? 'bg-white/[0.06] border-white/[0.10] text-[#C8D1E8]' : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#475569]'} border text-[10px] font-semibold`}>{c}</span>
                      ))}
                      {enrichedProblem.companies.length > 8 && (
                        <span className={`px-2.5 py-1 rounded-full ${dark ? 'bg-white/[0.04] text-[#7B8AB8]' : 'bg-[#F8FAFC] text-[#94A3B8]'} border ${border} text-[10px] font-semibold`}>
                          +{enrichedProblem.companies.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {enrichedProblem.articleUrl && (
                  <div className="flex gap-2">
                    <a href={enrichedProblem.articleUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A6CF7]/15 border border-[#4A6CF7]/30 text-[#4A6CF7] text-[10px] font-bold hover:bg-[#4A6CF7]/25 transition">
                      📖 Article
                    </a>
                  </div>
                )}
              </>
            )}

            {/* ── HINTS TAB ── */}
            {leftTab === 'hints' && (
              <div className="space-y-3">
                {hints.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lightbulb className={`w-10 h-10 ${textMuted} mb-3`} />
                    <p className={`text-sm ${textSecondary} font-semibold`}>No hints available for this problem</p>
                    <p className={`text-xs ${textMuted} mt-1`}>Try solving it on your own!</p>
                  </div>
                ) : (
                  <>
                    {hints.slice(0, hintsRevealed).map((hint, i) => (
                      <div key={i} className={`rounded-xl ${hintBg} border p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className={`w-3.5 h-3.5 ${hintText}`} />
                          <span className={`text-[10px] font-extrabold ${hintText} uppercase tracking-widest`}>Hint {i + 1}</span>
                        </div>
                        <p className={`text-sm ${dark ? 'text-[#C8D1E8]' : 'text-[#92400E]'} leading-relaxed`}>{hint}</p>
                      </div>
                    ))}
                    {hintsRevealed < hints.length && (
                      <button onClick={() => setHintsRevealed(h => h + 1)}
                        className={`w-full py-3 rounded-xl border border-dashed ${dark ? 'border-amber-500/30 text-amber-400/70 hover:text-amber-400 hover:border-amber-500/60' : 'border-amber-400/40 text-amber-600/70 hover:text-amber-600 hover:border-amber-500/60'} text-xs font-bold transition-all flex items-center justify-center gap-2`}>
                        <Eye className="w-3.5 h-3.5" />
                        Reveal Hint {hintsRevealed + 1} of {hints.length}
                      </button>
                    )}
                    {hintsRevealed === hints.length && (
                      <button onClick={() => setHintsRevealed(0)}
                        className={`w-full py-2.5 rounded-xl border ${border} ${textSecondary} hover:${textPrimary} text-xs font-semibold transition-all flex items-center justify-center gap-2`}>
                        <EyeOff className="w-3.5 h-3.5" /> Hide all hints
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── NOTES TAB ── */}
            {leftTab === 'notes' && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold ${textSecondary} uppercase tracking-widest`}>Personal Notes</span>
                  {notesSaved && (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Saved!</span>
                  )}
                </div>
                <textarea
                  className={`flex-1 w-full min-h-[300px] p-4 ${dark ? 'bg-white/[0.04] border-white/[0.08] text-[#C8D1E8] placeholder-[#4A5580]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] placeholder-[#CBD5E1]'} border focus:border-[#4A6CF7]/60 focus:outline-none rounded-xl text-sm font-mono resize-none transition-colors`}
                  placeholder="Write your algorithm approach, pseudocode, or notes here... (saved locally)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <button onClick={saveNotes}
                  className="w-full py-2.5 bg-[#4A6CF7] hover:bg-[#5A7CF8] text-white text-xs font-bold rounded-xl transition">
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT PANEL: Editor + Console ══ */}
        <div className={`flex-1 flex flex-col overflow-hidden ${bgEditor}`}>

          {/* Editor toolbar */}
          <div className={`flex items-center justify-between px-4 py-2 ${bgPanel} border-b ${border} flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <select value={language} onChange={e => setLanguage(e.target.value as any)}
                className={`${selectBg} border text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4A6CF7]/60 cursor-pointer transition`}>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 17</option>
              </select>
              <button
                onClick={() => { setCode(starterCodeMap[language] || DEFAULT_CODE[language]); localStorage.removeItem(`cf_code_${problem.id}_${language}`); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${textSecondary} ${btnHover} text-[10px] font-semibold transition`}>
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={handleCodeChange}
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
                renderLineHighlight: 'gutter',
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* ── CONSOLE PANEL ── */}
          <div className={`flex-shrink-0 ${bgPanel} border-t ${border} transition-all duration-200 ${consoleOpen ? 'h-[40%]' : 'h-[42px]'}`}>

            {/* Console header */}
            <div className={`flex items-center justify-between px-4 py-0 h-[42px] border-b ${border}`}>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-2 text-xs font-semibold border-b-2 ${tabActive} h-[42px] flex items-center`}>
                  Test Results
                </span>
              </div>
              <button onClick={() => setConsoleOpen(o => !o)} className={`${textSecondary} hover:${textPrimary} p-1 transition`}>
                <ChevronDown className={`w-4 h-4 transition-transform ${consoleOpen ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {consoleOpen && (
              <div className="flex flex-col h-[calc(100%-42px)] overflow-hidden">
                <div className={`flex-1 overflow-y-auto p-4 scrollbar-thin ${dark ? 'scrollbar-thumb-white/10' : 'scrollbar-thumb-slate-300'} scrollbar-track-transparent`}>
                  {(running || submitting) ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <div className="w-8 h-8 border-2 border-[#4A6CF7] border-t-transparent rounded-full animate-spin" />
                      <span className={`text-xs ${textSecondary} font-semibold animate-pulse`}>
                        {submitting ? 'Running hidden test cases...' : 'Running sample test cases...'}
                      </span>
                    </div>
                  ) : !activeResult ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                      <Code2 className={`w-8 h-8 ${textMuted}`} />
                      <p className={`text-xs ${textSecondary} font-semibold`}>Execution results will appear here</p>
                      <p className={`text-[10px] ${textMuted}`}>Click "Run" to test sample cases or "Submit" to run hidden test cases</p>
                    </div>
                  ) : (
                      <div className="space-y-3">
                        {/* Overall status */}
                        <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${
                          activeResult.allPassed
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            {activeResult.allPassed
                              ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              : <XCircle className="w-5 h-5 text-red-500" />
                            }
                            <span className={`text-sm font-extrabold ${activeResult.allPassed ? 'text-emerald-500' : 'text-red-500'}`}>
                              {activeResult.overallStatus}
                            </span>
                          </div>
                          <span className={`text-xs ${textSecondary} font-semibold`}>
                            {activeResult.passedCount}/{activeResult.totalCount} passed
                          </span>
                        </div>

                        {activeResult.errorDetails && (
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block">Error Details / Compiler Output</span>
                            <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap overflow-x-auto leading-relaxed p-2 bg-black/30 rounded-lg">
                              {activeResult.errorDetails}
                            </pre>
                          </div>
                        )}

                        {/* Per-case results in exact order: Input -> Output -> Expected */}
                        {activeResult.results.map((r, i) => (
                          <div key={i} className={`rounded-xl border overflow-hidden ${r.passed ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                            <div className={`flex items-center justify-between px-3 py-2 ${r.passed ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                              <div className="flex items-center gap-2">
                                {r.passed
                                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  : <XCircle className="w-3.5 h-3.5 text-red-500" />
                                }
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${r.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                                  Test Case {i + 1}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {r.time !== undefined && (
                                  <span className={`flex items-center gap-1 text-[10px] ${textSecondary}`}>
                                    <Clock className="w-3 h-3" />{r.time.toFixed(3)}s
                                  </span>
                                )}
                                {r.memory !== undefined && r.memory > 0 && (
                                  <span className={`flex items-center gap-1 text-[10px] ${textSecondary}`}>
                                    <Cpu className="w-3 h-3" />{r.memory} KB
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`p-3 ${bgInput} space-y-2`}>
                              {/* 1. Input */}
                              <div>
                                <span className={`text-[9px] font-bold ${textSecondary} uppercase tracking-wider block mb-0.5`}>Input</span>
                                <pre className={`text-[10px] font-mono ${codeText} whitespace-pre-wrap overflow-x-auto leading-relaxed`}>
                                  {r.input ? r.input.split(/,\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\s*=)/).map(s => s.trim()).join('\n') : '(none)'}
                                </pre>
                              </div>
                              {/* 2. Output */}
                              <div>
                                <span className={`text-[9px] font-bold ${textSecondary} uppercase tracking-wider block mb-0.5`}>Output</span>
                                <pre className={`text-[10px] font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed ${r.passed ? codeGreen : 'text-red-500'}`}>
                                  {r.actualOutput || '(no output)'}
                                </pre>
                              </div>
                              {/* 3. Expected */}
                              <div>
                                <span className={`text-[9px] font-bold ${textSecondary} uppercase tracking-wider block mb-0.5`}>Expected</span>
                                <pre className={`text-[10px] font-mono ${codeGreen} whitespace-pre-wrap overflow-x-auto leading-relaxed`}>{r.expectedOutput}</pre>
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

          {/* ── FOOTER ACTION BAR ── */}
          <div className={`flex items-center justify-between px-4 py-3 ${bgPanel} border-t ${border} flex-shrink-0`}>
            <div className="flex items-center gap-2">
              {sampleCases.length > 0 && (
                <div className="flex items-center gap-1">
                  <button onClick={() => setActiveTestIdx(i => Math.max(0, i - 1))} disabled={activeTestIdx === 0}
                    className={`p-1.5 rounded ${textSecondary} hover:${textPrimary} disabled:opacity-30 transition`}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className={`text-[10px] ${textSecondary} font-semibold`}>
                    Case {activeTestIdx + 1}/{sampleCases.length}
                  </span>
                  <button onClick={() => setActiveTestIdx(i => Math.min(sampleCases.length - 1, i + 1))} disabled={activeTestIdx === sampleCases.length - 1}
                    className={`p-1.5 rounded ${textSecondary} hover:${textPrimary} disabled:opacity-30 transition`}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button onClick={handleRun} disabled={running || submitting}
                className={`flex items-center gap-1.5 px-4 py-2 border ${dark ? 'border-white/[0.15] bg-white/[0.06] text-white' : 'border-[#E2E8F0] bg-white text-[#1E293B]'} hover:opacity-80 text-xs font-bold rounded-lg transition disabled:opacity-50`}>
                <Play className="w-3.5 h-3.5" />
                {running ? 'Running...' : 'Run'}
              </button>
              <button onClick={handleSubmit} disabled={running || submitting}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#4A6CF7] hover:bg-[#5A7CF8] text-white text-xs font-bold rounded-lg transition disabled:opacity-50 shadow-lg shadow-[#4A6CF7]/25">
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditorPage;
