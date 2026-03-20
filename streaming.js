/* ================================================================
   streaming.js — PENGURUSAN LINK LIVE STREAMING
   ================================================================

   Awam  : Klik tab 📺 Live → tengok semua link streaming
   Staff : Login → tab 📺 Live → + Tambah Link

   DATA: state.streaming = [
     {
       id        : unik
       sukanId   : id sukan (boleh null = umum)
       nama      : nama platform/saluran
       url       : pautan streaming
       platform  : 'youtube' | 'facebook' | 'tiktok' | 'lain'
       aktif     : true/false
     }
   ]
   ================================================================ */


/* ================================================================
   RENDER — HALAMAN STREAMING (awam)
   ================================================================ */
function renderStreaming() {
  const isStaff  = !!state.staffLogin;
  const senaraiAktif = state.streaming.filter(s => s.aktif !== false);

  return `
    <!-- Hero -->
    <div class="stream-hero">
      <div class="stream-hero-dot"></div>
      <div class="stream-hero-title">📺 Live Streaming</div>
      <div class="stream-hero-sub">
        Tonton siaran langsung perlawanan SPEKMA 2025
      </div>
    </div>

    <!-- Butang urus (staff) -->
    ${isStaff ? `
      <div style="margin-bottom:20px">
        <button class="tambah-perlawanan-btn"
          onclick="state.streamTab='urus';render()">
          ⚙️ Urus Link Streaming
        </button>
      </div>
    ` : ''}

    <!-- Tiada link -->
    ${senaraiAktif.length === 0 ? `
      <div class="kosong-box">
        <div style="font-size:44px;margin-bottom:14px">📺</div>
        <div style="font-weight:600;font-size:16px;margin-bottom:8px">
          Tiada siaran langsung buat masa ini
        </div>
        <div style="font-size:13px;color:var(--muted)">
          Semak semula sebentar lagi atau hubungi penganjur untuk maklumat lanjut.
        </div>
      </div>
    ` : `
      <!-- Grid platform streaming -->
      <div class="stream-grid">
        ${senaraiAktif.map(s => renderKadStream(s)).join('')}
      </div>
    `}
  `;
}


/* ================================================================
   RENDER — HALAMAN URUS STREAMING (staff)
   ================================================================ */
function renderUrusStreaming() {
  const semua = state.streaming;

  return `
    <button class="back-btn" onclick="state.streamTab='awam';render()">
      ← Balik ke Streaming
    </button>
    <div class="section-title">📺 Urus Link Streaming</div>

    <!-- Form tambah link baru -->
    <div class="set-card" style="border-color:rgba(245,166,35,0.3);margin-bottom:20px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;
        font-size:15px;color:var(--gold);margin-bottom:14px">
        + Tambah Link Streaming Baru
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <div>
          <div class="field-label">Nama Saluran / Platform</div>
          <input type="text" id="stream-nama" class="field-input"
            placeholder="Contoh: YouTube SPEKMA 2025"
            style="padding:9px 12px;font-size:14px"/>
        </div>
        <div>
          <div class="field-label">Platform</div>
          <select id="stream-platform" class="podium-select"
            style="padding:10px 12px;font-size:14px;width:100%">
            <option value="youtube">▶️ YouTube</option>
            <option value="facebook">📘 Facebook Live</option>
            <option value="tiktok">🎵 TikTok Live</option>
            <option value="instagram">📸 Instagram Live</option>
            <option value="lain">🔗 Lain-lain</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:10px">
        <div class="field-label">Pautan (URL) Streaming</div>
        <input type="url" id="stream-url" class="field-input"
          placeholder="https://youtube.com/live/..."
          style="padding:9px 12px;font-size:14px"/>
      </div>

      <div style="margin-bottom:14px">
        <div class="field-label">Sukan Berkaitan (pilihan)</div>
        <select id="stream-sukan" class="podium-select"
          style="padding:10px 12px;font-size:14px;width:100%;max-width:320px">
          <option value="">-- Semua Sukan (Umum) --</option>
          ${state.sukan.map(s =>
            `<option value="${s.id}">${s.icon || '🏅'} ${s.nama}</option>`
          ).join('')}
        </select>
      </div>

      <div id="stream-error"
        style="display:none;color:#ff8a80;font-size:13px;
          background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);
          padding:8px 12px;border-radius:7px;margin-bottom:10px">
      </div>

      <button class="save-btn" style="padding:10px 24px"
        onclick="tambahStreamLink()">
        + Tambah Link
      </button>
    </div>

    <!-- Senarai link semasa -->
    <div class="set-card-label" style="margin-bottom:12px">
      Link Berdaftar &nbsp;<span class="count-chip">${semua.length}</span>
    </div>

    ${semua.length === 0 ? `
      <div style="color:var(--muted);font-size:14px;padding:16px 0">
        Tiada link lagi. Tambah di atas.
      </div>
    ` : `
      <div style="display:grid;gap:8px">
        ${semua.map((s, i) => `
          <div class="stream-urus-row ${s.aktif === false ? 'tidak-aktif' : ''}">
            <div class="stream-urus-icon">
              ${streamIcon(s.platform)}
            </div>
            <div class="stream-urus-info">
              <div class="stream-urus-nama">${s.nama}</div>
              <div class="stream-urus-url">${s.url}</div>
              ${s.sukanId ? `
                <div class="stream-urus-sukan">
                  ${state.sukan.find(sk => sk.id === s.sukanId)?.icon || '🏅'}
                  ${state.sukan.find(sk => sk.id === s.sukanId)?.nama || ''}
                </div>
              ` : `
                <div class="stream-urus-sukan">🔗 Semua Sukan</div>
              `}
            </div>
            <div class="stream-urus-aksi">
              <button class="stream-toggle-btn ${s.aktif === false ? '' : 'on'}"
                onclick="togolStreamAktif(${i})">
                ${s.aktif === false ? '▶ Aktifkan' : '⏸ Nyahaktif'}
              </button>
              <button class="aksi-btn hapus"
                onclick="padamStreamLink(${i})">🗑</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}


/* ================================================================
   KAD STREAMING (paparan awam)
   ================================================================ */
function renderKadStream(s) {
  const sukan    = s.sukanId ? state.sukan.find(sk => sk.id === s.sukanId) : null;
  const icon     = streamIcon(s.platform);
  const warna    = streamWarna(s.platform);

  return `
    <div class="stream-kad" style="border-color:${warna}33">
      <div class="stream-kad-header" style="background:${warna}15">
        <span class="stream-kad-icon">${icon}</span>
        <div class="stream-live-badge">
          <span class="stream-live-dot"></span>
          LIVE
        </div>
      </div>

      <div class="stream-kad-body">
        <div class="stream-kad-nama">${s.nama}</div>
        ${sukan ? `
          <div class="stream-kad-sukan">
            ${sukan.icon || '🏅'} ${sukan.nama}
          </div>
        ` : `
          <div class="stream-kad-sukan">🎯 Siaran Rasmi</div>
        `}
      </div>

      <a href="${s.url}" target="_blank" rel="noopener noreferrer"
        class="stream-tonton-btn" style="background:${warna}">
        ${icon} Tonton Sekarang
      </a>
    </div>
  `;
}


/* ================================================================
   HELPER — icon & warna ikut platform
   ================================================================ */
function streamIcon(platform) {
  return {
    youtube:   '▶️',
    facebook:  '📘',
    tiktok:    '🎵',
    instagram: '📸',
    lain:      '🔗',
  }[platform] || '🔗';
}

function streamWarna(platform) {
  return {
    youtube:   '#FF0000',
    facebook:  '#1877F2',
    tiktok:    '#010101',
    instagram: '#E1306C',
    lain:      '#F5A623',
  }[platform] || '#F5A623';
}


/* ================================================================
   FUNGSI PENGURUSAN
   ================================================================ */

/* Tambah link streaming baru */
function tambahStreamLink() {
  const nama     = document.getElementById('stream-nama')?.value?.trim();
  const url      = document.getElementById('stream-url')?.value?.trim();
  const platform = document.getElementById('stream-platform')?.value || 'lain';
  const sukanId  = document.getElementById('stream-sukan')?.value || '';
  const errEl    = document.getElementById('stream-error');

  if (!nama) {
    errEl.textContent = '⚠️ Sila masukkan nama saluran.';
    errEl.style.display = 'block'; return;
  }
  if (!url || !url.startsWith('http')) {
    errEl.textContent = '⚠️ Sila masukkan pautan URL yang sah (mesti bermula dengan http).';
    errEl.style.display = 'block'; return;
  }

  errEl.style.display = 'none';
  state.streaming.push({
    id:       'str_' + Date.now(),
    nama,
    url,
    platform,
    sukanId:  sukanId || null,
    aktif:    true,
  });

  simpanData();
  render();
}

/* Togol aktif/tidak aktif */
function togolStreamAktif(i) {
  const s = state.streaming[i];
  if (!s) return;
  s.aktif = s.aktif === false ? true : false;
  simpanData();
  render();
}

/* Padam link */
function padamStreamLink(i) {
  const s = state.streaming[i];
  if (!confirm('Padam link "' + s.nama + '"?')) return;
  state.streaming.splice(i, 1);
  simpanData();
  render();
}
