let selectedGoals = {
  "Employment Goals": [],
  "Short-Term Goals": [],
  "Personal Goals": [],
  "Long-Term Goals": [],
};

let employmentCategorySelected = null;
let employmentGoalCount = 0;

// Max limits for selections
const maxEmploymentGoals = 3;
const maxOtherGoals = 2;

// Function to update goal selection UI
function updateGoalSelectionUI() {
  const selectedGoalsList = document.getElementById("selected-goals-list");
  selectedGoalsList.className = "pl-0";
  selectedGoalsList.innerHTML = "";

  // Render selected goals
  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      selectedGoals[category].forEach((goal) => {
        const goalDiv = document.createElement("div");
        goalDiv.className = "mb-3 border border-light p-3 bg-dark text-light"; // Bootstrap classes for styling

        const title = document.createElement("h5");
        title.className = "mb-1";
        title.textContent = `${category}: ${goal.title}`;
        goalDiv.appendChild(title);

        const description = document.createElement("p");
        description.className = "mb-0";
        description.textContent = goal.description;
        goalDiv.appendChild(description);

        selectedGoalsList.appendChild(goalDiv);
      });
    }
  });

  // Enable or disable the "Remove All Goals" button based on selection
  const removeAllButton = document.getElementById("remove-all-goals");
  removeAllButton.disabled = Object.values(selectedGoals).every(
    (goals) => goals.length === 0
  );

  // Update the download button state
  updateDownloadButton();
}

// Function to update the download button state
function updateDownloadButton() {
  const downloadButton = document.getElementById("downloadButton");

  // Enable button if there are goals added, otherwise disable it
  downloadButton.disabled = Object.values(selectedGoals).every(
    (goals) => goals.length === 0
  );
}

// Function to download selected goals
function downloadSelectedGoals() {
  const goalsArray = [];
  Object.keys(selectedGoals).forEach((category) => {
    selectedGoals[category].forEach((goal) => {
      goalsArray.push(`${category}: ${goal.title}\n${goal.description}\n`);
    });
  });

  const blob = new Blob([goalsArray.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "selected_goals.txt";
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// Remove all goals function
function removeAllGoals() {
  $("#confirmationModal").modal("show");
}

// Event listener for the "Remove All" button in the modal
document.getElementById("confirmRemoval").addEventListener("click", () => {
  selectedGoals = {
    "Employment Goals": [],
    "Short-Term Goals": [],
    "Personal Goals": [],
    "Long-Term Goals": [],
  };
  employmentCategorySelected = null;
  employmentGoalCount = 0;

  updateGoalSelectionUI();
  $("#confirmationModal").modal("hide");
});

// Fetch JSON from external file and populate goals
fetch("goals.json")
  .then((response) => response.json())
  .then((data) => {
    populateEmploymentGoals(data.EmploymentGoals);
    populateGoals(
      data.ShortTermGoals,
      "short-term-goals-container",
      "Short-Term Goals"
    );
    populateGoals(
      data.PersonalGoals,
      "personal-goals-container",
      "Personal Goals"
    );
    populateGoals(
      data.LongTermGoals,
      "long-term-goals-container",
      "Long-Term Goals"
    );
  })
  .catch((error) => console.error("Error loading JSON:", error));

function populateEmploymentGoals(goals) {
  const withJobContainer = document.getElementById("with-job-waiting");
  const unsureCareerContainer = document.getElementById(
    "unsure-career-direction"
  );
  const sickContainer = document.getElementById("sick-goals");
  const retiredContainer = document.getElementById("retired-goals");

  populateSubCategoryGoals(
    goals.WithJobWaiting || [],
    withJobContainer,
    "Employment Goals",
    "With Job Waiting"
  );
  populateSubCategoryGoals(
    goals.UnsureCareerDirection || [],
    unsureCareerContainer,
    "Employment Goals",
    "Unsure Career Direction"
  );
  populateSubCategoryGoals(
    goals.Sick || [],
    sickContainer,
    "Employment Goals",
    "Sick"
  );
  populateSubCategoryGoals(
    goals.Retired || [],
    retiredContainer,
    "Employment Goals",
    "Retired"
  );
}

function populateSubCategoryGoals(
  goals,
  container,
  category,
  subCategory = null
) {
  goals.forEach((goalData) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group", "p-2", "bg-dark", "text-light");

    const label = document.createElement("label");
    label.textContent = goalData.goal;
    label.className = "text-light";
    formGroup.appendChild(label);

    const select = document.createElement("select");
    select.classList.add(
      "form-control",
      "bg-dark",
      "text-light",
      "border-light"
    );

    goalData.options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    formGroup.appendChild(select);

    const actionButton = document.createElement("button");
    actionButton.classList.add("btn", "btn-light", "mt-2", "ml-0");
    actionButton.textContent = "Add";
    formGroup.appendChild(actionButton);

    const randomButton = document.createElement("button");
    randomButton.classList.add("btn", "btn-warning", "mt-2", "ml-2");
    randomButton.textContent = "Select Random";
    formGroup.appendChild(randomButton);

    let isGoalSelected = false;

    actionButton.addEventListener("click", () => {
      if (!isGoalSelected) {
        if (category === "Employment Goals") {
          if (
            employmentCategorySelected &&
            employmentCategorySelected !== subCategory
          ) {
            alert(
              "You can only select from one subcategory in Employment Goals."
            );
            return;
          }
          if (employmentGoalCount < maxEmploymentGoals) {
            selectedGoals[category].push({
              title: goalData.goal,
              description: `${select.value}`,
            });
            employmentGoalCount++;
            employmentCategorySelected = subCategory;
            isGoalSelected = true;
            actionButton.textContent = "Remove";
            label.classList.add("active-goal");
            randomButton.disabled = true;
            updateGoalSelectionUI(); // Update UI after adding goal
          } else {
            alert("You can only select up to 3 Employment Goals.");
          }
        } else if (selectedGoals[category].length < maxOtherGoals) {
          selectedGoals[category].push({
            title: goalData.goal,
            description: `${select.value}`,
          });
          isGoalSelected = true;
          actionButton.textContent = "Remove";
          label.classList.add("active-goal");
          randomButton.disabled = true;
          updateGoalSelectionUI(); // Update UI after adding goal
        } else {
          alert(`You can only select up to 2 goals in ${category}.`);
        }
      } else {
        const index = selectedGoals[category].findIndex(
          (goal) => goal.title === goalData.goal
        );
        if (index !== -1) {
          selectedGoals[category].splice(index, 1);
          if (category === "Employment Goals") {
            employmentGoalCount--;
            if (employmentGoalCount === 0) {
              employmentCategorySelected = null;
            }
          }
          isGoalSelected = false;
          actionButton.textContent = "Add";
          label.classList.remove("active-goal");
          randomButton.disabled = false;
          updateGoalSelectionUI(); // Update UI after removing goal
        }
      }
    });

    randomButton.addEventListener("click", () => {
      const options = Array.from(select.options);
      if (options.length === 0) return;

      const randomIndex = Math.floor(Math.random() * options.length);
      const randomOption = options[randomIndex].textContent;
      select.value = randomOption;

      actionButton.click();
    });

    container.appendChild(formGroup);
  });
}

function populateGoals(goals, containerId, category) {
  const container = document.getElementById(containerId);
  populateSubCategoryGoals(goals, container, category);
}

// Function to check if the results div is in the viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Show or hide the floating button based on scroll position
function toggleScrollButton() {
  const resultsDiv = document.getElementById("results");
  const scrollToResultsButton = document.getElementById("scrollToResults");

  scrollToResultsButton.style.display = isElementInViewport(resultsDiv)
    ? "none"
    : "block";
}

// Attach the scroll event listener
window.addEventListener("scroll", toggleScrollButton);

// Smooth scroll to results section
document.getElementById("scrollToResults").addEventListener("click", () => {
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});

// Initialize the UI
updateGoalSelectionUI();
