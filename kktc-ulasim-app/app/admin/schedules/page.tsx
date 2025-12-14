import { createClient } from '@/lib/supabase/server';
import SchedulesTable from '@/components/admin/SchedulesTable';
import { Calendar } from 'lucide-react';
import type { ScheduleWithRoute } from '@/types';

async function getSchedules() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      *,
      routes!inner(
        id,
        origin,
        destination,
        route_name,
        route_number,
        companies!inner(
          id,
          name
        )
      )
    `
    )
    .order('departure_time', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }

  return data as ScheduleWithRoute[];
}

export default async function SchedulesPage() {
  const schedules = await getSchedules();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-7 h-7 mr-3" />
            Sefer Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tüm seferleri görüntüle ve yönet
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {schedules.length}
          </span>{' '}
          sefer
        </div>
      </div>

      <SchedulesTable initialSchedules={schedules} />
    </div>
  );
}
