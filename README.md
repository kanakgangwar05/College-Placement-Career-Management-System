# College Placement & Career Management System

> **Status:** Temporary README — draft is pending team review of the shared UI concepts. This will be updated once the team finalizes which direction (this synopsis vs. the extended Campus Recruitment Portal spec) we're building.

**GLA University, Mathura — Department of Computer Engineering Application**
B.Tech CSE, 3rd Year — Mini Project Synopsis

**Team**
- Ishita Rastogi — 2415000708
- Jai Karan Gupta — 2415000711
- Kakul Mittal — 2415000747
- Kanak Gangwar — 2415000751

**Supervisor:** Mr. Deepak Prasad

---

## About

A front-end web application that presents a structured, responsive interface for campus placement and career-related activities — student registration, viewing job/internship drives, and tracking application status.

The current scope is limited to the technologies covered in coursework so far: **HTML5** for structure, **CSS3** for styling and responsive layouts, and **vanilla JavaScript** for interactivity (form validation, dynamic content filtering, navigation). No backend or database is used yet — all data is sample/mock data stored in JS arrays/objects to simulate real placement records.

## Problem Statement

Most colleges rely on manual or scattered methods — spreadsheets, printed notices, messaging apps — to share placement information with students. There's no single, well-designed page where students can view upcoming drives, eligibility details, career resources, and their own application status in one organized, responsive layout. This project addresses that gap at the front-end level.

## Objectives

- Design a responsive, multi-page front-end website for a College Placement and Career Management System.
- Build page structure using semantic HTML5 (Home, Student Registration, Placement Drives, Career Resources, Dashboard, About/Contact).
- Style all pages using Flexbox and Grid for a modern, responsive layout.
- Use JavaScript for client-side form validation.
- Use JavaScript to dynamically display and filter sample placement-drive data.
- Ensure the site is fully responsive across mobile, tablet, and desktop.

## Pages

| Page | Route | Purpose |
|---|---|---|
| Home | `index.html` | Hero, stats, how-it-works, featured drives |
| Placement Drives | `drives.html` | Filterable list of sample company drives |
| Student Registration | `register.html` | Validated registration form |
| Career Resources | `resources.html` | Resume, interview, and aptitude prep guides |
| Student Dashboard | `dashboard.html` | Sample profile + application status tracker |
| Contact | `contact.html` | Placement cell info + contact form |

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (Flexbox, Grid, responsive breakpoints)
- Vanilla JavaScript (no frameworks) — form validation, filtering, dynamic rendering from sample data
- Sample/mock data only — no server, no database at this stage

## Methodology

Requirement analysis → wireframing → HTML structuring → CSS styling → client-side interactivity (JS) → cross-device testing → documentation.

## Future Scope

The codebase is structured (organized folders, clear IDs/classes) so a real backend — e.g. PHP/MySQL or Node.js — can be integrated in later semesters without a redesign.

## References

1. Mozilla Developer Network, "HTML, CSS and JavaScript Documentation," developer.mozilla.org, 2024.
2. W3Schools, "HTML, CSS and JavaScript Tutorials," w3schools.com, 2024.
3. R. Kumar and S. Sharma, "Web-Based College Placement Management System," *International Journal of Computer Applications*, vol. 178, no. 30, 2019.
4. S. Patel and N. Joshi, "A Study on Automated Campus Recruitment Systems," *International Journal of Advanced Research in Computer Science*, vol. 11, no. 2, 2020.

---
*This README is a placeholder based on the original project synopsis. It will be revised once the team confirms whether to proceed with this scope or the expanded Campus Recruitment Portal (multi-role: Student/TPO/Recruiter) spec.*
