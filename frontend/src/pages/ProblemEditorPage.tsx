import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Send, Sparkles, BookOpen, AlertCircle, FileText, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

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

interface ProblemEditorPageProps {
  problem: Problem;
  onBack: () => void;
}

interface RunStatus {
  id: number;
  description: string;
}

interface RunResult {
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  time?: number;
  memory?: number;
  message?: string;
  status: RunStatus;
}

const DEFAULT_CODE: Record<string, string> = {
  python: `# Write your Python solution here\n\nif __name__ == '__main__':\n    # Example read stdin input\n    # import sys\n    # lines = sys.stdin.read().split()\n    print("Hello from Python!")\n`,
  java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        System.out.println("Hello from Java!");\n    }\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    cout << "Hello from C++!" << endl;\n    return 0;\n}\n`
};

const LANG_IDS: Record<string, number> = {
  python: 71,
  java: 62,
  cpp: 54
};

export const ProblemEditorPage: React.FC<ProblemEditorPageProps> = ({ problem, onBack }) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'notes'>('desc');
  const [language, setLanguage] = useState<'python' | 'java' | 'cpp'>('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Load custom notes and code from localStorage if saved
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${problem.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
    
    const savedCode = localStorage.getItem(`code_${problem.id}_${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(DEFAULT_CODE[language]);
    }
  }, [problem.id, language]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      localStorage.setItem(`code_${problem.id}_${language}`, value);
    }
  };

  const saveNotes = () => {
    localStorage.setItem(`notes_${problem.id}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  // Decode helper (since outputs are base64-encoded)
  const decodeBase64 = (str?: string) => {
    if (!str) return '';
    try {
      return atob(str);
    } catch (e) {
      return str;
    }
  };

  const handleRun = async (isSubmit: boolean) => {
    if (isSubmit) setSubmitting(true);
    else setRunning(true);
    setResult(null);

    try {
      // Base64 encode the code and stdin
      const encodedCode = btoa(unescape(encodeURIComponent(code)));
      const encodedStdin = btoa(unescape(encodeURIComponent(stdin)));

      const response = await api.post<RunResult>('/submissions', {
        sourceCode: encodedCode,
        languageId: LANG_IDS[language],
        stdin: encodedStdin
      });

      setResult(response.data);

      // If it is a submit and runs successfully, mark problem as solved in DB
      if (isSubmit && response.data.status.id === 3) {
        await api.post(`/problems/${problem.id}/solve`);
      }
    } catch (err: any) {
      console.error('Execution failed:', err);
      setResult({
        stderr: btoa('Failed to connect to the execution environment.'),
        status: { id: 12, description: 'Runtime Error (Other)' }
      });
    } finally {
      setRunning(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] select-none overflow-hidden">
      {/* EDITOR SUBHEADER */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-secondaryText hover:text-text text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Problems List</span>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <h2 className="text-base font-bold text-text truncate max-w-xs md:max-w-md">{problem.title}</h2>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            problem.difficulty === 'EASY' ? 'bg-green-50 text-success' :
            problem.difficulty === 'MEDIUM' ? 'bg-amber-50 text-warning' :
            'bg-red-50 text-danger'
          }`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {problem.leetcodeUrl && (
            <a 
              href={problem.leetcodeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs bg-[#FFF7ED] text-[#EA580C] px-3 py-1.5 rounded-premium border border-[#FED7AA] font-bold hover:bg-[#FEE2E2] hover:text-[#DC2626] transition flex items-center gap-1"
            >
              LeetCode
            </a>
          )}
          {problem.gfgUrl && (
            <a 
              href={problem.gfgUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs bg-[#F0FDF4] text-[#16A34A] px-3 py-1.5 rounded-premium border border-[#BBF7D0] font-bold hover:bg-[#DCFCE7] hover:text-[#15803D] transition flex items-center gap-1"
            >
              GFG
            </a>
          )}
        </div>
      </div>

      {/* SPLIT SCREEN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: PROBLEM / DETAILS / NOTES */}
        <div className="w-[40%] bg-white border-r border-[#E5E7EB] flex flex-col overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <button
              onClick={() => setActiveTab('desc')}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'desc' 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-secondaryText hover:text-text'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'notes' 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-secondaryText hover:text-text'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {activeTab === 'desc' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-text mb-2">{problem.title}</h3>
                  <p className="text-sm text-secondaryText leading-relaxed">
                    Welcome to the workspace! You can write and execute code on the right.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-premium space-y-2.5">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Instructions
                  </h4>
                  <ul className="list-disc pl-4 text-xs text-secondaryText space-y-1.5">
                    <li>Select your programming language (Python, Java, or C++).</li>
                    <li>Write your code inside the editor. Ensure your code reads from standard input (stdin) if needed.</li>
                    <li>Write test cases in the "Custom Input" section to debug your solution.</li>
                    <li>Click **Run Code** to compile and test against your custom inputs.</li>
                    <li>Click **Submit Code** to test and save your solution.</li>
                  </ul>
                </div>

                {problem.companies && problem.companies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-secondaryText uppercase tracking-wide mb-2.5">Companies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.companies.map((company, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-premium font-semibold border border-[#E2E8F0]"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-secondaryText uppercase tracking-wide">Scratchpad Notes</h4>
                  {notesSaved && (
                    <span className="text-[10px] bg-green-50 text-success border border-green-200 px-2 py-0.5 rounded-premium font-bold">
                      Saved!
                    </span>
                  )}
                </div>
                <textarea
                  className="flex-1 w-full p-4 border border-[#E2E8F0] focus:border-primary focus:ring-0 rounded-premium text-sm outline-none resize-none font-sans"
                  placeholder="Write your notes, algorithm pseudocode, or thoughts here... (Saved locally)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={saveNotes}
                  className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-premium transition"
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EDITOR & RUNNER */}
        <div className="w-[60%] flex flex-col overflow-hidden bg-white">
          {/* Language Selector Header */}
          <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-6 py-2.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-secondaryText uppercase">Language:</label>
              <select
                className="bg-white border border-[#E2E8F0] rounded-premium px-3 py-1 text-xs font-semibold text-text focus:outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 17</option>
              </select>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative border-b border-[#E5E7EB]">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-light"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                lineHeight: 22,
                tabSize: 4,
                automaticLayout: true
              }}
            />
          </div>

          {/* CONSOLE PANEL (INPUT / RESULT) */}
          <div className="h-[35%] bg-white flex flex-col overflow-hidden">
            {/* Input Header */}
            <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-6 py-2 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-secondaryText uppercase tracking-wider">Console & Execution</span>
            </div>

            {/* Input & Output Panels */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Custom Input (Stdin) */}
              <div className="w-1/2 p-4 border-r border-[#E5E7EB] flex flex-col h-full overflow-hidden">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider mb-1.5 block">Custom Input (stdin)</span>
                <textarea
                  className="flex-1 w-full p-2.5 border border-[#E2E8F0] focus:border-primary focus:ring-0 rounded-premium text-xs outline-none font-mono resize-none bg-[#FAFBFC]"
                  placeholder="Provide standard inputs for test runs here..."
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                />
              </div>

              {/* Run Results */}
              <div className="w-1/2 p-4 flex flex-col h-full overflow-y-auto bg-[#FAFBFD] scrollbar-thin">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider mb-2 block">Execution Results</span>
                
                {running || submitting ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-secondaryText font-semibold animate-pulse">
                      {submitting ? 'Submitting code...' : 'Running compiler...'}
                    </span>
                  </div>
                ) : result ? (
                  <div className="space-y-3.5 text-xs">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {result.status.id === 3 ? (
                        <span className="inline-flex items-center gap-1.5 text-success font-bold bg-green-50 border border-green-200 px-3 py-1 rounded-premium">
                          <CheckCircle className="w-4 h-4" />
                          {result.status.description}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-danger font-bold bg-red-50 border border-red-200 px-3 py-1 rounded-premium">
                          <XCircle className="w-4 h-4" />
                          {result.status.description}
                        </span>
                      )}
                      {result.time !== undefined && (
                        <span className="text-[#64748B] font-medium">Time: {result.time.toFixed(3)}s</span>
                      )}
                    </div>

                    {/* Stdout / Stderr logs */}
                    {result.compileOutput ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-danger uppercase tracking-wider block">Compile Error</span>
                        <pre className="bg-red-50/50 text-danger border border-red-100 p-2.5 rounded-premium font-mono whitespace-pre-wrap overflow-x-auto">
                          {decodeBase64(result.compileOutput)}
                        </pre>
                      </div>
                    ) : (
                      <>
                        {result.stdout && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider block">Standard Output</span>
                            <pre className="bg-white border border-[#E2E8F0] p-2.5 rounded-premium font-mono whitespace-pre-wrap overflow-x-auto text-[#0F172A]">
                              {decodeBase64(result.stdout)}
                            </pre>
                          </div>
                        )}
                        {result.stderr && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-danger uppercase tracking-wider block">Standard Error</span>
                            <pre className="bg-red-50/50 text-danger border border-red-100 p-2.5 rounded-premium font-mono whitespace-pre-wrap overflow-x-auto">
                              {decodeBase64(result.stderr)}
                            </pre>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#94A3B8] py-8">
                    <AlertCircle className="w-8 h-8 text-[#CBD5E1] mb-2" />
                    <span className="text-xs font-semibold">No execution results yet</span>
                    <span className="text-[10px]">Click run code to test compilation</span>
                  </div>
                )}
              </div>
            </div>

            {/* Run Operations Submenu */}
            <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-end space-x-3.5 flex-shrink-0">
              <button
                onClick={() => handleRun(false)}
                disabled={running || submitting}
                className="px-5 py-2 border border-border bg-white text-secondaryText hover:text-text font-bold text-xs rounded-premium shadow-sm hover:bg-secondaryBg disabled:opacity-50 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Run Code
              </button>
              <button
                onClick={() => handleRun(true)}
                disabled={running || submitting}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-premium shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditorPage;
