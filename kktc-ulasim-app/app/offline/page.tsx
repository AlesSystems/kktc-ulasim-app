'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-blue-100 rounded-full p-6">
            {isOnline ? (
              <svg
                className="w-16 h-16 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isOnline ? 'Bağlantı Yeniden Kuruldu!' : 'İnternet Bağlantısı Yok'}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {isOnline
            ? 'İnternet bağlantınız yeniden kuruldu. Devam etmek için sayfayı yenileyebilirsiniz.'
            : 'Bu sayfayı görüntülemek için internet bağlantısına ihtiyacınız var. Lütfen bağlantınızı kontrol edin.'}
        </p>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              isOnline
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isOnline ? 'Sayfayı Yenile' : 'Bağlantı Bekleniyor...'}
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full py-3 px-6 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
          >
            Geri Dön
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">
            Bağlantı Sorunları İçin İpuçları:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Wi-Fi veya mobil veri bağlantınızı kontrol edin</li>
            <li>• Uçak modunu kapatın</li>
            <li>• Yönlendiricinizi yeniden başlatmayı deneyin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
