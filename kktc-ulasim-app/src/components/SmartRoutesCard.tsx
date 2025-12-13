'use client';

import { useState } from 'react';
import { SmartRoute } from '@/src/types';
import ReportModal from './ReportModal';

interface SmartRoutesCardProps {
  routes: SmartRoute[];
  isLoading: boolean;
  origin: string;
  destination: string;
  className?: string;
}

export default function SmartRoutesCard({ routes, isLoading, origin, destination, className }: SmartRoutesCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [selectedRouteInfo, setSelectedRouteInfo] = useState<string>('');

  const handleReportClick = (scheduleId: string, routeInfo: string) => {
    setSelectedScheduleId(scheduleId);
    setSelectedRouteInfo(routeInfo);
    setIsReportModalOpen(true);
  };

  if (!origin || !destination) {
    return null;
  }

  const containerClasses = className || "absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4 md:bottom-auto z-[1000] w-[calc(100%-2rem)] md:w-[28rem] max-h-[60vh] md:max-h-[80vh]";

  return (
    <div className={`${containerClasses} overflow-hidden flex flex-col`}>
      <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col max-h-full border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Akıllı Rota Planlayıcı
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
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium animate-pulse">Rotalar hesaplanıyor...</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold mb-1">Rota Bulunamadı</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                Bu güzergah için şu anda uygun bir rota bulunmuyor. Farklı bir saat veya gün deneyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route, routeIndex) => (
                <div
                  key={routeIndex}
                  className="group bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {route.route_type === 'direct' ? (
                        <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Direkt
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          {route.legs.length} Bacak
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/25">
                        <span className="text-base font-bold text-white">
                          ₺{route.total_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route Legs */}
                  <div className="space-y-2">
                    {route.legs.map((leg, legIndex) => (
                      <div key={legIndex}>
                        {/* Leg Card */}
                        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-lg p-3 border border-zinc-200/50 dark:border-zinc-700/30">
                          <div className="flex items-start justify-between gap-3">
                            {/* Left: Route Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full">
                                  {leg.leg_number}
                                </span>
                                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                  {leg.from} → {leg.to}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                  {leg.departure_time.substring(0, 5)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                  {leg.company}
                                </span>
                              </div>
                            </div>

                            {/* Right: Price & Actions */}
                            <div className="flex flex-col items-end gap-1.5">
                              <div className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                  ₺{leg.price.toFixed(2)}
                                </span>
                              </div>
                              <button
                                onClick={() => handleReportClick(leg.schedule_id, `${leg.company} - ${leg.departure_time.substring(0, 5)} (${leg.from} → ${leg.to})`)}
                                className="text-xs font-medium text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors px-1.5 py-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                title="Hata Bildir"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Transfer Indicator */}
                        {legIndex < route.legs.length - 1 && (
                          <div className="flex items-center gap-2 py-2 px-3">
                            <div className="flex-1 flex items-center gap-2">
                              <div className="h-px flex-1 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300"></div>
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                <svg className="w-3 h-3 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                                  {route.wait_time_minutes} dk bekleme
                                </span>
                                <span className="text-xs text-orange-600 dark:text-orange-500">
                                  @ {route.transfer_point}
                                </span>
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {routes.length > 0 && (
          <div className="p-3 border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">
                Toplam <strong className="text-zinc-700 dark:text-zinc-300">{routes.length}</strong> rota
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                <strong className="text-zinc-700 dark:text-zinc-300">{routes.filter(r => r.route_type === 'direct').length}</strong> direkt,{' '}
                <strong className="text-zinc-700 dark:text-zinc-300">{routes.filter(r => r.route_type === 'transfer').length}</strong> aktarmalı
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedScheduleId && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedScheduleId('');
            setSelectedRouteInfo('');
          }}
          scheduleId={selectedScheduleId}
          routeInfo={selectedRouteInfo}
        />
      )}
    </div>
  );
}
