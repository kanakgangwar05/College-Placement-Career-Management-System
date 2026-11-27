
const searchInput = document.getElementById("driveSearch");
const categorySelect = document.getElementById("roleCategory");
const jobCards = document.querySelectorAll(".job-card");

let appliedDrives = JSON.parse(
    localStorage.getItem("appliedDrives")
) || [];

let applicationStatuses = JSON.parse(
    localStorage.getItem("applicationStatuses")
) || {};

// Search and Category Filter
function filterDrives() {
    if (!searchInput || !categorySelect) {
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;

    jobCards.forEach(function(card) {
        const cardText = card.textContent.toLowerCase();
        const cardCategory = card.getAttribute("data-cat");

        const matchesSearch = cardText.includes(searchText);

        const matchesCategory =
            selectedCategory === "ALL" ||
            cardCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

if (searchInput) {
    searchInput.addEventListener("input", filterDrives);
}

if (categorySelect) {
    categorySelect.addEventListener("change", filterDrives);
}

// Restore previously applied drives
jobCards.forEach(function(card) {
    const button = card.querySelector(".btn-apply");

    if (!button) {
        return;
    }

    const company = card.querySelector("h3").textContent.trim();

    if (appliedDrives.includes(company)) {
        button.textContent = "Applied ✓";
        button.classList.add("btn-applied");
        button.removeAttribute("href");
        button.style.pointerEvents = "none";
    }
});

// Apply Now functionality
jobCards.forEach(function(card) {
    const button = card.querySelector(".btn-apply");

    if (!button || button.classList.contains("btn-applied")) {
        return;
    }

    button.addEventListener("click", function(event) {
        event.preventDefault();

        const company = card.querySelector("h3").textContent.trim();

        if (appliedDrives.includes(company)) {
            alert("You have already applied for this drive.");
            return;
        }

        const confirmApply = confirm(
            "Are you sure you want to apply for this placement drive?"
        );

        if (!confirmApply) {
            return;
        }

        // Save application
        appliedDrives.push(company);

        // Initial application status
        applicationStatuses[company] = "Applied";

        localStorage.setItem(
            "appliedDrives",
            JSON.stringify(appliedDrives)
        );

        localStorage.setItem(
            "applicationStatuses",
            JSON.stringify(applicationStatuses)
        );

        // Update button
        button.textContent = "Applied ✓";
        button.classList.add("btn-applied");
        button.removeAttribute("href");
        button.style.pointerEvents = "none";

        alert("Application submitted successfully!");
    });
});

document.querySelectorAll(".logout-button").forEach(function(btn) {
    btn.addEventListener("click", function() {
        sessionStorage.removeItem("currentUser");
    });
});
