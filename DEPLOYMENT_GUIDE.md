# 🚀 Poysha POS Deployment & APK Build Guide

এই প্রজেক্টটি এখন **Cloudflare Pages**-এ ওয়েবসাইট হিসেবে হোস্ট করার জন্য এবং **GitHub Actions** দিয়ে স্বয়ংক্রিয়ভাবে **Android APK** তৈরি করার জন্য সম্পূর্ণ প্রস্তুত।

---

## 📱 ১. GitHub Actions দিয়ে Android APK তৈরি ও ডাউনলোড করার নিয়ম

### অপশন ক: সাধারণ বিল্ড (সবচেয়ে সহজ)
1. আপনার GitHub রিপোজিটোরিতে কোড পুশ করুন (`git push origin main`)।
2. GitHub-এ গিয়ে **Actions** ট্যাবে ক্লিক করুন।
3. বামপাশে **"Build Android APK (Poysha POS)"** ওয়ার্কফ্লো সিলেক্ট করুন।
4. **"Run workflow"** বাটনে ক্লিক করুন (অথবা পুশ করলেই স্বয়ংক্রিয়ভাবে রান হবে)।
5. বিল্ড সম্পন্ন হলে (সবুজ টিক চিহ্ন আসলে), ওই রানটিতে ক্লিক করুন এবং নিচে **Artifacts** সেকশনে থাকা **`Poysha-POS-Debug-APK`** ডাউনলোড করে যেকোনো অ্যান্ড্রয়েড ফোনে ইনস্টল করুন।

### অপশন খ: GitHub Release তৈরি করে APK রিলিজ করা
টার্মিনালে নতুন ভার্সন ট্যাগ বানিয়ে পুশ করলেই স্বয়ংক্রিয়ভাবে GitHub Release তৈরি হয়ে APK ফাইল অ্যাটাচ হয়ে যাবে:
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 🌐 ২. Cloudflare Pages এ ওয়েবসাইট হোস্ট করার নিয়ম

### অপশন ক: Cloudflare Dashboard এর মাধ্যমে (সর্বোত্তম ও সহজ উপায়)
1. **[Cloudflare Dashboard](https://dash.cloudflare.com/)**-এ লগইন করুন।
2. **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**-এ যান।
3. আপনার GitHub অ্যাকাউন্ট কানেক্ট করে `Poysha POS` রিপোজিটরিটি সিলেক্ট করুন।
4. **Build Settings** এভাবে সেট করুন:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. **"Save and Deploy"** বাটনে ক্লিক করুন। ২ মিনিটের মধ্যে আপনার লাইভ ওয়েবসাইট URL তৈরি হয়ে যাবে!

---

### অপশন খ: GitHub Actions এর মাধ্যমে Cloudflare Pages এ অটো-ডিপ্লয়
1. Cloudflare Dashboard থেকে আপনার **Account ID** ও একটি **API Token** তৈরি করুন (Permissions: `Cloudflare Pages: Edit`)।
2. GitHub রিপোজিটরির **Settings** > **Secrets and variables** > **Actions** এ গিয়ে ২টি সিক্রেট যোগ করুন:
   - `CLOUDFLARE_ACCOUNT_ID`: আপনার ক্লাউডফ্লেয়ার একাউন্ট আইডি
   - `CLOUDFLARE_API_TOKEN`: আপনার ক্লাউডফ্লেয়ার এপিআই টোকেন
3. এরপর `main` ব্রাঞ্চে কোনো পুশ করলেই স্বয়ংক্রিয়ভাবে ক্লাউডফ্লেয়ারে ডিপ্লয় হয়ে যাবে।

---

## 🛠️ প্রজেক্টের কনফিগারেশন সামারি
- **ওয়েব বিল্ড ডিরেক্টরি**: `dist/` (`npm run build` কমান্ড চালালে সব HTML/JS/CSS এবং রুট ফাইলগুলো অপ্টিমাইজড হয়ে `dist/` এ প্রস্তুত হয়)
- **ক্যাপাসিটর অ্যান্ড্রয়েড কনফিগ**: `capacitor.config.json` ও `android/` ফোল্ডার
- **ক্লাউডফ্লেয়ার সেটিংস**: `_headers`, `_redirects`, `wrangler.toml`
- **গিটহাব একশন**: `.github/workflows/build-apk.yml`, `.github/workflows/deploy-cloudflare.yml`
