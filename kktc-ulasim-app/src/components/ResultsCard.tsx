'use client';

import { ScheduleResult } from '@/src/types';

interface ResultsCardProps {
  results: ScheduleResult[];
  isLoading: boolean;
  origin: string;
  destination: string;
}

export default function ResultsCard({ results, isLoading, origin, destination }: ResultsCardProps) {
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {result.saat}
                    </div>
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
    </div>
  );
}
