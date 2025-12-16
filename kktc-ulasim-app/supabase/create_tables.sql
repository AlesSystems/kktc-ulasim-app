-- =====================================================
-- 📋 TABLO OLUŞTURMA SCRIPTİ (Table Creation)
-- =====================================================
-- Bu script gerekli tüm tabloları oluşturur
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

-- =====================================================
-- 1. COMPANIES TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- =====================================================
-- 2. ROUTES TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  route_name TEXT,
  route_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_routes_company_id ON routes(company_id);
CREATE INDEX IF NOT EXISTS idx_routes_origin ON routes(origin);
CREATE INDEX IF NOT EXISTS idx_routes_destination ON routes(destination);
CREATE INDEX IF NOT EXISTS idx_routes_origin_destination ON routes(origin, destination);

-- =====================================================
-- 3. SCHEDULES TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  departure_time TIME NOT NULL,
  price NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_schedules_departure_time ON schedules(departure_time);

-- =====================================================
-- 4. REPORTS TABLOSU (Opsiyonel - Admin için)
-- =====================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  description TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_reports_schedule_id ON reports(schedule_id);
CREATE INDEX IF NOT EXISTS idx_reports_is_resolved ON reports(is_resolved);

-- =====================================================
-- 5. STOPS TABLOSU (Opsiyonel - Duraklar için)
-- =====================================================
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_stops_name ON stops(name);

-- =====================================================
-- 6. UPDATED_AT TRIGGER FONKSİYONU
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları oluştur
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stops_updated_at
  BEFORE UPDATE ON stops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. DOĞRULAMA (Verification)
-- =====================================================

-- Oluşturulan tabloları göster
SELECT 
  '✅ TABLOLAR OLUŞTURULDU' as status,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' 
   AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('companies', 'routes', 'schedules', 'reports', 'stops')
ORDER BY table_name;

-- =====================================================
-- 🎉 TAMAMLANDI!
-- =====================================================
-- Artık tablolar hazır. Şimdi:
-- 1. seed_data.sql dosyasını çalıştırarak örnek veri ekleyin
-- 2. get_smart_routes.sql dosyasını çalıştırarak fonksiyonu yükleyin
-- 3. comprehensive_diagnostic.sql ile kontrol edin
-- =====================================================

