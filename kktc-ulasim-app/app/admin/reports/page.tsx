import { createClient } from '@/lib/supabase/server';
import ReportsTable from '@/components/admin/ReportsTable';
import { FileText } from 'lucide-react';
import type { ReportWithSchedule } from '@/types';

async function getReports() {
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
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }

  return data as ReportWithSchedule[];
}

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-7 h-7 mr-3" />
            Gelen Raporlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kullanıcılardan gelen sefer raporları
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {reports.length}
          </span>{' '}
          bekleyen rapor
        </div>
      </div>

      <ReportsTable initialReports={reports} />
    </div>
  );
}
