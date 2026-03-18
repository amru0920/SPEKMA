/* ================================================================
   format.js — URUS FORMAT SUKAN & KUMPULAN
   ================================================================

   FAIL INI mengandungi:
   ✏️  Tetapkan format setiap sukan (Format Sukan)
   ✏️  Urus kumpulan → Peringkat Kumpulan
   ✏️  Urus peserta → Round Robin
   ✏️  Urus peserta → Knockout / Biasa
   ================================================================ */


const FORMAT_ASAL = {
  s1: 'individu',
  s2: 'biasa',
  s3: 'kumpulan',
  s4: 'kumpulan',
  s5: 'biasa',
  s6: 'individu',
};

const LABEL_FORMAT = {
  individu:    { label: 'Individu',           icon: '🏃', desc: 'Tiada jadual perlawanan.' },
  biasa:       { label: 'Knockout / Biasa',   icon: '🎯', desc: 'Perlawanan terus, satu kalah keluar.' },
  kumpulan:    { label: 'Peringkat Kumpulan', icon: '🔵', desc: 'Fasa kumpulan → knockout. Tempat 1 & 2 layak maju.' },
  round_robin: { label: 'Round Robin',        icon: '🔄', desc: 'Semua pasukan lawan semua, markah dikumpul.' },
};

const KUMPULAN_ASAL = {
  s3: [
    { id:'A', nama:'Kumpulan A', pasukan:["MRSM Kepala Batas","MRSM Balik Pulau","IKBN Darul Aman"] },
    { id:'B', nama:'Kumpulan B', pasukan:["MRSM Kubang Pasu","IKM Alor Setar","ADTEC Kedah"] },
  ],
  s4: [
    { id:'A', nama:'Kumpulan A', pasukan:["MRSM Kepala Batas","MRSM Kubang Pasu","ADTEC Kedah"] },
    { id:'B', nama:'Kumpulan B', pasukan:["MRSM Balik Pulau","IKM Alor Setar","MRSM Taiping"] },
  ],
};


/* ================================================================
   SUB-TAB: FORMAT SUKAN
   ================================================================ */
function renderFormatSukan() {
  return `
    <div class="set-panel-title">🗂️ Format Sukan</div>
    <div class="set-panel-desc">
      Tetapkan format pertandingan untuk setiap sukan.
    </div>

    <div class="format-legenda">
      ${Object.entries(LABEL_FORMAT).map(([k,v]) => `
        <div class="format-legenda-item">
          <span class="format-icon-sm">${v.icon}</span>
          <div>
            <div class="format-nama-sm">${v.label}</div>
            <div class="format-desc-sm">${v.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="set-card-label" style="margin:16px 0 10px">Format Semasa</div>
    <div style="display:grid;gap:8px">
      ${state.sukan.map(s => {
        const fmt     = state.formatSukan[s.id] || 'biasa';
        const fmtInfo = LABEL_FORMAT[fmt];

        /* Butang urus ikut format */
        let urusBtn = '';
        if (fmt === 'kumpulan') {
          urusBtn = `
            <button class="urus-fmt-btn kumpulan"
              onclick="setSubTab('urus_kumpulan');state.kumpulanSukanTab='${s.id}';render()">
              🔵 Urus Kumpulan →
            </button>
          `;
        } else if (fmt === 'round_robin') {
          urusBtn = `
            <button class="urus-fmt-btn round-robin"
              onclick="setSubTab('round_robin');state.rrSukanTab='${s.id}';render()">
              🔄 Urus Round Robin →
            </button>
          `;
        }

        return `
          <div class="format-sukan-row ${fmt !== 'individu' && fmt !== 'biasa' ? 'has-urus' : ''}">
            <div class="format-sukan-kiri">
              <span class="format-sukan-icon">${s.icon||'🏅'}</span>
              <div>
                <div class="format-sukan-nama">${s.nama}</div>
                <div class="format-sukan-fmt-label">${fmtInfo.icon} ${fmtInfo.label}</div>
              </div>
            </div>
            <div class="format-sukan-kanan" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <select class="format-select" onchange="tukarFormatSukan('${s.id}',this.value)">
                ${Object.entries(LABEL_FORMAT).map(([k,v]) =>
                  `<option value="${k}" ${fmt===k?'selected':''}>${v.icon} ${v.label}</option>`
                ).join('')}
              </select>
              ${urusBtn}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}


/* ================================================================
   SUB-TAB: URUS KUMPULAN & PESERTA
   Paparan berbeza ikut format sukan
   ================================================================ */
function renderUrusKumpulan() {
  /* Sukan yang ada pengurusan kumpulan/peserta (bukan individu) */
  const sukanUrus = state.sukan.filter(s =>
    (state.formatSukan[s.id] || FORMAT_ASAL[s.id] || 'biasa') !== 'individu'
  );

  if (sukanUrus.length === 0) {
    return `
      <div class="set-panel-title">🔵 Urus Kumpulan &amp; Peserta</div>
      <div class="kosong-box" style="margin-top:16px">
        <div style="font-size:32px;margin-bottom:10px">🏅</div>
        Semua sukan ditetapkan sebagai Individu.<br/>
        <span style="font-size:13px;margin-top:6px;display:block">
          Pergi ke <strong>Format Sukan</strong> dan tukar format kepada Kumpulan, Round Robin atau Knockout.
        </span>
      </div>
    `;
  }

  /* Tab pilih sukan */
  const tabAktif = (state.kumpulanSukanTab && sukanUrus.find(s => s.id === state.kumpulanSukanTab))
    ? state.kumpulanSukanTab : sukanUrus[0]?.id;

  const sukanKini = state.sukan.find(s => s.id === tabAktif);
  const fmt       = state.formatSukan[tabAktif] || FORMAT_ASAL[tabAktif] || 'biasa';

  const tabBar = sukanUrus.length > 1 ? `
    <div class="subtab-bar" style="margin-bottom:20px">
      ${sukanUrus.map(s => {
        const f = state.formatSukan[s.id] || 'biasa';
        return `
          <button class="subtab-btn ${s.id === tabAktif ? 'active' : ''}"
            onclick="pilihKumpulanSukanTab('${s.id}')">
            ${s.icon||'🏅'} ${s.nama}
            <span style="font-size:10px;margin-left:4px;opacity:0.7">
              ${LABEL_FORMAT[f]?.icon||''}
            </span>
          </button>
        `;
      }).join('')}
    </div>
  ` : '';

  /* Render ikut format */
  let kandungan = '';
  if (fmt === 'kumpulan')         kandungan = renderUrusKumpulanFasa(tabAktif, sukanKini);
  else if (fmt === 'round_robin') kandungan = renderUrusRoundRobin(tabAktif, sukanKini);
  else                            kandungan = renderUrusKnockout(tabAktif, sukanKini);

  return `
    <div class="set-panel-title">🔵 Urus Kumpulan &amp; Peserta</div>
    <div class="set-panel-desc">Urus peserta dan kumpulan untuk setiap sukan.</div>
    ${tabBar}
    ${kandungan}
  `;
}


/* ================================================================
   URUS: PERINGKAT KUMPULAN
   ================================================================ */
function renderUrusKumpulanFasa(sukanId, sukanKini) {
  const kumpulan = state.kumpulanSukan[sukanId] || [];

  return `
    <div class="fmt-header">
      <div>
        <div class="fmt-nama">${sukanKini?.icon||'🏅'} ${sukanKini?.nama}</div>
        <div class="fmt-badge kumpulan">🔵 Peringkat Kumpulan</div>
      </div>
      <button class="add-btn" style="font-size:12px;padding:7px 14px"
        onclick="tambahKumpulan('${sukanId}')">+ Kumpulan Baru</button>
    </div>

    <div class="fmt-info-box">
      Pasukan tempat <strong>1 dan 2</strong> dalam setiap kumpulan layak ke peringkat seterusnya.
    </div>

    ${kumpulan.length === 0 ? `
      <div class="kosong-box" style="padding:28px 20px">
        <div style="font-size:28px;margin-bottom:8px">🔵</div>
        Tiada kumpulan. Klik "+ Kumpulan Baru" di atas.
      </div>
    ` : kumpulan.map((k, ki) => `
      <div class="kumpulan-panel-edit">
        <div class="kumpulan-panel-header">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span class="kumpulan-badge">${k.id}</span>
            <input type="text" class="kumpulan-nama-input"
              value="${k.nama}"
              onchange="ubahNamaKumpulan('${sukanId}', ${ki}, this.value)"/>
            <span class="count-chip">${k.pasukan.length} pasukan</span>
          </div>
          <button class="staff-del" onclick="padamKumpulan('${sukanId}', ${ki})">Padam</button>
        </div>

        <div class="tag-list" style="margin:8px 0 12px">
          ${k.pasukan.length === 0
            ? `<span style="color:var(--muted);font-size:13px">Tiada pasukan. Tambah di bawah.</span>`
            : k.pasukan.map((p, pi) => `
                <div class="tag">
                  ${p}
                  <span class="tag-del" onclick="padamPasukanKumpulan('${sukanId}', ${ki}, ${pi})">×</span>
                </div>
              `).join('')
          }
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select id="sel-pasukan-${sukanId}-${ki}" class="podium-select"
            style="flex:1;min-width:160px;padding:8px 10px;font-size:13px">
            <option value="">-- Pilih pasukan --</option>
            ${state.pasukan.filter(p => !k.pasukan.includes(p))
              .map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
          <button class="add-btn" style="font-size:12px;padding:7px 14px"
            onclick="tambahPasukanKumpulan('${sukanId}', ${ki})">+ Tambah</button>
        </div>
      </div>
    `).join('')}
  `;
}


/* ================================================================
   URUS: ROUND ROBIN
   ================================================================ */
function renderUrusRoundRobin(sukanId, sukanKini) {
  /* Peserta disimpan dalam kumpulanSukan[sukanId][0] */
  if (!state.kumpulanSukan[sukanId])    state.kumpulanSukan[sukanId] = [];
  if (!state.kumpulanSukan[sukanId][0]) {
    state.kumpulanSukan[sukanId][0] = { id:'RR', nama:'Peserta', pasukan:[] };
  }
  const kRR = state.kumpulanSukan[sukanId][0];
  const n   = kRR.pasukan.length;
  const bilPerlawanan = n > 1 ? (n * (n-1)) / 2 : 0;

  /* Jana pasangan perlawanan */
  const pasangan = [];
  for (let i = 0; i < kRR.pasukan.length; i++)
    for (let j = i+1; j < kRR.pasukan.length; j++)
      pasangan.push([kRR.pasukan[i], kRR.pasukan[j]]);

  return `
    <div class="fmt-header">
      <div>
        <div class="fmt-nama">${sukanKini?.icon||'🏅'} ${sukanKini?.nama}</div>
        <div class="fmt-badge round_robin">🔄 Round Robin</div>
      </div>
    </div>

    <div class="fmt-info-box">
      Setiap pasukan lawan <strong>semua pasukan lain</strong> sekali.
      ${n > 1
        ? `Dengan <strong>${n} pasukan</strong> → <strong>${bilPerlawanan} perlawanan</strong>.`
        : 'Tambah sekurang-kurangnya 2 pasukan.'}
    </div>

    <!-- Senarai peserta -->
    <div class="kumpulan-panel-edit">
      <div class="kumpulan-panel-header" style="margin-bottom:12px">
        <span style="font-weight:600;font-size:15px">
          Peserta Round Robin
          <span class="count-chip" style="margin-left:8px">${n} pasukan</span>
        </span>
      </div>

      <div class="tag-list" style="margin-bottom:14px">
        ${kRR.pasukan.length === 0
          ? `<span style="color:var(--muted);font-size:13px">Tiada peserta. Tambah di bawah.</span>`
          : kRR.pasukan.map((p, pi) => `
              <div class="tag">
                <span class="pasukan-num" style="width:18px;height:18px;font-size:10px;flex-shrink:0">${pi+1}</span>
                ${p}
                <span class="tag-del" onclick="padamPasukanRR('${sukanId}', ${pi})">×</span>
              </div>
            `).join('')
        }
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <select id="sel-rr-${sukanId}" class="podium-select"
          style="flex:1;min-width:160px;padding:8px 10px;font-size:13px">
          <option value="">-- Pilih pasukan --</option>
          ${state.pasukan.filter(p => !kRR.pasukan.includes(p))
            .map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
        <button class="add-btn" style="font-size:12px;padding:7px 14px"
          onclick="tambahPasukanRR('${sukanId}')">+ Tambah</button>
      </div>
    </div>

    <!-- Jadual semua perlawanan yang perlu dimainkan -->
    ${bilPerlawanan > 0 ? `
      <div class="set-card-label" style="margin:16px 0 10px">
        Semua Perlawanan Yang Perlu Dimainkan
        <span class="count-chip" style="margin-left:8px">${bilPerlawanan} perlawanan</span>
      </div>
      <div style="display:grid;gap:4px">
        ${pasangan.map(([a, b], i) => `
          <div class="rr-perlawanan-row">
            <span class="rr-num">${i+1}</span>
            <span class="rr-pasukan">${a}</span>
            <span class="rr-vs">vs</span>
            <span class="rr-pasukan">${b}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}


/* ================================================================
   URUS: KNOCKOUT / BIASA
   ================================================================ */
function renderUrusKnockout(sukanId, sukanKini) {
  if (!state.kumpulanSukan[sukanId])    state.kumpulanSukan[sukanId] = [];
  if (!state.kumpulanSukan[sukanId][0]) {
    state.kumpulanSukan[sukanId][0] = { id:'KO', nama:'Peserta', pasukan:[] };
  }
  const kKO = state.kumpulanSukan[sukanId][0];
  const n   = kKO.pasukan.length;

  /* Kira pusingan */
  const pusingan = [];
  let bil = n, ke = 1;
  while (bil > 1) {
    pusingan.push({ ke, bil: Math.floor(bil/2) });
    bil = Math.ceil(bil/2); ke++;
  }
  const labelPusingan = (k, total) => {
    const balik = total - k;
    if (balik === 0) return '🏆 Final';
    if (balik === 1) return '🥈 Separuh Akhir';
    if (balik === 2) return '🥉 Suku Akhir';
    return 'Pusingan ' + k;
  };

  return `
    <div class="fmt-header">
      <div>
        <div class="fmt-nama">${sukanKini?.icon||'🏅'} ${sukanKini?.nama}</div>
        <div class="fmt-badge biasa">🎯 Knockout</div>
      </div>
    </div>

    <div class="fmt-info-box">
      Satu kalah terus keluar.
      ${n > 1
        ? `Dengan <strong>${n} peserta</strong> → <strong>${pusingan.length} pusingan</strong> sehingga final.`
        : 'Tambah sekurang-kurangnya 2 peserta.'}
    </div>

    <!-- Senarai peserta -->
    <div class="kumpulan-panel-edit">
      <div class="kumpulan-panel-header" style="margin-bottom:12px">
        <span style="font-weight:600;font-size:15px">
          Peserta Knockout
          <span class="count-chip" style="margin-left:8px">${n} pasukan</span>
        </span>
      </div>

      <div class="tag-list" style="margin-bottom:14px">
        ${kKO.pasukan.length === 0
          ? `<span style="color:var(--muted);font-size:13px">Tiada peserta. Tambah di bawah.</span>`
          : kKO.pasukan.map((p, pi) => `
              <div class="tag">
                <span class="pasukan-num" style="width:18px;height:18px;font-size:10px;flex-shrink:0">${pi+1}</span>
                ${p}
                <span class="tag-del" onclick="padamPasukanKO('${sukanId}', ${pi})">×</span>
              </div>
            `).join('')
        }
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <select id="sel-ko-${sukanId}" class="podium-select"
          style="flex:1;min-width:160px;padding:8px 10px;font-size:13px">
          <option value="">-- Pilih pasukan --</option>
          ${state.pasukan.filter(p => !kKO.pasukan.includes(p))
            .map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
        <button class="add-btn" style="font-size:12px;padding:7px 14px"
          onclick="tambahPasukanKO('${sukanId}')">+ Tambah</button>
      </div>
    </div>

    <!-- Bracket structure -->
    ${pusingan.length > 0 ? `
      <div class="set-card-label" style="margin:16px 0 10px">Struktur Bracket</div>
      <div class="bracket-wrap">
        ${pusingan.map(ps => `
          <div class="bracket-pusingan">
            <div class="bracket-label">${labelPusingan(ps.ke, pusingan.length)}</div>
            ${Array.from({length: ps.bil}).map((_, i) => `
              <div class="bracket-match">
                <div class="bracket-slot">${ps.ke===1 ? kKO.pasukan[i*2]||'Peserta '+(i*2+1) : '?'}</div>
                <div class="bracket-vs">vs</div>
                <div class="bracket-slot">${ps.ke===1 ? kKO.pasukan[i*2+1]||'Peserta '+(i*2+2) : '?'}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}


/* ================================================================
   SEMUA FUNGSI FORMAT
   ================================================================ */
function tukarFormatSukan(sukanId, format) {
  state.formatSukan[sukanId] = format;
  simpanData();
  render();
}

function pilihKumpulanSukanTab(sukanId) {
  state.kumpulanSukanTab = sukanId;
  render();
}

/* ── Kumpulan ── */
function tambahKumpulan(sukanId) {
  if (!state.kumpulanSukan[sukanId]) state.kumpulanSukan[sukanId] = [];
  const senarai = state.kumpulanSukan[sukanId];
  const huruf   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const newId   = huruf[senarai.length] || String(senarai.length+1);
  senarai.push({ id: newId, nama: 'Kumpulan ' + newId, pasukan: [] });
  simpanData(); render();
}

function padamKumpulan(sukanId, ki) {
  const k = state.kumpulanSukan[sukanId]?.[ki];
  if (!confirm('Padam "' + (k?.nama||'kumpulan ini') + '"?')) return;
  state.kumpulanSukan[sukanId].splice(ki, 1);
  simpanData(); render();
}

function ubahNamaKumpulan(sukanId, ki, nama) {
  if (!nama?.trim()) return;
  if (state.kumpulanSukan[sukanId]?.[ki]) {
    state.kumpulanSukan[sukanId][ki].nama = nama.trim();
    simpanData();
  }
}

function tambahPasukanKumpulan(sukanId, ki) {
  const sel     = document.getElementById('sel-pasukan-' + sukanId + '-' + ki);
  const pasukan = sel?.value?.trim();
  if (!pasukan) { alert('Sila pilih pasukan.'); return; }
  const k = state.kumpulanSukan[sukanId]?.[ki];
  if (!k) return;
  if (k.pasukan.includes(pasukan)) { alert('Pasukan sudah ada dalam kumpulan ini.'); return; }
  /* Semak kumpulan lain */
  const lain = state.kumpulanSukan[sukanId] || [];
  for (let i = 0; i < lain.length; i++) {
    if (i !== ki && lain[i].pasukan.includes(pasukan)) {
      if (!confirm('"' + pasukan + '" sudah dalam ' + lain[i].nama + '. Alih ke sini?')) return;
      lain[i].pasukan = lain[i].pasukan.filter(p => p !== pasukan);
      break;
    }
  }
  k.pasukan.push(pasukan);
  simpanData(); render();
}

function padamPasukanKumpulan(sukanId, ki, pi) {
  const k = state.kumpulanSukan[sukanId]?.[ki];
  if (!k) return;
  if (!confirm('Keluarkan "' + k.pasukan[pi] + '" dari kumpulan?')) return;
  k.pasukan.splice(pi, 1);
  simpanData(); render();
}

/* ── Round Robin ── */
function tambahPasukanRR(sukanId) {
  const sel     = document.getElementById('sel-rr-' + sukanId);
  const pasukan = sel?.value?.trim();
  if (!pasukan) { alert('Sila pilih pasukan.'); return; }
  if (!state.kumpulanSukan[sukanId])    state.kumpulanSukan[sukanId] = [];
  if (!state.kumpulanSukan[sukanId][0]) state.kumpulanSukan[sukanId][0] = { id:'RR', nama:'Peserta', pasukan:[] };
  const kRR = state.kumpulanSukan[sukanId][0];
  if (kRR.pasukan.includes(pasukan)) { alert('Pasukan sudah ada.'); return; }
  kRR.pasukan.push(pasukan);
  simpanData(); render();
}

function padamPasukanRR(sukanId, pi) {
  const kRR = state.kumpulanSukan[sukanId]?.[0];
  if (!kRR) return;
  if (!confirm('Keluarkan "' + kRR.pasukan[pi] + '"?')) return;
  kRR.pasukan.splice(pi, 1);
  simpanData(); render();
}

/* ── Knockout ── */
function tambahPasukanKO(sukanId) {
  const sel     = document.getElementById('sel-ko-' + sukanId);
  const pasukan = sel?.value?.trim();
  if (!pasukan) { alert('Sila pilih pasukan.'); return; }
  if (!state.kumpulanSukan[sukanId])    state.kumpulanSukan[sukanId] = [];
  if (!state.kumpulanSukan[sukanId][0]) state.kumpulanSukan[sukanId][0] = { id:'KO', nama:'Peserta', pasukan:[] };
  const kKO = state.kumpulanSukan[sukanId][0];
  if (kKO.pasukan.includes(pasukan)) { alert('Pasukan sudah ada.'); return; }
  kKO.pasukan.push(pasukan);
  simpanData(); render();
}

function padamPasukanKO(sukanId, pi) {
  const kKO = state.kumpulanSukan[sukanId]?.[0];
  if (!kKO) return;
  if (!confirm('Keluarkan "' + kKO.pasukan[pi] + '"?')) return;
  kKO.pasukan.splice(pi, 1);
  simpanData(); render();
}