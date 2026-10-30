# BRIEF — HitungHPP — 2026-10-30

## Masalah/usecase (1 kalimat + siapa yang kena)
Penjual makanan/minuman rumahan & UMKM online sering asal pasang harga jual tanpa tahu HPP per unit — mereka yang kena: margin tipis tak sadar, promo bikin rugi, harga kalah saing.

## Konsep visual (1 kalimat)
Kalkulator HPP sebagai "tiang ukur pasang surut" di dermaga beton brutalist: biaya = air yang naik, HPP = ketinggian air per unit, semua section menempel di satu sumbu pasang vertikal.

## Hasil seed (seed 2026-12-01, base 2026-11-25 — re-seed sekali per ATURAN 19 karena seed pertama tabrakan 0/5 sumbu dgn build 2026-10-28 di LOG.md)
- domain: pasang surut · layout: timeline satu sumbu · reference: brutalism beton
- constraint: satu ukuran biasa + satu ukuran raksasa
- gerak: A kamera "terbang" scroll (scale+translate+rotate) · B marquee melingkar di path SVG · C scramble/decode · D tilt 3D pointer/gyro · E curtain wipe antar section
- ikon: stiker outline putih, sumber Streamline · font: display Beiruti, body Noto Sans Thai Looped, aksen Risque
- palet: mid/analogous hue 153 — bg beton lumut oklch(0.68 0.113 153), tinta oklch(0.16 0.030 153), aksen teal oklch(0.64 0.190 183), aksen-2 limau oklch(0.75 0.230 123), pop stempel merah oklch(0.83 0.241 4)

## 3 arah desain (2 kalimat masing-masing) + arah terpilih
1. **Buku telepon UMKM**: direktori resep tersimpan ala buku telepon — kuat untuk arsip, tapi lemah untuk momen "hitung" yang butuh fokus tunggal.
2. **Ruang kontrol mercusuar**: dashboard gelap penuh gauge — dramatis, tapi dark/teal rawan jadi slop "dashboard AI generik".
3. **Tiang pasang beton (TERPILIH)**: satu sumbu vertikal = tiang ukur; biaya mengalir seperti air pasang; angka HPP raksasa = permukaan air. Paling jauh dari 14 build terakhir (tidak ada yang pakai domain pasang surut / timeline-sumbu sebagai metafora hitung), dan constraint 2 ukuran font memaksa hierarki brutal yang jujur.

## Keputusan berani
Tanpa navbar marketing dan tanpa hero jualan — pengunjung langsung berdiri di depan tiang ukur kosong bertuliskan "isi biayanya, biar airnya naik". Angka HPP tampil setinggi 24vw dan NAIK-TURUN seperti permukaan air setiap input berubah.

## Persona/suara
**Pakde Ukur**, penjaga tiang pasang dermaga yang benci biaya bocor. Lugas, kalimat pendek, analogi air/laut. Contoh: empty state "tiangnya masih kering — isi bahan dulu, biar airnya naik." · error "angkanya bocor, betulin dulu sebelum kapalnya tenggelam." · sukses salin "ringkasan sudah disalin. jangan sampai tenggelam di grup WA."

## Palet (harmoni, kenapa, psikologi, token, kontras)
- Harmoni analogous hue 153 (hijau lumut–teal–limau): warna dermaga beton yang berlumut + air laut dangkal. Psikologi: hijau = uang/aman, teal = air/tenang, stempel merah = waspada biaya bocor.
- Token: --bg oklch(0.68 0.113 153) · --surface oklch(0.60 0.110 153) · --text oklch(0.16 0.030 153) · --muted oklch(0.32 0.040 153) · --accent oklch(0.64 0.190 183) · --accent-2 oklch(0.75 0.230 123) · --pop oklch(0.83 0.241 4)
- Kontras AA (dihitung saat build, target ≥4.5:1 teks biasa): --text di --bg (0.16 vs 0.68 → aman), --muted di --bg (0.32 vs 0.68 → cek), putih di --accent untuk stiker.

## Font (display/body/aksen, alasan, id Fontsource, variable?)
- Display **Beiruti** (fontsource `@fontsource/beiruti`) — arabic-latin display dengan karakter tegas, cocok untuk angka raksasa tiang ukur. Bukan variable (cek katalog).
- Body **Noto Sans Thai Looped** (fontsource `@fontsource/noto-sans-thai-looped`) — humanis, x-height lega; VERIFIKASI cakupan latin saat build, kalau gagal → --reroll body.
- Aksen **Risque** (fontsource `@fontsource/risque`) — tulisan tangan untuk catatan Pakde & stempel.
- Constraint seed: hanya 2 ukuran (16px biasa, clamp raksasa untuk angka/judul).

## Ikon (gaya, sumber, 12+ ikon, 3+ custom)
- Gaya: stiker outline putih (stroke putih 2px + bayangan tinta), sumber Streamline.
- 12+: kalkulator, koin, timbangan, botol, kardus, truk, tag harga, struk, tetesan, jangkar, ombak, mercusuar, gauge, gembok, salin, unduh, cetak, tambah, hapus, panah.
- 3 custom SVG: tiang ukur pasang (mistar + garis air), perahu bocor (simbol biaya bocor), timbangan dapur.

## Gerak (A-F, narasi penyatu, MODE RINGAN)
- Narasi: scroll = berjalan menyusuri dermaga; kamera pelan-pelan "terbang" (scale 1→1.06 + rotate 0.5deg) saat masuk zona hitung; marquee melingkar = arus mengelilingi tiang; scramble = angka papan dermaga yang diganti; tilt = kartu hasil seperti papan yang dipegang.
- A: fly halus hero→tool (scale+translate+rotate kecil, hormat vestibular). B: 1 marquee melingkar SVG ("hitung hpp • jangan tebak harga • ..."). C: scramble pada judul section. D: tilt 3D kartu hasil (pointer fine saja). E: curtain wipe antar section. F: tidak dipakai (tool produktif).
- MODE RINGAN (hardwareConcurrency ≤4 / save-data / fps<40 2 dtk): matikan A & D, marquee jadi statis, scramble jadi fade.

## Storyboard hero moment
| Scroll | Terlihat | Kamera | Marquee | Teks | Interaksi |
|---|---|---|---|---|---|
| 0% | tiang ukur kosong + "isi biayanya, biar airnya naik" | — | arus melingkar jalan | judul scramble masuk | — |
| 25% | form bahan baku (tabel) | fly-in ringan | — | — | tambah baris, stagger |
| 50% | biaya operasional + unit/batch + margin | — | — | — | input, validasi on blur |
| 75% | ANGKA HPP RAKSASA naik seperti air + breakdown | zoom 1.04 | — | count-up angka | tilt kartu (desktop) |
| 100% | ekspor: salin WA / unduh JSON / cetak / deep-link | — | — | — | toast konfirmasi |

Pertunjukan utama di 75%: angka HPP 24vw yang naik-turun seperti permukaan air tiap input berubah. 5 detik pertama: tiang kosong + kalimat Pakde + arus melingkar — jelas ini alat hitung, bukan landing page.

## Konten (15+ item nyata, easter egg)
- 3 preset resep contoh (harga = CONTOH, wajib sesuaikan): sambal botol 250ml (7 bahan), keripik pisang 1kg (6 bahan), kopi susu literan (6 bahan).
- 8 pos biaya operasional umum UMKM (gas, listrik, air, kemasan, label, ongkir, admin marketplace, susut).
- 5 FAQ (beda HPP vs COGS, margin aman kuliner, cara hitung susut, promo boleh di bawah HPP?, update harga bahan).
- 3 tips Pakde (catat tiap belanja, hitung ulang tiap harga naik, jangan lupa "gaji sendiri").
- Easter egg: klik tiang ukur 5× → mode "air surut" (toast: "air surut — semua biaya kelihatan, tidak ada yang ngumpet").

## Teknik visual orisinal (2+)
1. Grain beton via SVG feTurbulence di background (bukan gambar).
2. Divider ombak generatif (canvas/SVG path acak terkontrol) antar section.
3. Angka HPP raksasa sebagai ilustrasi utama (tipografi = visual).

## Suara
Tidak — tool produktif, bunyi hanya akan mengganggu. (Keputusan sadar per skill micro-interactions.)
