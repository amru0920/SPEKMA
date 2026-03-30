<<<<<<< HEAD
/* ================================================================
   app.js — OTAK UTAMA APLIKASI
   ================================================================

   FAIL INI jarang perlu diedit.
   Ia menguruskan:
     - State (data semasa aplikasi)
     - Simpan & muat dari localStorage
     - Render halaman
     - Navigasi tab
     - Kira kedudukan

   Untuk ubah data → edit data.js
   Untuk ubah login → edit auth.js
   Untuk ubah keputusan → edit keputusan.js
   Untuk ubah tetapan → edit tetapan.js
   ================================================================ */


/* ================================================================
   STATE APLIKASI
   Semua data & status aplikasi disimpan di sini.
   ================================================================ */
let state = {

  /* Login */
  staffLogin:    null,

  /* Navigasi */
  tab:               'kedudukan',
  subTab:            'urus_akaun',
  selectedSukan:     null,
  editingAcara:      null,
  editingPerlawanan: null,
  selectedHari:      {},
  jadualSukanTab:    null,
  kumpulanSukanTab:  null,
  rrSukanTab:        null,
  rrEditingMatch:    null,
  streamTab:         'awam',    // 'awam' | 'urus'

  /* Data */
  keputusan:     {},
  pasukan:       [...PASUKAN_ASAL],
  sukan:         [...SUKAN_ASAL],
  jadual:        [...JADUAL_ASAL],
  staff:         [...STAFF_ASAL],
  password:      PASSWORD_TETAP,
  formatSukan:   { ...FORMAT_ASAL },
  kumpulanSukan: JSON.parse(JSON.stringify(KUMPULAN_ASAL)),
  roundRobin:    {},
  streaming:     [],   // { id, nama, url, platform, sukanId, aktif }

};


/* ================================================================
   SIMPAN & MUAT DATA (localStorage)
   Data kekal walaupun browser ditutup / refresh.
   ================================================================ */
function simpanData() {
  try {
    localStorage.setItem('spekma_keputusan',    JSON.stringify(state.keputusan));
    localStorage.setItem('spekma_pasukan',      JSON.stringify(state.pasukan));
    localStorage.setItem('spekma_sukan',        JSON.stringify(state.sukan));
    localStorage.setItem('spekma_jadual',       JSON.stringify(state.jadual));
    localStorage.setItem('spekma_staff',        JSON.stringify(state.staff));
    localStorage.setItem('spekma_password',     state.password);
    localStorage.setItem('spekma_format',       JSON.stringify(state.formatSukan));
    localStorage.setItem('spekma_kumpulan',     JSON.stringify(state.kumpulanSukan));
    localStorage.setItem('spekma_roundrobin',   JSON.stringify(state.roundRobin));
    localStorage.setItem('spekma_streaming',    JSON.stringify(state.streaming));
  } catch (e) { console.warn('Gagal simpan data:', e); }
}

function muatData() {
  try {
    const k  = localStorage.getItem('spekma_keputusan');
    const p  = localStorage.getItem('spekma_pasukan');
    const s  = localStorage.getItem('spekma_sukan');
    const j  = localStorage.getItem('spekma_jadual');
    const st = localStorage.getItem('spekma_staff');
    const pw = localStorage.getItem('spekma_password');
    const fm = localStorage.getItem('spekma_format');
    const km = localStorage.getItem('spekma_kumpulan');
    const rr = localStorage.getItem('spekma_roundrobin');
    if (k)  state.keputusan    = JSON.parse(k);
    if (p)  state.pasukan      = JSON.parse(p);
    if (s)  state.sukan        = JSON.parse(s);
    if (j)  state.jadual       = JSON.parse(j);
    if (st) state.staff        = JSON.parse(st);
    if (pw) state.password     = pw;
    if (fm) state.formatSukan  = JSON.parse(fm);
    if (km) state.kumpulanSukan= JSON.parse(km);
    if (rr) state.roundRobin   = JSON.parse(rr);
    const sm = localStorage.getItem('spekma_streaming');
    if (sm) state.streaming    = JSON.parse(sm);
  } catch (e) { console.warn('Gagal muat data:', e); }
}


/* ================================================================
   KIRA KEDUDUKAN
   ================================================================ */
function getKedudukan() {
  return state.pasukan
    .map(p => {
      let emas = 0, perak = 0, gangsa = 0, mata = 0;
      Object.values(state.keputusan).forEach(r => {
        if (r[1] === p) { emas++;   mata += MATA[1]; }
        if (r[2] === p) { perak++;  mata += MATA[2]; }
        if (r[3] === p) { gangsa++; mata += MATA[3]; }
      });
      return { nama: p, emas, perak, gangsa, mata };
    })
    .sort((a, b) =>
      b.emas   - a.emas   ||
      b.perak  - a.perak  ||
      b.gangsa - a.gangsa ||
      b.mata   - a.mata
    );
}

function countDone(s) {
  return s.acara.filter(a => state.keputusan[a.id]?.[1]).length;
}

function totalAcara()   { return state.sukan.reduce((n, s) => n + s.acara.length, 0); }
function totalSelesai() { return Object.values(state.keputusan).filter(r => r[1]).length; }


/* ================================================================
   RENDER — TAB KEDUDUKAN (awam)
   ================================================================ */
function renderKedudukan() {
  const standings = getKedudukan();

  const rows = standings.map((t, i) => `
    <tr class="${i < 3 ? 'top3' : ''}">
      <td>
        <span class="rank ${i===0?'r1':i===1?'r2':i===2?'r3':''}">
          ${i + 1}
        </span>
      </td>
      <td>
        ${i === 0 ? '<div class="leader-bar"></div>' : ''}
        <div class="team-name">${t.nama}</div>
      </td>
      <td><span class="medal-dot m-e">${t.emas   || '—'}</span></td>
      <td><span class="medal-dot m-p">${t.perak  || '—'}</span></td>
      <td><span class="medal-dot m-g">${t.gangsa || '—'}</span></td>
      <td><span class="pts-badge">${t.mata}</span></td>
    </tr>
  `).join('');

  return `
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-num">${state.pasukan.length}</div>
        <div class="stat-lbl">Pasukan</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${totalAcara()}</div>
        <div class="stat-lbl">Acara</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${totalSelesai()}</div>
        <div class="stat-lbl">Selesai</div>
      </div>
    </div>

    <table class="stand-table">
      <thead>
        <tr>
          <th style="width:40px">#</th>
          <th>Pasukan</th>
          <th>🥇</th><th>🥈</th><th>🥉</th>
          <th>Mata</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="nota-mata">
      🥇 Emas = ${MATA[1]} mata &nbsp;|&nbsp;
      🥈 Perak = ${MATA[2]} mata &nbsp;|&nbsp;
      🥉 Gangsa = ${MATA[3]} mata
    </div>
  `;
}


/* ================================================================
   RENDER UTAMA
   ================================================================ */
function render() {
  const navBtns = document.querySelectorAll('.topbar-nav .nav-btn');
  const tabList = ['kedudukan', 'keputusan', 'jadual', 'streaming'];
  navBtns.forEach((btn, i) => {
    if (tabList[i]) btn.classList.toggle('active', tabList[i] === state.tab);
  });

  const el = document.getElementById('main-content');
  if (!el) return;

  if      (state.tab === 'kedudukan') el.innerHTML = renderKedudukan();
  else if (state.tab === 'keputusan') el.innerHTML = renderKeputusan();
  else if (state.tab === 'jadual')    el.innerHTML = renderJadual();
  else if (state.tab === 'streaming') el.innerHTML = state.streamTab === 'urus' && state.staffLogin
                                                      ? renderUrusStreaming()
                                                      : renderStreaming();
  else if (state.tab === 'tetapan')   el.innerHTML = renderTetapan();
}


/* ================================================================
   NAVIGASI
   ================================================================ */
function setTab(tab) {
  if (tab === 'tetapan' && !state.staffLogin) { bukaPanelLogin(); return; }
  state.tab               = tab;
  state.selectedSukan     = null;
  state.editingAcara      = null;
  state.editingPerlawanan = null;
  if (tab !== 'jadual') state.jadualSukanTab = null;
  if (tab === 'jadual') semakAutoStatus(); /* ← semak bila masuk tab Jadual */
  render();
}

function pilihSukan(id) {
  state.selectedSukan = id;
  state.editingAcara  = null;
  render();
}

function goBack() {
  state.selectedSukan = null;
  state.editingAcara  = null;
  render();
}

function togolMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
}


/* ================================================================
   MULA APLIKASI
   ================================================================ */
muatData();
mulaAutoStatus();
render();
=======
/* ================================================================
   app.js — OTAK UTAMA APLIKASI
   ================================================================

   FAIL INI jarang perlu diedit.
   Ia menguruskan:
     - State (data semasa aplikasi)
     - Simpan & muat dari localStorage
     - Render halaman
     - Navigasi tab
     - Kira kedudukan

   Untuk ubah data → edit data.js
   Untuk ubah login → edit auth.js
   Untuk ubah keputusan → edit keputusan.js
   Untuk ubah tetapan → edit tetapan.js
   ================================================================ */


/* ================================================================
   STATE APLIKASI
   Semua data & status aplikasi disimpan di sini.
   ================================================================ */
let state = {

  /* Login */
  staffLogin:    null,

  /* Navigasi */
  tab:               'kedudukan',
  subTab:            'urus_akaun',
  selectedSukan:     null,
  editingAcara:      null,
  editingPerlawanan: null,
  selectedHari:      {},
  jadualSukanTab:    null,
  kumpulanSukanTab:  null,
  rrSukanTab:        null,
  rrEditingMatch:    null,
  streamTab:         'awam',    // 'awam' | 'urus'

  /* Data */
  keputusan:     {},
  pasukan:       [...PASUKAN_ASAL],
  sukan:         [...SUKAN_ASAL],
  jadual:        [...JADUAL_ASAL],
  staff:         [...STAFF_ASAL],
  password:      PASSWORD_TETAP,
  formatSukan:   { ...FORMAT_ASAL },
  kumpulanSukan: JSON.parse(JSON.stringify(KUMPULAN_ASAL)),
  roundRobin:    {},
  streaming:     [],   // { id, nama, url, platform, sukanId, aktif }

};


/* ================================================================
   SIMPAN & MUAT DATA (localStorage)
   Data kekal walaupun browser ditutup / refresh.
   ================================================================ */
function simpanData() {
  try {
    localStorage.setItem('spekma_keputusan',    JSON.stringify(state.keputusan));
    localStorage.setItem('spekma_pasukan',      JSON.stringify(state.pasukan));
    localStorage.setItem('spekma_sukan',        JSON.stringify(state.sukan));
    localStorage.setItem('spekma_jadual',       JSON.stringify(state.jadual));
    localStorage.setItem('spekma_staff',        JSON.stringify(state.staff));
    localStorage.setItem('spekma_password',     state.password);
    localStorage.setItem('spekma_format',       JSON.stringify(state.formatSukan));
    localStorage.setItem('spekma_kumpulan',     JSON.stringify(state.kumpulanSukan));
    localStorage.setItem('spekma_roundrobin',   JSON.stringify(state.roundRobin));
    localStorage.setItem('spekma_streaming',    JSON.stringify(state.streaming));
  } catch (e) { console.warn('Gagal simpan data:', e); }
}

function muatData() {
  try {
    const k  = localStorage.getItem('spekma_keputusan');
    const p  = localStorage.getItem('spekma_pasukan');
    const s  = localStorage.getItem('spekma_sukan');
    const j  = localStorage.getItem('spekma_jadual');
    const st = localStorage.getItem('spekma_staff');
    const pw = localStorage.getItem('spekma_password');
    const fm = localStorage.getItem('spekma_format');
    const km = localStorage.getItem('spekma_kumpulan');
    const rr = localStorage.getItem('spekma_roundrobin');
    if (k)  state.keputusan    = JSON.parse(k);
    if (p)  state.pasukan      = JSON.parse(p);
    if (s)  state.sukan        = JSON.parse(s);
    if (j)  state.jadual       = JSON.parse(j);
    if (st) state.staff        = JSON.parse(st);
    if (pw) state.password     = pw;
    if (fm) state.formatSukan  = JSON.parse(fm);
    if (km) state.kumpulanSukan= JSON.parse(km);
    if (rr) state.roundRobin   = JSON.parse(rr);
    const sm = localStorage.getItem('spekma_streaming');
    if (sm) state.streaming    = JSON.parse(sm);
  } catch (e) { console.warn('Gagal muat data:', e); }
}


/* ================================================================
   KIRA KEDUDUKAN
   ================================================================ */
function getKedudukan() {
  return state.pasukan
    .map(p => {
      let emas = 0, perak = 0, gangsa = 0, mata = 0;
      Object.values(state.keputusan).forEach(r => {
        if (r[1] === p) { emas++;   mata += MATA[1]; }
        if (r[2] === p) { perak++;  mata += MATA[2]; }
        if (r[3] === p) { gangsa++; mata += MATA[3]; }
      });
      return { nama: p, emas, perak, gangsa, mata };
    })
    .sort((a, b) =>
      b.emas   - a.emas   ||
      b.perak  - a.perak  ||
      b.gangsa - a.gangsa ||
      b.mata   - a.mata
    );
}

function countDone(s) {
  return s.acara.filter(a => state.keputusan[a.id]?.[1]).length;
}

function totalAcara()   { return state.sukan.reduce((n, s) => n + s.acara.length, 0); }
function totalSelesai() { return Object.values(state.keputusan).filter(r => r[1]).length; }


/* ================================================================
   RENDER — TAB KEDUDUKAN (awam)
   ================================================================ */
function renderKedudukan() {
  const standings = getKedudukan();

  const rows = standings.map((t, i) => `
    <tr class="${i < 3 ? 'top3' : ''}">
      <td>
        <span class="rank ${i===0?'r1':i===1?'r2':i===2?'r3':''}">
          ${i + 1}
        </span>
      </td>
      <td>
        ${i === 0 ? '<div class="leader-bar"></div>' : ''}
        <div class="team-name">${t.nama}</div>
      </td>
      <td><span class="medal-dot m-e">${t.emas   || '—'}</span></td>
      <td><span class="medal-dot m-p">${t.perak  || '—'}</span></td>
      <td><span class="medal-dot m-g">${t.gangsa || '—'}</span></td>
      <td><span class="pts-badge">${t.mata}</span></td>
    </tr>
  `).join('');

  return `
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-num">${state.pasukan.length}</div>
        <div class="stat-lbl">Pasukan</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${totalAcara()}</div>
        <div class="stat-lbl">Acara</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${totalSelesai()}</div>
        <div class="stat-lbl">Selesai</div>
      </div>
    </div>

    <table class="stand-table">
      <thead>
        <tr>
          <th style="width:40px">#</th>
          <th>Pasukan</th>
          <th>🥇</th><th>🥈</th><th>🥉</th>
          <th>Mata</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="nota-mata">
      🥇 Emas = ${MATA[1]} mata &nbsp;|&nbsp;
      🥈 Perak = ${MATA[2]} mata &nbsp;|&nbsp;
      🥉 Gangsa = ${MATA[3]} mata
    </div>
  `;
}


/* ================================================================
   RENDER UTAMA
   ================================================================ */
function render() {
  const navBtns = document.querySelectorAll('.topbar-nav .nav-btn');
  const tabList = ['kedudukan', 'keputusan', 'jadual', 'streaming'];
  navBtns.forEach((btn, i) => {
    if (tabList[i]) btn.classList.toggle('active', tabList[i] === state.tab);
  });

  const el = document.getElementById('main-content');
  if (!el) return;

  if      (state.tab === 'kedudukan') el.innerHTML = renderKedudukan();
  else if (state.tab === 'keputusan') el.innerHTML = renderKeputusan();
  else if (state.tab === 'jadual')    el.innerHTML = renderJadual();
  else if (state.tab === 'streaming') el.innerHTML = state.streamTab === 'urus' && state.staffLogin
                                                      ? renderUrusStreaming()
                                                      : renderStreaming();
  else if (state.tab === 'tetapan')   el.innerHTML = renderTetapan();
}


/* ================================================================
   NAVIGASI
   ================================================================ */
function setTab(tab) {
  if (tab === 'tetapan' && !state.staffLogin) { bukaPanelLogin(); return; }
  state.tab               = tab;
  state.selectedSukan     = null;
  state.editingAcara      = null;
  state.editingPerlawanan = null;
  if (tab !== 'jadual') state.jadualSukanTab = null;
  if (tab === 'jadual') semakAutoStatus(); /* ← semak bila masuk tab Jadual */
  render();
}

function pilihSukan(id) {
  state.selectedSukan = id;
  state.editingAcara  = null;
  render();
}

function goBack() {
  state.selectedSukan = null;
  state.editingAcara  = null;
  render();
}

function togolMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
}


/* ================================================================
   MULA APLIKASI
   ================================================================ */
muatData();
mulaAutoStatus();
render();
>>>>>>> bf49cbd (feat: add tetapan.js for settings management with sub-tabs for account management, staff addition, team management, and sports & events)
