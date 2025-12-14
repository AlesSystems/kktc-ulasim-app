'use client';

import { useState } from 'react';
import { Archive, Clock, CheckCircle } from 'lucide-react';
import type { ReportWithSchedule } from '@/types';

interface ReportsTableProps {
  initialReports: ReportWithSchedule[];
}

const issueTypeLabels: Record<string, string> = {
  time_issue: 'Saat Sorunu',
  canceled: 'İptal Edildi',
  crowded: 'Kalabalık',
  other: 'Diğer',
};

export default function ReportsTable({ initialReports }: ReportsTableProps) {
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState<string | null>(null);

  const handleArchive = async (reportId: string) => {
    setLoading(reportId);
    
    try {
      const response = await fetch('/api/admin/reports/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }),
      });

      if (response.ok) {
        setReports(reports.filter((r) => r.id !== reportId));
      } else {
        alert('Arşivleme başarısız');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-16 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Bekleyen rapor yok
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Tüm raporlar çözümlendi veya arşivlendi.
        </p>
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
                Tarih/Saat
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sefer Bilgisi
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sorun Türü
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                İşlemler
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
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(report.created_at).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {report.schedules.routes.origin} →{' '}
                    {report.schedules.routes.destination}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {report.schedules.routes.companies.name} •{' '}
                    {report.schedules.departure_time}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
                    {issueTypeLabels[report.issue_type] || report.issue_type}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                  <span title={report.description} className="cursor-help border-b border-dotted border-gray-400">
                    {report.description}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleArchive(report.id)}
                    disabled={loading === report.id}
                    className="inline-flex items-center px-4 py-2 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {loading === report.id ? 'İşleniyor...' : 'Çözüldü'}
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
