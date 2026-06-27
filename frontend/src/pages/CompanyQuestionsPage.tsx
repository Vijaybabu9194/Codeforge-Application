import React, { useState, useEffect, useMemo } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Code2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CompanyLogo } from '../components/CompanyLogos';

import CompanyDashboard from '../components/companies/CompanyDashboard';
import CompanyQuestionTable from '../components/companies/CompanyQuestionTable';

interface CompanyListItem {
  id: number;
  name: string;
  logoUrl: string;
  totalQuestions: number;
  hiringTrend: string;
}

interface CompanyDetail {
  id: number;
  name: string;
  logoUrl: string;
  totalQuestions: number;
  hiringTrend: string;
  interviewFrequency: number;
  difficultyDistribution: Record<string, number>;
  topTopics: { topic: string; count: number }[];
}

interface CompanyQuestion {
  id: number;
  title: string;
  difficulty: string;
  timesAsked: number;
  frequency: string;
  acceptanceRate: number;
  solved: boolean;
  leetcodeUrl?: string;
  gfgUrl?: string;
}

const PINNED_COUNT = 7;
const ITEMS_PER_PAGE = 10;

export const CompanyQuestionsPage: React.FC = () => {
  const { updateUserStats } = useAuth();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null);
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showMoreCompanies, setShowMoreCompanies] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all companies list with instant local cache
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const cachedList = localStorage.getItem('cf_companies_list');
        if (cachedList) {
          const parsed = JSON.parse(cachedList);
          setCompanies(parsed);
          if (parsed.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(parsed[0].id);
          }
          setLoadingList(false);
        } else {
          setLoadingList(true);
        }

        const response = await api.get<CompanyListItem[]>('/companies');
        setCompanies(response.data);
        localStorage.setItem('cf_companies_list', JSON.stringify(response.data));
        if (response.data.length > 0 && !selectedCompanyId) {
          setSelectedCompanyId(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch company details and questions when selected company changes with instant cache
  useEffect(() => {
    if (!selectedCompanyId) return;
    setCurrentPage(1);
    const fetchCompanyData = async () => {
      try {
        const cacheKeyDetail = `cf_comp_detail_${selectedCompanyId}`;
        const cacheKeyQuestions = `cf_comp_questions_${selectedCompanyId}`;
        const cachedDetail = localStorage.getItem(cacheKeyDetail);
        const cachedQuestions = localStorage.getItem(cacheKeyQuestions);

        if (cachedDetail && cachedQuestions) {
          setCompanyDetail(JSON.parse(cachedDetail));
          setQuestions(JSON.parse(cachedQuestions));
          setLoadingDetail(false);
        } else {
          setLoadingDetail(true);
        }

        const [detailRes, questionsRes] = await Promise.all([
          api.get<CompanyDetail>(`/companies/${selectedCompanyId}`),
          api.get<CompanyQuestion[]>(`/companies/${selectedCompanyId}/problems`),
        ]);
        setCompanyDetail(detailRes.data);
        setQuestions(questionsRes.data);

        localStorage.setItem(cacheKeyDetail, JSON.stringify(detailRes.data));
        localStorage.setItem(cacheKeyQuestions, JSON.stringify(questionsRes.data));
      } catch (err) {
        console.error('Error fetching company details:', err);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchCompanyData();
  }, [selectedCompanyId]);

  const toggleSolved = async (id: number) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, solved: !q.solved } : q));
    try {
      await api.post(`/problems/${id}/solve`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to solve problem:', err);
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, solved: !q.solved } : q));
    }
  };

  const handleSelectCompany = (id: number) => {
    setSelectedCompanyId(id);
    setShowMoreCompanies(false);
  };

  // Pinned = first PINNED_COUNT companies; extras go in the "More" dropdown
  const pinnedCompanies = useMemo(() => companies.slice(0, PINNED_COUNT), [companies]);
  const extraCompanies = useMemo(() => companies.slice(PINNED_COUNT), [companies]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(questions.length / ITEMS_PER_PAGE));
  const pagedQuestions = useMemo(
    () => questions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [questions, currentPage]
  );

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

  // Close "More" on outside click
  useEffect(() => {
    const handler = () => setShowMoreCompanies(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div
      className="min-h-[calc(100vh-64px)] select-none bg-[#060912]"
      onClick={() => setShowMoreCompanies(false)}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">

        {/* ── PAGE HEADER ── */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Company Questions</h1>
          <p className="text-[#4A5580] text-sm mt-0.5 font-medium">
            Explore interview questions asked by top tech companies
          </p>
        </div>

        {/* ── COMPANY TABS ── */}
        <div className="space-y-3" onClick={e => e.stopPropagation()}>
          {/* Row 1: Pinned tabs + More button */}
          <div className="flex flex-wrap items-center gap-2">
            {loadingList ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-9 w-24 bg-white/[0.04] rounded-xl animate-pulse" />
              ))
            ) : (
              <>
                {pinnedCompanies.map(c => {
                  const isActive = selectedCompanyId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCompany(c.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        isActive
                          ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                          : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                        <CompanyLogo name={c.name} logoUrl={c.logoUrl} className="w-5 h-5" />
                      </span>
                      <span>{c.name}</span>
                      <span className={`text-[10px] font-black ml-0.5 ${isActive ? 'text-white/70' : 'text-[#4A5580]'}`}>
                        {c.totalQuestions}
                      </span>
                    </button>
                  );
                })}

                {/* More toggle button */}
                {extraCompanies.length > 0 && (
                  <button
                    onClick={e => { e.stopPropagation(); setShowMoreCompanies(v => !v); }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      showMoreCompanies || extraCompanies.some(c => c.id === selectedCompanyId)
                        ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                        : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    More ({extraCompanies.length})
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showMoreCompanies ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Row 2: Inline expanded companies — horizontal flex-wrap below Row 1 */}
          {!loadingList && showMoreCompanies && extraCompanies.length > 0 && (
            <div className="bg-[#0D1224]/50 border border-white/[0.06] rounded-2xl p-3">
              <p className="text-[9px] font-bold text-[#4A5580] uppercase tracking-wider mb-2 px-1">
                More Companies
              </p>
              <div className="flex flex-wrap gap-2">
                {extraCompanies.map(c => {
                  const isActive = selectedCompanyId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCompany(c.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                          : 'text-[#7B8AB8] hover:text-white hover:bg-white/[0.06] border border-white/[0.06] bg-[#0F1526]/50'
                      }`}
                    >
                      <span className="flex-shrink-0">
                        <CompanyLogo name={c.name} logoUrl={c.logoUrl} className="w-5 h-5" />
                      </span>
                      <span>{c.name}</span>
                      <span className={`text-[9px] font-black ml-0.5 ${isActive ? 'text-white/70' : 'text-[#4A5580]'}`}>
                        {c.totalQuestions}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        {loadingDetail || !companyDetail ? (
          <div className="space-y-5 animate-pulse">
            <div className="h-24 bg-[#0F1526] border border-white/[0.05] rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-5">
              <div className="h-44 bg-[#0F1526] border border-white/[0.05] rounded-2xl md:col-span-2" />
              <div className="h-44 bg-[#0F1526] border border-white/[0.05] rounded-2xl" />
            </div>
            <div className="bg-[#0F1526] border border-white/[0.05] rounded-2xl overflow-hidden">
              <div className="h-10 bg-white/[0.015] border-b border-white/[0.06]" />
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 border-b border-white/[0.04] bg-white/[0.01]" />
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] flex items-center justify-center animate-pulse">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#7B8AB8] text-sm font-semibold">Loading company data...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Company Dashboard */}
            <CompanyDashboard companyDetail={companyDetail} />

            {/* Questions Table (paginated slice) */}
            <CompanyQuestionTable
              questions={pagedQuestions}
              onSolveToggle={toggleSolved}
            />

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 py-2">
                {/* Info */}
                <p className="text-[11px] font-semibold text-[#4A5580]">
                  Showing{' '}
                  <span className="text-[#7B8AB8]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, questions.length)}</span>
                  {' '}of{' '}
                  <span className="text-[#7B8AB8]">{questions.length}</span>
                  {' '}questions
                </p>

                {/* Page buttons */}
                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPaginationNums().map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[#4A5580] text-xs font-bold">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          currentPage === p
                            ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/30'
                            : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default CompanyQuestionsPage;
