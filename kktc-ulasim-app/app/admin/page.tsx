import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/StatsCard';
import SkeletonCard from '@/components/admin/SkeletonCard';
import { Bus, AlertTriangle, MapPin, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ReportWithSchedule } from '@/types';

async function getStats() {
  const supabase = await createClient();

  const [schedulesRes, reportsRes, stopsRes, companiesRes] = await Promise.all([
    supabase.from('schedules').select('id', { count: 'exact', head: true }),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('is_resolved', false),
    supabase.from('stops').select('id', { count: 'exact', head: true }),
    supabase.from('companies').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalSchedules: schedulesRes.count || 0,
    pendingReports: reportsRes.count || 0,
    totalStops: stopsRes.count || 0,
    totalCompanies: companiesRes.count || 0,
  };
}

async function getRecentReports() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reports')
    .select(
      `
      *,
      schedules!inner(
        id,
        departure_time,
        routes!inner(
          id,
          origin,
          destination,
          companies!inner(
            name
          )
        )
      )
    `
    )
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }

  return data as ReportWithSchedule[];
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

async function StatsContent() {
  const stats = await getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Toplam Sefer"
        value={stats.totalSchedules}
        icon={Bus}
        color="blue"
      />
      <StatsCard
        title="Bekleyen Raporlar"
        value={stats.pendingReports}
        icon={AlertTriangle}
        color="red"
        href="/admin/reports"
      />
      <StatsCard
        title="Kayıtlı Duraklar"
        value={stats.totalStops}
        icon={MapPin}
        color="green"
      />
      <StatsCard
        title="Toplam Şirket"
        value={stats.totalCompanies}
        icon={Building2}
        color="purple"
      />
    </div>
  );
}

function RecentReportsTable() {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function RecentReportsContent() {
  const reports = await getRecentReports();

  const issueTypeLabels: Record<string, string> = {
    time_issue: 'Saat Sorunu',
    canceled: 'İptal Edildi',
    crowded: 'Kalabalık',
    other: 'Diğer',
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Son Gelen Raporlar
        </h2>
        <Link
          href="/admin/reports"
          className="group flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Tümünü Gör
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">
            Rapor Bulunmuyor
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Şu anda bekleyen herhangi bir bildirim yok.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tarih/Saat
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sefer Bilgisi
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sorun Türü
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(report.created_at).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-8 py-5 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {report.schedules.routes.origin} →{' '}
                      {report.schedules.routes.destination}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                        {report.schedules.routes.companies.name}
                      </span>
                      <span>•</span>
                      <span>{report.schedules.departure_time}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      {issueTypeLabels[report.issue_type] || report.issue_type}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      Bekliyor
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function AdminDashboard() {
  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Sistem genel durumu ve bekleyen işlemler
        </p>
      </div>

      <Suspense fallback={<StatsGrid />}>
        <StatsContent />
      </Suspense>

      <Suspense fallback={<RecentReportsTable />}>
        <RecentReportsContent />
      </Suspense>
    </div>
  );
}
