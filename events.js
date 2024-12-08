// Attach the scroll event listener
window.addEventListener("scroll", toggleScrollButton);

// Smooth scroll to results section
document.getElementById("scrollToResults").addEventListener("click", () => {
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});

// Event listener for the "Remove All" button
document.getElementById("remove-all-goals").addEventListener("click", () => {
  // Reset the selected goals and counters
  selectedGoals = {
    "Employment Goals PLP": [],
    "Retired PLP": [],
    "Sick PLP": [],
    "Short-Term Goals": [],
    "Personal Goals": [],
    "Long-Term Goals": [],
    "EMP Goals": [],
    Retired: [],
    Sick: [],
    "Short Goals": [],
    "Long Goals": [],
  };
  employmentCategorySelected = null;
  employmentGoalCount = 0;

  // Reset UI state for each goal option and their selection status
  document.querySelectorAll(".form-group").forEach((formGroup) => {
    const actionButton = formGroup.querySelector("button");
    const label = formGroup.querySelector("label");
    const randomButton = formGroup.querySelector(".btn-warning");
    const select = formGroup.querySelector("select");

    // Reset button state
    actionButton.textContent = "Add"; // Reset button text
    actionButton.dataset.isGoalSelected = "false"; // Reset selection state
    select.selectedIndex = 0; // Reset select to the first option

    // Remove highlight class from label and re-enable random button
    label.classList.remove("active-goal");
    randomButton.disabled = false; // Enable random button
  });

  // Update the goal selection UI after reset
  updateGoalSelectionUI();
});

// Add event listener for the download button
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadSelectedGoals);

// Add event listener for the "Collapse All" button
document.getElementById("collapseAll").addEventListener("click", function () {
  // Collapse all open accordion sections in both accordions using Bootstrap 5 API
  document.querySelectorAll("#accordion .collapse.show").forEach((collapse) => {
    new bootstrap.Collapse(collapse, {
      toggle: false,
    }).hide();
  });
  document
    .querySelectorAll("#employment-accordion .collapse.show")
    .forEach((collapse) => {
      new bootstrap.Collapse(collapse, {
        toggle: false,
      }).hide();
    });
});
