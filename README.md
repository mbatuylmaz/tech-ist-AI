# Tech Ist AI

Retell.ai ile oluşturulmuş sesli AI asistan web uygulaması.

## Özellikler

- Basit ve kullanıcı dostu arayüz
- Start butonuna tıklayarak sesli konuşma başlatma
- Gerçek zamanlı sesli AI asistan desteği

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd "tech-ist-ai"
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables dosyasını oluşturun:
```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin ve Retell.ai bilgilerinizi girin:
```
VITE_RETELL_AGENT_ID=your_agent_id
VITE_RETELL_API_KEY=your_api_key
```

## Geliştirme

Geliştirme sunucusunu başlatmak için:
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## Build

Production build oluşturmak için:
```bash
npm run build
```

Build çıktısı `dist` klasöründe olacaktır.

## Vercel'e Deploy

### 1. GitHub'a Push

Projeyi GitHub'a push edin:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel'de Proje Oluşturma

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Framework Preset olarak "Vite" seçin

### 3. Environment Variables Ayarlama

Vercel proje ayarlarında "Environment Variables" bölümüne gidin ve şu değişkenleri ekleyin:

- **Name:** `VITE_RETELL_AGENT_ID`
- **Value:** `agent_e137bdf68f6bc9474f8fd37c1e`
- **Environment:** Production, Preview, Development (hepsini seçin)

- **Name:** `VITE_RETELL_API_KEY`
- **Value:** `key_fc2acc5bad35c0fe1b46e2ca033d`
- **Environment:** Production, Preview, Development (hepsini seçin)

**Önemli:** Vite'da environment variables kullanmak için `VITE_` öneki gereklidir. Bu değişkenler istemci tarafında kullanılabilir hale gelir.

### 4. Deploy

Environment variables'ları ekledikten sonra "Deploy" butonuna tıklayın. Vercel otomatik olarak projeyi build edip deploy edecektir.

## Notlar

- Environment variables'ları `.env.local` dosyasında saklayın ve bu dosyayı Git'e commit etmeyin
- API key'lerinizi güvenli tutun ve public repository'lerde paylaşmayın
- Vercel'de environment variables ekledikten sonra projeyi yeniden deploy etmeniz gerekebilir

## Teknolojiler

- React 18
- Vite
- Retell.ai SDK

