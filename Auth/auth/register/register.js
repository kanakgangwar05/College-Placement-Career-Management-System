/**
 * ============================================================
 * GLA CAMPUS PORTAL - REGISTRATION LOGIC (register.js)
 * Easy to understand, clean code for college mini-project
 * ============================================================
 */

// Wait for the HTML document to fully load
document.addEventListener("DOMContentLoaded", function () {

    // 1. Get form and input elements
    const registerForm = document.getElementById("registerForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const rollInput = document.getElementById("roll");
    const passwordInput = document.getElementById("password");
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const roleFieldLabel = document.querySelector("#roleField label");
    const messageBox = document.getElementById("authMessage");

    // 2. Change the ID label & placeholder dynamically when role changes
    function updateRoleField() {
        const selectedRole = document.querySelector('input[name="role"]:checked').value;

        if (selectedRole === "student") {
            roleFieldLabel.textContent = "University Roll Number";
            rollInput.placeholder = "e.g. 2415000751";
        } else if (selectedRole === "tpo") {
            roleFieldLabel.textContent = "Faculty / TPO Employee ID";
            rollInput.placeholder = "e.g. TPO-2024";
        } else if (selectedRole === "recruiter") {
            roleFieldLabel.textContent = "Company / Recruiter ID";
            rollInput.placeholder = "e.g. TCS-REC01";
        }
    }

    // Listen for radio button changes
    roleRadios.forEach(function (radio) {
        radio.addEventListener("change", updateRoleField);
    });

    // Run once on load to set initial label
    updateRoleField();

    // 3. Helper function to show success or error messages
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = "auth-message " + type; // "auth-message error" or "auth-message success"
        messageBox.style.display = "block";
    }

    // 4. Handle Form Submission
    registerForm.addEventListener("submit", function (event) {
        // Prevent default browser refresh
        event.preventDefault();

        // Read entered values and trim unnecessary spaces
        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const roll = rollInput.value.trim();
        const password = passwordInput.value;
        const role = document.querySelector('input[name="role"]:checked').value;

        // Basic Validation
        if (name.length < 2) {
            showMessage("Please enter a valid full name (at least 2 characters).", "error");
            nameInput.focus();
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            showMessage("Please enter a valid email address.", "error");
            emailInput.focus();
            return;
        }

        if (roll.length < 2) {
            showMessage("Please enter a valid ID / Roll number.", "error");
            rollInput.focus();
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters long.", "error");
            passwordInput.focus();
            return;
        }

        // 5. Check if user already exists in localStorage
        // Get existing users list or create a new empty array
        const existingUsers = JSON.parse(localStorage.getItem("portalUsers")) || [];

        // Check if email already registered
        const userExists = existingUsers.some(function (user) {
            return user.email === email;
        });

        if (userExists) {
            showMessage("An account with this email already exists. Please log in.", "error");
            return;
        }

        // 6. Save new user object
        const newUser = {
            name: name,
            email: email,
            role: role,
            roll: roll,
            password: password,
            createdAt: new Date().toLocaleDateString()
        };

        // Add to users list and save to localStorage
        existingUsers.push(newUser);
        localStorage.setItem("portalUsers", JSON.stringify(existingUsers));

        // 7. Show success message and redirect to login page
        showMessage("Registration successful! Redirecting to login...", "success");

        // Disable submit button while redirecting
        const submitBtn = document.getElementById("regBtn");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Redirecting...";
        }

        // Redirect after 1.2 seconds
        setTimeout(function () {
            window.location.href = "../login/index.html";
        }, 1200);
    });

});
