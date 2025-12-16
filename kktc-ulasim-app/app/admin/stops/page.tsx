import { createClient } from '@/lib/supabase/server';
import StopsTable from '@/components/admin/StopsTable';
import { MapPin } from 'lucide-react';
import type { Stop } from '@/types';

async function getStops() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stops')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching stops:', error);
    return [];
  }

  return data as Stop[];
}

export default async function StopsPage() {
  const stops = await getStops();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <MapPin className="w-7 h-7 mr-3" />
            Durak Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Durakları görüntüle ve yönet
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {stops.length}
          </span>{' '}
          durak
        </div>
      </div>

      <StopsTable initialStops={stops} />
    </div>
  );
}
