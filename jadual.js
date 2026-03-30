<<<<<<< HEAD
/* ================================================================
   jadual.js — JADUAL PERLAWANAN SEMUA SUKAN
   ================================================================

   STRUKTUR:
   - Tab sukan di atas (Bola Sepak, Futsal, Badminton, dll)
   - Tab hari di bawah tab sukan
   - Bola Sepak & Futsal: format kumpulan + knockout
   - Badminton & Bola Tampar: format jadual biasa

   UNTUK TAMBAH PERLAWANAN:
   1. Login sebagai staff
   2. Klik tab sukan yang dikehendaki
   3. Klik "+ Tambah Perlawanan"

   UNTUK EDIT KOD:
   - Tambah/ubah kumpulan → KUMPULAN_SUKAN
   - Tambah/ubah perlawanan asal → JADUAL_ASAL
   ================================================================ */


/* ----------------------------------------------------------------
   FORMAT SETIAP SUKAN
   'kumpulan'  → ada peringkat kumpulan + knockout (bola sepak gaya)
   'biasa'     → jadual perlawanan biasa tanpa kumpulan
   'individu'  → tiada jadual perlawanan (olahraga, renang)
   ---------------------------------------------------------------- */
const FORMAT_SUKAN = {
  s1: 'individu',   // Olahraga
  s2: 'biasa',      // Badminton
  s3: 'kumpulan',   // Bola Sepak
  s4: 'kumpulan',   // Futsal
  s5: 'biasa',      // Bola Tampar
  s6: 'individu',   // Renang
};


/* ----------------------------------------------------------------
   KUMPULAN UNTUK SUKAN BERKUMPULAN
   Setiap sukan ada senarai kumpulan sendiri.
   ---------------------------------------------------------------- */
const KUMPULAN_SUKAN = {

  /* Bola Sepak */
  s3: [
    {
      id: 'A', nama: 'Kumpulan A',
      pasukan: ["MRSM Kepala Batas", "MRSM Balik Pulau", "IKBN Darul Aman"],
    },
    {
      id: 'B', nama: 'Kumpulan B',
      pasukan: ["MRSM Kubang Pasu", "IKM Alor Setar", "ADTEC Kedah"],
    },
  ],

  /* Futsal */
  s4: [
    {
      id: 'A', nama: 'Kumpulan A',
      pasukan: ["MRSM Kepala Batas", "MRSM Kubang Pasu", "ADTEC Kedah"],
    },
    {
      id: 'B', nama: 'Kumpulan B',
      pasukan: ["MRSM Balik Pulau", "IKM Alor Setar", "MRSM Taiping"],
    },
  ],

  /* Tambah sukan kumpulan lain:
  sX: [
    { id: 'A', nama: 'Kumpulan A', pasukan: ["Pasukan 1","Pasukan 2"] },
  ],
  */
};


/* ----------------------------------------------------------------
   DATA JADUAL PERLAWANAN
   sukanId   : id sukan dari data.js (s1, s2, s3...)
   kategori  : nama acara (contoh: "Bola Sepak Lelaki")
   peringkat : 'kumpulan' | 'suku_akhir' | 'separuh_akhir' |
               'tempat_ketiga' | 'akhir' | 'kumpulan_utama' | 'separuh' | 'final'
   kumpulan  : 'A' | 'B' | null
   ---------------------------------------------------------------- */
const JADUAL_ASAL = [

  /* ══════════════════════════════════════
     BOLA SEPAK LELAKI (s3)
  ══════════════════════════════════════ */

  /* Kumpulan A */
  { id:"bs_a1", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_a2", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"IKBN Darul Aman",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_a3", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Balik Pulau", tamu:"IKBN Darul Aman",
    tarikh:"2025-08-10", masa:"14:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Kumpulan B */
  { id:"bs_b1", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Kubang Pasu", tamu:"IKM Alor Setar",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_b2", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Kubang Pasu", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_b3", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"IKM Alor Setar", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"14:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Suku Akhir */
  { id:"bs_sf1", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"suku_akhir", kumpulan:null,
    label:"Suku Akhir 1", rumah:"1A", tamu:"2B",
    tarikh:"2025-08-11", masa:"10:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_sf2", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"suku_akhir", kumpulan:null,
    label:"Suku Akhir 2", rumah:"1B", tamu:"2A",
    tarikh:"2025-08-11", masa:"14:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Separuh Akhir */
  { id:"bs_semi", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"separuh_akhir", kumpulan:null,
    label:"Separuh Akhir", rumah:"Menang SF1", tamu:"Menang SF2",
    tarikh:"2025-08-12", masa:"10:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Tempat Ketiga */
  { id:"bs_3rd", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"tempat_ketiga", kumpulan:null,
    label:"Tempat Ke-3", rumah:"Kalah Semi 1", tamu:"Kalah Semi 2",
    tarikh:"2025-08-12", masa:"14:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Final */
  { id:"bs_final", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"akhir", kumpulan:null,
    label:"FINAL", rumah:"Menang Semi", tamu:"Naib Menang Semi",
    tarikh:"2025-08-13", masa:"15:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },


  /* ══════════════════════════════════════
     FUTSAL (s4)
  ══════════════════════════════════════ */

  /* Futsal Lelaki — Kumpulan A */
  { id:"fl_a1", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"MRSM Kubang Pasu",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_a2", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_a3", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kubang Pasu", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"13:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Futsal Lelaki — Kumpulan B */
  { id:"fl_b1", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Balik Pulau", tamu:"IKM Alor Setar",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Gelanggang Futsal 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_b2", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Balik Pulau", tamu:"MRSM Taiping",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Gelanggang Futsal 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_b3", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"IKM Alor Setar", tamu:"MRSM Taiping",
    tarikh:"2025-08-10", masa:"13:00", gelanggang:"Gelanggang Futsal 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Futsal Lelaki — Final */
  { id:"fl_final", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"akhir", kumpulan:null,
    label:"FINAL", rumah:"Menang Kumpulan A", tamu:"Menang Kumpulan B",
    tarikh:"2025-08-11", masa:"15:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Futsal Wanita */
  { id:"fw_1", sukanId:"s4", kategori:"Futsal Wanita", peringkat:"kumpulan_utama", kumpulan:null,
    label:"Perlawanan 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-10", masa:"10:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fw_2", sukanId:"s4", kategori:"Futsal Wanita", peringkat:"kumpulan_utama", kumpulan:null,
    label:"Perlawanan 2", rumah:"MRSM Kubang Pasu", tamu:"IKM Alor Setar",
    tarikh:"2025-08-10", masa:"12:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fw_final", sukanId:"s4", kategori:"Futsal Wanita", peringkat:"akhir", kumpulan:null,
    label:"FINAL", rumah:"Terbaik Wanita 1", tamu:"Terbaik Wanita 2",
    tarikh:"2025-08-11", masa:"16:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },


  /* ══════════════════════════════════════
     BADMINTON (s2)
  ══════════════════════════════════════ */

  { id:"bd_1", sukanId:"s2", kategori:"Beregu Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Kubang Pasu",
    tarikh:"2025-08-11", masa:"09:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_2", sukanId:"s2", kategori:"Beregu Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 2", rumah:"IKM Alor Setar", tamu:"ADTEC Kedah",
    tarikh:"2025-08-11", masa:"11:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_final", sukanId:"s2", kategori:"Beregu Lelaki", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"10:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  { id:"bd_w1", sukanId:"s2", kategori:"Beregu Wanita", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-11", masa:"09:00", gelanggang:"Dewan Badminton 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_wfinal", sukanId:"s2", kategori:"Beregu Wanita", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"14:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  { id:"bd_c1", sukanId:"s2", kategori:"Campuran", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir", rumah:"MRSM Kepala Batas", tamu:"IKM Alor Setar",
    tarikh:"2025-08-11", masa:"14:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_cfinal", sukanId:"s2", kategori:"Campuran", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"16:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },


  /* ══════════════════════════════════════
     BOLA TAMPAR (s5)
  ══════════════════════════════════════ */

  { id:"bt_l1", sukanId:"s5", kategori:"Bola Tampar Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Kubang Pasu",
    tarikh:"2025-08-11", masa:"09:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bt_l2", sukanId:"s5", kategori:"Bola Tampar Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 2", rumah:"IKM Alor Setar", tamu:"ADTEC Kedah",
    tarikh:"2025-08-11", masa:"11:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bt_lfinal", sukanId:"s5", kategori:"Bola Tampar Lelaki", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"10:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  { id:"bt_w1", sukanId:"s5", kategori:"Bola Tampar Wanita", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-11", masa:"13:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bt_wfinal", sukanId:"s5", kategori:"Bola Tampar Wanita", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"15:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

];


/* ================================================================
   SENARAI SUKAN YANG ADA JADUAL (bukan individu)
   ================================================================ */
function sukanAdaJadual() {
  return state.sukan.filter(s => (state.formatSukan[s.id] || 'biasa') !== 'individu');
}

function sukanTabAktif() {
  const senarai = sukanAdaJadual();
  if (!state.jadualSukanTab || !senarai.find(s => s.id === state.jadualSukanTab)) {
    return senarai[0]?.id || null;
  }
  return state.jadualSukanTab;
}


/* ================================================================
   RENDER UTAMA JADUAL
   ── Tunjuk grid kad sukan dulu
   ── Bila klik sukan → tunjuk jadual sukan tersebut
   ================================================================ */
function renderJadual() {
  if (state.editingPerlawanan) return renderFormEditPerlawanan();

  /* Kalau sukan dah dipilih → tunjuk jadual sukan */
  if (state.jadualSukanTab) return renderJadualSukan();

  /* ── Grid kad sukan ── */
  const senarai = sukanAdaJadual();
  const isStaff = !!state.staffLogin;

  if (senarai.length === 0) {
    return `<div class="kosong-box"><div style="font-size:40px;margin-bottom:12px">🏅</div>Tiada sukan dengan jadual perlawanan.</div>`;
  }

  const kards = senarai.map(s => {
    const fmt = state.formatSukan[s.id] || 'biasa';

    let selesai = 0, berlangsung = 0, total = 0;
    if (fmt === 'round_robin') {
      const prl = state.roundRobin[s.id]?.perlawanan || [];
      selesai     = prl.filter(m => m.status === 'selesai').length;
      berlangsung = prl.filter(m => m.status === 'sedang_berlangsung').length;
      total       = prl.length;
    } else {
      const pSukan = state.jadual.filter(m => m.sukanId === s.id);
      selesai      = pSukan.filter(m => m.status === 'selesai').length;
      berlangsung  = pSukan.filter(m => m.status === 'sedang_berlangsung').length;
      total        = pSukan.length;
    }

    const formatLabel = fmt === 'kumpulan'    ? '🔵 Format Kumpulan'
                      : fmt === 'round_robin' ? '🔄 Round Robin'
                      : '🎯 Perlawanan';

    return `
      <div class="jadual-sukan-kad" onclick="pilihJadualSukan('${s.id}')">
        ${berlangsung > 0 ? '<span class="done-badge" style="background:var(--red)">🔴 LIVE</span>' : ''}
        ${selesai === total && total > 0 ? '<span class="done-badge">✓ Siap</span>' : ''}

        <div class="jadual-sukan-icon">${s.icon || '🏅'}</div>
        <div class="jadual-sukan-nama">${s.nama}</div>
        <div class="jadual-sukan-format">${formatLabel}</div>

        <div class="jadual-sukan-stats">
          <span class="${berlangsung > 0 ? 'live-stat' : 'muted-stat'}">
            ${berlangsung > 0 ? '🔴 ' + berlangsung + ' Live' : ''}
          </span>
          <span class="muted-stat">
            ${total > 0 ? selesai + '/' + total + ' selesai' : 'Belum ada jadual'}
          </span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="section-title">📅 Jadual Perlawanan</div>
    <div class="jadual-sukan-grid">${kards}</div>
  `;
}


/* ================================================================
   RENDER JADUAL UNTUK SATU SUKAN (selepas klik kad)
   ================================================================ */
function renderJadualSukan() {
  const isStaff   = !!state.staffLogin;
  const sukanId   = state.jadualSukanTab;
  const sukanKini = state.sukan.find(s => s.id === sukanId);
  if (!sukanKini) { state.jadualSukanTab = null; return renderJadual(); }

  const format          = state.formatSukan[sukanId] || 'biasa';
  const perlawananSukan = state.jadual.filter(m => m.sukanId === sukanId);
  const selesai         = perlawananSukan.filter(m => m.status === 'selesai').length;
  const berlangsung     = perlawananSukan.filter(m => m.status === 'sedang_berlangsung').length;
  const akanDatang      = perlawananSukan.filter(m => m.status === 'akan_datang').length;

  /* Stats bar */
  const statsHTML = `
    <div class="jadual-stats">
      <div class="jstat-card green">
        <div class="jstat-num">${selesai}</div>
        <div class="jstat-lbl">Selesai</div>
      </div>
      <div class="jstat-card gold">
        <div class="jstat-num">${berlangsung}</div>
        <div class="jstat-lbl">Live</div>
      </div>
      <div class="jstat-card muted">
        <div class="jstat-num">${akanDatang}</div>
        <div class="jstat-lbl">Akan Datang</div>
      </div>
    </div>
  `;

  /* Butang tambah — sembunyi untuk round robin (guna Urus Round Robin) */
  const tambahBtn = isStaff && format !== 'round_robin' ? `
    <div style="margin-bottom:16px">
      <button class="tambah-perlawanan-btn" onclick="bukaFormTambah()">
        + Tambah Perlawanan
      </button>
    </div>
  ` : isStaff && format === 'round_robin' ? `
    <div style="margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <button class="tambah-perlawanan-btn" style="background:var(--card);color:var(--green);border:1.5px solid rgba(46,204,113,0.5)"
        onclick="setTab('tetapan');state.subTab='round_robin';state.rrSukanTab='${sukanId}';render()">
        🔄 Urus Round Robin →
      </button>
      <span style="font-size:12px;color:var(--muted)">
        Jana jadual & tetapkan tarikh/score dalam Tetapan
      </span>
    </div>
  ` : '';

  /* Kandungan ikut format */
  let kandungan = '';
  if (format === 'kumpulan')       kandungan = renderJadualKumpulanFormat(sukanId, perlawananSukan, isStaff);
  else if (format === 'round_robin') kandungan = renderJadualRoundRobinFormat(sukanId, perlawananSukan, isStaff);
  else                               kandungan = renderJadualBiasaFormat(sukanId, perlawananSukan, isStaff);

  return `
    <button class="back-btn" onclick="balikGridJadual()">← Semua Sukan</button>
    <div class="section-title">${sukanKini.icon || '🏅'} ${sukanKini.nama}</div>
    ${statsHTML}
    ${tambahBtn}
    ${kandungan}
  `;
}


/* ================================================================
   FORMAT KUMPULAN (Bola Sepak, Futsal, dll)
   Perlawanan dipisah ikut hari dengan tab hari.
   ================================================================ */
function renderJadualKumpulanFormat(sukanId, senarai, isStaff) {
  const kumpulan = state.kumpulanSukan[sukanId] || [];
  const hari     = [...new Set(senarai.map(m => m.tarikh).filter(Boolean))].sort();
  const aktif    = hariAktif(sukanId);

  const tabHariHTML = hari.length > 1 ? `
    <div class="hari-tab-wrap">
      <div class="hari-tab-bar">
        ${hari.map(h => {
          const live = senarai.some(m => m.tarikh === h && m.status === 'sedang_berlangsung');
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

  /* Perlawanan hari ini */
  const pHari = senarai
    .filter(m => m.tarikh === aktif)
    .sort((a,b) => a.masa.localeCompare(b.masa));

  if (!aktif || pHari.length === 0) {
    return tabHariHTML + (senarai.length === 0
      ? `<div class="kosong-box"><div style="font-size:36px;margin-bottom:10px">📅</div>Tiada jadual lagi. ${isStaff ? 'Tambah perlawanan di atas.' : ''}</div>`
      : `<div class="kosong-box">Tiada perlawanan pada hari ini.</div>`);
  }

  /* Asingkan ikut peringkat */
  const ikutPeringkat = {};
  pHari.forEach(m => {
    const k = m.peringkat || 'lain';
    if (!ikutPeringkat[k]) ikutPeringkat[k] = [];
    ikutPeringkat[k].push(m);
  });

  const susunan = ['kumpulan','kumpulan_utama','suku_akhir','separuh_akhir','separuh','tempat_ketiga','akhir','final','lain'];
  let html = tabHariHTML + `<div class="tarikh-penuh">${formatTarikh(aktif)}</div>`;

  susunan.forEach(p => {
    if (!ikutPeringkat[p]) return;
    html += `<div class="peringkat-blok"><div class="peringkat-header">${labelPeringkat(p)}</div>`;

    if (p === 'kumpulan') {
      /* Kumpul ikut kumpulan */
      const byKump = {};
      ikutPeringkat[p].forEach(m => {
        if (!byKump[m.kumpulan]) byKump[m.kumpulan] = [];
        byKump[m.kumpulan].push(m);
      });
      Object.entries(byKump).sort().forEach(([kid, matches]) => {
        html += `
          <div class="kumpulan-blok">
            <div class="kumpulan-nama">🔵 Kumpulan ${kid}</div>
            ${renderJadualKedudukan(sukanId, kid)}
            <div class="kumpulan-perlawanan">
              ${matches.map(m => renderKadPerlawanan(m, isStaff)).join('')}
            </div>
          </div>
        `;
      });
    } else {
      html += ikutPeringkat[p].map(m => renderKadPerlawanan(m, isStaff)).join('');
    }

    html += `</div>`;
  });

  return html;
}


/* ================================================================
   FORMAT BIASA (Badminton, Bola Tampar, dll)
   Perlawanan ikut kategori & hari.
   ================================================================ */
function renderJadualBiasaFormat(sukanId, senarai, isStaff) {
  if (senarai.length === 0) {
    return `<div class="kosong-box"><div style="font-size:36px;margin-bottom:10px">📅</div>Tiada jadual lagi. ${isStaff ? 'Tambah perlawanan di atas.' : ''}</div>`;
  }

  const hari   = [...new Set(senarai.map(m => m.tarikh).filter(Boolean))].sort();
  const aktif  = hariAktif(sukanId);

  const tabHariHTML = hari.length > 1 ? `
    <div class="hari-tab-wrap">
      <div class="hari-tab-bar">
        ${hari.map(h => {
          const live = senarai.some(m => m.tarikh === h && m.status === 'sedang_berlangsung');
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

  const pHari = senarai
    .filter(m => m.tarikh === aktif)
    .sort((a,b) => a.masa.localeCompare(b.masa));

  if (pHari.length === 0) {
    return tabHariHTML + `<div class="kosong-box">Tiada perlawanan pada hari ini.</div>`;
  }

  /* Kumpul ikut kategori */
  const byKat = {};
  pHari.forEach(m => {
    const k = m.kategori || 'Umum';
    if (!byKat[k]) byKat[k] = [];
    byKat[k].push(m);
  });

  let html = tabHariHTML + `<div class="tarikh-penuh">${formatTarikh(aktif)}</div>`;

  Object.entries(byKat).forEach(([kat, matches]) => {
    html += `
      <div class="peringkat-blok">
        <div class="peringkat-header">${kat}</div>
        ${matches.map(m => renderKadPerlawanan(m, isStaff)).join('')}
      </div>
    `;
  });

  return html;
}


/* ================================================================
   FORMAT ROUND ROBIN
   Tunjuk:
   1. Jadual kedudukan keseluruhan (auto-kira dari keputusan)
   2. Tab hari + semua perlawanan ikut hari
   ================================================================ */
/* NOTE: renderJadualRoundRobinFormat is defined in roundrobin.js */


function renderJadualKedudukan(sukanId, kumpulanId) {
  const kumpulanData = (state.kumpulanSukan[sukanId] || []).find(k => k.id === kumpulanId);
  if (!kumpulanData) return '';

  const pasukan  = kumpulanData.pasukan;
  const stats    = {};
  pasukan.forEach(p => {
    stats[p] = { main:0, menang:0, seri:0, kalah:0, gol:0, masuk:0, pts:0 };
  });

  state.jadual
    .filter(m => m.sukanId === sukanId && m.kumpulan === kumpulanId && m.status === 'selesai')
    .forEach(m => {
      const r = m.scoreRumah, t = m.scoreTamu;
      if (!stats[m.rumah] || !stats[m.tamu]) return;
      stats[m.rumah].main++; stats[m.tamu].main++;
      stats[m.rumah].gol += r; stats[m.rumah].masuk += t;
      stats[m.tamu].gol  += t; stats[m.tamu].masuk  += r;
      if (r > t) { stats[m.rumah].menang++; stats[m.rumah].pts += 3; stats[m.tamu].kalah++; }
      else if (r < t) { stats[m.tamu].menang++; stats[m.tamu].pts += 3; stats[m.rumah].kalah++; }
      else { stats[m.rumah].seri++; stats[m.rumah].pts++; stats[m.tamu].seri++; stats[m.tamu].pts++; }
    });

  const kedudukan = pasukan
    .map(p => ({ nama:p, ...stats[p], beza: stats[p].gol - stats[p].masuk }))
    .sort((a,b) => b.pts - a.pts || b.beza - a.beza || b.gol - a.gol);

  const rows = kedudukan.map((p, i) => {
    const layak = i < 2;
    return `
      <tr class="${layak ? 'layak' : ''}">
        <td><span class="k-pos ${layak ? 'layak' : ''}">${i+1}</span></td>
        <td class="k-nama">
          ${p.nama}
          ${layak ? '<span class="layak-chip">Layak</span>' : ''}
        </td>
        <td>${p.main}</td>
        <td>${p.menang}</td>
        <td>${p.seri}</td>
        <td>${p.kalah}</td>
        <td>${p.gol}:${p.masuk}</td>
        <td class="${p.beza>0?'beza-pos':p.beza<0?'beza-neg':''}">${p.beza>0?'+'+p.beza:p.beza}</td>
        <td><strong style="color:var(--gold)">${p.pts}</strong></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="jadual-kumpulan-wrap">
      <table class="jadual-kumpulan">
        <thead>
          <tr>
            <th>#</th><th>Pasukan</th>
            <th title="Main">M</th>
            <th title="Menang" style="color:var(--green)">W</th>
            <th title="Seri">D</th>
            <th title="Kalah" style="color:#ff8a80">L</th>
            <th title="Gol">GF:GA</th>
            <th title="Beza Gol">GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="layak-nota">✅ Tempat 1 &amp; 2 layak ke peringkat seterusnya</div>
    </div>
  `;
}


/* ================================================================
   KAD PERLAWANAN
   ================================================================ */
function renderKadPerlawanan(p, isStaff) {
  const statusKls   = p.status === 'selesai' ? 'selesai'
                    : p.status === 'sedang_berlangsung' ? 'berlangsung'
                    : 'akan-datang';
  const statusLabel = p.status === 'selesai'           ? '✓ Selesai'
                    : p.status === 'sedang_berlangsung' ? '🔴 LIVE'
                    : '📅 Akan Datang';

  /* Countdown untuk perlawanan akan datang */
  let countdownHTML = '';
  if (p.status === 'akan_datang' && p.tarikh && p.masa) {
    const masaMula  = new Date(p.tarikh + 'T' + p.masa + ':00');
    const sekarang  = new Date();
    const beza      = masaMula - sekarang;
    if (beza > 0) {
      const jam    = Math.floor(beza / 3600000);
      const minit  = Math.floor((beza % 3600000) / 60000);
      const hari   = Math.floor(jam / 24);
      const jamBal = jam % 24;
      const teks   = hari > 0
        ? `${hari} hari ${jamBal} jam lagi`
        : jam > 0
          ? `${jam} jam ${minit} minit lagi`
          : `${minit} minit lagi`;
      countdownHTML = `<span class="countdown-chip">⏳ ${teks}</span>`;
    }
  }

  const rumahMenang = p.status === 'selesai' && p.scoreRumah > p.scoreTamu;
  const tamuMenang  = p.status === 'selesai' && p.scoreTamu  > p.scoreRumah;
  const selesai     = p.status === 'selesai' || p.status === 'sedang_berlangsung';

  const scoreHTML = selesai ? `
    <div class="score-paparan">
      <span class="score-num ${rumahMenang ? 'menang' : (p.status==='selesai' && p.scoreRumah !== p.scoreTamu ? 'kalah' : '')}">${p.scoreRumah}</span>
      <span class="score-dash">—</span>
      <span class="score-num ${tamuMenang  ? 'menang' : (p.status==='selesai' && p.scoreRumah !== p.scoreTamu ? 'kalah' : '')}">${p.scoreTamu}</span>
    </div>
  ` : `<div class="score-vs">${p.masa}</div>`;

  const staffBtns = isStaff ? `
    <div class="perlawanan-actions">
      ${p.status === 'sedang_berlangsung' ? `
        <button class="aksi-btn selesai-btn" onclick="cepatSelesai('${p.id}')">
          ✓ Tamat + Score
        </button>
      ` : ''}
      <button class="aksi-btn" onclick="editPerlawanan('${p.id}')">✏️ Edit</button>
      <button class="aksi-btn hapus" onclick="padamPerlawanan('${p.id}')">🗑</button>
    </div>
  ` : '';

  return `
    <div class="kad-perlawanan ${statusKls}">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        <span class="perlawanan-info">🕐 ${p.masa} &nbsp;·&nbsp; 📍 ${p.gelanggang}</span>
        ${p.label ? `<span class="label-badge">${p.label}</span>` : ''}
        ${countdownHTML}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${rumahMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${p.rumah}</div>
          <div class="pasukan-label">Tuan Rumah</div>
        </div>
        ${scoreHTML}
        <div class="pasukan-blok kanan ${tamuMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${p.tamu}</div>
          <div class="pasukan-label">Pasukan Tamu</div>
        </div>
      </div>
      ${staffBtns}
    </div>
  `;
}


/* ================================================================
   FORM EDIT / TAMBAH PERLAWANAN
   ================================================================ */
function renderFormEditPerlawanan() {
  const p        = state.jadual.find(x => x.id === state.editingPerlawanan);
  const isBaharu = !p || state.editingPerlawanan === 'BAHARU';
  const tabAktif = sukanTabAktif();

  const d = p || {
    id:'', sukanId: tabAktif, kategori:'', peringkat:'kumpulan', kumpulan:'A',
    label:'', rumah:'', tamu:'', tarikh:'', masa:'', gelanggang:'',
    status:'akan_datang', scoreRumah:0, scoreTamu:0,
  };

  const sukanKini = state.sukan.find(s => s.id === d.sukanId) ||
                    state.sukan.find(s => s.id === tabAktif);

  const opsSukan = state.sukan
    .filter(s => ( state.formatSukan[s.id] || 'biasa') !== 'individu')
    .map(s => `<option value="${s.id}" ${d.sukanId===s.id?'selected':''}>${s.icon||'🏅'} ${s.nama}</option>`)
    .join('');

  const opsAcara = sukanKini
    ? ['', ...sukanKini.acara.map(a => a.nama)]
        .map(n => `<option value="${n}" ${n===d.kategori?'selected':''}>${n||'-- Pilih Acara --'}</option>`).join('')
    : '';

  const opsPasukan = (pilihan) =>
    ['', ...state.pasukan].map(n =>
      `<option value="${n}" ${n===pilihan?'selected':''}>${n||'-- Pilih Pasukan --'}</option>`
    ).join('');

  const formatKini = (state.formatSukan[d.sukanId] || state.formatSukan[tabAktif] || 'biasa');
  const adaKumpulan = formatKini === 'kumpulan';

  const opsKumpulan = (state.kumpulanSukan[d.sukanId] || state.kumpulanSukan[tabAktif] || [])
    .map(k => `<option value="${k.id}" ${d.kumpulan===k.id?'selected':''}>Kumpulan ${k.id}</option>`)
    .join('');

  const opsPeringkat = [
    ['kumpulan','Peringkat Kumpulan'],
    ['kumpulan_utama','Perlawanan Kumpulan Utama'],
    ['suku_akhir','Suku Akhir'],
    ['separuh_akhir','Separuh Akhir'],
    ['separuh','Separuh Akhir'],
    ['tempat_ketiga','Tempat Ke-3'],
    ['akhir','Final'],
    ['final','Final'],
  ].map(([v,l]) => `<option value="${v}" ${d.peringkat===v?'selected':''}>${l}</option>`).join('');

  return `
    <button class="back-btn" onclick="batalEditPerlawanan()">← Balik</button>
    <div class="section-title">${isBaharu ? '+ Tambah Perlawanan Baru' : '✏️ Edit / Update Score'}</div>

    <div class="form-perlawanan">

      <!-- Sukan & Acara -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">Sukan</label>
          <select id="fp-sukan" class="podium-select" style="padding:10px 12px;font-size:14px"
            onchange="kemaskiniFormSukan(this.value)">
            ${opsSukan}
          </select>
        </div>
        <div class="form-group">
          <label class="field-label">Acara / Kategori</label>
          <select id="fp-kategori" class="podium-select" style="padding:10px 12px;font-size:14px"
            id="fp-kategori">
            ${opsAcara}
          </select>
        </div>
      </div>

      <!-- Peringkat & Kumpulan -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">Peringkat</label>
          <select id="fp-peringkat" class="podium-select" style="padding:10px 12px;font-size:14px"
            onchange="togolKumpulanField(this.value)">
            ${opsPeringkat}
          </select>
        </div>
        <div class="form-group" id="fp-kumpulan-group"
          style="display:${adaKumpulan && d.peringkat==='kumpulan' ? 'flex':'none'};flex-direction:column;gap:6px">
          <label class="field-label">Kumpulan</label>
          <select id="fp-kumpulan" class="podium-select" style="padding:10px 12px;font-size:14px">
            ${opsKumpulan}
          </select>
        </div>
        <div class="form-group">
          <label class="field-label">Label (pilihan)</label>
          <input type="text" id="fp-label" class="field-input"
            style="padding:9px 12px;font-size:14px"
            placeholder="Contoh: Suku Akhir 1" value="${d.label||''}"/>
        </div>
      </div>

      <!-- Pasukan -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">🏠 Tuan Rumah</label>
          <select id="fp-rumah" class="podium-select" style="padding:10px 12px;font-size:14px">
            ${opsPasukan(d.rumah)}
          </select>
        </div>
        <div class="form-group">
          <label class="field-label">✈️ Pasukan Tamu</label>
          <select id="fp-tamu" class="podium-select" style="padding:10px 12px;font-size:14px">
            ${opsPasukan(d.tamu)}
          </select>
        </div>
      </div>

      <!-- Tarikh, Masa, Gelanggang -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">📅 Tarikh</label>
          <input type="date" id="fp-tarikh" class="field-input"
            style="padding:9px 12px;font-size:14px" value="${d.tarikh}"/>
        </div>
        <div class="form-group">
          <label class="field-label">🕐 Masa</label>
          <input type="time" id="fp-masa" class="field-input"
            style="padding:9px 12px;font-size:14px" value="${d.masa}"/>
        </div>
        <div class="form-group">
          <label class="field-label">📍 Gelanggang</label>
          <input type="text" id="fp-gelanggang" class="field-input"
            style="padding:9px 12px;font-size:14px"
            placeholder="Contoh: Padang A" value="${d.gelanggang}"/>
        </div>
      </div>

      <!-- Status -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">📊 Status</label>
          <select id="fp-status" class="podium-select" style="padding:10px 12px;font-size:14px"
            onchange="togolScoreSection(this.value)">
            <option value="akan_datang"       ${d.status==='akan_datang'       ?'selected':''}>📅 Akan Datang</option>
            <option value="sedang_berlangsung" ${d.status==='sedang_berlangsung'?'selected':''}>🔴 Sedang Berlangsung</option>
            <option value="selesai"            ${d.status==='selesai'           ?'selected':''}>✓ Selesai</option>
          </select>
        </div>
      </div>

      <!-- Score -->
      <div id="score-section" style="display:${d.status!=='akan_datang'?'block':'none'}">
        <div class="score-edit-box">
          <div class="score-edit-label">⚽ Masukkan Score</div>
          <div class="score-edit-row">
            <div class="score-edit-pasukan" id="label-rumah">${d.rumah||'Tuan Rumah'}</div>
            <input type="number" id="fp-score-rumah" class="score-big-input"
              min="0" value="${d.scoreRumah}" placeholder="0" oninput="previewScore()"/>
            <div class="score-edit-dash">—</div>
            <input type="number" id="fp-score-tamu" class="score-big-input"
              min="0" value="${d.scoreTamu}" placeholder="0" oninput="previewScore()"/>
            <div class="score-edit-pasukan" id="label-tamu">${d.tamu||'Pasukan Tamu'}</div>
          </div>
          <div id="score-preview" class="score-preview-label">
            ${previewHasil(d.scoreRumah, d.scoreTamu, d.rumah, d.tamu, d.status)}
          </div>
        </div>
      </div>

      <input type="hidden" id="fp-id" value="${d.id}"/>

      <div id="fp-error"
        style="display:none;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);
        color:#ff8a80;font-size:13px;padding:9px 12px;border-radius:7px;margin-bottom:10px">
      </div>

      <div class="btn-group" style="margin-top:8px">
        <button class="cancel-btn" onclick="batalEditPerlawanan()">Batal</button>
        <button class="save-btn" style="padding:10px 28px;font-size:15px"
          onclick="simpanPerlawanan()">
          💾 ${isBaharu ? 'Tambah Perlawanan' : 'Simpan'}
        </button>
      </div>

    </div>
  `;
}


/* ================================================================
   FUNGSI NAVIGASI JADUAL
   ================================================================ */

function pilihJadualSukan(sukanId) {
  state.jadualSukanTab    = sukanId;
  state.editingPerlawanan = null;
  semakAutoStatus(); /* ← semak setiap kali buka sukan */
  render();
}

function balikGridJadual() {
  state.jadualSukanTab    = null;
  state.editingPerlawanan = null;
  render();
}

function pilihHari(tarikh, sukanId) {
  if (!state.selectedHari) state.selectedHari = {};
  state.selectedHari[sukanId] = tarikh;
  render();
}

function hariAktif(sukanId) {
  const hari = [...new Set(
    state.jadual.filter(m => m.sukanId === sukanId).map(m => m.tarikh).filter(Boolean)
  )].sort();
  const saved = state.selectedHari?.[sukanId];
  return (saved && hari.includes(saved)) ? saved : hari[0] || null;
}

function bukaFormTambah() {
  state.editingPerlawanan = 'BAHARU';
  render();
}

function editPerlawanan(id) {
  state.editingPerlawanan = id;
  render();
}

function batalEditPerlawanan() {
  state.editingPerlawanan = null;
  render();
}

function togolKumpulanField(val) {
  const el = document.getElementById('fp-kumpulan-group');
  if (el) el.style.display = val === 'kumpulan' ? 'flex' : 'none';
}

function togolScoreSection(val) {
  const el = document.getElementById('score-section');
  if (el) el.style.display = val !== 'akan_datang' ? 'block' : 'none';
}

/* Update senarai acara bila tukar sukan dalam form */
function kemaskiniFormSukan(sukanId) {
  const sukan = state.sukan.find(s => s.id === sukanId);
  if (!sukan) return;
  const sel = document.getElementById('fp-kategori');
  if (sel) {
    sel.innerHTML = ['', ...sukan.acara.map(a => a.nama)]
      .map(n => `<option value="${n}">${n||'-- Pilih Acara --'}</option>`).join('');
  }
  /* Kemas kini kumpulan */
  const kSel = document.getElementById('fp-kumpulan');
  const kGrp = document.getElementById('fp-kumpulan-group');
  const fmt  = state.formatSukan[sukanId] || 'biasa';
  if (kGrp) kGrp.style.display = 'none';
  if (kSel && state.kumpulanSukan[sukanId]) {
    kSel.innerHTML = (state.kumpulanSukan[sukanId] || [])
      .map(k => `<option value="${k.id}">Kumpulan ${k.id}</option>`).join('');
  }
}

function previewHasil(sR, sT, nR, nT, status) {
  if (status === 'akan_datang') return '';
  sR = parseInt(sR)||0; sT = parseInt(sT)||0;
  if (sR > sT) return `<span style="color:var(--green)">✓ ${nR||'Tuan Rumah'} menang</span>`;
  if (sT > sR) return `<span style="color:var(--green)">✓ ${nT||'Pasukan Tamu'} menang</span>`;
  return `<span style="color:var(--muted)">— Seri</span>`;
}

function previewScore() {
  const sR   = document.getElementById('fp-score-rumah')?.value||0;
  const sT   = document.getElementById('fp-score-tamu')?.value||0;
  const nR   = document.getElementById('fp-rumah')?.value||'Tuan Rumah';
  const nT   = document.getElementById('fp-tamu')?.value||'Pasukan Tamu';
  const stat = document.getElementById('fp-status')?.value||'';
  const el   = document.getElementById('score-preview');
  if (el) el.innerHTML = previewHasil(sR, sT, nR, nT, stat);
  const lR = document.getElementById('label-rumah'); if (lR && nR) lR.textContent = nR;
  const lT = document.getElementById('label-tamu');  if (lT && nT) lT.textContent = nT;
}


/* ================================================================
   SIMPAN / PADAM
   ================================================================ */
function simpanPerlawanan() {
  const errEl    = document.getElementById('fp-error');
  const id       = document.getElementById('fp-id')?.value?.trim();
  const sukanId  = document.getElementById('fp-sukan')?.value;
  const kategori = document.getElementById('fp-kategori')?.value?.trim();
  const peringkat= document.getElementById('fp-peringkat')?.value;
  const kumpulan = document.getElementById('fp-kumpulan')?.value || null;
  const label    = document.getElementById('fp-label')?.value?.trim()||'';
  const rumah    = document.getElementById('fp-rumah')?.value?.trim();
  const tamu     = document.getElementById('fp-tamu')?.value?.trim();
  const tarikh   = document.getElementById('fp-tarikh')?.value?.trim();
  const masa     = document.getElementById('fp-masa')?.value?.trim();
  const gelang   = document.getElementById('fp-gelanggang')?.value?.trim();
  const status   = document.getElementById('fp-status')?.value;
  const sRumah   = parseInt(document.getElementById('fp-score-rumah')?.value)||0;
  const sTamu    = parseInt(document.getElementById('fp-score-tamu')?.value)||0;

  if (!rumah)        { tunjukErrFP('Sila pilih pasukan tuan rumah.'); return; }
  if (!tamu)         { tunjukErrFP('Sila pilih pasukan tamu.'); return; }
  if (rumah === tamu){ tunjukErrFP('Pasukan tuan rumah dan tamu tidak boleh sama.'); return; }
  if (!tarikh)       { tunjukErrFP('Sila pilih tarikh perlawanan.'); return; }
  if (!masa)         { tunjukErrFP('Sila masukkan masa perlawanan.'); return; }

  errEl.style.display = 'none';
  const isBaharu = state.editingPerlawanan === 'BAHARU';
  const newId    = isBaharu ? 'p_' + Date.now() : id;

  const data = {
    id: newId, sukanId, kategori,
    peringkat, kumpulan: peringkat === 'kumpulan' ? kumpulan : null,
    label, rumah, tamu, tarikh,
    masa, gelanggang: gelang||'TBA',
    status, scoreRumah: sRumah, scoreTamu: sTamu,
  };

  if (isBaharu) {
    state.jadual.push(data);
    if (!state.selectedHari) state.selectedHari = {};
    state.selectedHari[sukanId] = tarikh;
    state.jadualSukanTab = sukanId;
  } else {
    const idx = state.jadual.findIndex(m => m.id === id);
    if (idx !== -1) state.jadual[idx] = data;
  }

  state.editingPerlawanan = null;
  simpanData();
  semakAutoStatus(); /* ← semak terus, jangan tunggu 30 saat */
  render();
}

function padamPerlawanan(id) {
  const p = state.jadual.find(x => x.id === id);
  if (!confirm('Padam perlawanan: ' + (p?.rumah||'') + ' vs ' + (p?.tamu||'') + '?')) return;
  state.jadual = state.jadual.filter(x => x.id !== id);
  simpanData();
  render();
}

function tunjukErrFP(msg) {
  const el = document.getElementById('fp-error');
  if (el) { el.textContent = '⚠️ ' + msg; el.style.display = 'block'; }
}


/* ================================================================
   HELPERS
   ================================================================ */
function formatTarikh(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('ms-MY',
    { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

function formatTarikhPendek(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('ms-MY',
    { weekday:'short', day:'numeric', month:'short' });
}

function labelPeringkat(p) {
  return {
    kumpulan:       'Peringkat Kumpulan',
    kumpulan_utama: 'Perlawanan Utama',
    suku_akhir:     'Suku Akhir',
    separuh_akhir:  'Separuh Akhir',
    separuh:        'Separuh Akhir',
    tempat_ketiga:  'Tempat Ke-3',
    akhir:          '🏆 Final',
    final:          '🏆 Final',
  }[p] || p;
}


/* ================================================================
   AUTO-STATUS ENGINE
   ================================================================
   Sistem ini semak secara automatik setiap 30 saat.
   
   LOGIK:
   akan_datang       → sedang_berlangsung  (auto, masa bermula)
   sedang_berlangsung → selesai            (MANUAL oleh staff)

   DURASI PERLAWANAN (minit) — tukar ikut keperluan:
   Bola Sepak  = 90 minit
   Futsal      = 40 minit
   Badminton   = 60 minit (anggaran)
   Bola Tampar = 90 minit (anggaran)
   Lain-lain   = 60 minit
   ================================================================ */

const DURASI_SUKAN = {
  s1: 0,    // Olahraga — tiada perlawanan
  s2: 60,   // Badminton
  s3: 90,   // Bola Sepak
  s4: 40,   // Futsal
  s5: 90,   // Bola Tampar
  s6: 0,    // Renang — tiada perlawanan
  /* Tambah sukan lain:
  sX: 60,
  */
};

/* Semak dan kemaskini status perlawanan */
function semakAutoStatus() {
  const sekarang = new Date();
  let adaPerubahan = false;

  state.jadual.forEach(m => {
    /* Jangan sentuh perlawanan yang sudah selesai */
    if (m.status === 'selesai') return;
    if (!m.tarikh || !m.masa)   return;

    const masaMula   = new Date(m.tarikh + 'T' + m.masa + ':00');
    const durasi     = DURASI_SUKAN[m.sukanId] ?? 60;
    const masaTamat  = new Date(masaMula.getTime() + durasi * 60 * 1000);

    if (sekarang >= masaMula && m.status === 'akan_datang') {
      /* Masa dah tiba → tukar ke Sedang Berlangsung */
      m.status = 'sedang_berlangsung';
      adaPerubahan = true;
    }
    /* Nota: tamat automatik TIDAK dilakukan —
       staff perlu sahkan score sebelum tandakan Selesai */
  });

  if (adaPerubahan) {
    simpanData();
    render();
  }
}

/* Butang cepat "Tamat + Score" untuk perlawanan LIVE */
function cepatSelesai(id) {
  state.editingPerlawanan = id;
  /* Pre-set status ke selesai dalam form */
  state._presetSelesai = true;
  render();
  /* Set dropdown status ke selesai dan tunjuk score */
  setTimeout(() => {
    const sel = document.getElementById('fp-status');
    if (sel) {
      sel.value = 'selesai';
      togolScoreSection('selesai');
    }
    state._presetSelesai = false;
    document.getElementById('fp-score-rumah')?.focus();
  }, 100);
}

/* Pemasa — jalankan semak setiap 10 saat */
function mulaAutoStatus() {
  semakAutoStatus();
  semakAutoStatusRR(); /* ← semak perlawanan round robin juga */
  setInterval(() => { semakAutoStatus(); semakAutoStatusRR(); }, 10000);
=======
/* ================================================================
   jadual.js — JADUAL PERLAWANAN SEMUA SUKAN
   ================================================================

   STRUKTUR:
   - Tab sukan di atas (Bola Sepak, Futsal, Badminton, dll)
   - Tab hari di bawah tab sukan
   - Bola Sepak & Futsal: format kumpulan + knockout
   - Badminton & Bola Tampar: format jadual biasa

   UNTUK TAMBAH PERLAWANAN:
   1. Login sebagai staff
   2. Klik tab sukan yang dikehendaki
   3. Klik "+ Tambah Perlawanan"

   UNTUK EDIT KOD:
   - Tambah/ubah kumpulan → KUMPULAN_SUKAN
   - Tambah/ubah perlawanan asal → JADUAL_ASAL
   ================================================================ */


/* ----------------------------------------------------------------
   FORMAT SETIAP SUKAN
   'kumpulan'  → ada peringkat kumpulan + knockout (bola sepak gaya)
   'biasa'     → jadual perlawanan biasa tanpa kumpulan
   'individu'  → tiada jadual perlawanan (olahraga, renang)
   ---------------------------------------------------------------- */
const FORMAT_SUKAN = {
  s1: 'individu',   // Olahraga
  s2: 'biasa',      // Badminton
  s3: 'kumpulan',   // Bola Sepak
  s4: 'kumpulan',   // Futsal
  s5: 'biasa',      // Bola Tampar
  s6: 'individu',   // Renang
};


/* ----------------------------------------------------------------
   KUMPULAN UNTUK SUKAN BERKUMPULAN
   Setiap sukan ada senarai kumpulan sendiri.
   ---------------------------------------------------------------- */
const KUMPULAN_SUKAN = {

  /* Bola Sepak */
  s3: [
    {
      id: 'A', nama: 'Kumpulan A',
      pasukan: ["MRSM Kepala Batas", "MRSM Balik Pulau", "IKBN Darul Aman"],
    },
    {
      id: 'B', nama: 'Kumpulan B',
      pasukan: ["MRSM Kubang Pasu", "IKM Alor Setar", "ADTEC Kedah"],
    },
  ],

  /* Futsal */
  s4: [
    {
      id: 'A', nama: 'Kumpulan A',
      pasukan: ["MRSM Kepala Batas", "MRSM Kubang Pasu", "ADTEC Kedah"],
    },
    {
      id: 'B', nama: 'Kumpulan B',
      pasukan: ["MRSM Balik Pulau", "IKM Alor Setar", "MRSM Taiping"],
    },
  ],

  /* Tambah sukan kumpulan lain:
  sX: [
    { id: 'A', nama: 'Kumpulan A', pasukan: ["Pasukan 1","Pasukan 2"] },
  ],
  */
};


/* ----------------------------------------------------------------
   DATA JADUAL PERLAWANAN
   sukanId   : id sukan dari data.js (s1, s2, s3...)
   kategori  : nama acara (contoh: "Bola Sepak Lelaki")
   peringkat : 'kumpulan' | 'suku_akhir' | 'separuh_akhir' |
               'tempat_ketiga' | 'akhir' | 'kumpulan_utama' | 'separuh' | 'final'
   kumpulan  : 'A' | 'B' | null
   ---------------------------------------------------------------- */
const JADUAL_ASAL = [

  /* ══════════════════════════════════════
     BOLA SEPAK LELAKI (s3)
  ══════════════════════════════════════ */

  /* Kumpulan A */
  { id:"bs_a1", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_a2", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"IKBN Darul Aman",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_a3", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Balik Pulau", tamu:"IKBN Darul Aman",
    tarikh:"2025-08-10", masa:"14:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Kumpulan B */
  { id:"bs_b1", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Kubang Pasu", tamu:"IKM Alor Setar",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_b2", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Kubang Pasu", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_b3", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"IKM Alor Setar", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"14:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Suku Akhir */
  { id:"bs_sf1", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"suku_akhir", kumpulan:null,
    label:"Suku Akhir 1", rumah:"1A", tamu:"2B",
    tarikh:"2025-08-11", masa:"10:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bs_sf2", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"suku_akhir", kumpulan:null,
    label:"Suku Akhir 2", rumah:"1B", tamu:"2A",
    tarikh:"2025-08-11", masa:"14:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Separuh Akhir */
  { id:"bs_semi", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"separuh_akhir", kumpulan:null,
    label:"Separuh Akhir", rumah:"Menang SF1", tamu:"Menang SF2",
    tarikh:"2025-08-12", masa:"10:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Tempat Ketiga */
  { id:"bs_3rd", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"tempat_ketiga", kumpulan:null,
    label:"Tempat Ke-3", rumah:"Kalah Semi 1", tamu:"Kalah Semi 2",
    tarikh:"2025-08-12", masa:"14:00", gelanggang:"Padang B",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Final */
  { id:"bs_final", sukanId:"s3", kategori:"Bola Sepak Lelaki", peringkat:"akhir", kumpulan:null,
    label:"FINAL", rumah:"Menang Semi", tamu:"Naib Menang Semi",
    tarikh:"2025-08-13", masa:"15:00", gelanggang:"Padang A",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },


  /* ══════════════════════════════════════
     FUTSAL (s4)
  ══════════════════════════════════════ */

  /* Futsal Lelaki — Kumpulan A */
  { id:"fl_a1", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"MRSM Kubang Pasu",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_a2", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kepala Batas", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_a3", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"A",
    label:"", rumah:"MRSM Kubang Pasu", tamu:"ADTEC Kedah",
    tarikh:"2025-08-10", masa:"13:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Futsal Lelaki — Kumpulan B */
  { id:"fl_b1", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Balik Pulau", tamu:"IKM Alor Setar",
    tarikh:"2025-08-10", masa:"09:00", gelanggang:"Gelanggang Futsal 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_b2", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"MRSM Balik Pulau", tamu:"MRSM Taiping",
    tarikh:"2025-08-10", masa:"11:00", gelanggang:"Gelanggang Futsal 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fl_b3", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"kumpulan", kumpulan:"B",
    label:"", rumah:"IKM Alor Setar", tamu:"MRSM Taiping",
    tarikh:"2025-08-10", masa:"13:00", gelanggang:"Gelanggang Futsal 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Futsal Lelaki — Final */
  { id:"fl_final", sukanId:"s4", kategori:"Futsal Lelaki", peringkat:"akhir", kumpulan:null,
    label:"FINAL", rumah:"Menang Kumpulan A", tamu:"Menang Kumpulan B",
    tarikh:"2025-08-11", masa:"15:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  /* Futsal Wanita */
  { id:"fw_1", sukanId:"s4", kategori:"Futsal Wanita", peringkat:"kumpulan_utama", kumpulan:null,
    label:"Perlawanan 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-10", masa:"10:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fw_2", sukanId:"s4", kategori:"Futsal Wanita", peringkat:"kumpulan_utama", kumpulan:null,
    label:"Perlawanan 2", rumah:"MRSM Kubang Pasu", tamu:"IKM Alor Setar",
    tarikh:"2025-08-10", masa:"12:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"fw_final", sukanId:"s4", kategori:"Futsal Wanita", peringkat:"akhir", kumpulan:null,
    label:"FINAL", rumah:"Terbaik Wanita 1", tamu:"Terbaik Wanita 2",
    tarikh:"2025-08-11", masa:"16:00", gelanggang:"Gelanggang Futsal",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },


  /* ══════════════════════════════════════
     BADMINTON (s2)
  ══════════════════════════════════════ */

  { id:"bd_1", sukanId:"s2", kategori:"Beregu Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Kubang Pasu",
    tarikh:"2025-08-11", masa:"09:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_2", sukanId:"s2", kategori:"Beregu Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 2", rumah:"IKM Alor Setar", tamu:"ADTEC Kedah",
    tarikh:"2025-08-11", masa:"11:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_final", sukanId:"s2", kategori:"Beregu Lelaki", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"10:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  { id:"bd_w1", sukanId:"s2", kategori:"Beregu Wanita", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-11", masa:"09:00", gelanggang:"Dewan Badminton 2",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_wfinal", sukanId:"s2", kategori:"Beregu Wanita", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"14:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  { id:"bd_c1", sukanId:"s2", kategori:"Campuran", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir", rumah:"MRSM Kepala Batas", tamu:"IKM Alor Setar",
    tarikh:"2025-08-11", masa:"14:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bd_cfinal", sukanId:"s2", kategori:"Campuran", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"16:00", gelanggang:"Dewan Badminton",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },


  /* ══════════════════════════════════════
     BOLA TAMPAR (s5)
  ══════════════════════════════════════ */

  { id:"bt_l1", sukanId:"s5", kategori:"Bola Tampar Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Kubang Pasu",
    tarikh:"2025-08-11", masa:"09:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bt_l2", sukanId:"s5", kategori:"Bola Tampar Lelaki", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 2", rumah:"IKM Alor Setar", tamu:"ADTEC Kedah",
    tarikh:"2025-08-11", masa:"11:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bt_lfinal", sukanId:"s5", kategori:"Bola Tampar Lelaki", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"10:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

  { id:"bt_w1", sukanId:"s5", kategori:"Bola Tampar Wanita", peringkat:"separuh", kumpulan:null,
    label:"Separuh Akhir 1", rumah:"MRSM Kepala Batas", tamu:"MRSM Balik Pulau",
    tarikh:"2025-08-11", masa:"13:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },
  { id:"bt_wfinal", sukanId:"s5", kategori:"Bola Tampar Wanita", peringkat:"final", kumpulan:null,
    label:"FINAL", rumah:"Menang SA1", tamu:"Menang SA2",
    tarikh:"2025-08-12", masa:"15:00", gelanggang:"Gelanggang Tampar",
    status:"akan_datang", scoreRumah:0, scoreTamu:0 },

];


/* ================================================================
   SENARAI SUKAN YANG ADA JADUAL (bukan individu)
   ================================================================ */
function sukanAdaJadual() {
  return state.sukan.filter(s => (state.formatSukan[s.id] || 'biasa') !== 'individu');
}

function sukanTabAktif() {
  const senarai = sukanAdaJadual();
  if (!state.jadualSukanTab || !senarai.find(s => s.id === state.jadualSukanTab)) {
    return senarai[0]?.id || null;
  }
  return state.jadualSukanTab;
}


/* ================================================================
   RENDER UTAMA JADUAL
   ── Tunjuk grid kad sukan dulu
   ── Bila klik sukan → tunjuk jadual sukan tersebut
   ================================================================ */
function renderJadual() {
  if (state.editingPerlawanan) return renderFormEditPerlawanan();

  /* Kalau sukan dah dipilih → tunjuk jadual sukan */
  if (state.jadualSukanTab) return renderJadualSukan();

  /* ── Grid kad sukan ── */
  const senarai = sukanAdaJadual();
  const isStaff = !!state.staffLogin;

  if (senarai.length === 0) {
    return `<div class="kosong-box"><div style="font-size:40px;margin-bottom:12px">🏅</div>Tiada sukan dengan jadual perlawanan.</div>`;
  }

  const kards = senarai.map(s => {
    const fmt = state.formatSukan[s.id] || 'biasa';

    let selesai = 0, berlangsung = 0, total = 0;
    if (fmt === 'round_robin') {
      const prl = state.roundRobin[s.id]?.perlawanan || [];
      selesai     = prl.filter(m => m.status === 'selesai').length;
      berlangsung = prl.filter(m => m.status === 'sedang_berlangsung').length;
      total       = prl.length;
    } else {
      const pSukan = state.jadual.filter(m => m.sukanId === s.id);
      selesai      = pSukan.filter(m => m.status === 'selesai').length;
      berlangsung  = pSukan.filter(m => m.status === 'sedang_berlangsung').length;
      total        = pSukan.length;
    }

    const formatLabel = fmt === 'kumpulan'    ? '🔵 Format Kumpulan'
                      : fmt === 'round_robin' ? '🔄 Round Robin'
                      : '🎯 Perlawanan';

    return `
      <div class="jadual-sukan-kad" onclick="pilihJadualSukan('${s.id}')">
        ${berlangsung > 0 ? '<span class="done-badge" style="background:var(--red)">🔴 LIVE</span>' : ''}
        ${selesai === total && total > 0 ? '<span class="done-badge">✓ Siap</span>' : ''}

        <div class="jadual-sukan-icon">${s.icon || '🏅'}</div>
        <div class="jadual-sukan-nama">${s.nama}</div>
        <div class="jadual-sukan-format">${formatLabel}</div>

        <div class="jadual-sukan-stats">
          <span class="${berlangsung > 0 ? 'live-stat' : 'muted-stat'}">
            ${berlangsung > 0 ? '🔴 ' + berlangsung + ' Live' : ''}
          </span>
          <span class="muted-stat">
            ${total > 0 ? selesai + '/' + total + ' selesai' : 'Belum ada jadual'}
          </span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="section-title">📅 Jadual Perlawanan</div>
    <div class="jadual-sukan-grid">${kards}</div>
  `;
}


/* ================================================================
   RENDER JADUAL UNTUK SATU SUKAN (selepas klik kad)
   ================================================================ */
function renderJadualSukan() {
  const isStaff   = !!state.staffLogin;
  const sukanId   = state.jadualSukanTab;
  const sukanKini = state.sukan.find(s => s.id === sukanId);
  if (!sukanKini) { state.jadualSukanTab = null; return renderJadual(); }

  const format          = state.formatSukan[sukanId] || 'biasa';
  const perlawananSukan = state.jadual.filter(m => m.sukanId === sukanId);
  const selesai         = perlawananSukan.filter(m => m.status === 'selesai').length;
  const berlangsung     = perlawananSukan.filter(m => m.status === 'sedang_berlangsung').length;
  const akanDatang      = perlawananSukan.filter(m => m.status === 'akan_datang').length;

  /* Stats bar */
  const statsHTML = `
    <div class="jadual-stats">
      <div class="jstat-card green">
        <div class="jstat-num">${selesai}</div>
        <div class="jstat-lbl">Selesai</div>
      </div>
      <div class="jstat-card gold">
        <div class="jstat-num">${berlangsung}</div>
        <div class="jstat-lbl">Live</div>
      </div>
      <div class="jstat-card muted">
        <div class="jstat-num">${akanDatang}</div>
        <div class="jstat-lbl">Akan Datang</div>
      </div>
    </div>
  `;

  /* Butang tambah — sembunyi untuk round robin (guna Urus Round Robin) */
  const tambahBtn = isStaff && format !== 'round_robin' ? `
    <div style="margin-bottom:16px">
      <button class="tambah-perlawanan-btn" onclick="bukaFormTambah()">
        + Tambah Perlawanan
      </button>
    </div>
  ` : isStaff && format === 'round_robin' ? `
    <div style="margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <button class="tambah-perlawanan-btn" style="background:var(--card);color:var(--green);border:1.5px solid rgba(46,204,113,0.5)"
        onclick="setTab('tetapan');state.subTab='round_robin';state.rrSukanTab='${sukanId}';render()">
        🔄 Urus Round Robin →
      </button>
      <span style="font-size:12px;color:var(--muted)">
        Jana jadual & tetapkan tarikh/score dalam Tetapan
      </span>
    </div>
  ` : '';

  /* Kandungan ikut format */
  let kandungan = '';
  if (format === 'kumpulan')       kandungan = renderJadualKumpulanFormat(sukanId, perlawananSukan, isStaff);
  else if (format === 'round_robin') kandungan = renderJadualRoundRobinFormat(sukanId, perlawananSukan, isStaff);
  else                               kandungan = renderJadualBiasaFormat(sukanId, perlawananSukan, isStaff);

  return `
    <button class="back-btn" onclick="balikGridJadual()">← Semua Sukan</button>
    <div class="section-title">${sukanKini.icon || '🏅'} ${sukanKini.nama}</div>
    ${statsHTML}
    ${tambahBtn}
    ${kandungan}
  `;
}


/* ================================================================
   FORMAT KUMPULAN (Bola Sepak, Futsal, dll)
   Perlawanan dipisah ikut hari dengan tab hari.
   ================================================================ */
function renderJadualKumpulanFormat(sukanId, senarai, isStaff) {
  const kumpulan = state.kumpulanSukan[sukanId] || [];
  const hari     = [...new Set(senarai.map(m => m.tarikh).filter(Boolean))].sort();
  const aktif    = hariAktif(sukanId);

  const tabHariHTML = hari.length > 1 ? `
    <div class="hari-tab-wrap">
      <div class="hari-tab-bar">
        ${hari.map(h => {
          const live = senarai.some(m => m.tarikh === h && m.status === 'sedang_berlangsung');
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

  /* Perlawanan hari ini */
  const pHari = senarai
    .filter(m => m.tarikh === aktif)
    .sort((a,b) => a.masa.localeCompare(b.masa));

  if (!aktif || pHari.length === 0) {
    return tabHariHTML + (senarai.length === 0
      ? `<div class="kosong-box"><div style="font-size:36px;margin-bottom:10px">📅</div>Tiada jadual lagi. ${isStaff ? 'Tambah perlawanan di atas.' : ''}</div>`
      : `<div class="kosong-box">Tiada perlawanan pada hari ini.</div>`);
  }

  /* Asingkan ikut peringkat */
  const ikutPeringkat = {};
  pHari.forEach(m => {
    const k = m.peringkat || 'lain';
    if (!ikutPeringkat[k]) ikutPeringkat[k] = [];
    ikutPeringkat[k].push(m);
  });

  const susunan = ['kumpulan','kumpulan_utama','suku_akhir','separuh_akhir','separuh','tempat_ketiga','akhir','final','lain'];
  let html = tabHariHTML + `<div class="tarikh-penuh">${formatTarikh(aktif)}</div>`;

  susunan.forEach(p => {
    if (!ikutPeringkat[p]) return;
    html += `<div class="peringkat-blok"><div class="peringkat-header">${labelPeringkat(p)}</div>`;

    if (p === 'kumpulan') {
      /* Kumpul ikut kumpulan */
      const byKump = {};
      ikutPeringkat[p].forEach(m => {
        if (!byKump[m.kumpulan]) byKump[m.kumpulan] = [];
        byKump[m.kumpulan].push(m);
      });
      Object.entries(byKump).sort().forEach(([kid, matches]) => {
        html += `
          <div class="kumpulan-blok">
            <div class="kumpulan-nama">🔵 Kumpulan ${kid}</div>
            ${renderJadualKedudukan(sukanId, kid)}
            <div class="kumpulan-perlawanan">
              ${matches.map(m => renderKadPerlawanan(m, isStaff)).join('')}
            </div>
          </div>
        `;
      });
    } else {
      html += ikutPeringkat[p].map(m => renderKadPerlawanan(m, isStaff)).join('');
    }

    html += `</div>`;
  });

  return html;
}


/* ================================================================
   FORMAT BIASA (Badminton, Bola Tampar, dll)
   Perlawanan ikut kategori & hari.
   ================================================================ */
function renderJadualBiasaFormat(sukanId, senarai, isStaff) {
  if (senarai.length === 0) {
    return `<div class="kosong-box"><div style="font-size:36px;margin-bottom:10px">📅</div>Tiada jadual lagi. ${isStaff ? 'Tambah perlawanan di atas.' : ''}</div>`;
  }

  const hari   = [...new Set(senarai.map(m => m.tarikh).filter(Boolean))].sort();
  const aktif  = hariAktif(sukanId);

  const tabHariHTML = hari.length > 1 ? `
    <div class="hari-tab-wrap">
      <div class="hari-tab-bar">
        ${hari.map(h => {
          const live = senarai.some(m => m.tarikh === h && m.status === 'sedang_berlangsung');
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

  const pHari = senarai
    .filter(m => m.tarikh === aktif)
    .sort((a,b) => a.masa.localeCompare(b.masa));

  if (pHari.length === 0) {
    return tabHariHTML + `<div class="kosong-box">Tiada perlawanan pada hari ini.</div>`;
  }

  /* Kumpul ikut kategori */
  const byKat = {};
  pHari.forEach(m => {
    const k = m.kategori || 'Umum';
    if (!byKat[k]) byKat[k] = [];
    byKat[k].push(m);
  });

  let html = tabHariHTML + `<div class="tarikh-penuh">${formatTarikh(aktif)}</div>`;

  Object.entries(byKat).forEach(([kat, matches]) => {
    html += `
      <div class="peringkat-blok">
        <div class="peringkat-header">${kat}</div>
        ${matches.map(m => renderKadPerlawanan(m, isStaff)).join('')}
      </div>
    `;
  });

  return html;
}


/* ================================================================
   FORMAT ROUND ROBIN
   Tunjuk:
   1. Jadual kedudukan keseluruhan (auto-kira dari keputusan)
   2. Tab hari + semua perlawanan ikut hari
   ================================================================ */
/* NOTE: renderJadualRoundRobinFormat is defined in roundrobin.js */


function renderJadualKedudukan(sukanId, kumpulanId) {
  const kumpulanData = (state.kumpulanSukan[sukanId] || []).find(k => k.id === kumpulanId);
  if (!kumpulanData) return '';

  const pasukan  = kumpulanData.pasukan;
  const stats    = {};
  pasukan.forEach(p => {
    stats[p] = { main:0, menang:0, seri:0, kalah:0, gol:0, masuk:0, pts:0 };
  });

  state.jadual
    .filter(m => m.sukanId === sukanId && m.kumpulan === kumpulanId && m.status === 'selesai')
    .forEach(m => {
      const r = m.scoreRumah, t = m.scoreTamu;
      if (!stats[m.rumah] || !stats[m.tamu]) return;
      stats[m.rumah].main++; stats[m.tamu].main++;
      stats[m.rumah].gol += r; stats[m.rumah].masuk += t;
      stats[m.tamu].gol  += t; stats[m.tamu].masuk  += r;
      if (r > t) { stats[m.rumah].menang++; stats[m.rumah].pts += 3; stats[m.tamu].kalah++; }
      else if (r < t) { stats[m.tamu].menang++; stats[m.tamu].pts += 3; stats[m.rumah].kalah++; }
      else { stats[m.rumah].seri++; stats[m.rumah].pts++; stats[m.tamu].seri++; stats[m.tamu].pts++; }
    });

  const kedudukan = pasukan
    .map(p => ({ nama:p, ...stats[p], beza: stats[p].gol - stats[p].masuk }))
    .sort((a,b) => b.pts - a.pts || b.beza - a.beza || b.gol - a.gol);

  const rows = kedudukan.map((p, i) => {
    const layak = i < 2;
    return `
      <tr class="${layak ? 'layak' : ''}">
        <td><span class="k-pos ${layak ? 'layak' : ''}">${i+1}</span></td>
        <td class="k-nama">
          ${p.nama}
          ${layak ? '<span class="layak-chip">Layak</span>' : ''}
        </td>
        <td>${p.main}</td>
        <td>${p.menang}</td>
        <td>${p.seri}</td>
        <td>${p.kalah}</td>
        <td>${p.gol}:${p.masuk}</td>
        <td class="${p.beza>0?'beza-pos':p.beza<0?'beza-neg':''}">${p.beza>0?'+'+p.beza:p.beza}</td>
        <td><strong style="color:var(--gold)">${p.pts}</strong></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="jadual-kumpulan-wrap">
      <table class="jadual-kumpulan">
        <thead>
          <tr>
            <th>#</th><th>Pasukan</th>
            <th title="Main">M</th>
            <th title="Menang" style="color:var(--green)">W</th>
            <th title="Seri">D</th>
            <th title="Kalah" style="color:#ff8a80">L</th>
            <th title="Gol">GF:GA</th>
            <th title="Beza Gol">GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="layak-nota">✅ Tempat 1 &amp; 2 layak ke peringkat seterusnya</div>
    </div>
  `;
}


/* ================================================================
   KAD PERLAWANAN
   ================================================================ */
function renderKadPerlawanan(p, isStaff) {
  const statusKls   = p.status === 'selesai' ? 'selesai'
                    : p.status === 'sedang_berlangsung' ? 'berlangsung'
                    : 'akan-datang';
  const statusLabel = p.status === 'selesai'           ? '✓ Selesai'
                    : p.status === 'sedang_berlangsung' ? '🔴 LIVE'
                    : '📅 Akan Datang';

  /* Countdown untuk perlawanan akan datang */
  let countdownHTML = '';
  if (p.status === 'akan_datang' && p.tarikh && p.masa) {
    const masaMula  = new Date(p.tarikh + 'T' + p.masa + ':00');
    const sekarang  = new Date();
    const beza      = masaMula - sekarang;
    if (beza > 0) {
      const jam    = Math.floor(beza / 3600000);
      const minit  = Math.floor((beza % 3600000) / 60000);
      const hari   = Math.floor(jam / 24);
      const jamBal = jam % 24;
      const teks   = hari > 0
        ? `${hari} hari ${jamBal} jam lagi`
        : jam > 0
          ? `${jam} jam ${minit} minit lagi`
          : `${minit} minit lagi`;
      countdownHTML = `<span class="countdown-chip">⏳ ${teks}</span>`;
    }
  }

  const rumahMenang = p.status === 'selesai' && p.scoreRumah > p.scoreTamu;
  const tamuMenang  = p.status === 'selesai' && p.scoreTamu  > p.scoreRumah;
  const selesai     = p.status === 'selesai' || p.status === 'sedang_berlangsung';

  const scoreHTML = selesai ? `
    <div class="score-paparan">
      <span class="score-num ${rumahMenang ? 'menang' : (p.status==='selesai' && p.scoreRumah !== p.scoreTamu ? 'kalah' : '')}">${p.scoreRumah}</span>
      <span class="score-dash">—</span>
      <span class="score-num ${tamuMenang  ? 'menang' : (p.status==='selesai' && p.scoreRumah !== p.scoreTamu ? 'kalah' : '')}">${p.scoreTamu}</span>
    </div>
  ` : `<div class="score-vs">${p.masa}</div>`;

  const staffBtns = isStaff ? `
    <div class="perlawanan-actions">
      ${p.status === 'sedang_berlangsung' ? `
        <button class="aksi-btn selesai-btn" onclick="cepatSelesai('${p.id}')">
          ✓ Tamat + Score
        </button>
      ` : ''}
      <button class="aksi-btn" onclick="editPerlawanan('${p.id}')">✏️ Edit</button>
      <button class="aksi-btn hapus" onclick="padamPerlawanan('${p.id}')">🗑</button>
    </div>
  ` : '';

  return `
    <div class="kad-perlawanan ${statusKls}">
      <div class="perlawanan-meta">
        <span class="status-chip ${statusKls}">${statusLabel}</span>
        <span class="perlawanan-info">🕐 ${p.masa} &nbsp;·&nbsp; 📍 ${p.gelanggang}</span>
        ${p.label ? `<span class="label-badge">${p.label}</span>` : ''}
        ${countdownHTML}
      </div>
      <div class="perlawanan-body">
        <div class="pasukan-blok ${rumahMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${p.rumah}</div>
          <div class="pasukan-label">Tuan Rumah</div>
        </div>
        ${scoreHTML}
        <div class="pasukan-blok kanan ${tamuMenang ? 'menang' : ''}">
          <div class="pasukan-nama">${p.tamu}</div>
          <div class="pasukan-label">Pasukan Tamu</div>
        </div>
      </div>
      ${staffBtns}
    </div>
  `;
}


/* ================================================================
   FORM EDIT / TAMBAH PERLAWANAN
   ================================================================ */
function renderFormEditPerlawanan() {
  const p        = state.jadual.find(x => x.id === state.editingPerlawanan);
  const isBaharu = !p || state.editingPerlawanan === 'BAHARU';
  const tabAktif = sukanTabAktif();

  const d = p || {
    id:'', sukanId: tabAktif, kategori:'', peringkat:'kumpulan', kumpulan:'A',
    label:'', rumah:'', tamu:'', tarikh:'', masa:'', gelanggang:'',
    status:'akan_datang', scoreRumah:0, scoreTamu:0,
  };

  const sukanKini = state.sukan.find(s => s.id === d.sukanId) ||
                    state.sukan.find(s => s.id === tabAktif);

  const opsSukan = state.sukan
    .filter(s => ( state.formatSukan[s.id] || 'biasa') !== 'individu')
    .map(s => `<option value="${s.id}" ${d.sukanId===s.id?'selected':''}>${s.icon||'🏅'} ${s.nama}</option>`)
    .join('');

  const opsAcara = sukanKini
    ? ['', ...sukanKini.acara.map(a => a.nama)]
        .map(n => `<option value="${n}" ${n===d.kategori?'selected':''}>${n||'-- Pilih Acara --'}</option>`).join('')
    : '';

  const opsPasukan = (pilihan) =>
    ['', ...state.pasukan].map(n =>
      `<option value="${n}" ${n===pilihan?'selected':''}>${n||'-- Pilih Pasukan --'}</option>`
    ).join('');

  const formatKini = (state.formatSukan[d.sukanId] || state.formatSukan[tabAktif] || 'biasa');
  const adaKumpulan = formatKini === 'kumpulan';

  const opsKumpulan = (state.kumpulanSukan[d.sukanId] || state.kumpulanSukan[tabAktif] || [])
    .map(k => `<option value="${k.id}" ${d.kumpulan===k.id?'selected':''}>Kumpulan ${k.id}</option>`)
    .join('');

  const opsPeringkat = [
    ['kumpulan','Peringkat Kumpulan'],
    ['kumpulan_utama','Perlawanan Kumpulan Utama'],
    ['suku_akhir','Suku Akhir'],
    ['separuh_akhir','Separuh Akhir'],
    ['separuh','Separuh Akhir'],
    ['tempat_ketiga','Tempat Ke-3'],
    ['akhir','Final'],
    ['final','Final'],
  ].map(([v,l]) => `<option value="${v}" ${d.peringkat===v?'selected':''}>${l}</option>`).join('');

  return `
    <button class="back-btn" onclick="batalEditPerlawanan()">← Balik</button>
    <div class="section-title">${isBaharu ? '+ Tambah Perlawanan Baru' : '✏️ Edit / Update Score'}</div>

    <div class="form-perlawanan">

      <!-- Sukan & Acara -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">Sukan</label>
          <select id="fp-sukan" class="podium-select" style="padding:10px 12px;font-size:14px"
            onchange="kemaskiniFormSukan(this.value)">
            ${opsSukan}
          </select>
        </div>
        <div class="form-group">
          <label class="field-label">Acara / Kategori</label>
          <select id="fp-kategori" class="podium-select" style="padding:10px 12px;font-size:14px"
            id="fp-kategori">
            ${opsAcara}
          </select>
        </div>
      </div>

      <!-- Peringkat & Kumpulan -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">Peringkat</label>
          <select id="fp-peringkat" class="podium-select" style="padding:10px 12px;font-size:14px"
            onchange="togolKumpulanField(this.value)">
            ${opsPeringkat}
          </select>
        </div>
        <div class="form-group" id="fp-kumpulan-group"
          style="display:${adaKumpulan && d.peringkat==='kumpulan' ? 'flex':'none'};flex-direction:column;gap:6px">
          <label class="field-label">Kumpulan</label>
          <select id="fp-kumpulan" class="podium-select" style="padding:10px 12px;font-size:14px">
            ${opsKumpulan}
          </select>
        </div>
        <div class="form-group">
          <label class="field-label">Label (pilihan)</label>
          <input type="text" id="fp-label" class="field-input"
            style="padding:9px 12px;font-size:14px"
            placeholder="Contoh: Suku Akhir 1" value="${d.label||''}"/>
        </div>
      </div>

      <!-- Pasukan -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">🏠 Tuan Rumah</label>
          <select id="fp-rumah" class="podium-select" style="padding:10px 12px;font-size:14px">
            ${opsPasukan(d.rumah)}
          </select>
        </div>
        <div class="form-group">
          <label class="field-label">✈️ Pasukan Tamu</label>
          <select id="fp-tamu" class="podium-select" style="padding:10px 12px;font-size:14px">
            ${opsPasukan(d.tamu)}
          </select>
        </div>
      </div>

      <!-- Tarikh, Masa, Gelanggang -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">📅 Tarikh</label>
          <input type="date" id="fp-tarikh" class="field-input"
            style="padding:9px 12px;font-size:14px" value="${d.tarikh}"/>
        </div>
        <div class="form-group">
          <label class="field-label">🕐 Masa</label>
          <input type="time" id="fp-masa" class="field-input"
            style="padding:9px 12px;font-size:14px" value="${d.masa}"/>
        </div>
        <div class="form-group">
          <label class="field-label">📍 Gelanggang</label>
          <input type="text" id="fp-gelanggang" class="field-input"
            style="padding:9px 12px;font-size:14px"
            placeholder="Contoh: Padang A" value="${d.gelanggang}"/>
        </div>
      </div>

      <!-- Status -->
      <div class="form-row">
        <div class="form-group">
          <label class="field-label">📊 Status</label>
          <select id="fp-status" class="podium-select" style="padding:10px 12px;font-size:14px"
            onchange="togolScoreSection(this.value)">
            <option value="akan_datang"       ${d.status==='akan_datang'       ?'selected':''}>📅 Akan Datang</option>
            <option value="sedang_berlangsung" ${d.status==='sedang_berlangsung'?'selected':''}>🔴 Sedang Berlangsung</option>
            <option value="selesai"            ${d.status==='selesai'           ?'selected':''}>✓ Selesai</option>
          </select>
        </div>
      </div>

      <!-- Score -->
      <div id="score-section" style="display:${d.status!=='akan_datang'?'block':'none'}">
        <div class="score-edit-box">
          <div class="score-edit-label">⚽ Masukkan Score</div>
          <div class="score-edit-row">
            <div class="score-edit-pasukan" id="label-rumah">${d.rumah||'Tuan Rumah'}</div>
            <input type="number" id="fp-score-rumah" class="score-big-input"
              min="0" value="${d.scoreRumah}" placeholder="0" oninput="previewScore()"/>
            <div class="score-edit-dash">—</div>
            <input type="number" id="fp-score-tamu" class="score-big-input"
              min="0" value="${d.scoreTamu}" placeholder="0" oninput="previewScore()"/>
            <div class="score-edit-pasukan" id="label-tamu">${d.tamu||'Pasukan Tamu'}</div>
          </div>
          <div id="score-preview" class="score-preview-label">
            ${previewHasil(d.scoreRumah, d.scoreTamu, d.rumah, d.tamu, d.status)}
          </div>
        </div>
      </div>

      <input type="hidden" id="fp-id" value="${d.id}"/>

      <div id="fp-error"
        style="display:none;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);
        color:#ff8a80;font-size:13px;padding:9px 12px;border-radius:7px;margin-bottom:10px">
      </div>

      <div class="btn-group" style="margin-top:8px">
        <button class="cancel-btn" onclick="batalEditPerlawanan()">Batal</button>
        <button class="save-btn" style="padding:10px 28px;font-size:15px"
          onclick="simpanPerlawanan()">
          💾 ${isBaharu ? 'Tambah Perlawanan' : 'Simpan'}
        </button>
      </div>

    </div>
  `;
}


/* ================================================================
   FUNGSI NAVIGASI JADUAL
   ================================================================ */

function pilihJadualSukan(sukanId) {
  state.jadualSukanTab    = sukanId;
  state.editingPerlawanan = null;
  semakAutoStatus(); /* ← semak setiap kali buka sukan */
  render();
}

function balikGridJadual() {
  state.jadualSukanTab    = null;
  state.editingPerlawanan = null;
  render();
}

function pilihHari(tarikh, sukanId) {
  if (!state.selectedHari) state.selectedHari = {};
  state.selectedHari[sukanId] = tarikh;
  render();
}

function hariAktif(sukanId) {
  const hari = [...new Set(
    state.jadual.filter(m => m.sukanId === sukanId).map(m => m.tarikh).filter(Boolean)
  )].sort();
  const saved = state.selectedHari?.[sukanId];
  return (saved && hari.includes(saved)) ? saved : hari[0] || null;
}

function bukaFormTambah() {
  state.editingPerlawanan = 'BAHARU';
  render();
}

function editPerlawanan(id) {
  state.editingPerlawanan = id;
  render();
}

function batalEditPerlawanan() {
  state.editingPerlawanan = null;
  render();
}

function togolKumpulanField(val) {
  const el = document.getElementById('fp-kumpulan-group');
  if (el) el.style.display = val === 'kumpulan' ? 'flex' : 'none';
}

function togolScoreSection(val) {
  const el = document.getElementById('score-section');
  if (el) el.style.display = val !== 'akan_datang' ? 'block' : 'none';
}

/* Update senarai acara bila tukar sukan dalam form */
function kemaskiniFormSukan(sukanId) {
  const sukan = state.sukan.find(s => s.id === sukanId);
  if (!sukan) return;
  const sel = document.getElementById('fp-kategori');
  if (sel) {
    sel.innerHTML = ['', ...sukan.acara.map(a => a.nama)]
      .map(n => `<option value="${n}">${n||'-- Pilih Acara --'}</option>`).join('');
  }
  /* Kemas kini kumpulan */
  const kSel = document.getElementById('fp-kumpulan');
  const kGrp = document.getElementById('fp-kumpulan-group');
  const fmt  = state.formatSukan[sukanId] || 'biasa';
  if (kGrp) kGrp.style.display = 'none';
  if (kSel && state.kumpulanSukan[sukanId]) {
    kSel.innerHTML = (state.kumpulanSukan[sukanId] || [])
      .map(k => `<option value="${k.id}">Kumpulan ${k.id}</option>`).join('');
  }
}

function previewHasil(sR, sT, nR, nT, status) {
  if (status === 'akan_datang') return '';
  sR = parseInt(sR)||0; sT = parseInt(sT)||0;
  if (sR > sT) return `<span style="color:var(--green)">✓ ${nR||'Tuan Rumah'} menang</span>`;
  if (sT > sR) return `<span style="color:var(--green)">✓ ${nT||'Pasukan Tamu'} menang</span>`;
  return `<span style="color:var(--muted)">— Seri</span>`;
}

function previewScore() {
  const sR   = document.getElementById('fp-score-rumah')?.value||0;
  const sT   = document.getElementById('fp-score-tamu')?.value||0;
  const nR   = document.getElementById('fp-rumah')?.value||'Tuan Rumah';
  const nT   = document.getElementById('fp-tamu')?.value||'Pasukan Tamu';
  const stat = document.getElementById('fp-status')?.value||'';
  const el   = document.getElementById('score-preview');
  if (el) el.innerHTML = previewHasil(sR, sT, nR, nT, stat);
  const lR = document.getElementById('label-rumah'); if (lR && nR) lR.textContent = nR;
  const lT = document.getElementById('label-tamu');  if (lT && nT) lT.textContent = nT;
}


/* ================================================================
   SIMPAN / PADAM
   ================================================================ */
function simpanPerlawanan() {
  const errEl    = document.getElementById('fp-error');
  const id       = document.getElementById('fp-id')?.value?.trim();
  const sukanId  = document.getElementById('fp-sukan')?.value;
  const kategori = document.getElementById('fp-kategori')?.value?.trim();
  const peringkat= document.getElementById('fp-peringkat')?.value;
  const kumpulan = document.getElementById('fp-kumpulan')?.value || null;
  const label    = document.getElementById('fp-label')?.value?.trim()||'';
  const rumah    = document.getElementById('fp-rumah')?.value?.trim();
  const tamu     = document.getElementById('fp-tamu')?.value?.trim();
  const tarikh   = document.getElementById('fp-tarikh')?.value?.trim();
  const masa     = document.getElementById('fp-masa')?.value?.trim();
  const gelang   = document.getElementById('fp-gelanggang')?.value?.trim();
  const status   = document.getElementById('fp-status')?.value;
  const sRumah   = parseInt(document.getElementById('fp-score-rumah')?.value)||0;
  const sTamu    = parseInt(document.getElementById('fp-score-tamu')?.value)||0;

  if (!rumah)        { tunjukErrFP('Sila pilih pasukan tuan rumah.'); return; }
  if (!tamu)         { tunjukErrFP('Sila pilih pasukan tamu.'); return; }
  if (rumah === tamu){ tunjukErrFP('Pasukan tuan rumah dan tamu tidak boleh sama.'); return; }
  if (!tarikh)       { tunjukErrFP('Sila pilih tarikh perlawanan.'); return; }
  if (!masa)         { tunjukErrFP('Sila masukkan masa perlawanan.'); return; }

  errEl.style.display = 'none';
  const isBaharu = state.editingPerlawanan === 'BAHARU';
  const newId    = isBaharu ? 'p_' + Date.now() : id;

  const data = {
    id: newId, sukanId, kategori,
    peringkat, kumpulan: peringkat === 'kumpulan' ? kumpulan : null,
    label, rumah, tamu, tarikh,
    masa, gelanggang: gelang||'TBA',
    status, scoreRumah: sRumah, scoreTamu: sTamu,
  };

  if (isBaharu) {
    state.jadual.push(data);
    if (!state.selectedHari) state.selectedHari = {};
    state.selectedHari[sukanId] = tarikh;
    state.jadualSukanTab = sukanId;
  } else {
    const idx = state.jadual.findIndex(m => m.id === id);
    if (idx !== -1) state.jadual[idx] = data;
  }

  state.editingPerlawanan = null;
  simpanData();
  semakAutoStatus(); /* ← semak terus, jangan tunggu 30 saat */
  render();
}

function padamPerlawanan(id) {
  const p = state.jadual.find(x => x.id === id);
  if (!confirm('Padam perlawanan: ' + (p?.rumah||'') + ' vs ' + (p?.tamu||'') + '?')) return;
  state.jadual = state.jadual.filter(x => x.id !== id);
  simpanData();
  render();
}

function tunjukErrFP(msg) {
  const el = document.getElementById('fp-error');
  if (el) { el.textContent = '⚠️ ' + msg; el.style.display = 'block'; }
}


/* ================================================================
   HELPERS
   ================================================================ */
function formatTarikh(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('ms-MY',
    { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

function formatTarikhPendek(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('ms-MY',
    { weekday:'short', day:'numeric', month:'short' });
}

function labelPeringkat(p) {
  return {
    kumpulan:       'Peringkat Kumpulan',
    kumpulan_utama: 'Perlawanan Utama',
    suku_akhir:     'Suku Akhir',
    separuh_akhir:  'Separuh Akhir',
    separuh:        'Separuh Akhir',
    tempat_ketiga:  'Tempat Ke-3',
    akhir:          '🏆 Final',
    final:          '🏆 Final',
  }[p] || p;
}


/* ================================================================
   AUTO-STATUS ENGINE
   ================================================================
   Sistem ini semak secara automatik setiap 30 saat.
   
   LOGIK:
   akan_datang       → sedang_berlangsung  (auto, masa bermula)
   sedang_berlangsung → selesai            (MANUAL oleh staff)

   DURASI PERLAWANAN (minit) — tukar ikut keperluan:
   Bola Sepak  = 90 minit
   Futsal      = 40 minit
   Badminton   = 60 minit (anggaran)
   Bola Tampar = 90 minit (anggaran)
   Lain-lain   = 60 minit
   ================================================================ */

const DURASI_SUKAN = {
  s1: 0,    // Olahraga — tiada perlawanan
  s2: 60,   // Badminton
  s3: 90,   // Bola Sepak
  s4: 40,   // Futsal
  s5: 90,   // Bola Tampar
  s6: 0,    // Renang — tiada perlawanan
  /* Tambah sukan lain:
  sX: 60,
  */
};

/* Semak dan kemaskini status perlawanan */
function semakAutoStatus() {
  const sekarang = new Date();
  let adaPerubahan = false;

  state.jadual.forEach(m => {
    /* Jangan sentuh perlawanan yang sudah selesai */
    if (m.status === 'selesai') return;
    if (!m.tarikh || !m.masa)   return;

    const masaMula   = new Date(m.tarikh + 'T' + m.masa + ':00');
    const durasi     = DURASI_SUKAN[m.sukanId] ?? 60;
    const masaTamat  = new Date(masaMula.getTime() + durasi * 60 * 1000);

    if (sekarang >= masaMula && m.status === 'akan_datang') {
      /* Masa dah tiba → tukar ke Sedang Berlangsung */
      m.status = 'sedang_berlangsung';
      adaPerubahan = true;
    }
    /* Nota: tamat automatik TIDAK dilakukan —
       staff perlu sahkan score sebelum tandakan Selesai */
  });

  if (adaPerubahan) {
    simpanData();
    render();
  }
}

/* Butang cepat "Tamat + Score" untuk perlawanan LIVE */
function cepatSelesai(id) {
  state.editingPerlawanan = id;
  /* Pre-set status ke selesai dalam form */
  state._presetSelesai = true;
  render();
  /* Set dropdown status ke selesai dan tunjuk score */
  setTimeout(() => {
    const sel = document.getElementById('fp-status');
    if (sel) {
      sel.value = 'selesai';
      togolScoreSection('selesai');
    }
    state._presetSelesai = false;
    document.getElementById('fp-score-rumah')?.focus();
  }, 100);
}

/* Pemasa — jalankan semak setiap 10 saat */
function mulaAutoStatus() {
  semakAutoStatus();
  semakAutoStatusRR(); /* ← semak perlawanan round robin juga */
  setInterval(() => { semakAutoStatus(); semakAutoStatusRR(); }, 10000);
>>>>>>> bf49cbd (feat: add tetapan.js for settings management with sub-tabs for account management, staff addition, team management, and sports & events)
}