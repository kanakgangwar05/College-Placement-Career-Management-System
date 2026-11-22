// data.js
// Mock data (database ke baad ye API se aayega).
// students.html aur dashboard.html dono isi file ko use karte hain.

const students = [
  { name: 'Kanak Gangwar',   branch: 'CSE', cgpa: 9.4, backlogs: 0, status: 'Verified', placed: true,  package: 42 },
  { name: 'Ishita Rastogi',  branch: 'CSE', cgpa: 9.1, backlogs: 0, status: 'Verified', placed: true,  package: 18 },
  { name: 'Jai Karan Gupta', branch: 'CSE', cgpa: 8.9, backlogs: 0, status: 'Pending',  placed: false, package: 0 },
  { name: 'Kakul Mittal',    branch: 'CSE', cgpa: 9.2, backlogs: 0, status: 'Verified', placed: true,  package: 12 },
  { name: 'Vikram Malhotra', branch: 'IT',  cgpa: 8.7, backlogs: 1, status: 'Flagged',  placed: false, package: 0 },
  { name: 'Aarav Sharma',    branch: 'ECE', cgpa: 8.2, backlogs: 0, status: 'Verified', placed: true,  package: 8.5 },
  { name: 'Neha Verma',      branch: 'ECE', cgpa: 7.9, backlogs: 0, status: 'Pending',  placed: false, package: 0 },
  { name: 'Rohit Singh',     branch: 'ME',  cgpa: 7.4, backlogs: 1, status: 'Flagged',  placed: false, package: 0 },
  { name: 'Priya Singh',     branch: 'ME',  cgpa: 8.0, backlogs: 0, status: 'Verified', placed: true,  package: 6 },
  { name: 'Sanya Gupta',     branch: 'IT',  cgpa: 8.5, backlogs: 0, status: 'Verified', placed: true,  package: 9.5 },
  { name: 'Mohit Yadav',     branch: 'CSE', cgpa: 8.3, backlogs: 0, status: 'Pending',  placed: false, package: 0 },
  { name: 'Anjali Mishra',   branch: 'ECE', cgpa: 8.8, backlogs: 0, status: 'Verified', placed: true,  package: 10 },
  { name: 'Devansh Tiwari',  branch: 'IT',  cgpa: 7.6, backlogs: 2, status: 'Flagged',  placed: false, package: 0 },
  { name: 'Riya Agarwal',    branch: 'CSE', cgpa: 9.0, backlogs: 0, status: 'Verified', placed: true,  package: 15 },
  { name: 'Harsh Pandey',    branch: 'ME',  cgpa: 7.8, backlogs: 0, status: 'Pending',  placed: false, package: 0 }
];

// Demo data: pichhle saalon ka hiring trend
const hiringHistory = {
  years: [2022, 2023, 2024, 2025],
  hires: [3, 5, 6, 8]
};