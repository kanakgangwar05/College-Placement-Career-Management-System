// dashboard.js
// Load order: Chart.js -> data.js -> dashboard.js

// ===== 0. Welcome banner =====
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
document.getElementById('welcomeText').textContent = greeting + ', TPO Admin ';

// ===== 1. Stat cards =====
const placed = students.filter(s => s.placed);
const totalPackage = placed.reduce((sum, s) => sum + s.package, 0);

const pct = students.length ? Math.round((placed.length / students.length) * 100) : 0;
const highest = placed.length ? Math.max(...placed.map(s => s.package)) : 0;
const average = placed.length ? totalPackage / placed.length : 0;

document.getElementById('statPlacement').textContent = pct + '%';
document.getElementById('statHighest').textContent = '₹' + highest + ' LPA';
document.getElementById('statAverage').textContent = '₹' + average.toFixed(1) + ' LPA';

// ===== 2. Drives (saved by Create Drive page) =====

const drives = JSON.parse(localStorage.getItem('drives') || '[]');

const now = new Date();
const today = now.getFullYear() + '-' +
  String(now.getMonth() + 1).padStart(2, '0') + '-' +
  String(now.getDate()).padStart(2, '0');

const activeDrives = drives.filter(d => d.deadline >= today);

document.getElementById('statDrives').textContent = activeDrives.length;

document.getElementById('driveList').innerHTML = drives.length
  ? drives.map(d => {
      const isActive = d.deadline >= today;
      return `
      <li>
        <img src="${d.logo || 'https://placehold.co/24x24?text=?'}" width="24" height="24"
             style="border-radius:4px;vertical-align:middle;margin-right:8px" />
        <strong>${d.company}</strong> - ${d.role} - ₹${d.ctc} LPA
        (deadline: ${d.deadline})
        <span class="status-badge ${isActive ? 'badge-selected' : 'badge-flagged'}">
          ${isActive ? 'Active' : 'Closed'}
        </span>
        <button class="delete-drive" data-i="${drives.indexOf(d)}"
        style="margin-left:10px;border:none;background:#fdecea;color:#c0392b;border-radius:6px;padding:4px 10px;cursor:pointer">
        Delete
        </button>
      </li>`;
    }).join('')
  : '<li>No drives created yet</li>';

// ===== 3. Charts =====
if (typeof Chart === 'undefined') {
  console.warn('Chart.js did not load (check internet / CDN link)');
} else {
  // Bar chart: department-wise placement %
  const branches = [...new Set(students.map(s => s.branch))].sort();
  const branchPct = branches.map(b => {
    const all = students.filter(s => s.branch === b);
    return Math.round((all.filter(s => s.placed).length / all.length) * 100);
  });

  new Chart(document.getElementById('deptChart'), {
    type: 'bar',
    data: {
      labels: branches,
      datasets: [{ label: 'Placed %', data: branchPct, backgroundColor: '#0866ff', borderRadius: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } }
    }
  });

  // Line chart: hiring trend (past years = demo data, current year = real count)
  const years = [...hiringHistory.years, new Date().getFullYear()];
  const hires = [...hiringHistory.hires, placed.length];

  new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Students placed',
        data: hires,
        borderColor: '#0866ff',
        backgroundColor: 'rgba(8,102,255,0.12)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

document.getElementById('driveList').addEventListener('click', e => {
  const btn = e.target.closest('.delete-drive');
  if (!btn) return;
  if (!confirm('Are You deleting this drive?')) return;

  drives.splice(Number(btn.dataset.i), 1);
  localStorage.setItem('drives', JSON.stringify(drives));
  location.reload();   // list aur count dobara calculate ho jaayenge
});