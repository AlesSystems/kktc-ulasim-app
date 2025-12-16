-- =====================================================
-- 🔍 KAPSAMLI TANı SORGULARI (Comprehensive Diagnostic)
-- =====================================================
-- Bu script TÜM olası sorunları kontrol eder
-- Supabase SQL Editor'de çalıştırın ve sonuçları kontrol edin
-- =====================================================

-- =====================================================
-- ADIM 0: TEMEL KONTROLLER
-- =====================================================

-- 0.1: Tablolar mevcut mu?
SELECT 
  '📋 TABLO KONTROLÜ' as check_type,
  table_name,
  CASE 
    WHEN table_name IN ('routes', 'schedules', 'companies') THEN '✅ Mevcut'
    ELSE '❌ Eksik'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('routes', 'schedules', 'companies')
ORDER BY table_name;

-- Eğer yukarıdaki sorgu boş dönüyorsa: TABLOLAR MEVCUT DEĞİL!
-- Çözüm: Tabloları oluşturmanız gerekiyor (migration script'i çalıştırın)

-- 0.2: Tablo yapılarını kontrol et
SELECT 
  '📊 TABLO YAPISI' as check_type,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('routes', 'schedules', 'companies')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- ADIM 1: VERİ KONTROLÜ
-- =====================================================

-- 1.1: Companies tablosunda veri var mı?
SELECT 
  '🏢 COMPANIES VERİ KONTROLÜ' as check_type,
  COUNT(*) as total_companies,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Veri var'
    ELSE '❌ VERİ YOK - seed_data.sql çalıştırın!'
  END as status
FROM companies;

-- 1.2: Routes tablosunda veri var mı?
SELECT 
  '🛣️ ROUTES VERİ KONTROLÜ' as check_type,
  COUNT(*) as total_routes,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Veri var'
    ELSE '❌ VERİ YOK - seed_data.sql çalıştırın!'
  END as status
FROM routes;

-- 1.3: Schedules tablosunda veri var mı?
SELECT 
  '⏰ SCHEDULES VERİ KONTROLÜ' as check_type,
  COUNT(*) as total_schedules,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Veri var'
    ELSE '❌ VERİ YOK - seed_data.sql çalıştırın!'
  END as status
FROM schedules;

-- 1.4: Örnek verileri göster
SELECT '📝 ÖRNEK VERİLER' as info;
SELECT 'Companies:' as table_name;
SELECT id, name FROM companies LIMIT 5;

SELECT 'Routes:' as table_name;
SELECT id, origin, destination, company_id FROM routes LIMIT 5;

SELECT 'Schedules:' as table_name;
SELECT id, route_id, departure_time, price FROM schedules LIMIT 5;

-- =====================================================
-- ADIM 2: İLİŞKİLERİ KONTROL ET
-- =====================================================

-- 2.1: Routes ile Companies arasındaki ilişki
SELECT 
  '🔗 ROUTES-COMPANIES İLİŞKİSİ' as check_type,
  COUNT(DISTINCT r.id) as routes_with_company,
  COUNT(DISTINCT r.company_id) as unique_companies,
  COUNT(*) as total_routes,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT r.company_id) THEN '✅ Tüm rotalar şirkete bağlı'
    ELSE '⚠️ Bazı rotalar şirkete bağlı değil'
  END as status
FROM routes r
LEFT JOIN companies c ON c.id = r.company_id;

-- 2.2: Schedules ile Routes arasındaki ilişki
SELECT 
  '🔗 SCHEDULES-ROUTES İLİŞKİSİ' as check_type,
  COUNT(DISTINCT s.id) as schedules_with_route,
  COUNT(DISTINCT s.route_id) as unique_routes,
  COUNT(*) as total_schedules,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT s.route_id) THEN '✅ Tüm seferler rotaya bağlı'
    ELSE '⚠️ Bazı seferler rotaya bağlı değil'
  END as status
FROM schedules s
LEFT JOIN routes r ON r.id = s.route_id;

-- 2.3: Eksik ilişkileri bul
SELECT 
  '❌ EKSİK İLİŞKİLER' as check_type,
  'routes.company_id' as field,
  COUNT(*) as orphaned_records
FROM routes r
LEFT JOIN companies c ON c.id = r.company_id
WHERE c.id IS NULL

UNION ALL

SELECT 
  '❌ EKSİK İLİŞKİLER' as check_type,
  'schedules.route_id' as field,
  COUNT(*) as orphaned_records
FROM schedules s
LEFT JOIN routes r ON r.id = s.route_id
WHERE r.id IS NULL;

-- =====================================================
-- ADIM 3: ŞEHİR İSİMLERİNİ KONTROL ET
-- =====================================================

SELECT 
  '🏙️ MEVCUT ŞEHİRLER (ORIGIN)' as check_type,
  origin as city_name,
  COUNT(*) as route_count
FROM routes
GROUP BY origin
ORDER BY origin;

SELECT 
  '🏙️ MEVCUT ŞEHİRLER (DESTINATION)' as check_type,
  destination as city_name,
  COUNT(*) as route_count
FROM routes
GROUP BY destination
ORDER BY destination;

-- Tüm benzersiz şehirler
SELECT 
  '🏙️ TÜM ŞEHİRLER' as check_type,
  city_name,
  COUNT(*) as total_routes
FROM (
  SELECT origin as city_name FROM routes
  UNION ALL
  SELECT destination as city_name FROM routes
) all_cities
GROUP BY city_name
ORDER BY city_name;

-- =====================================================
-- ADIM 4: FONKSİYON KONTROLÜ
-- =====================================================

-- 4.1: Fonksiyon var mı?
SELECT 
  '⚙️ FONKSİYON KONTROLÜ' as check_type,
  routine_name,
  routine_schema,
  security_type,
  CASE 
    WHEN routine_name IS NOT NULL THEN '✅ Fonksiyon mevcut'
    ELSE '❌ FONKSİYON YOK - get_smart_routes.sql çalıştırın!'
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name = 'get_smart_routes';

-- 4.2: Fonksiyon parametrelerini kontrol et
SELECT 
  '⚙️ FONKSİYON PARAMETRELERİ' as check_type,
  parameter_name,
  data_type,
  parameter_default
FROM information_schema.parameters
WHERE specific_schema = 'public'
  AND specific_name = (
    SELECT specific_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
      AND routine_name = 'get_smart_routes'
    LIMIT 1
  )
ORDER BY ordinal_position;

-- 4.3: Fonksiyon tanımını göster
SELECT 
  '⚙️ FONKSİYON TANIMI' as check_type,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'get_smart_routes'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
LIMIT 1;

-- =====================================================
-- ADIM 5: RLS POLİTİKALARI KONTROL ET
-- =====================================================

-- 5.1: RLS aktif mi?
SELECT 
  '🔒 RLS DURUMU' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS aktif'
    ELSE '⚠️ RLS pasif'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('routes', 'schedules', 'companies')
ORDER BY tablename;

-- 5.2: RLS politikaları var mı?
SELECT 
  '🔒 RLS POLİTİKALARI' as check_type,
  schemaname,
  tablename,
  policyname,
  roles,
  cmd as command,
  CASE 
    WHEN policyname IS NOT NULL THEN '✅ Politika mevcut'
    ELSE '❌ Politika yok'
  END as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('routes', 'schedules', 'companies')
ORDER BY tablename, policyname;

-- =====================================================
-- ADIM 6: FONKSİYONU TEST ET
-- =====================================================

-- 6.1: Önce mevcut şehirleri kullanarak test et
DO $$
DECLARE
  test_origin TEXT;
  test_dest TEXT;
  test_result RECORD;
BEGIN
  -- İlk mevcut rotayı bul
  SELECT origin, destination INTO test_origin, test_dest
  FROM routes
  LIMIT 1;
  
  IF test_origin IS NOT NULL AND test_dest IS NOT NULL THEN
    RAISE NOTICE '🧪 Test: % -> %', test_origin, test_dest;
    
    -- Fonksiyonu test et
    SELECT COUNT(*) INTO test_result
    FROM get_smart_routes(test_origin, test_dest, '00:00:00');
    
    RAISE NOTICE '✅ Fonksiyon çalıştı, % sonuç döndü', test_result;
  ELSE
    RAISE NOTICE '❌ Test edilecek rota bulunamadı - Veri yok!';
  END IF;
END $$;

-- 6.2: Manuel test (şehir isimlerini kendi verilerinize göre değiştirin)
SELECT 
  '🧪 MANUEL TEST' as check_type,
  'Aşağıdaki sorguyu kendi şehir isimlerinizle çalıştırın:' as instruction;

-- Örnek test (şehir isimlerini değiştirin):
-- SELECT * FROM get_smart_routes('Lefkoşa', 'Girne', '00:00:00');

-- =====================================================
-- ADIM 7: ÖZET RAPOR
-- =====================================================

SELECT 
  '📊 ÖZET RAPOR' as report_type,
  'Tablolar' as category,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('routes', 'schedules', 'companies'))::TEXT as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('routes', 'schedules', 'companies')) = 3 THEN '✅'
    ELSE '❌'
  END as status

UNION ALL

SELECT 
  '📊 ÖZET RAPOR' as report_type,
  'Companies Veri' as category,
  (SELECT COUNT(*)::TEXT FROM companies) as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM companies) > 0 THEN '✅'
    ELSE '❌'
  END as status

UNION ALL

SELECT 
  '📊 ÖZET RAPOR' as report_type,
  'Routes Veri' as category,
  (SELECT COUNT(*)::TEXT FROM routes) as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM routes) > 0 THEN '✅'
    ELSE '❌'
  END as status

UNION ALL

SELECT 
  '📊 ÖZET RAPOR' as report_type,
  'Schedules Veri' as category,
  (SELECT COUNT(*)::TEXT FROM schedules) as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM schedules) > 0 THEN '✅'
    ELSE '❌'
  END as status

UNION ALL

SELECT 
  '📊 ÖZET RAPOR' as report_type,
  'Fonksiyon' as category,
  (SELECT COUNT(*)::TEXT FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'get_smart_routes') as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'get_smart_routes') > 0 THEN '✅'
    ELSE '❌'
  END as status;

-- =====================================================
-- 🎯 SONUÇ
-- =====================================================
-- Bu sorguları çalıştırdıktan sonra:
-- 1. ❌ işaretli kategorileri kontrol edin
-- 2. Eksik olanları tamamlayın:
--    - Tablolar yoksa: Migration script çalıştırın
--    - Veri yoksa: seed_data.sql çalıştırın
--    - Fonksiyon yoksa: get_smart_routes.sql çalıştırın
--    - RLS sorunu varsa: RLS politikalarını oluşturun
-- =====================================================

