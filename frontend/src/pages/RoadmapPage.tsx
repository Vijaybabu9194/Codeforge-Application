import React, { useState } from 'react';
import { Map, CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronRight, Sparkles, Trophy, BookOpen, Layers, Zap } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resourceName: string;
  resourceUrl: string;
}

interface RoadmapStep {
  stepNumber: number;
  stepTitle: string;
  items: RoadmapItem[];
}

interface RoadmapData {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  badgeColor: string;
  accentColor: string;
  steps: RoadmapStep[];
}

const ROADMAPS: Record<string, RoadmapData> = {
  dsa: {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    subtitle: "Curated specifically from Striver's A2Z DSA Sheet (takeUforward)",
    source: 'takeUforward.org',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    accentColor: '#F59E0B',
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Step 1: Learn the Basics',
        items: [
          { id: 'dsa-1-1', title: 'Language Basics (C++ / Java / Python)', desc: 'Syntax, Data Types, I/O, Conditionals & Loops', difficulty: 'Beginner', resourceName: 'takeUforward Article', resourceUrl: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
          { id: 'dsa-1-2', title: 'Time & Space Complexity', desc: 'Big-O notation, Best/Worst/Average cases', difficulty: 'Beginner', resourceName: 'takeUforward Video', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-1-3', title: 'Basic Math & Recursion', desc: 'Count digits, Reverse number, GCD, Basic Recursion patterns', difficulty: 'Beginner', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-1-4', title: 'Basic Hashing', desc: 'Counting frequencies of array elements using maps/arrays', difficulty: 'Beginner', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 2,
        stepTitle: 'Step 2: Sorting Techniques',
        items: [
          { id: 'dsa-2-1', title: 'Selection, Bubble & Insertion Sort', desc: 'Understanding O(N^2) sorting algorithms', difficulty: 'Beginner', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-2-2', title: 'Merge Sort & Quick Sort', desc: 'Divide and conquer algorithms with O(N log N) complexity', difficulty: 'Intermediate', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 3,
        stepTitle: 'Step 3: Solve Problems on Arrays',
        items: [
          { id: 'dsa-3-1', title: 'Easy Array Problems', desc: 'Largest element, Second largest, Check sorted, Remove duplicates, Rotate array', difficulty: 'Beginner', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-3-2', title: 'Medium Array Problems (2Sum, Kadane, Majority)', desc: '2Sum, Sort 0s 1s 2s (Dutch National Flag), Kadanes Algo, Stock Buy & Sell, Rearrange elements', difficulty: 'Intermediate', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-3-3', title: 'Hard Array Problems (Pascals, 3Sum, 4Sum)', desc: 'Pascals Triangle, 3Sum, 4Sum, Subarrays with XOR K, Merge overlapping intervals', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 4,
        stepTitle: 'Step 4: Binary Search',
        items: [
          { id: 'dsa-4-1', title: 'Binary Search on 1D Arrays', desc: 'Search X, Lower/Upper Bound, Search Insert Position, Find Peak Element', difficulty: 'Intermediate', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-4-2', title: 'Binary Search on Search Space (Answers)', desc: 'Book Allocation, Koko Eating Bananas, Aggressive Cows, Capacity to Ship Packages', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-4-3', title: 'Binary Search on 2D Matrices', desc: 'Search in 2D Matrix, Median of row-wise sorted matrix', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 5,
        stepTitle: 'Step 5: Strings & LinkedLists',
        items: [
          { id: 'dsa-5-1', title: 'String Problems (Basic to Medium)', desc: 'Remove outermost parenthesis, Reverse words, Anagrams, Isomorphic strings', difficulty: 'Intermediate', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-5-2', title: 'LinkedList Construction & Operations', desc: 'Singly & Doubly LL insertion, deletion, reverse LL', difficulty: 'Intermediate', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-5-3', title: 'Medium/Hard LL Problems', desc: 'Detect loop, Find starting point of loop, Palindrome LL, Flattening a LL', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 6,
        stepTitle: 'Step 6: Recursion & Backtracking',
        items: [
          { id: 'dsa-6-1', title: 'Subsequences & Combination Sum', desc: 'Print all subsequences, Combination Sum I & II, Subset Sum I & II', difficulty: 'Intermediate', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-6-2', title: 'Hard Backtracking Problems', desc: 'N-Queens, Sudoku Solver, M-Coloring, Rat in a Maze', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 7,
        stepTitle: 'Step 7: Stack, Queues & Sliding Window',
        items: [
          { id: 'dsa-7-1', title: 'Monotonic Stack / Queue', desc: 'Next Greater Element, Trapping Rainwater, Largest Rectangle in Histogram', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-7-2', title: 'Sliding Window & Two Pointers', desc: 'Longest Substring without Repeating, Max Consecutive Ones III, Substrings with K distinct', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
      {
        stepNumber: 8,
        stepTitle: 'Step 8: Trees, Graphs & Dynamic Programming',
        items: [
          { id: 'dsa-8-1', title: 'Binary Trees & BST', desc: 'Traversals (In/Pre/Post), Diameter, LCA, Validate BST, Construct Tree', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-8-2', title: 'Graph Algorithms', desc: 'BFS/DFS, Topological Sort, Dijkstra, Bellman-Ford, Disjoint Set Union (DSU)', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
          { id: 'dsa-8-3', title: 'Dynamic Programming Patterns', desc: '1D DP, Grid DP, Subsequences/Knapsack, DP on Stocks, DP on LIS, MCM', difficulty: 'Advanced', resourceName: 'takeUforward Sheet', resourceUrl: 'https://takeuforward.org/' },
        ],
      },
    ],
  },

  javaFullStack: {
    id: 'javaFullStack',
    title: 'Java Full Stack Developer',
    subtitle: 'Industry standard roadmap covering Core Java, Spring Boot, Microservices & Modern Frontend',
    source: 'roadmap.sh / Java Track',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    accentColor: '#6366F1',
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Step 1: Core Java & OOP Principles',
        items: [
          { id: 'jfs-1-1', title: 'Java Basics & Environment Setup', desc: 'JDK, JRE, JVM, Variables, Data Types & Flow Control', difficulty: 'Beginner', resourceName: 'roadmap.sh/java', resourceUrl: 'https://roadmap.sh/java' },
          { id: 'jfs-1-2', title: 'Object-Oriented Programming (OOP)', desc: 'Encapsulation, Inheritance, Polymorphism, Abstraction & Interfaces', difficulty: 'Beginner', resourceName: 'roadmap.sh/java', resourceUrl: 'https://roadmap.sh/java' },
        ],
      },
      {
        stepNumber: 2,
        stepTitle: 'Step 2: Java Advanced & Collections',
        items: [
          { id: 'jfs-2-1', title: 'Collections Framework', desc: 'List, Set, Map, Queue, ArrayList, HashMap, HashSet & Iterators', difficulty: 'Intermediate', resourceName: 'roadmap.sh/java', resourceUrl: 'https://roadmap.sh/java' },
          { id: 'jfs-2-2', title: 'Exception Handling & File I/O', desc: 'Try-Catch-Finally, Custom Exceptions, Java NIO & Streams', difficulty: 'Intermediate', resourceName: 'roadmap.sh/java', resourceUrl: 'https://roadmap.sh/java' },
          { id: 'jfs-2-3', title: 'Modern Java (Java 8 to 21)', desc: 'Lambda Expressions, Stream API, Optional Class, Records & Sealed Classes', difficulty: 'Intermediate', resourceName: 'roadmap.sh/java', resourceUrl: 'https://roadmap.sh/java' },
        ],
      },
      {
        stepNumber: 3,
        stepTitle: 'Step 3: Frontend Foundations & React',
        items: [
          { id: 'jfs-3-1', title: 'HTML5, CSS3 & JavaScript ES6+', desc: 'DOM Manipulation, Flexbox/Grid, Promises, Async/Await', difficulty: 'Beginner', resourceName: 'roadmap.sh/frontend', resourceUrl: 'https://roadmap.sh/frontend' },
          { id: 'jfs-3-2', title: 'React Frontend Development', desc: 'Components, JSX, Hooks (useState, useEffect), State Management, Axios', difficulty: 'Intermediate', resourceName: 'roadmap.sh/react', resourceUrl: 'https://roadmap.sh/react' },
        ],
      },
      {
        stepNumber: 4,
        stepTitle: 'Step 4: Relational Databases & SQL',
        items: [
          { id: 'jfs-4-1', title: 'SQL & Database Design (PostgreSQL / MySQL)', desc: 'DDL, DML, JOINS, Subqueries, Indexing, Transactions & Normalization', difficulty: 'Intermediate', resourceName: 'roadmap.sh/sql', resourceUrl: 'https://roadmap.sh/sql' },
        ],
      },
      {
        stepNumber: 5,
        stepTitle: 'Step 5: Backend Development with Spring Boot',
        items: [
          { id: 'jfs-5-1', title: 'Spring Framework Core', desc: 'Inversion of Control (IoC), Dependency Injection (DI), Spring Beans', difficulty: 'Intermediate', resourceName: 'spring.io Guides', resourceUrl: 'https://spring.io/guides' },
          { id: 'jfs-5-2', title: 'Spring Boot REST APIs', desc: '@RestController, Request Mapping, DTO Mapping, Response Entities', difficulty: 'Intermediate', resourceName: 'spring.io Guides', resourceUrl: 'https://spring.io/guides' },
          { id: 'jfs-5-3', title: 'Spring Data JPA & Hibernate', desc: '@Entity, Repositories, JPQL, Entity Relationships (@OneToMany, @ManyToMany)', difficulty: 'Intermediate', resourceName: 'spring.io Guides', resourceUrl: 'https://spring.io/guides' },
        ],
      },
      {
        stepNumber: 6,
        stepTitle: 'Step 6: Security, Microservices & DevOps',
        items: [
          { id: 'jfs-6-1', title: 'Spring Security & JWT Authentication', desc: 'Authentication, Authorization, Role-based access control, JWT tokens', difficulty: 'Advanced', resourceName: 'spring.io Security', resourceUrl: 'https://spring.io/projects/spring-security' },
          { id: 'jfs-6-2', title: 'Microservices Architecture', desc: 'Spring Cloud, Eureka Discovery Server, API Gateway, Feign Client', difficulty: 'Advanced', resourceName: 'spring.io Microservices', resourceUrl: 'https://spring.io/' },
          { id: 'jfs-6-3', title: 'Docker, Git & Cloud Deployment', desc: 'Git Workflow, Maven build automation, Docker Containerization, AWS/Render deployment', difficulty: 'Advanced', resourceName: 'roadmap.sh/devops', resourceUrl: 'https://roadmap.sh/devops' },
        ],
      },
    ],
  },

  mernStack: {
    id: 'mernStack',
    title: 'MERN Stack Developer',
    subtitle: 'Comprehensive path covering MongoDB, Express.js, React.js & Node.js ecosystem',
    source: 'roadmap.sh / Fullstack Track',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    accentColor: '#10B981',
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Step 1: Web Foundations & Modern JavaScript',
        items: [
          { id: 'mern-1-1', title: 'HTML5 & Semantic Web', desc: 'Semantic tags, Accessibility (a11y), Forms & Validation', difficulty: 'Beginner', resourceName: 'roadmap.sh/javascript', resourceUrl: 'https://roadmap.sh/javascript' },
          { id: 'mern-1-2', title: 'CSS3 & Modern Layouts', desc: 'Flexbox, CSS Grid, Responsive Web Design, Tailwind CSS', difficulty: 'Beginner', resourceName: 'roadmap.sh/css', resourceUrl: 'https://roadmap.sh/css' },
          { id: 'mern-1-3', title: 'Modern JavaScript (ES6+)', desc: 'Arrow Functions, Destructuring, Spread/Rest, Modules, Closures, Async/Await', difficulty: 'Intermediate', resourceName: 'roadmap.sh/javascript', resourceUrl: 'https://roadmap.sh/javascript' },
        ],
      },
      {
        stepNumber: 2,
        stepTitle: 'Step 2: React.js Core & Component Design',
        items: [
          { id: 'mern-2-1', title: 'React Basics & JSX', desc: 'Virtual DOM, Components, Props, Rendering Lists & Conditionals', difficulty: 'Intermediate', resourceName: 'react.dev Official', resourceUrl: 'https://react.dev' },
          { id: 'mern-2-2', title: 'React Hooks Deep Dive', desc: 'useState, useEffect, useRef, useMemo, useCallback, Custom Hooks', difficulty: 'Intermediate', resourceName: 'react.dev Official', resourceUrl: 'https://react.dev' },
          { id: 'mern-2-3', title: 'React Router & State Management', desc: 'React Router v6, Context API, Redux Toolkit or Zustand', difficulty: 'Intermediate', resourceName: 'react.dev Official', resourceUrl: 'https://react.dev' },
        ],
      },
      {
        stepNumber: 3,
        stepTitle: 'Step 3: Node.js & Express.js Backend',
        items: [
          { id: 'mern-3-1', title: 'Node.js Core Concepts', desc: 'Event Loop, Event Emitter, File System (fs), NPM Package Manager', difficulty: 'Intermediate', resourceName: 'nodejs.org Docs', resourceUrl: 'https://nodejs.org' },
          { id: 'mern-3-2', title: 'Express.js Framework', desc: 'RESTful API Architecture, Middleware Functions, Routing, Error Handling', difficulty: 'Intermediate', resourceName: 'expressjs.com', resourceUrl: 'https://expressjs.com' },
        ],
      },
      {
        stepNumber: 4,
        stepTitle: 'Step 4: MongoDB Database & Mongoose',
        items: [
          { id: 'mern-4-1', title: 'MongoDB & NoSQL Concepts', desc: 'Document Storage, Collections, BSON format, CRUD Operations', difficulty: 'Intermediate', resourceName: 'mongodb.com Docs', resourceUrl: 'https://mongodb.com' },
          { id: 'mern-4-2', title: 'Mongoose ODM', desc: 'Schemas, Models, Data Validation, Middleware Hooks, Population', difficulty: 'Intermediate', resourceName: 'mongoosejs.com', resourceUrl: 'https://mongoosejs.com' },
          { id: 'mern-4-3', title: 'Advanced Queries & Aggregation', desc: 'Aggregation Pipelines, Indexing for Performance, Transactions', difficulty: 'Advanced', resourceName: 'mongodb.com Docs', resourceUrl: 'https://mongodb.com' },
        ],
      },
      {
        stepNumber: 5,
        stepTitle: 'Step 5: Authentication, Security & Deployment',
        items: [
          { id: 'mern-5-1', title: 'JWT Auth & Security Best Practices', desc: 'JSON Web Tokens, bcrypt password hashing, CORS, Helmet, Rate Limiting', difficulty: 'Advanced', resourceName: 'roadmap.sh/backend', resourceUrl: 'https://roadmap.sh/backend' },
          { id: 'mern-5-2', title: 'Full Stack Integration & Deployment', desc: 'Connecting React to Express REST API, Vercel/Render hosting, MongoDB Atlas Cloud, Docker', difficulty: 'Advanced', resourceName: 'roadmap.sh/full-stack', resourceUrl: 'https://roadmap.sh/full-stack' },
        ],
      },
    ],
  },
};

export const RoadmapPage: React.FC = () => {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('dsa');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const currentRoadmap = ROADMAPS[selectedRoadmapId];

  const toggleItemCompletion = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleStepExpand = (stepNumber: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  // Calculate overall progress for current roadmap
  const allItemsInCurrent = currentRoadmap.steps.flatMap(s => s.items);
  const completedCount = allItemsInCurrent.filter(item => completedItems[item.id]).length;
  const progressPercent = allItemsInCurrent.length > 0 ? Math.round((completedCount / allItemsInCurrent.length) * 100) : 0;

  const getDiffBadgeStyle = (diff: string) => {
    if (diff === 'Beginner') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (diff === 'Intermediate') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] select-none bg-[#060912] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-[1140px] mx-auto px-5 py-6 space-y-6 relative z-10">

        {/* ── HEADER BANNER ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#131B36] to-[#0D1326] border border-white/[0.08] rounded-2xl p-5 lg:p-6 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold text-indigo-300">
                <Map className="w-3.5 h-3.5 text-indigo-400" />
                <span>Structured Career Paths</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                Developer Roadmaps
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-xs lg:text-sm font-medium max-w-2xl leading-relaxed">
                Step-by-step learning guides extracted from leading industry resources like <strong className="text-white">takeUforward</strong> and <strong className="text-white">roadmap.sh</strong>.
              </p>
            </div>

            {/* Dynamic Progress Indicator */}
            <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 min-w-[220px] shadow-md flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-400 uppercase tracking-wider">Track Progress</span>
                <span className="text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between pt-0.5">
                <span>{completedCount} of {allItemsInCurrent.length} completed</span>
                {progressPercent === 100 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* ── ROADMAP TAB SELECTOR ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 dash-card border border-dash-border rounded-2xl">
          {[
            { id: 'dsa', name: 'DSA Roadmap', tag: 'takeUforward' },
            { id: 'javaFullStack', name: 'Java Full Stack', tag: 'Spring Boot' },
            { id: 'mernStack', name: 'MERN Stack', tag: 'React & Node' },
          ].map(tab => {
            const isActive = selectedRoadmapId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedRoadmapId(tab.id)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 border ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-600/25 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-white/[0.03] border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06]'
                }`}
              >
                <Layers className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{tab.name}</span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'}`}>
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── ROADMAP CONTENT DETAILS ── */}
        <div className="space-y-4">
          {/* Active Roadmap Title & Source Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 border border-white/[0.06] rounded-2xl p-4 px-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{currentRoadmap.title}</h2>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${currentRoadmap.badgeColor}`}>
                  {currentRoadmap.source}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{currentRoadmap.subtitle}</p>
            </div>

            <button
              onClick={() => {
                const newExpand: Record<number, boolean> = {};
                currentRoadmap.steps.forEach(s => { newExpand[s.stepNumber] = true; });
                setExpandedSteps(newExpand);
              }}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
            >
              Expand All Steps
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {currentRoadmap.steps.map(step => {
              const isExpanded = expandedSteps[step.stepNumber] ?? true;
              const stepCompletedCount = step.items.filter(i => completedItems[i.id]).length;
              const isStepDone = stepCompletedCount === step.items.length && step.items.length > 0;

              return (
                <div
                  key={step.stepNumber}
                  className="bg-[#0C1222]/90 border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
                >
                  {/* Step Header Accordion Toggle */}
                  <div
                    onClick={() => toggleStepExpand(step.stepNumber)}
                    className="p-4 px-5 bg-slate-900/60 hover:bg-slate-900/90 cursor-pointer flex items-center justify-between gap-4 transition-colors border-b border-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center ${
                        isStepDone ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {step.stepNumber}
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{step.stepTitle}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-lg border border-white/[0.06]">
                        {stepCompletedCount} / {step.items.length} done
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Step Items Table / List */}
                  {isExpanded && (
                    <div className="p-3 lg:p-4 divide-y divide-white/[0.04]">
                      {step.items.map(item => {
                        const isDone = completedItems[item.id] ?? false;
                        return (
                          <div
                            key={item.id}
                            className={`py-3 px-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                              isDone ? 'bg-emerald-500/[0.03]' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            {/* Left: Checkbox + Title + Desc */}
                            <div className="flex items-start gap-3 flex-1">
                              <button
                                onClick={() => toggleItemCompletion(item.id)}
                                className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </button>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                                    {item.title}
                                  </span>
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${getDiffBadgeStyle(item.difficulty)}`}>
                                    {item.difficulty}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                              </div>
                            </div>

                            {/* Right: Resource Link */}
                            <a
                              href={item.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="self-start sm:self-center flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-xl transition-all flex-shrink-0"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{item.resourceName}</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoadmapPage;
