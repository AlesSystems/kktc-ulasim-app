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
