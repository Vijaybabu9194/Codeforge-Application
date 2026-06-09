import { useState, useEffect } from 'react';
import { companiesApi } from '@/lib/api';
import CompanySidebar from '@/components/companies/CompanySidebar';
import CompanyDashboard from '@/components/companies/CompanyDashboard';
import CompanyQuestionTable from '@/components/companies/CompanyQuestionTable';

export default function CompanyQuestionsPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    companiesApi.getAll()
      .then((res) => {
        setCompanies(res.data);
        if (res.data.length > 0) setSelectedId(res.data[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    Promise.all([companiesApi.getDetail(selectedId), companiesApi.getProblems(selectedId)])
      .then(([d, q]) => {
        setDetail(d.data);
        setQuestions(q.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div className="flex gap-6 -mx-6 -mt-8 min-h-[calc(100vh-80px)]">
      <CompanySidebar
        companies={companies}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        companySearch={companySearch}
        setCompanySearch={setCompanySearch}
      />

      {/* Main content area */}
      <div className="flex-1 px-6 py-8">
        <CompanyDashboard detail={detail} loading={loading} />
        <CompanyQuestionTable questions={questions} loading={loading} />
      </div>
    </div>
  );
}

