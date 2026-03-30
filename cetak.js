/* ================================================================
   cetak.js — CETAK / SIMPAN PDF JADUAL PERLAWANAN
   ================================================================
   Buka tetingkap print dengan semua perlawanan tersusun ikut masa.
   Pengguna boleh tekan Ctrl+P atau guna dialog print untuk
   simpan sebagai PDF.
   ================================================================ */


/* ================================================================
   FUNGSI UTAMA — Jana dan buka tetingkap cetak
   ================================================================ */
function bukaCetakJadual(sukanId) {
  const format      = state.formatSukan[sukanId] || 'biasa';
  const adaMatrix   = format === 'round_robin' && (state.roundRobin[sukanId]?.peserta?.length >= 2);
  const adaBracket  = format === 'kumpulan' && state.bracket?.[sukanId] &&
    ['suku_akhir','separuh_akhir','final'].some(f => state.bracket[sukanId][f]?.length > 0);

  /* Kalau tiada pilihan tambahan, terus cetak */
  if (!adaMatrix && !adaBracket) {
    _bukaTerusCetak(sukanId, true, false, false);
    return;
  }

  /* Bina pilihan ikut format */
  const pilihanTambahan = adaMatrix ? `
    <label class="pilihan-cetak-item">
      <input type="radio" name="pc" value="matrix"/>
      <div class="pc-label">
        <span class="pc-icon">🔲</span>
        <div>
          <div class="pc-nama">Jadual Matrix Sahaja</div>
          <div class="pc-desc">Jadual petak siapa lawan siapa</div>
        </div>
      </div>
    </label>
    <label class="pilihan-cetak-item">
      <input type="radio" name="pc" value="kedua"/>
      <div class="pc-label">
        <span class="pc-icon">📄</span>
        <div>
          <div class="pc-nama">Jadual + Matrix</div>
          <div class="pc-desc">Matrix di atas, jadual penuh di bawah</div>
        </div>
      </div>
    </label>
  ` : adaBracket ? `
    <label class="pilihan-cetak-item">
      <input type="radio" name="pc" value="bracket"/>
      <div class="pc-label">
        <span class="pc-icon">🏆</span>
        <div>
          <div class="pc-nama">Bracket Knockout Sahaja</div>
          <div class="pc-desc">Suku Akhir → Separuh Akhir → Final</div>
        </div>
      </div>
    </label>
    <label class="pilihan-cetak-item">
      <input type="radio" name="pc" value="kedua"/>
      <div class="pc-label">
        <span class="pc-icon">📄</span>
        <div>
          <div class="pc-nama">Jadual + Bracket</div>
          <div class="pc-desc">Jadual kumpulan dan bracket knockout sekali</div>
        </div>
      </div>
    </label>
  ` : '';

  const overlay = document.createElement('div');
  overlay.id = 'popup-cetak-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.7);
    display:flex;align-items:center;justify-content:center;z-index:9999;
  `;
  overlay.innerHTML = `
    <div style="
      background:#0D1B2E;border:1px solid rgba(245,166,35,0.3);
      border-radius:16px;padding:28px 32px;width:360px;max-width:92vw;
      box-shadow:0 20px 60px rgba(0,0,0,0.5);
    ">
      <div style="
        font-family:'Barlow Condensed',sans-serif;font-weight:800;
        font-size:20px;letter-spacing:1px;margin-bottom:6px;color:#F5F7FA;
      ">🖨️ Pilih Kandungan Cetak</div>
      <div style="font-size:13px;color:#7A8BAA;margin-bottom:22px;">
        Pilih apa yang ingin dicetak atau disimpan sebagai PDF.
      </div>

      <div style="display:grid;gap:10px;margin-bottom:24px">
        <label class="pilihan-cetak-item">
          <input type="radio" name="pc" value="jadual" checked/>
          <div class="pc-label">
            <span class="pc-icon">📋</span>
            <div>
              <div class="pc-nama">Jadual Penuh Sahaja</div>
              <div class="pc-desc">Semua perlawanan tersusun ikut masa</div>
            </div>
          </div>
        </label>
        ${pilihanTambahan}
      </div>

      <div style="display:flex;gap:10px">
        <button onclick="document.getElementById('popup-cetak-overlay').remove()"
          style="flex:1;padding:11px;background:transparent;
            border:1px solid rgba(122,139,170,0.4);color:#7A8BAA;
            border-radius:8px;cursor:pointer;font-size:14px;">
          Batal
        </button>
        <button onclick="
            const v = document.querySelector('[name=pc]:checked').value;
            _bukaTerusCetak('${sukanId}',
              v !== 'matrix' && v !== 'bracket',
              v === 'matrix' || v === 'kedua',
              v === 'bracket' || v === 'kedua'
            );
            document.getElementById('popup-cetak-overlay').remove()"
          style="flex:2;padding:11px;
            background:linear-gradient(135deg,#E8960F,#F5A623);
            border:none;color:#0A1628;border-radius:8px;
            cursor:pointer;font-weight:800;font-size:14px;
            font-family:'Barlow Condensed',sans-serif;letter-spacing:0.5px;">
          🖨️ Cetak / Simpan PDF
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}


function _bukaTerusCetak(sukanId, termasukJadual, termasukMatrix, termasukBracket) {
  const sukan  = state.sukan.find(s => s.id === sukanId);
  const format = state.formatSukan[sukanId] || 'biasa';

  let semua   = [];
  let peserta = [];

  if (format === 'round_robin') {
    const rr = state.roundRobin[sukanId] || {};
    semua    = (rr.perlawanan || []).map(m => ({ ...m, _kumpulan: 'Round Robin' }));
    peserta  = rr.peserta || [];
  } else {
    semua = state.jadual
      .filter(m => m.sukanId === sukanId)
      .map(m => ({ ...m, _kumpulan: m.kumpulan
        ? (state.kumpulanSukan[sukanId]?.find(k => k.id === m.kumpulan)?.nama || 'Kumpulan ' + m.kumpulan)
        : labelPeringkat(m.peringkat || '')
      }));
  }

  semua.sort((a, b) => {
    const dA = (a.tarikh || '9999') + (a.masa || '99:99');
    const dB = (b.tarikh || '9999') + (b.masa || '99:99');
    return dA.localeCompare(dB);
  });

  const bracket = termasukBracket ? state.bracket?.[sukanId] : null;

  const html = janaCetakHTML(sukan, semua, format, peserta, termasukJadual, termasukMatrix, bracket);
  const win  = window.open('', '_blank', 'width=900,height=700');
  if (!win) { alert('Sila benarkan pop-up untuk fungsi cetak.'); return; }
  win.document.write(html);
  win.document.close();
  win.onload = () => setTimeout(() => win.print(), 300);
}


/* ================================================================
   JANA HTML UNTUK CETAKAN
   ================================================================ */
function janaCetakHTML(sukan, semua, format, peserta = [], termasukJadual = true, termasukMatrix = false, bracket = null) {

  /* Kumpulkan ikut tarikh */
  const ikutTarikh = {};
  const tanpaTarikh = [];
  semua.forEach(m => {
    if (m.tarikh) {
      if (!ikutTarikh[m.tarikh]) ikutTarikh[m.tarikh] = [];
      ikutTarikh[m.tarikh].push(m);
    } else {
      tanpaTarikh.push(m);
    }
  });

  const tarikhKeys = Object.keys(ikutTarikh).sort();

  /* ── Jadual Matrix (untuk round robin, kalau dipilih) ── */
  let matrixCetak = '';
  if (termasukMatrix && format === 'round_robin' && peserta.length >= 2) {
    const selLebar = Math.max(60, Math.floor(500 / peserta.length));
    const rows = peserta.map(rumah => {
      const sels = peserta.map(tamu => {
        if (rumah === tamu) return `<td class="mx-diag"></td>`;
        const m = semua.find(x =>
          (x.rumah === rumah && x.tamu === tamu) ||
          (x.rumah === tamu  && x.tamu === rumah)
        );
        if (!m) return `<td class="mx-empty">—</td>`;
        const isR  = m.rumah === rumah;
        const skR  = isR ? m.scoreRumah : m.scoreTamu;
        const skT  = isR ? m.scoreTamu  : m.scoreRumah;
        if (m.status === 'selesai') {
          const cls = skR > skT ? 'mx-w' : skR < skT ? 'mx-l' : 'mx-d';
          const lbl = skR > skT ? 'W'    : skR < skT ? 'L'    : 'D';
          return `<td class="mx-result ${cls}"><span class="mx-lbl ${cls}">${lbl}</span><br/>${skR}—${skT}</td>`;
        } else if (m.status === 'sedang_berlangsung') {
          return `<td class="mx-result mx-live">LIVE<br/>${skR}—${skT}</td>`;
        } else {
          return `<td class="mx-pending">${m.masa || 'vs'}</td>`;
        }
      }).join('');
      return `<tr><td class="mx-label">${rumah}</td>${sels}</tr>`;
    }).join('');

    matrixCetak = `
      <div class="seksyen-header">🔲 Jadual Matrix Round Robin</div>
      <div style="overflow-x:auto;margin-bottom:28px">
        <table class="mx-table">
          <thead>
            <tr>
              <th class="mx-corner"></th>
              ${peserta.map(p => `<th class="mx-head" style="width:${selLebar}px">${p}</th>`).join('')}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="mx-legenda">
        <span class="mx-lbl mx-w" style="padding:2px 7px">W</span> Menang &nbsp;&nbsp;
        <span class="mx-lbl mx-l" style="padding:2px 7px">L</span> Kalah &nbsp;&nbsp;
        <span class="mx-lbl mx-d" style="padding:2px 7px">D</span> Seri &nbsp;&nbsp;
        <span style="font-size:10px;color:#888">masa = belum dimainkan</span>
      </div>
      <div style="height:24px"></div>
    `;
  }

  let badan = matrixCetak;

  if (termasukJadual) {
  tarikhKeys.forEach(tarikh => {
    const senarai = ikutTarikh[tarikh];
    const tarikhLabel = new Date(tarikh + 'T00:00:00')
      .toLocaleDateString('ms-MY', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    badan += `
      <div class="hari-blok">
        <div class="hari-header">${tarikhLabel}</div>
        <table class="jadual-table">
          <thead>
            <tr>
              <th style="width:60px">Masa</th>
              <th style="width:130px">Peringkat</th>
              <th>Tuan Rumah</th>
              <th style="width:80px">Score</th>
              <th>Pasukan Tamu</th>
              <th style="width:110px">Gelanggang</th>
              <th style="width:80px">Status</th>
            </tr>
          </thead>
          <tbody>
            ${senarai.map((m, i) => {
              const statusKls = m.status === 'selesai' ? 'selesai'
                              : m.status === 'sedang_berlangsung' ? 'live'
                              : '';
              const statusLabel = m.status === 'selesai'             ? '✓ Selesai'
                                : m.status === 'sedang_berlangsung'  ? '🔴 Live'
                                : 'Akan Datang';
              const score = (m.status === 'selesai' || m.status === 'sedang_berlangsung')
                ? `${m.scoreRumah || 0} — ${m.scoreTamu || 0}`
                : 'vs';

              return `
                <tr class="${i % 2 === 0 ? 'genap' : 'ganjil'} ${statusKls}">
                  <td class="masa">${m.masa || '—'}</td>
                  <td class="kumpulan">${m._kumpulan || '—'}</td>
                  <td class="pasukan rumah">${m.rumah}</td>
                  <td class="score">${score}</td>
                  <td class="pasukan tamu">${m.tamu}</td>
                  <td class="gelanggang">${m.gelanggang || '—'}</td>
                  <td class="status ${statusKls}">${statusLabel}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  });

  /* Perlawanan tanpa tarikh */
  if (tanpaTarikh.length > 0) {
    badan += `
      <div class="hari-blok">
        <div class="hari-header" style="color:#888">Tarikh Belum Ditetapkan</div>
        <table class="jadual-table">
          <thead>
            <tr>
              <th>Peringkat</th>
              <th>Tuan Rumah</th>
              <th style="width:80px">Score</th>
              <th>Pasukan Tamu</th>
              <th>Gelanggang</th>
            </tr>
          </thead>
          <tbody>
            ${tanpaTarikh.map((m, i) => `
              <tr class="${i % 2 === 0 ? 'genap' : 'ganjil'}">
                <td class="kumpulan">${m._kumpulan || '—'}</td>
                <td class="pasukan rumah">${m.rumah}</td>
                <td class="score">vs</td>
                <td class="pasukan tamu">${m.tamu}</td>
                <td class="gelanggang">${m.gelanggang || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  }  /* end if termasukJadual */

  /* ── Bracket cetak ── */
  if (bracket) {
    const FASA = [
      { key: 'suku_akhir',    label: '⚔️ Suku Akhir'    },
      { key: 'separuh_akhir', label: '🥊 Separuh Akhir' },
      { key: 'tempat_ketiga', label: '🥉 Tempat Ke-3'   },
      { key: 'final',         label: '🏆 Final'          },
    ];

    FASA.forEach(({ key, label }) => {
      const senarai = bracket[key] || [];
      if (senarai.length === 0) return;

      badan += `
        <div class="hari-blok">
          <div class="hari-header" style="border-left-color:${key==='final'?'#F5A623':'#0A1628'};
            ${key==='final'?'color:#E8960F;font-size:15px':''}">${label}</div>
          <table class="jadual-table">
            <thead>
              <tr>
                <th style="width:60px">Masa</th>
                <th>Pasukan 1</th>
                <th style="width:80px;text-align:center">Score</th>
                <th>Pasukan 2</th>
                <th style="width:110px">Gelanggang</th>
                <th style="width:90px">Keputusan</th>
              </tr>
            </thead>
            <tbody>
              ${senarai.map((m, i) => {
                const r = parseInt(m.scoreRumah)||0, t = parseInt(m.scoreTamu)||0;
                const selesai = m.status === 'selesai';
                const menang  = selesai ? (r>t ? m.rumah : r<t ? m.tamu : 'Seri') : '—';
                const score   = selesai || m.status==='sedang_berlangsung' ? `${r} — ${t}` : 'vs';
                return `
                  <tr class="${i%2===0?'genap':'ganjil'} ${selesai?'selesai':''}">
                    <td class="masa">${m.masa||'—'}</td>
                    <td class="pasukan rumah" style="${selesai&&menang===m.rumah?'font-weight:800':''}">${m.rumah||'⏳'}</td>
                    <td class="score">${score}</td>
                    <td class="pasukan tamu" style="${selesai&&menang===m.tamu?'font-weight:800':''}">${m.tamu||'⏳'}</td>
                    <td class="gelanggang">${m.gelanggang||'—'}</td>
                    <td style="text-align:center;font-weight:700;color:${selesai?'#1a7a42':'#888'}">${menang}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    });
  }

  const tarikhCetak = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8"/>
  <title>Jadual Perlawanan — ${sukan?.nama || 'SPEKMA'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
      color: #1a1a2e;
      background: #fff;
      padding: 20px 24px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 3px solid #0A1628;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header-kiri {}
    .tajuk-utama {
      font-size: 20px;
      font-weight: 800;
      color: #0A1628;
      letter-spacing: 0.5px;
    }
    .tajuk-sub {
      font-size: 12px;
      color: #555;
      margin-top: 3px;
    }
    .tajuk-sukan {
      font-size: 15px;
      font-weight: 700;
      color: #E8960F;
      margin-top: 6px;
    }
    .header-kanan {
      text-align: right;
      font-size: 10px;
      color: #888;
    }
    .logo-cetak {
      width: 44px; height: 44px;
      background: #F5A623;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 12px;
      color: #0A1628;
      margin-bottom: 6px;
      margin-left: auto;
    }

    /* ── Statistik ringkas ── */
    .stat-bar {
      display: flex;
      gap: 16px;
      background: #f5f7fa;
      border: 1px solid #e0e4ed;
      border-radius: 8px;
      padding: 10px 16px;
      margin-bottom: 20px;
    }
    .stat-item { text-align: center; }
    .stat-num  { font-size: 18px; font-weight: 800; color: #0A1628; }
    .stat-lbl  { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 1px; }

    /* ── Matrix ── */
    .seksyen-header {
      font-size: 13px; font-weight: 700; color: #0A1628;
      background: #e8ecf5; border-left: 4px solid #F5A623;
      padding: 7px 12px; margin-bottom: 10px;
      border-radius: 0 6px 6px 0;
    }
    .mx-table    { border-collapse: collapse; font-size: 11px; }
    .mx-corner   { background: #e8ecf5; border: 1px solid #ccd0db; min-width: 110px; padding: 6px 10px; }
    .mx-head     { background: #0A1628; color: #fff; font-size: 10px; font-weight: 700;
                   text-align: center; border: 1px solid #ccd0db; padding: 7px 4px;
                   white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }
    .mx-label    { background: #f9fafd; font-weight: 600; font-size: 11px;
                   border: 1px solid #ccd0db; padding: 8px 10px; white-space: nowrap; min-width: 110px; }
    .mx-diag     { background: #e8ecf5; border: 1px solid #ccd0db; }
    .mx-empty    { text-align: center; color: #bbb; border: 1px solid #ccd0db; padding: 8px; }
    .mx-result   { text-align: center; border: 1px solid #ccd0db; padding: 6px 4px; font-size: 11px; font-weight: 600; }
    .mx-result.mx-w   { background: #f0faf4; }
    .mx-result.mx-l   { background: #fff5f5; }
    .mx-result.mx-d   { background: #f9fafd; }
    .mx-result.mx-live{ background: #fff5f5; color: #c0392b; }
    .mx-pending  { text-align: center; border: 1px solid #ccd0db; padding: 8px 4px;
                   font-size: 11px; color: #777; background: #fff; }
    .mx-lbl      { display: inline-block; border-radius: 3px; font-weight: 800;
                   font-size: 10px; padding: 1px 5px; }
    .mx-lbl.mx-w { background: #d4f5e2; color: #1a7a42; }
    .mx-lbl.mx-l { background: #fde8e8; color: #c0392b; }
    .mx-lbl.mx-d { background: #e8ecf5; color: #555; }
    .mx-legenda  { font-size: 11px; color: #666; margin-top: 8px; }

    /* ── Blok setiap hari ── */
    .hari-blok { margin-bottom: 22px; }
    .hari-header {
      font-size: 13px;
      font-weight: 700;
      color: #0A1628;
      background: #e8ecf5;
      border-left: 4px solid #F5A623;
      padding: 7px 12px;
      margin-bottom: 6px;
      border-radius: 0 6px 6px 0;
    }

    /* ── Jadual perlawanan ── */
    .jadual-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .jadual-table th {
      background: #0A1628;
      color: #fff;
      padding: 7px 8px;
      text-align: left;
      font-size: 10px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .jadual-table td {
      padding: 7px 8px;
      border-bottom: 1px solid #e8ecf5;
      vertical-align: middle;
    }
    .jadual-table tr.genap td  { background: #fff; }
    .jadual-table tr.ganjil td { background: #f9fafd; }

    .jadual-table tr:hover td { background: #fff8ed; }

    /* Status warna */
    .jadual-table tr.selesai td { background: #f0faf4; }
    .jadual-table tr.live td    { background: #fff5f5; }

    .masa      { font-weight: 700; color: #0A1628; white-space: nowrap; }
    .kumpulan  { font-size: 10px; color: #666; }
    .pasukan   { font-weight: 600; }
    .rumah     { color: #0A1628; }
    .tamu      { color: #333; }
    .score     { text-align: center; font-weight: 800; font-size: 13px; color: #E8960F; white-space: nowrap; }
    .gelanggang{ font-size: 10px; color: #777; }

    .status         { font-size: 10px; text-align: center; }
    .status.selesai { color: #2d8c4e; font-weight: 600; }
    .status.live    { color: #c0392b; font-weight: 700; }

    /* ── Footer ── */
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e0e4ed;
      font-size: 9px;
      color: #aaa;
      display: flex;
      justify-content: space-between;
    }

    /* ── Print settings ── */
    @media print {
      body { padding: 10px 14px; }
      .no-print { display: none !important; }
      .hari-blok { page-break-inside: avoid; }
      .jadual-table tr { page-break-inside: avoid; }
      @page {
        size: A4 landscape;
        margin: 12mm 10mm;
      }
    }

    /* ── Butang cetak (hilang bila print) ── */
    .btn-cetak {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 20px;
      background: #0A1628;
      color: #fff;
      border: none;
      border-radius: 7px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 20px;
      transition: background 0.2s;
    }
    .btn-cetak:hover { background: #162040; }
    .btn-tutup {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      background: transparent;
      color: #666;
      border: 1px solid #ccc;
      border-radius: 7px;
      font-size: 13px;
      cursor: pointer;
      margin-bottom: 20px;
      margin-left: 8px;
    }
  </style>
</head>
<body>

  <!-- Butang (hilang bila print) -->
  <div class="no-print" style="margin-bottom:16px">
    <button class="btn-cetak" onclick="window.print()">
      🖨️ Cetak / Simpan PDF
    </button>
    <button class="btn-tutup" onclick="window.close()">
      ✕ Tutup
    </button>
    <span style="font-size:11px;color:#888;margin-left:12px">
      Untuk simpan PDF: pilih "Save as PDF" dalam dialog print
    </span>
  </div>

  <!-- Header -->
  <div class="header">
    <div class="header-kiri">
      <div class="tajuk-utama">SPEKMA 2025</div>
      <div class="tajuk-sub">Sukan Pelajar TVET MARA</div>
      <div class="tajuk-sukan">
        📋 Jadual Perlawanan — ${sukan?.icon || '🏅'} ${sukan?.nama || 'Semua Sukan'}
      </div>
    </div>
    <div class="header-kanan">
      <div class="logo-cetak">SPKM</div>
      <div>Dicetak: ${tarikhCetak}</div>
    </div>
  </div>

  <!-- Statistik ringkas -->
  <div class="stat-bar">
    <div class="stat-item">
      <div class="stat-num">${semua.length}</div>
      <div class="stat-lbl">Jumlah Perlawanan</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${tarikhKeys.length}</div>
      <div class="stat-lbl">Hari Pertandingan</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${semua.filter(m => m.status === 'selesai').length}</div>
      <div class="stat-lbl">Selesai</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${semua.filter(m => m.status === 'sedang_berlangsung').length}</div>
      <div class="stat-lbl">Sedang Berlangsung</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${semua.filter(m => m.status === 'akan_datang').length}</div>
      <div class="stat-lbl">Akan Datang</div>
    </div>
  </div>

  <!-- Kandungan jadual -->
  ${badan || '<p style="color:#888;text-align:center;padding:40px">Tiada perlawanan dijana lagi.</p>'}

  <!-- Footer -->
  <div class="footer">
    <span>SPEKMA 2025 — Sistem Pengurusan Sukan Pelajar TVET MARA</span>
    <span>Dicetak: ${tarikhCetak}</span>
  </div>

</body>
</html>`;
}