/* ================================================================
   auth.js — LOGIN & PENGURUSAN STAFF
   ================================================================

   FAIL INI untuk:
   ✏️  Tukar kata laluan asal
   ✏️  Tambah staff asal (atau guna tab Tetapan dalam app)

   Staff boleh juga ditambah/dipadam terus dalam app
   melalui ⚙️ Tetapan → Tambah Staff
   ================================================================ */


/* ----------------------------------------------------------------
   KATA LALUAN ASAL
   Boleh diubah dalam app (Tetapan → Urus Akaun → Tukar)
   atau terus di sini.
   ---------------------------------------------------------------- */
let PASSWORD_TETAP = "tvet2025";


/* ----------------------------------------------------------------
   SENARAI STAFF ASAL
   Staff boleh ditambah/dipadam dalam app tanpa edit fail ini.
   Tapi kalau nak tetapkan staff secara kekal, tambah di sini.
   ---------------------------------------------------------------- */
const STAFF_ASAL = [
  { ic4: "1234", nama: "Admin SPEKMA", jawatan: "Pentadbir Sistem" },
  /* Tambah staff asal:
  { ic4: "XXXX", nama: "Nama Staff", jawatan: "Jawatan" },
  */
];


/* ================================================================
   FUNGSI LOGIN — jangan ubah bahagian di bawah
   ================================================================ */

/* Buka modal login */
function bukaPanelLogin() {
  document.getElementById('modal-overlay').style.display = 'flex';
  document.getElementById('modal-error').style.display   = 'none';
  document.getElementById('input-ic').value              = '';
  document.getElementById('input-password').value        = '';
  setTimeout(() => document.getElementById('input-ic').focus(), 100);
}

/* Tutup modal */
function tutupPanelLogin() {
  document.getElementById('modal-overlay').style.display = 'none';
}

/* Klik luar kotak → tutup */
function tutupModal(e) {
  if (e.target === document.getElementById('modal-overlay')) tutupPanelLogin();
}

/* Togol tunjuk/sembunyi kata laluan dalam modal */
function togolPassword() {
  const inp = document.getElementById('input-password');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

/* Cuba log masuk */
function cubaLogin() {
  const ic4 = (document.getElementById('input-ic')?.value || '').trim();
  const pwd  = (document.getElementById('input-password')?.value || '').trim();
  const errEl = document.getElementById('modal-error');

  if (!/^\d{4}$/.test(ic4)) {
    errEl.textContent   = '⚠️ Sila masukkan 4 digit nombor IC.';
    errEl.style.display = 'block';
    return;
  }

  const staff = state.staff.find(s => s.ic4 === ic4);

  if (!staff || pwd !== state.password) {
    errEl.textContent   = '⚠️ IC atau kata laluan tidak sah.';
    errEl.style.display = 'block';
    document.getElementById('input-password').value = '';
    return;
  }

  /* Berjaya */
  state.staffLogin = staff;
  tutupPanelLogin();

  document.getElementById('btn-buka-login').style.display    = 'none';
  document.getElementById('staff-logged-info').style.display = 'flex';
  document.getElementById('nama-staff-chip').textContent     = '👤 ' + staff.nama;

  kemaskinMobAuth();
  render();
}

/* Log keluar */
function logKeluar() {
  if (!confirm('Anda pasti mahu log keluar?')) return;
  state.staffLogin   = null;
  state.editingAcara = null;
  if (state.tab === 'tetapan') state.tab = 'kedudukan';

  document.getElementById('btn-buka-login').style.display    = 'inline-flex';
  document.getElementById('staff-logged-info').style.display = 'none';

  kemaskinMobAuth();
  render();
}

/* Kemas kini menu mobile ikut status login */
function kemaskinMobAuth() {
  const mobAuth = document.getElementById('mob-auth');
  if (!mobAuth) return;
  if (state.staffLogin) {
    mobAuth.innerHTML = `
      <div style="padding:8px 14px;font-size:13px;color:var(--muted)">
        Login: <strong style="color:var(--text)">${state.staffLogin.nama}</strong>
      </div>
      <button class="mob-btn" onclick="setTab('tetapan');togolMobileMenu()">⚙️ Tetapan</button>
      <button class="mob-btn" style="color:#ff8a80;border-color:rgba(231,76,60,0.4)"
        onclick="logKeluar();togolMobileMenu()">Log Keluar</button>
    `;
  } else {
    mobAuth.innerHTML = `
      <button class="mob-btn mob-login-btn"
        onclick="bukaPanelLogin();togolMobileMenu()">🔒 Staff Login</button>
    `;
  }
}


/* ================================================================
   FUNGSI URUS STAFF (dipanggil dari tetapan.js)
   ================================================================ */

/* Togol tunjuk/sembunyi kata laluan dalam Tetapan */
function togolTunjukPw() {
  const el  = document.getElementById('pw-papar');
  const btn = document.getElementById('btn-tunjuk-pw');
  if (!el) return;
  const hidden = el.dataset.hidden !== 'false';
  el.textContent  = hidden ? state.password : '•'.repeat(state.password.length);
  el.dataset.hidden = hidden ? 'false' : 'true';
  if (btn) btn.textContent = hidden ? 'Sembunyi' : 'Tunjuk';
}

/* Buka form tukar kata laluan */
function bukaTukarPw() {
  const form = document.getElementById('form-tukar-pw');
  if (form) {
    form.style.display = 'block';
    document.getElementById('input-pw-baru')?.focus();
  }
}

/* Simpan kata laluan baru */
function tukarPassword() {
  const baru = document.getElementById('input-pw-baru')?.value?.trim();
  if (!baru)           { alert('Sila masukkan kata laluan baru.'); return; }
  if (baru.length < 4) { alert('Kata laluan mesti sekurang-kurangnya 4 aksara.'); return; }
  if (!confirm('Tukar kata laluan kepada "' + baru + '"?\n\nSemua staff perlu guna kata laluan baru.')) return;
  state.password = baru;
  simpanData();
  render();
}

/* Tambah staff baru */
function tambahStaff() {
  const nama    = document.getElementById('staff-nama')?.value?.trim();
  const jawatan = document.getElementById('staff-jawatan')?.value?.trim();
  const ic4     = document.getElementById('staff-ic4')?.value?.trim();
  const errEl   = document.getElementById('staff-error');

  if (!nama) {
    errEl.textContent = '⚠️ Sila masukkan nama staff.';
    errEl.style.display = 'block'; return;
  }
  if (!ic4 || !/^\d{4}$/.test(ic4)) {
    errEl.textContent = '⚠️ IC mestilah tepat 4 digit nombor.';
    errEl.style.display = 'block'; return;
  }
  if (state.staff.find(s => s.ic4 === ic4)) {
    errEl.textContent = '⚠️ IC ' + ic4 + ' sudah wujud dalam senarai staff.';
    errEl.style.display = 'block'; return;
  }

  errEl.style.display = 'none';
  state.staff.push({ ic4, nama, jawatan: jawatan || 'Staff' });
  simpanData();

  const ok = document.getElementById('staff-berjaya');
  if (ok) { ok.style.display = 'block'; setTimeout(() => render(), 1200); }
  else render();
}

/* Padam staff */
function padamStaff(i) {
  if (state.staff.length <= 1) {
    alert('Tidak boleh padam — mesti ada sekurang-kurangnya seorang staff.');
    return;
  }
  if (state.staffLogin?.ic4 === state.staff[i].ic4) {
    alert('Tidak boleh padam akaun yang sedang digunakan.');
    return;
  }
  if (!confirm('Padam staff "' + state.staff[i].nama + '"?')) return;
  state.staff.splice(i, 1);
  simpanData();
  render();
}