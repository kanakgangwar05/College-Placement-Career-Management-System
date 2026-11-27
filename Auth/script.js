/**
 * ============================================================
 * GLA CAMPUS PORTAL - HOME PAGE LOGIC (script.js)
 * Easy to understand, clean code for college mini-project
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------------------------
    // 1. DYNAMIC HEADER AUTH BUTTONS (Login status check)
    // ------------------------------------------------------------
    const authButtonsContainer = document.querySelector(".header-auth-buttons");
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (currentUser && authButtonsContainer) {
        // User is logged in: show greeting and dashboard link + logout
        let dashboardUrl = "../Student/index.html";
        if (currentUser.role === "tpo") dashboardUrl = "../tpo/HTML/dashboard.html";
        if (currentUser.role === "recruiter") dashboardUrl = "../recruiter/index.html";

        const firstName = (currentUser.name || "User").split(" ")[0];

        authButtonsContainer.innerHTML = `
            <span style="font-size: 13.5px; font-weight: bold; color: var(--text-main); margin-right: 4px;margin-top:8.3px">
                Hi, ${firstName}
            </span>
            <a href="${dashboardUrl}" class="btn-primary-action btn-sm">Dashboard</a>
            <button id="logoutBtn" class="btn-secondary-action btn-sm" style="cursor: pointer;">Logout</button>
        `;

        // Handle Logout
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                sessionStorage.removeItem("currentUser");
                window.location.reload();
            });
        }
    }


    // ------------------------------------------------------------
    // 2. INTERACTIVE PORTAL CARDS (Clickable navigation)
    // ------------------------------------------------------------
    const portalCards = document.querySelectorAll(".portal-card");
    const rolePages = [
        "../Student/index.html",
        "../recruiter/index.html",
        "../tpo/HTML/dashboard.html"
    ];

    portalCards.forEach(function (card, index) {
        // Set cursor to pointer so user knows it's clickable
        card.style.cursor = "pointer";
        card.setAttribute("title", "Click to launch this portal");

        card.addEventListener("click", function (event) {
            if (event.target.closest("a")) return;
            if (rolePages[index]) {
                window.location.href = rolePages[index];
            }
        });
    });


    // ------------------------------------------------------------
    // 3. ANIMATED STATISTICS COUNTER
    // ------------------------------------------------------------
    function animateCounters() {
        const statCards = document.querySelectorAll(".stat-card h3");

        statCards.forEach(function (card) {
            const rawTarget = card.getAttribute("data-target");
            if (!rawTarget) return;

            const targetValue = parseFloat(rawTarget);
            const prefix = card.getAttribute("data-prefix") || "";
            const suffix = card.getAttribute("data-suffix") || "";
            const isDecimal = rawTarget.includes(".");
            const duration = 1200; // 1.2 seconds animation
            const steps = 40;
            const stepTime = duration / steps;
            const increment = targetValue / steps;

            let current = 0;
            let currentStep = 0;

            const timer = setInterval(function () {
                currentStep++;
                current += increment;

                if (currentStep >= steps) {
                    current = targetValue;
                    clearInterval(timer);
                }

                // Format with decimal if original value has decimal
                const displayedValue = isDecimal ? current.toFixed(1) : Math.floor(current);
                card.textContent = prefix + displayedValue + suffix;
            }, stepTime);
        });
    }

    // Run animation once page is loaded
    animateCounters();

});
