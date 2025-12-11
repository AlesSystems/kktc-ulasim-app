import { supabase } from '@/src/lib/supabaseClient';
import { Route } from '@/src/types';

async function getRoutes() {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      companies (*)
    `)
    .order('route_name', { ascending: true });

  if (error) {
    console.error('Error fetching routes:', error);
    return null;
  }

  return data as Route[];
}

export default async function Home() {
  const routes = await getRoutes();

  if (!routes || routes.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
            KKTC Ulaşım Hatları
          </h1>
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {!routes ? 'Veriler yüklenirken bir hata oluştu.' : 'Henüz kayıtlı hat bulunmamaktadır.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          KKTC Ulaşım Hatları
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => {
            // Route'dan companies'ı çıkarıp sadece route bilgilerini al
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { companies: _companies, id: _id, ...routeData } = route;
            
            return (
              <div
                key={route.id}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-zinc-200 dark:border-zinc-700"
              >
                {/* Route Number Badge */}
                {route.route_number && (
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                      {route.route_number}
                    </span>
                  </div>
                )}
                
                {/* Route Name */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 line-clamp-2">
                  {route.route_name || 'İsimsiz Hat'}
                </h3>
                
                {/* Route Bilgileri */}
                <div className="space-y-2 mb-4">
                  {Object.entries(routeData).map(([key, value]) => {
                    // companies, id, route_name, route_number zaten gösteriliyor, onları atla
                    if (key === 'companies' || key === 'id' || key === 'route_name' || key === 'route_number' || key === 'company_id') {
                      return null;
                    }
                    
                    // Boş değerleri atla
                    if (value === null || value === undefined || value === '') {
                      return null;
                    }
                    
                    // Tarih formatını düzenle
                    let displayValue = value;
                    if (key.includes('date') || key.includes('created_at') || key.includes('updated_at')) {
                      try {
                        displayValue = new Date(value as string).toLocaleDateString('tr-TR');
                      } catch {
                        displayValue = value;
                      }
                    }
                    
                    return (
                      <div key={key} className="flex justify-between items-start py-1">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 text-right ml-4">
                          {String(displayValue)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Company Info - Tüm Bilgiler */}
                {route.companies && (
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                      İşletmeci Bilgileri
                    </p>
                    <div className="space-y-2">
                      {Object.entries(route.companies).map(([key, value]) => {
                        // id zaten key olarak kullanılıyor, onu atla
                        if (key === 'id') {
                          return null;
                        }
                        
                        // Boş değerleri atla
                        if (value === null || value === undefined || value === '') {
                          return null;
                        }
                        
                        // Tarih formatını düzenle
                        let displayValue = value;
                        if (key.includes('date') || key.includes('created_at') || key.includes('updated_at')) {
                          try {
                            displayValue = new Date(value as string).toLocaleDateString('tr-TR');
                          } catch {
                            displayValue = value;
                          }
                        }
                        
                        return (
                          <div key={key} className="flex justify-between items-start py-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-right ml-4">
                              {String(displayValue)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
