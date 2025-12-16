# 🚨 ÇÖZÜM: Admin Sayfasında Raporlar Görünmüyor

## 🎯 Sorun
Admin panelinde "Gelen Raporlar" sayfası boş görünüyor veya "Bekleyen rapor yok" mesajı gösteriyor, ancak veritabanında raporlar var.

## 🔍 Neden Oluyor?
Reports tablosunda **Row Level Security (RLS)** etkinleştirilmiş ancak gerekli politikalar (policies) oluşturulmamış. Bu yüzden Supabase client raporları okuyamıyor.

## ✅ ÇÖZÜM

### Adım 1: RLS Politikalarını Oluştur

1. **Supabase Dashboard**'a git: https://app.supabase.com
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın
4. Aşağıdaki dosyayı kopyala-yapıştır ve **RUN** butonuna tıkla:

📁 Dosya: `kktc-ulasim-app/supabase/reports_rls_policies.sql`

Bu script şu politikaları oluşturur:
- ✅ Raporları okuma (SELECT) - Tüm kullanıcılar
- ✅ Rapor oluşturma (INSERT) - Tüm kullanıcılar (public reporting için)
- ✅ Rapor güncelleme (UPDATE) - Tüm kullanıcılar (admin için)
- ✅ Rapor silme (DELETE) - Tüm kullanıcılar (admin için)

### Adım 2: Admin Sayfasını Yenile

1. Admin paneline git: `/admin/reports`
2. Sayfayı yenile (F5 veya Ctrl+R)
3. Raporlar artık görünmeli ✅

## 🧪 Test Et

### Veritabanında Rapor Var mı Kontrol Et

Supabase SQL Editor'de:

```sql
-- Raporları listele
SELECT * FROM reports ORDER BY created_at DESC;

-- RLS politikalarını kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'reports'
ORDER BY policyname;
```

### Test Raporu Oluştur

Eğer hiç rapor yoksa, test için bir rapor oluşturabilirsiniz:

```sql
-- Önce bir schedule_id al
SELECT id, departure_time FROM schedules LIMIT 1;

-- Test raporu ekle (yukarıdaki schedule_id'yi kullan)
INSERT INTO reports (schedule_id, issue_type, description, is_resolved)
VALUES (
  'SCHEDULE_ID_BURAYA',  -- Yukarıdan aldığınız ID
  'other',
  'Test raporu',
  false
);
```

## 🔐 Güvenlik Notu

**⚠️ ÖNEMLİ**: Bu çözüm RLS politikalarını `anon` (anonim) kullanıcılara da açıyor. Bu, admin panelinin mevcut cookie-based authentication sistemi ile çalışması için gerekli.

**Daha Güvenli Alternatif**: Admin panelinde Supabase Auth kullanmak ve sadece `authenticated` kullanıcılara izin vermek. Bu durumda:

1. Admin login sistemini Supabase Auth'a entegre edin
2. RLS politikalarında `TO anon` kısımlarını kaldırın
3. Sadece `TO authenticated` kullanın

## 📋 Hızlı Kontrol Listesi

Sırayla şunları kontrol edin:

- [ ] Reports tablosu mevcut mu? → SQL Editor'de `SELECT * FROM reports;`
- [ ] RLS etkin mi? → SQL Editor'de yukarıdaki RLS kontrol sorgusunu çalıştır
- [ ] RLS politikaları var mı? → SQL Editor'de yukarıdaki politika sorgusunu çalıştır
- [ ] Politikalar yoksa → `reports_rls_policies.sql` dosyasını çalıştır
- [ ] Veritabanında rapor var mı? → SQL Editor'de `SELECT COUNT(*) FROM reports WHERE is_resolved = false;`
- [ ] Admin sayfasında giriş yaptınız mı? → `/admin/login` sayfasına git
- [ ] Browser Console'da hata var mı? → F12 ile kontrol et

## 🐛 Hala Çözülmedi mi?

### Console'da Hata Mesajları

1. Admin sayfasını aç: `/admin/reports`
2. F12 tuşuna bas ve Console sekmesini aç
3. Kırmızı hata mesajlarını kontrol et

Yaygın hatalar:

**"Failed to fetch reports"**: 
- RLS politikaları eksik veya yanlış
- `reports_rls_policies.sql` dosyasını çalıştırın

**"Error fetching reports: ..."**:
- Console'daki detaylı hata mesajını kontrol edin
- Supabase Dashboard'da **Logs** sekmesini kontrol edin

**Hiç hata yok ama raporlar görünmüyor**:
- Veritabanında gerçekten rapor var mı kontrol edin
- `is_resolved = false` olan raporlar var mı kontrol edin

### Server Console Logları

Geliştirme modunda (`npm run dev`) terminal/console'u kontrol edin:

```
📊 Reports fetched: 0
📋 Raw reports data: []
✅ Valid reports: 0
```

Bu loglar `app/admin/reports/page.tsx` dosyasındaki `getReports()` fonksiyonundan geliyor.

## 📚 İlgili Dosyalar

- 📄 `app/admin/reports/page.tsx` - Reports sayfası (server component)
- 📄 `components/admin/ReportsTable.tsx` - Reports tablosu (client component)
- 📄 `supabase/reports_rls_policies.sql` - **YENİ**: RLS politikaları
- 📄 `supabase/create_tables.sql` - Tablo oluşturma scripti
- 📄 `lib/supabase/server.ts` - Supabase server client
- 📄 `middleware.ts` - Admin authentication middleware

---

**Güncelleme**: 2025-12-16  
**Durum**: RLS politika scripti oluşturuldu ✅  
**Değişiklikler**:
- ✅ `supabase/reports_rls_policies.sql` - **YENİ**: RLS politikaları oluşturma scripti
- ✅ `HIZLI_COZUM.md` - Admin raporlar sorunu eklendi
- ✅ `REPORTS_COZUM.md` - **YENİ**: Detaylı raporlar çözümü
