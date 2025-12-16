# Akıllı Rota Planlayıcı (Smart Routing) - Kurulum ve Kullanım Rehberi

## 📋 Genel Bakış

Bu özellik, KKTC Ulaşım uygulaması için **akıllı rota planlama** algoritması sağlar. Kullanıcılar, direkt sefer olmayan durumlarda bile aktarmalı rotalar bulabilir.

### Özellikler
- ✅ **Direkt Seferler**: A noktasından B noktasına direkt giden seferler
- ✅ **Aktarmalı Seferler**: 1 aktarma ile gidilen seferler
- ✅ **Akıllı Zaman Kontrolü**: Aktarma bekleme süresi 15 dakika - 4 saat arası
- ✅ **Performanslı**: PostgreSQL'de çalışan optimize edilmiş sorgu
- ✅ **Detaylı Bilgi**: Toplam fiyat, bekleme süresi, tüm bacaklar (legs)

---

## 🚀 Kurulum Adımları

### 1. SQL Fonksiyonunu Supabase'e Yükle

1. **Supabase Dashboard**'a git: https://app.supabase.com
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü aç
4. `supabase/get_smart_routes.sql` dosyasının içeriğini kopyala
5. SQL Editor'e yapıştır ve **Run** butonuna tıkla

### 2. Fonksiyonu Test Et

SQL Editor'de şu sorguyu çalıştır:

```sql
SELECT * FROM get_smart_routes('Güzelyurt', 'Karpaz', '09:00:00');
```

Başarılı ise JSON formatında sonuçlar göreceksiniz.

---

## 📊 Fonksiyon Detayları

### İmza
```sql
get_smart_routes(
    origin_city TEXT,
    destination_city TEXT,
    start_time TIME DEFAULT '00:00:00'
)
```

### Parametreler
- **origin_city**: Kalkış şehri (örn: 'Güzelyurt')
- **destination_city**: Varış şehri (örn: 'Karpaz')
- **start_time**: Minimum kalkış saati (örn: '09:00:00'), opsiyonel - varsayılan '00:00:00'

### Dönüş Değeri
JSON formatında rota listesi:

```json
[
  {
    "route_type": "direct",
    "transfer_point": null,
    "wait_time_minutes": 0,
    "total_price": 100,
    "legs": [
      {
        "leg_number": 1,
        "from": "Güzelyurt",
        "to": "Karpaz",
        "departure_time": "10:00:00",
        "company": "Çimen",
        "route_name": "Güzelyurt-Karpaz Hattı",
        "route_number": "101",
        "price": 100,
        "schedule_id": "uuid..."
      }
    ]
  },
  {
    "route_type": "transfer",
    "transfer_point": "Lefkoşa",
    "wait_time_minutes": 35,
    "total_price": 180,
    "legs": [
      {
        "leg_number": 1,
        "from": "Güzelyurt",
        "to": "Lefkoşa",
        "departure_time": "10:00:00",
        "company": "Çimen",
        "route_name": "Güzelyurt-Lefkoşa Hattı",
        "price": 80,
        "schedule_id": "uuid..."
      },
      {
        "leg_number": 2,
        "from": "Lefkoşa",
        "to": "Karpaz",
        "departure_time": "11:35:00",
        "company": "İtimat",
        "route_name": "Lefkoşa-Karpaz Hattı",
        "price": 100,
        "schedule_id": "uuid..."
      }
    ]
  }
]
```

---

## 💻 Frontend Entegrasyonu

### Kullanım Örneği

```typescript
import { getSmartRoutes } from '@/src/lib/supabaseClient';

// Direkt ve aktarmalı rotaları getir
const routes = await getSmartRoutes('Güzelyurt', 'Karpaz', '09:00:00');

// Sadece direkt rotaları filtrele
const directRoutes = routes.filter(r => r.route_type === 'direct');

// Sadece aktarmalı rotaları filtrele
const transferRoutes = routes.filter(r => r.route_type === 'transfer');

// En ucuz rotayı bul
const cheapestRoute = routes.sort((a, b) => a.total_price - b.total_price)[0];
```

### Mevcut Uygulamaya Entegrasyon

`app/page.tsx` dosyasında `getSchedules` yerine `getSmartRoutes` kullanabilirsiniz:

```typescript
import { getSmartRoutes } from '@/src/lib/supabaseClient';

const handleSearch = async (origin: string, destination: string) => {
  setIsSearching(true);
  setSearchOrigin(origin);
  setSearchDestination(destination);
  
  // Akıllı rotaları getir
  const smartRoutes = await getSmartRoutes(origin, destination);
  
  // İsterseniz SmartRoute'ları ScheduleResult'a dönüştürün
  // veya yeni bir ResultsCard komponenti oluşturun
  
  setIsSearching(false);
};
```

---

## 🎯 Algoritma Mantığı

### 1. Direkt Seferler
- Başlangıç ve hedef şehir eşleşmesi
- Belirtilen saatten sonra kalkan seferler

### 2. Aktarmalı Seferler (1 Transfer)
**Mantık**: Route A (Origin → X) + Route B (X → Destination)

**Zaman Kuralları**:
- İkinci otobüs, birinci otobüsten **en az 15 dakika** sonra kalkmalı (aktarma zamanı)
- İkinci otobüs, birinci otobüsten **en fazla 4 saat** sonra kalkmalı (fazla bekleme önlenir)

**Filtreler**:
- Aktarma noktası, hedef şehir olmamalı
- Aktarma noktası, başlangıç şehri olmamalı

### 3. Sıralama
1. Kalkış saatine göre (erken önce)
2. Toplam fiyata göre (ucuz önce)

---

## 🔧 Veritabanı Gereksinimleri

Fonksiyonun çalışması için şu tablolar ve kolonlar gereklidir:

### `routes` tablosu
- `id` (UUID)
- `origin` (TEXT)
- `destination` (TEXT)
- `company_id` (UUID)
- `route_name` (TEXT)
- `route_number` (TEXT, opsiyonel)

### `schedules` tablosu
- `id` (UUID)
- `route_id` (UUID, routes.id'ye referans)
- `departure_time` (TIME)
- `price` (NUMERIC, opsiyonel)

### `companies` tablosu
- `id` (UUID)
- `name` (TEXT)

---

## 🧪 Test Senaryoları

### Test 1: Direkt Sefer
```sql
-- Güzelyurt'tan Lefkoşa'ya direkt sefer var mı?
SELECT * FROM get_smart_routes('Güzelyurt', 'Lefkoşa', '08:00:00');
```

### Test 2: Aktarmalı Sefer
```sql
-- Güzelyurt'tan Karpaz'a aktarmalı sefer (muhtemelen Lefkoşa üzerinden)
SELECT * FROM get_smart_routes('Güzelyurt', 'Karpaz', '09:00:00');
```

### Test 3: Tüm Seferler
```sql
-- Başlangıç saati belirtmeden tüm seferleri getir
SELECT * FROM get_smart_routes('Güzelyurt', 'Karpaz');
```

### Test 4: JSON Parsing
```sql
-- İlk bacağın (leg) detaylarını çıkar
SELECT 
  route_type,
  legs->0->>'from' as ilk_kalkis,
  legs->0->>'to' as ilk_varis,
  legs->0->>'departure_time' as ilk_saat,
  total_price
FROM get_smart_routes('Güzelyurt', 'Karpaz');
```

---

## 🐛 Olası Hatalar ve Çözümleri

### ⚠️ Hata: "Rota Bulunamadı" Mesajı Her Zaman Görünüyor

**1. Fonksiyon Supabase'de Yüklü mü?**

Supabase Dashboard → SQL Editor'de çalıştır:
```sql
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'get_smart_routes';
```

Eğer boş sonuç dönüyorsa:
- ✅ `supabase/get_smart_routes.sql` dosyasını Supabase SQL Editor'de çalıştırın
- ✅ `SECURITY DEFINER` ve `SET search_path = public` satırlarının eklendiğinden emin olun

**2. RLS (Row Level Security) Politikaları**

Supabase Dashboard → Authentication → Policies'de kontrol edin:

```sql
-- Routes tablosu için
CREATE POLICY "Allow anonymous read access to routes"
ON routes FOR SELECT
TO anon
USING (true);

-- Schedules tablosu için
CREATE POLICY "Allow anonymous read access to schedules"
ON schedules FOR SELECT
TO anon
USING (true);

-- Companies tablosu için
CREATE POLICY "Allow anonymous read access to companies"
ON companies FOR SELECT
TO anon
USING (true);
```

**3. Veritabanında Veri Kontrolü**

```sql
-- Veri var mı kontrol et
SELECT COUNT(*) FROM routes;
SELECT COUNT(*) FROM schedules;
SELECT COUNT(*) FROM companies;

-- Şehir isimlerini kontrol et
SELECT DISTINCT origin FROM routes ORDER BY origin;
SELECT DISTINCT destination FROM routes ORDER BY destination;
```

**4. Frontend'de Debug**

Browser Console'u (F12) açın ve şunları kontrol edin:
- ✅ `🔍 Calling get_smart_routes with:` log mesajını görüyor musunuz?
- ✅ `❌ Supabase RPC Error:` mesajı var mı?
- ✅ Network sekmesinde `rpc/get_smart_routes` çağrısının response'unu kontrol edin

### Hata: "function get_smart_routes does not exist"
**Çözüm**: SQL fonksiyonunu Supabase'e yüklemeyi unutmuşsunuz. Yukarıdaki kurulum adımlarını takip edin.

### Hata: "column 'is_active' does not exist"
**Çözüm**: Veritabanı şeması SQL fonksiyonuyla uyumlu değil. Eğer `schedules` tablosunda `is_active` kolonu yoksa, SQL dosyasındaki `s.is_active = true` satırlarını kaldırın.

### Hata: Boş sonuç döndürüyor
**Olası Nedenler**:
1. Belirtilen şehir isimleri veritabanında yok (Büyük/küçük harf duyarlı!)
2. `start_time` çok ileri bir saat (Geçici çözüm: '00:00:00' kullanın)
3. Veritabanında yeterli veri yok

**Kontrol**:
```sql
-- Şehir isimlerini kontrol et
SELECT DISTINCT origin FROM routes;
SELECT DISTINCT destination FROM routes;

-- Fonksiyonu test et
SELECT * FROM get_smart_routes('Güzelyurt', 'Lefkoşa', '00:00:00');
```

---

## 📈 Performans İyileştirmeleri

Fonksiyon optimize edilmiştir, ancak büyük veri setlerinde şunları ekleyebilirsiniz:

### Index Oluşturma
```sql
-- Routes tablosu için
CREATE INDEX idx_routes_origin ON routes(origin);
CREATE INDEX idx_routes_destination ON routes(destination);

-- Schedules tablosu için
CREATE INDEX idx_schedules_route_id ON schedules(route_id);
CREATE INDEX idx_schedules_departure_time ON schedules(departure_time);
```

### Sonuç Limiti Ekleme
```sql
-- Fonksiyonun son satırına LIMIT ekleyin
ORDER BY 
    (ar.legs->0->>'departure_time')::TIME ASC,
    ar.total_price ASC
LIMIT 50;  -- En fazla 50 sonuç döndür
```

---

## 🎨 UI Önerileri

Aktarmalı seferleri göstermek için:

1. **Rota Kartları**: Her rotayı ayrı bir kart olarak göster
2. **Transfer Badge**: Aktarmalı seferler için özel badge
3. **Timeline View**: Bacakları (legs) timeline şeklinde göster
4. **Bekleme Süresi**: Transfer noktasında bekleme süresini vurgula
5. **Toplam Fiyat**: Büyük ve belirgin göster

---

## 📚 Ek Kaynaklar

- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Graph Theory - Shortest Path](https://en.wikipedia.org/wiki/Shortest_path_problem)

---

## 🤝 Katkıda Bulunma

Bu özellik için iyileştirme önerileri:
1. Çoklu aktarma desteği (2+ transfer)
2. Mesafe bazlı sıralama
3. Favori rotalar
4. Gerçek zamanlı sefer takibi

---

## 📝 Notlar

- Fonksiyon şu an **sadece 1 aktarmalı** rotaları destekliyor
- Gelecekte çoklu aktarma için **recursive CTE** kullanılabilir
- `search_date` parametresi şu an kullanılmıyor (gelecekteki genişletme için)

---

**Son Güncelleme**: 2025-12-13  
**Versiyon**: 1.0.0  
**Yazar**: AlesSystems
