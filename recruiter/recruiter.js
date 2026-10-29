(() => {
    "use strict";

    const APPLICANT_KEY = "glaRecruiterApplicants";
    const JOB_KEY = "glaRecruiterJobs";
    const statusNames = ["In Review", "Shortlisted", "Interview", "Offer", "Rejected"];
    const statusClasses = {
        "In Review": "badge-in-review",
        Shortlisted: "badge-shortlisted",
        Interview: "badge-shortlisted",
        Offer: "badge-selected",
        Rejected: "badge-rejected"
    };

    function showMessage(message, kind = "error") {
        const targets = document.querySelectorAll(".recruiter-feedback, #recruiterStorageNotice");
        targets.forEach((target) => {
            target.textContent = message;
            target.dataset.kind = kind;
        });
    }

    function readStorage(key, fallback, isValid) {
        try {
            const rawValue = window.localStorage.getItem(key);
            if (rawValue === null) {
                return fallback;
            }
            const value = JSON.parse(rawValue);
            if (!isValid(value)) {
                throw new Error("Stored data has an unexpected format.");
            }
            return value;
        } catch (error) {
            showMessage(`Could not read saved recruiter data: ${error.message}`);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            showMessage(`Could not save recruiter data: ${error.message}`);
            return false;
        }
    }

    function readJobs() {
        return readStorage(JOB_KEY, [], (value) => Array.isArray(value));
    }

    function readApplicantStatuses() {
        return readStorage(APPLICANT_KEY, {}, (value) =>
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            Object.values(value).every((status) => statusNames.includes(status))
        );
    }

    function normalizeStatus(label) {
        const normalized = label.trim().toLowerCase();
        if (normalized.includes("select")) return "Offer";
        if (normalized.includes("shortlist") || normalized.includes("tech round")) return "Shortlisted";
        if (normalized.includes("interview")) return "Interview";
        if (normalized.includes("reject")) return "Rejected";
        return "In Review";
    }

    function initializeDashboard() {
        const openings = document.getElementById("activeOpeningsList");
        if (!openings) return;

        const jobs = readJobs();
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "job-card";

            const details = document.createElement("div");
            const title = document.createElement("h3");
            title.textContent = job.title;
            const summary = document.createElement("p");
            summary.textContent = `${job.location} | ${job.package} | ${job.employmentType} | Deadline: ${job.deadline}`;
            details.append(title, summary);

            const skills = document.createElement("div");
            skills.className = "skill-tags-group";
            job.skills.forEach((skill) => {
                const tag = document.createElement("span");
                tag.className = "skill-mini-tag";
                tag.textContent = skill;
                skills.append(tag);
            });
            details.append(skills);

            const link = document.createElement("a");
            link.href = "applicants/index.html";
            link.className = "btn-primary-action btn-sm";
            link.textContent = "Manage Funnel";
            card.append(details, link);
            openings.append(card);
        });

        const statuses = readApplicantStatuses();
        const defaultStatuses = ["Offer", "In Review", "Shortlisted", "In Review", "Shortlisted"];
        const sampleRollNumbers = ["2415000751", "2415000708", "2415000711", "2415000747", "2415000620"];
        const allStatuses = sampleRollNumbers.map((rollNumber, index) =>
            statuses[rollNumber] || defaultStatuses[index]
        );
        const pending = allStatuses.filter((status) => status === "In Review").length;
        const offerCards = document.querySelectorAll(".offer-card").length +
            allStatuses.filter((status) => status === "Offer").length;

        const activeCount = document.getElementById("activeOpeningsCount");
        const totalCount = document.getElementById("totalApplicantsCount");
        const pendingCount = document.getElementById("pendingApplicantsCount");
        const offersCount = document.getElementById("offersCount");
        if (activeCount) activeCount.textContent = String(4 + jobs.length);
        if (totalCount) totalCount.textContent = String(allStatuses.length);
        if (pendingCount) pendingCount.textContent = String(pending);
        if (offersCount) offersCount.textContent = String(offerCards);
    }

    function initializeApplicants() {
        const list = document.getElementById("applicantList");
        if (!list) return;

        const statusMap = readApplicantStatuses();
        const rows = Array.from(list.querySelectorAll("tr")).map((row, index) => {
            const cells = row.querySelectorAll("td");
            const originalStatus = cells[4].querySelector(".status-badge")?.textContent || "In Review";
            const rollNumber = cells[1].textContent.trim();
            const academic = cells[2].textContent.trim();
            const cgpaMatch = academic.match(/CGPA:\s*([\d.]+)/i);
            const status = statusMap[rollNumber] || normalizeStatus(originalStatus);
            const skills = Array.from(cells[5].querySelectorAll(".skill-mini-tag"), (tag) => tag.textContent.trim());
            row.append(document.createElement("td"));

            return {
                row,
                name: cells[0].textContent.trim(),
                rollNumber,
                academic,
                cgpa: cgpaMatch ? Number(cgpaMatch[1]) : 0,
                branch: (academic.match(/B\.Tech\s+([^()]+)/i) || [null, ""])[1].trim(),
                role: cells[3].textContent.trim(),
                package: row.dataset.package || "Package not listed",
                skills,
                status
            };
        });

        const roleFilter = document.getElementById("roleFilter");
        const knownRoles = new Set(Array.from(roleFilter.options, (option) => option.value));
        readJobs().forEach((job) => {
            if (!knownRoles.has(job.title)) {
                const option = document.createElement("option");
                option.value = job.title;
                option.textContent = job.title;
                roleFilter.append(option);
                knownRoles.add(job.title);
            }
        });

        const search = document.getElementById("searchInput");
        const statusFilter = document.getElementById("statusFilter");
        const cgpaFilter = document.getElementById("cgpaFilter");
        const sortSelect = document.getElementById("sortApplicants");
        const dialog = document.getElementById("applicantDialog");
        const details = document.getElementById("applicantDetails");
        const offers = document.getElementById("offersContainer");
        const initialOfferCards = Array.from(offers.querySelectorAll(".offer-card"));
        const initialOffersMarkup = initialOfferCards.map((card) => card.cloneNode(true));

        function persistStatuses() {
            return writeStorage(APPLICANT_KEY, Object.fromEntries(rows.map((applicant) => [
                applicant.rollNumber,
                applicant.status
            ])));
        }

        function renderOffers() {
            offers.replaceChildren(...initialOffersMarkup.map((card) => card.cloneNode(true)));
            rows.filter((applicant) => applicant.status === "Offer").forEach((applicant) => {
                const card = document.createElement("article");
                card.className = "offer-card";
                const name = document.createElement("h3");
                name.className = "offer-student-name";
                name.textContent = applicant.name;
                const meta = document.createElement("span");
                meta.className = "offer-meta";
                meta.textContent = `Roll: ${applicant.rollNumber} • B.Tech ${applicant.branch}`;
                const role = document.createElement("p");
                role.className = "offer-role-title";
                role.textContent = applicant.role;
                const packageInfo = document.createElement("p");
                packageInfo.className = "offer-pkg";
                packageInfo.textContent = `Package: ${applicant.package}`;
                const footer = document.createElement("div");
                footer.className = "offer-footer";
                footer.textContent = `Offer candidate • ${new Date().toLocaleDateString()}`;
                card.append(name, meta, role, packageInfo, footer);
                offers.append(card);
            });
            const count = document.getElementById("offersCountText");
            if (count) count.textContent = String(offers.querySelectorAll(".offer-card").length);
        }

        function updateCounts() {
            const total = document.getElementById("applicantTotalCount");
            const pending = document.getElementById("applicantPendingCount");
            const shortlisted = document.getElementById("applicantShortlistedCount");
            if (total) total.textContent = String(rows.length);
            if (pending) pending.textContent = String(rows.filter((item) => item.status === "In Review").length);
            if (shortlisted) {
                shortlisted.textContent = String(rows.filter((item) =>
                    item.status === "Shortlisted" || item.status === "Interview"
                ).length);
            }
        }

        function renderRows() {
            const query = search.value.trim().toLowerCase();
            const selectedRole = roleFilter.value;
            const selectedStatus = statusFilter.value;
            const minimumCgpa = Number(cgpaFilter.value);
            const visible = rows.filter((applicant) =>
                applicant.name.toLowerCase().includes(query) &&
                (selectedRole === "ALL" || applicant.role === selectedRole) &&
                (selectedStatus === "ALL" || applicant.status === selectedStatus) &&
                applicant.cgpa >= minimumCgpa
            );

            if (sortSelect.value === "cgpa-desc") visible.sort((a, b) => b.cgpa - a.cgpa);
            else if (sortSelect.value === "cgpa-asc") visible.sort((a, b) => a.cgpa - b.cgpa);
            else visible.sort((a, b) => a.name.localeCompare(b.name));

            list.replaceChildren();
            visible.forEach((applicant) => {
                const row = applicant.row;
                const statusCell = row.cells[4];
                const badge = document.createElement("span");
                badge.className = `status-badge ${statusClasses[applicant.status]}`;
                badge.textContent = applicant.status;
                statusCell.replaceChildren(badge);

                const skillsCell = row.cells[5];
                skillsCell.replaceChildren(...applicant.skills.map((skill) => {
                    const tag = document.createElement("span");
                    tag.className = "skill-mini-tag";
                    tag.textContent = skill;
                    return tag;
                }));

                const actions = document.createElement("td");
                actions.className = "applicant-actions";
                const statusSelect = document.createElement("select");
                statusSelect.setAttribute("aria-label", `Update status for ${applicant.name}`);
                statusSelect.dataset.rollNumber = applicant.rollNumber;
                statusNames.forEach((status) => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status;
                    option.selected = status === applicant.status;
                    statusSelect.append(option);
                });
                const detailButton = document.createElement("button");
                detailButton.type = "button";
                detailButton.className = "btn-action-small";
                detailButton.dataset.applicantDetails = applicant.rollNumber;
                detailButton.textContent = "View Details";
                actions.append(statusSelect, detailButton);
                row.replaceChild(actions, row.cells[6]);
                list.append(row);
            });
            const feedback = document.getElementById("applicantFeedback");
            feedback.textContent = `Showing ${visible.length} of ${rows.length} applicants.`;
            feedback.dataset.kind = "info";
        }

        function exportCsv() {
            const query = search.value.trim().toLowerCase();
            const selectedRole = roleFilter.value;
            const selectedStatus = statusFilter.value;
            const minimumCgpa = Number(cgpaFilter.value);
            const filtered = rows.filter((applicant) =>
                applicant.name.toLowerCase().includes(query) &&
                (selectedRole === "ALL" || applicant.role === selectedRole) &&
                (selectedStatus === "ALL" || applicant.status === selectedStatus) &&
                applicant.cgpa >= minimumCgpa
            );
            const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;
            const csv = [
                ["Name", "Roll Number", "Branch", "CGPA", "Role", "Status", "Skills"],
                ...filtered.map((applicant) => [
                    applicant.name,
                    applicant.rollNumber,
                    applicant.branch,
                    applicant.cgpa,
                    applicant.role,
                    applicant.status,
                    applicant.skills.join(", ")
                ])
            ].map((line) => line.map(quote).join(",")).join("\r\n");
            const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = "recruiter-applicants.csv";
            link.click();
            URL.revokeObjectURL(url);
            showMessage(`Exported ${filtered.length} applicants to CSV.`, "success");
        }

        list.addEventListener("change", (event) => {
            const select = event.target.closest("select[data-roll-number]");
            if (!select) return;
            const applicant = rows.find((item) => item.rollNumber === select.dataset.rollNumber);
            if (!applicant) return;
            applicant.status = select.value;
            if (!persistStatuses()) return;
            updateCounts();
            renderOffers();
            renderRows();
        });

        list.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-applicant-details]");
            if (!button) return;
            const applicant = rows.find((item) => item.rollNumber === button.dataset.applicantDetails);
            if (!applicant) return;
            details.replaceChildren();
            [
                ["Name", applicant.name],
                ["Roll Number", applicant.rollNumber],
                ["Branch", applicant.branch],
                ["CGPA", applicant.cgpa.toFixed(2)],
                ["Target Role", applicant.role],
                ["Application Status", applicant.status],
                ["Skills", applicant.skills.join(", ") || "No skills listed"]
            ].forEach(([label, value]) => {
                const paragraph = document.createElement("p");
                const strong = document.createElement("strong");
                strong.textContent = `${label}: `;
                paragraph.append(strong, document.createTextNode(value));
                details.append(paragraph);
            });
            dialog.showModal();
        });

        [search, roleFilter, statusFilter, cgpaFilter, sortSelect].forEach((control) => {
            control.addEventListener("input", renderRows);
            control.addEventListener("change", renderRows);
        });
        document.getElementById("exportApplicants").addEventListener("click", exportCsv);
        document.getElementById("closeApplicantDialog").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) dialog.close();
        });

        persistStatuses();
        updateCounts();
        renderOffers();
        renderRows();
    }

    function initializeJobForm() {
        const form = document.getElementById("jobForm");
        if (!form) return;

        const preview = document.getElementById("jobPreview");
        const feedback = document.getElementById("jobFormFeedback");
        const deadline = document.getElementById("deadline");
        const today = new Date();
        const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
        deadline.min = localToday;

        // A required deadline with no starting value prevents the form from
        // reaching its publish handler. Start with a sensible, editable date.
        function setDefaultDeadline() {
            if (deadline.value) return;
            const suggestedDeadline = new Date(today);
            suggestedDeadline.setDate(suggestedDeadline.getDate() + 30);
            deadline.value = new Date(
                suggestedDeadline.getTime() - suggestedDeadline.getTimezoneOffset() * 60000
            ).toISOString().slice(0, 10);
        }

        setDefaultDeadline();

        function fieldValue(id, fallback) {
            return document.getElementById(id).value.trim() || fallback;
        }

        function updatePreview() {
            const title = fieldValue("jobTitle", "Job title");
            const company = fieldValue("companyName", "Company name");
            const location = fieldValue("location", "Location");
            const packageValue = fieldValue("ctc", "Package");
            const skills = Array.from(form.querySelectorAll('input[name="tech_skills"]:checked'), (input) => input.value);
            preview.replaceChildren();
            const heading = document.createElement("h3");
            heading.textContent = `${title} — ${company}`;
            const summary = document.createElement("p");
            summary.textContent = `${location} | ${packageValue} | ${fieldValue("empType", "Employment type")}`;
            const criteria = document.createElement("p");
            criteria.textContent = `Minimum CGPA: ${fieldValue("minCgpa", "Not specified")} | Deadline: ${fieldValue("deadline", "Not specified")}`;
            const skillLine = document.createElement("p");
            skillLine.textContent = `Skills: ${skills.join(", ") || "None selected"}`;
            preview.append(heading, summary, criteria, skillLine);
        }

        form.addEventListener("input", updatePreview);
        form.addEventListener("change", updatePreview);
        form.addEventListener("reset", () => window.setTimeout(() => {
            setDefaultDeadline();
            updatePreview();
        }));
        updatePreview();

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const ctcInput = document.getElementById("ctc");
            const ctcMatch = ctcInput.value.match(/^\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:LPA)?\s*$/i);
            ctcInput.setCustomValidity(ctcMatch && Number(ctcMatch[1]) > 0
                ? ""
                : "Enter a positive package, for example 12 or ₹12.5 LPA.");
            if (!form.reportValidity()) return;

            if (deadline.value < localToday) {
                deadline.setCustomValidity("Choose today or a future application deadline.");
                form.reportValidity();
                deadline.setCustomValidity("");
                return;
            }
            const skills = Array.from(form.querySelectorAll('input[name="tech_skills"]:checked'), (input) => input.value);
            if (skills.length === 0) {
                showMessage("Select at least one mandatory skill before publishing.");
                form.querySelector('input[name="tech_skills"]').focus();
                return;
            }

            const job = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                title: fieldValue("jobTitle", ""),
                company: fieldValue("companyName", ""),
                location: fieldValue("location", ""),
                employmentType: fieldValue("empType", ""),
                package: `₹${Number(ctcMatch[1]).toFixed(2)} LPA`,
                eligibleBranch: fieldValue("eligibleBranch", ""),
                minimumCgpa: Number(fieldValue("minCgpa", "0")),
                deadline: deadline.value,
                skills,
                description: fieldValue("description", "")
            };
            const jobs = readJobs();
            jobs.push(job);
            if (!writeStorage(JOB_KEY, jobs)) return;

            feedback.replaceChildren(document.createTextNode("Job published and saved in this browser. "));
            const dashboardLink = document.createElement("a");
            dashboardLink.href = "../index.html";
            dashboardLink.textContent = "View recruiter dashboard";
            feedback.append(dashboardLink);
            feedback.dataset.kind = "success";
        });
    }

    initializeDashboard();
    initializeApplicants();
    initializeJobForm();
})();
