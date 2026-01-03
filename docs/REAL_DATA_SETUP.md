# API ve Firebase Kurulum Rehberi

Bu rehber, Finance Tracker uygulamasında mock data'dan gerçek API'lere ve Firebase'e geçiş için adım adım talimatlar içerir.

---

## 📋 Gerekli Hesaplar

### 1. TwelveData API (Hisse Senetleri için)
### 2. CoinGecko API (Kripto Paralar için)  
### 3. Firebase (Authentication ve Database için)

---

## 🔑 ADIM 1: API Anahtarlarını Alma

### TwelveData API Key

1. **Kayıt Ol**: https://twelvedata.com/pricing
   - "Free Plan" seçin (800 request/gün)
   - Email ile kayıt olun

2. **API Key Al**:
   - Dashboard'a gidin
   - "API Key" bölümünü bulun
   - Anahtarı kopyalayın (örn: `a1b2c3d4e5f6g7h8i9j0`)

### CoinGecko API Key

1. **Kayıt Ol**: https://www.coingecko.com/en/api/pricing
   - "Demo Plan" seçin (ücretsiz, 10,000 request/ay)
   - Email ile kayıt olun

2. **API Key Al**:
   - Dashboard'a gidin
   - "API Keys" sekmesine tıklayın
   - Yeni key oluşturun
   - Anahtarı kopyalayın (örn: `CG-xyz123abc456`)

---

## 🔑 ADIM 2: Firebase Projesi Oluşturma

### Firebase Console Setup

1. **Firebase Console'a Git**: https://console.firebase.google.com/

2. **Yeni Proje Oluştur**:
   - "Add project" tıklayın
   - Proje adı: `finance-tracker` (veya istediğiniz isim)
   - Google Analytics: İsteğe bağlı (şimdilik kapatabilirsiniz)
   - "Create project" tıklayın

3. **iOS App Ekle**:
   - Project Overview'da iOS simgesine tıklayın
   - Bundle ID: `org.reactjs.native.example.FinanceTracker`
   - App nickname: `Finance Tracker iOS`
   - "Register app" tıklayın
   - **`GoogleService-Info.plist`** dosyasını indirin
   - Bu dosyayı `ios/` klasörüne kopyalayın

4. **Android App Ekle** (opsiyonel):
   - Project Overview'da Android simgesine tıklayın
   - Package name: `com.financetracker`
   - "Register app" tıklayın
   - **`google-services.json`** dosyasını indirin
   - Bu dosyayı `android/app/` klasörüne kopyalayın

### Firebase Authentication Aktifleştirme

1. **Authentication'a Git**:
   - Sol menüden "Build" > "Authentication" seçin
   - "Get started" tıklayın

2. **Email/Password Aktifleştir**:
   - "Sign-in method" sekmesine gidin
   - "Email/Password" seçin
   - Enable yapın
   - "Save" tıklayın

### Firestore Database Oluşturma

1. **Firestore'a Git**:
   - Sol menüden "Build" > "Firestore Database" seçin
   - "Create database" tıklayın

2. **Güvenlik Kuralları**:
   - "Start in test mode" seçin (geliştirme için)
   - Location: `us-central` (veya size yakın olan)
   - "Enable" tıklayın

3. **Firebase Config Bilgilerini Al**:
   - Project Settings'e gidin (⚙️ simgesi)
   - "General" sekmesinde aşağı kaydırın
   - "Your apps" bölümünde iOS/Android app'inizi bulun
   - "Config" altında şu bilgileri göreceksiniz:
     ```
     apiKey: "AIza..."
     authDomain: "finance-tracker-xxx.firebaseapp.com"
     projectId: "finance-tracker-xxx"
     storageBucket: "finance-tracker-xxx.appspot.com"
     messagingSenderId: "123456789"
     appId: "1:123456789:ios:abc123"
     ```

---

## 📝 ADIM 3: .env Dosyası Oluşturma

### .env Dosyası Oluştur

Proje kök dizininde `.env` dosyası oluşturun:

```bash
# Proje kök dizininde
touch .env
```

### .env Dosyasını Düzenle

`.env` dosyasını açın ve şu bilgileri ekleyin:

```env
# API Keys
TWELVEDATA_API_KEY=buraya_twelvedata_api_key_yazin
COINGECKO_API_KEY=buraya_coingecko_api_key_yazin

# Firebase Configuration
FIREBASE_API_KEY=buraya_firebase_api_key_yazin
FIREBASE_AUTH_DOMAIN=buraya_auth_domain_yazin
FIREBASE_PROJECT_ID=buraya_project_id_yazin
FIREBASE_STORAGE_BUCKET=buraya_storage_bucket_yazin
FIREBASE_MESSAGING_SENDER_ID=buraya_messaging_sender_id_yazin
FIREBASE_APP_ID=buraya_app_id_yazin
```

### Örnek Dolu .env:

```env
# API Keys
TWELVEDATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
COINGECKO_API_KEY=CG-xyz123abc456

# Firebase Configuration
FIREBASE_API_KEY=AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr
FIREBASE_AUTH_DOMAIN=finance-tracker-12345.firebaseapp.com
FIREBASE_PROJECT_ID=finance-tracker-12345
FIREBASE_STORAGE_BUCKET=finance-tracker-12345.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:ios:abc123def456ghi789
```

---

## 🔒 ADIM 4: .env Dosyasını Güvenli Tutma

### .gitignore Kontrolü

`.gitignore` dosyasında `.env` olduğundan emin olun:

```bash
# .gitignore içinde
.env
```

### Mevcut .env'yi Git'ten Kaldır (eğer yanlışlıkla eklendiyse)

```bash
git rm --cached .env
git commit -m "Remove .env from git tracking"
```

### .env.example Güncelle

`.env.example` dosyasını güncelleyin (bu dosya GitHub'a gidecek):

```env
# API Keys
TWELVEDATA_API_KEY=your_twelvedata_api_key_here
COINGECKO_API_KEY=your_coingecko_api_key_here

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here
```

---

## 🔧 ADIM 5: iOS Firebase Kurulumu

### Podfile Güncelleme

`ios/Podfile` dosyasını açın ve Firebase pod'larını ekleyin:

```ruby
# Firebase pods
pod 'Firebase/Auth'
pod 'Firebase/Firestore'
```

### Pods Yükleme

```bash
cd ios
pod install
cd ..
```

### GoogleService-Info.plist Xcode'a Ekleme

1. Xcode'da `ios/FinanceTracker.xcworkspace` açın
2. `GoogleService-Info.plist` dosyasını Xcode'daki `FinanceTracker` klasörüne sürükleyin
3. "Copy items if needed" seçeneğini işaretleyin
4. Target: `FinanceTracker` seçili olsun

---

## 🚀 ADIM 6: Uygulamayı Test Etme

### Metro Bundler'ı Temizle ve Başlat

```bash
npm start --reset-cache
```

### iOS'ta Çalıştır

Yeni terminalde:

```bash
npm run ios
```

### Test Adımları

1. **API Testi**:
   - Watchlist'e yeni asset ekleyin
   - Gerçek fiyatların geldiğini kontrol edin
   - Console'da `[TwelveData] Using mock data` mesajı GÖRMEMEK gerekir

2. **Firebase Authentication Testi**:
   - Yeni kullanıcı kaydı yapın
   - Firebase Console > Authentication'da kullanıcıyı görün
   - Logout/Login yapın

3. **Firestore Testi**:
   - Watchlist'e asset ekleyin
   - Firebase Console > Firestore'da `watchlists` collection'ını görün
   - Uygulamayı kapatıp açın, data kalıcı olmalı

---

## ✅ Kontrol Listesi

- [ ] TwelveData API key alındı
- [ ] CoinGecko API key alındı
- [ ] Firebase projesi oluşturuldu
- [ ] Firebase Authentication aktifleştirildi
- [ ] Firestore Database oluşturuldu
- [ ] `.env` dosyası oluşturuldu ve dolduruldu
- [ ] `.gitignore` `.env` içeriyor
- [ ] `.env.example` güncellendi
- [ ] `GoogleService-Info.plist` iOS'a eklendi
- [ ] Firebase pods yüklendi
- [ ] Uygulama test edildi
- [ ] Gerçek data geliyor
- [ ] Firebase'de kullanıcılar görünüyor
- [ ] Firestore'da data görünüyor

---

## 🆘 Sorun Giderme

### "API key is invalid" Hatası
- API key'i doğru kopyaladığınızdan emin olun
- `.env` dosyasında tırnak işareti KULLANMAYIN
- Metro bundler'ı restart edin: `npm start --reset-cache`

### Firebase Bağlantı Hatası
- `GoogleService-Info.plist` doğru yerde mi kontrol edin
- Bundle ID eşleşiyor mu kontrol edin
- Pods yeniden yükleyin: `cd ios && pod install && cd ..`

### Data Hala Mock
- `.env` dosyası proje kök dizininde mi?
- Değişken isimleri doğru mu? (BÜYÜK HARF)
- Metro bundler restart edildi mi?

---

## 📚 Ek Kaynaklar

- [TwelveData API Docs](https://twelvedata.com/docs)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [React Native Config](https://github.com/luggit/react-native-config)
