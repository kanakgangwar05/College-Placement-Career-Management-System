/**
 * ============================================================
 * GLA CAMPUS PORTAL - LOGIN LOGIC (login.js)
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Grab form inputs and elements
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const messageBox = document.getElementById("authMessage");

    // 2. Auto-fill email if "Remember me" was checked previously
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }

    // 3. Helper function to show messages
    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = "auth-message " + type; // "auth-message error" or "auth-message success"
        messageBox.style.display = "block";
    }

    // 4. Handle Login Form Submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Stop default page refresh

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const selectedRole = document.querySelector('input[name="role"]:checked').value;

        // Basic validation
        if (!email || !password) {
            showMessage("Please enter both email and password.", "error");
            return;
        }

        // Get registered users from localStorage
        const users = JSON.parse(localStorage.getItem("portalUsers")) || [];
        const existingUser = users.find(function (u) {
            return u.email.toLowerCase() === email;
        });

        // If user was registered, check password
        if (existingUser && existingUser.password !== password) {
            showMessage("Incorrect password. Please try again.", "error");
            passwordInput.focus();
            return;
        }

        // Use account role if registered, otherwise use selected role
        const activeRole = existingUser ? existingUser.role : selectedRole;

        // Remember Me logic
        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        // Save active user session in sessionStorage
        sessionStorage.setItem("currentUser", JSON.stringify({
            name: existingUser ? existingUser.name : (activeRole.toUpperCase() + " User"),
            email: email,
            role: activeRole,
            roll: existingUser ? existingUser.roll : ""
        }));

        showMessage("Login successful! Redirecting...", "success");

        // Redirect based on role (Student, TPO, Recruiter)
        setTimeout(function () {
            if (activeRole === "student") {
                window.location.href = "../../Student/index.html";
            } else if (activeRole === "tpo") {
                window.location.href = "../../tpo/index.html";
            } else if (activeRole === "recruiter") {
                window.location.href = "../../recruiter/index.html";
            }
        }, 800);
    });

});
