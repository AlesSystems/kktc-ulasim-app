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
      if (route.origin) locationsSet.add(route.origin);
      if (route.destination) locationsSet.add(route.destination);
    });

    return Array.from(locationsSet).sort();
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
    const { data, error } = await supabase.rpc('get_smart_routes', {
      origin_city: origin,
      destination_city: destination,
      start_time: startTime,
    });

    if (error) {
      console.error('Error fetching smart routes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSmartRoutes:', error);
    return [];
  }
}
