-- =====================================================
-- 🔍 Tanı Sorguları (Diagnostic Queries)
-- =====================================================
-- Bu sorguları Supabase SQL Editor'de çalıştırarak
-- "Rota Bulunamadı" sorununu teşhis edebilirsiniz.
-- =====================================================

-- ✅ ADIM 1: Fonksiyon Var mı?
-- =====================================================
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'get_smart_routes';

-- Beklenen: 1 satır döner (fonksiyon tanımı)
-- Eğer 0 satır dönerse: get_smart_routes.sql dosyasını çalıştırın!


-- ✅ ADIM 2: Veritabanında Veri Var mı?
-- =====================================================

-- Routes tablosu
SELECT 
  'routes' as table_name,
  COUNT(*) as total_records
FROM routes;

-- Schedules tablosu
SELECT 
  'schedules' as table_name,
  COUNT(*) as total_records
FROM schedules;

-- Companies tablosu
SELECT 
  'companies' as table_name,
  COUNT(*) as total_records
FROM companies;

-- Beklenen: Her tablo için COUNT > 0
-- Eğer 0 ise: Veri eklemeniz gerekiyor!


-- ✅ ADIM 3: Hangi Şehirler Var?
-- =====================================================
SELECT DISTINCT origin as city 
FROM routes 
ORDER BY origin;

-- Bu şehir isimlerini arama formunda kullanın!


-- ✅ ADIM 4: Örnek Rotalar Var mı?
-- =====================================================
SELECT 
  r.origin,
  r.destination,
  c.name as company,
  COUNT(s.id) as schedule_count
FROM routes r
LEFT JOIN companies c ON c.id = r.company_id
LEFT JOIN schedules s ON s.route_id = r.id
GROUP BY r.origin, r.destination, c.name
ORDER BY r.origin, r.destination;

-- Beklenen: En az birkaç rota görmelisiniz


-- ✅ ADIM 5: Fonksiyonu Test Et
-- =====================================================

-- Test 1: Basit test (şehir isimlerini kendi verilerinize göre değiştirin)
SELECT * FROM get_smart_routes('Güzelyurt', 'Lefkoşa', '00:00:00');

-- Test 2: İlk direkt rotayı bul
SELECT 
  route_type,
  total_price,
  legs->0->>'from' as from_city,
  legs->0->>'to' as to_city,
  legs->0->>'departure_time' as time,
  legs->0->>'company' as company
FROM get_smart_routes('Güzelyurt', 'Lefkoşa', '00:00:00')
WHERE route_type = 'direct'
LIMIT 1;

-- Test 3: İlk aktarmalı rotayı bul
SELECT 
  route_type,
  transfer_point,
  wait_time_minutes,
  total_price,
  legs
FROM get_smart_routes('Güzelyurt', 'Karpaz', '00:00:00')
WHERE route_type = 'transfer'
LIMIT 1;


-- ✅ ADIM 6: RLS Politikalarını Kontrol Et
-- =====================================================

-- Routes tablosu politikaları
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'routes';

-- Schedules tablosu politikaları
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'schedules';

-- Companies tablosu politikaları
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'companies';

-- Beklenen: 'anon' rolü için SELECT politikası görmeli
-- Eğer yoksa: README.md'deki RLS politikalarını oluşturun!


-- ✅ ADIM 7: Fonksiyon İzinlerini Kontrol Et
-- =====================================================
SELECT 
  routine_name,
  routine_schema,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'get_smart_routes';

-- Beklenen: security_type = 'DEFINER'
-- Eğer 'INVOKER' ise: Fonksiyonu SECURITY DEFINER ile yeniden oluşturun!


-- =====================================================
-- 🎯 SONUÇ ÖZETİ
-- =====================================================
-- Bu sorguları sırayla çalıştırın ve her adımda
-- beklenen sonuçları kontrol edin.
-- 
-- Eğer herhangi bir adımda problem bulursanız,
-- ticket.md veya supabase/README.md dosyalarındaki
-- çözümleri uygulayın.
-- =====================================================
