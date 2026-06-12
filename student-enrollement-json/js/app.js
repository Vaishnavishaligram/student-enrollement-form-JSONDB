/*
 * app.js  –  Student Enrollment Form
 * Database : JSONdb  (localStorage-backed, no server required)
 * DB name  : school_db
 * Collection: student_table
 *
 * States
 *   IDLE     → only Roll No enabled; all buttons disabled
 *   NEW      → Roll No not found; all fields + Save + Reset enabled
 *   EXISTING → Roll No found; other fields + Update + Reset enabled
 */

'use strict';

/* ── Wait for DOM ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── JSONdb setup ── */
  const db         = jsondb.get('school_db');
  const students   = db.collection('student_table');

  /* ── DOM refs ── */
  const rollInput  = document.getElementById('roll_no');
  const fullName   = document.getElementById('full_name');
  const classInput = document.getElementById('class');
  const birthDate  = document.getElementById('birth_date');
  const address    = document.getElementById('address');
  const enrollDate = document.getElementById('enrollment_date');

  const btnSave    = document.getElementById('btnSave');
  const btnUpdate  = document.getElementById('btnUpdate');
  const btnReset   = document.getElementById('btnReset');
  const banner     = document.getElementById('statusBanner');
  const recordsBody= document.getElementById('recordsBody');
  const recordCount= document.getElementById('recordCount');

  const allFields  = [fullName, classInput, birthDate, address, enrollDate];

  let debounceTimer = null;

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */

  function showBanner(msg, type = 'info') {
    banner.textContent    = msg;
    banner.className      = type;
    banner.style.display  = 'block';
  }
  function hideBanner() { banner.style.display = 'none'; }

  function clearFields() {
    allFields.forEach(f => f.tagName === 'SELECT' ? f.selectedIndex = 0 : f.value = '');
  }

  function collectData() {
    return {
      roll_no:          rollInput.value.trim(),
      full_name:        fullName.value.trim(),
      class:            classInput.value,
      birth_date:       birthDate.value,
      address:          address.value.trim(),
      enrollment_date:  enrollDate.value,
    };
  }

  function validate(data) {
    const labels = {
      roll_no: 'Roll No', full_name: 'Full Name', class: 'Class',
      birth_date: 'Birth Date', address: 'Address', enrollment_date: 'Enrollment Date'
    };
    for (const [k, v] of Object.entries(data)) {
      if (!v) return `"${labels[k]}" cannot be empty.`;
    }
    return null;
  }

  function populateForm(rec) {
    fullName.value   = rec.full_name        || '';
    classInput.value = rec.class            || '';
    birthDate.value  = rec.birth_date       || '';
    address.value    = rec.address          || '';
    enrollDate.value = rec.enrollment_date  || '';
  }

  /* ═══════════════════════════════════════════
     STATE MACHINE
  ═══════════════════════════════════════════ */

  function setMode(mode) {
    hideBanner();

    if (mode === 'IDLE') {
      rollInput.disabled = false;
      rollInput.value    = '';
      clearFields();
      allFields.forEach(f => f.disabled = true);
      btnSave.disabled   = true;
      btnUpdate.disabled = true;
      btnReset.disabled  = true;
      rollInput.focus();
    }
    else if (mode === 'NEW') {
      rollInput.disabled = false;           // keep editable
      allFields.forEach(f => f.disabled = false);
      btnSave.disabled   = false;
      btnUpdate.disabled = true;
      btnReset.disabled  = false;
      fullName.focus();
    }
    else if (mode === 'EXISTING') {
      rollInput.disabled = true;            // lock PK
      allFields.forEach(f => f.disabled = false);
      btnSave.disabled   = true;
      btnUpdate.disabled = false;
      btnReset.disabled  = false;
      fullName.focus();
    }
  }

  /* ═══════════════════════════════════════════
     ROLL NO — live check (debounced 400 ms)
  ═══════════════════════════════════════════ */

  rollInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    hideBanner();
    const val = rollInput.value.trim();

    if (!val) { setMode('IDLE'); return; }

    debounceTimer = setTimeout(() => {
      const existing = students.findOne({ roll_no: val });

      if (existing) {
        populateForm(existing);
        setMode('EXISTING');
        showBanner(`Roll No "${val}" found — update the record below.`, 'info');
      } else {
        clearFields();
        setMode('NEW');
        showBanner(`Roll No "${val}" is new — fill in the details and Save.`, 'info');
      }
    }, 400);
  });

  /* ═══════════════════════════════════════════
     SAVE  (INSERT)
  ═══════════════════════════════════════════ */

  btnSave.addEventListener('click', () => {
    const data = collectData();
    const err  = validate(data);
    if (err) { showBanner(err, 'error'); return; }

    // Double-check PK uniqueness
    if (students.findOne({ roll_no: data.roll_no })) {
      showBanner('Roll No already exists. Use Update instead.', 'error');
      return;
    }

    students.insert(data);
    showBanner(`✓ Student "${data.full_name}" enrolled successfully!`, 'success');
    refreshTable();
    setTimeout(() => setMode('IDLE'), 1800);
  });

  /* ═══════════════════════════════════════════
     UPDATE
  ═══════════════════════════════════════════ */

  btnUpdate.addEventListener('click', () => {
    const data = collectData();
    const err  = validate(data);
    if (err) { showBanner(err, 'error'); return; }

    const { roll_no, ...changes } = data;
    students.update({ roll_no }, changes);
    showBanner(`✓ Record for "${data.full_name}" updated successfully!`, 'success');
    refreshTable();
    setTimeout(() => setMode('IDLE'), 1800);
  });

  /* ═══════════════════════════════════════════
     RESET
  ═══════════════════════════════════════════ */

  btnReset.addEventListener('click', () => setMode('IDLE'));

  /* ═══════════════════════════════════════════
     RECORDS TABLE  (live view of JSONdb data)
  ═══════════════════════════════════════════ */

  function refreshTable() {
    const all = students.find();
    recordCount.textContent = `${all.length} student${all.length !== 1 ? 's' : ''} in JSONdb`;

    if (!all.length) {
      recordsBody.innerHTML = '<tr><td colspan="6" class="empty-msg">No records yet.</td></tr>';
      return;
    }

    recordsBody.innerHTML = all.map(r => `
      <tr>
        <td><strong>${esc(r.roll_no)}</strong></td>
        <td>${esc(r.full_name)}</td>
        <td>${esc(r.class)}</td>
        <td>${esc(r.birth_date)}</td>
        <td>${esc(r.enrollment_date)}</td>
        <td class="addr">${esc(r.address)}</td>
      </tr>`).join('');
  }

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */

  setMode('IDLE');
  refreshTable();

});
