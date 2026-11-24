
const saveButton = document.getElementById("saveProfile");

const profileFields = [
    "fullName",
    "email",
    "phone",
    "dob",
    "city",
    "cgpa",
    "tenth",
    "twelfth",
    "backlogs"
];

// Load saved profile data
const savedProfile = JSON.parse(
    localStorage.getItem("studentProfile")
);

if (savedProfile) {
    profileFields.forEach(function(id) {
        const field = document.getElementById(id);

        if (field && savedProfile[id] !== undefined) {
            field.value = savedProfile[id];
        }
    });
}

// Calculate profile completion
function updateProfileCompletion() {
    let filledFields = 0;

    profileFields.forEach(function(id) {
        const value = document.getElementById(id).value.trim();

        if (value !== "") {
            filledFields++;
        }
    });

    const percentage = Math.round(
        (filledFields / profileFields.length) * 100
    );

    document.getElementById("profileStatus").textContent =
        "Profile " + percentage + "% Complete";
}

// Update percentage while typing
profileFields.forEach(function(id) {
    document.getElementById(id).addEventListener(
        "input",
        updateProfileCompletion
    );
});

// Run on page load
updateProfileCompletion();

// Save Profile
saveButton.addEventListener("click", function() {

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Required field validation
    if (fullName === "" || email === "" || phone === "") {
        alert("Please fill in your name, email and phone number.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Academic validation
    const cgpaInput = document.getElementById("cgpa").value;
    const tenthInput = document.getElementById("tenth").value;
    const twelfthInput = document.getElementById("twelfth").value;
    const backlogsInput = document.getElementById("backlogs").value;

    const cgpa = Number(cgpaInput);
    const tenth = Number(tenthInput);
    const twelfth = Number(twelfthInput);
    const backlogs = Number(backlogsInput);

    if (cgpaInput === "" || cgpa < 0 || cgpa > 10) {
        alert("CGPA must be between 0 and 10.");
        return;
    }

    if (
        tenthInput === "" || twelfthInput === "" ||
        tenth < 0 || tenth > 100 ||
        twelfth < 0 || twelfth > 100
    ) {
        alert("10th and 12th percentages must be between 0 and 100.");
        return;
    }

    if (backlogsInput === "" || backlogs < 0) {
        alert("Backlogs cannot be negative or empty.");
        return;
    }

    // Collect profile data
    const profileData = {};

    profileFields.forEach(function(id) {
        profileData[id] = document.getElementById(id).value;
    });

    // Save profile
    localStorage.setItem(
        "studentProfile",
        JSON.stringify(profileData)
    );

    updateProfileCompletion();

    alert("Profile saved successfully!");
});

// Cancel - restore last saved data
const cancelButton = document.querySelector(
    ".profile-actions .btn-secondary-action"
);

cancelButton.addEventListener("click", function(event) {
    event.preventDefault();

    const savedData = JSON.parse(
        localStorage.getItem("studentProfile")
    );

    if (savedData) {
        profileFields.forEach(function(id) {
            const field = document.getElementById(id);

            if (field && savedData[id] !== undefined) {
                field.value = savedData[id];
            }
        });
    }

    updateProfileCompletion();

    alert("Unsaved changes discarded.");
});

// Resume Preview
const resumePreview = document.getElementById("resumePreview");
let resumeURL = null;

resumePreview.addEventListener("click", function(event) {
    if (resumeURL === null) {
        event.preventDefault();
        alert("Please select your resume first.");
    } else {
        resumePreview.href = resumeURL;
    }
});

// Resume Upload
const resumeUpload = document.getElementById("resumeUpload");

resumeUpload.addEventListener("change", function() {

    const file = resumeUpload.files[0];

    if (!file) {
        return;
    }

    // PDF validation
    if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        resumeUpload.value = "";
        return;
    }

    // File size validation (maximum 2 MB)
    if (file.size > 2 * 1024 * 1024) {
        alert("Resume size must be less than 2 MB.");
        resumeUpload.value = "";
        return;
    }

    // Create preview URL
    if (resumeURL !== null) {
        URL.revokeObjectURL(resumeURL);
    }

    resumeURL = URL.createObjectURL(file);
    resumePreview.href = resumeURL;

    // Display resume name
    document.getElementById("resumeName").textContent = file.name;

    // Display file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

    document.getElementById("resumeInfo").textContent =
        "PDF Resume • " + sizeInMB + " MB";

    alert("Resume selected successfully!");
});
