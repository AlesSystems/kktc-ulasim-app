'use client';

import { useState } from 'react';
import { ScheduleResult } from '@/src/types';
import ReportModal from './ReportModal';
import ScheduleTimer from './ScheduleTimer';

interface ResultsCardProps {
  results: ScheduleResult[];
  isLoading: boolean;
  origin: string;
  destination: string;
}

export default function ResultsCard({ results, isLoading, origin, destination }: ResultsCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResult | null>(null);

  const handleReportClick = (schedule: ScheduleResult) => {
    setSelectedSchedule(schedule);
    setIsReportModalOpen(true);
  };
  if (!origin || !destination) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4 md:bottom-auto z-[1000] w-full md:w-96 max-h-[60vh] md:max-h-[80vh] overflow-y-auto">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          {origin} → {destination}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-400">Seferler yükleniyor...</p>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Bu güzergah için sefer bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <ScheduleTimer time={result.saat} />
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {result.firma_adi}
                    </div>
                  </div>
                  <div className="text-right">
                    {result.fiyat !== null ? (
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₺{result.fiyat.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        Fiyat bilgisi yok
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleReportClick(result)}
                    className="p-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                    title="Hata Bildir"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            Toplam {results.length} sefer bulundu
          </p>
        </div>
      </div>

      {selectedSchedule && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedSchedule(null);
          }}
          scheduleId={selectedSchedule.schedule_id}
          routeInfo={`${selectedSchedule.firma_adi} - ${selectedSchedule.saat} (${selectedSchedule.kalkis_yeri} → ${selectedSchedule.varis_yeri})`}
        />
      )}
    </div>
  );
}
