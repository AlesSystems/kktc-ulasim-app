'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import SearchBox from '@/src/components/SearchBox';
import ResultsCard from '@/src/components/ResultsCard';
import { getSchedules } from '@/src/lib/supabaseClient';
import { ScheduleResult } from '@/src/types';

const Map = dynamic(() => import('@/src/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Harita Yükleniyor...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [schedules, setSchedules] = useState<ScheduleResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');

  const handleSearch = async (origin: string, destination: string) => {
    setIsSearching(true);
    setSearchOrigin(origin);
    setSearchDestination(destination);
    
    const results = await getSchedules(origin, destination);
    setSchedules(results);
    setIsSearching(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white dark:bg-zinc-800 shadow-md z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            KKTC Ulaşım
          </h1>
        </div>
      </nav>
      
      {/* Map */}
      <div className="flex-1 relative">
        <Map />
        <SearchBox onSearch={handleSearch} isLoading={isSearching} />
        {(searchOrigin && searchDestination) && (
          <ResultsCard 
            results={schedules} 
            isLoading={isSearching}
            origin={searchOrigin}
            destination={searchDestination}
          />
        )}
      </div>
    </div>
  );
}
