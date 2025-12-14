'use client';

import { useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';

export default function Home() {
  const router = useRouter();

  const handleSearch = (origin: string, destination: string) => {
    router.push(`/results?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-1/4 w-[50rem] h-[50rem] bg-indigo-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
               KKTC Ulaşım
             </h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 pb-20">
        <div className="w-full max-w-4xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 border border-blue-100 dark:border-blue-800/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Kuzey Kıbrıs&apos;ın Akıllı Ulaşım Asistanı
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
            Yolculuğun <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">En Akıllı Yolu</span>
          </h2>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Tüm otobüs seferlerini tek yerden sorgula, güzergahları karşılaştır ve saniyeler içinde rotanı oluştur.
          </p>
        </div>

        <div className="w-full max-w-md relative">
           {/* Center SearchBox */}
           <SearchBox 
             onSearch={handleSearch} 
             className="relative w-full transform hover:scale-[1.02] transition-transform duration-500"
           />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} KKTC Ulaşım. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
