const resourceSearch = document.getElementById("resourceSearch");
const resourceCategory = document.getElementById("resourceCategory");
const resourceCards = document.querySelectorAll(".resource-card");
const noResources = document.getElementById("noResources");

function filterResources() {
    const searchText = resourceSearch.value.toLowerCase().trim();
    const selectedCategory = resourceCategory.value;

    let visibleCount = 0;

    resourceCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = text.includes(searchText);
        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResources.style.display =
        visibleCount === 0 ? "block" : "none";
}

resourceSearch.addEventListener("input", filterResources);
resourceCategory.addEventListener("change", filterResources);