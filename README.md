<div align="center">

<img src="icon.png" alt="FEKO 101 Logo" width="120" height="120" style="border-radius:20px"/>

# 🁣 FEKO 101

### Professional Domino Köməkçisi · Domino Assistant

[![PWA](https://img.shields.io/badge/PWA-Ready-3b82f6?style=for-the-badge&logo=googlechrome&logoColor=white)](https://farrukhmammadli.github.io/feko101)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-0d1117?style=for-the-badge&logo=android&logoColor=3DDC84)](https://farrukhammadli.github.io/feko101)
[![Language](https://img.shields.io/badge/Language-Azerbaijani-00B4D8?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[🌐 Canlı Demo](https://farrukhammadli.github.io/feko101)** · **[📱 APK Yüklə](#-apk-yüklə)** · **[📖 Qaydalar](#-oyun-qaydaları)**

</div>

---

## 🎯 Haqqında

**FEKO 101** — domino oyunçuları üçün hazırlanmış ağıllı köməkçi proqramdır. Oyun boyu əlinizdəki daşları izləyir, rəqibin mümkün daşlarını hesablayır və sizə ən optimal gedişi tövsiyə edir.

> 🏆 **101 Sistemi** — Azərbaycan milli domino qaydaları əsasında hazırlanmışdır.

---

## ✨ Xüsusiyyətlər

| Funksiya | Açıqlama |
|----------|----------|
| 🧠 **Ağıllı Məsləhətçi** | Oyun məntiqi əsasında ən yaxşı gedişi tövsiyə edir |
| 📊 **Ehtimal Analizi** | Rəqibin əlindəki daşların ehtimalını hesablayır |
| 🎮 **2 və 4 Nəfərlik** | Həm fərdi, həm komanda rejimi dəstəklənir |
| 📱 **PWA / Offline** | İnternet olmadan da işləyir |
| ↺ **Geri Al** | Səhv gedişi ləğv etmək imkanı |
| 🔒 **Kilit Detektoru** | Oyun kilidi vəziyyətini avtomatik aşkarlayır |
| 🏆 **Xal Sistemi** | 101 xal sistemini tam dəstəkləyir |
| 🌙 **Dark Mode** | Göz yorulmayan qaranlıq interfeys |

---

## 📱 APK Yüklə

Tətbiqi birbaşa Android telefonunuza quraşdıra bilərsiniz:

### Metod 1 — Brauzerdən (Tövsiyə olunur)
1. Telefonunuzda **Chrome** ilə bu linki açın:  
   👉 `https://farrukhammadli.github.io/feko101`
2. Sağ yuxarıdakı **⋮** menyusuna basın
3. **"Ana ekrana əlavə et"** seçin
4. **"Quraşdır"** basın — bitdi! ✅

### Metod 2 — PWA Builder vasitəsilə
1. [pwabuilder.com](https://www.pwabuilder.com) saytına keçin
2. URL daxil edin: `https://farrukhammadli.github.io/feko101`
3. **"Build My PWA"** basın → **Android** seçin
4. `.apk` faylı yükləyin

---

## 🖥️ Skrinşotlar

<div align="center">

| Ana Ekran | Oyun Masası | Köməkçi |
|:---------:|:-----------:|:-------:|
| 🏠 Oyun seçimi | 🎮 Canlı masa | 🧠 Daş tövsiyəsi |

</div>

---

## 🃏 Oyun Qaydaları

<details>
<summary><b>101 Sistemi — Ətraflı Qaydalar</b></summary>

### Başlanğıc
- **2 nəfərlik**: hər oyunçuya **7 daş**
- **4 nəfərlik**: hər oyunçuya **7 daş** (2 komanda)
- Oyunu **Qoşa 1 (1|1)** sahibi başlayır

### Gedişlər
- Masa uclarına uyğun daş oynanır
- Əldə uyğun daş yoxdursa → **bazara** get
- Bazarda da yoxdursa → **pas**

### Oyunun Sonu
- Daşları birinci bitirən **qalib** gəlir
- Qalib rəqibin əlindəki daşların **cəmini** qazanır
- **101 xala** çatan komanda/oyunçu udur

### Kilit Qaydası
- Hər iki uc eyni rəqəmə düşüb, heç kimin o rəqəmdən daşı yoxdursa → **kilit**
- Kilit vəziyyətdə əllərdəki daşların cəmi azı **qalib** sayılır

</details>

---

## 🛠️ Texnologiyalar

```
Frontend:   HTML5 · CSS3 · Vanilla JavaScript
PWA:        Web App Manifest · Service Worker · Cache API
Design:     Dark Mode · Glassmorphism · CSS Animations
Fonts:      Google Fonts (Outfit · Fira Code)
```

---

## 📁 Layihə Strukturu

```
feko101/
├── 📄 index.html        # Ana HTML səhifə
├── 🎨 styles.css        # Stil faylı
├── ⚙️  app.js           # Əsas oyun məntiqi
├── 🔧 sw.js             # Service Worker (offline)
├── 📋 manifest.json     # PWA manifesti
├── 🖼️  icon.png         # Tətbiq ikonu
└── 📖 README.md         # Bu fayl
```

---

## 🚀 Yerli İşə Salma

```bash
# Repo-nu kopyala
git clone https://github.com/FarrukhMammadli/feko101.git

# Qovluğa keç
cd feko101

# İstənilən lokal server ilə aç (Python nümunəsi)
python -m http.server 8080

# Brauzerdə aç
# http://localhost:8080
```

---

## 👨‍💻 Müəllif

<div align="center">

**Farrukh Məmmədli**  
[![GitHub](https://img.shields.io/badge/GitHub-FarrukhMammadli-181717?style=flat-square&logo=github)](https://github.com/FarrukhMammadli)

</div>

---

## 📄 Lisenziya

Bu layihə **MIT Lisenziyası** altında paylaşılır — bax [LICENSE](LICENSE)

---

<div align="center">

⭐ **Bəyəndinizsə, ulduz verməyi unutmayın!**

*FEKO 101 — Domino oyununun ağıllı köməkçisi*

</div>
