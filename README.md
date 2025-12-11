# KKTC Ulaşım Uygulaması

KKTC Ulaşım Uygulaması, Kuzey Kıbrıs Türk Cumhuriyeti'ndeki ulaşım rotalarını ve şirket bilgilerini görüntülemek için geliştirilmiş modern bir web uygulamasıdır.

## 🚀 Teknolojiler

- **Next.js 16.0.9** - React tabanlı full-stack framework (App Router)
- **React 19.2.1** - UI kütüphanesi
- **TypeScript 5** - Tip güvenliği
- **Supabase** - Backend ve veritabanı servisi
- **Tailwind CSS 4** - Utility-first CSS framework

## 📋 Özellikler

- ✅ Supabase ile veritabanı entegrasyonu
- ✅ Routes ve Companies tablolarından veri çekme
- ✅ Modern ve şık Tailwind CSS tasarımı
- ✅ TypeScript ile tip güvenliği
- ✅ Responsive tasarım
- ✅ Hata yönetimi ve kullanıcı bildirimleri

## 🏗️ Proje Yapısı

```
kktc-ulasim-app/
├── src/
│   ├── app/              # Next.js App Router sayfaları
│   ├── lib/              # Yardımcı fonksiyonlar ve Supabase client
│   └── types/            # TypeScript type tanımlamaları
├── public/               # Statik dosyalar
└── .env.local           # Ortam değişkenleri (git'e eklenmez)
```

## 🚦 Kurulum

### Gereksinimler

- **Node.js** 18+ 
- **npm** veya **yarn** veya **pnpm**
- **Supabase** hesabı ve projesi
- **Git** (opsiyonel)

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd kktc-ulasim-app/kktc-ulasim-app
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın**
   
   `kktc-ulasim-app` klasörü içinde `.env.local` dosyası oluşturun ve Supabase bilgilerinizi ekleyin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   > **Önemli:** `.env.local` dosyası git'e eklenmez. Supabase bilgilerinizi Supabase Dashboard'dan alabilirsiniz.

4. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

5. **Tarayıcıda açın**
   
   [http://localhost:3004](http://localhost:3004) adresine gidin
   
   > **Not:** Uygulama varsayılan olarak 3004 portunda çalışır.

## 📊 Veritabanı Yapısı

Uygulama Supabase veritabanında iki ana tablo kullanır:

### Routes Tablosu
- `id` - Birincil anahtar (UUID veya Integer)
- `company_id` - Companies tablosuna foreign key
- Route bilgileri (başlangıç, bitiş noktası, mesafe, süre vb.)

### Companies Tablosu
- `id` - Birincil anahtar (UUID veya Integer)
- Şirket bilgileri (isim, logo, iletişim bilgileri vb.)

**İlişki:** `routes.company_id` → `companies.id` (Foreign Key)

Uygulama, routes tablosundan veri çekerken companies tablosunu da join ederek ilişkili şirket bilgilerini birlikte getirir.

## 🛠️ Geliştirme

### Mevcut Scriptler

```bash
# Geliştirme sunucusunu başlat (port 3004)
npm run dev

# Production build oluştur
npm run build

# Production sunucusunu başlat (port 3004)
npm start

# Lint kontrolü
npm run lint
```

### Port Yapılandırması

Uygulama varsayılan olarak **3004** portunda çalışır. Portu değiştirmek için `package.json` dosyasındaki script'leri düzenleyebilirsiniz.

## 📝 Görevler

Detaylı görev listesi için [ticket.md](./ticket.md) dosyasına bakabilirsiniz.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje [LICENSE](./LICENSE) dosyasında belirtilen lisans altında lisanslanmıştır.

## 👥 Geliştirici

AlesSystems - Veri İşleme Merkezi
