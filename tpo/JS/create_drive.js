const form = document.getElementById('driveForm');

// ===== Logo preview =====
const logoInput = document.getElementById('companyLogo');
const logoPreview = document.querySelector('.logo-preview');
const defaultLogo = logoPreview.src;   // reset ke liye placeholder yaad rakho
let logoData = '';                      // drive me save karne ke liye

logoInput.addEventListener('change', () => {
  const file = logoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Sirf image file chuno (png, jpg, etc.)');
    logoInput.value = '';
    return;
  }
  if (file.size > 200 * 1024) {         // localStorage chhoti hoti hai
    alert('Logo 200 KB se chhota hona chahiye');
    logoInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    logoData = reader.result;           // image ka data
    logoPreview.src = logoData;         // preview me dikhao
  };
  reader.readAsDataURL(file);
});

form.addEventListener('submit', e => {
  e.preventDefault();   // page refresh roko

  const drive = {
    company:  form.companyName.value.trim(),
    role:     form.jobRole.value.trim(),
    ctc:      Number(form.ctc.value),
    deadline: form.deadline.value,
    minCgpa:  Number(form.minCgpa.value),
    branches: [...form.branches.selectedOptions].map(o => o.value),
    backlogs: Number(form.backlogs.value),
    logo:     logoData,                  // <-- ye add karo
  
  };

  // Validation
  if (!drive.company || !drive.role) return alert('Company name aur job role daalo');
  if (drive.ctc <= 0) return alert('CTC 0 se zyada hona chahiye');
  if (!drive.deadline) return alert('Registration deadline chuno');
  if (drive.minCgpa < 0 || drive.minCgpa > 10) return alert('CGPA 0 se 10 ke beech hona chahiye');
  if (drive.branches.length === 0) return alert('Kam se kam ek branch chuno');

const t = new Date();
const todayStr = t.getFullYear() + '-' +
  String(t.getMonth() + 1).padStart(2, '0') + '-' +
  String(t.getDate()).padStart(2, '0');

if (drive.deadline < todayStr) return alert('Deadline aaj ya uske baad ki honi chahiye');

  // Save (browser ki localStorage me)
  const drives = JSON.parse(localStorage.getItem('drives') || '[]');
  drives.push(drive);
  localStorage.setItem('drives', JSON.stringify(drives));

  alert(drive.company + ' ki drive ban gayi!');
  form.reset();logoPreview.src = defaultLogo;
logoData = '';
});

document.querySelectorAll('.logout-button').forEach(btn => {
  btn.addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
  });
});