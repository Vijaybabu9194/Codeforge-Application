import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

import CompanySidebar from '../components/companies/CompanySidebar';
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
}

export const CompanyQuestionsPage: React.FC = () => {
  const { updateUserStats } = useAuth();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null);
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch all companies list
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingList(true);
        const response = await api.get<CompanyListItem[]>('/companies');
        setCompanies(response.data);
        if (response.data.length > 0) {
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

  // Fetch company details and questions when selected company changes
  useEffect(() => {
    if (!selectedCompanyId) return;

    const fetchCompanyData = async () => {
      try {
        setLoadingDetail(true);
        const [detailRes, questionsRes] = await Promise.all([
          api.get<CompanyDetail>(`/companies/${selectedCompanyId}`),
          api.get<CompanyQuestion[]>(`/companies/${selectedCompanyId}/problems`)
        ]);
        setCompanyDetail(detailRes.data);
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error('Error fetching company details:', err);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchCompanyData();
  }, [selectedCompanyId]);

  const toggleSolved = async (id: number) => {
    try {
      // Optimistic update
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, solved: !q.solved } : q));
      await api.post(`/problems/${id}/solve`);
      updateUserStats();
    } catch (err) {
      console.error('Failed to solve problem:', err);
    }
  };

  // Filter companies list by query
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] select-none">
      {/* LEFT SIDEBAR: COMPANIES */}
      <CompanySidebar
        companies={filteredCompanies}
        selectedCompanyId={selectedCompanyId}
        onCompanySelect={setSelectedCompanyId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loadingList={loadingList}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-[#FAFBFC] p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-64px)]">
        {loadingDetail || !companyDetail ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-20 bg-white border border-border rounded-premium" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="h-44 bg-white border border-border rounded-premium md:col-span-2" />
              <div className="h-44 bg-white border border-border rounded-premium" />
            </div>
            <div className="h-64 bg-white border border-border rounded-premium" />
          </div>
        ) : (
          <>
            {/* COMPANY STATS AND CHARTS */}
            <CompanyDashboard companyDetail={companyDetail} />

            {/* COMPANY QUESTIONS TABLE */}
            <CompanyQuestionTable
              questions={questions}
              onSolveToggle={toggleSolved}
            />
          </>
        )}
      </main>
    </div>
  );
};
export default CompanyQuestionsPage;
