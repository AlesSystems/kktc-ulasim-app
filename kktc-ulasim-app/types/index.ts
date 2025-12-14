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

// Admin Dashboard Types
export interface AdminStats {
  totalSchedules: number;
  pendingReports: number;
  totalStops: number;
  totalCompanies: number;
}

export interface ReportWithSchedule {
  id: string;
  schedule_id: string;
  issue_type: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
  schedules: {
    id: string;
    departure_time: string;
    routes: {
      id: string;
      origin: string;
      destination: string;
      companies: {
        name: string;
      };
    };
  };
}

export interface ScheduleWithRoute {
  id: string;
  departure_time: string;
  price: number | null;
  route_id: string;
  routes: {
    id: string;
    origin: string;
    destination: string;
    route_name: string;
    route_number?: string;
    companies: {
      id: string;
      name: string;
    };
  };
}

export interface Stop {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
}
