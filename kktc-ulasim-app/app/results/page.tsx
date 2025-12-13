'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import SmartRoutesCard from '@/src/components/SmartRoutesCard';
import { getSmartRoutes } from '@/src/lib/supabaseClient';
import { SmartRoute } from '@/src/types';

const Map = dynamic(() => import('@/src/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-xl">
      <div className="text-center">
         <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-solid border-blue-500 border-t-transparent mb-2"></div>
         <p className="text-zinc-500">Harita Yükleniyor...</p>
      </div>
    </div>
  ),
});

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  
  const [routes, setRoutes] = useState<SmartRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      if (!origin || !destination) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const now = new Date();
      const currentTime = now.toTimeString().substring(0, 8);
      const data = await getSmartRoutes(origin, destination, currentTime);
      setRoutes(data);
      setLoading(false);
    }
    
    fetchRoutes();
  }, [origin, destination]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Header / Nav */}
      <nav className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700 z-20 sticky top-0">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 cursor-pointer" onClick={() => router.push('/')}>
               KKTC Ulaşım
            </h1>
            <button 
              onClick={() => router.push('/')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Yeni Arama Yap
            </button>
         </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Column: Results List */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar h-full">
             <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 shrink-0">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                   <span>{origin}</span>
                   <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                   </svg>
                   <span>{destination}</span>
                </h2>
                <p className="text-sm text-zinc-500">Sefer Sonuçları</p>
             </div>
             
             <div className="relative flex-1">
                <SmartRoutesCard 
                  routes={routes} 
                  isLoading={loading} 
                  origin={origin} 
                  destination={destination}
                  className="w-full relative h-full !max-h-none !shadow-none !bg-transparent !border-0"
                />
             </div>
          </div>

          {/* Right Column: Map (Sticky) */}
          <div className="hidden lg:block h-full sticky top-4 bg-white rounded-2xl shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-700 relative z-0">
             <Map 
               startLocationName={origin} 
               endLocationName={destination} 
             />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

