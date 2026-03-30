/* ================================================================
   tetapan.js — HALAMAN TETAPAN
   ================================================================

   FAIL INI mengandungi paparan & fungsi untuk tab ⚙️ Tetapan.
   Terdapat 4 sub-tab:
     1. Urus Akaun    — lihat staff, tukar kata laluan
     2. Tambah Staff  — daftar staff baru
     3. Pasukan       — tambah/padam pasukan
     4. Sukan & Acara — tambah/padam sukan dan acara
   ================================================================ */


/* ----------------------------------------------------------------
   SUB-TAB BAR
   ---------------------------------------------------------------- */
function renderSubTabBar() {
  const tabs = [
    { id: 'urus_akaun',      icon: '🔑', label: 'Urus Akaun' },
    { id: 'tambah_staff',    icon: '👤', label: 'Tambah Staff' },
    { id: 'senarai_pasukan', icon: '🏫', label: 'Pasukan' },
    { id: 'sukan_acara',     icon: '🏅', label: 'Sukan & Acara' },
    { id: 'format_sukan',    icon: '🗂️', label: 'Format Sukan' },
    { id: 'urus_kumpulan',   icon: '🔵', label: 'Urus Kumpulan' },
    { id: 'round_robin',     icon: '🔄', label: 'Round Robin' },
  ];
  return `
    <div class="subtab-bar">
      ${tabs.map(t => `
        <button
          class="subtab-btn ${state.subTab === t.id ? 'active' : ''}"
          onclick="setSubTab('${t.id}')">
          ${t.icon} ${t.label}
        </button>
      `).join('')}
    </div>
  `;
}


/* ----------------------------------------------------------------
   RENDER UTAMA TETAPAN
   ---------------------------------------------------------------- */
function renderTetapan() {
  if (!state.staffLogin) {
    return `
      <div style="text-align:center;padding:60px 20px;color:var(--muted)">
        <div style="font-size:48px;margin-bottom:14px">🔒</div>
        <div style="font-size:16px">Sila log masuk sebagai staff untuk mengakses tetapan.</div>
      </div>
    `;
  }

  let panel = '';
  if      (state.subTab === 'urus_akaun')      panel = panelUrusAkaun();
  else if (state.subTab === 'tambah_staff')    panel = panelTambahStaff();
  else if (state.subTab === 'senarai_pasukan') panel = panelPasukan();
  else if (state.subTab === 'sukan_acara')     panel = panelSukanAcara();
  else if (state.subTab === 'format_sukan')    panel = renderFormatSukan();
  else if (state.subTab === 'urus_kumpulan')   panel = renderUrusKumpulan();
  else if (state.subTab === 'round_robin')     panel = renderUrusRoundRobinPage();

  return renderSubTabBar() + `<div class="set-panel">${panel}</div>`;
}

/* Tukar sub-tab */
function setSubTab(id) {
  state.subTab = id;
  render();
}


/* ================================================================
   SUB-TAB 1: URUS AKAUN
   ================================================================ */
function panelUrusAkaun() {
  return `
    <div class="set-panel-title">🔑 Urus Akaun</div>
    <div class="set-panel-desc">Semak senarai staff aktif dan tukar kata laluan sistem.</div>

    <!-- Kata Laluan -->
    <div class="set-card">
      <div class="set-card-label">Kata Laluan Sistem</div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px">
        <div class="pw-chip" id="pw-papar" data-hidden="true">
          ${'•'.repeat(state.password.length)}
        </div>
        <button class="mini-btn" id="btn-tunjuk-pw" onclick="togolTunjukPw()">Tunjuk</button>
        <button class="mini-btn gold" onclick="bukaTukarPw()">✏️ Tukar Kata Laluan</button>
      </div>
    </div>

    <!-- Form Tukar Kata Laluan -->
    <div id="form-tukar-pw" style="display:none;margin-bottom:12px">
      <div class="set-card" style="border-color:rgba(245,166,35,0.4)">
        <div class="set-card-label" style="margin-bottom:8px">Kata Laluan Baru</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input type="text" id="input-pw-baru" class="field-input"
            placeholder="Masukkan kata laluan baru..."
            style="flex:1;min-width:180px;padding:9px 12px;font-size:14px"
          />
          <button class="save-btn" onclick="tukarPassword()">Simpan</button>
          <button class="cancel-btn"
            onclick="document.getElementById('form-tukar-pw').style.display='none'">
            Batal
          </button>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">
          ⚠️ Semua staff perlu guna kata laluan baru selepas ini.
        </div>
      </div>
    </div>

    <!-- Senarai Staff -->
    <div class="set-card-label" style="margin-bottom:10px">
      Staff Aktif &nbsp;<span class="count-chip">${state.staff.length} orang</span>
    </div>
    <div style="display:grid;gap:8px">
      ${state.staff.map((s, i) => `
        <div class="staff-card">
          <div class="staff-info">
            <div class="staff-nama">${s.nama}</div>
            <div class="staff-ic">
              IC: ••••••${s.ic4}
              &nbsp;·&nbsp;
              <span style="color:var(--gold)">${s.jawatan || 'Staff'}</span>
              ${state.staffLogin?.ic4 === s.ic4
                ? '&nbsp;<span class="admin-chip">Anda</span>' : ''}
            </div>
          </div>
          ${state.staff.length > 1
            ? `<button class="staff-del" onclick="padamStaff(${i})">Padam</button>`
            : `<span class="admin-chip">Admin</span>`
          }
        </div>
      `).join('')}
    </div>
  `;
}


/* ================================================================
   SUB-TAB 2: TAMBAH STAFF
   ================================================================ */
function panelTambahStaff() {
  return `
    <div class="set-panel-title">👤 Tambah Staff Baru</div>
    <div class="set-panel-desc">
      Daftarkan staff baharu. Mereka boleh log masuk menggunakan
      4 digit IC dan kata laluan sistem.
    </div>

    <div class="set-card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <div class="field-label">Nama Penuh</div>
          <input type="text" id="staff-nama" class="field-input"
            placeholder="Contoh: Ahmad Ali"
            style="padding:9px 12px;font-size:14px"
          />
        </div>
        <div>
          <div class="field-label">Jawatan</div>
          <input type="text" id="staff-jawatan" class="field-input"
            placeholder="Contoh: Pegawai Sukan"
            style="padding:9px 12px;font-size:14px"
          />
        </div>
      </div>

      <div style="margin-bottom:14px">
        <div class="field-label">4 Digit Belakang No. IC</div>
        <input type="text" id="staff-ic4" class="field-input"
          placeholder="Contoh: 5678"
          maxlength="4" inputmode="numeric"
          style="padding:9px 12px;font-size:14px;max-width:200px"
          onkeydown="if(event.key==='Enter') tambahStaff()"
        />
        <div style="font-size:11px;color:var(--muted);margin-top:6px">
          Kata laluan: sama dengan kata laluan sistem semasa (<strong
            style="color:var(--gold)">${'•'.repeat(state.password.length)}</strong>)
        </div>
      </div>

      <div id="staff-error"
        style="display:none;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);
               color:#ff8a80;font-size:13px;padding:9px 12px;border-radius:7px;margin-bottom:10px">
      </div>

      <button class="save-btn" style="width:100%;padding:12px;font-size:15px"
        onclick="tambahStaff()">
        + Daftar Staff Baru
      </button>
    </div>

    <div id="staff-berjaya" style="display:none" class="berjaya-box">
      ✅ Staff berjaya didaftarkan!
    </div>
  `;
}


/* ================================================================
   SUB-TAB 3: SENARAI PASUKAN
   ================================================================ */
function panelPasukan() {
  return `
    <div class="set-panel-title">🏫 Senarai Pasukan</div>
    <div class="set-panel-desc">
      Tambah atau padam pasukan yang menyertai kejohanan ini.
    </div>

    <!-- Form tambah -->
    <div class="set-card">
      <div class="field-label">Tambah Pasukan Baru</div>
      <div class="input-row" style="margin-top:8px;margin-bottom:0">
        <input type="text" id="input-pasukan-baru"
          placeholder="Nama pasukan..."
          onkeydown="if(event.key==='Enter') tambahPasukan()"
        />
        <button class="add-btn" onclick="tambahPasukan()">+ Tambah</button>
      </div>
    </div>

    <!-- Senarai semasa -->
    <div class="set-card-label" style="margin-bottom:10px">
      Pasukan Berdaftar &nbsp;<span class="count-chip">${state.pasukan.length}</span>
      ${state.pasukan.length > 0 ? `
        <button class="staff-del" style="margin-left:10px;font-size:11px;padding:3px 10px"
          onclick="padamSemuaPasukan()">
          🗑 Padam Semua
        </button>
      ` : ''}
    </div>
    <div style="display:grid;gap:6px">
      ${state.pasukan.length === 0
        ? `<div style="color:var(--muted);font-size:14px;padding:12px 0">
             Tiada pasukan. Tambah pasukan di atas.
           </div>`
        : state.pasukan.map((p, i) => `
          <div class="pasukan-row">
            <div style="display:flex;align-items:center;gap:10px">
              <span class="pasukan-num">${i + 1}</span>
              <span style="font-size:14px;font-weight:500">${p}</span>
            </div>
            <button class="staff-del" onclick="padamPasukan(${i})">Padam</button>
          </div>
        `).join('')
      }
    </div>
  `;
}


/* ================================================================
   SUB-TAB 4: SUKAN & ACARA
   ================================================================ */
function panelSukanAcara() {
  const EMOJI_PILIHAN = ['🏃','🏸','⚽','🥅','🏐','🏊','🏋️','🎯','🤸','🎾','🏓','🥊','🏹','🚴','🤼','🏇','🎳','🏒','🤺','🏄'];

  return `
    <div class="set-panel-title">🏅 Sukan &amp; Acara</div>
    <div class="set-panel-desc">Tambah sukan baharu dan urus acara dalam setiap sukan.</div>

    <!-- ── FORM TAMBAH SUKAN BARU ── -->
    <div class="set-card" style="border-color:rgba(245,166,35,0.3);margin-bottom:20px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;
        letter-spacing:0.5px;margin-bottom:14px;color:var(--gold)">
        + Tambah Sukan Baru
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <div>
          <div class="field-label">Nama Sukan</div>
          <input type="text" id="sukan-baru-nama" class="field-input"
            placeholder="Contoh: Memanah"
            style="padding:9px 12px;font-size:14px"/>
        </div>
        <div>
          <div class="field-label">Jenis</div>
          <select id="sukan-baru-jenis" class="podium-select"
            style="padding:10px 12px;font-size:14px;width:100%">
            <option value="pasukan">Pasukan</option>
            <option value="individu">Individu</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <div class="field-label" style="margin-bottom:8px">Pilih Ikon</div>
        <div class="emoji-picker" id="emoji-picker">
          ${EMOJI_PILIHAN.map(e => `
            <button class="emoji-btn" onclick="pilihEmoji('${e}',this)">${e}</button>
          `).join('')}
        </div>
        <input type="hidden" id="sukan-baru-icon" value="🏅"/>
        <div style="font-size:12px;color:var(--muted);margin-top:6px">
          Ikon terpilih: <span id="ikon-terpilih" style="font-size:18px">🏅</span>
        </div>
      </div>

      <div id="sukan-baru-error"
        style="display:none;color:#ff8a80;font-size:13px;
          background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);
          padding:8px 12px;border-radius:7px;margin-bottom:10px">
      </div>
      <button class="save-btn" style="padding:10px 24px" onclick="tambahSukanBaru()">
        + Tambah Sukan
      </button>
    </div>

    <!-- ── SENARAI SUKAN SEMASA ── -->
    <div class="set-card-label" style="margin-bottom:10px">
      Sukan Berdaftar &nbsp;<span class="count-chip">${state.sukan.length}</span>
    </div>

    ${state.sukan.map((s, si) => `
      <div class="sukan-panel">
        <div class="sukan-panel-header">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span class="sukan-panel-title">${s.icon || '🏅'} ${s.nama}</span>
            <span class="jenis-chip ${s.jenis}">${s.jenis}</span>
            <span style="font-size:11px;color:var(--muted)">
              ${LABEL_FORMAT[state.formatSukan[s.id] || 'biasa']?.icon || ''}
              ${LABEL_FORMAT[state.formatSukan[s.id] || 'biasa']?.label || ''}
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="acara-count-chip">${s.acara.length} acara</span>
            <button class="staff-del" onclick="padamSukan(${si})">Padam</button>
          </div>
        </div>

        <div class="tag-list" style="margin-bottom:10px">
          ${s.acara.length === 0
            ? `<span style="color:var(--muted);font-size:13px">Tiada acara lagi.</span>`
            : s.acara.map((a, ai) => `
                <div class="tag" style="font-size:12px">
                  ${a.nama}
                  <span class="tag-del" onclick="padamAcara(${si},${ai})">×</span>
                </div>
              `).join('')
          }
        </div>

        <div class="input-row" style="margin-bottom:0">
          <input type="text" id="input-acara-${s.id}"
            placeholder="Nama acara baru..."
            style="font-size:13px"
            onkeydown="if(event.key==='Enter') tambahAcara('${s.id}')"/>
          <button class="add-btn" style="font-size:12px;padding:7px 14px"
            onclick="tambahAcara('${s.id}')">+ Acara</button>
        </div>
      </div>
    `).join('')}
  `;
}


/* ================================================================
   FUNGSI SUKAN BARU
   ================================================================ */

/* Pilih emoji ikon sukan */
function pilihEmoji(emoji, btn) {
  document.getElementById('sukan-baru-icon').value = emoji;
  document.getElementById('ikon-terpilih').textContent = emoji;
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('aktif'));
  btn.classList.add('aktif');
}

/* Tambah sukan baru sepenuhnya */
function tambahSukanBaru() {
  const nama  = document.getElementById('sukan-baru-nama')?.value?.trim();
  const jenis = document.getElementById('sukan-baru-jenis')?.value || 'pasukan';
  const icon  = document.getElementById('sukan-baru-icon')?.value || '🏅';
  const errEl = document.getElementById('sukan-baru-error');

  if (!nama) {
    errEl.textContent = '⚠️ Sila masukkan nama sukan.';
    errEl.style.display = 'block'; return;
  }
  if (state.sukan.find(s => s.nama.toLowerCase() === nama.toLowerCase())) {
    errEl.textContent = '⚠️ Sukan "' + nama + '" sudah wujud.';
    errEl.style.display = 'block'; return;
  }

  errEl.style.display = 'none';
  const newId = 's_' + Date.now();

  /* Tambah ke senarai sukan */
  state.sukan.push({ id: newId, nama, icon, jenis, acara: [] });

  /* Set format lalai ikut jenis */
  state.formatSukan[newId] = jenis === 'individu' ? 'individu' : 'biasa';

  simpanData();
  render();
}

/* Padam sukan */
function padamSukan(si) {
  const s = state.sukan[si];
  if (!confirm('Padam sukan "' + s.nama + '"?\n\nSemua acara dan keputusan berkaitan akan dipadam.')) return;

  /* Padam semua keputusan acara dalam sukan ini */
  s.acara.forEach(a => delete state.keputusan[a.id]);

  /* Padam format & kumpulan */
  delete state.formatSukan[s.id];
  delete state.kumpulanSukan[s.id];

  state.sukan.splice(si, 1);
  simpanData();
  render();
}


/* ================================================================
   FUNGSI PASUKAN & ACARA (dipanggil dari panel di atas)
   ================================================================ */

function tambahPasukan() {
  const inp  = document.getElementById('input-pasukan-baru');
  const nama = inp?.value?.trim();
  if (!nama) return;
  if (state.pasukan.includes(nama)) { alert('Pasukan ini sudah wujud!'); return; }
  state.pasukan.push(nama);
  simpanData();
  render();
}

function padamPasukan(i) {
  if (!confirm('Padam pasukan "' + state.pasukan[i] + '"?')) return;
  state.pasukan.splice(i, 1);
  simpanData();
  render();
}

function padamSemuaPasukan() {
  if (!confirm('Padam SEMUA ' + state.pasukan.length + ' pasukan?\n\nTindakan ini tidak boleh diundur.')) return;
  state.pasukan = [];
  simpanData();
  render();
}

function tambahAcara(sukanId) {
  const inp  = document.getElementById('input-acara-' + sukanId);
  const nama = inp?.value?.trim();
  if (!nama) return;
  const sukan = state.sukan.find(s => s.id === sukanId);
  if (!sukan) return;
  sukan.acara.push({ id: sukanId + '_' + Date.now(), nama });
  simpanData();
  render();
}

function padamAcara(si, ai) {
  const acara = state.sukan[si].acara[ai];
  if (!confirm('Padam acara "' + acara.nama + '"?\n\nKeputusan acara ini juga akan dipadam.')) return;
  delete state.keputusan[acara.id];
  state.sukan[si].acara.splice(ai, 1);
  simpanData();
  render();
}