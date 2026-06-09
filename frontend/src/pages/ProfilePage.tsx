import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api';
import PlatformSidebar from '@/components/profile/PlatformSidebar';
import PlatformDashboard from '@/components/profile/PlatformDashboard';

export default function ProfilePage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('LEETCODE');
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.getPlatforms()
      .then((res) => setPlatforms(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    profileApi.getDashboard(selected)
      .then((res) => setDashboard(res.data))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="flex gap-6 -mx-6 -mt-8 min-h-[calc(100vh-80px)]">
      <PlatformSidebar
        platforms={platforms}
        selected={selected}
        setSelected={setSelected}
      />

      {/* Main content area */}
      <div className="flex-1 px-6 py-8">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-bg-secondary rounded-2xl" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64 bg-bg-secondary rounded-2xl" />
              <div className="h-64 bg-bg-secondary rounded-2xl" />
            </div>
          </div>
        ) : (
          <PlatformDashboard platform={selected} dashboard={dashboard} />
        )}
      </div>
    </div>
  );
}

