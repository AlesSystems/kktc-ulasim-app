import { createClient } from '@supabase/supabase-js';
import { ScheduleResult, SmartRoute } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSchedules(
  origin: string,
  destination: string
): Promise<ScheduleResult[]> {
  try {
    // Routes tablosundan origin ve destination ile eşleşen route'ları bul
    const { data: routes, error: routesError } = await supabase
      .from('routes')
      .select(`
        id,
        origin,
        destination,
        company_id,
        companies (
          name
        )
      `)
      .eq('origin', origin)
      .eq('destination', destination);

    if (routesError) {
      console.error('Error fetching routes:', routesError);
      return [];
    }

    if (!routes || routes.length === 0) {
      return [];
    }

    // Her route için schedules verilerini çek
    const results: ScheduleResult[] = [];
    
    for (const route of routes) {
      const { data: schedules, error: schedulesError } = await supabase
        .from('schedules')
        .select('id, departure_time, price')
        .eq('route_id', route.id);

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError);
        continue;
      }

      if (schedules) {
        for (const schedule of schedules) {
          results.push({
            schedule_id: schedule.id,
            kalkis_yeri: route.origin,
            varis_yeri: route.destination,
            saat: schedule.departure_time,
            firma_adi: (Array.isArray(route.companies) 
              ? route.companies[0]?.name 
              : null) || 'Bilinmiyor',
            fiyat: schedule.price || null,
          });
        }
      }
    }

    // Saate göre sırala
    results.sort((a, b) => a.saat.localeCompare(b.saat));

    return results;
  } catch (error) {
    console.error('Error in getSchedules:', error);
    return [];
  }
}

export async function getUniqueLocations(): Promise<string[]> {
  try {
    const { data: routes, error } = await supabase
      .from('routes')
      .select('origin, destination');

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    const locationsSet = new Set<string>();
    routes?.forEach((route) => {
      // Trim ve normalize et
      if (route.origin) locationsSet.add(route.origin.trim());
      if (route.destination) locationsSet.add(route.destination.trim());
    });

    const sortedLocations = Array.from(locationsSet).sort();
    console.log('📍 Available locations:', sortedLocations);
    return sortedLocations;
  } catch (error) {
    console.error('Error in getUniqueLocations:', error);
    return [];
  }
}

export async function submitReport(
  scheduleId: string,
  issueType: string,
  description: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reports')
      .insert({
        schedule_id: scheduleId,
        issue_type: issueType,
        description: description,
        is_resolved: false,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error submitting report:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in submitReport:', error);
    return false;
  }
}

// Akıllı Rota Planlayıcı - PostgreSQL Fonksiyonunu Çağır
export async function getSmartRoutes(
  origin: string,
  destination: string,
  startTime: string = '00:00:00'
): Promise<SmartRoute[]> {
  try {
    // Şehir isimlerini normalize et (trim ve case-insensitive için hazırlık)
    const normalizedOrigin = origin.trim();
    const normalizedDestination = destination.trim();
    
    console.log('🔍 Calling get_smart_routes with:', { 
      origin: normalizedOrigin, 
      destination: normalizedDestination, 
      startTime 
    });
    
    const { data, error } = await supabase.rpc('get_smart_routes', {
      origin_city: normalizedOrigin,
      destination_city: normalizedDestination,
      start_time: startTime,
    });

    if (error) {
      console.error('❌ Supabase RPC Error:', error);
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Error Details:', error.details);
      console.error('Error Hint:', error.hint);
      
      // Hata durumunda kullanıcıya bilgi ver
      if (error.code === '42883') {
        console.error('⚠️ Fonksiyon bulunamadı! get_smart_routes.sql dosyasını çalıştırın.');
      }
      
      return [];
    }

    console.log('✅ Smart Routes Data:', data);
    console.log('📊 Number of routes found:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.warn('⚠️ Hiç rota bulunamadı. Kontrol edin:');
      console.warn('  1. Şehir isimleri doğru mu? (Büyük/küçük harf önemli!)');
      console.warn('  2. Veritabanında bu şehirler arasında sefer var mı?');
      console.warn('  3. comprehensive_diagnostic.sql ile şehir listesini kontrol edin');
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ Exception in getSmartRoutes:', error);
    return [];
  }
}
