# Görev: Supabase Entegrasyonu ve Routes Listesi

## Teknoloji Stack
- Next.js (App Router)
- Supabase

## Görevler

### 1. Supabase İstemcisi Oluşturma
- `src/lib/supabaseClient.ts` adında bir dosya oluştur
- Supabase istemcisini (`createClient`) başlat
- `.env.local` dosyasındaki `NEXT_PUBLIC_` değişkenlerini kullan

### 2. Ana Sayfa Düzenleme
- `src/app/page.tsx` dosyasını düzenle
- Sayfa yüklendiğinde Supabase'deki `routes` tablosundan verileri çek
- `companies` tablosunu da join et (ilişkili veriyi çek)
- Gelen veriyi ekrana basit, şık bir Tailwind CSS listesi (kartlar halinde) olarak göster
- Eğer veri yoksa veya hata varsa kullanıcıya mesaj göster

### 3. Veritabanı İlişkisi
- `routes` tablosunda `company_id` var, bu `companies` tablosuna bağlı

### 4. TypeScript Interface'leri
- `Route` interface'ini tanımla
- `Company` interface'ini tanımla
- Tip hatası alınmaması için gerekli tipleri ekle

