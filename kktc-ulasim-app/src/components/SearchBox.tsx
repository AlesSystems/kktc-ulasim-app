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
    <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Sefer Ara
        </h2>
        
        <div className="space-y-4">
          {/* Nereden */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Nereden?
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              disabled={loadingLocations || isLoading}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Kalkış yeri seçin</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Nereye */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Nereye?
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={loadingLocations || isLoading}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Varış yeri seçin</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Buton */}
          <button
            onClick={handleSearch}
            disabled={!origin || !destination || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aranıyor...
              </span>
            ) : (
              'Sefer Bul'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
