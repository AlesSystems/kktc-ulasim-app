-- =====================================================
-- 🔍 BELİRLİ ROTA TEST SORGUSU
-- =====================================================
-- Bu sorgu belirli bir rota için veritabanında ne olduğunu kontrol eder
-- =====================================================

-- Test: Lefkoşa Otobüs Terminali -> Girne Terminal
SELECT 
  '🔍 TEST ROTA' as test_type,
  'Lefkoşa Otobüs Terminali' as origin,
  'Girne Terminal' as destination;

-- 1. Bu şehirler arasında direkt rota var mı?
SELECT 
  '📋 DİREKT ROTA KONTROLÜ' as check_type,
  r.id,
  r.origin,
  r.destination,
  c.name as company,
  COUNT(s.id) as schedule_count
FROM routes r
LEFT JOIN companies c ON c.id = r.company_id
LEFT JOIN schedules s ON s.route_id = r.id
WHERE TRIM(LOWER(r.origin)) = TRIM(LOWER('Lefkoşa Otobüs Terminali'))
  AND TRIM(LOWER(r.destination)) = TRIM(LOWER('Girne Terminal'))
GROUP BY r.id, r.origin, r.destination, c.name;

-- 2. Bu şehirlerden birinden başlayan rotalar var mı?
SELECT 
  '📋 ORIGIN KONTROLÜ' as check_type,
  r.id,
  r.origin,
  r.destination,
  c.name as company
FROM routes r
LEFT JOIN companies c ON c.id = r.company_id
WHERE TRIM(LOWER(r.origin)) = TRIM(LOWER('Lefkoşa Otobüs Terminali'))
LIMIT 10;

-- 3. Bu şehirlere giden rotalar var mı?
SELECT 
  '📋 DESTINATION KONTROLÜ' as check_type,
  r.id,
  r.origin,
  r.destination,
  c.name as company
FROM routes r
LEFT JOIN companies c ON c.id = r.company_id
WHERE TRIM(LOWER(r.destination)) = TRIM(LOWER('Girne Terminal'))
LIMIT 10;

-- 4. Fonksiyonu test et (eski versiyon - case-sensitive)
SELECT 
  '🧪 FONKSİYON TEST (ESKİ - CASE SENSITIVE)' as test_type,
  *
FROM get_smart_routes('Lefkoşa Otobüs Terminali', 'Girne Terminal', '00:00:00')
LIMIT 5;

-- 5. Fonksiyonu test et (yeni versiyon - case-insensitive olmalı)
-- NOT: Eğer fonksiyon güncellenmişse, bu çalışmalı
SELECT 
  '🧪 FONKSİYON TEST (YENİ - CASE INSENSITIVE)' as test_type,
  *
FROM get_smart_routes('lefkoşa otobüs terminali', 'girne terminal', '00:00:00')
LIMIT 5;

-- 6. Aktarmalı rota var mı? (Lefkoşa Otobüs Terminali -> X -> Girne Terminal)
SELECT 
  '📋 AKTARMALI ROTA KONTROLÜ' as check_type,
  r1.origin as leg1_origin,
  r1.destination as leg1_destination,
  r2.origin as leg2_origin,
  r2.destination as leg2_destination,
  c1.name as company1,
  c2.name as company2
FROM routes r1
LEFT JOIN companies c1 ON c1.id = r1.company_id
INNER JOIN routes r2 ON TRIM(LOWER(r2.origin)) = TRIM(LOWER(r1.destination))
LEFT JOIN companies c2 ON c2.id = r2.company_id
WHERE TRIM(LOWER(r1.origin)) = TRIM(LOWER('Lefkoşa Otobüs Terminali'))
  AND TRIM(LOWER(r2.destination)) = TRIM(LOWER('Girne Terminal'))
LIMIT 10;

-- =====================================================
-- 🎯 SONUÇ
-- =====================================================
-- Bu sorguları çalıştırdıktan sonra:
-- 1. Direkt rota varsa: Fonksiyon çalışmalı
-- 2. Direkt rota yoksa ama aktarmalı varsa: Aktarmalı rota gösterilmeli
-- 3. Hiçbiri yoksa: Veritabanında bu şehirler arasında sefer yok
-- =====================================================

