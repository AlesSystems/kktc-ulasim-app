export interface Company {
  id: string;
  name: string;
  [key: string]: unknown; // Tüm diğer alanlar için
}

export interface Route {
  id: string;
  route_name: string;
  route_number?: string;
  company_id: string;
  [key: string]: unknown; // Tüm diğer alanlar için
  companies?: Company;
}

export interface Schedule {
  id: string;
  route_id: string;
  departure_time: string;
  price?: number;
  [key: string]: unknown;
}

export interface ScheduleResult {
  schedule_id: string;
  kalkis_yeri: string;
  varis_yeri: string;
  saat: string;
  firma_adi: string;
  fiyat: number | null;
}

// Smart Routing için yeni tipler
export interface RouteLeg {
  leg_number: number;
  from: string;
  to: string;
  departure_time: string;
  company: string;
  route_name: string;
  route_number?: string;
  price: number;
  schedule_id: string;
}

export interface SmartRoute {
  route_type: 'direct' | 'transfer';
  transfer_point?: string;
  wait_time_minutes: number;
  total_price: number;
  legs: RouteLeg[];
}
