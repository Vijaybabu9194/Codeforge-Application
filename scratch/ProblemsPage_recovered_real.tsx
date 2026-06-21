Created At: 2026-06-21T05:50:32Z
Completed At: 2026-06-21T05:50:36Z
File Path: `file:///Users/avijaybabu/Desktop/CodeForge-1/frontend/src/pages/ProblemsPage.tsx`
Total Lines: 513
Total Bytes: 22455
Showing lines 1 to 513
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import React, { useState, useEffect } from 'react';
2: import api from '../lib/api';
3: import { useAuth } from '../context/AuthContext';
4: import { ChevronDown, ChevronRight, HelpCircle, Flame, Bookmark, CheckCircle } from 'lucide-react';
5: 
6: import QuestionTable from '../components/problems/QuestionTable';
7: import ProblemFilters from '../components/problems/ProblemFilters';
8: 
9: interface Problem {
10:   id: number;
11:   title: string;
12:   slug: string;
13:   difficulty: string;
14:   acceptanceRate: number;
15:   topics: string[];
16:   companies: string[];
17:   solved: boolean;
18:   bookmarked: boolean;
19:   leetcodeUrl?: string;
20:   gfgUrl?: string;
21: }
22: 
23: interface Topic {
24:   id: number;
25:   name: string;
26:   icon: string;
27:   problemCount: number;
28: }
29: 
30: interface Subtopic {
31:   id: number;
32:   name: string;
33:   description: string;
34:   problems: Problem[];
35: }
36: 
37: interface TopicDetails {
38:   id: number;
39:   name: string;
40:   icon: string;
41:   subtopics: Subtopic[];
42: }
43: 
44: interface ProblemsPageProps {
45:   onSolve: (problem: any) => void;
46: }
47: 
48: export const ProblemsPage: React.FC<ProblemsPageProps> = ({ onSolve }) => {
49:   const { user, updateUserStats } = useAuth();
50:   const [topics, setTopics] = useState<Topic[]>([]);
51:   const [loadedTopicDetails, setLoadedTopicDetails] = useState<Record<number, TopicDetails>>({});
52:   const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
53:   const [expandedSubtopics, setExpandedSubtopics] =
<truncated 21362 bytes>
       <div 
469:                                     className="h-full bg-success rounded-full transition-all duration-300"
470:                                     style={{ width: `${subProgressPercent}%` }}
471:                                   />
472:                                 </div>
473:                               </div>
474:                             </div>
475: 
476:                             {/* Subtopic Table */}
477:                             {isSubExpanded && (
478:                               <div className="p-4 bg-slate-50/10 border-t border-[#E5E7EB]">
479:                                 <QuestionTable
480:                                   problems={sub.problems}
481:                                   onSolveToggle={toggleSolved}
482:                                   onBookmarkToggle={toggleBookmark}
483:                                   onSolve={onSolve}
484:                                 />
485:                               </div>
486:                             )}
487:                           </div>
488:                         );
489:                       })
490:                     )}
491:                   </div>
492:                 )}
493:               </div>
494:             );
495:           })}
496:         </div>
497: 
498:         {/* Global Empty State for search filter */}
499:         {hasActiveFilters && !hasAnyMatchingProblems && (
500:           <div className="bg-white border border-[#E5E7EB] rounded-premium p-12 text-center shadow-card">
501:             <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
502:             <p className="font-bold text-base text-text">No Problems Match Your Filters</p>
503:             <p className="text-xs text-secondaryText mt-1">Try adjusting the search query or difficulty filters.</p>
504:           </div>
505:         )}
506: 
507:       </div>
508:     </div>
509:   );
510: };
511: 
512: export default ProblemsPage;
513: 
The above content shows the entire, complete file contents of the requested file.
