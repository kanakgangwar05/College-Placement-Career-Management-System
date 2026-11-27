// students.js
// Note: `students` array data.js se aata hai, isliye data.js pehle load hona chahiye.

// ===== Page elements =====
const tbody = document.querySelector('.student-table tbody');
const searchInput = document.querySelector('.search-box input');
const [branchSelect, sortSelect] = document.querySelectorAll('.filter-select');
const info = document.querySelector('.pagination-info');

const badgeClass = {
  Verified: 'badge-selected',
  Pending: 'badge-in-review',
  Flagged: 'badge-flagged'
};

// Dropdown me jo branch missing ho (jaise IT), wo apne aap add ho jaayegi
[...new Set(students.map(s => s.branch))].sort().forEach(b => {
  if (![...branchSelect.options].some(o => o.value === b)) {
    branchSelect.add(new Option(b, b));
  }
});

// ===== Table banana =====
function render() {
  const q = searchInput.value.trim().toLowerCase();
  const branch = branchSelect.value;
  const sort = sortSelect.value;

  // Search + branch filter
  const list = students.filter(s =>
    s.name.toLowerCase().includes(q) && (!branch || s.branch === branch)
  );

  // Sort (tumhare HTML me "asc" ka matlab High to Low hai)
  if (sort === 'asc')  list.sort((a, b) => b.cgpa - a.cgpa);
  if (sort === 'desc') list.sort((a, b) => a.cgpa - b.cgpa);

  tbody.innerHTML = list.length
    ? list.map(s => {
        const i = students.indexOf(s);
        return `
        <tr>
          <td class="student-cell">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0866ff&color=fff"
                 alt="${s.name}" class="avatar" />
            <span>${s.name}</span>
          </td>
          <td>${s.branch}</td>
          <td>${s.cgpa.toFixed(2)}</td>
          <td>${s.backlogs}</td>
          <td><span class="status-badge ${badgeClass[s.status]}">${s.status}</span></td>
          <td class="action-cell">
            <button class="icon-btn verify-btn" title="Verify Details" data-i="${i}">
              <i class="fa-solid fa-circle-check"></i>
            </button>
            <button class="icon-btn flag-btn" title="Flag Discrepancy" data-i="${i}">
              <i class="fa-solid fa-flag"></i>
            </button>
          </td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="6" style="text-align:center;padding:20px">No students found</td></tr>';

  info.textContent = `Showing ${list.length} of ${students.length} students`;
}

// ===== Events =====
searchInput.addEventListener('input', render);
branchSelect.addEventListener('change', render);
sortSelect.addEventListener('change', render);

// Verify / Flag buttons (table dobara banti hai, isliye tbody par listen kiya)
tbody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-i]');
  if (!btn) return;
  students[btn.dataset.i].status = btn.classList.contains('verify-btn') ? 'Verified' : 'Flagged';
  render();
});

// Pehli baar table dikhao
render();

document.querySelectorAll('.logout-button').forEach(btn => {
  btn.addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
  });
});