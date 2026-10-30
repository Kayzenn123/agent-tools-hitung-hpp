/* HitungHPP — logika kalkulator. Vanilla JS, tanpa framework.
   Aturan: tidak ada innerHTML untuk data pengguna (pakai textContent).
   Semua angka diformat id-ID. State berversi di localStorage. */
const LS_KEY = 'hitunghpp.v1';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    Math.round(isFinite(n) ? n : 0)
  );
const uid = () => Math.random().toString(36).slice(2, 9);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const DEFAULT_STATE = () => ({
  v: 1,
  namaResep: '',
  bahan: [],
  operasional: [],
  unit: 10,
  margin: 30,
});

let state = DEFAULT_STATE();
let savedMax = 1; // untuk skala ketinggian air

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s && s.v === 1 && Array.isArray(s.bahan) && Array.isArray(s.operasional)) state = { ...DEFAULT_STATE(), ...s };
  } catch {
    toast('catatan lama rusak, mulai dari tiang kosong.');
  }
}
function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch { /* penyimpanan penuh: lanjut tanpa simpan */ }
}
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- deep-link ?resep= ---------- */
function stateFromURL() {
  try {
    const p = new URLSearchParams(location.search).get('resep');
    if (!p) return false;
    const json = decodeURIComponent(escape(atob(p.replace(/-/g, '+').replace(/_/g, '/'))));
    const s = JSON.parse(json);
    if (s && s.v === 1 && Array.isArray(s.bahan)) {
      state = { ...DEFAULT_STATE(), ...s };
      return true;
    }
  } catch { /* abaikan tautan rusak */ }
  return false;
}
function stateToURL() {
  const json = JSON.stringify(state);
  const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${location.origin}${location.pathname}?resep=${b64}`;
}

/* ---------- hitung ---------- */
function calc() {
  const totalBahan = state.bahan.reduce((a, b) => a + (num(b.jumlah) * num(b.harga)), 0);
  const totalOp = state.operasional.reduce((a, o) => a + num(o.nominal), 0);
  const totalBatch = totalBahan + totalOp;
  const unit = Math.max(num(state.unit), 1);
  const hpp = totalBatch / unit;
  const jual = hpp * (1 + num(state.margin) / 100);
  return { totalBahan, totalOp, totalBatch, unit, hpp, jual };
}
const num = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.,-]/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.'));
  return isFinite(n) && n > 0 ? n : 0;
};

/* ---------- render ---------- */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function bahanRow(b) {
  const row = el('div', 'row-bahan flex gap-2 items-start py-3');
  row.dataset.id = b.id;
  const fields = el('div', 'grid grid-cols-2 md:grid-cols-3 gap-2 flex-1 min-w-0');
  const fNama = field('nama bahan', b.nama, 'cth: cabai rawit', 'text');
  const fJml = field('jumlah', b.jumlah, 'cth: 2', 'decimal');
  const fHrg = field('harga satuan (rp)', b.harga, 'cth: 15000', 'decimal');
  fNama.wrap.classList.add('col-span-2', 'md:col-span-1');
  const del = el('button', 'btn-beton ghost !px-3 shrink-0 mt-7', '✕');
  del.type = 'button';
  del.setAttribute('aria-label', `hapus bahan ${b.nama || 'tanpa nama'}`);
  del.addEventListener('click', () => {
    row.classList.add('removing');
    setTimeout(() => {
      state.bahan = state.bahan.filter((x) => x.id !== b.id);
      sync();
    }, reducedMotion() ? 0 : 180);
  });
  [fNama, fJml, fHrg].forEach((f, i) => {
    f.input.addEventListener('input', () => {
      const key = ['nama', 'jumlah', 'harga'][i];
      b[key] = f.input.value;
      f.input.classList.remove('invalid', 'valid');
      f.err.classList.remove('show');
      saveState();
      renderHasil();
    });
    f.input.addEventListener('blur', () => validateField(f, i !== 0));
  });
  fields.append(fNama.wrap, fJml.wrap, fHrg.wrap);
  row.append(fields, del);
  return row;
}

function opRow(o) {
  const row = el('div', 'row-bahan flex gap-2 items-start py-3');
  row.dataset.id = o.id;
  const fields = el('div', 'grid grid-cols-2 gap-2 flex-1 min-w-0');
  const fNama = field('pos biaya', o.nama, 'cth: gas', 'text');
  const fNom = field('nominal (rp)', o.nominal, 'cth: 25000', 'decimal');
  const del = el('button', 'btn-beton ghost !px-3 shrink-0 mt-7', '✕');
  del.type = 'button';
  del.setAttribute('aria-label', `hapus biaya ${o.nama || 'tanpa nama'}`);
  del.addEventListener('click', () => {
    row.classList.add('removing');
    setTimeout(() => {
      state.operasional = state.operasional.filter((x) => x.id !== o.id);
      sync();
    }, reducedMotion() ? 0 : 180);
  });
  [fNama, fNom].forEach((f, i) => {
    f.input.addEventListener('input', () => {
      o[i === 0 ? 'nama' : 'nominal'] = f.input.value;
      f.input.classList.remove('invalid', 'valid');
      f.err.classList.remove('show');
      saveState();
      renderHasil();
    });
    f.input.addEventListener('blur', () => validateField(f, i !== 0));
  });
  fields.append(fNama.wrap, fNom.wrap);
  row.append(fields, del);
  return row;
}

function field(labelText, value, placeholder, inputmode) {
  const wrap = el('div', 'min-w-0');
  const lab = el('label', 'label-dermaga block mb-1', labelText);
  const input = el('input', 'field-beton');
  input.type = 'text';
  input.inputMode = inputmode === 'decimal' ? 'decimal' : 'text';
  input.placeholder = placeholder;
  input.value = value ?? '';
  input.id = 'f-' + uid();
  lab.htmlFor = input.id;
  const err = el('p', 'field-error', '');
  err.setAttribute('role', 'alert');
  wrap.append(lab, input, err);
  return { wrap, input, err, labelText };
}

function validateField(f, numeric) {
  const v = f.input.value.trim();
  if (numeric) {
    if (v !== '' && num(v) <= 0) {
      f.input.classList.add('invalid');
      f.err.textContent = `isi ${f.labelText} dengan angka lebih dari 0, biar kapalnya tidak tenggelam.`;
      f.err.classList.add('show');
      return false;
    }
  }
  f.input.classList.remove('invalid');
  f.err.classList.remove('show');
  if (v !== '') f.input.classList.add('valid');
  return true;
}

function renderBahan() {
  const list = $('#bahan-list');
  list.innerHTML = '';
  if (!state.bahan.length) {
    const e = el('div', 'py-8 text-center');
    e.append(el('p', 'font-accent-hand', 'tiangnya masih kering…'));
    e.append(el('p', null, 'tambah bahan dulu, biar airnya naik.'));
    list.append(e);
  } else state.bahan.forEach((b) => list.append(bahanRow(b)));
}
function renderOp() {
  const list = $('#op-list');
  list.innerHTML = '';
  if (!state.operasional.length) {
    const e = el('div', 'py-8 text-center');
    e.append(el('p', 'font-accent-hand', 'belum ada biaya ngumpet…'));
    e.append(el('p', null, 'gas, kemasan, ongkir — catat semua di sini.'));
    list.append(e);
  } else state.operasional.forEach((o) => list.append(opRow(o)));
}

let lastHpp = 0;
function renderHasil() {
  const c = calc();
  // count-up angka HPP
  const target = Math.round(c.hpp);
  const node = $('#hpp-angka');
  if (reducedMotion() || document.body.classList.contains('mode-ringan')) {
    node.textContent = rp(target);
  } else {
    const from = lastHpp, t0 = performance.now(), dur = 280;
    cancelAnimationFrame(node._raf);
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = rp(from + (target - from) * eased);
      if (p < 1) node._raf = requestAnimationFrame(step);
    };
    node._raf = requestAnimationFrame(step);
  }
  lastHpp = target;
  $('#jual-angka').textContent = rp(c.jual);
  $('#breakdown-bahan').textContent = rp(c.totalBahan);
  $('#breakdown-op').textContent = rp(c.totalOp);
  $('#breakdown-total').textContent = rp(c.totalBatch);
  $('#breakdown-unit').textContent = `${c.unit} unit`;
  $('#breakdown-margin').textContent = `${num(state.margin)}%`;
  // ketinggian air
  savedMax = Math.max(savedMax, target, 1);
  const pct = Math.max(6, Math.min(100, (target / savedMax) * 100));
  $('#hpp-water').style.height = pct + '%';
  $('#hpp-catatan').textContent =
    target <= 0
      ? 'air belum naik — isi bahan & biaya dulu.'
      : `permukaan air: ${rp(target)} per unit. harga jual aman: ${rp(c.jual)}.`;
  renderRingkasan(c);
}

function renderRingkasan(c) {
  const lines = [
    `*RINGKASAN HPP — ${state.namaResep || 'tanpa nama'}*`,
    `total bahan: ${rp(c.totalBahan)}`,
    `total operasional: ${rp(c.totalOp)}`,
    `total per batch: ${rp(c.totalBatch)} (${c.unit} unit)`,
    `HPP per unit: ${rp(c.hpp)}`,
    `harga jual saran (margin ${num(state.margin)}%): ${rp(c.jual)}`,
    `_dihitung pakai HitungHPP — harga bahan = contoh, sesuaikan belanja_`,
  ];
  $('#ringkasan').textContent = lines.join('\n');
}

/* ---------- resep tersimpan ---------- */
function getSaved() {
  try {
    return JSON.parse(localStorage.getItem('hitunghpp.saved') || '[]');
  } catch {
    return [];
  }
}
function setSaved(a) {
  try {
    localStorage.setItem('hitunghpp.saved', JSON.stringify(a));
  } catch { /* abaikan */ }
}
function renderSaved() {
  const list = $('#saved-list');
  list.innerHTML = '';
  const arr = getSaved();
  if (!arr.length) {
    list.append(el('p', 'font-accent-hand', 'belum ada resep ditambatkan.'));
    return;
  }
  arr.forEach((s, i) => {
    const row = el('div', 'flex items-center gap-2 py-2 border-b-2 border-dashed border-[rgb(4_17_7/0.4)]');
    const b = el('button', 'btn-beton ghost !px-2 text-left flex-1', s.nama || `resep ${i + 1}`);
    b.type = 'button';
    b.addEventListener('click', () => {
      state = { ...DEFAULT_STATE(), ...s.data };
      sync();
      toast('resep dimuat dari tambatan.');
      $('#kalkulator').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
    const del = el('button', 'btn-beton ghost !px-3', '✕');
    del.type = 'button';
    del.setAttribute('aria-label', `lepas tambatan ${s.nama || 'resep'}`);
    del.addEventListener('click', () => {
      const a2 = getSaved();
      a2.splice(i, 1);
      setSaved(a2);
      renderSaved();
      toast('tambatan dilepas.');
    });
    row.append(b, del);
    list.append(row);
  });
}

/* ---------- preset contoh ---------- */
const PRESETS = [
  {
    nama: 'sambal botol 250ml (contoh)',
    unit: 12, margin: 40,
    bahan: [
      ['cabai rawit', 1, 'kg', 28000], ['cabai merah', 0.5, 'kg', 32000],
      ['bawang merah', 0.25, 'kg', 30000], ['bawang putih', 0.15, 'kg', 34000],
      ['minyak goreng', 1, 'liter', 21000], ['gula + garam', 1, 'paket', 8000],
      ['botol + label', 12, 'pcs', 4500],
    ],
    operasional: [['gas', 15000], ['listrik', 8000], ['susut 5%', 12000]],
  },
  {
    nama: 'keripik pisang 1kg (contoh)',
    unit: 20, margin: 35,
    bahan: [
      ['pisang kepok', 8, 'sisir', 12000], ['minyak goreng', 2, 'liter', 21000],
      ['bumbu balado', 0.5, 'kg', 45000], ['kemasan standing pouch', 20, 'pcs', 2500],
      ['label', 20, 'pcs', 800],
    ],
    operasional: [['gas', 20000], ['listrik', 10000], ['air', 5000]],
  },
  {
    nama: 'kopi susu literan (contoh)',
    unit: 4, margin: 50,
    bahan: [
      ['kopi robusta', 0.25, 'kg', 95000], ['susu full cream', 2, 'liter', 24000],
      ['gula aren', 0.5, 'kg', 28000], ['botol 1 liter', 4, 'pcs', 6000],
      ['es batu', 2, 'kantong', 5000],
    ],
    operasional: [['listrik', 12000], ['air galon', 8000], ['admin marketplace', 15000]],
  },
];
function renderPresets() {
  const list = $('#preset-list');
  PRESETS.forEach((p) => {
    const b = el('button', 'btn-beton secondary w-full !justify-start', p.nama);
    b.type = 'button';
    b.addEventListener('click', () => {
      state = {
        ...DEFAULT_STATE(),
        namaResep: p.nama,
        unit: p.unit,
        margin: p.margin,
        bahan: p.bahan.map(([nama, jumlah, satuan, harga]) => ({ id: uid(), nama, jumlah: String(jumlah), satuan, harga: String(harga) })),
        operasional: p.operasional.map(([nama, nominal]) => ({ id: uid(), nama, nominal: String(nominal) })),
      };
      sync();
      toast('preset contoh dimuat — sesuaikan dengan harga belanjamu.');
      $('#kalkulator').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
    list.append(b);
  });
}

/* ---------- clipboard dengan fallback ---------- */
async function copyText(t) {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = t;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* abaikan */ }
    ta.remove();
    return ok;
  }
}

/* ---------- scramble judul ---------- */
const GLYPHS = '█▓▒░<>/\\|—+*01';
function scramble(node) {
  if (reducedMotion() || document.body.classList.contains('mode-ringan')) return;
  const orig = node.dataset.text || node.textContent;
  node.dataset.text = orig;
  let frame = 0;
  const total = 14;
  cancelAnimationFrame(node._s);
  const tick = () => {
    frame++;
    const p = frame / total;
    const cut = Math.floor(orig.length * p);
    let out = orig.slice(0, cut);
    for (let i = cut; i < orig.length; i++) out += orig[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    node.textContent = out;
    if (frame < total) node._s = requestAnimationFrame(tick);
    else node.textContent = orig;
  };
  node._s = requestAnimationFrame(tick);
}

/* ---------- sync ---------- */
function sync() {
  saveState();
  $('#in-nama-resep').value = state.namaResep || '';
  $('#in-unit').value = state.unit;
  $('#in-margin').value = state.margin;
  renderBahan();
  renderOp();
  renderHasil();
  renderSaved();
}

/* ---------- init ---------- */
function init() {
  document.body.classList.add('js-wipe');
  const fromURL = stateFromURL();
  if (!fromURL) loadState();
  renderPresets();

  $('#btn-tambah-bahan').addEventListener('click', () => {
    state.bahan.push({ id: uid(), nama: '', jumlah: '', satuan: '', harga: '' });
    sync();
    const rows = $$('#bahan-list .row-bahan');
    rows[rows.length - 1]?.querySelector('input')?.focus();
  });
  $('#btn-tambah-op').addEventListener('click', () => {
    state.operasional.push({ id: uid(), nama: '', nominal: '' });
    sync();
    const rows = $$('#op-list .row-bahan');
    rows[rows.length - 1]?.querySelector('input')?.focus();
  });
  $('#in-nama-resep').addEventListener('input', (e) => { state.namaResep = e.target.value; saveState(); renderHasil(); });
  $('#in-unit').addEventListener('input', (e) => { state.unit = e.target.value; saveState(); renderHasil(); });
  $('#in-unit').addEventListener('blur', (e) => validateField({ input: e.target, err: $('#err-unit'), labelText: 'jumlah unit' }, true));
  $('#in-margin').addEventListener('input', (e) => { state.margin = e.target.value; saveState(); renderHasil(); });
  $('#in-margin').addEventListener('blur', (e) => validateField({ input: e.target, err: $('#err-margin'), labelText: 'margin' }, true));

  $('#btn-simpan-resep').addEventListener('click', () => {
    const nama = state.namaResep.trim() || `resep ${new Date().toLocaleDateString('id-ID')}`;
    const a = getSaved();
    a.unshift({ nama, data: JSON.parse(JSON.stringify(state)) });
    setSaved(a.slice(0, 20));
    renderSaved();
    toast('resep ditambatkan di dermaga.');
  });
  $('#btn-salin-wa').addEventListener('click', async () => {
    const ok = await copyText($('#ringkasan').textContent);
    toast(ok ? 'ringkasan sudah disalin. jangan sampai tenggelam di grup WA.' : 'gagal menyalin — blokir izin clipboard, salin manual dari kotak ringkasan.');
  });
  $('#btn-salin-tautan').addEventListener('click', async () => {
    const ok = await copyText(stateToURL());
    toast(ok ? 'tautan resep disalin — buka di HP lain, datanya ikut.' : 'gagal menyalin tautan.');
  });
  $('#btn-unduh').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hpp-${(state.namaResep || 'resep').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'resep'}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('berkas JSON diunduh.');
  });
  $('#btn-cetak').addEventListener('click', () => window.print());

  // easter egg: klik tiang ukur 5x
  let taps = 0, timer;
  $('#tiang').addEventListener('click', () => {
    taps++;
    clearTimeout(timer);
    timer = setTimeout(() => (taps = 0), 1500);
    if (taps >= 5) {
      taps = 0;
      toast('air surut — semua biaya kelihatan, tidak ada yang ngumpet.');
    }
  });

  // gerak: toggle + jeda marquee (WCAG 2.2.2)
  $('#btn-gerak').addEventListener('click', (e) => {
    const off = document.body.classList.toggle('gerak-mati');
    e.currentTarget.setAttribute('aria-pressed', String(!off));
    e.currentTarget.querySelector('span').textContent = off ? 'gerak: mati' : 'gerak: nyala';
    toast(off ? 'gerak dimatikan. tiang tetap kokoh.' : 'gerak dinyalakan.');
  });
  $('#btn-marquee-jeda').addEventListener('click', (e) => {
    const orbit = $('#orbit');
    const paused = orbit.style.animationPlayState === 'paused';
    orbit.style.animationPlayState = paused ? '' : 'paused';
    e.currentTarget.setAttribute('aria-pressed', String(!paused));
    e.currentTarget.querySelector('span').textContent = paused ? 'jeda arus' : 'jalan arus';
  });

  // mode ringan otomatis
  if ((navigator.hardwareConcurrency || 8) <= 4 || navigator.deviceMemory <= 4 || (navigator.connection && navigator.connection.saveData)) {
    document.body.classList.add('mode-ringan');
  }

  // reveal: curtain wipe + scramble judul
  const io = new IntersectionObserver(
    (es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('revealed');
      const t = en.target.querySelector('.scramble');
      if (t) scramble(t);
      io.unobserve(en.target);
    }),
    { threshold: 0.15, rootMargin: '0px 0px 320px 0px' }
  );
  $$('.wipe').forEach((s) => io.observe(s));

  // kamera "terbang" halus: hero scale saat scroll (hormat vestibular: kecil saja)
  if (!reducedMotion() && matchMedia('(pointer: fine)').matches) {
    const hero = $('#hero-stage');
    let raf = 0;
    addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(scrollY / innerHeight, 1);
        if (y < 1.2) hero.style.transform = `scale(${1 + y * 0.05}) rotate(${y * 0.6}deg)`;
      });
    }, { passive: true });
  }

  // tilt 3D kartu hasil (pointer fine saja)
  const card = $('#kartu-hasil');
  if (matchMedia('(pointer: fine)').matches && !reducedMotion()) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  }

  sync();
  if (fromURL) toast('resep dari tautan dimuat.');
}

document.addEventListener('DOMContentLoaded', init);
