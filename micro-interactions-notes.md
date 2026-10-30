# micro-interactions — catatan untuk build HitungHPP (30 Okt 2026)
Sumber: ~/muse-skills/micro-interactions/SKILL.md (dibaca habis).

1. TOMBOL (hitung/salin/export/tambah baris): press state = scale(0.97) @ 80ms ease-out; tombol "Hitung" saat proses: teks fade + spinner muncul, pointer-events none; sukses: morph ke hijau + checkmark 200ms; hover (pointer fine saja): translateY(-1px) 150ms; disabled: opacity 0.5, tanpa hover.
2. INPUT/VALIDASI FORM: TIDAK validasi saat mengetik (jangan ganggu); validasi on blur — valid: border hijau + check fade-in 150ms; invalid: border merah + shake 3 siklus, 4px, 400ms + pesan error slide-down; submit gagal: scroll ke error pertama + pulse pada field.
3. HASIL HITUNG (angka HPP): saat angka berubah, count-up/roll (angka lama slide-up keluar, baru slide-in dari bawah) — bukan flip instan; durasi 200-300ms ease-out; jangan lebih 400ms.
4. TOAST (salin/export tersimpan): slide dari bawah + scale 0.95→1.0 dengan spring (~400ms), auto-dismiss fade+slide 300ms ease-in; swipe-to-dismiss opsional; WAJIB role="status" aria-live="polite".
5. EMPTY STATE tabel bahan: saat baris pertama ditambah, baris stagger masuk 30ms per baris, translateY(-8px)→0; hapus baris: spring collapse (bukan jump).
6. DURASI/EASING: fast 100-200ms (button/toggle), normal 200-300ms (panel/error), exit = 60-75% dari enter; easing standard cubic-bezier(0.2,0,0,1), enter decel (0,0,0.2,1), exit accel (0.4,0,1,1); hasil angka/toggle pakai spring ringan (stiffness ~200, damping ~20).
7. HINDARI: linear easing (terasa robotik); animasi properti layout (width/height/top/left — pakai transform+opacity saja); entrance animation saat page load (annoying untuk repeat user); validasi saat mengetik; hover effect di mobile (pointer coarse → pakai :active scale(0.97) + tap-highlight transparan); bounce/celebration berlebihan — ini tool produktif, bukan game.
8. HINDARI LANJUTAN: blok input saat animasi (semua interruptible); animasi tanpa exit animation; maks 3-5 animasi konkuren di mobile; touch target min 44px.
9. REDUCED-MOTION: pendekatan opt-in — default tanpa animasi, hanya tambah motion di @media (prefers-reduced-motion: no-preference); fallback blanket-disable (transition/animation 0.01ms); fitur (hitung, salin, export, localStorage, deep-link) HARUS 100% berfungsi tanpa animasi.
10. ATURAN KERJA: fitur dulu tanpa animasi → lapis motion progresif → test di device nyata (mobile 390px) → hanya tersisa animasi yang lulus decision checklist: butuh konfirmasi? ada state change? subtle untuk aksi yang diulang 100x?
