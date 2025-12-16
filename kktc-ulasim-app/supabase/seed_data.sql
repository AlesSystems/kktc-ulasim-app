-- =====================================================
-- 🌱 Örnek Veri (Seed Data) - KKTC Ulaşım
-- =====================================================
-- Bu script veritabanına örnek şirket, rota ve sefer
-- verileri ekler. Supabase SQL Editor'de çalıştırın.
-- =====================================================

-- =====================================================
-- 1. ŞİRKETLER (Companies)
-- =====================================================

INSERT INTO companies (id, name, contact_phone, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Çimen Turizm', '+90 392 228 1234', NOW(), NOW()),
  (gen_random_uuid(), 'İtimat Turizm', '+90 392 228 5678', NOW(), NOW()),
  (gen_random_uuid(), 'Kombos', '+90 392 228 9012', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. ROTALAR (Routes)
-- =====================================================

-- Şirket ID'lerini al
DO $$
DECLARE
  cimen_id UUID;
  itimat_id UUID;
  kombos_id UUID;
BEGIN
  -- Şirket ID'lerini bul
  SELECT id INTO cimen_id FROM companies WHERE name = 'Çimen Turizm' LIMIT 1;
  SELECT id INTO itimat_id FROM companies WHERE name = 'İtimat Turizm' LIMIT 1;
  SELECT id INTO kombos_id FROM companies WHERE name = 'Kombos' LIMIT 1;

  -- Çimen Turizm Rotaları
  INSERT INTO routes (id, company_id, origin, destination, route_name, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), cimen_id, 'Lefkoşa', 'Güzelyurt', 'Lefkoşa-Güzelyurt Hattı', NOW(), NOW()),
    (gen_random_uuid(), cimen_id, 'Güzelyurt', 'Lefkoşa', 'Güzelyurt-Lefkoşa Hattı', NOW(), NOW()),
    (gen_random_uuid(), cimen_id, 'Lefkoşa', 'Girne', 'Lefkoşa-Girne Hattı', NOW(), NOW()),
    (gen_random_uuid(), cimen_id, 'Girne', 'Lefkoşa', 'Girne-Lefkoşa Hattı', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- İtimat Turizm Rotaları
  INSERT INTO routes (id, company_id, origin, destination, route_name, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), itimat_id, 'Lefkoşa', 'Gazimağusa', 'Lefkoşa-Gazimağusa Hattı', NOW(), NOW()),
    (gen_random_uuid(), itimat_id, 'Gazimağusa', 'Lefkoşa', 'Gazimağusa-Lefkoşa Hattı', NOW(), NOW()),
    (gen_random_uuid(), itimat_id, 'Lefkoşa', 'İskele', 'Lefkoşa-İskele Hattı', NOW(), NOW()),
    (gen_random_uuid(), itimat_id, 'İskele', 'Lefkoşa', 'İskele-Lefkoşa Hattı', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Kombos Rotaları
  INSERT INTO routes (id, company_id, origin, destination, route_name, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), kombos_id, 'Girne', 'Gazimağusa', 'Girne-Gazimağusa Hattı', NOW(), NOW()),
    (gen_random_uuid(), kombos_id, 'Gazimağusa', 'Girne', 'Gazimağusa-Girne Hattı', NOW(), NOW()),
    (gen_random_uuid(), kombos_id, 'Güzelyurt', 'Girne', 'Güzelyurt-Girne Hattı', NOW(), NOW()),
    (gen_random_uuid(), kombos_id, 'Girne', 'Güzelyurt', 'Girne-Güzelyurt Hattı', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

END $$;

-- =====================================================
-- 3. SEFERLER (Schedules)
-- =====================================================

DO $$
DECLARE
  route_rec RECORD;
  schedule_times TIME[] := ARRAY['07:00:00', '09:00:00', '11:00:00', '13:00:00', '15:00:00', '17:00:00', '19:00:00'];
  time_val TIME;
  base_price NUMERIC;
BEGIN
  -- Her rota için seferler oluştur
  FOR route_rec IN 
    SELECT r.id as route_id, r.origin, r.destination, c.name as company_name
    FROM routes r
    JOIN companies c ON c.id = r.company_id
  LOOP
    -- Fiyatı rota mesafesine göre belirle (basit mantık)
    CASE 
      WHEN route_rec.origin = 'Lefkoşa' AND route_rec.destination = 'Girne' THEN base_price := 15;
      WHEN route_rec.origin = 'Girne' AND route_rec.destination = 'Lefkoşa' THEN base_price := 15;
      WHEN route_rec.origin = 'Lefkoşa' AND route_rec.destination = 'Güzelyurt' THEN base_price := 20;
      WHEN route_rec.origin = 'Güzelyurt' AND route_rec.destination = 'Lefkoşa' THEN base_price := 20;
      WHEN route_rec.origin = 'Lefkoşa' AND route_rec.destination = 'Gazimağusa' THEN base_price := 25;
      WHEN route_rec.origin = 'Gazimağusa' AND route_rec.destination = 'Lefkoşa' THEN base_price := 25;
      WHEN route_rec.origin = 'Lefkoşa' AND route_rec.destination = 'İskele' THEN base_price := 30;
      WHEN route_rec.origin = 'İskele' AND route_rec.destination = 'Lefkoşa' THEN base_price := 30;
      WHEN route_rec.origin = 'Girne' AND route_rec.destination = 'Gazimağusa' THEN base_price := 35;
      WHEN route_rec.origin = 'Gazimağusa' AND route_rec.destination = 'Girne' THEN base_price := 35;
      WHEN route_rec.origin = 'Güzelyurt' AND route_rec.destination = 'Girne' THEN base_price := 25;
      WHEN route_rec.origin = 'Girne' AND route_rec.destination = 'Güzelyurt' THEN base_price := 25;
      ELSE base_price := 20;
    END CASE;

    -- Her saat için sefer ekle
    FOREACH time_val IN ARRAY schedule_times
    LOOP
      INSERT INTO schedules (id, route_id, departure_time, price, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        route_rec.route_id,
        time_val,
        base_price,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- =====================================================
-- 4. DOĞRULAMA (Verification)
-- =====================================================

-- Eklenen verileri göster
SELECT 
  '✅ Companies' as table_name,
  COUNT(*) as total_records
FROM companies
UNION ALL
SELECT 
  '✅ Routes' as table_name,
  COUNT(*) as total_records
FROM routes
UNION ALL
SELECT 
  '✅ Schedules' as table_name,
  COUNT(*) as total_records
FROM schedules;

-- Örnek rotaları göster
SELECT 
  c.name as company,
  r.origin,
  r.destination,
  r.route_name,
  COUNT(s.id) as schedule_count
FROM routes r
JOIN companies c ON c.id = r.company_id
LEFT JOIN schedules s ON s.route_id = r.id
GROUP BY c.name, r.origin, r.destination, r.route_name
ORDER BY c.name, r.origin;

-- Şehir listesini göster
SELECT 'Available Cities:' as info;
SELECT DISTINCT origin as city FROM routes 
UNION 
SELECT DISTINCT destination as city FROM routes
ORDER BY city;

-- Test sorgusu
SELECT '🔍 Test Query Results:' as info;
SELECT * FROM get_smart_routes('Güzelyurt', 'Gazimağusa', '00:00:00') LIMIT 5;

-- =====================================================
-- 🎉 TAMAMLANDI!
-- =====================================================
-- Artık şu şehirler arasında arama yapabilirsiniz:
-- - Lefkoşa
-- - Güzelyurt
-- - Girne
-- - Gazimağusa
-- - İskele
-- =====================================================
