-- =====================================================
-- Akıllı Rota Planlayıcı (Smart Routing) Fonksiyonu
-- =====================================================
-- Bu fonksiyon hem direkt hem de 1 aktarmalı seferleri bulur
-- Kullanım: SELECT * FROM get_smart_routes('Güzelyurt', 'Karpaz', '09:00:00');

CREATE OR REPLACE FUNCTION get_smart_routes(
    origin_city TEXT,
    destination_city TEXT,
    start_time TIME DEFAULT '00:00:00'
)
RETURNS TABLE (
    route_type TEXT,
    transfer_point TEXT,
    wait_time_minutes INTEGER,
    total_price NUMERIC,
    legs JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH 
    -- Adım 1: Direkt Seferler
    direct_routes AS (
        SELECT 
            'direct'::TEXT AS route_type,
            NULL::TEXT AS transfer_point,
            0::INTEGER AS wait_time_minutes,
            COALESCE(s.price, 0)::NUMERIC AS total_price,
            jsonb_build_array(
                jsonb_build_object(
                    'leg_number', 1,
                    'from', r.origin,
                    'to', r.destination,
                    'departure_time', s.departure_time::TEXT,
                    'company', c.name,
                    'route_name', r.route_name,
                    'route_number', NULL::TEXT,
                    'price', COALESCE(s.price, 0),
                    'schedule_id', s.id
                )
            ) AS legs
        FROM routes r
        INNER JOIN schedules s ON s.route_id = r.id
        INNER JOIN companies c ON c.id = r.company_id
        WHERE r.origin = origin_city
          AND r.destination = destination_city
          AND s.departure_time >= start_time
    ),
    
    -- Adım 2: Aktarmalı Seferler (1 Stop)
    transfer_routes AS (
        SELECT 
            'transfer'::TEXT AS route_type,
            r1.destination AS transfer_point,
            EXTRACT(EPOCH FROM (s2.departure_time - s1.departure_time))::INTEGER / 60 AS wait_time_minutes,
            (COALESCE(s1.price, 0) + COALESCE(s2.price, 0))::NUMERIC AS total_price,
            jsonb_build_array(
                jsonb_build_object(
                    'leg_number', 1,
                    'from', r1.origin,
                    'to', r1.destination,
                    'departure_time', s1.departure_time::TEXT,
                    'company', c1.name,
                    'route_name', r1.route_name,
                    'route_number', NULL::TEXT,
                    'price', COALESCE(s1.price, 0),
                    'schedule_id', s1.id
                ),
                jsonb_build_object(
                    'leg_number', 2,
                    'from', r2.origin,
                    'to', r2.destination,
                    'departure_time', s2.departure_time::TEXT,
                    'company', c2.name,
                    'route_name', r2.route_name,
                    'route_number', NULL::TEXT,
                    'price', COALESCE(s2.price, 0),
                    'schedule_id', s2.id
                )
            ) AS legs
        FROM routes r1
        INNER JOIN schedules s1 ON s1.route_id = r1.id
        INNER JOIN companies c1 ON c1.id = r1.company_id
        INNER JOIN routes r2 ON r2.origin = r1.destination
        INNER JOIN schedules s2 ON s2.route_id = r2.id
        INNER JOIN companies c2 ON c2.id = r2.company_id
        WHERE r1.origin = origin_city
          AND r2.destination = destination_city
          AND r1.destination != destination_city  -- Aktarma noktası hedef değil
          AND r2.origin != origin_city           -- Aktarma noktası başlangıç değil
          AND s1.departure_time >= start_time
          -- Zaman Kontrolü: En az 15 dakika, en fazla 4 saat bekleme
          AND s2.departure_time >= s1.departure_time + INTERVAL '15 minutes'
          AND s2.departure_time <= s1.departure_time + INTERVAL '4 hours'
    ),
    
    -- Tüm sonuçları birleştir
    all_routes AS (
        SELECT * FROM direct_routes
        UNION ALL
        SELECT * FROM transfer_routes
    )
    
    -- Sonuçları sırala: önce kalkış saatine göre, sonra fiyata göre
    SELECT 
        ar.route_type,
        ar.transfer_point,
        ar.wait_time_minutes,
        ar.total_price,
        ar.legs
    FROM all_routes ar
    ORDER BY 
        (ar.legs->0->>'departure_time')::TIME ASC,
        ar.total_price ASC;
        
END;
$$;

-- Fonksiyonu test etmek için örnek sorgular:
-- SELECT * FROM get_smart_routes('Güzelyurt', 'Karpaz', '09:00:00');
-- SELECT * FROM get_smart_routes('Güzelyurt', 'Karpaz'); -- Tüm seferler

-- Fonksiyon açıklaması
COMMENT ON FUNCTION get_smart_routes(TEXT, TEXT, TIME) IS 
'Akıllı rota planlayıcı: Hem direkt hem de 1 aktarmalı seferleri bulur. 
Aktarma bekleme süresi 15 dakika ile 4 saat arasında olmalıdır.
Sonuçları kalkış saatine ve fiyata göre sıralar.';
