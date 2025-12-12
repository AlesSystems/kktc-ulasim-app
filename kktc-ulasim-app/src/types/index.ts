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
  kalkis_yeri: string;
  varis_yeri: string;
  saat: string;
  firma_adi: string;
  fiyat: number | null;
}
