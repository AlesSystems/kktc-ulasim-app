'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MapPin,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Gelen Raporlar',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    label: 'Sefer Yönetimi',
    href: '/admin/schedules',
    icon: Calendar,
  },
  {
    label: 'Durak Yönetimi',
    href: '/admin/stops',
    icon: MapPin,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-gray-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-40">
        <div className="flex flex-col flex-grow bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-8 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                  KKTC Ulaşım
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Yönetim Paneli
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1">
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Menü
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                  }`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 px-4 py-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">K</span>
                </div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  KKTC Ulaşım
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-shrink-0 px-4 py-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {menuItems.find(item => item.href === pathname)?.label || 'Yönetim Paneli'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Add user profile or notifications here if needed in future */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
