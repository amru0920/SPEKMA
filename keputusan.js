<<<<<<< HEAD
/* ================================================================
   keputusan.js — KEPUTUSAN & SCORE SETIAP ACARA
   ================================================================

   FAIL INI mengandungi:
   ✏️  Cara paparan keputusan (awam & staff)
   ✏️  Form input score & keputusan untuk staff
   ✏️  Fungsi simpan & padam keputusan

   FORMAT SCORE:
   - Sukan PASUKAN  (contoh bola sepak): "3 - 1", "21 - 15"
   - Sukan INDIVIDU (contoh olahraga)  : "10.5s", "45.2m", "1:23.4"

   Placeholder dalam input akan tukar ikut jenis sukan automatik.
   ================================================================ */


/* ----------------------------------------------------------------
   RENDER GRID KAD SUKAN  (bila klik tab Keputusan)
   ---------------------------------------------------------------- */
function renderKeputusan() {
  /* Kalau sukan dah dipilih → tunjuk senarai acara */
  if (state.selectedSukan) return renderAcara();

  const kards = state.sukan.map(s => {
    const done = countDone(s);
    const siap = done === s.acara.length && s.acara.length > 0;
    return `
      <div class="sukan-card" onclick="pilihSukan('${s.id}')">
        ${siap ? '<span class="done-badge">✓ Siap</span>' : ''}
        <div class="sukan-icon">${s.icon || '🏅'}</div>
        <div class="sukan-name">${s.nama}</div>
        <div class="sukan-count">${done} / ${s.acara.length} acara selesai</div>
      </div>
    `;
  }).join('');

  return `<div class="sukan-grid">${kards}</div>`;
}


/* ----------------------------------------------------------------
   RENDER SENARAI ACARA dalam satu sukan
   ---------------------------------------------------------------- */
function renderAcara() {
  const sukan = state.sukan.find(s => s.id === state.selectedSukan);
  if (!sukan) return '';

  const isStaff   = !!state.staffLogin;
  const isPasukan = sukan.jenis === 'pasukan';

  const acaraHTML = sukan.acara.map(a => {
    const r      = state.keputusan[a.id] || {};
    const isEdit = state.editingAcara === a.id;

    /* ── MOD EDIT (staff sahaja) ── */
    if (isEdit && isStaff) {
      return renderFormEdit(a, sukan, isPasukan);
    }

    /* ── MOD PAPAR (semua orang) ── */
    return renderPaparAcara(a, r, isStaff, isPasukan);
  }).join('');

  return `
    <button class="back-btn" onclick="goBack()">← Balik</button>
    <div class="section-title">${sukan.icon || '🏅'} ${sukan.nama}</div>
    ${acaraHTML}
  `;
}


/* ----------------------------------------------------------------
   FORM EDIT KEPUTUSAN (staff sahaja)
   ---------------------------------------------------------------- */
function renderFormEdit(acara, sukan, isPasukan) {
  const r        = state.keputusan[acara.id] || {};
  const scoreLabel = isPasukan
    ? 'Score Perlawanan (contoh: 3 - 1)'
    : 'Masa / Jarak / Markah';
  const scorePh = isPasukan ? 'Contoh: 3 - 1' : 'Contoh: 10.45s / 45.2m';

  /* Buat pilihan pasukan untuk dropdown */
  const opsDropdown = (pos) => state.pasukan.map(p =>
    `<option value="${p}" ${(r[pos] || '') === p ? 'selected' : ''}>${p}</option>`
  ).join('');

  return `
    <div class="acara-card edit-mode">

      <div class="acara-header">
        <div class="acara-name">${acara.nama}</div>
        <div class="acara-status edit">✏️ Sedang diedit</div>
      </div>

      <!-- Score Keseluruhan (pilihan) -->
      <div class="score-input-group">
        <label class="score-label">📊 ${scoreLabel}</label>
        <input type="text"
          id="score-keseluruhan-${acara.id}"
          class="score-input"
          placeholder="${scorePh}"
          value="${r.score || ''}"
        />
        <div class="score-hint">
          ${isPasukan
            ? 'Masukkan score akhir perlawanan. Contoh: <strong>3 - 1</strong>, <strong>21 - 18</strong>'
            : 'Masukkan masa atau jarak. Contoh: <strong>10.45s</strong>, <strong>45.20m</strong>'
          }
        </div>
      </div>

      <!-- Tempat 1, 2, 3 -->
      <div class="podium-edit-grid">

        <div class="podium-edit-slot">
          <div class="podium-edit-label p1">🥇 Tempat 1</div>
          <select class="podium-select" id="sel-1-${acara.id}">
            <option value="">-- Pilih Pasukan --</option>
            ${opsDropdown(1)}
          </select>
          <input type="text"
            id="score-1-${acara.id}"
            class="score-sub-input"
            placeholder="${isPasukan ? 'Score pasukan ini' : 'Masa / Jarak'}"
            value="${r.score1 || ''}"
          />
        </div>

        <div class="podium-edit-slot">
          <div class="podium-edit-label p2">🥈 Tempat 2</div>
          <select class="podium-select" id="sel-2-${acara.id}">
            <option value="">-- Pilih (pilihan) --</option>
            ${opsDropdown(2)}
          </select>
          <input type="text"
            id="score-2-${acara.id}"
            class="score-sub-input"
            placeholder="${isPasukan ? 'Score pasukan ini' : 'Masa / Jarak'}"
            value="${r.score2 || ''}"
          />
        </div>

        <div class="podium-edit-slot">
          <div class="podium-edit-label p3">🥉 Tempat 3</div>
          <select class="podium-select" id="sel-3-${acara.id}">
            <option value="">-- Pilih (pilihan) --</option>
            ${opsDropdown(3)}
          </select>
          <input type="text"
            id="score-3-${acara.id}"
            class="score-sub-input"
            placeholder="${isPasukan ? 'Score pasukan ini' : 'Masa / Jarak'}"
            value="${r.score3 || ''}"
          />
        </div>

      </div><!-- /podium-edit-grid -->

      <div class="btn-group">
        <button class="cancel-btn" onclick="batalEdit()">Batal</button>
        <button class="save-btn" onclick="simpanKeputusan('${acara.id}')">
          💾 Simpan Keputusan
        </button>
      </div>

    </div>
  `;
}


/* ----------------------------------------------------------------
   PAPARAN KEPUTUSAN (semua orang boleh lihat)
   ---------------------------------------------------------------- */
function renderPaparAcara(acara, r, isStaff, isPasukan) {
  /* Butang edit — staff sahaja */
  const editBtn = isStaff ? `
    <div class="btn-group">
      <button class="edit-btn" onclick="mulaEdit('${acara.id}')">
        ${r[1] ? '✏️ Edit Keputusan' : '+ Masuk Keputusan'}
      </button>
      ${r[1] ? `<button class="padam-btn" onclick="padamKeputusan('${acara.id}')">🗑 Padam</button>` : ''}
    </div>
  ` : '';

  /* Kalau belum ada keputusan */
  if (!r[1]) {
    return `
      <div class="acara-card">
        <div class="acara-header">
          <div class="acara-name">${acara.nama}</div>
          <div class="acara-status">Belum ada keputusan</div>
        </div>
        ${editBtn}
      </div>
    `;
  }

  /* Score keseluruhan (kalau ada) */
  const scoreBadge = r.score ? `
    <div class="score-badge">${isPasukan ? '⚽' : '⏱'} ${r.score}</div>
  ` : '';

  /* Podium hasil */
  const podiumHTML = `
    <div class="podium-result">

      <div class="podium-result-slot">
        <div class="podium-result-label p1">🥇 Tempat 1</div>
        <div class="podium-result-nama e">${r[1]}</div>
        ${r.score1 ? `<div class="podium-score">${r.score1}</div>` : ''}
      </div>

      <div class="podium-result-slot">
        <div class="podium-result-label p2">🥈 Tempat 2</div>
        <div class="podium-result-nama p">${r[2] || '—'}</div>
        ${r.score2 ? `<div class="podium-score">${r.score2}</div>` : ''}
      </div>

      <div class="podium-result-slot">
        <div class="podium-result-label p3">🥉 Tempat 3</div>
        <div class="podium-result-nama g">${r[3] || '—'}</div>
        ${r.score3 ? `<div class="podium-score">${r.score3}</div>` : ''}
      </div>

    </div>
  `;

  return `
    <div class="acara-card done">
      <div class="acara-header">
        <div class="acara-name">${acara.nama}</div>
        <div class="acara-status done">✓ Selesai</div>
      </div>
      ${scoreBadge}
      ${podiumHTML}
      ${editBtn}
    </div>
  `;
}


/* ================================================================
   FUNGSI SIMPAN / PADAM KEPUTUSAN
   ================================================================ */

/* Mula edit acara */
function mulaEdit(acaraId) {
  if (!state.staffLogin) { bukaPanelLogin(); return; }
  state.editingAcara = acaraId;
  render();
}

/* Batal edit */
function batalEdit() {
  state.editingAcara = null;
  render();
}

/* Simpan keputusan + score */
function simpanKeputusan(acaraId) {
  if (!state.staffLogin) return;

  const s1 = document.getElementById('sel-1-' + acaraId)?.value || '';
  const s2 = document.getElementById('sel-2-' + acaraId)?.value || '';
  const s3 = document.getElementById('sel-3-' + acaraId)?.value || '';

  if (!s1) {
    alert('Sila pilih sekurang-kurangnya Tempat Pertama!');
    return;
  }

  /* Semak duplikasi pasukan */
  const pil = [s1, s2, s3].filter(Boolean);
  if (new Set(pil).size !== pil.length) {
    alert('Pasukan yang sama tidak boleh menang dua tempat!');
    return;
  }

  /* Score */
  const score  = document.getElementById('score-keseluruhan-' + acaraId)?.value?.trim() || '';
  const score1 = document.getElementById('score-1-' + acaraId)?.value?.trim() || '';
  const score2 = document.getElementById('score-2-' + acaraId)?.value?.trim() || '';
  const score3 = document.getElementById('score-3-' + acaraId)?.value?.trim() || '';

  state.keputusan[acaraId] = { 1: s1, 2: s2, 3: s3, score, score1, score2, score3 };
  state.editingAcara = null;
  simpanData();
  render();
}

/* Padam keputusan satu acara */
function padamKeputusan(acaraId) {
  const sukan = state.sukan.find(s => s.acara.some(a => a.id === acaraId));
  const acara = sukan?.acara.find(a => a.id === acaraId);
  if (!confirm('Padam keputusan untuk "' + (acara?.nama || acaraId) + '"?')) return;
  delete state.keputusan[acaraId];
  simpanData();
  render();
=======
/* ================================================================
   keputusan.js — KEPUTUSAN & SCORE SETIAP ACARA
   ================================================================

   FAIL INI mengandungi:
   ✏️  Cara paparan keputusan (awam & staff)
   ✏️  Form input score & keputusan untuk staff
   ✏️  Fungsi simpan & padam keputusan

   FORMAT SCORE:
   - Sukan PASUKAN  (contoh bola sepak): "3 - 1", "21 - 15"
   - Sukan INDIVIDU (contoh olahraga)  : "10.5s", "45.2m", "1:23.4"

   Placeholder dalam input akan tukar ikut jenis sukan automatik.
   ================================================================ */


/* ----------------------------------------------------------------
   RENDER GRID KAD SUKAN  (bila klik tab Keputusan)
   ---------------------------------------------------------------- */
function renderKeputusan() {
  /* Kalau sukan dah dipilih → tunjuk senarai acara */
  if (state.selectedSukan) return renderAcara();

  const kards = state.sukan.map(s => {
    const done = countDone(s);
    const siap = done === s.acara.length && s.acara.length > 0;
    return `
      <div class="sukan-card" onclick="pilihSukan('${s.id}')">
        ${siap ? '<span class="done-badge">✓ Siap</span>' : ''}
        <div class="sukan-icon">${s.icon || '🏅'}</div>
        <div class="sukan-name">${s.nama}</div>
        <div class="sukan-count">${done} / ${s.acara.length} acara selesai</div>
      </div>
    `;
  }).join('');

  return `<div class="sukan-grid">${kards}</div>`;
}


/* ----------------------------------------------------------------
   RENDER SENARAI ACARA dalam satu sukan
   ---------------------------------------------------------------- */
function renderAcara() {
  const sukan = state.sukan.find(s => s.id === state.selectedSukan);
  if (!sukan) return '';

  const isStaff   = !!state.staffLogin;
  const isPasukan = sukan.jenis === 'pasukan';

  const acaraHTML = sukan.acara.map(a => {
    const r      = state.keputusan[a.id] || {};
    const isEdit = state.editingAcara === a.id;

    /* ── MOD EDIT (staff sahaja) ── */
    if (isEdit && isStaff) {
      return renderFormEdit(a, sukan, isPasukan);
    }

    /* ── MOD PAPAR (semua orang) ── */
    return renderPaparAcara(a, r, isStaff, isPasukan);
  }).join('');

  return `
    <button class="back-btn" onclick="goBack()">← Balik</button>
    <div class="section-title">${sukan.icon || '🏅'} ${sukan.nama}</div>
    ${acaraHTML}
  `;
}


/* ----------------------------------------------------------------
   FORM EDIT KEPUTUSAN (staff sahaja)
   ---------------------------------------------------------------- */
function renderFormEdit(acara, sukan, isPasukan) {
  const r        = state.keputusan[acara.id] || {};
  const scoreLabel = isPasukan
    ? 'Score Perlawanan (contoh: 3 - 1)'
    : 'Masa / Jarak / Markah';
  const scorePh = isPasukan ? 'Contoh: 3 - 1' : 'Contoh: 10.45s / 45.2m';

  /* Buat pilihan pasukan untuk dropdown */
  const opsDropdown = (pos) => state.pasukan.map(p =>
    `<option value="${p}" ${(r[pos] || '') === p ? 'selected' : ''}>${p}</option>`
  ).join('');

  return `
    <div class="acara-card edit-mode">

      <div class="acara-header">
        <div class="acara-name">${acara.nama}</div>
        <div class="acara-status edit">✏️ Sedang diedit</div>
      </div>

      <!-- Score Keseluruhan (pilihan) -->
      <div class="score-input-group">
        <label class="score-label">📊 ${scoreLabel}</label>
        <input type="text"
          id="score-keseluruhan-${acara.id}"
          class="score-input"
          placeholder="${scorePh}"
          value="${r.score || ''}"
        />
        <div class="score-hint">
          ${isPasukan
            ? 'Masukkan score akhir perlawanan. Contoh: <strong>3 - 1</strong>, <strong>21 - 18</strong>'
            : 'Masukkan masa atau jarak. Contoh: <strong>10.45s</strong>, <strong>45.20m</strong>'
          }
        </div>
      </div>

      <!-- Tempat 1, 2, 3 -->
      <div class="podium-edit-grid">

        <div class="podium-edit-slot">
          <div class="podium-edit-label p1">🥇 Tempat 1</div>
          <select class="podium-select" id="sel-1-${acara.id}">
            <option value="">-- Pilih Pasukan --</option>
            ${opsDropdown(1)}
          </select>
          <input type="text"
            id="score-1-${acara.id}"
            class="score-sub-input"
            placeholder="${isPasukan ? 'Score pasukan ini' : 'Masa / Jarak'}"
            value="${r.score1 || ''}"
          />
        </div>

        <div class="podium-edit-slot">
          <div class="podium-edit-label p2">🥈 Tempat 2</div>
          <select class="podium-select" id="sel-2-${acara.id}">
            <option value="">-- Pilih (pilihan) --</option>
            ${opsDropdown(2)}
          </select>
          <input type="text"
            id="score-2-${acara.id}"
            class="score-sub-input"
            placeholder="${isPasukan ? 'Score pasukan ini' : 'Masa / Jarak'}"
            value="${r.score2 || ''}"
          />
        </div>

        <div class="podium-edit-slot">
          <div class="podium-edit-label p3">🥉 Tempat 3</div>
          <select class="podium-select" id="sel-3-${acara.id}">
            <option value="">-- Pilih (pilihan) --</option>
            ${opsDropdown(3)}
          </select>
          <input type="text"
            id="score-3-${acara.id}"
            class="score-sub-input"
            placeholder="${isPasukan ? 'Score pasukan ini' : 'Masa / Jarak'}"
            value="${r.score3 || ''}"
          />
        </div>

      </div><!-- /podium-edit-grid -->

      <div class="btn-group">
        <button class="cancel-btn" onclick="batalEdit()">Batal</button>
        <button class="save-btn" onclick="simpanKeputusan('${acara.id}')">
          💾 Simpan Keputusan
        </button>
      </div>

    </div>
  `;
}


/* ----------------------------------------------------------------
   PAPARAN KEPUTUSAN (semua orang boleh lihat)
   ---------------------------------------------------------------- */
function renderPaparAcara(acara, r, isStaff, isPasukan) {
  /* Butang edit — staff sahaja */
  const editBtn = isStaff ? `
    <div class="btn-group">
      <button class="edit-btn" onclick="mulaEdit('${acara.id}')">
        ${r[1] ? '✏️ Edit Keputusan' : '+ Masuk Keputusan'}
      </button>
      ${r[1] ? `<button class="padam-btn" onclick="padamKeputusan('${acara.id}')">🗑 Padam</button>` : ''}
    </div>
  ` : '';

  /* Kalau belum ada keputusan */
  if (!r[1]) {
    return `
      <div class="acara-card">
        <div class="acara-header">
          <div class="acara-name">${acara.nama}</div>
          <div class="acara-status">Belum ada keputusan</div>
        </div>
        ${editBtn}
      </div>
    `;
  }

  /* Score keseluruhan (kalau ada) */
  const scoreBadge = r.score ? `
    <div class="score-badge">${isPasukan ? '⚽' : '⏱'} ${r.score}</div>
  ` : '';

  /* Podium hasil */
  const podiumHTML = `
    <div class="podium-result">

      <div class="podium-result-slot">
        <div class="podium-result-label p1">🥇 Tempat 1</div>
        <div class="podium-result-nama e">${r[1]}</div>
        ${r.score1 ? `<div class="podium-score">${r.score1}</div>` : ''}
      </div>

      <div class="podium-result-slot">
        <div class="podium-result-label p2">🥈 Tempat 2</div>
        <div class="podium-result-nama p">${r[2] || '—'}</div>
        ${r.score2 ? `<div class="podium-score">${r.score2}</div>` : ''}
      </div>

      <div class="podium-result-slot">
        <div class="podium-result-label p3">🥉 Tempat 3</div>
        <div class="podium-result-nama g">${r[3] || '—'}</div>
        ${r.score3 ? `<div class="podium-score">${r.score3}</div>` : ''}
      </div>

    </div>
  `;

  return `
    <div class="acara-card done">
      <div class="acara-header">
        <div class="acara-name">${acara.nama}</div>
        <div class="acara-status done">✓ Selesai</div>
      </div>
      ${scoreBadge}
      ${podiumHTML}
      ${editBtn}
    </div>
  `;
}


/* ================================================================
   FUNGSI SIMPAN / PADAM KEPUTUSAN
   ================================================================ */

/* Mula edit acara */
function mulaEdit(acaraId) {
  if (!state.staffLogin) { bukaPanelLogin(); return; }
  state.editingAcara = acaraId;
  render();
}

/* Batal edit */
function batalEdit() {
  state.editingAcara = null;
  render();
}

/* Simpan keputusan + score */
function simpanKeputusan(acaraId) {
  if (!state.staffLogin) return;

  const s1 = document.getElementById('sel-1-' + acaraId)?.value || '';
  const s2 = document.getElementById('sel-2-' + acaraId)?.value || '';
  const s3 = document.getElementById('sel-3-' + acaraId)?.value || '';

  if (!s1) {
    alert('Sila pilih sekurang-kurangnya Tempat Pertama!');
    return;
  }

  /* Semak duplikasi pasukan */
  const pil = [s1, s2, s3].filter(Boolean);
  if (new Set(pil).size !== pil.length) {
    alert('Pasukan yang sama tidak boleh menang dua tempat!');
    return;
  }

  /* Score */
  const score  = document.getElementById('score-keseluruhan-' + acaraId)?.value?.trim() || '';
  const score1 = document.getElementById('score-1-' + acaraId)?.value?.trim() || '';
  const score2 = document.getElementById('score-2-' + acaraId)?.value?.trim() || '';
  const score3 = document.getElementById('score-3-' + acaraId)?.value?.trim() || '';

  state.keputusan[acaraId] = { 1: s1, 2: s2, 3: s3, score, score1, score2, score3 };
  state.editingAcara = null;
  simpanData();
  render();
}

/* Padam keputusan satu acara */
function padamKeputusan(acaraId) {
  const sukan = state.sukan.find(s => s.acara.some(a => a.id === acaraId));
  const acara = sukan?.acara.find(a => a.id === acaraId);
  if (!confirm('Padam keputusan untuk "' + (acara?.nama || acaraId) + '"?')) return;
  delete state.keputusan[acaraId];
  simpanData();
  render();
>>>>>>> bf49cbd (feat: add tetapan.js for settings management with sub-tabs for account management, staff addition, team management, and sports & events)
}