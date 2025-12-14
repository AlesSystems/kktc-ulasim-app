# 🎯 KKTC Ulaşım - Yönetim Paneli (Admin Dashboard) Geliştirme Planı

## 📋 Genel Bakış

Bu dokümantasyon, KKTC Ulaşım Rehberi projesine tam kapsamlı, güvenli ve modern bir Yönetim Paneli eklenmesi için detaylı geliştirme planını içermektedir.

**Teknoloji Stack:**
- Next.js 16 (App Router)
- TypeScript 5
- Supabase (Backend & Database)
- Tailwind CSS 4
- Lucide React (İkonlar)

---

## 🛡️ AŞAMA 1: Güvenlik ve Kurulum (Middleware & Layout)

### 1.1 Ortam Değişkenleri (.env.local)

```env
# Mevcut değişkenler
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Yeni eklenen
ADMIN_SECRET_KEY=your-super-secret-key-here-change-in-production
```

### 1.2 Middleware Oluşturma (`src/middleware.ts`)

**Dosya:** `kktc-ulasim-app/src/middleware.ts`

**Görevler:**
- `/admin` rotasını koruma altına al
- Cookie veya header'dan `ADMIN_SECRET_KEY` kontrolü yap
- Geçersiz erişimde `/admin/login` sayfasına yönlendir
- Geçerli oturum varsa devam et

**Özellikler:**
- Next.js Middleware API kullanımı
- Cookie tabanlı oturum yönetimi
- Güvenli hash kontrolü (bcrypt veya basit string karşılaştırma)

### 1.3 Admin Login Sayfası (`src/app/admin/login/page.tsx`)

**Dosya:** `kktc-ulasim-app/src/app/admin/login/page.tsx`

**Özellikler:**
- Basit bir login formu
- `ADMIN_SECRET_KEY` ile giriş yapma
- Başarılı girişte cookie set etme
- `/admin` sayfasına yönlendirme
- Hata durumunda kullanıcıya bilgi verme

**Tasarım:**
- Modern, minimal login ekranı
- Tailwind CSS ile stil
- Responsive tasarım

### 1.4 Admin Layout (`src/app/admin/layout.tsx`)

**Dosya:** `kktc-ulasim-app/src/app/admin/layout.tsx`

**Bileşenler:**

#### Sidebar (Sol Menü)
- **Sabit pozisyon** (desktop'ta sol tarafta)
- **Menü Öğeleri:**
  - 📊 Dashboard (`/admin`)
  - 📩 Gelen Raporlar (`/admin/reports`)
  - 🚌 Sefer Yönetimi (`/admin/schedules`)
  - 📍 Durak Yönetimi (`/admin/stops`) - Gelecek için hazır
  - 🚪 Çıkış (Logout)

#### Mobil Uyumluluk
- **Hamburger Menü** (mobil cihazlarda)
- Sidebar'ı aç/kapat butonu
- Overlay backdrop (mobilde sidebar açıkken)

#### Header
- Üst kısımda sabit header
- Sayfa başlığı
- Kullanıcı bilgisi (opsiyonel)

**Tasarım Özellikleri:**
- Dark mode desteği
- Smooth transitions
- Active route highlighting
- Lucide React ikonları

---

## 📊 AŞAMA 2: Dashboard Özeti

### 2.1 Ana Dashboard Sayfası (`src/app/admin/page.tsx`)

**Dosya:** `kktc-ulasim-app/src/app/admin/page.tsx`

#### İstatistik Kartları (Stats Cards)

**Üst Kısım - 4 Kart:**

1. **Toplam Sefer**
   - Veri: `schedules` tablosu sayımı
   - İkon: 🚌 (Bus)
   - Renk: Mavi tonları

2. **Bekleyen Raporlar**
   - Veri: `reports` tablosunda `is_resolved = false` olanlar
   - İkon: ⚠️ (Alert)
   - Renk: **Kırmızı** (vurgu için)
   - Tıklanabilir → `/admin/reports` sayfasına yönlendir

3. **Kayıtlı Duraklar**
   - Veri: `stops` tablosu sayımı
   - İkon: 📍 (MapPin)
   - Renk: Yeşil tonları

4. **Toplam Şirket**
   - Veri: `companies` tablosu sayımı
   - İkon: 🏢 (Building)
   - Renk: Mor tonları

**Tasarım:**
- Grid layout (4 sütun desktop, 2 sütun tablet, 1 sütun mobil)
- Hover efektleri
- Skeleton loading durumları

#### Son Gelen 5 Rapor Tablosu

**Alt Kısım - Özet Tablo:**

**Kolonlar:**
- Tarih/Saat (`created_at`)
- Sefer Bilgisi (Kalkış → Varış)
- Sorun Türü (`issue_type`)
- Durum (`is_resolved` - Badge olarak)
- Hızlı Aksiyon (Arşivle butonu)

**Özellikler:**
- En son 5 raporu göster
- "Tümünü Gör" butonu → `/admin/reports` sayfasına yönlendir
- Responsive tablo (mobilde kart görünümü)

**Veri Çekme:**
```typescript
// Supabase sorgusu
const { data } = await supabase
  .from('reports')
  .select(`
    *,
    schedules!inner(
      id,
      departure_time,
      routes!inner(
        origin,
        destination
      )
    )
  `)
  .eq('is_resolved', false)
  .order('created_at', { ascending: false })
  .limit(5);
```

---

## 📩 AŞAMA 3: Rapor Yönetim Modülü

### 3.1 Raporlar Sayfası (`src/app/admin/reports/page.tsx`)

**Dosya:** `kktc-ulasim-app/src/app/admin/reports/page.tsx`

#### Tablo Yapısı

**Kolonlar:**
1. **ID** (UUID kısaltılmış)
2. **Tarih/Saat** (`created_at` - formatlanmış)
3. **Sefer Bilgisi**
   - Kalkış Yeri (`routes.origin`)
   - → Varış Yeri (`routes.destination`)
   - Kalkış Saati (`schedules.departure_time`)
4. **Sorun Türü** (`issue_type` - Türkçe etiket)
5. **Açıklama** (`description` - kısaltılmış, tooltip ile tam metin)
6. **Durum** (`is_resolved` - Badge)
7. **Aksiyonlar** (Butonlar)

**Veri Çekme:**
```typescript
const { data, error } = await supabase
  .from('reports')
  .select(`
    *,
    schedules!inner(
      id,
      departure_time,
      routes!inner(
        id,
        origin,
        destination,
        companies(name)
      )
    )
  `)
  .order('created_at', { ascending: false });
```

#### Filtreleme ve Arama

**Filtreler:**
- Durum Filtresi (Tümü / Bekleyen / Çözülen)
- Sorun Türü Filtresi (Dropdown)
- Tarih Aralığı (Opsiyonel)

**Arama:**
- Açıklama metninde arama
- Sefer bilgilerinde arama

#### Aksiyon Butonları

**Her satırda 2 buton:**

1. **✅ Arşivle (Resolve)**
   - İşlev: `is_resolved = true` yapar
   - Onay modalı: "Bu raporu arşivlemek istediğinize emin misiniz?"
   - Başarı mesajı: "Rapor başarıyla arşivlendi"
   - Veriyi değiştirmez, sadece durumu günceller

2. **🛠️ Düzelt (Fix)**
   - İşlev: Düzeltme modalını açar
   - Modal içeriği:
     - Sefer bilgileri (read-only)
     - Mevcut kalkış saati (input)
     - Yeni kalkış saati (input - time picker)
     - Fiyat güncelleme (opsiyonel)
   - "Kaydet" butonu:
     - `schedules.departure_time` günceller
     - `reports.is_resolved = true` yapar
     - Başarı mesajı: "Sefer saati güncellendi ve rapor kapatıldı"

#### Düzeltme Modalı (`src/components/admin/FixReportModal.tsx`)

**Dosya:** `kktc-ulasim-app/src/components/admin/FixReportModal.tsx`

**Özellikler:**
- Form validasyonu
- Loading durumları
- Hata yönetimi
- Başarı animasyonu

**State Yönetimi:**
```typescript
interface FixReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportWithSchedule;
  onSuccess: () => void;
}
```

**API İşlemleri:**
```typescript
// 1. Schedule güncelleme
await supabase
  .from('schedules')
  .update({ departure_time: newTime })
  .eq('id', scheduleId);

// 2. Report arşivleme
await supabase
  .from('reports')
  .update({ is_resolved: true })
  .eq('id', reportId);
```

---

## 🚌 AŞAMA 4: Sefer Yönetim Modülü

### 4.1 Seferler Sayfası (`src/app/admin/schedules/page.tsx`)

**Dosya:** `kktc-ulasim-app/src/app/admin/schedules/page.tsx`

#### Liste Tablosu

**Kolonlar:**
1. **ID** (UUID kısaltılmış)
2. **Şirket** (`companies.name`)
3. **Kalkış Yeri** (`routes.origin`)
4. **Varış Yeri** (`routes.destination`)
5. **Kalkış Saati** (`schedules.departure_time`)
6. **Fiyat** (`schedules.price` - formatlanmış: ₺XX.XX)
7. **Aksiyonlar** (Düzenle, Sil)

**Veri Çekme:**
```typescript
const { data, error } = await supabase
  .from('schedules')
  .select(`
    *,
    routes!inner(
      id,
      origin,
      destination,
      companies(name)
    )
  `)
  .order('departure_time', { ascending: true });
```

#### Filtreleme

**Üst Kısım - Filtre Bileşenleri:**

1. **Şirket Seç** (Dropdown)
   - Tüm şirketleri listele
   - "Tümü" seçeneği

2. **Kalkış Yeri** (Dropdown veya Autocomplete)
   - Tüm unique kalkış yerlerini listele

3. **Varış Yeri** (Dropdown veya Autocomplete)
   - Tüm unique varış yerlerini listele

4. **Temizle** butonu

**Filtre Mantığı:**
```typescript
let query = supabase.from('schedules').select('...');

if (selectedCompany) {
  query = query.eq('routes.company_id', selectedCompany);
}
if (selectedOrigin) {
  query = query.eq('routes.origin', selectedOrigin);
}
if (selectedDestination) {
  query = query.eq('routes.destination', selectedDestination);
}
```

#### Pagination (Sayfalama)

**Özellikler:**
- Sayfa başına 20 kayıt
- Alt kısımda sayfa numaraları
- "Önceki" / "Sonraki" butonları
- Toplam kayıt sayısı gösterimi

**Supabase Pagination:**
```typescript
const pageSize = 20;
const page = 1;
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;

const { data, count } = await supabase
  .from('schedules')
  .select('*', { count: 'exact' })
  .range(from, to);
```

#### CRUD İşlemleri

##### 1. Ekle (+ Yeni Sefer)

**Buton:** Üst kısımda sağ tarafta

**Modal:** `src/components/admin/AddScheduleModal.tsx`

**Form Alanları:**
- Şirket Seçimi (Dropdown - `companies` tablosundan)
- Kalkış Yeri (Autocomplete veya Dropdown)
- Varış Yeri (Autocomplete veya Dropdown)
- Kalkış Saati (Time picker)
- Fiyat (Number input - opsiyonel)

**Validasyon:**
- Tüm zorunlu alanlar dolu olmalı
- Kalkış ve varış yeri farklı olmalı
- Saat formatı kontrolü

**API İşlemi:**
```typescript
// 1. Route var mı kontrol et, yoksa oluştur
let { data: route } = await supabase
  .from('routes')
  .select('id')
  .eq('company_id', companyId)
  .eq('origin', origin)
  .eq('destination', destination)
  .single();

if (!route) {
  // Yeni route oluştur
  const { data: newRoute } = await supabase
    .from('routes')
    .insert({
      company_id: companyId,
      origin,
      destination,
      route_name: `${origin} - ${destination}`,
    })
    .select('id')
    .single();
  route = newRoute;
}

// 2. Schedule ekle
await supabase
  .from('schedules')
  .insert({
    route_id: route.id,
    departure_time: time,
    price: price || null,
  });
```

##### 2. Düzenle (✏️)

**Buton:** Her satırda

**Modal:** `src/components/admin/EditScheduleModal.tsx`

**Form Alanları:**
- Kalkış Saati (Mevcut değerle dolu)
- Fiyat (Mevcut değerle dolu)

**API İşlemi:**
```typescript
await supabase
  .from('schedules')
  .update({
    departure_time: newTime,
    price: newPrice,
  })
  .eq('id', scheduleId);
```

##### 3. Sil (🗑️)

**Buton:** Her satırda

**Onay Modalı:** `src/components/admin/DeleteConfirmModal.tsx`

**Özellikler:**
- Silinecek sefer bilgilerini göster
- "Emin misiniz?" mesajı
- İptal ve Sil butonları
- Sil butonu kırmızı renk

**API İşlemi:**
```typescript
await supabase
  .from('schedules')
  .delete()
  .eq('id', scheduleId);
```

**Not:** Cascade delete kontrolü yapılmalı (reports tablosunda bu schedule'a ait raporlar varsa uyarı göster)

---

## 🎨 Tasarım Dili ve Bileşenler

### 4.2 Ortak Bileşenler

#### Admin Stats Card (`src/components/admin/StatsCard.tsx`)

**Özellikler:**
- İkon, başlık, değer
- Hover efektleri
- Loading skeleton
- Tıklanabilir (opsiyonel)

#### Admin Table (`src/components/admin/AdminTable.tsx`)

**Özellikler:**
- Zebra striping (alternatif satır renkleri)
- Hover efektleri
- Responsive (mobilde kart görünümü)
- Sıralama (opsiyonel)

#### Admin Modal (`src/components/admin/AdminModal.tsx`)

**Özellikler:**
- Backdrop blur
- Smooth animations
- Close button
- Responsive

#### Loading Skeleton (`src/components/admin/SkeletonCard.tsx`)

**Özellikler:**
- Pulse animasyonu
- Tailwind CSS ile
- Farklı boyutlar

### 4.3 İkonlar

**Kütüphane:** `lucide-react`

**Kurulum:**
```bash
npm install lucide-react
```

**Kullanım:**
```typescript
import { 
  BarChart3, 
  Mail, 
  Bus, 
  MapPin, 
  Building, 
  LogOut,
  Menu,
  X,
  Check,
  Wrench,
  Trash2,
  Plus,
  Edit,
  Filter,
  Search
} from 'lucide-react';
```

### 4.4 Renk Paleti (Tailwind CSS)

**Ana Renkler:**
- Mavi: `blue-500`, `blue-600`, `blue-700`
- Kırmızı: `red-500`, `red-600` (bekleyen raporlar için)
- Yeşil: `green-500`, `green-600` (başarı mesajları)
- Gri: `zinc-100` - `zinc-900` (arka planlar)

**Dark Mode:**
- Tüm bileşenler dark mode desteği
- `dark:` prefix ile Tailwind sınıfları

---

## 📁 Dosya Yapısı

```
kktc-ulasim-app/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout (sidebar + header)
│   │   │   ├── page.tsx             # Dashboard ana sayfa
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login sayfası
│   │   │   ├── reports/
│   │   │   │   └── page.tsx         # Rapor yönetim sayfası
│   │   │   └── schedules/
│   │   │       └── page.tsx        # Sefer yönetim sayfası
│   │   └── ...
│   ├── components/
│   │   ├── admin/
│   │   │   ├── StatsCard.tsx        # İstatistik kartı
│   │   │   ├── AdminTable.tsx       # Genel tablo bileşeni
│   │   │   ├── AdminModal.tsx       # Genel modal bileşeni
│   │   │   ├── SkeletonCard.tsx     # Loading skeleton
│   │   │   ├── FixReportModal.tsx   # Rapor düzeltme modalı
│   │   │   ├── AddScheduleModal.tsx # Yeni sefer ekleme modalı
│   │   │   ├── EditScheduleModal.tsx # Sefer düzenleme modalı
│   │   │   └── DeleteConfirmModal.tsx # Silme onay modalı
│   │   └── ...
│   ├── lib/
│   │   ├── supabaseClient.ts        # Mevcut (güncellenecek)
│   │   └── adminAuth.ts             # Admin auth yardımcı fonksiyonları
│   ├── middleware.ts                 # Next.js middleware (yeni)
│   └── types/
│       └── index.ts                  # Mevcut (güncellenecek)
```

---

## 🔐 Güvenlik Notları

### 1. Admin Secret Key
- Production'da güçlü bir key kullanın
- `.env.local` dosyasını git'e eklemeyin
- Her ortam için farklı key kullanın

### 2. Supabase Row Level Security (RLS)
- Admin işlemleri için RLS politikaları kontrol edilmeli
- Service role key kullanılabilir (sadece server-side)

### 3. Cookie Güvenliği
- HttpOnly flag kullanın
- Secure flag (HTTPS'de)
- SameSite=Strict

### 4. Rate Limiting
- Login denemelerinde rate limiting eklenebilir
- API çağrılarında throttling

---

## 📝 TypeScript Tipleri

### Yeni Tipler (`src/types/index.ts`)

```typescript
// Admin tipleri
export interface AdminStats {
  totalSchedules: number;
  pendingReports: number;
  totalStops: number;
  totalCompanies: number;
}

export interface ReportWithSchedule {
  id: string;
  schedule_id: string;
  issue_type: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
  schedules: {
    id: string;
    departure_time: string;
    routes: {
      id: string;
      origin: string;
      destination: string;
      companies: {
        name: string;
      };
    };
  };
}

export interface ScheduleWithRoute {
  id: string;
  departure_time: string;
  price: number | null;
  route_id: string;
  routes: {
    id: string;
    origin: string;
    destination: string;
    companies: {
      id: string;
      name: string;
    };
  };
}

export interface Company {
  id: string;
  name: string;
}

export interface Stop {
  id: string;
  name: string;
  // Diğer alanlar
}
```

---

## 🚀 Geliştirme Adımları (Sıralı)

### Faz 1: Temel Altyapı
1. ✅ `lucide-react` paketini yükle
2. ✅ `.env.local` dosyasına `ADMIN_SECRET_KEY` ekle
3. ✅ `src/middleware.ts` oluştur
4. ✅ `src/lib/adminAuth.ts` oluştur
5. ✅ `src/app/admin/login/page.tsx` oluştur
6. ✅ `src/app/admin/layout.tsx` oluştur

### Faz 2: Dashboard
7. ✅ `src/components/admin/StatsCard.tsx` oluştur
8. ✅ `src/components/admin/SkeletonCard.tsx` oluştur
9. ✅ `src/app/admin/page.tsx` oluştur
10. ✅ Supabase sorgularını test et

### Faz 3: Rapor Yönetimi
11. ✅ `src/components/admin/AdminTable.tsx` oluştur
12. ✅ `src/components/admin/AdminModal.tsx` oluştur
13. ✅ `src/components/admin/FixReportModal.tsx` oluştur
14. ✅ `src/app/admin/reports/page.tsx` oluştur
15. ✅ Filtreleme ve arama özelliklerini ekle

### Faz 4: Sefer Yönetimi
16. ✅ `src/components/admin/AddScheduleModal.tsx` oluştur
17. ✅ `src/components/admin/EditScheduleModal.tsx` oluştur
18. ✅ `src/components/admin/DeleteConfirmModal.tsx` oluştur
19. ✅ `src/app/admin/schedules/page.tsx` oluştur
20. ✅ Pagination ekle
21. ✅ Filtreleme ekle

### Faz 5: Test ve İyileştirme
22. ✅ Tüm sayfaları test et
23. ✅ Responsive tasarımı kontrol et
24. ✅ Dark mode testi
25. ✅ Hata yönetimini iyileştir
26. ✅ Loading durumlarını optimize et

---

## 🧪 Test Senaryoları

### 1. Güvenlik Testleri
- ❌ Geçersiz key ile `/admin` erişimi → Login sayfasına yönlendirme
- ✅ Geçerli key ile giriş → Dashboard'a erişim
- ❌ Cookie silindikten sonra erişim → Login sayfasına yönlendirme

### 2. Dashboard Testleri
- ✅ İstatistik kartlarının doğru sayıları göstermesi
- ✅ Bekleyen raporların kırmızı renkte görünmesi
- ✅ Son 5 raporun listelenmesi
- ✅ "Tümünü Gör" butonunun çalışması

### 3. Rapor Yönetimi Testleri
- ✅ Raporların listelenmesi
- ✅ Arşivle butonunun çalışması
- ✅ Düzelt modalının açılması
- ✅ Sefer saatinin güncellenmesi
- ✅ Filtreleme ve aramanın çalışması

### 4. Sefer Yönetimi Testleri
- ✅ Seferlerin listelenmesi
- ✅ Yeni sefer ekleme
- ✅ Sefer düzenleme
- ✅ Sefer silme (onay ile)
- ✅ Pagination çalışması
- ✅ Filtreleme çalışması

---

## 📚 Ek Notlar

### Performans Optimizasyonları
- Server Components kullanımı (mümkün olduğunca)
- Client Components sadece interaktif öğeler için
- Supabase sorgularında `select()` ile sadece gerekli alanları çek
- Pagination ile büyük veri setlerini yönet

### Erişilebilirlik (Accessibility)
- ARIA etiketleri
- Klavye navigasyonu
- Focus yönetimi
- Ekran okuyucu desteği

### Hata Yönetimi
- Try-catch blokları
- Kullanıcı dostu hata mesajları
- Toast bildirimleri (opsiyonel)
- Error boundary (gelecek için)

---

## ✅ Tamamlanma Kriterleri

- [ ] Tüm 4 aşama tamamlandı
- [ ] Tüm sayfalar responsive
- [ ] Dark mode çalışıyor
- [ ] Tüm CRUD işlemleri çalışıyor
- [ ] Güvenlik kontrolleri aktif
- [ ] Loading durumları mevcut
- [ ] Hata yönetimi yapıldı
- [ ] TypeScript tipleri tanımlandı
- [ ] Kod temiz ve modüler
- [ ] Test senaryoları geçti

---

**Son Güncelleme:** Plan oluşturuldu
**Durum:** 📝 Planlama Aşaması
**Tahmini Süre:** 2-3 gün (tek geliştirici)

