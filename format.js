<<<<<<< HEAD
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
  const kumpulan    = state.kumpulanSukan[sukanId] || [];
  const totalPasukan = kumpulan.reduce((n, k) => n + k.pasukan.length, 0);

  /* Kira berapa perlawanan kumpulan dah ada dalam jadual */
  const pJadual     = state.jadual.filter(m => m.sukanId === sukanId && m.peringkat === 'kumpulan');
  const adaJadual   = pJadual.length;

  /* Hitung berapa perlawanan sepatutnya ada */
  const jangkaanPerlw = kumpulan.reduce((n, k) => {
    const x = k.pasukan.length;
    return n + (x > 1 ? (x * (x-1)) / 2 : 0);
  }, 0);

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
    ` : `
      ${kumpulan.map((k, ki) => `
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

      <!-- Bahagian Jana Jadual -->
      ${totalPasukan >= 2 ? `
        <div class="rr-section" style="margin-top:8px">
          <div class="rr-section-title">
            <span>⚙️ Jana Jadual Peringkat Kumpulan</span>
            ${adaJadual > 0
              ? `<span class="count-chip" style="color:var(--green)">${adaJadual} perlawanan dijana</span>`
              : ''}
          </div>

          <div class="rr-info-box">
            ${kumpulan.map(k => {
              const x = k.pasukan.length;
              const bil = x > 1 ? (x*(x-1))/2 : 0;
              return `<strong>${k.nama}</strong>: ${x} pasukan → ${bil} perlawanan`;
            }).join('<br/>')}
            <br/>Jumlah: <strong>${jangkaanPerlw} perlawanan</strong> dijana automatik.
            ${adaJadual > 0
              ? `<br/>⚠️ Jana semula <strong>tidak padam score</strong> yang dah dimasuk. Tarikh & masa dikekal.`
              : ''}
          </div>

          <!-- Tetapan masa perlawanan -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
            <div>
              <div class="field-label">📅 Tarikh Mula (pilihan)</div>
              <input type="date" id="jana-tarikh-${sukanId}" class="field-input"
                style="padding:8px 10px;font-size:13px"/>
            </div>
            <div>
              <div class="field-label">🕐 Masa Mula (pilihan)</div>
              <input type="time" id="jana-masa-${sukanId}" class="field-input"
                style="padding:8px 10px;font-size:13px" value="09:00"/>
            </div>
            <div>
              <div class="field-label">⏱ Selang Tiap Perlawanan</div>
              <select id="jana-selang-${sukanId}" class="podium-select"
                style="padding:9px 10px;font-size:13px;width:100%">
                <option value="90">90 minit</option>
                <option value="60">60 minit</option>
                <option value="45">45 minit</option>
                <option value="120">120 minit</option>
                <option value="0">Masa sama (TBA)</option>
              </select>
            </div>
          </div>

          <button class="rr-jana-btn" onclick="janaJadualKumpulan('${sukanId}')">
            ⚙️ ${adaJadual > 0 ? 'Jana Semula Jadual Kumpulan' : 'Jana Jadual Kumpulan Sekarang'}
          </button>
        </div>
      ` : `
        <div class="rr-info-box" style="margin-top:8px">
          ℹ️ Tambah sekurang-kurangnya <strong>2 pasukan</strong> dalam mana-mana kumpulan untuk jana jadual.
        </div>
      `}
    `}
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

/* ================================================================
   JANA JADUAL KUMPULAN AUTOMATIK
   ================================================================ */
function janaJadualKumpulan(sukanId) {
  const kumpulan = state.kumpulanSukan[sukanId] || [];
  const sukan    = state.sukan.find(s => s.id === sukanId);

  /* Kira total perlawanan */
  const total = kumpulan.reduce((n, k) => {
    const x = k.pasukan.length;
    return n + (x > 1 ? (x*(x-1))/2 : 0);
  }, 0);

  if (total === 0) { alert('Tambah sekurang-kurangnya 2 pasukan dalam kumpulan.'); return; }

  /* Ambil tetapan masa dari form */
  const tarikhMula = document.getElementById('jana-tarikh-' + sukanId)?.value || '';
  const masaMula   = document.getElementById('jana-masa-'   + sukanId)?.value || '09:00';
  const selang     = parseInt(document.getElementById('jana-selang-' + sukanId)?.value) || 90;

  /* Kekal score & info perlawanan lama */
  const infoLama = {};
  state.jadual
    .filter(m => m.sukanId === sukanId && m.peringkat === 'kumpulan')
    .forEach(m => {
      const key = m.rumah + '___' + m.tamu + '___' + m.kumpulan;
      infoLama[key] = {
        tarikh: m.tarikh, masa: m.masa, gelanggang: m.gelanggang,
        status: m.status, scoreRumah: m.scoreRumah, scoreTamu: m.scoreTamu,
      };
    });

  /* Padam perlawanan kumpulan lama untuk sukan ini */
  state.jadual = state.jadual.filter(
    m => !(m.sukanId === sukanId && m.peringkat === 'kumpulan')
  );

  /* Jana perlawanan baru */
  let masaSemasa = tarikhMula && masaMula
    ? new Date(tarikhMula + 'T' + masaMula + ':00')
    : null;

  kumpulan.forEach(k => {
    if (k.pasukan.length < 2) return;

    for (let i = 0; i < k.pasukan.length; i++) {
      for (let j = i + 1; j < k.pasukan.length; j++) {
        const rumah = k.pasukan[i];
        const tamu  = k.pasukan[j];
        const key   = rumah + '___' + tamu + '___' + k.id;
        const lama  = infoLama[key] || {};

        /* Tentukan tarikh & masa */
        let tarikh = lama.tarikh || '';
        let masa   = lama.masa   || '';

        if (!lama.tarikh && masaSemasa) {
          tarikh = masaSemasa.toISOString().split('T')[0];
          masa   = masaSemasa.toTimeString().slice(0,5);
          if (selang > 0) {
            masaSemasa = new Date(masaSemasa.getTime() + selang * 60000);
          }
        }

        state.jadual.push({
          id:         sukanId + '_kump_' + k.id + '_' + i + '_' + j,
          sukanId,
          kategori:   (sukan?.nama || '') + ' — ' + k.nama,
          peringkat:  'kumpulan',
          kumpulan:   k.id,
          label:      '',
          rumah,
          tamu,
          tarikh,
          masa,
          gelanggang: lama.gelanggang || '',
          status:     lama.status     || 'akan_datang',
          scoreRumah: lama.scoreRumah ?? 0,
          scoreTamu:  lama.scoreTamu  ?? 0,
        });
      }
    }
  });

  simpanData();
  semakAutoStatus();

  /* Maklumkan & bawa ke Jadual */
  const bilBaru = state.jadual.filter(m => m.sukanId === sukanId && m.peringkat === 'kumpulan').length;
  alert('✅ Berjaya! ' + bilBaru + ' perlawanan telah dijana.\n\nPergi ke tab 📅 Jadual untuk lihat.');
  render();
}
=======
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
              <!-- Toggle Main Ikut Set -->
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;
                font-size:12px;color:var(--muted);white-space:nowrap;user-select:none"
                title="Aktifkan kiraan skor ikut set (Badminton, Sepak Takraw, dll)">
                <div class="toggle-set-wrap">
                  <input type="checkbox" id="set-toggle-${s.id}"
                    ${s.mainSet ? 'checked' : ''}
                    onchange="togolMainSet('${s.id}',this.checked)"
                    style="display:none"/>
                  <div class="toggle-set-track ${s.mainSet?'on':''}">
                    <div class="toggle-set-thumb"></div>
                  </div>
                </div>
                🏸 Main ikut Set
              </label>
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
  /* Sukan yang guna format kumpulan SAHAJA */
  const sukanUrus = state.sukan.filter(s =>
    (state.formatSukan[s.id] || FORMAT_ASAL[s.id] || 'biasa') === 'kumpulan'
  );

  if (sukanUrus.length === 0) {
    return `
      <div class="set-panel-title">🔵 Urus Kumpulan &amp; Peserta</div>
      <div class="kosong-box" style="margin-top:16px">
        <div style="font-size:32px;margin-bottom:10px">🔵</div>
        Tiada sukan dengan format Peringkat Kumpulan.<br/>
        <span style="font-size:13px;margin-top:6px;display:block">
          Pergi ke <strong>Format Sukan</strong> dan tukar format mana-mana sukan kepada
          <strong>🔵 Peringkat Kumpulan</strong>.
        </span>
      </div>
    `;
  }

  /* Tab pilih sukan */
  const tabAktif = (state.kumpulanSukanTab && sukanUrus.find(s => s.id === state.kumpulanSukanTab))
    ? state.kumpulanSukanTab : sukanUrus[0]?.id;

  const sukanKini = state.sukan.find(s => s.id === tabAktif);

  const tabBar = sukanUrus.length > 1 ? `
    <div class="subtab-bar" style="margin-bottom:16px">
      ${sukanUrus.map(s => `
        <button class="subtab-btn ${s.id === tabAktif ? 'active' : ''}"
          onclick="pilihKumpulanSukanTab('${s.id}')">
          ${s.icon||'🏅'} ${s.nama}
        </button>
      `).join('')}
    </div>
  ` : '';

  /* Tab kategori/acara (kalau sukan ada lebih 1 acara) */
  const acara = sukanKini?.acara || [];
  let katKey  = tabAktif; /* kunci untuk kumpulanSukan */
  let katNama = '';       /* nama kategori untuk label jadual */
  let tabKat  = '';

  if (acara.length > 1) {
    const katAktif = (state.selectedKatKumpulan?.[tabAktif] &&
      acara.find(a => a.id === state.selectedKatKumpulan[tabAktif]))
      ? state.selectedKatKumpulan[tabAktif]
      : acara[0].id;

    if (!state.selectedKatKumpulan) state.selectedKatKumpulan = {};
    state.selectedKatKumpulan[tabAktif] = katAktif;

    katKey  = tabAktif + '___' + katAktif;
    katNama = acara.find(a => a.id === katAktif)?.nama || '';

    tabKat = `
      <div class="kat-tab-bar" style="margin-bottom:16px">
        <span style="font-size:11px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;
          font-weight:600;flex-shrink:0">Kategori:</span>
        ${acara.map(a => `
          <button class="kat-tab-btn ${a.id === katAktif ? 'active' : ''}"
            onclick="pilihKatKumpulan('${tabAktif}','${a.id}')">
            ${a.nama}
          </button>
        `).join('')}
      </div>
    `;
  } else if (acara.length === 1) {
    katNama = acara[0].nama;
  }

  const kandungan = renderUrusKumpulanFasa(tabAktif, katKey, sukanKini, katNama);

  return `
    <div class="set-panel-title">🔵 Urus Kumpulan &amp; Peserta</div>
    <div class="set-panel-desc">Urus peserta dan kumpulan untuk setiap sukan dan kategori.</div>
    ${tabBar}
    ${tabKat}
    ${kandungan}
  `;
}

function pilihKatKumpulan(sukanId, acaraId) {
  if (!state.selectedKatKumpulan) state.selectedKatKumpulan = {};
  state.selectedKatKumpulan[sukanId] = acaraId;
  render();
}


/* ================================================================
   URUS: PERINGKAT KUMPULAN
   ================================================================ */
function renderUrusKumpulanFasa(sukanId, katKey, sukanKini, katNama) {
  /* katKey = sukanId biasa, ATAU sukanId___acaraId untuk multi-kategori */
  const kumpulan     = state.kumpulanSukan[katKey] || [];
  const totalPasukan = kumpulan.reduce((n, k) => n + k.pasukan.length, 0);

  /* Perlawanan bagi kategori ini */
  const pJadual   = state.jadual.filter(m =>
    m.sukanId === sukanId && m.peringkat === 'kumpulan' &&
    (!katNama || m.kategori === katNama)
  );
  const adaJadual = pJadual.length;

  const jangkaanPerlw = kumpulan.reduce((n, k) => {
    const x = k.pasukan.length;
    return n + (x > 1 ? (x * (x-1)) / 2 : 0);
  }, 0);

  const adaJadualKat = state.jadual.some(m => m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama));
  const adaKumpulan  = kumpulan.length > 0;
  const katLabel     = katNama ? ` — ${katNama}` : '';

  return `
    <div class="fmt-header" style="flex-wrap:wrap;gap:8px">
      <div>
        <div class="fmt-nama">${sukanKini?.icon||'🏅'} ${sukanKini?.nama}${katLabel}</div>
        <div class="fmt-badge kumpulan">🔵 Peringkat Kumpulan</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="add-btn" style="font-size:12px;padding:7px 14px"
          onclick="tambahKumpulan('${katKey}')">+ Kumpulan Baru</button>
        ${adaKumpulan ? `
          <button class="staff-del" style="padding:7px 12px;font-size:12px"
            onclick="padamSemuaKumpulan('${katKey}','${sukanId}',this.dataset.kat)" data-kat="${katNama||''}">
            🗑 Reset Kumpulan
          </button>
        ` : ''}
        ${adaJadualKat ? `
          <button class="staff-del" style="padding:7px 12px;font-size:12px"
            onclick="padamSemuaJadualKumpulan('${sukanId}',this.dataset.kat)" data-kat="${katNama||''}">
            🗑 Padam Semua Jadual
          </button>
        ` : ''}
      </div>
    </div>

    <div class="fmt-info-box">
      Pasukan tempat <strong>1 dan 2</strong> dalam setiap kumpulan layak ke peringkat seterusnya.
    </div>

    ${kumpulan.length === 0 ? `
      <div class="kosong-box" style="padding:28px 20px">
        <div style="font-size:28px;margin-bottom:8px">🔵</div>
        Tiada kumpulan. Klik "+ Kumpulan Baru" di atas.
      </div>
    ` : `
      ${kumpulan.map((k, ki) => `
        <div class="kumpulan-panel-edit">
          <div class="kumpulan-panel-header">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span class="kumpulan-badge">${k.id}</span>
              <input type="text" class="kumpulan-nama-input"
                value="${k.nama}"
                onchange="ubahNamaKumpulan('${katKey}', ${ki}, this.value)"/>
              <span class="count-chip">${k.pasukan.length} pasukan</span>
            </div>
            <button class="staff-del" onclick="padamKumpulan('${katKey}', ${ki})">Padam</button>
          </div>

          <div class="tag-list" style="margin:8px 0 12px">
            ${k.pasukan.length === 0
              ? `<span style="color:var(--muted);font-size:13px">Tiada pasukan. Tambah di bawah.</span>`
              : k.pasukan.map((p, pi) => `
                  <div class="tag">
                    ${p}
                    <span class="tag-del" onclick="padamPasukanKumpulan('${katKey}', ${ki}, ${pi})">×</span>
                  </div>
                `).join('')
            }
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <select id="sel-pasukan-${katKey}-${ki}" class="podium-select"
              style="flex:1;min-width:160px;padding:8px 10px;font-size:13px">
              <option value="">-- Pilih pasukan --</option>
              ${state.pasukan.filter(p => !k.pasukan.includes(p))
                .map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <button class="add-btn" style="font-size:12px;padding:7px 14px"
              onclick="tambahPasukanKumpulan('${katKey}', ${ki})">+ Tambah</button>
          </div>
        </div>
      `).join('')}

      <!-- Bahagian Jana Jadual -->
      ${totalPasukan >= 2 ? `
          <div class="rr-section-title">
            <span>⚙️ Jana Jadual Peringkat Kumpulan</span>
            ${adaJadual > 0
              ? `<span class="count-chip" style="color:var(--green)">${adaJadual} perlawanan dijana</span>`
              : ''}
          </div>

          <div class="rr-info-box">
            ${kumpulan.map(k => {
              const x = k.pasukan.length;
              const bil = x > 1 ? (x*(x-1))/2 : 0;
              return `<strong>${k.nama}</strong>: ${x} pasukan → ${bil} perlawanan`;
            }).join('<br/>')}
            <br/>Jumlah: <strong>${jangkaanPerlw} perlawanan</strong> dijana automatik.
            ${adaJadual > 0
              ? `<br/>⚠️ Jana semula <strong>tidak padam score</strong> yang dah dimasuk. Tarikh & masa dikekal.`
              : ''}
          </div>

          <!-- Tetapan masa perlawanan -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:14px">
            <div>
              <div class="field-label">📅 Tarikh Mula (pilihan)</div>
              <input type="date" id="jana-tarikh-${katKey}" class="field-input"
                style="padding:8px 10px;font-size:13px"/>
            </div>
            <div>
              <div class="field-label">🕐 Masa Mula (pilihan)</div>
              <input type="time" id="jana-masa-${katKey}" class="field-input"
                style="padding:8px 10px;font-size:13px" value="09:00"/>
            </div>
            <div>
              <div class="field-label">⏱ Selang Tiap Perlawanan (minit)</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
                ${[45,60,90,120].map(m => `
                  <button type="button" class="selang-preset"
                    onclick="document.getElementById('jana-selang-${katKey}').value='${m}'">
                    ${m}m
                  </button>
                `).join('')}
                <button type="button" class="selang-preset"
                  onclick="document.getElementById('jana-selang-${katKey}').value='0'">
                  Tanpa masa
                </button>
              </div>
              <input type="number" id="jana-selang-${katKey}"
                class="field-input"
                style="padding:8px 10px;font-size:14px;max-width:140px"
                placeholder="Contoh: 90"
                min="0" value="90"
              />
            </div>
            <div>
              <div class="field-label">📍 Bilangan Gelanggang</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
                ${[1,2,3,4].map(n => `
                  <button type="button" class="selang-preset"
                    onclick="document.getElementById('jana-gelanggang-${katKey}').value='${n}';kemaskiniNamaGelanggang('${katKey}')">
                    ${n}
                  </button>
                `).join('')}
              </div>
              <input type="number" id="jana-gelanggang-${katKey}"
                class="field-input"
                style="padding:8px 10px;font-size:14px;max-width:100px"
                placeholder="Contoh: 2"
                min="1" max="10" value="1"
                oninput="kemaskiniNamaGelanggang('${katKey}')"
              />
            </div>
          </div>

          <!-- Nama setiap gelanggang (auto jana tapi boleh edit) -->
          <div id="nama-gelanggang-wrap-${katKey}" style="margin-bottom:14px">
            <!-- diisi oleh kemaskiniNamaGelanggang() -->
          </div>

          <button class="rr-jana-btn" onclick="janaJadualKumpulan('${sukanId}','${katKey}',this.dataset.kat)" data-kat="${katNama||''}">
            ⚙️ ${adaJadual > 0 ? 'Jana Semula Jadual Kumpulan' : 'Jana Jadual Kumpulan Sekarang'}
          </button>
        </div>
      ` : `
        <div class="rr-info-box" style="margin-top:8px">
          ℹ️ Tambah sekurang-kurangnya <strong>2 pasukan</strong> dalam mana-mana kumpulan untuk jana jadual.
        </div>
      `}

      <!-- Padam semua kumpulan sekaligus -->
      ${kumpulan.length > 0 ? `
        <div style="margin-top:8px;padding:12px 14px;background:rgba(231,76,60,0.05);
          border:1px solid rgba(231,76,60,0.2);border-radius:10px;
          display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div style="font-size:13px;color:var(--muted)">
            🗑 Padam semua data kumpulan${katNama ? ' untuk <strong style="color:var(--text)">' + katNama + '</strong>' : ''} sekaligus
          </div>
          <button class="staff-del" style="padding:7px 16px"
            onclick="padamSemuaKumpulan('${katKey}','${sukanId}',this.dataset.kat)" data-kat="${katNama||''}">
            Padam Semua Kumpulan
          </button>
        </div>
      ` : ''}
    `}
    ${kumpulan.length >= 2 ? renderJanaPeringkat(sukanId, katKey) : ''}
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

function togolMainSet(sukanId, aktif) {
  const s = state.sukan.find(x => x.id === sukanId);
  if (!s) return;
  s.mainSet = aktif;
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
<<<<<<< HEAD
>>>>>>> bf49cbd (feat: add tetapan.js for settings management with sub-tabs for account management, staff addition, team management, and sports & events)
=======

/* ================================================================
   KEMASKINI NAMA GELANGGANG
   ================================================================ */
function kemaskiniNamaGelanggang(sukanId) {
  const bilEl = document.getElementById('jana-gelanggang-' + sukanId);
  const wrap  = document.getElementById('nama-gelanggang-wrap-' + sukanId);
  if (!bilEl || !wrap) return;
  const bil = Math.max(1, Math.min(10, parseInt(bilEl.value) || 1));
  if (bil <= 1) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <div class="field-label" style="margin-bottom:8px">📍 Nama Gelanggang (boleh edit)</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">
      ${Array.from({length: bil}, (_, i) => `
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Gelanggang ${i+1}</div>
          <input type="text" id="jana-gel-nama-${sukanId}-${i}"
            class="field-input" style="padding:7px 10px;font-size:13px"
            value="Gelanggang ${String.fromCharCode(65+i)}" placeholder="Nama gelanggang"/>
        </div>
      `).join('')}
    </div>
  `;
}


/* ================================================================
   JANA JADUAL KUMPULAN AUTOMATIK
   ── Selang-seli kumpulan + bahagi gelanggang
   ================================================================ */
function janaJadualKumpulan(sukanId, katKey, katNama) {
  /* katKey — kunci kumpulanSukan (mungkin sama dengan sukanId atau ada ___acaraId) */
  if (!katKey) katKey = sukanId;
  const kumpulan = state.kumpulanSukan[katKey] || [];
  const sukan    = state.sukan.find(s => s.id === sukanId);

  const total = kumpulan.reduce((n, k) => {
    const x = k.pasukan.length;
    return n + (x > 1 ? (x*(x-1))/2 : 0);
  }, 0);

  if (total === 0) { alert('Tambah sekurang-kurangnya 2 pasukan dalam kumpulan.'); return; }

  const tarikhMula    = document.getElementById('jana-tarikh-'     + katKey)?.value || '';
  const masaMula      = document.getElementById('jana-masa-'        + katKey)?.value || '09:00';
  const selang        = parseInt(document.getElementById('jana-selang-'     + katKey)?.value) || 90;
  const bilGelanggang = Math.max(1, parseInt(document.getElementById('jana-gelanggang-' + katKey)?.value) || 1);

  /* Nama gelanggang */
  const namaGelanggang = Array.from({length: bilGelanggang}, (_, i) => {
    const inp = document.getElementById('jana-gel-nama-' + katKey + '-' + i);
    return inp?.value?.trim() || 'Gelanggang ' + String.fromCharCode(65 + i);
  });

  /* Kekal score lama (ikut kategori kalau ada) */
  const infoLama = {};
  state.jadual.filter(m =>
    m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama)
  ).forEach(m => {
    const key = m.rumah + '___' + m.tamu + '___' + m.kumpulan;
    infoLama[key] = { tarikh: m.tarikh, masa: m.masa, gelanggang: m.gelanggang,
                      status: m.status, scoreRumah: m.scoreRumah, scoreTamu: m.scoreTamu };
  });

  /* Padam perlawanan kumpulan lama (ikut kategori kalau ada) */
  state.jadual = state.jadual.filter(m =>
    !(m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama))
  );

  /* Jana pasangan */
  const semuaPasangan = [];
  kumpulan.forEach(k => {
    if (k.pasukan.length < 2) return;
    for (let i = 0; i < k.pasukan.length; i++)
      for (let j = i+1; j < k.pasukan.length; j++)
        semuaPasangan.push({ rumah: k.pasukan[i], tamu: k.pasukan[j], kumpulan: k.id, kNama: k.nama });
  });

  /* Susun — selang-seli kumpulan, rehat pasukan */
  const tersusun = [], berbaki = [...semuaPasangan], lastMain = {};
  while (berbaki.length > 0) {
    const slot = tersusun.length;
    const lepas = slot > 0 ? tersusun[slot-1] : null;
    const kumpLepas = lepas?.kumpulan || null;
    const cat = [[], [], [], []];
    berbaki.forEach((m, i) => {
      const kBeza = m.kumpulan !== kumpLepas;
      const clash = lepas && (m.rumah===lepas.rumah||m.rumah===lepas.tamu||m.tamu===lepas.rumah||m.tamu===lepas.tamu);
      if (kBeza && !clash) cat[0].push(i);
      else if (!kBeza && !clash) cat[1].push(i);
      else if (kBeza && clash) cat[2].push(i);
      else cat[3].push(i);
    });
    const pool = cat.find(c => c.length > 0);
    const pil = pool.reduce((best, i) => {
      const m = berbaki[i], mb = berbaki[best];
      const rM = (slot-(lastMain[m.rumah]??-999))+(slot-(lastMain[m.tamu]??-999));
      const rB = (slot-(lastMain[mb.rumah]??-999))+(slot-(lastMain[mb.tamu]??-999));
      return rM > rB ? i : best;
    });
    const d = berbaki.splice(pil, 1)[0];
    lastMain[d.rumah] = slot; lastMain[d.tamu] = slot;
    tersusun.push(d);
  }

  /* Tetapkan masa & gelanggang
     N gelanggang → N perlawanan SERENTAK pada masa yang sama,
     masa naik setiap N slot.
     Contoh 2 gelanggang, selang 90min:
       idx 0 → Gel A, 09:00  |  idx 1 → Gel B, 09:00
       idx 2 → Gel A, 10:30  |  idx 3 → Gel B, 10:30
  */
  const masaBase = tarikhMula && masaMula
    ? new Date(tarikhMula + 'T' + masaMula + ':00') : null;

  tersusun.forEach((p, idx) => {
    const key      = p.rumah + '___' + p.tamu + '___' + p.kumpulan;
    const lama     = infoLama[key] || {};
    const slotMasa = Math.floor(idx / bilGelanggang);
    const noGelang = idx % bilGelanggang;

    let tarikh = lama.tarikh || '';
    let masa   = lama.masa   || '';
    let gelang = lama.gelanggang || namaGelanggang[noGelang];

    if (!lama.gelanggang) gelang = namaGelanggang[noGelang];

    if (!lama.tarikh && masaBase) {
      const ms = selang > 0
        ? new Date(masaBase.getTime() + slotMasa * selang * 60000)
        : masaBase;
      tarikh = ms.toISOString().split('T')[0];
      masa   = ms.toTimeString().slice(0, 5);
    }

    state.jadual.push({
      id:         sukanId + '_kump_' + p.kumpulan + '_' + idx + '_' + Date.now(),
      sukanId,
      kategori:   katNama || ((sukan?.nama||'') + ' — ' + p.kNama),
      peringkat:  'kumpulan',
      kumpulan:   p.kumpulan,
      label:      '',
      rumah:      p.rumah,
      tamu:       p.tamu,
      tarikh, masa,
      gelanggang: gelang,
      status:     lama.status     || 'akan_datang',
      scoreRumah: lama.scoreRumah ?? 0,
      scoreTamu:  lama.scoreTamu  ?? 0,
    });
  });

  simpanData();
  semakAutoStatus();

  const bilBaru     = state.jadual.filter(m => m.sukanId === sukanId && m.peringkat === 'kumpulan').length;
  const bilSlot     = Math.ceil(tersusun.length / bilGelanggang);
  const infoGelang  = bilGelanggang > 1
    ? `\n📍 ${bilGelanggang} gelanggang: ${namaGelanggang.join(', ')}\n⏱ ${bilSlot} slot masa (${bilGelanggang} perlawanan serentak)`
    : '';

  alert('✅ Berjaya! ' + bilBaru + ' perlawanan telah dijana.' + infoGelang + '\n\nPergi ke tab 📅 Jadual untuk lihat.');
  render();
}
/* Padam semua perlawanan kumpulan sekaligus */
function padamSemuaJadualKumpulan(sukanId, katNama) {
  const sukan = state.sukan.find(s => s.id === sukanId);
  const bil   = state.jadual.filter(m =>
    m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama)
  ).length;
  const label = katNama ? `"${katNama}"` : (sukan?.nama || 'sukan ini');
  if (!confirm('Padam semua ' + bil + ' perlawanan kumpulan untuk ' + label + '?\n\nScore & keputusan juga akan dipadam.')) return;
  state.jadual = state.jadual.filter(m =>
    !(m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama))
  );
  simpanData();
  render();
}

/* Padam semua kumpulan (dan jadual berkaitan) sekaligus */
function padamSemuaKumpulan(katKey, sukanId, katNama) {
  const bilKump = (state.kumpulanSukan[katKey] || []).length;
  const bilJdl  = state.jadual.filter(m =>
    m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama)
  ).length;

  const label = katNama || 'sukan ini';
  if (!confirm(
    'Padam semua ' + bilKump + ' kumpulan' +
    (bilJdl > 0 ? ' dan ' + bilJdl + ' perlawanan' : '') +
    ' untuk ' + label + '?\n\nTindakan ini tidak boleh diundur.'
  )) return;

  /* Padam kumpulan */
  delete state.kumpulanSukan[katKey];

  /* Padam jadual berkaitan */
  if (bilJdl > 0) {
    state.jadual = state.jadual.filter(m =>
      !(m.sukanId === sukanId && m.peringkat === 'kumpulan' && (!katNama || m.kategori === katNama))
    );
  }

  simpanData();
  render();
}
>>>>>>> 2c89801 (feat: implement full bracket system for knockout tournaments)
