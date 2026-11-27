
const appliedDrives = JSON.parse(
    localStorage.getItem("appliedDrives")
) || [];

const applicationStatuses = JSON.parse(
    localStorage.getItem("applicationStatuses")
) || {};

const interviewSchedules = JSON.parse(
    localStorage.getItem("interviewSchedules")
) || {};

const statusOptions = [
    "Applied",
    "Online Test Cleared",
    "Shortlisted",
    "Interview Scheduled",
    "Offer Extended",
    "Rejected"
];

// Save all application data
function saveApplicationData() {
    localStorage.setItem("appliedDrives", JSON.stringify(appliedDrives));
    localStorage.setItem("applicationStatuses", JSON.stringify(applicationStatuses));
    localStorage.setItem("interviewSchedules", JSON.stringify(interviewSchedules));
}

// Get application status
function getStatus(company) {
    return applicationStatuses[company] || "Applied";
}

// Get status badge styling
function getBadgeClass(status) {
    if (status === "Offer Extended") {
        return "badge-selected";
    }

    if (
        status === "Shortlisted" ||
        status === "Interview Scheduled" ||
        status === "Online Test Cleared"
    ) {
        return "badge-shortlisted";
    }

    return "";
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalApplied = appliedDrives.length;

    const testCleared = appliedDrives.filter(function(company) {
        return [
            "Online Test Cleared",
            "Shortlisted",
            "Interview Scheduled",
            "Offer Extended"
        ].includes(getStatus(company));
    }).length;

    const interviewCount = appliedDrives.filter(function(company) {
        return [
            "Shortlisted",
            "Interview Scheduled",
            "Offer Extended"
        ].includes(getStatus(company));
    }).length;

    const offers = appliedDrives.filter(function(company) {
        return getStatus(company) === "Offer Extended";
    }).length;

    // Update dashboard numbers safely
    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    setText("applicationsCount", totalApplied);
    setText("shortlistedCount", interviewCount);
    setText("offersCount", offers);

    setText("pipelineApplied", totalApplied);
    setText("pipelineTest", testCleared);
    setText("pipelineInterview", interviewCount);
    setText("pipelineOffer", offers);
}

// Render application cards
function renderApplications() {
    const applicationList = document.getElementById("applicationList");

    if (!applicationList) {
        return;
    }

    applicationList.innerHTML = "";

    // Empty state
    if (appliedDrives.length === 0) {
        const emptyCard = document.createElement("div");
        emptyCard.className = "job-card";

        emptyCard.innerHTML = `
            <div>
                <h3>No applications yet</h3>
                <p>Apply for placement drives to track your applications here.</p>
            </div>
            <a href="drives/index.html" class="btn-apply">
                Browse Drives
            </a>
        `;

        applicationList.appendChild(emptyCard);
        return;
    }

    // Create card for each application
    appliedDrives.forEach(function(company) {
        const status = getStatus(company);

        const card = document.createElement("div");
        card.className = "job-card";

        const details = document.createElement("div");
        details.className = "application-details";

        const heading = document.createElement("h3");
        heading.textContent = company;

        const statusText = document.createElement("p");
        statusText.textContent = "Current Status: " + status;

        // Status dropdown
        const statusLabel = document.createElement("label");
        statusLabel.textContent = "Update Status:";
        statusLabel.style.display = "block";
        statusLabel.style.marginTop = "12px";

        const statusSelect = document.createElement("select");
        statusSelect.className = "application-status-select";

        statusOptions.forEach(function(statusName) {
            const option = document.createElement("option");
            option.value = statusName;
            option.textContent = statusName;

            if (statusName === status) {
                option.selected = true;
            }

            statusSelect.appendChild(option);
        });

        // Update status
        statusSelect.addEventListener("change", function() {
            applicationStatuses[company] = statusSelect.value;

            saveApplicationData();
            renderDashboard();
        });

        details.appendChild(heading);
        details.appendChild(statusText);
        details.appendChild(statusLabel);
        details.appendChild(statusSelect);

        // Interview scheduling
        if (status === "Interview Scheduled") {
            const schedule = interviewSchedules[company] || {};

            const scheduleRow = document.createElement("div");
            scheduleRow.className = "interview-schedule";

            // Date field
            const dateField = document.createElement("div");
            dateField.className = "schedule-field";

            const dateLabel = document.createElement("label");
            dateLabel.textContent = "Interview Date";

            const dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.value = schedule.date || "";

            dateField.appendChild(dateLabel);
            dateField.appendChild(dateInput);

            // Time field
            const timeField = document.createElement("div");
            timeField.className = "schedule-field";

            const timeLabel = document.createElement("label");
            timeLabel.textContent = "Interview Time";

            const timeInput = document.createElement("input");
            timeInput.type = "time";
            timeInput.value = schedule.time || "";

            timeField.appendChild(timeLabel);
            timeField.appendChild(timeInput);

            // Save schedule button
            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.className = "schedule-save-btn";
            saveButton.textContent = "Save Schedule";

            saveButton.addEventListener("click", function() {
                if (!dateInput.value || !timeInput.value) {
                    alert("Please select interview date and time.");
                    return;
                }

                interviewSchedules[company] = {
                    date: dateInput.value,
                    time: timeInput.value
                };

                saveApplicationData();
                renderDashboard();

                alert("Interview schedule saved successfully!");
            });

            scheduleRow.appendChild(dateField);
            scheduleRow.appendChild(timeField);
            scheduleRow.appendChild(saveButton);

            details.appendChild(scheduleRow);
        }

        // Status badge
        const badge = document.createElement("span");
        badge.className = "status-badge " + getBadgeClass(status);
        badge.textContent = status;

        card.appendChild(details);
        card.appendChild(badge);

        applicationList.appendChild(card);
    });
}

// Render upcoming interviews
function renderInterviews() {
    const interviewList = document.getElementById("interviewList");

    if (!interviewList) {
        return;
    }

    interviewList.innerHTML = "";

    // Find scheduled interviews with saved date/time
    const upcoming = appliedDrives.filter(function(company) {
        const schedule = interviewSchedules[company];

        return (
            getStatus(company) === "Interview Scheduled" &&
            schedule &&
            schedule.date &&
            schedule.time
        );
    });

    // Empty state
    if (upcoming.length === 0) {
        const emptyCard = document.createElement("div");
        emptyCard.className = "job-card";

        const message = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = "No interviews scheduled";

        const description = document.createElement("p");
        description.textContent =
            "Set an application status to Interview Scheduled and add the interview date and time.";

        message.appendChild(heading);
        message.appendChild(description);
        emptyCard.appendChild(message);

        interviewList.appendChild(emptyCard);
        return;
    }

    // Sort by date and then time
    upcoming.sort(function(a, b) {
        const first = interviewSchedules[a].date + interviewSchedules[a].time;
        const second = interviewSchedules[b].date + interviewSchedules[b].time;

        return first.localeCompare(second);
    });

    // Create interview cards
    upcoming.forEach(function(company) {
        const schedule = interviewSchedules[company];

        const card = document.createElement("div");
        card.className = "job-card";

        const details = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = company;

        const dateText = document.createElement("p");
        dateText.textContent = "Interview Date: " + schedule.date;

        const timeText = document.createElement("p");
        timeText.textContent = "Interview Time: " + schedule.time;

        details.appendChild(heading);
        details.appendChild(dateText);
        details.appendChild(timeText);

        const badge = document.createElement("span");
        badge.className = "status-badge badge-shortlisted";
        badge.textContent = "Scheduled";

        card.appendChild(details);
        card.appendChild(badge);

        interviewList.appendChild(card);
    });
}

// Update featured drive status if cards are connected
function updateFeaturedDrives() {
    const featuredCards = document.querySelectorAll(".featured-card");

    featuredCards.forEach(function(card) {
        const company = card.getAttribute("data-company");

        if (!company) {
            return;
        }

        const matchedCompany = appliedDrives.find(function(name) {
            return name.toLowerCase().includes(company.toLowerCase());
        });

        if (!matchedCompany) {
            return;
        }

        const status = getStatus(matchedCompany);
        const badge = card.querySelector(".status-badge");
        const button = card.querySelector(".btn-apply");

        if (badge) {
            badge.textContent = status;
            badge.className = "status-badge " + getBadgeClass(status);
        }

        if (button) {
            button.textContent = "Applied ✓";
            button.classList.add("btn-applied");
            button.removeAttribute("href");
            button.style.pointerEvents = "none";
        }
    });
}

// Main dashboard function
function renderDashboard() {
    updateDashboardStats();
    renderApplications();
    renderInterviews();
    updateFeaturedDrives();
}

// Run when page loads
renderDashboard();

document.querySelectorAll(".logout-button").forEach(function(btn) {
    btn.addEventListener("click", function() {
        sessionStorage.removeItem("currentUser");
    });
});
