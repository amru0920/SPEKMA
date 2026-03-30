<<<<<<< HEAD
/* ================================================================
   data.js — DATA PASUKAN & SUKAN
   ================================================================

   FAIL INI untuk edit:
   ✏️  Tambah / padam pasukan
   ✏️  Tambah / padam sukan
   ✏️  Tambah / padam acara dalam setiap sukan
   ✏️  Tukar sistem mata

   CARA TAMBAH PASUKAN BARU:
   Cari bahagian PASUKAN_ASAL dan tambah nama dalam senarai.

   CARA TAMBAH SUKAN BARU:
   Cari bahagian SUKAN_ASAL, salin blok sukan yang ada
   dan ubah id, nama, icon dan acara.

   NOTA: id mesti unik — jangan guna id yang sama dua kali.
   ================================================================ */


/* ----------------------------------------------------------------
   SISTEM MATA
   Ubah nilai di sini untuk tukar berapa mata setiap tempat.
   ---------------------------------------------------------------- */
const MATA = {
  1: 5,    // 🥇 Tempat Pertama  = 5 mata
  2: 3,    // 🥈 Tempat Kedua    = 3 mata
  3: 1,    // 🥉 Tempat Ketiga   = 1 mata
};


/* ----------------------------------------------------------------
   SENARAI PASUKAN
   Tambah atau padam nama pasukan di sini.
   ---------------------------------------------------------------- */
const PASUKAN_ASAL = [
  "MRSM Kepala Batas",
  "MRSM Balik Pulau",
  "MRSM Kubang Pasu",
  "MRSM Langkawi",
  "IKBN Darul Aman",
  "IKM Alor Setar",
  "ADTEC Kedah",
  "MRSM Taiping",
  /* Tambah pasukan → "Nama Pasukan Baru", */
];


/* ----------------------------------------------------------------
   SENARAI SUKAN & ACARA

   Setiap sukan:
     id    : kod unik (contoh: "s1", "s2") — JANGAN ULANG
     nama  : nama sukan
     icon  : emoji sukan
     jenis : "individu" atau "pasukan"
             individu → ada score masa/jarak (contoh: "10.5s", "45m")
             pasukan  → ada score perlawanan (contoh: "3 - 1")
     acara : senarai acara dalam sukan ini

   Setiap acara:
     id    : kod unik (contoh: "s1_a1") — JANGAN ULANG
     nama  : nama acara
   ---------------------------------------------------------------- */
const SUKAN_ASAL = [

  /* ── OLAHRAGA ── */
  {
    id: "s1", nama: "Olahraga", icon: "🏃", jenis: "individu",
    acara: [
      { id: "s1_a1", nama: "Lari 100m (Lelaki)" },
      { id: "s1_a2", nama: "Lari 100m (Wanita)" },
      { id: "s1_a3", nama: "Lari 200m (Lelaki)" },
      { id: "s1_a4", nama: "Lari 200m (Wanita)" },
      { id: "s1_a5", nama: "Lari 400m (Lelaki)" },
      { id: "s1_a6", nama: "Lari 400m (Wanita)" },
      { id: "s1_a7", nama: "Lompat Jauh (Lelaki)" },
      { id: "s1_a8", nama: "Lompat Tinggi (Wanita)" },
      { id: "s1_a9", nama: "Rejam Peluru (Lelaki)" },
      { id: "s1_a10", nama: "4x100m Pemancar (Lelaki)" },
      { id: "s1_a11", nama: "4x100m Pemancar (Wanita)" },
    ],
  },

  /* ── BADMINTON ── */
  {
    id: "s2", nama: "Badminton", icon: "🏸", jenis: "pasukan",
    acara: [
      { id: "s2_a1", nama: "Beregu Lelaki" },
      { id: "s2_a2", nama: "Beregu Wanita" },
      { id: "s2_a3", nama: "Campuran" },
      { id: "s2_a4", nama: "Perseorangan Lelaki" },
      { id: "s2_a5", nama: "Perseorangan Wanita" },
    ],
  },

  /* ── BOLA SEPAK ── */
  {
    id: "s3", nama: "Bola Sepak", icon: "⚽", jenis: "pasukan",
    acara: [
      { id: "s3_a1", nama: "Bola Sepak Lelaki" },
    ],
  },

  /* ── FUTSAL ── */
  {
    id: "s4", nama: "Futsal", icon: "🥅", jenis: "pasukan",
    acara: [
      { id: "s4_a1", nama: "Futsal Lelaki" },
      { id: "s4_a2", nama: "Futsal Wanita" },
    ],
  },

  /* ── BOLA TAMPAR ── */
  {
    id: "s5", nama: "Bola Tampar", icon: "🏐", jenis: "pasukan",
    acara: [
      { id: "s5_a1", nama: "Bola Tampar Lelaki" },
      { id: "s5_a2", nama: "Bola Tampar Wanita" },
    ],
  },

  /* ── RENANG ── */
  {
    id: "s6", nama: "Renang", icon: "🏊", jenis: "individu",
    acara: [
      { id: "s6_a1", nama: "50m Bebas (Lelaki)" },
      { id: "s6_a2", nama: "50m Bebas (Wanita)" },
      { id: "s6_a3", nama: "100m Gaya Dada (Lelaki)" },
      { id: "s6_a4", nama: "100m Gaya Dada (Wanita)" },
    ],
  },

  /* ── CONTOH TAMBAH SUKAN BARU ──
  {
    id: "s7", nama: "Nama Sukan", icon: "🏅", jenis: "pasukan",
    acara: [
      { id: "s7_a1", nama: "Nama Acara 1" },
      { id: "s7_a2", nama: "Nama Acara 2" },
    ],
  },
  */

=======
/* ================================================================
   data.js — DATA PASUKAN & SUKAN
   ================================================================

   FAIL INI untuk edit:
   ✏️  Tambah / padam pasukan
   ✏️  Tambah / padam sukan
   ✏️  Tambah / padam acara dalam setiap sukan
   ✏️  Tukar sistem mata

   CARA TAMBAH PASUKAN BARU:
   Cari bahagian PASUKAN_ASAL dan tambah nama dalam senarai.

   CARA TAMBAH SUKAN BARU:
   Cari bahagian SUKAN_ASAL, salin blok sukan yang ada
   dan ubah id, nama, icon dan acara.

   NOTA: id mesti unik — jangan guna id yang sama dua kali.
   ================================================================ */


/* ----------------------------------------------------------------
   SISTEM MATA
   Ubah nilai di sini untuk tukar berapa mata setiap tempat.
   ---------------------------------------------------------------- */
const MATA = {
  1: 5,    // 🥇 Tempat Pertama  = 5 mata
  2: 3,    // 🥈 Tempat Kedua    = 3 mata
  3: 1,    // 🥉 Tempat Ketiga   = 1 mata
};


/* ----------------------------------------------------------------
   SENARAI PASUKAN
   Tambah atau padam nama pasukan di sini.
   ---------------------------------------------------------------- */
const PASUKAN_ASAL = [
  "MRSM Kepala Batas",
  "MRSM Balik Pulau",
  "MRSM Kubang Pasu",
  "MRSM Langkawi",
  "IKBN Darul Aman",
  "IKM Alor Setar",
  "ADTEC Kedah",
  "MRSM Taiping",
  /* Tambah pasukan → "Nama Pasukan Baru", */
];


/* ----------------------------------------------------------------
   SENARAI SUKAN & ACARA

   Setiap sukan:
     id    : kod unik (contoh: "s1", "s2") — JANGAN ULANG
     nama  : nama sukan
     icon  : emoji sukan
     jenis : "individu" atau "pasukan"
             individu → ada score masa/jarak (contoh: "10.5s", "45m")
             pasukan  → ada score perlawanan (contoh: "3 - 1")
     acara : senarai acara dalam sukan ini

   Setiap acara:
     id    : kod unik (contoh: "s1_a1") — JANGAN ULANG
     nama  : nama acara
   ---------------------------------------------------------------- */
const SUKAN_ASAL = [

  /* ── OLAHRAGA ── */
  {
    id: "s1", nama: "Olahraga", icon: "🏃", jenis: "individu",
    acara: [
      { id: "s1_a1", nama: "Lari 100m (Lelaki)" },
      { id: "s1_a2", nama: "Lari 100m (Wanita)" },
      { id: "s1_a3", nama: "Lari 200m (Lelaki)" },
      { id: "s1_a4", nama: "Lari 200m (Wanita)" },
      { id: "s1_a5", nama: "Lari 400m (Lelaki)" },
      { id: "s1_a6", nama: "Lari 400m (Wanita)" },
      { id: "s1_a7", nama: "Lompat Jauh (Lelaki)" },
      { id: "s1_a8", nama: "Lompat Tinggi (Wanita)" },
      { id: "s1_a9", nama: "Rejam Peluru (Lelaki)" },
      { id: "s1_a10", nama: "4x100m Pemancar (Lelaki)" },
      { id: "s1_a11", nama: "4x100m Pemancar (Wanita)" },
    ],
  },

  /* ── BADMINTON ── */
  {
    id: "s2", nama: "Badminton", icon: "🏸", jenis: "pasukan",
    acara: [
      { id: "s2_a1", nama: "Beregu Lelaki" },
      { id: "s2_a2", nama: "Beregu Wanita" },
      { id: "s2_a3", nama: "Campuran" },
      { id: "s2_a4", nama: "Perseorangan Lelaki" },
      { id: "s2_a5", nama: "Perseorangan Wanita" },
    ],
  },

  /* ── BOLA SEPAK ── */
  {
    id: "s3", nama: "Bola Sepak", icon: "⚽", jenis: "pasukan",
    acara: [
      { id: "s3_a1", nama: "Bola Sepak Lelaki" },
    ],
  },

  /* ── FUTSAL ── */
  {
    id: "s4", nama: "Futsal", icon: "🥅", jenis: "pasukan",
    acara: [
      { id: "s4_a1", nama: "Futsal Lelaki" },
      { id: "s4_a2", nama: "Futsal Wanita" },
    ],
  },

  /* ── BOLA TAMPAR ── */
  {
    id: "s5", nama: "Bola Tampar", icon: "🏐", jenis: "pasukan",
    acara: [
      { id: "s5_a1", nama: "Bola Tampar Lelaki" },
      { id: "s5_a2", nama: "Bola Tampar Wanita" },
    ],
  },

  /* ── RENANG ── */
  {
    id: "s6", nama: "Renang", icon: "🏊", jenis: "individu",
    acara: [
      { id: "s6_a1", nama: "50m Bebas (Lelaki)" },
      { id: "s6_a2", nama: "50m Bebas (Wanita)" },
      { id: "s6_a3", nama: "100m Gaya Dada (Lelaki)" },
      { id: "s6_a4", nama: "100m Gaya Dada (Wanita)" },
    ],
  },

  /* ── CONTOH TAMBAH SUKAN BARU ──
  {
    id: "s7", nama: "Nama Sukan", icon: "🏅", jenis: "pasukan",
    acara: [
      { id: "s7_a1", nama: "Nama Acara 1" },
      { id: "s7_a2", nama: "Nama Acara 2" },
    ],
  },
  */

>>>>>>> bf49cbd (feat: add tetapan.js for settings management with sub-tabs for account management, staff addition, team management, and sports & events)
];