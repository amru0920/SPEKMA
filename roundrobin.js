<<<<<<< HEAD
/* ================================================================
   roundrobin.js — URUS JADUAL ROUND ROBIN
   ================================================================

   CARA GUNA:
   1. Tetapan → Format Sukan → pilih "Round Robin" untuk sukan
   2. Klik butang "🔄 Urus Round Robin →" yang muncul
   3. Tambah peserta (pasukan yang akan bertanding)
   4. Klik "Jana Jadual" — semua perlawanan dijana
   5. Tetapkan tarikh, masa, gelanggang tiap perlawanan
   6. Bila perlawanan selesai → masuk score

   DATA: state.roundRobin[sukanId] = {
     peserta:    ["Pasukan A", "Pasukan B", ...],
     perlawanan: [{ id, rumah, tamu, tarikh, masa,
                    gelanggang, status, scoreRumah, scoreTamu }]
   }
   ================================================================ */


/* ================================================================
   RENDER UTAMA — Halaman Urus Round Robin
   ================================================================ */
function renderUrusRoundRobinPage() {

  /* Cari semua sukan yang format round_robin */
  const sukanRR = state.sukan.filter(s =>
    (state.formatSukan[s.id] || FORMAT_ASAL[s.id] || 'biasa') === 'round_robin'
  );

  /* Kalau tiada sukan round robin */
  if (sukanRR.length === 0) {
    return `
      <div class="set-panel-title">🔄 Urus Round Robin</div>
      <div class="rr-kosong-box">
        <div style="font-size:40px;margin-bottom:14px">🔄</div>
        <div style="font-weight:600;font-size:15px;margin-bottom:8px">
          Tiada sukan dengan format Round Robin
        </div>
        <div style="font-size:13px;color:var(--muted);line-height:1.7">
          Pergi ke <strong style="color:var(--text)">⚙️ Tetapan → Format Sukan</strong>
          dan tukar sebarang sukan kepada
          <strong style="color:var(--green)">🔄 Round Robin</strong>.
        </div>
        <button class="rr-jana-btn" style="margin-top:16px"
          onclick="setSubTab('format_sukan')">
          Pergi ke Format Sukan →
        </button>
      </div>
    `;
  }

  /* Tentukan sukan aktif */
  const valid    = sukanRR.find(s => s.id === state.rrSukanTab);
  const tabAktif = valid ? state.rrSukanTab : sukanRR[0].id;
  if (!valid) state.rrSukanTab = tabAktif;

  /* Tab pilih sukan (kalau lebih satu) */
  const tabBar = sukanRR.length > 1 ? `
    <div class="subtab-bar" style="margin-bottom:20px">
      ${sukanRR.map(s => `
        <button class="subtab-btn ${s.id === tabAktif ? 'active' : ''}"
          onclick="rrPilihSukan('${s.id}')">
          ${s.icon || '🏅'} ${s.nama}
        </button>
      `).join('')}
    </div>
  ` : '';

  /* Pastikan data roundRobin ada untuk sukan ini */
  if (!state.roundRobin[tabAktif]) {
    state.roundRobin[tabAktif] = { peserta: [], perlawanan: [] };
  }

  const sukan = state.sukan.find(s => s.id === tabAktif);
  const rr    = state.roundRobin[tabAktif];

  return `
    <div class="set-panel-title">🔄 Urus Round Robin</div>
    <div class="set-panel-desc">
      Tambah peserta, jana jadual dan masukkan keputusan setiap perlawanan.
    </div>
    ${tabBar}
    ${renderRRKandungan(tabAktif, sukan, rr)}
  `;
}


/* ================================================================
   RENDER KANDUNGAN SATU SUKAN ROUND ROBIN
   ================================================================ */
function renderRRKandungan(sukanId, sukan, rr) {
  const peserta    = rr.peserta    || [];
  const perlawanan = rr.perlawanan || [];
  const n          = peserta.length;
  const bilPerlw   = n > 1 ? (n * (n - 1)) / 2 : 0;
  const selesai    = perlawanan.filter(m => m.status === 'selesai').length;
  const live       = perlawanan.filter(m => m.status === 'sedang_berlangsung').length;
  const adaJadual  = perlawanan.length > 0;

  /* Pasukan yang belum jadi peserta */
  const belumMasuk = state.pasukan.filter(p => !peserta.includes(p));

  return `

    <!-- ══════════════════════════════════
         BAHAGIAN 1 — SENARAI PESERTA
    ══════════════════════════════════ -->
    <div class="rr-section">
      <div class="rr-section-title">
        <div style="display:flex;align-items:center;gap:8px">
          <span>👥 Peserta</span>
          <span class="count-chip">${n} pasukan</span>
        </div>
        ${n > 1 ? `
          <div style="font-size:12px;color:var(--muted)">
            ${bilPerlw} perlawanan dijangka
          </div>
        ` : ''}
      </div>

      <!-- Grid peserta semasa -->
      ${peserta.length > 0 ? `
        <div class="rr-peserta-grid" style="margin-bottom:14px">
          ${peserta.map((p, pi) => `
            <div class="rr-peserta-item">
              <span class="rr-peserta-num">${pi + 1}</span>
              <span class="rr-peserta-nama">${p}</span>
              <button class="rr-peserta-del"
                onclick="rrPadamPeserta('${sukanId}', ${pi})"
                title="Keluarkan">×</button>
            </div>
          `).join('')}
        </div>
      ` : `
        <div style="color:var(--muted);font-size:13px;margin-bottom:14px;padding:10px 0">
          Tiada peserta lagi. Tambah pasukan di bawah.
        </div>
      `}

      <!-- Form tambah peserta -->
      ${belumMasuk.length > 0 ? `
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select id="rr-sel-${sukanId}" class="podium-select"
            style="flex:1;min-width:180px;padding:9px 12px;font-size:14px">
            <option value="">-- Pilih pasukan --</option>
            ${belumMasuk.map(p =>
              `<option value="${p}">${p}</option>`
            ).join('')}
          </select>
          <button class="add-btn" onclick="rrTambahPeserta('${sukanId}')">
            + Tambah
          </button>
        </div>
      ` : `
        <div style="font-size:13px;color:var(--muted)">
          Semua pasukan berdaftar sudah jadi peserta.
        </div>
      `}
    </div>


    <!-- ══════════════════════════════════
         BAHAGIAN 2 — JANA JADUAL
    ══════════════════════════════════ -->
    ${n >= 2 ? `
      <div class="rr-section">
        <div class="rr-section-title">
          <span>⚙️ Jana Jadual Perlawanan</span>
          ${adaJadual ? `
            <span class="count-chip" style="color:var(--green)">
              ${selesai}/${perlawanan.length} selesai
              ${live > 0 ? `· <span style="color:var(--red)">🔴 ${live} live</span>` : ''}
            </span>
          ` : ''}
        </div>

        <div class="rr-info-box">
          <strong>${n} peserta</strong> →
          <strong>${bilPerlw} perlawanan</strong> (setiap pasukan lawan semua pasukan lain sekali).
          ${adaJadual ? `
            <br/>⚠️ Jana semula <strong>tidak padam score</strong> yang dah dimasuk.
            Hanya tarikh & masa kosong bagi perlawanan baru.
          ` : `
            <br/>Selepas jana, tetapkan tarikh, masa dan gelanggang untuk setiap perlawanan.
          `}
        </div>

        <button class="rr-jana-btn" onclick="rrJanaJadual('${sukanId}')">
          ⚙️ ${adaJadual ? 'Jana Semula Jadual' : 'Jana Jadual Sekarang'}
        </button>
      </div>
    ` : `
      <div class="rr-info-box">
        ℹ️ Tambah sekurang-kurangnya <strong>2 peserta</strong> untuk jana jadual perlawanan.
      </div>
    `}


    <!-- ══════════════════════════════════
         BAHAGIAN 3 — SENARAI PERLAWANAN
    ══════════════════════════════════ -->
    ${adaJadual ? `
      <div class="rr-section">
        <div class="rr-section-title">
          <span>📋 Senarai Perlawanan</span>
          <span style="font-size:12px;color:var(--muted)">
            Klik ✏️ untuk tetapkan tarikh/masa/score
          </span>
        </div>

        ${perlawanan.map((m, mi) =>
          rrRenderKadEdit(sukanId, m, mi)
        ).join('')}
      </div>
    ` : ''}
  `;
}


/* ================================================================
   KAD PERLAWANAN DALAM TETAPAN (edit/papar)
   ================================================================ */
function rrRenderKadEdit(sukanId, m, mi) {
  const editKey  = sukanId + '___' + mi;
  const isEdit   = state.rrEditingMatch === editKey;

  const statusKls   = m.status === 'selesai'             ? 'selesai'
                    : m.status === 'sedang_berlangsung'   ? 'berlangsung'
                    : 'akan-datang';
  const statusLabel = m.status === 'selesai'             ? '✓ Selesai'
                    : m.status === 'sedang_berlangsung'   ? '🔴 LIVE'
                    : '📅 Akan Datang';

  const rumahMenang = m.status === 'selesai' && m.scoreRumah > m.scoreTamu;
  const tamuMenang  = m.status === 'selesai' && m.scoreTamu  > m.scoreRumah;

  /* ── MOD EDIT ── */
  if (isEdit) {
    return `
      <div class="kad-perlawanan edit-mode" style="margin-bottom:8px">
        <div class="acara-header" style="margin-bottom:14px">
          <div style="font-weight:600;font-size:15px">
            ${m.rumah} <span style="color:var(--muted)">vs</span> ${m.tamu}
          </div>
          <div class="acara-status edit">✏️ Sedang diedit</div>
        </div>

        <!-- Tarikh, Masa, Gelanggang -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
          <div>
            <div class="field-label">📅 Tarikh</div>
            <input type="date" id="rr-e-tarikh-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px"
              value="${m.tarikh || ''}"
            />
          </div>
          <div>
            <div class="field-label">🕐 Masa</div>
            <input type="time" id="rr-e-masa-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px"
              value="${m.masa || ''}"
            />
          </div>
          <div>
            <div class="field-label">📍 Gelanggang</div>
            <input type="text" id="rr-e-gel-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px"
              placeholder="Contoh: Gelanggang A"
              value="${m.gelanggang || ''}"
            />
          </div>
        </div>

        <!-- Status -->
        <div style="margin-bottom:12px">
          <div class="field-label">📊 Status</div>
          <select id="rr-e-status-${mi}" class="podium-select"
            style="padding:9px 12px;font-size:14px;width:100%;max-width:280px"
            onchange="rrTogolScore(this.value, ${mi})">
            <option value="akan_datang"
              ${m.status === 'akan_datang' ? 'selected' : ''}>
              📅 Akan Datang
            </option>
            <option value="sedang_berlangsung"
              ${m.status === 'sedang_berlangsung' ? 'selected' : ''}>
              🔴 Sedang Berlangsung
            </option>
            <option value="selesai"
              ${m.status === 'selesai' ? 'selected' : ''}>
              ✓ Selesai
            </option>
          </select>
        </div>

        <!-- Score (tunjuk bila bukan akan_datang) -->
        <div id="rr-e-score-${mi}"
          style="display:${m.status !== 'akan_datang' ? 'block' : 'none'}">
          <div class="score-edit-box">
            <div class="score-edit-label">⚽ Masukkan Score</div>
            <div class="score-edit-row">
              <div class="score-edit-pasukan" style="font-size:12px">${m.rumah}</div>
              <input type="number" id="rr-e-sr-${mi}" class="score-big-input"
                min="0" value="${m.scoreRumah || 0}" placeholder="0"
              />
              <div class="score-edit-dash">—</div>
              <input type="number" id="rr-e-st-${mi}" class="score-big-input"
                min="0" value="${m.scoreTamu || 0}" placeholder="0"
              />
              <div class="score-edit-pasukan" style="font-size:12px">${m.tamu}</div>
            </div>
          </div>
        </div>

        <div class="btn-group" style="margin-top:12px">
          <button class="cancel-btn" onclick="rrBatalEdit()">Batal</button>
          <button class="save-btn" onclick="rrSimpanPerlawanan('${sukanId}', ${mi})">
            💾 Simpan
          </button>
        </div>
      </div>
    `;
  }

  /* ── MOD PAPAR ── */
  const adaInfo = m.tarikh || m.gelanggang;

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        ${adaInfo ? `
          <span class="perlawanan-info">
            ${m.tarikh ? '📅 ' + formatTarikhPendek(m.tarikh) : ''}
            ${m.masa   ? '🕐 ' + m.masa : ''}
            ${m.gelanggang ? '📍 ' + m.gelanggang : ''}
          </span>
        ` : `
          <span style="font-size:12px;color:var(--muted);font-style:italic">
            Tarikh belum ditetapkan
          </span>
        `}
      </div>

      <div class="perlawanan-body">
        <div class="pasukan-blok ${rumahMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.rumah}</div>
        </div>

        ${m.status !== 'akan_datang' ? `
          <div class="score-paparan">
            <span class="score-num ${rumahMenang ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">
              ${m.scoreRumah || 0}
            </span>
            <span class="score-dash">—</span>
            <span class="score-num ${tamuMenang ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">
              ${m.scoreTamu || 0}
            </span>
          </div>
        ` : `
          <div class="score-vs">VS</div>
        `}

        <div class="pasukan-blok kanan ${tamuMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.tamu}</div>
        </div>
      </div>

      <div class="perlawanan-actions">
        ${m.status === 'sedang_berlangsung' ? `
          <button class="aksi-btn selesai-btn"
            onclick="rrMulaEdit('${sukanId}', ${mi})">
            ✓ Tamat + Score
          </button>
        ` : ''}
        <button class="aksi-btn" onclick="rrMulaEdit('${sukanId}', ${mi})">
          ✏️ ${m.tarikh ? 'Edit' : 'Tetapkan Jadual'}
        </button>
      </div>
    </div>
  `;
}


/* ================================================================
   RENDER JADUAL RR — Tab Jadual (awam lihat)
   ================================================================ */
function renderJadualRoundRobinFormat(sukanId, _unused, isStaff) {
  const rr         = state.roundRobin[sukanId];
  const peserta    = rr?.peserta    || [];
  const perlawanan = rr?.perlawanan || [];

  /* Tiada setup lagi */
  if (peserta.length === 0) {
    return `
      <div class="kosong-box">
        <div style="font-size:36px;margin-bottom:12px">🔄</div>
        <div style="font-weight:600;margin-bottom:6px">Jadual Round Robin belum disediakan</div>
        <div style="font-size:13px;color:var(--muted)">
          ${isStaff
            ? 'Pergi ke <strong>⚙️ Tetapan → Round Robin</strong> untuk tambah peserta dan jana jadual.'
            : 'Jadual akan dipaparkan selepas pentadbir menyediakan senarai peserta.'}
        </div>
      </div>
    `;
  }

  /* ── Jadual Kedudukan ── */
  const kedudukan = rrKiraKedudukan(peserta, perlawanan);
  const jadualKedudukan = `
    <div class="peringkat-blok">
      <div class="peringkat-header" style="color:var(--green)">
        🔄 Kedudukan Round Robin
      </div>
      <div class="jadual-kumpulan-wrap">
        <table class="jadual-kumpulan">
          <thead>
            <tr>
              <th>#</th>
              <th>Pasukan</th>
              <th title="Jumlah perlawanan dimainkan">Main</th>
              <th title="Menang" style="color:var(--green)">Menang</th>
              <th title="Seri">Seri</th>
              <th title="Kalah" style="color:#ff8a80">Kalah</th>
              <th title="Gol Masuk — gol yang dicetak">Gol Masuk</th>
              <th title="Gol Kemasukan — gol yang masuk ke gawang">Gol Kena</th>
              <th title="Beza Gol — Gol Masuk tolak Gol Kemasukan">Beza Gol</th>
              <th>Mata</th>
            </tr>
          </thead>
          <tbody>
            ${kedudukan.map((p, i) => `
              <tr>
                <td>
                  <span class="k-pos ${i === 0 ? 'layak' : ''}">
                    ${i + 1}
                  </span>
                </td>
                <td class="k-nama">
                  ${p.nama}
                  ${i === 0 ? '<span class="layak-chip" style="background:rgba(255,215,0,.12);color:var(--emas);border-color:rgba(255,215,0,.3)">🥇</span>' : ''}
                  ${i === 1 ? '<span class="layak-chip" style="background:rgba(192,200,216,.1);color:var(--perak);border-color:rgba(192,200,216,.3)">🥈</span>' : ''}
                  ${i === 2 ? '<span class="layak-chip" style="background:rgba(205,127,50,.1);color:var(--gangsa);border-color:rgba(205,127,50,.3)">🥉</span>' : ''}
                </td>
                <td>${p.main}</td>
                <td style="color:var(--green)">${p.menang}</td>
                <td>${p.seri}</td>
                <td style="color:#ff8a80">${p.kalah}</td>
                <td>${p.gol}</td>
                <td>${p.masuk}</td>
                <td class="${p.beza > 0 ? 'beza-pos' : p.beza < 0 ? 'beza-neg' : ''}">
                  ${p.beza > 0 ? '+' + p.beza : p.beza}
                </td>
                <td><strong style="color:var(--gold)">${p.pts}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="layak-nota">
          Menang = 3 mata &nbsp;·&nbsp; Seri = 1 mata &nbsp;·&nbsp; Kalah = 0 mata
        </div>
      </div>
    </div>
  `;

  /* ── Perlawanan ── */
  if (perlawanan.length === 0) {
    return jadualKedudukan + `
      <div class="kosong-box" style="margin-top:12px">
        Jadual perlawanan belum dijana. Hubungi staff.
      </div>
    `;
  }

  /* Tab hari */
  const hari   = [...new Set(perlawanan.map(m => m.tarikh).filter(Boolean))].sort();
  const aktif  = hariAktif(sukanId);
  const tabHari = hari.length > 1 ? `
    <div class="hari-tab-wrap">
      <div class="hari-tab-bar">
        ${hari.map(h => {
          const live = perlawanan.some(m => m.tarikh === h && m.status === 'sedang_berlangsung');
          return `
            <button class="hari-tab-btn ${h === aktif ? 'active' : ''}"
              onclick="pilihHari('${h}','${sukanId}')">
              ${formatTarikhPendek(h)}
              ${live ? '<span class="live-dot"></span>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  /* Perlawanan hari aktif atau semua kalau tiada tarikh */
  const adaTarikh = perlawanan.some(m => m.tarikh);
  let senaraiBabar = '';

  if (!adaTarikh) {
    senaraiBabar = `
      <div class="peringkat-blok">
        <div class="peringkat-header">📋 Semua Perlawanan</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px">
          Tarikh & masa belum ditetapkan.
        </div>
        ${perlawanan.map(m => rrRenderKadAwam(m, isStaff, sukanId)).join('')}
      </div>
    `;
  } else {
    const pHari = perlawanan
      .filter(m => m.tarikh === aktif)
      .sort((a, b) => (a.masa || '').localeCompare(b.masa || ''));

    senaraiBabar = tabHari + (pHari.length > 0 ? `
      <div class="peringkat-blok">
        <div class="peringkat-header">📅 ${formatTarikh(aktif)}</div>
        ${pHari.map(m => rrRenderKadAwam(m, isStaff, sukanId)).join('')}
      </div>
    ` : `<div class="kosong-box">Tiada perlawanan pada hari ini.</div>`);
  }

  return jadualKedudukan + senaraiBabar;
}


/* Kad perlawanan untuk paparan awam */
function rrRenderKadAwam(m, isStaff, sukanId) {
  const mi = (state.roundRobin[sukanId]?.perlawanan || []).indexOf(m);

  const statusKls   = m.status === 'selesai'             ? 'selesai'
                    : m.status === 'sedang_berlangsung'   ? 'berlangsung'
                    : 'akan-datang';
  const statusLabel = m.status === 'selesai'             ? '✓ Selesai'
                    : m.status === 'sedang_berlangsung'   ? '🔴 LIVE'
                    : '📅 Akan Datang';

  const rumahMenang = m.status === 'selesai' && m.scoreRumah > m.scoreTamu;
  const tamuMenang  = m.status === 'selesai' && m.scoreTamu  > m.scoreRumah;

  /* Countdown */
  let countdown = '';
  if (m.status === 'akan_datang' && m.tarikh && m.masa) {
    const beza = new Date(m.tarikh + 'T' + m.masa + ':00') - new Date();
    if (beza > 0) {
      const j = Math.floor(beza / 3600000), mn = Math.floor((beza % 3600000) / 60000);
      const h = Math.floor(j / 24), jb = j % 24;
      countdown = `<span class="countdown-chip">⏳ ${h > 0 ? h + 'h ' + jb + 'j' : j > 0 ? j + 'j ' + mn + 'm' : mn + 'm'} lagi</span>`;
    }
  }

  const staffBtns = isStaff && mi >= 0 ? `
    <div class="perlawanan-actions">
      ${m.status === 'sedang_berlangsung' ? `
        <button class="aksi-btn selesai-btn"
          onclick="setTab('tetapan');state.subTab='round_robin';state.rrSukanTab='${sukanId}';state.rrEditingMatch='${sukanId}___${mi}';render()">
          ✓ Tamat + Score
        </button>
      ` : ''}
      <button class="aksi-btn"
        onclick="setTab('tetapan');state.subTab='round_robin';state.rrSukanTab='${sukanId}';state.rrEditingMatch='${sukanId}___${mi}';render()">
        ✏️ Edit
      </button>
    </div>
  ` : '';

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        ${m.masa       ? `<span class="perlawanan-info">🕐 ${m.masa}</span>` : ''}
        ${m.gelanggang ? `<span class="perlawanan-info">📍 ${m.gelanggang}</span>` : ''}
        ${countdown}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${rumahMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.rumah}</div>
        </div>
        ${m.status !== 'akan_datang' ? `
          <div class="score-paparan">
            <span class="score-num ${rumahMenang ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">${m.scoreRumah || 0}</span>
            <span class="score-dash">—</span>
            <span class="score-num ${tamuMenang  ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">${m.scoreTamu  || 0}</span>
          </div>
        ` : `<div class="score-vs">VS</div>`}
        <div class="pasukan-blok kanan ${tamuMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.tamu}</div>
        </div>
      </div>
      ${staffBtns}
    </div>
  `;
}


/* ================================================================
   KIRA KEDUDUKAN
   ================================================================ */
function rrKiraKedudukan(peserta, perlawanan) {
  const stats = {};
  peserta.forEach(p => {
    stats[p] = { main: 0, menang: 0, seri: 0, kalah: 0, gol: 0, masuk: 0, pts: 0 };
  });

  perlawanan
    .filter(m => m.status === 'selesai')
    .forEach(m => {
      if (!stats[m.rumah] || !stats[m.tamu]) return;
      const r = parseInt(m.scoreRumah) || 0;
      const t = parseInt(m.scoreTamu)  || 0;
      stats[m.rumah].main++;  stats[m.tamu].main++;
      stats[m.rumah].gol  += r; stats[m.rumah].masuk += t;
      stats[m.tamu].gol   += t; stats[m.tamu].masuk  += r;
      if (r > t)      { stats[m.rumah].menang++; stats[m.rumah].pts += 3; stats[m.tamu].kalah++; }
      else if (r < t) { stats[m.tamu].menang++;  stats[m.tamu].pts  += 3; stats[m.rumah].kalah++; }
      else            { stats[m.rumah].seri++; stats[m.rumah].pts++; stats[m.tamu].seri++; stats[m.tamu].pts++; }
    });

  return peserta
    .map(p => ({ nama: p, ...stats[p], beza: (stats[p].gol || 0) - (stats[p].masuk || 0) }))
    .sort((a, b) => b.pts - a.pts || b.beza - a.beza || b.gol - a.gol);
}


/* ================================================================
   AUTO STATUS — semak perlawanan RR
   ================================================================ */
function semakAutoStatusRR() {
  const sekarang = new Date();
  let berubah    = false;

  Object.entries(state.roundRobin).forEach(([sukanId, rr]) => {
    if (!rr?.perlawanan) return;
    const durasi = DURASI_SUKAN[sukanId] ?? 60;

    rr.perlawanan.forEach(m => {
      if (m.status === 'selesai' || !m.tarikh || !m.masa) return;
      const masaMula = new Date(m.tarikh + 'T' + m.masa + ':00');
      if (sekarang >= masaMula && m.status === 'akan_datang') {
        m.status = 'sedang_berlangsung';
        berubah  = true;
      }
    });
  });

  if (berubah) { simpanData(); render(); }
}


/* ================================================================
   SEMUA FUNGSI ROUND ROBIN
   ================================================================ */

function rrPilihSukan(sukanId) {
  state.rrSukanTab    = sukanId;
  state.rrEditingMatch = null;
  render();
}

/* Pastikan state.roundRobin[sukanId] wujud */
function rrPastikan(sukanId) {
  if (!state.roundRobin[sukanId]) {
    state.roundRobin[sukanId] = { peserta: [], perlawanan: [] };
  }
  return state.roundRobin[sukanId];
}

/* Tambah peserta */
function rrTambahPeserta(sukanId) {
  const sel     = document.getElementById('rr-sel-' + sukanId);
  const pasukan = sel?.value?.trim();
  if (!pasukan) { alert('Sila pilih pasukan terlebih dahulu.'); return; }

  const rr = rrPastikan(sukanId);
  if (rr.peserta.includes(pasukan)) { alert('Pasukan sudah ada dalam senarai peserta.'); return; }

  rr.peserta.push(pasukan);
  simpanData();
  render();
}

/* Padam peserta */
function rrPadamPeserta(sukanId, pi) {
  const rr   = state.roundRobin[sukanId];
  if (!rr)   return;
  const nama = rr.peserta[pi];
  if (!confirm('Keluarkan "' + nama + '" dari round robin?\n\nPerlawanan melibatkan pasukan ini juga akan dipadam.')) return;

  rr.perlawanan = (rr.perlawanan || []).filter(m => m.rumah !== nama && m.tamu !== nama);
  rr.peserta.splice(pi, 1);
  simpanData();
  render();
}

/* Jana semua perlawanan */
function rrJanaJadual(sukanId) {
  const rr      = rrPastikan(sukanId);
  const peserta = rr.peserta;
  if (peserta.length < 2) { alert('Tambah sekurang-kurangnya 2 peserta dahulu.'); return; }

  /* Kekal score lama */
  const scoreLama = {};
  (rr.perlawanan || []).forEach(m => {
    const key = [m.rumah, m.tamu].sort().join('|||');
    scoreLama[key] = {
      scoreRumah: m.scoreRumah, scoreTamu:  m.scoreTamu,
      status:     m.status,     tarikh:     m.tarikh,
      masa:       m.masa,       gelanggang: m.gelanggang,
    };
  });

  const baru = [];
  for (let i = 0; i < peserta.length; i++) {
    for (let j = i + 1; j < peserta.length; j++) {
      const key  = [peserta[i], peserta[j]].sort().join('|||');
      const lama = scoreLama[key] || {};
      baru.push({
        id:         sukanId + '_rr_' + i + '_' + j + '_' + Date.now(),
        rumah:      peserta[i],
        tamu:       peserta[j],
        tarikh:     lama.tarikh     || '',
        masa:       lama.masa       || '',
        gelanggang: lama.gelanggang || '',
        status:     lama.status     || 'akan_datang',
        scoreRumah: lama.scoreRumah ?? 0,
        scoreTamu:  lama.scoreTamu  ?? 0,
      });
    }
  }

  rr.perlawanan = baru;
  simpanData();
  render();
}

/* Mula edit perlawanan */
function rrMulaEdit(sukanId, mi) {
  state.rrEditingMatch = sukanId + '___' + mi;
  render();
}

/* Batal edit */
function rrBatalEdit() {
  state.rrEditingMatch = null;
  render();
}

/* Togol score section */
function rrTogolScore(status, mi) {
  const el = document.getElementById('rr-e-score-' + mi);
  if (el) el.style.display = status !== 'akan_datang' ? 'block' : 'none';
}

/* Simpan edit perlawanan */
function rrSimpanPerlawanan(sukanId, mi) {
  const rr = state.roundRobin[sukanId];
  if (!rr?.perlawanan?.[mi]) return;

  const m = rr.perlawanan[mi];
  m.tarikh     = document.getElementById('rr-e-tarikh-' + mi)?.value  || '';
  m.masa       = document.getElementById('rr-e-masa-'   + mi)?.value  || '';
  m.gelanggang = document.getElementById('rr-e-gel-'    + mi)?.value?.trim() || '';
  m.status     = document.getElementById('rr-e-status-' + mi)?.value  || 'akan_datang';
  m.scoreRumah = parseInt(document.getElementById('rr-e-sr-' + mi)?.value) || 0;
  m.scoreTamu  = parseInt(document.getElementById('rr-e-st-' + mi)?.value) || 0;

  state.rrEditingMatch = null;
  simpanData();
  render();
}


/* ================================================================
   HELPER — papar format tarikh pendek (diperlukan oleh renderJadualRoundRobinFormat)
   ================================================================ */
function kiraKududukanRRJadual(peserta, senarai) {
  return rrKiraKedudukan(peserta, senarai);
=======
/* ================================================================
   roundrobin.js — URUS JADUAL ROUND ROBIN
   ================================================================

   CARA GUNA:
   1. Tetapan → Format Sukan → pilih "Round Robin" untuk sukan
   2. Klik butang "🔄 Urus Round Robin →" yang muncul
   3. Tambah peserta (pasukan yang akan bertanding)
   4. Klik "Jana Jadual" — semua perlawanan dijana
   5. Tetapkan tarikh, masa, gelanggang tiap perlawanan
   6. Bila perlawanan selesai → masuk score

   DATA: state.roundRobin[sukanId] = {
     peserta:    ["Pasukan A", "Pasukan B", ...],
     perlawanan: [{ id, rumah, tamu, tarikh, masa,
                    gelanggang, status, scoreRumah, scoreTamu }]
   }
   ================================================================ */


/* ================================================================
   RENDER UTAMA — Halaman Urus Round Robin
   ================================================================ */
function renderUrusRoundRobinPage() {

  /* Cari semua sukan yang format round_robin */
  const sukanRR = state.sukan.filter(s =>
    (state.formatSukan[s.id] || FORMAT_ASAL[s.id] || 'biasa') === 'round_robin'
  );

  /* Kalau tiada sukan round robin */
  if (sukanRR.length === 0) {
    return `
      <div class="set-panel-title">🔄 Urus Round Robin</div>
      <div class="rr-kosong-box">
        <div style="font-size:40px;margin-bottom:14px">🔄</div>
        <div style="font-weight:600;font-size:15px;margin-bottom:8px">
          Tiada sukan dengan format Round Robin
        </div>
        <div style="font-size:13px;color:var(--muted);line-height:1.7">
          Pergi ke <strong style="color:var(--text)">⚙️ Tetapan → Format Sukan</strong>
          dan tukar sebarang sukan kepada
          <strong style="color:var(--green)">🔄 Round Robin</strong>.
        </div>
        <button class="rr-jana-btn" style="margin-top:16px"
          onclick="setSubTab('format_sukan')">
          Pergi ke Format Sukan →
        </button>
      </div>
    `;
  }

  /* Tentukan sukan aktif */
  const valid    = sukanRR.find(s => s.id === state.rrSukanTab);
  const tabAktif = valid ? state.rrSukanTab : sukanRR[0].id;
  if (!valid) state.rrSukanTab = tabAktif;

  /* Tab pilih sukan (kalau lebih satu) */
  const tabBar = sukanRR.length > 1 ? `
    <div class="subtab-bar" style="margin-bottom:20px">
      ${sukanRR.map(s => `
        <button class="subtab-btn ${s.id === tabAktif ? 'active' : ''}"
          onclick="rrPilihSukan('${s.id}')">
          ${s.icon || '🏅'} ${s.nama}
        </button>
      `).join('')}
    </div>
  ` : '';

  /* Pastikan data roundRobin ada untuk sukan ini */
  if (!state.roundRobin[tabAktif]) {
    state.roundRobin[tabAktif] = { peserta: [], perlawanan: [] };
  }

  const sukan = state.sukan.find(s => s.id === tabAktif);
  const rr    = state.roundRobin[tabAktif];

  return `
    <div class="set-panel-title">🔄 Urus Round Robin</div>
    <div class="set-panel-desc">
      Tambah peserta, jana jadual dan masukkan keputusan setiap perlawanan.
    </div>
    ${tabBar}
    ${renderRRKandungan(tabAktif, sukan, rr)}
  `;
}


/* ================================================================
   RENDER KANDUNGAN SATU SUKAN ROUND ROBIN
   ================================================================ */
function renderRRKandungan(sukanId, sukan, rr) {
  const peserta    = rr.peserta    || [];
  const perlawanan = rr.perlawanan || [];
  const n          = peserta.length;
  const bilPerlw   = n > 1 ? (n * (n - 1)) / 2 : 0;
  const selesai    = perlawanan.filter(m => m.status === 'selesai').length;
  const live       = perlawanan.filter(m => m.status === 'sedang_berlangsung').length;
  const adaJadual  = perlawanan.length > 0;

  /* Pasukan yang belum jadi peserta */
  const belumMasuk = state.pasukan.filter(p => !peserta.includes(p));

  return `

    <!-- ══════════════════════════════════
         BAHAGIAN 1 — SENARAI PESERTA
    ══════════════════════════════════ -->
    <div class="rr-section">
      <div class="rr-section-title">
        <div style="display:flex;align-items:center;gap:8px">
          <span>👥 Peserta</span>
          <span class="count-chip">${n} pasukan</span>
        </div>
        ${n > 1 ? `
          <div style="font-size:12px;color:var(--muted)">
            ${bilPerlw} perlawanan dijangka
          </div>
        ` : ''}
      </div>

      <!-- Grid peserta semasa -->
      ${peserta.length > 0 ? `
        <div class="rr-peserta-grid" style="margin-bottom:14px">
          ${peserta.map((p, pi) => `
            <div class="rr-peserta-item">
              <span class="rr-peserta-num">${pi + 1}</span>
              <span class="rr-peserta-nama">${p}</span>
              <button class="rr-peserta-del"
                onclick="rrPadamPeserta('${sukanId}', ${pi})"
                title="Keluarkan">×</button>
            </div>
          `).join('')}
        </div>
      ` : `
        <div style="color:var(--muted);font-size:13px;margin-bottom:14px;padding:10px 0">
          Tiada peserta lagi. Tambah pasukan di bawah.
        </div>
      `}

      <!-- Form tambah peserta -->
      ${belumMasuk.length > 0 ? `
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select id="rr-sel-${sukanId}" class="podium-select"
            style="flex:1;min-width:180px;padding:9px 12px;font-size:14px">
            <option value="">-- Pilih pasukan --</option>
            ${belumMasuk.map(p =>
              `<option value="${p}">${p}</option>`
            ).join('')}
          </select>
          <button class="add-btn" onclick="rrTambahPeserta('${sukanId}')">
            + Tambah
          </button>
        </div>
      ` : `
        <div style="font-size:13px;color:var(--muted)">
          Semua pasukan berdaftar sudah jadi peserta.
        </div>
      `}
    </div>


    <!-- ══════════════════════════════════
         BAHAGIAN 2 — JANA JADUAL
    ══════════════════════════════════ -->
    ${n >= 2 ? `
      <div class="rr-section">
        <div class="rr-section-title">
          <span>⚙️ Jana Jadual Perlawanan</span>
          ${adaJadual ? `
            <span class="count-chip" style="color:var(--green)">
              ${selesai}/${perlawanan.length} selesai
              ${live > 0 ? `· <span style="color:var(--red)">🔴 ${live} live</span>` : ''}
            </span>
          ` : ''}
        </div>

        <div class="rr-info-box">
          <strong>${n} peserta</strong> →
          <strong>${bilPerlw} perlawanan</strong> (setiap pasukan lawan semua pasukan lain sekali).
          ${adaJadual ? `
            <br/>⚠️ Jana semula <strong>tidak padam score</strong> yang dah dimasuk.
            Hanya tarikh & masa kosong bagi perlawanan baru.
          ` : `
            <br/>Selepas jana, tetapkan tarikh, masa dan gelanggang untuk setiap perlawanan.
          `}
        </div>

        <button class="rr-jana-btn" onclick="rrJanaJadual('${sukanId}')">
          ⚙️ ${adaJadual ? 'Jana Semula Jadual' : 'Jana Jadual Sekarang'}
        </button>
      </div>
    ` : `
      <div class="rr-info-box">
        ℹ️ Tambah sekurang-kurangnya <strong>2 peserta</strong> untuk jana jadual perlawanan.
      </div>
    `}


    <!-- ══════════════════════════════════
         BAHAGIAN 3 — SENARAI PERLAWANAN
    ══════════════════════════════════ -->
    ${adaJadual ? `
      <div class="rr-section">
        <div class="rr-section-title">
          <span>📋 Senarai Perlawanan</span>
          <span style="font-size:12px;color:var(--muted)">
            Klik ✏️ untuk tetapkan tarikh/masa/score
          </span>
        </div>

        ${perlawanan.map((m, mi) =>
          rrRenderKadEdit(sukanId, m, mi)
        ).join('')}
      </div>
    ` : ''}
  `;
}


/* ================================================================
   KAD PERLAWANAN DALAM TETAPAN (edit/papar)
   ================================================================ */
function rrRenderKadEdit(sukanId, m, mi) {
  const editKey  = sukanId + '___' + mi;
  const isEdit   = state.rrEditingMatch === editKey;

  const statusKls   = m.status === 'selesai'             ? 'selesai'
                    : m.status === 'sedang_berlangsung'   ? 'berlangsung'
                    : 'akan-datang';
  const statusLabel = m.status === 'selesai'             ? '✓ Selesai'
                    : m.status === 'sedang_berlangsung'   ? '🔴 LIVE'
                    : '📅 Akan Datang';

  const rumahMenang = m.status === 'selesai' && m.scoreRumah > m.scoreTamu;
  const tamuMenang  = m.status === 'selesai' && m.scoreTamu  > m.scoreRumah;

  /* ── MOD EDIT ── */
  if (isEdit) {
    return `
      <div class="kad-perlawanan edit-mode" style="margin-bottom:8px">
        <div class="acara-header" style="margin-bottom:14px">
          <div style="font-weight:600;font-size:15px">
            ${m.rumah} <span style="color:var(--muted)">vs</span> ${m.tamu}
          </div>
          <div class="acara-status edit">✏️ Sedang diedit</div>
        </div>

        <!-- Tarikh, Masa, Gelanggang -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
          <div>
            <div class="field-label">📅 Tarikh</div>
            <input type="date" id="rr-e-tarikh-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px"
              value="${m.tarikh || ''}"
            />
          </div>
          <div>
            <div class="field-label">🕐 Masa</div>
            <input type="time" id="rr-e-masa-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px"
              value="${m.masa || ''}"
            />
          </div>
          <div>
            <div class="field-label">📍 Gelanggang</div>
            <input type="text" id="rr-e-gel-${mi}" class="field-input"
              style="padding:8px 10px;font-size:13px"
              placeholder="Contoh: Gelanggang A"
              value="${m.gelanggang || ''}"
            />
          </div>
        </div>

        <!-- Status -->
        <div style="margin-bottom:12px">
          <div class="field-label">📊 Status</div>
          <select id="rr-e-status-${mi}" class="podium-select"
            style="padding:9px 12px;font-size:14px;width:100%;max-width:280px"
            onchange="rrTogolScore(this.value, ${mi})">
            <option value="akan_datang"
              ${m.status === 'akan_datang' ? 'selected' : ''}>
              📅 Akan Datang
            </option>
            <option value="sedang_berlangsung"
              ${m.status === 'sedang_berlangsung' ? 'selected' : ''}>
              🔴 Sedang Berlangsung
            </option>
            <option value="selesai"
              ${m.status === 'selesai' ? 'selected' : ''}>
              ✓ Selesai
            </option>
          </select>
        </div>

        <!-- Score (tunjuk bila bukan akan_datang) -->
        <div id="rr-e-score-${mi}"
          style="display:${m.status !== 'akan_datang' ? 'block' : 'none'}">
          <div class="score-edit-box">
            <div class="score-edit-label">⚽ Masukkan Score</div>
            <div class="score-edit-row">
              <div class="score-edit-pasukan" style="font-size:12px">${m.rumah}</div>
              <input type="number" id="rr-e-sr-${mi}" class="score-big-input"
                min="0" value="${m.scoreRumah || 0}" placeholder="0"
              />
              <div class="score-edit-dash">—</div>
              <input type="number" id="rr-e-st-${mi}" class="score-big-input"
                min="0" value="${m.scoreTamu || 0}" placeholder="0"
              />
              <div class="score-edit-pasukan" style="font-size:12px">${m.tamu}</div>
            </div>
          </div>
        </div>

        <div class="btn-group" style="margin-top:12px">
          <button class="cancel-btn" onclick="rrBatalEdit()">Batal</button>
          <button class="save-btn" onclick="rrSimpanPerlawanan('${sukanId}', ${mi})">
            💾 Simpan
          </button>
        </div>
      </div>
    `;
  }

  /* ── MOD PAPAR ── */
  const adaInfo = m.tarikh || m.gelanggang;

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        ${adaInfo ? `
          <span class="perlawanan-info">
            ${m.tarikh ? '📅 ' + formatTarikhPendek(m.tarikh) : ''}
            ${m.masa   ? '🕐 ' + m.masa : ''}
            ${m.gelanggang ? '📍 ' + m.gelanggang : ''}
          </span>
        ` : `
          <span style="font-size:12px;color:var(--muted);font-style:italic">
            Tarikh belum ditetapkan
          </span>
        `}
      </div>

      <div class="perlawanan-body">
        <div class="pasukan-blok ${rumahMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.rumah}</div>
        </div>

        ${m.status !== 'akan_datang' ? `
          <div class="score-paparan">
            <span class="score-num ${rumahMenang ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">
              ${m.scoreRumah || 0}
            </span>
            <span class="score-dash">—</span>
            <span class="score-num ${tamuMenang ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">
              ${m.scoreTamu || 0}
            </span>
          </div>
        ` : `
          <div class="score-vs">VS</div>
        `}

        <div class="pasukan-blok kanan ${tamuMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.tamu}</div>
        </div>
      </div>

      <div class="perlawanan-actions">
        ${m.status === 'sedang_berlangsung' ? `
          <button class="aksi-btn selesai-btn"
            onclick="rrMulaEdit('${sukanId}', ${mi})">
            ✓ Tamat + Score
          </button>
        ` : ''}
        <button class="aksi-btn" onclick="rrMulaEdit('${sukanId}', ${mi})">
          ✏️ ${m.tarikh ? 'Edit' : 'Tetapkan Jadual'}
        </button>
      </div>
    </div>
  `;
}


/* ================================================================
   RENDER JADUAL RR — Tab Jadual (awam lihat)
   ================================================================ */
function renderJadualRoundRobinFormat(sukanId, _unused, isStaff) {
  const rr         = state.roundRobin[sukanId];
  const peserta    = rr?.peserta    || [];
  const perlawanan = rr?.perlawanan || [];

  /* Tiada setup lagi */
  if (peserta.length === 0) {
    return `
      <div class="kosong-box">
        <div style="font-size:36px;margin-bottom:12px">🔄</div>
        <div style="font-weight:600;margin-bottom:6px">Jadual Round Robin belum disediakan</div>
        <div style="font-size:13px;color:var(--muted)">
          ${isStaff
            ? 'Pergi ke <strong>⚙️ Tetapan → Round Robin</strong> untuk tambah peserta dan jana jadual.'
            : 'Jadual akan dipaparkan selepas pentadbir menyediakan senarai peserta.'}
        </div>
      </div>
    `;
  }

  /* ── Jadual Kedudukan ── */
  const kedudukan = rrKiraKedudukan(peserta, perlawanan);
  const jadualKedudukan = `
    <div class="peringkat-blok">
      <div class="peringkat-header" style="color:var(--green)">
        🔄 Kedudukan Round Robin
      </div>
      <div class="jadual-kumpulan-wrap">
        <table class="jadual-kumpulan">
          <thead>
            <tr>
              <th>#</th>
              <th>Pasukan</th>
              <th title="Jumlah perlawanan dimainkan">Main</th>
              <th title="Menang" style="color:var(--green)">Menang</th>
              <th title="Seri">Seri</th>
              <th title="Kalah" style="color:#ff8a80">Kalah</th>
              <th title="Gol Masuk — gol yang dicetak">Gol Masuk</th>
              <th title="Gol Kemasukan — gol yang masuk ke gawang">Gol Kena</th>
              <th title="Beza Gol — Gol Masuk tolak Gol Kemasukan">Beza Gol</th>
              <th>Mata</th>
            </tr>
          </thead>
          <tbody>
            ${kedudukan.map((p, i) => `
              <tr>
                <td>
                  <span class="k-pos ${i === 0 ? 'layak' : ''}">
                    ${i + 1}
                  </span>
                </td>
                <td class="k-nama">
                  ${p.nama}
                  ${i === 0 ? '<span class="layak-chip" style="background:rgba(255,215,0,.12);color:var(--emas);border-color:rgba(255,215,0,.3)">🥇</span>' : ''}
                  ${i === 1 ? '<span class="layak-chip" style="background:rgba(192,200,216,.1);color:var(--perak);border-color:rgba(192,200,216,.3)">🥈</span>' : ''}
                  ${i === 2 ? '<span class="layak-chip" style="background:rgba(205,127,50,.1);color:var(--gangsa);border-color:rgba(205,127,50,.3)">🥉</span>' : ''}
                </td>
                <td>${p.main}</td>
                <td style="color:var(--green)">${p.menang}</td>
                <td>${p.seri}</td>
                <td style="color:#ff8a80">${p.kalah}</td>
                <td>${p.gol}</td>
                <td>${p.masuk}</td>
                <td class="${p.beza > 0 ? 'beza-pos' : p.beza < 0 ? 'beza-neg' : ''}">
                  ${p.beza > 0 ? '+' + p.beza : p.beza}
                </td>
                <td><strong style="color:var(--gold)">${p.pts}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="layak-nota">
          Menang = 3 mata &nbsp;·&nbsp; Seri = 1 mata &nbsp;·&nbsp; Kalah = 0 mata
        </div>
      </div>
    </div>
  `;

  /* ── Perlawanan ── */
  if (perlawanan.length === 0) {
    return jadualKedudukan + `
      <div class="kosong-box" style="margin-top:12px">
        Jadual perlawanan belum dijana. Hubungi staff.
      </div>
    `;
  }

  /* Tab hari */
  const hari   = [...new Set(perlawanan.map(m => m.tarikh).filter(Boolean))].sort();
  const aktif  = hariAktif(sukanId);
  const tabHari = hari.length > 1 ? `
    <div class="hari-tab-wrap">
      <div class="hari-tab-bar">
        ${hari.map(h => {
          const live = perlawanan.some(m => m.tarikh === h && m.status === 'sedang_berlangsung');
          return `
            <button class="hari-tab-btn ${h === aktif ? 'active' : ''}"
              onclick="pilihHari('${h}','${sukanId}')">
              ${formatTarikhPendek(h)}
              ${live ? '<span class="live-dot"></span>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  /* Perlawanan hari aktif atau semua kalau tiada tarikh */
  const adaTarikh = perlawanan.some(m => m.tarikh);
  let senaraiBabar = '';

  if (!adaTarikh) {
    senaraiBabar = `
      <div class="peringkat-blok">
        <div class="peringkat-header">📋 Semua Perlawanan</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px">
          Tarikh & masa belum ditetapkan.
        </div>
        ${perlawanan.map(m => rrRenderKadAwam(m, isStaff, sukanId)).join('')}
      </div>
    `;
  } else {
    const pHari = perlawanan
      .filter(m => m.tarikh === aktif)
      .sort((a, b) => (a.masa || '').localeCompare(b.masa || ''));

    senaraiBabar = tabHari + (pHari.length > 0 ? `
      <div class="peringkat-blok">
        <div class="peringkat-header">📅 ${formatTarikh(aktif)}</div>
        ${pHari.map(m => rrRenderKadAwam(m, isStaff, sukanId)).join('')}
      </div>
    ` : `<div class="kosong-box">Tiada perlawanan pada hari ini.</div>`);
  }

  return jadualKedudukan + senaraiBabar;
}


/* Kad perlawanan untuk paparan awam */
function rrRenderKadAwam(m, isStaff, sukanId) {
  const mi = (state.roundRobin[sukanId]?.perlawanan || []).indexOf(m);

  const statusKls   = m.status === 'selesai'             ? 'selesai'
                    : m.status === 'sedang_berlangsung'   ? 'berlangsung'
                    : 'akan-datang';
  const statusLabel = m.status === 'selesai'             ? '✓ Selesai'
                    : m.status === 'sedang_berlangsung'   ? '🔴 LIVE'
                    : '📅 Akan Datang';

  const rumahMenang = m.status === 'selesai' && m.scoreRumah > m.scoreTamu;
  const tamuMenang  = m.status === 'selesai' && m.scoreTamu  > m.scoreRumah;

  /* Countdown */
  let countdown = '';
  if (m.status === 'akan_datang' && m.tarikh && m.masa) {
    const beza = new Date(m.tarikh + 'T' + m.masa + ':00') - new Date();
    if (beza > 0) {
      const j = Math.floor(beza / 3600000), mn = Math.floor((beza % 3600000) / 60000);
      const h = Math.floor(j / 24), jb = j % 24;
      countdown = `<span class="countdown-chip">⏳ ${h > 0 ? h + 'h ' + jb + 'j' : j > 0 ? j + 'j ' + mn + 'm' : mn + 'm'} lagi</span>`;
    }
  }

  const staffBtns = isStaff && mi >= 0 ? `
    <div class="perlawanan-actions">
      ${m.status === 'sedang_berlangsung' ? `
        <button class="aksi-btn selesai-btn"
          onclick="setTab('tetapan');state.subTab='round_robin';state.rrSukanTab='${sukanId}';state.rrEditingMatch='${sukanId}___${mi}';render()">
          ✓ Tamat + Score
        </button>
      ` : ''}
      <button class="aksi-btn"
        onclick="setTab('tetapan');state.subTab='round_robin';state.rrSukanTab='${sukanId}';state.rrEditingMatch='${sukanId}___${mi}';render()">
        ✏️ Edit
      </button>
    </div>
  ` : '';

  return `
    <div class="kad-perlawanan ${statusKls}" style="margin-bottom:8px">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        ${m.masa       ? `<span class="perlawanan-info">🕐 ${m.masa}</span>` : ''}
        ${m.gelanggang ? `<span class="perlawanan-info">📍 ${m.gelanggang}</span>` : ''}
        ${countdown}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${rumahMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.rumah}</div>
        </div>
        ${m.status !== 'akan_datang' ? `
          <div class="score-paparan">
            <span class="score-num ${rumahMenang ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">${m.scoreRumah || 0}</span>
            <span class="score-dash">—</span>
            <span class="score-num ${tamuMenang  ? 'menang' : m.status === 'selesai' && m.scoreRumah !== m.scoreTamu ? 'kalah' : ''}">${m.scoreTamu  || 0}</span>
          </div>
        ` : `<div class="score-vs">VS</div>`}
        <div class="pasukan-blok kanan ${tamuMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${m.tamu}</div>
        </div>
      </div>
      ${staffBtns}
    </div>
  `;
}


/* ================================================================
   KIRA KEDUDUKAN
   ================================================================ */
function rrKiraKedudukan(peserta, perlawanan) {
  const stats = {};
  peserta.forEach(p => {
    stats[p] = { main: 0, menang: 0, seri: 0, kalah: 0, gol: 0, masuk: 0, pts: 0 };
  });

  perlawanan
    .filter(m => m.status === 'selesai')
    .forEach(m => {
      if (!stats[m.rumah] || !stats[m.tamu]) return;
      const r = parseInt(m.scoreRumah) || 0;
      const t = parseInt(m.scoreTamu)  || 0;
      stats[m.rumah].main++;  stats[m.tamu].main++;
      stats[m.rumah].gol  += r; stats[m.rumah].masuk += t;
      stats[m.tamu].gol   += t; stats[m.tamu].masuk  += r;
      if (r > t)      { stats[m.rumah].menang++; stats[m.rumah].pts += 3; stats[m.tamu].kalah++; }
      else if (r < t) { stats[m.tamu].menang++;  stats[m.tamu].pts  += 3; stats[m.rumah].kalah++; }
      else            { stats[m.rumah].seri++; stats[m.rumah].pts++; stats[m.tamu].seri++; stats[m.tamu].pts++; }
    });

  return peserta
    .map(p => ({ nama: p, ...stats[p], beza: (stats[p].gol || 0) - (stats[p].masuk || 0) }))
    .sort((a, b) => b.pts - a.pts || b.beza - a.beza || b.gol - a.gol);
}


/* ================================================================
   AUTO STATUS — semak perlawanan RR
   ================================================================ */
function semakAutoStatusRR() {
  const sekarang = new Date();
  let berubah    = false;

  Object.entries(state.roundRobin).forEach(([sukanId, rr]) => {
    if (!rr?.perlawanan) return;
    const durasi = DURASI_SUKAN[sukanId] ?? 60;

    rr.perlawanan.forEach(m => {
      if (m.status === 'selesai' || !m.tarikh || !m.masa) return;
      const masaMula = new Date(m.tarikh + 'T' + m.masa + ':00');
      if (sekarang >= masaMula && m.status === 'akan_datang') {
        m.status = 'sedang_berlangsung';
        berubah  = true;
      }
    });
  });

  if (berubah) { simpanData(); render(); }
}


/* ================================================================
   SEMUA FUNGSI ROUND ROBIN
   ================================================================ */

function rrPilihSukan(sukanId) {
  state.rrSukanTab    = sukanId;
  state.rrEditingMatch = null;
  render();
}

/* Pastikan state.roundRobin[sukanId] wujud */
function rrPastikan(sukanId) {
  if (!state.roundRobin[sukanId]) {
    state.roundRobin[sukanId] = { peserta: [], perlawanan: [] };
  }
  return state.roundRobin[sukanId];
}

/* Tambah peserta */
function rrTambahPeserta(sukanId) {
  const sel     = document.getElementById('rr-sel-' + sukanId);
  const pasukan = sel?.value?.trim();
  if (!pasukan) { alert('Sila pilih pasukan terlebih dahulu.'); return; }

  const rr = rrPastikan(sukanId);
  if (rr.peserta.includes(pasukan)) { alert('Pasukan sudah ada dalam senarai peserta.'); return; }

  rr.peserta.push(pasukan);
  simpanData();
  render();
}

/* Padam peserta */
function rrPadamPeserta(sukanId, pi) {
  const rr   = state.roundRobin[sukanId];
  if (!rr)   return;
  const nama = rr.peserta[pi];
  if (!confirm('Keluarkan "' + nama + '" dari round robin?\n\nPerlawanan melibatkan pasukan ini juga akan dipadam.')) return;

  rr.perlawanan = (rr.perlawanan || []).filter(m => m.rumah !== nama && m.tamu !== nama);
  rr.peserta.splice(pi, 1);
  simpanData();
  render();
}

/* Jana semua perlawanan */
function rrJanaJadual(sukanId) {
  const rr      = rrPastikan(sukanId);
  const peserta = rr.peserta;
  if (peserta.length < 2) { alert('Tambah sekurang-kurangnya 2 peserta dahulu.'); return; }

  /* Kekal score lama */
  const scoreLama = {};
  (rr.perlawanan || []).forEach(m => {
    const key = [m.rumah, m.tamu].sort().join('|||');
    scoreLama[key] = {
      scoreRumah: m.scoreRumah, scoreTamu:  m.scoreTamu,
      status:     m.status,     tarikh:     m.tarikh,
      masa:       m.masa,       gelanggang: m.gelanggang,
    };
  });

  const baru = [];
  for (let i = 0; i < peserta.length; i++) {
    for (let j = i + 1; j < peserta.length; j++) {
      const key  = [peserta[i], peserta[j]].sort().join('|||');
      const lama = scoreLama[key] || {};
      baru.push({
        id:         sukanId + '_rr_' + i + '_' + j + '_' + Date.now(),
        rumah:      peserta[i],
        tamu:       peserta[j],
        tarikh:     lama.tarikh     || '',
        masa:       lama.masa       || '',
        gelanggang: lama.gelanggang || '',
        status:     lama.status     || 'akan_datang',
        scoreRumah: lama.scoreRumah ?? 0,
        scoreTamu:  lama.scoreTamu  ?? 0,
      });
    }
  }

  rr.perlawanan = baru;
  simpanData();
  render();
}

/* Mula edit perlawanan */
function rrMulaEdit(sukanId, mi) {
  state.rrEditingMatch = sukanId + '___' + mi;
  render();
}

/* Batal edit */
function rrBatalEdit() {
  state.rrEditingMatch = null;
  render();
}

/* Togol score section */
function rrTogolScore(status, mi) {
  const el = document.getElementById('rr-e-score-' + mi);
  if (el) el.style.display = status !== 'akan_datang' ? 'block' : 'none';
}

/* Simpan edit perlawanan */
function rrSimpanPerlawanan(sukanId, mi) {
  const rr = state.roundRobin[sukanId];
  if (!rr?.perlawanan?.[mi]) return;

  const m = rr.perlawanan[mi];
  m.tarikh     = document.getElementById('rr-e-tarikh-' + mi)?.value  || '';
  m.masa       = document.getElementById('rr-e-masa-'   + mi)?.value  || '';
  m.gelanggang = document.getElementById('rr-e-gel-'    + mi)?.value?.trim() || '';
  m.status     = document.getElementById('rr-e-status-' + mi)?.value  || 'akan_datang';
  m.scoreRumah = parseInt(document.getElementById('rr-e-sr-' + mi)?.value) || 0;
  m.scoreTamu  = parseInt(document.getElementById('rr-e-st-' + mi)?.value) || 0;

  state.rrEditingMatch = null;
  simpanData();
  render();
}


/* ================================================================
   HELPER — papar format tarikh pendek (diperlukan oleh renderJadualRoundRobinFormat)
   ================================================================ */
function kiraKududukanRRJadual(peserta, senarai) {
  return rrKiraKedudukan(peserta, senarai);
>>>>>>> bf49cbd (feat: add tetapan.js for settings management with sub-tabs for account management, staff addition, team management, and sports & events)
}