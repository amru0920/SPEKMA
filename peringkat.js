/* ================================================================
   peringkat.js — SISTEM BRACKET PENUH
   ================================================================
   Fasa:
   1. Peringkat Kumpulan  → hasil dari urus_kumpulan
   2. Suku Akhir (QF)     → jana dari pasukan layak
   3. Separuh Akhir (SF)  → auto-jana dari pemenang QF
   4. Final               → auto-jana dari pemenang SF
   5. Tempat Ke-3         → auto-jana dari yang kalah SF

   Bracket disimpan dalam state.bracket[sukanId]:
   {
     suku_akhir:    [ {id, rumah, tamu, ...}, ... ]
     separuh_akhir: [ ... ]
     final:         [ ... ]
     tempat_ketiga: [ ... ]
   }

   Auto-kemaskini bila score dimasuk ke perlawanan bracket.
   ================================================================ */


/* ================================================================
   KIRA KEDUDUKAN SATU KUMPULAN
   ================================================================ */
function kiraKedudukanKumpulan(katKey, kumpulanId) {
  const k       = (state.kumpulanSukan[katKey] || []).find(g => g.id === kumpulanId);
  const pasukan = k?.pasukan || [];
  const stats   = {};

  pasukan.forEach(p => {
    stats[p] = { nama: p, main:0, menang:0, seri:0, kalah:0, gol:0, masuk:0, pts:0 };
  });

  /* Ambil sukanId dari katKey (boleh jadi 'sukanId' atau 'sukanId___acaraId') */
  const sukanIdKira = katKey.split('___')[0];

  state.jadual
    .filter(m => m.sukanId === sukanIdKira && m.kumpulan === kumpulanId && m.status === 'selesai')
    .forEach(m => {
      if (!stats[m.rumah] || !stats[m.tamu]) return;
      const r = parseInt(m.scoreRumah)||0, t = parseInt(m.scoreTamu)||0;
      stats[m.rumah].main++; stats[m.tamu].main++;
      stats[m.rumah].gol += r; stats[m.rumah].masuk += t;
      stats[m.tamu].gol  += t; stats[m.tamu].masuk  += r;
      if (r > t) { stats[m.rumah].menang++; stats[m.rumah].pts += 3; stats[m.tamu].kalah++; }
      else if (r < t) { stats[m.tamu].menang++; stats[m.tamu].pts += 3; stats[m.rumah].kalah++; }
      else { stats[m.rumah].seri++; stats[m.rumah].pts++; stats[m.tamu].seri++; stats[m.tamu].pts++; }
    });

  return pasukan
    .map(p => ({ ...stats[p], beza: stats[p].gol - stats[p].masuk }))
    .sort((a, b) => b.pts - a.pts || b.beza - a.beza || b.gol - a.gol);
}


/* ================================================================
   HELPER — pemenang sesuatu perlawanan
   ================================================================ */
function pemenangPerlawanan(m) {
  if (!m || m.status !== 'selesai') return null;
  const r = parseInt(m.scoreRumah)||0, t = parseInt(m.scoreTamu)||0;
  if (r > t) return m.rumah;
  if (t > r) return m.tamu;
  return m.rumah; /* seri — tuan rumah advance (boleh ubah ke penalti etc) */
}

function kalahPerlawanan(m) {
  if (!m || m.status !== 'selesai') return null;
  const r = parseInt(m.scoreRumah)||0, t = parseInt(m.scoreTamu)||0;
  if (r > t) return m.tamu;
  if (t > r) return m.rumah;
  return m.tamu;
}


/* ================================================================
   PASTIKAN state.bracket[sukanId] wujud
   ================================================================ */
function pastikanBracket(sukanId) {
  if (!state.bracket)          state.bracket = {};
  if (!state.bracket[sukanId]) state.bracket[sukanId] = {
    suku_akhir:    [],
    separuh_akhir: [],
    final:         [],
    tempat_ketiga: [],
  };
  return state.bracket[sukanId];
}


/* ================================================================
   RENDER PANEL JANA PERINGKAT (dalam Urus Kumpulan)
   ================================================================ */
function renderJanaPeringkat(sukanId, katKey) {
  if (!katKey) katKey = sukanId;
  const kumpulan = state.kumpulanSukan[katKey] || [];
  if (kumpulan.length === 0) return '';

  const kedudukan = kumpulan.map(k => ({
    kumpulan: k,
    senarai:  kiraKedudukanKumpulan(katKey, k.id),
  }));

  const jumlahPerlawanan = state.jadual.filter(m => m.sukanId === sukanId && m.peringkat === 'kumpulan').length;
  const jumlahSelesai    = state.jadual.filter(m => m.sukanId === sukanId && m.peringkat === 'kumpulan' && m.status === 'selesai').length;
  const semuaSelesai     = jumlahPerlawanan > 0 && jumlahSelesai === jumlahPerlawanan;
  const pctSelesai       = jumlahPerlawanan > 0 ? Math.round((jumlahSelesai/jumlahPerlawanan)*100) : 0;

  const layak = kedudukan.flatMap((g, gi) =>
    g.senarai.slice(0, 2).map((p, pi) => ({
      nama: p.nama, tempat: pi+1, kumpulan: g.kumpulan.id, kNama: g.kumpulan.nama,
      pts: p.pts, seedIdx: gi*2+pi,
    }))
  );

  const bracket     = pastikanBracket(sukanId);
  const adaBracket  = bracket.suku_akhir.length > 0 || bracket.separuh_akhir.length > 0 || bracket.final.length > 0;

  return `
    <div class="rr-section" style="margin-top:12px">
      <div class="rr-section-title">
        <span>🏆 Jana Bracket Knockout</span>
        ${adaBracket ? `<span class="count-chip" style="color:var(--gold)">Bracket aktif</span>` : ''}
      </div>

      <!-- Progress -->
      <div class="rr-info-box" style="margin-bottom:14px">
        Peringkat kumpulan: <strong>${jumlahSelesai}/${jumlahPerlawanan}</strong> perlawanan selesai
        ${!semuaSelesai ? `
          <div style="margin-top:8px">
            <div style="height:6px;background:var(--card2);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${pctSelesai}%;background:var(--gold);border-radius:3px"></div>
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:6px">
            ⚠️ ${jumlahPerlawanan - jumlahSelesai} perlawanan kumpulan masih belum selesai.
          </div>
        ` : `<span style="color:var(--green);font-weight:600"> ✓ Semua selesai!</span>`}
      </div>

      <!-- Kedudukan kumpulan ringkas -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-bottom:16px">
        ${kedudukan.map(g => `
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden">
            <div style="background:rgba(55,138,221,0.12);padding:7px 12px;font-size:12px;
              font-weight:700;border-bottom:1px solid var(--border)">
              🔵 ${g.kumpulan.nama}
            </div>
            ${g.senarai.slice(0,2).map((p, i) => `
              <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;
                background:${i===0?'rgba(255,215,0,0.04)':'rgba(192,200,216,0.03)'};
                ${i===0?'border-bottom:1px solid var(--border)':''}">
                <span style="font-size:14px">${i===0?'🥇':'🥈'}</span>
                <span style="flex:1;font-size:13px;font-weight:600">${p.nama||'—'}</span>
                <span style="font-size:11px;color:var(--gold)">${p.pts} pts</span>
              </div>
            `).join('')}
            ${g.senarai.length === 0 ? `
              <div style="padding:10px 12px;font-size:12px;color:var(--muted)">Belum ada keputusan</div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Tetapan -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div>
          <div class="field-label">📅 Tarikh Perlawanan (pilihan)</div>
          <input type="date" id="np-tarikh-${sukanId}" class="field-input"
            style="padding:8px 10px;font-size:13px"/>
        </div>
        <div>
          <div class="field-label">🕐 Masa Mula (pilihan)</div>
          <input type="time" id="np-masa-${sukanId}" class="field-input"
            style="padding:8px 10px;font-size:13px" value="09:00"/>
        </div>
      </div>

      <!-- Kaedah seeding -->
      <div style="margin-bottom:16px">
        <div class="field-label" style="margin-bottom:8px">🎯 Kaedah Seeding</div>
        <div style="display:grid;gap:8px">
          <label class="pilihan-cetak-item">
            <input type="radio" name="np-kaedah-${sukanId}" value="standard" checked/>
            <div class="pc-label" style="padding:10px 14px">
              <span class="pc-icon" style="font-size:18px">🔄</span>
              <div>
                <div class="pc-nama">Standard (Cross-Seeding)</div>
                <div class="pc-desc">Johan A vs Naib Johan B · Johan B vs Naib Johan A</div>
              </div>
            </div>
          </label>
          <label class="pilihan-cetak-item">
            <input type="radio" name="np-kaedah-${sukanId}" value="undi"/>
            <div class="pc-label" style="padding:10px 14px">
              <span class="pc-icon" style="font-size:18px">🎲</span>
              <div>
                <div class="pc-nama">Undi Rawak (Cabutan)</div>
                <div class="pc-desc">Pasukan diundi rawak — adil untuk 4+ kumpulan</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${layak.length >= 2 ? `
          <button class="rr-jana-btn" onclick="janaBracketSukuAkhir('${sukanId}','${katKey}')">
            🏆 ${adaBracket ? 'Jana Semula Bracket' : 'Jana Bracket Knockout'}
          </button>
        ` : `
          <div style="font-size:13px;color:var(--muted);padding:8px 0">
            Sekurang-kurangnya 2 kumpulan dengan pasukan layak diperlukan.
          </div>
        `}
        ${adaBracket ? `
          <button class="staff-del" style="padding:8px 16px;font-size:13px"
            onclick="padamBracket('${sukanId}')">
            🗑 Padam Bracket
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Paparan bracket -->
    ${adaBracket ? renderBracketPaparan(sukanId) : ''}
  `;
}


/* ================================================================
   RENDER BRACKET VISUAL
   ================================================================ */
function renderBracketPaparan(sukanId) {
  const bracket = pastikanBracket(sukanId);

  const FASA = [
    { key: 'suku_akhir',    label: '⚔️ Suku Akhir',       warna: 'rgba(55,138,221,0.2)' },
    { key: 'separuh_akhir', label: '🥊 Separuh Akhir',    warna: 'rgba(245,166,35,0.2)' },
    { key: 'tempat_ketiga', label: '🥉 Tempat Ke-3',       warna: 'rgba(205,127,50,0.2)' },
    { key: 'final',         label: '🏆 Final',             warna: 'rgba(255,215,0,0.2)'  },
  ];

  let html = `
    <div style="margin-top:16px">
      <div class="set-card-label" style="margin-bottom:12px">📊 Bracket Pertandingan</div>
  `;

  FASA.forEach(({ key, label, warna }) => {
    const senarai = bracket[key] || [];
    if (senarai.length === 0) return;

    html += `
      <div style="margin-bottom:12px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;
          font-size:13px;letter-spacing:1px;color:var(--text);
          background:${warna};border-left:3px solid var(--gold);
          padding:6px 12px;border-radius:0 6px 6px 0;margin-bottom:8px">
          ${label}
        </div>
        ${senarai.map((m, mi) => renderKadBracket(sukanId, m, mi, key)).join('')}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}


/* ================================================================
   KAD BRACKET (satu perlawanan dalam bracket)
   ================================================================ */
function renderKadBracket(sukanId, m, mi, fasa) {
  const selesai     = m.status === 'selesai';
  const live        = m.status === 'sedang_berlangsung';
  const menang      = selesai ? pemenangPerlawanan(m) : null;
  const r           = parseInt(m.scoreRumah)||0;
  const t           = parseInt(m.scoreTamu)||0;
  const tba         = !m.rumah || !m.tamu;
  const isEditMode  = state.bracketEdit === sukanId + '_' + fasa + '_' + mi;

  const statusKls   = selesai ? 'selesai' : live ? 'berlangsung' : 'akan-datang';
  const statusLabel = selesai ? '✓ Selesai' : live ? '🔴 LIVE' : tba ? '⏳ Menunggu' : '📅 Akan Datang';

  if (isEditMode) {
    /* Badminton — guna form set khas */
    if (typeof adaBadminton === 'function' && adaBadminton(sukanId)) {
      return renderFormSetBadminton(sukanId, m.id||'', true, fasa, mi);
    }

    const presetSelesai = state.bracketPresetSelesai === true;
    const statusAktif   = presetSelesai ? 'selesai' : m.status;
    const tunjukScore   = statusAktif !== 'akan_datang';

    return `
      <div class="kad-perlawanan edit-mode" style="margin-bottom:8px">
        <div class="acara-header" style="margin-bottom:14px">
          <div style="font-weight:700;font-size:16px">
            ${m.rumah||'?'} <span style="color:var(--muted);font-weight:400">vs</span> ${m.tamu||'?'}
          </div>
          <div class="acara-status edit">✏️ Kemaskini Score</div>
        </div>

        <!-- Tarikh, Masa, Gelanggang -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
          <div>
            <div class="field-label">📅 Tarikh</div>
            <input type="date" id="bk-tarikh-${fasa}-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px" value="${m.tarikh||''}"/>
          </div>
          <div>
            <div class="field-label">🕐 Masa</div>
            <input type="time" id="bk-masa-${fasa}-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px" value="${m.masa||''}"/>
          </div>
          <div>
            <div class="field-label">📍 Gelanggang</div>
            <input type="text" id="bk-gel-${fasa}-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px" placeholder="Contoh: Gelanggang A"
              value="${m.gelanggang||''}"/>
          </div>
        </div>

        <!-- Status -->
        <div style="margin-bottom:14px">
          <div class="field-label">📊 Status</div>
          <select id="bk-status-${fasa}-${mi}" class="podium-select"
            style="padding:9px 12px;font-size:14px;width:100%;max-width:280px"
            onchange="togolBracketScore(this.value,'${fasa}',${mi})">
            <option value="akan_datang"       ${statusAktif==='akan_datang'?'selected':''}>📅 Akan Datang</option>
            <option value="sedang_berlangsung" ${statusAktif==='sedang_berlangsung'?'selected':''}>🔴 Sedang Berlangsung</option>
            <option value="selesai"            ${statusAktif==='selesai'?'selected':''}>✓ Selesai</option>
          </select>
        </div>

        <!-- Score — muncul terus bila preset selesai atau status bukan akan_datang -->
        <div id="bk-score-${fasa}-${mi}" style="display:${tunjukScore?'block':'none'}">
          <div class="score-edit-box">
            <div class="score-edit-label">⚽ Masukkan Score Akhir</div>
            <div class="score-edit-row">
              <div class="score-edit-pasukan">${m.rumah||'?'}</div>
              <input type="number" id="bk-sr-${fasa}-${mi}" class="score-big-input"
                min="0" value="${r}" placeholder="0"/>
              <div class="score-edit-dash">—</div>
              <input type="number" id="bk-st-${fasa}-${mi}" class="score-big-input"
                min="0" value="${t}" placeholder="0"/>
              <div class="score-edit-pasukan">${m.tamu||'?'}</div>
            </div>
          </div>
        </div>

        <div class="btn-group" style="margin-top:14px">
          <button class="cancel-btn" onclick="batalEditBracket()">Batal</button>
          <button class="save-btn" onclick="simpanBracketPerlawanan('${sukanId}','${fasa}',${mi})">
            💾 Simpan
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        ${m.tarikh  ? `<span class="perlawanan-info">📅 ${formatTarikhPendek(m.tarikh)}</span>` : ''}
        ${m.masa    ? `<span class="perlawanan-info">🕐 ${m.masa}</span>` : ''}
        ${m.gelanggang ? `<span class="perlawanan-info">📍 ${m.gelanggang}</span>` : ''}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${selesai && menang === m.rumah ? 'menang' : ''}">
          <div class="pasukan-nama">${m.rumah || '⏳ Menunggu pemenang…'}</div>
        </div>
        ${selesai || live ? `
          <div class="score-paparan">
            <span class="score-num ${selesai && menang===m.rumah ? 'menang' : selesai && menang!==m.rumah && r!==t ? 'kalah' : ''}">${r}</span>
            <span class="score-dash">—</span>
            <span class="score-num ${selesai && menang===m.tamu  ? 'menang' : selesai && menang!==m.tamu  && r!==t ? 'kalah' : ''}">${t}</span>
          </div>
        ` : `<div class="score-vs">VS</div>`}
        <div class="pasukan-blok kanan ${selesai && menang === m.tamu ? 'menang' : ''}">
          <div class="pasukan-nama">${m.tamu || '⏳ Menunggu pemenang…'}</div>
        </div>
      </div>
      <div class="perlawanan-actions">
        ${!selesai && !tba ? `
          <button class="aksi-btn selesai-btn"
            onclick="mulaEditBracketSelesai('${sukanId}','${fasa}',${mi})">
            ✓ Tamat + Score
          </button>
        ` : ''}
        ${!tba ? `
          <button class="aksi-btn" onclick="mulaEditBracket('${sukanId}','${fasa}',${mi})">
            ✏️ Edit
          </button>
        ` : ''}
        <button class="aksi-btn hapus" title="Padam perlawanan ini"
          onclick="padamSatuBracket('${sukanId}','${fasa}',${mi})">🗑</button>
      </div>
    </div>
  `;
}


/* ================================================================
   RENDER BRACKET DALAM TAB JADUAL (awam tengok)
   ================================================================ */
function renderBracketJadual(sukanId, isStaff) {
  const bracket = state.bracket?.[sukanId];
  if (!bracket) return '';

  const FASA = [
    { key: 'suku_akhir',    label: '⚔️ Suku Akhir'     },
    { key: 'separuh_akhir', label: '🥊 Separuh Akhir'  },
    { key: 'tempat_ketiga', label: '🥉 Tempat Ke-3'     },
    { key: 'final',         label: '🏆 Final'           },
  ];

  let html = '';
  FASA.forEach(({ key, label }) => {
    const senarai = bracket[key] || [];
    if (senarai.length === 0) return;

    html += `
      <div class="peringkat-blok" id="peringkat-${sukanId}-${key}"
        style="${key==='final'?'border-color:rgba(255,215,0,0.3)':''}">
        <div class="peringkat-header" style="${key==='final'?'color:var(--gold)':''}">
          ${label}
        </div>
        ${senarai.map((m, mi) => {
          /* Render kad berbeza untuk staff (ada edit) vs awam */
          if (isStaff) return renderKadBracket(sukanId, m, mi, key);
          return renderKadBracketAwam(m);
        }).join('')}
      </div>
    `;
  });

  return html;
}

/* Kad bracket untuk paparan awam */
function renderKadBracketAwam(m) {
  const selesai = m.status === 'selesai';
  const live    = m.status === 'sedang_berlangsung';
  const menang  = selesai ? pemenangPerlawanan(m) : null;
  const r = parseInt(m.scoreRumah)||0, t = parseInt(m.scoreTamu)||0;
  const statusKls = selesai ? 'selesai' : live ? 'berlangsung' : 'akan-datang';

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">
          ${selesai ? '✓ Selesai' : live ? '🔴 LIVE' : m.rumah ? '📅 Akan Datang' : '⏳ Menunggu'}
        </span>
        ${m.masa ? `<span class="perlawanan-info">🕐 ${m.masa}</span>` : ''}
        ${m.gelanggang ? `<span class="perlawanan-info">📍 ${m.gelanggang}</span>` : ''}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${selesai && menang===m.rumah?'menang':''}">
          <div class="pasukan-nama">${m.rumah || '⏳ Menunggu…'}</div>
        </div>
        ${selesai||live ? `
          <div class="score-paparan">
            <span class="score-num ${selesai&&menang===m.rumah?'menang':selesai&&r!==t?'kalah':''}">${r}</span>
            <span class="score-dash">—</span>
            <span class="score-num ${selesai&&menang===m.tamu?'menang':selesai&&r!==t?'kalah':''}">${t}</span>
          </div>
        ` : `<div class="score-vs">VS</div>`}
        <div class="pasukan-blok kanan ${selesai && menang===m.tamu?'menang':''}">
          <div class="pasukan-nama">${m.tamu || '⏳ Menunggu…'}</div>
        </div>
      </div>
    </div>
  `;
}


/* ================================================================
   JANA SUKU AKHIR DARI KUMPULAN
   ================================================================ */
function janaBracketSukuAkhir(sukanId, katKey) {
  if (!katKey) katKey = sukanId;
  const kumpulan = state.kumpulanSukan[katKey] || [];
  const tarikh   = document.getElementById('np-tarikh-' + sukanId)?.value || '';
  const masa     = document.getElementById('np-masa-'   + sukanId)?.value || '09:00';
  const kaedah   = document.querySelector(`[name="np-kaedah-${sukanId}"]:checked`)?.value || 'standard';

  const layak = kumpulan.flatMap(k => {
    const kddk = kiraKedudukanKumpulan(katKey, k.id);
    return kddk.slice(0, 2).map((p, i) => ({
      nama: p.nama, tempat: i+1, kumpulan: k.id, kNama: k.nama,
    }));
  });

  if (layak.length < 2) { alert('Tambah pasukan layak dahulu.'); return; }

  /* Tentukan pasangan */
  let pasangan = kaedah === 'undi'
    ? _seedingUndi(layak)
    : _seedingStandard(layak, kumpulan.length);

  const bracket = pastikanBracket(sukanId);

  /* Jana suku akhir */
  const masaBase = tarikh && masa ? new Date(tarikh + 'T' + masa + ':00') : null;
  bracket.suku_akhir = pasangan.map((p, i) => {
    let t = '', ms = '';
    if (masaBase) {
      const d = new Date(masaBase.getTime() + i * 90 * 60000);
      t  = d.toISOString().split('T')[0];
      ms = d.toTimeString().slice(0, 5);
    }
    return {
      id: sukanId + '_sa_' + i, rumah: p.rumah, tamu: p.tamu,
      label: p.label || '', tarikh: t, masa: ms, gelanggang: '',
      status: 'akan_datang', scoreRumah: 0, scoreTamu: 0,
    };
  });

  /* Jana separuh akhir, final, tempat ketiga — slot kosong (isi bila ada pemenang) */
  const bilSA = Math.ceil(pasangan.length / 2);
  bracket.separuh_akhir = Array.from({ length: bilSA }, (_, i) => ({
    id: sukanId + '_sf_' + i, rumah: '', tamu: '',
    label: 'Pemenang SA' + (i*2+1) + ' vs Pemenang SA' + (i*2+2),
    tarikh: '', masa: '', gelanggang: '',
    status: 'akan_datang', scoreRumah: 0, scoreTamu: 0,
  }));

  /* Final & tempat ke-3 */
  bracket.final = [{
    id: sukanId + '_final', rumah: '', tamu: '',
    label: 'Pemenang Separuh Akhir 1 vs Pemenang Separuh Akhir 2',
    tarikh: '', masa: '', gelanggang: '',
    status: 'akan_datang', scoreRumah: 0, scoreTamu: 0,
  }];

  bracket.tempat_ketiga = [{
    id: sukanId + '_3rd', rumah: '', tamu: '',
    label: 'Kalah Separuh Akhir 1 vs Kalah Separuh Akhir 2',
    tarikh: '', masa: '', gelanggang: '',
    status: 'akan_datang', scoreRumah: 0, scoreTamu: 0,
  }];

  /* Kalau hanya 2 pasukan layak — terus ke final */
  if (pasangan.length === 1) {
    bracket.separuh_akhir = [];
    bracket.tempat_ketiga = [];
    bracket.final = [{
      id: sukanId + '_final', rumah: pasangan[0].rumah, tamu: pasangan[0].tamu,
      label: 'Final', tarikh: '', masa: '', gelanggang: '',
      status: 'akan_datang', scoreRumah: 0, scoreTamu: 0,
    }];
  }

  simpanData();
  kemaskiniSemakBracket(sukanId);

  const namaFasa = pasangan.length === 1 ? 'Final'
                 : pasangan.length === 2 ? 'Separuh Akhir'
                 : 'Suku Akhir';
  alert(`✅ Bracket dijana!\n\n${pasangan.length} perlawanan ${namaFasa} telah dibuat.\nSeparuh Akhir & Final akan diisi secara automatik apabila keputusan dimasuk.`);
  render();
}


/* ================================================================
   AUTO-KEMASKINI BRACKET SELEPAS SCORE DIMASUK
   Dipanggil bila simpan bracket perlawanan
   ================================================================ */
function kemaskiniSemakBracket(sukanId) {
  const bracket = state.bracket?.[sukanId];
  if (!bracket) return;

  const sa = bracket.suku_akhir    || [];
  const sf = bracket.separuh_akhir || [];
  const fin = bracket.final?.[0];
  const t3  = bracket.tempat_ketiga?.[0];

  /* ── Isi separuh akhir dari pemenang suku akhir ──
     SA0+SA1 → SF0 rumah+tamu
     SA2+SA3 → SF1 rumah+tamu
     dsb.
  */
  sf.forEach((m, i) => {
    const sa1 = sa[i * 2];
    const sa2 = sa[i * 2 + 1];
    const p1  = pemenangPerlawanan(sa1);
    const p2  = pemenangPerlawanan(sa2);
    if (p1) m.rumah = p1;
    if (p2) m.tamu  = p2;
  });

  /* ── Kalau tiada separuh akhir (terus dari SA ke final) ── */
  if (sf.length === 0 && sa.length >= 2) {
    const p1 = pemenangPerlawanan(sa[0]);
    const p2 = pemenangPerlawanan(sa[1]);
    if (fin) {
      if (p1) fin.rumah = p1;
      if (p2) fin.tamu  = p2;
    }
    return;
  }

  /* ── Isi final dari pemenang separuh akhir ── */
  if (sf.length === 1) {
    const p = pemenangPerlawanan(sf[0]);
    const k = kalahPerlawanan(sf[0]);
    if (fin && p) fin.rumah = p;
  } else if (sf.length >= 2) {
    const p1 = pemenangPerlawanan(sf[0]);
    const p2 = pemenangPerlawanan(sf[1]);
    const k1 = kalahPerlawanan(sf[0]);
    const k2 = kalahPerlawanan(sf[1]);
    if (fin) {
      if (p1) fin.rumah = p1;
      if (p2) fin.tamu  = p2;
    }
    if (t3) {
      if (k1) t3.rumah = k1;
      if (k2) t3.tamu  = k2;
    }
  }
}


/* ================================================================
   FUNGSI EDIT BRACKET
   ================================================================ */
function mulaEditBracket(sukanId, fasa, mi) {
  state.bracketEdit = sukanId + '_' + fasa + '_' + mi;
  render();
}

function mulaEditBracketSelesai(sukanId, fasa, mi) {
  state.bracketEdit        = sukanId + '_' + fasa + '_' + mi;
  state.bracketPresetSelesai = true;
  render();
}

function batalEditBracket() {
  state.bracketEdit          = null;
  state.bracketPresetSelesai = false;
  render();
}

function togolBracketScore(status, fasa, mi) {
  const el = document.getElementById('bk-score-' + fasa + '-' + mi);
  if (el) el.style.display = status !== 'akan_datang' ? 'block' : 'none';
}

function simpanBracketPerlawanan(sukanId, fasa, mi) {
  const bracket = state.bracket?.[sukanId];
  if (!bracket?.[fasa]?.[mi]) return;

  const m = bracket[fasa][mi];
  m.tarikh     = document.getElementById('bk-tarikh-'  + fasa + '-' + mi)?.value || '';
  m.masa       = document.getElementById('bk-masa-'    + fasa + '-' + mi)?.value || '';
  m.gelanggang = document.getElementById('bk-gel-'     + fasa + '-' + mi)?.value?.trim() || '';
  m.status     = document.getElementById('bk-status-'  + fasa + '-' + mi)?.value || 'akan_datang';

  /* Ambil score hanya kalau status bukan akan_datang */
  if (m.status !== 'akan_datang') {
    m.scoreRumah = parseInt(document.getElementById('bk-sr-' + fasa + '-' + mi)?.value) || 0;
    m.scoreTamu  = parseInt(document.getElementById('bk-st-' + fasa + '-' + mi)?.value) || 0;
  }

  state.bracketEdit          = null;
  state.bracketPresetSelesai = false;

  kemaskiniSemakBracket(sukanId);
  simpanData();
  render();
}

function padamBracket(sukanId) {
  if (!confirm('Padam keseluruhan bracket untuk sukan ini?')) return;
  if (state.bracket) delete state.bracket[sukanId];
  simpanData();
  render();
}

function padamSatuBracket(sukanId, fasa, mi) {
  const bracket = state.bracket?.[sukanId];
  if (!bracket?.[fasa]) return;
  const m = bracket[fasa][mi];
  const label = m.rumah && m.tamu ? `${m.rumah} vs ${m.tamu}` : 'perlawanan ini';
  if (!confirm('Padam "' + label + '"?')) return;
  bracket[fasa].splice(mi, 1);
  simpanData();
  render();
}


/* ================================================================
   SEEDING HELPERS
   ================================================================ */
function _seedingStandard(layak, bilKumpulan) {
  const johan     = layak.filter(p => p.tempat === 1);
  const naibJohan = layak.filter(p => p.tempat === 2);
  const pasangan  = [];
  const n         = Math.min(johan.length, naibJohan.length);

  if (bilKumpulan === 2) {
    pasangan.push({ rumah: johan[0]?.nama||'?', tamu: naibJohan[1]?.nama||'?',
      label: `🥇${johan[0]?.kNama} vs 🥈${naibJohan[1]?.kNama||'?'}` });
    if (johan[1] && naibJohan[0])
      pasangan.push({ rumah: johan[1].nama, tamu: naibJohan[0].nama,
        label: `🥇${johan[1].kNama} vs 🥈${naibJohan[0].kNama}` });
  } else {
    for (let i = 0; i < n; i++) {
      const nj = n - 1 - i;
      pasangan.push({
        rumah: johan[i]?.nama||'?',
        tamu:  naibJohan[nj]?.nama||'?',
        label: `🥇${johan[i]?.kNama} vs 🥈${naibJohan[nj]?.kNama||'?'}`,
      });
    }
  }
  return pasangan;
}

function _seedingUndi(layak) {
  const johan     = [...layak.filter(p => p.tempat === 1)];
  const naibJohan = [...layak.filter(p => p.tempat === 2)];

  for (let i = naibJohan.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [naibJohan[i], naibJohan[j]] = [naibJohan[j], naibJohan[i]];
  }

  let cuba = 0;
  while (cuba < 30) {
    let ok = true;
    for (let i = 0; i < johan.length; i++) {
      if (naibJohan[i] && johan[i].kumpulan === naibJohan[i].kumpulan) { ok = false; break; }
    }
    if (ok) break;
    for (let i = naibJohan.length-1; i > 0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [naibJohan[i], naibJohan[j]] = [naibJohan[j], naibJohan[i]];
    }
    cuba++;
  }

  return johan.map((j, i) => ({
    rumah: j.nama, tamu: naibJohan[i]?.nama||'?',
    label: `🎲 ${j.kNama} vs ${naibJohan[i]?.kNama||'?'}`,
  }));
}