# HitungHPP — tiang ukur harga pokok produksi

Kalkulator HPP (Harga Pokok Produksi) untuk UMKM & jualan online Indonesia.
Konsep: **tiang ukur pasang surut di dermaga beton** — biaya = air yang naik,
HPP per unit = permukaan air. Isi biayanya, biar airnya naik.

**Live:** https://kayzenn123.github.io/agent-tools-hitung-hpp

## Fitur
- Input bahan baku per batch (nama, jumlah, harga satuan) + biaya operasional
- HPP per unit & harga jual saran (margin %) — angka raksasa + animasi "permukaan air"
- Breakdown: total bahan, operasional, per batch, unit, margin
- 3 preset resep contoh (sambal botol, keripik pisang, kopi susu literan) — harga = contoh
- Simpan resep di localStorage (browser saja, tidak dikirim ke mana-mana)
- Deep-link `?resep=` — bagikan resep lewat tautan
- Ekspor: salin ringkasan WA, salin tautan, unduh JSON, cetak
- Validasi on-blur, empty state, toast — semua bersuara Pakde Ukur
- Toggle gerak + jeda marquee (WCAG 2.2.2), hormat prefers-reduced-motion, mode ringan otomatis
- Easter egg: ketuk tiang ukur 5×

## Tech
Astro 7 (static) + Tailwind CSS v4 + astro-icon (Tabler) + Astro Fonts API
(Beiruti / Noto Sans Thai Looped / Risque, self-hosted). Vanilla JS, tanpa framework client-side.

## Skor
- Lighthouse desktop: 100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO)
- Lighthouse mobile: 83 / 100 / 100 / 100 — 83 = plafon CPU-throttle VM (TBT ayun 0.64–2.8s antar run tanpa perubahan kode); LCP 1.7s, CLS 0.001
- qa.js: exit 0 (chromium) — 0 overflow, 0 console issue, tap target ≥44px, h1 tunggal, lang="id"
- FPS 4x CPU throttle: 60.6

## Cara jalanin
```
npm install
npm run dev     # http://localhost:4321
npm run build   # output ke dist/
```

## Kredit
- Font: Beiruti, Noto Sans Thai Looped, Risque (OFL, via Fontsource)
- Ikon: Tabler (MIT) + 3 SVG custom (tiang ukur, perahu bocor, timbangan dapur)
- Dibangun mengikuti Daily Build Standard v2–v5 (seed 2026-12-01). Lihat BRIEF.md / CRITIQUE.md.
