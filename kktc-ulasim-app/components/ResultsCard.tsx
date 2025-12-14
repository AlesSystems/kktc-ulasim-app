'use client';

import { useState } from 'react';
import { ScheduleResult } from '@/types';
import ReportModal from './ReportModal';
import ScheduleTimer from './ScheduleTimer';

interface ResultsCardProps {
  results: ScheduleResult[];
  isLoading: boolean;
  origin: string;
  destination: string;
  className?: string;
}

export default function ResultsCard({ results, isLoading, origin, destination, className }: ResultsCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResult | null>(null);

  const handleReportClick = (schedule: ScheduleResult) => {
    setSelectedSchedule(schedule);
    setIsReportModalOpen(true);
  };
  if (!origin || !destination) {
    return null;
  }

  const containerClasses = className || "absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4 md:bottom-auto z-[1000] w-[calc(100%-2rem)] md:w-96 max-h-[60vh] md:max-h-[80vh]";

  return (
    <div className={`${containerClasses} overflow-hidden flex flex-col`}>
      <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col max-h-full border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Sefer Sonuçları
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {origin} → {destination}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium animate-pulse">Seferler aranıyor...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold mb-1">Sefer Bulunamadı</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[200px]">
                Bu güzergah için şu anda aktif sefer bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <ScheduleTimer time={result.saat} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {result.firma_adi}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {result.fiyat !== null ? (
                        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <span className="text-lg font-bold text-green-700 dark:text-green-400">
                            ₺{result.fiyat.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                          Fiyat yok
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleReportClick(result)}
                        className="text-xs font-medium text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Hata Bildir"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Bildir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
              Toplam <strong className="text-zinc-700 dark:text-zinc-300">{results.length}</strong> sefer bulundu
            </p>
          </div>
        )}
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
