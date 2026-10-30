# CRITIQUE — HitungHPP — 2026-10-30

## Slop test (v3) + 3 hal paling template + yang dirombak
- SLOP TEST: logo ditutup → tetap dikenali: tiang ukur + beton lumut hijau + angka raksasa Beiruti + suara Pakde Ukur. Tidak ketukar dengan build lain. LULUS.
- 3 hal paling template: (1) kartu "cara pakai" 3 langkah; (2) accordion FAQ; (3) topbar logo-kiri/link-kanan.
- Rombak: (1) cara pakai = panel beton + stiker outline putih + ikon custom timbangan-dapur + catatan tangan Risque, bukan rounded-card; (2) FAQ = panel kertas beton dengan suara Pakde sampai ke jawaban; (3) topbar tanpa link marketing — cuma anchor + toggle gerak. Tidak ada yang dibangun ulang total karena sudah menyatu dengan konsep; dipangkas dari daftar rombak dengan alasan tercatat.

## Gerbang gerak (v4): lapisan, zoom, pan, marquee, FPS
- Lapisan (5): A terbang halus hero (scale 1→1.05 + rotate 0.6deg, pointer fine); B marquee MELINGKAR di path SVG (sesuai seed; 1 band melingkar, bukan 2 linear); C scramble judul section; D tilt 3D kartu hasil; E curtain wipe antar section.
- Zoom: ya (hero fly). Pan horizontal: TIDAK — dipangkas sadar (v5 ATURAN 0 #7: fungsi tool tidak boleh dikorbankan; pan horizontal di halaman form = merusak).
- 2 marquee: TIDAK — seed mengikat "marquee melingkar di path SVG" (1 band). Dicatat sebagai keputusan konflik: seed spesifik > aturan umum jumlah.
- FPS 4x CPU throttle: 60.6 (syarat ≥45). LULUS.

## Gerbang v5: bandingkan, blur, 3 detik, keyboard, reduced-motion, mode ringan
- Bandingkan vs 3 terakhir (REL80, BidKit, DompetKita): beda total — beton lumut mid-green, Beiruti, metafora pasang surut. Tidak sekeluarga.
- Blur: komposisi = tiang vertikal + sumbu garis putus-putus + angka raksasa. Identitas unik.
- 3 detik: "hitung hpp" raksasa + "isi biayanya, biar airnya naik" + tiang kosong. Jelas ini alat hitung.
- Keyboard-only: semua tombol/input native, details/summary native, skip link ada, focus-visible lime 3px. LULUS (uji manual via tab order).
- Reduced-motion: 0 animasi berjalan (qa.js), tirai wipe nonaktif, konten tetap tampil. LULUS.
- Mode ringan: otomatis aktif (hardwareConcurrency ≤4 / saveData) — matikan orbit & water transition. LULUS.

## Budget performa + Lighthouse
- Transfer: JS 30KB ✓ (≤250), CSS 123KB ✗ (>60 — output Tailwind v4 template; gzip ~18KB), font 93KB ✓ (≤250), gambar 0KB ✓.
- Lighthouse mobile: 83 / 100 / 100 / 100. Desktop: 100 / 100 / 100 / 100.
- Mobile 83 = plafon VM (CPU throttle simulasi di atas VM yang memang lambat; TBT ayun 0.64–2.8s antar run tanpa perubahan kode — noise lingkungan). Preseden LOG.md: build 10-13 s.d. 10-28 mencatat hal sama ("plafon VM", 68–99). Bukti situsnya cepat: desktop 100 semua kategori, LCP 1.7s, CLS 0.001.
- Keputusan konflik (v5 ATURAN 0 #8): BODY wajibkan template astrowind (Tailwind) vs budget CSS 60KB — template menang karena diwajibkan eksplisit; dicatat di sini.

## Keamanan + lisensi
- Semua input: validasi numerik, tanpa innerHTML (textContent/createElement), localStorage key berversi + try/catch, ?resep= divalidasi skema sebelum dipakai. Tidak ada API key, tracker, atau analytics. LULUS.
- Font: Beiruti, Noto Sans Thai Looped, Risque — semua OFL via Fontsource. Ikon: Tabler (MIT/ISC) + 3 SVG custom. LULUS.
- R7: harga preset diberi label "contoh" di 3 tempat (panel, tombol, footer). Tidak ada testimoni/identitas palsu (R8).

## Skor 1-10: karakter 9, keunikan 9, kerapian 8
- Karakter 9: metafora tiang pasang konsisten dari hero → form → angka → footer; persona Pakde sampai ke pesan error.
- Keunikan 9: 4/5 sumbu beda dari 14 build terakhir (domain pasang surut baru; layout timeline-sumbu dipakai 1x tapi sebagai metafora hitung).
- Kerapian 8: baris form mobile diperbaiki (tombol hapus sejajar); orbit button dipindah agar tidak menabrak teks melingkar.

## Keputusan konflik aturan + daftar dipangkas
1. Seed Streamline → Tabler: nama ikon Streamline tidak konsisten/terverifikasi (mis. plus = 'interface-add-1-...'), tebakan nama = risiko build pecah. Gaya "stiker outline putih" dipertahankan via CSS. (v5 ATURAN 0 #8)
2. Widget astrowind tidak dipakai untuk section (custom penuh): widget memaksa tipografi/skala sendiri, bentrok dengan constraint seed "2 ukuran font" + konsep brutalist. Dipakai: Layout, Fonts API, astro-icon, CustomStyles. (keputusan: seed anti-slop > reuse widget)
3. Pan horizontal & marquee ke-2 dipangkas (fungsi > gerak, v5 ATURAN 0 #7). Lapisan F tidak dipakai (tool produktif).
4. ClientRouter & favicon.ico dibuang demi performa (bukti: desktop 100).
5. Seed pertama (2026-11-09) dibuang sebelum tulis kode: tabrakan 0/5 sumbu dengan build 2026-10-28 di LOG.md. Re-seed sekali ke 2026-12-01 per ATURAN 19.

## Putaran rombak
- Rombak 1: curtain wipe → progressive enhancement (tanpa JS = konten tampil; sebelumnya panel hitam saat IO belum tembak). Ketemu dari screenshot full-page.
- Rombak 2: tap target nav 44px + tombol hapus sejajar field di mobile. Ketemu dari qa.js.
- Tidak ada rombak ke-3 (batas 2 putaran).
