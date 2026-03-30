/* ================================================================
   badminton.js — MODUL BADMINTON (SCORE SET + BRACKET DRAW)
   ================================================================
   Fungsi khas untuk sukan badminton:
   - Score ikut set (best of 3, max 21 mata)
   - Paparan bracket visual (Draw) ikut fasa
   - Integrasi penuh dengan sistem sedia ada
   ================================================================ */


/* ================================================================
   PEMBANTU — kira pemenang set dan perlawanan
   ================================================================ */

/* Semak sama ada satu set dah selesai (21 mata, beza 2, max 30) */
function setBadmintonSelesai(a, b) {
  if (a >= 30 || b >= 30) return true;
  if ((a >= 21 || b >= 21) && Math.abs(a - b) >= 2) return true;
  return false;
}

/* Kira ringkasan perlawanan dari sets */
function kiraPerlawananBadminton(sets) {
  /* sets = [{r,t}, {r,t}, {r,t}] */
  let menangR = 0, menangT = 0;
  const setInfo = [];

  for (const s of sets) {
    const r = parseInt(s.r) || 0;
    const t = parseInt(s.t) || 0;
    if (r === 0 && t === 0) continue; /* set kosong */
    const selesai = setBadmintonSelesai(r, t);
    if (r > t) menangR++;
    else if (t > r) menangT++;
    setInfo.push({ r, t, selesai });
    if (menangR === 2 || menangT === 2) break; /* max 2 set menang */
  }

  return {
    sets:    setInfo,
    menangR, menangT,
    selesai: menangR === 2 || menangT === 2,
    scoreR:  menangR,
    scoreT:  menangT,
  };
}

/* Dapatkan skor ringkas untuk paparan kad (contoh: "2-1") */
function badmintonScoreStr(perlawanan) {
  if (!perlawanan.sets || perlawanan.sets.length === 0) return null;
  const r = perlawanan.scoreRumah || 0;
  const t = perlawanan.scoreTamu  || 0;
  if (r === 0 && t === 0) return null;
  return r + ' — ' + t;
}

/* Dapatkan detail set untuk paparan (contoh: "21-15, 18-21, 21-19") */
function badmintonSetStr(sets) {
  if (!sets || sets.length === 0) return '';
  return sets.map(s => s.r + '-' + s.t).join(' | ');
}


/* ================================================================
   RENDER — FORM EDIT SCORE SET BADMINTON
   Dipanggil dari renderKadPerlawanan bila sukan = badminton
   ================================================================ */
function renderFormSetBadminton(sukanId, perlId, isBracket, fasa, mi) {
  /* Ambil data perlawanan */
  let p;
  if (isBracket) {
    p = state.bracket?.[sukanId]?.[fasa]?.[mi];
  } else {
    p = state.jadual.find(m => m.id === perlId);
  }
  if (!p) return '';

  /* Parse sets sedia ada */
  const setsAda = p.sets || [{r:0,t:0},{r:0,t:0},{r:0,t:0}];
  while (setsAda.length < 3) setsAda.push({r:0,t:0});

  const presetSelesai = isBracket ? state.bracketPresetSelesai : (state.rrEditPresetSelesai === perlId);
  const statusAktif   = presetSelesai ? 'selesai' : (p.status || 'akan_datang');
  const tunjukScore   = statusAktif !== 'akan_datang';

  const formId = isBracket ? `bdk-${fasa}-${mi}` : `bdk-${perlId}`;

  return `
    <div class="kad-perlawanan edit-mode" style="margin-bottom:8px">
      <div class="acara-header" style="margin-bottom:14px">
        <div style="font-weight:700;font-size:15px">
          ${p.rumah||'?'} <span style="color:var(--muted);font-weight:400">vs</span> ${p.tamu||'?'}
        </div>
        <div class="acara-status edit">🏸 Score Set</div>
      </div>

      <!-- Tarikh, Masa, Gelanggang -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
        <div>
          <div class="field-label">📅 Tarikh</div>
          <input type="date" id="${formId}-tarikh" class="field-input"
            style="padding:8px 10px;font-size:13px" value="${p.tarikh||''}"/>
        </div>
        <div>
          <div class="field-label">🕐 Masa</div>
          <input type="time" id="${formId}-masa" class="field-input"
            style="padding:8px 10px;font-size:13px" value="${p.masa||''}"/>
        </div>
        <div>
          <div class="field-label">📍 Gelanggang</div>
          <input type="text" id="${formId}-gel" class="field-input"
            style="padding:8px 10px;font-size:13px" value="${p.gelanggang||''}"
            placeholder="Gelanggang A"/>
        </div>
      </div>

      <!-- Status -->
      <div style="margin-bottom:14px">
        <div class="field-label">📊 Status</div>
        <select id="${formId}-status" class="podium-select"
          style="padding:9px 12px;font-size:14px;width:100%;max-width:280px"
          onchange="togolBadmintonScore(this.value,'${formId}')">
          <option value="akan_datang"       ${statusAktif==='akan_datang'?'selected':''}>📅 Akan Datang</option>
          <option value="sedang_berlangsung" ${statusAktif==='sedang_berlangsung'?'selected':''}>🔴 Sedang Berlangsung</option>
          <option value="selesai"            ${statusAktif==='selesai'?'selected':''}>✓ Selesai</option>
        </select>
      </div>

      <!-- Score Set -->
      <div id="${formId}-score-wrap" style="display:${tunjukScore?'block':'none'}">
        <div class="field-label" style="margin-bottom:10px">🏸 Score Set (Maks 3 Set)</div>

        <!-- Header -->
        <div style="display:grid;grid-template-columns:1fr 60px 60px;gap:6px;
          margin-bottom:6px;padding:0 4px">
          <div style="font-size:11px;color:var(--muted)">Pasukan</div>
          <div style="font-size:11px;color:var(--muted);text-align:center">Set 1</div>
          <div style="font-size:11px;color:var(--muted);text-align:center">Set 2</div>
          <div></div>
          <div style="font-size:11px;color:var(--muted);text-align:center">Set 3</div>
        </div>

        <!-- Baris Set (3 set) -->
        ${[0,1,2].map(si => `
          <div class="bdk-set-row" id="${formId}-set${si}-row"
            style="${si===2?'opacity:0.5':''}">
            <div class="bdk-set-label">Set ${si+1}</div>
            <div style="display:flex;align-items:center;gap:10px;flex:1">
              <div class="bdk-pasukan-nama">${p.rumah||'?'}</div>
              <input type="number" id="${formId}-s${si}-r" class="bdk-score-inp"
                min="0" max="30" value="${setsAda[si]?.r||0}"
                oninput="updateBadmintonPreview('${formId}')"/>
              <div class="bdk-vs">:</div>
              <input type="number" id="${formId}-s${si}-t" class="bdk-score-inp"
                min="0" max="30" value="${setsAda[si]?.t||0}"
                oninput="updateBadmintonPreview('${formId}')"/>
              <div class="bdk-pasukan-nama" style="text-align:right">${p.tamu||'?'}</div>
            </div>
          </div>
        `).join('')}

        <!-- Preview keputusan -->
        <div id="${formId}-preview" class="bdk-preview" style="margin-top:12px">
          <!-- diisi oleh updateBadmintonPreview() -->
        </div>
      </div>

      <div class="btn-group" style="margin-top:14px">
        <button class="cancel-btn" onclick="${isBracket ? 'batalEditBracket()' : 'batalEditScore()'}">Batal</button>
        <button class="save-btn"
          onclick="simpanBadmintonScore('${sukanId}','${perlId}',${isBracket},'${fasa||''}',${mi||0},'${formId}')">
          💾 Simpan
        </button>
      </div>
    </div>
  `;
}


/* ================================================================
   FUNGSI JS — toggle, preview, simpan
   ================================================================ */

function togolBadmintonScore(status, formId) {
  const el = document.getElementById(formId + '-score-wrap');
  if (el) el.style.display = status !== 'akan_datang' ? 'block' : 'none';
}

function updateBadmintonPreview(formId) {
  const sets = [0,1,2].map(si => ({
    r: parseInt(document.getElementById(formId + '-s' + si + '-r')?.value) || 0,
    t: parseInt(document.getElementById(formId + '-s' + si + '-t')?.value) || 0,
  }));

  const info = kiraPerlawananBadminton(sets);
  const prev = document.getElementById(formId + '-preview');
  if (!prev) return;

  /* Update opacity set 3 */
  const s2row = document.getElementById(formId + '-set2-row');
  if (s2row) s2row.style.opacity = (info.menangR >= 1 && info.menangT >= 1) ? '1' : '0.4';

  if (info.sets.length === 0) { prev.innerHTML = ''; return; }

  const setStr = info.sets.map((s,i) => {
    const menangR = s.r > s.t;
    return `<span class="bdk-set-chip ${menangR?'r':'t'}">${s.r}-${s.t}</span>`;
  }).join(' ');

  const pemenang = info.menangR === 2 ? '🏸 Set: <strong>' + info.menangR + '-' + info.menangT + '</strong>' :
                   info.menangT === 2 ? '🏸 Set: <strong>' + info.menangT + '-' + info.menangR + '</strong>' :
                   '🏸 Set: ' + info.menangR + '-' + info.menangT;

  prev.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="font-size:12px;color:var(--muted)">${pemenang}</span>
      <div>${setStr}</div>
    </div>
  `;
}

function simpanBadmintonScore(sukanId, perlId, isBracket, fasa, mi, formId) {
  const tarikh     = document.getElementById(formId + '-tarikh')?.value || '';
  const masa       = document.getElementById(formId + '-masa')?.value   || '';
  const gelanggang = document.getElementById(formId + '-gel')?.value?.trim() || '';
  const status     = document.getElementById(formId + '-status')?.value || 'akan_datang';

  const sets = [0,1,2].map(si => ({
    r: parseInt(document.getElementById(formId + '-s' + si + '-r')?.value) || 0,
    t: parseInt(document.getElementById(formId + '-s' + si + '-t')?.value) || 0,
  }));

  const info = kiraPerlawananBadminton(sets);

  /* Ambil perlawanan */
  let p;
  if (isBracket) {
    p = state.bracket?.[sukanId]?.[fasa]?.[mi];
  } else {
    p = state.jadual.find(m => m.id === perlId);
  }
  if (!p) return;

  p.tarikh     = tarikh;
  p.masa       = masa;
  p.gelanggang = gelanggang;
  p.status     = status;
  p.sets       = info.sets;
  p.scoreRumah = info.menangR;
  p.scoreTamu  = info.menangT;

  if (isBracket) {
    state.bracketEdit          = null;
    state.bracketPresetSelesai = false;
    kemaskiniSemakBracket(sukanId);
  } else {
    state.editingPerlawanan    = null;
    state.rrEditPresetSelesai  = null;
  }

  simpanData();
  render();
}

function batalEditScore() {
  state.editingPerlawanan   = null;
  state.rrEditPresetSelesai = null;
  render();
}


/* ================================================================
   RENDER — KAD PERLAWANAN BADMINTON (paparan normal)
   ================================================================ */
function renderKadBadminton(p, isStaff, isBracket, fasa, mi) {
  const selesai = p.status === 'selesai';
  const live    = p.status === 'sedang_berlangsung';
  const menang  = selesai ? (p.scoreRumah > p.scoreTamu ? p.rumah : p.scoreTamu > p.scoreRumah ? p.tamu : null) : null;
  const perlId  = p.id || '';

  const isEdit = isBracket
    ? state.bracketEdit === sukanId + '_' + fasa + '_' + mi
    : state.editingPerlawanan === perlId;

  /* Cari sukanId */
  const sukanId = p.sukanId || (isBracket ? state.jadualSukanTab : p.sukanId);

  if (isEdit) {
    return renderFormSetBadminton(sukanId, perlId, isBracket, fasa, mi);
  }

  const setStr = p.sets ? badmintonSetStr(p.sets) : '';
  const statusKls   = selesai ? 'selesai' : live ? 'berlangsung' : 'akan-datang';
  const statusLabel = selesai ? '✓ Selesai' : live ? '🔴 LIVE' : '📅 Akan Datang';

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        ${p.tarikh ? `<span class="perlawanan-info">📅 ${formatTarikhPendek(p.tarikh)}</span>` : ''}
        ${p.masa   ? `<span class="perlawanan-info">🕐 ${p.masa}</span>` : ''}
        ${p.gelanggang ? `<span class="perlawanan-info">📍 ${p.gelanggang}</span>` : ''}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${menang===p.rumah?'menang':''}">
          <div class="pasukan-nama">${p.rumah||'⏳ Menunggu…'}</div>
        </div>
        ${selesai||live ? `
          <div class="score-paparan" style="flex-direction:column;gap:4px">
            <div style="display:flex;align-items:center;gap:8px">
              <span class="score-num ${menang===p.rumah?'menang':selesai&&menang&&menang!==p.rumah?'kalah':''}">${p.scoreRumah||0}</span>
              <span class="score-dash">—</span>
              <span class="score-num ${menang===p.tamu?'menang':selesai&&menang&&menang!==p.tamu?'kalah':''}">${p.scoreTamu||0}</span>
            </div>
            ${setStr ? `<div class="bdk-set-mini">${setStr}</div>` : ''}
          </div>
        ` : `<div class="score-vs">VS</div>`}
        <div class="pasukan-blok kanan ${menang===p.tamu?'menang':''}">
          <div class="pasukan-nama">${p.tamu||'⏳ Menunggu…'}</div>
        </div>
      </div>
      ${isStaff ? `
        <div class="perlawanan-actions">
          ${!selesai && p.rumah && p.tamu ? `
            <button class="aksi-btn selesai-btn"
              onclick="${isBracket
                ? `mulaEditBracketSelesai('${sukanId}','${fasa}',${mi})`
                : `bukaEditBadminton('${perlId}',true)`}">
              ✓ Tamat + Score
            </button>
          ` : ''}
          ${p.rumah && p.tamu ? `
            <button class="aksi-btn"
              onclick="${isBracket
                ? `mulaEditBracket('${sukanId}','${fasa}',${mi})`
                : `bukaEditBadminton('${perlId}',false)`}">
              ✏️ Edit
            </button>
          ` : ''}
          ${isBracket ? `
            <button class="aksi-btn hapus" onclick="padamSatuBracket('${sukanId}','${fasa}',${mi})">🗑</button>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function bukaEditBadminton(perlId, presetSelesai) {
  state.editingPerlawanan  = perlId;
  state.rrEditPresetSelesai = presetSelesai ? perlId : null;
  render();
}


/* ================================================================
   RENDER — PAPARAN DRAW BRACKET (VISUAL SEPERTI BWF)
   ================================================================ */
function renderDrawBadminton(sukanId) {
  const bracket = state.bracket?.[sukanId];
  if (!bracket) return '';

  const FASA = [
    { key: 'suku_akhir',    label: 'SUKU AKHIR'     },
    { key: 'separuh_akhir', label: 'SEPARUH AKHIR'  },
    { key: 'final',         label: 'FINAL'           },
  ];

  const fasaAda = FASA.filter(f => (bracket[f.key]||[]).length > 0);
  if (fasaAda.length === 0) return '';

  return `
    <div class="bdk-draw-wrap">
      <div class="bdk-draw-header">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;
          font-size:18px;letter-spacing:1px">
          🎯 DRAW — Carta Pertandingan
        </div>
      </div>
      <div class="bdk-draw-grid" style="grid-template-columns:repeat(${fasaAda.length},1fr)">
        ${fasaAda.map(f => `
          <div class="bdk-draw-fasa">
            <div class="bdk-draw-fasa-label">${f.label}</div>
            ${(bracket[f.key]||[]).map((m, mi) => renderDrawKad(sukanId, m, mi, f.key)).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderDrawKad(sukanId, m, mi, fasa) {
  const selesai = m.status === 'selesai';
  const live    = m.status === 'sedang_berlangsung';
  const menang  = selesai ? (m.scoreRumah > m.scoreTamu ? 'rumah' : m.scoreRumah < m.scoreTamu ? 'tamu' : null) : null;

  const kadPasukan = (nama, sets, isRumah) => {
    const isMenang = selesai && menang === (isRumah ? 'rumah' : 'tamu');
    const isKalah  = selesai && menang && !isMenang;
    return `
      <div class="bdk-draw-pasukan ${isMenang?'menang':''} ${isKalah?'kalah':''}">
        <div class="bdk-draw-nama">${nama || '—'}</div>
        <div class="bdk-draw-sets">
          ${sets && sets.length ? sets.map((s,i) => {
            const r = isRumah ? s.r : s.t;
            const t = isRumah ? s.t : s.r;
            const win = r > t;
            return `<span class="bdk-draw-set ${win?'w':''}">${r}</span>`;
          }).join('') : (selesai ? `<span class="bdk-draw-score-main">${isRumah?m.scoreRumah:m.scoreTamu}</span>` : '')}
        </div>
      </div>
    `;
  };

  return `
    <div class="bdk-draw-kad ${selesai?'selesai':live?'live':''}">
      ${m.masa||m.tarikh ? `
        <div class="bdk-draw-masa">
          ${m.tarikh?formatTarikhPendek(m.tarikh):''}
          ${m.masa?'• '+m.masa:''}
          ${m.gelanggang?'• '+m.gelanggang:''}
        </div>
      ` : ''}
      ${kadPasukan(m.rumah, m.sets, true)}
      <div class="bdk-draw-divider"></div>
      ${kadPasukan(m.tamu, m.sets, false)}
      ${live ? '<div class="bdk-live-tag">🔴 LIVE</div>' : ''}
    </div>
  `;
}


/* ================================================================
   SEMAK — adakah sukan ini guna sistem Set?
   Boleh diaktifkan melalui setting "Main ikut Set" dalam Format Sukan
   atau auto-detect dari nama sukan.
   ================================================================ */
function adaBadminton(sukanId) {
  const s = state.sukan.find(x => x.id === sukanId);
  if (!s) return false;
  /* Kalau admin dah set manual (sama ada ON atau OFF), ikut setting tu */
  if (s.mainSet === true)  return true;
  if (s.mainSet === false) return false;
  /* Kalau belum set manual, auto-detect dari nama */
  const nama = s.nama.toLowerCase();
  return nama.includes('badminton') ||
         nama.includes('sepak takraw') ||
         nama.includes('squash') ||
         nama.includes('ping pong') ||
         nama.includes('bola tampar') ||
         nama.includes('volleyball');
}