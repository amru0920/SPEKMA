/* ================================================================
   worker.js — SPEKMA CLOUDFLARE WORKER API
   ================================================================
   Deploy: wrangler deploy
   
   Endpoints:
   GET  /api/data          — Ambil semua data
   POST /api/data          — Simpan semua data (bulk sync)
   GET  /api/health        — Health check
   ================================================================ */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

/* ── MAIN HANDLER ── */
export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    /* Preflight CORS */
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    /* Static files — layan dari Cloudflare Pages, bukan Worker */
    if (!path.startsWith('/api/')) {
      return new Response('Not found', { status: 404 });
    }

    try {
      /* ── GET /api/health ── */
      if (path === '/api/health' && method === 'GET') {
        return json({ ok: true, ts: Date.now() });
      }

      /* ── GET /api/data — Ambil semua data ── */
      if (path === '/api/data' && method === 'GET') {
        return json(await ambilSemuaData(env.DB));
      }

      /* ── POST /api/data — Simpan semua data ── */
      if (path === '/api/data' && method === 'POST') {
        const body = await request.json();
        await simpanSemuaData(env.DB, body);
        return json({ ok: true });
      }

      return json({ error: 'Not found' }, 404);

    } catch (err) {
      console.error(err);
      return json({ error: err.message }, 500);
    }
  }
};


/* ================================================================
   AMBIL SEMUA DATA — bina semula state SPEKMA dari D1
   ================================================================ */
async function ambilSemuaData(db) {
  const [
    pasukanRows, sukanRows, acaraRows, formatRows,
    kumpulanRows, kumpulanPasukanRows, jadualRows,
    rrRows, bracketRows, keputusanRows,
    staffRows, tetapanRows, streamingRows
  ] = await Promise.all([
    db.prepare('SELECT nama FROM pasukan ORDER BY nama').all(),
    db.prepare('SELECT * FROM sukan').all(),
    db.prepare('SELECT * FROM acara').all(),
    db.prepare('SELECT * FROM format_sukan').all(),
    db.prepare('SELECT * FROM kumpulan').all(),
    db.prepare('SELECT * FROM kumpulan_pasukan').all(),
    db.prepare('SELECT * FROM jadual').all(),
    db.prepare('SELECT * FROM round_robin').all(),
    db.prepare('SELECT * FROM bracket').all(),
    db.prepare('SELECT * FROM keputusan').all(),
    db.prepare('SELECT * FROM staff').all(),
    db.prepare('SELECT * FROM tetapan').all(),
    db.prepare('SELECT * FROM streaming').all(),
  ]);

  /* Bina semula sukan dengan acara */
  const sukan = sukanRows.results.map(s => ({
    id:      s.id,
    nama:    s.nama,
    icon:    s.icon,
    jenis:   s.jenis,
    mainSet: s.main_set === 1,
    acara:   acaraRows.results
               .filter(a => a.sukan_id === s.id)
               .map(a => ({ id: a.id, nama: a.nama })),
  }));

  /* Format sukan */
  const formatSukan = {};
  formatRows.results.forEach(f => { formatSukan[f.sukan_id] = f.format; });

  /* Kumpulan */
  const kumpulanSukan = {};
  kumpulanRows.results.forEach(k => {
    if (!kumpulanSukan[k.kat_key]) kumpulanSukan[k.kat_key] = [];
    const pasukan = kumpulanPasukanRows.results
      .filter(p => p.kat_key === k.kat_key && p.kumpulan_id === k.kumpulan_id)
      .map(p => p.nama_pasukan);
    kumpulanSukan[k.kat_key].push({
      id:      k.kumpulan_id,
      nama:    k.nama,
      pasukan,
    });
  });

  /* Jadual */
  const jadual = jadualRows.results.map(m => ({
    id:          m.id,
    sukanId:     m.sukan_id,
    kategori:    m.kategori,
    peringkat:   m.peringkat,
    kumpulan:    m.kumpulan,
    label:       m.label,
    rumah:       m.rumah,
    tamu:        m.tamu,
    tarikh:      m.tarikh,
    masa:        m.masa,
    gelanggang:  m.gelanggang,
    status:      m.status,
    scoreRumah:  m.score_rumah,
    scoreTamu:   m.score_tamu,
    sets:        JSON.parse(m.sets_json || '[]'),
  }));

  /* Round Robin */
  const roundRobin = {};
  rrRows.results.forEach(r => {
    roundRobin[r.sukan_id] = {
      peserta:     JSON.parse(r.peserta_json    || '[]'),
      perlawanan:  JSON.parse(r.perlawanan_json || '[]'),
    };
  });

  /* Bracket */
  const bracket = {};
  bracketRows.results.forEach(b => {
    bracket[b.sukan_id] = JSON.parse(b.data_json || '{}');
  });

  /* Keputusan */
  const keputusan = {};
  keputusanRows.results.forEach(k => {
    if (!keputusan[k.acara_id]) keputusan[k.acara_id] = [];
    keputusan[k.acara_id].push({ tempat: k.tempat, pasukan: k.pasukan });
  });

  /* Staff */
  const staff = staffRows.results.map(s => ({
    ic4:     s.ic4,
    nama:    s.nama,
    jawatan: s.jawatan,
  }));

  /* Tetapan */
  const tetapan = {};
  tetapanRows.results.forEach(t => { tetapan[t.kunci] = t.nilai; });

  /* Streaming */
  const streaming = streamingRows.results.map(s => ({
    id:       s.id,
    nama:     s.nama,
    platform: s.platform,
    url:      s.url,
    sukanId:  s.sukan_id,
    aktif:    s.aktif === 1,
  }));

  return {
    pasukan:      pasukanRows.results.map(p => p.nama),
    sukan,
    formatSukan,
    kumpulanSukan,
    jadual,
    roundRobin,
    bracket,
    keputusan,
    staff,
    password:     tetapan.password || 'tvet2025',
    streaming,
  };
}


/* ================================================================
   SIMPAN SEMUA DATA — tulis semula D1 dari state SPEKMA
   ================================================================ */
async function simpanSemuaData(db, state) {
  const stmts = [];

  /* Pasukan */
  stmts.push(db.prepare('DELETE FROM pasukan'));
  for (const nama of (state.pasukan || [])) {
    stmts.push(db.prepare('INSERT OR IGNORE INTO pasukan (nama) VALUES (?)').bind(nama));
  }

  /* Sukan & Acara */
  stmts.push(db.prepare('DELETE FROM acara'));
  stmts.push(db.prepare('DELETE FROM sukan'));
  for (const s of (state.sukan || [])) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO sukan (id, nama, icon, jenis, main_set) VALUES (?,?,?,?,?)'
    ).bind(s.id, s.nama, s.icon||'🏅', s.jenis||'pasukan', s.mainSet?1:0));
    for (const a of (s.acara || [])) {
      stmts.push(db.prepare(
        'INSERT OR REPLACE INTO acara (id, sukan_id, nama) VALUES (?,?,?)'
      ).bind(a.id, s.id, a.nama));
    }
  }

  /* Format sukan */
  stmts.push(db.prepare('DELETE FROM format_sukan'));
  for (const [sukanId, format] of Object.entries(state.formatSukan || {})) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO format_sukan (sukan_id, format) VALUES (?,?)'
    ).bind(sukanId, format));
  }

  /* Kumpulan */
  stmts.push(db.prepare('DELETE FROM kumpulan'));
  stmts.push(db.prepare('DELETE FROM kumpulan_pasukan'));
  for (const [katKey, arr] of Object.entries(state.kumpulanSukan || {})) {
    const sukanId = katKey.split('___')[0];
    for (const k of arr) {
      stmts.push(db.prepare(
        'INSERT OR REPLACE INTO kumpulan (id, kat_key, sukan_id, kumpulan_id, nama) VALUES (?,?,?,?,?)'
      ).bind(`${katKey}_${k.id}`, katKey, sukanId, k.id, k.nama));
      for (const p of (k.pasukan || [])) {
        stmts.push(db.prepare(
          'INSERT INTO kumpulan_pasukan (kat_key, kumpulan_id, nama_pasukan) VALUES (?,?,?)'
        ).bind(katKey, k.id, p));
      }
    }
  }

  /* Jadual */
  stmts.push(db.prepare('DELETE FROM jadual'));
  for (const m of (state.jadual || [])) {
    stmts.push(db.prepare(`
      INSERT OR REPLACE INTO jadual
      (id,sukan_id,kategori,peringkat,kumpulan,label,rumah,tamu,
       tarikh,masa,gelanggang,status,score_rumah,score_tamu,sets_json)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      m.id, m.sukanId, m.kategori||'', m.peringkat||'kumpulan',
      m.kumpulan||'', m.label||'', m.rumah, m.tamu,
      m.tarikh||'', m.masa||'', m.gelanggang||'',
      m.status||'akan_datang', m.scoreRumah||0, m.scoreTamu||0,
      JSON.stringify(m.sets||[])
    ));
  }

  /* Round Robin */
  stmts.push(db.prepare('DELETE FROM round_robin'));
  for (const [sukanId, rr] of Object.entries(state.roundRobin || {})) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO round_robin (sukan_id, peserta_json, perlawanan_json) VALUES (?,?,?)'
    ).bind(sukanId, JSON.stringify(rr.peserta||[]), JSON.stringify(rr.perlawanan||[])));
  }

  /* Bracket */
  stmts.push(db.prepare('DELETE FROM bracket'));
  for (const [sukanId, bData] of Object.entries(state.bracket || {})) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO bracket (sukan_id, data_json) VALUES (?,?)'
    ).bind(sukanId, JSON.stringify(bData)));
  }

  /* Keputusan */
  stmts.push(db.prepare('DELETE FROM keputusan'));
  for (const [acaraId, arr] of Object.entries(state.keputusan || {})) {
    for (const k of arr) {
      stmts.push(db.prepare(
        'INSERT INTO keputusan (acara_id, tempat, pasukan) VALUES (?,?,?)'
      ).bind(acaraId, k.tempat, k.pasukan));
    }
  }

  /* Staff */
  stmts.push(db.prepare('DELETE FROM staff'));
  for (const s of (state.staff || [])) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO staff (ic4, nama, jawatan) VALUES (?,?,?)'
    ).bind(s.ic4, s.nama, s.jawatan||'Staff'));
  }

  /* Password */
  if (state.password) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO tetapan (kunci, nilai) VALUES (?,?)'
    ).bind('password', state.password));
  }

  /* Streaming */
  stmts.push(db.prepare('DELETE FROM streaming'));
  for (const s of (state.streaming || [])) {
    stmts.push(db.prepare(
      'INSERT OR REPLACE INTO streaming (id, nama, platform, url, sukan_id, aktif) VALUES (?,?,?,?,?,?)'
    ).bind(s.id, s.nama, s.platform||'youtube', s.url, s.sukanId||'', s.aktif?1:0));
  }

  /* Jalankan semua dalam satu batch */
  await db.batch(stmts);
}