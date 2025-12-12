'use client';

import { useState, useEffect } from 'react';
import { getUniqueLocations } from '@/src/lib/supabaseClient';

interface SearchBoxProps {
  onSearch: (origin: string, destination: string) => void;
  isLoading?: boolean;
}

export default function SearchBox({ onSearch, isLoading = false }: SearchBoxProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      const locs = await getUniqueLocations();
      setLocations(locs);
      setLoadingLocations(false);
    }
    fetchLocations();
  }, []);

  const handleSearch = () => {
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] md:w-full md:max-w-sm">
      <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300 hover:shadow-blue-500/10">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          Sefer Ara
        </h2>
        
        <div className="space-y-4">
          {/* Nereden */}
          <div className="relative group">
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider ml-1">
              Nereden
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={loadingLocations || isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-white dark:hover:bg-zinc-800"
              >
                <option value="">Kalkış yeri seçin</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Nereye */}
          <div className="relative group">
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider ml-1">
              Nereye
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={loadingLocations || isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-white dark:hover:bg-zinc-800"
              >
                <option value="">Varış yeri seçin</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buton */}
          <button
            onClick={handleSearch}
            disabled={!origin || !destination || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-400 disabled:to-zinc-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Aranıyor...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Sefer Bul</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
