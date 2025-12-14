'use client';

import { useState } from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import type { ScheduleWithRoute } from '@/types';

interface SchedulesTableProps {
  initialSchedules: ScheduleWithRoute[];
}

export default function SchedulesTable({
  initialSchedules,
}: SchedulesTableProps) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Bu seferi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(scheduleId);

    try {
      const response = await fetch('/api/admin/schedules/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleId }),
      });

      if (response.ok) {
        setSchedules(schedules.filter((s) => s.id !== scheduleId));
      } else {
        alert('Silme başarısız');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-16 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Kayıtlı sefer bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200/50 dark:border-gray-700/50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rota
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Firma
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kalkış Saati
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {schedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td className="px-8 py-5 text-sm text-gray-900 dark:text-gray-300">
                  <div className="font-medium">
                    {schedule.routes.origin} → {schedule.routes.destination}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {schedule.routes.route_name}
                    {schedule.routes.route_number &&
                      ` • Hat ${schedule.routes.route_number}`}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {schedule.routes.companies.name}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-mono bg-gray-50/50 dark:bg-gray-800/50 rounded px-2 w-min">
                  {schedule.departure_time}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                  {schedule.price ? `${schedule.price} TL` : '-'}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    disabled={loading === schedule.id}
                    className="inline-flex items-center px-4 py-2 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {loading === schedule.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
