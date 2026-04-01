-- ================================================================
-- schema.sql — SPEKMA D1 DATABASE
-- Jalankan: wrangler d1 execute spekma-db --file=schema.sql
-- ================================================================

-- Pasukan
CREATE TABLE IF NOT EXISTS pasukan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL UNIQUE
);

-- Sukan
CREATE TABLE IF NOT EXISTS sukan (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  icon TEXT DEFAULT '🏅',
  jenis TEXT DEFAULT 'pasukan',
  main_set INTEGER DEFAULT 0
);

-- Acara dalam sukan
CREATE TABLE IF NOT EXISTS acara (
  id TEXT PRIMARY KEY,
  sukan_id TEXT NOT NULL,
  nama TEXT NOT NULL,
  FOREIGN KEY (sukan_id) REFERENCES sukan(id)
);

-- Format sukan (individu/biasa/kumpulan/round_robin)
CREATE TABLE IF NOT EXISTS format_sukan (
  sukan_id TEXT PRIMARY KEY,
  format TEXT DEFAULT 'biasa',
  FOREIGN KEY (sukan_id) REFERENCES sukan(id)
);

-- Kumpulan
CREATE TABLE IF NOT EXISTS kumpulan (
  id TEXT PRIMARY KEY,
  kat_key TEXT NOT NULL,
  sukan_id TEXT NOT NULL,
  kumpulan_id TEXT NOT NULL,
  nama TEXT NOT NULL,
  FOREIGN KEY (sukan_id) REFERENCES sukan(id)
);

-- Ahli kumpulan
CREATE TABLE IF NOT EXISTS kumpulan_pasukan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kat_key TEXT NOT NULL,
  kumpulan_id TEXT NOT NULL,
  nama_pasukan TEXT NOT NULL
);

-- Jadual perlawanan
CREATE TABLE IF NOT EXISTS jadual (
  id TEXT PRIMARY KEY,
  sukan_id TEXT NOT NULL,
  kategori TEXT DEFAULT '',
  peringkat TEXT DEFAULT 'kumpulan',
  kumpulan TEXT DEFAULT '',
  label TEXT DEFAULT '',
  rumah TEXT NOT NULL,
  tamu TEXT NOT NULL,
  tarikh TEXT DEFAULT '',
  masa TEXT DEFAULT '',
  gelanggang TEXT DEFAULT '',
  status TEXT DEFAULT 'akan_datang',
  score_rumah INTEGER DEFAULT 0,
  score_tamu INTEGER DEFAULT 0,
  sets_json TEXT DEFAULT '[]',
  FOREIGN KEY (sukan_id) REFERENCES sukan(id)
);

-- Round Robin peserta & perlawanan
CREATE TABLE IF NOT EXISTS round_robin (
  sukan_id TEXT PRIMARY KEY,
  peserta_json TEXT DEFAULT '[]',
  perlawanan_json TEXT DEFAULT '[]',
  FOREIGN KEY (sukan_id) REFERENCES sukan(id)
);

-- Bracket knockout
CREATE TABLE IF NOT EXISTS bracket (
  sukan_id TEXT PRIMARY KEY,
  data_json TEXT DEFAULT '{}',
  FOREIGN KEY (sukan_id) REFERENCES sukan(id)
);

-- Keputusan akhir (podium)
CREATE TABLE IF NOT EXISTS keputusan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  acara_id TEXT NOT NULL,
  tempat INTEGER NOT NULL,
  pasukan TEXT NOT NULL
);

-- Staff
CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ic4 TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  jawatan TEXT DEFAULT 'Staff'
);

-- Tetapan sistem
CREATE TABLE IF NOT EXISTS tetapan (
  kunci TEXT PRIMARY KEY,
  nilai TEXT NOT NULL
);

-- Streaming links
CREATE TABLE IF NOT EXISTS streaming (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  platform TEXT DEFAULT 'youtube',
  url TEXT NOT NULL,
  sukan_id TEXT DEFAULT '',
  aktif INTEGER DEFAULT 1
);

-- ── Data awal ──
INSERT OR IGNORE INTO staff (ic4, nama, jawatan)
VALUES ('1234', 'Admin SPEKMA', 'Pentadbir Sistem');

INSERT OR IGNORE INTO tetapan (kunci, nilai)
VALUES ('password', 'tvet2025');