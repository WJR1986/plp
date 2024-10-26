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

        // Create title and description elements
        const title = document.createElement("h5");
        title.className = "mb-1"; // Margin-bottom for title
        title.textContent = `${category}: ${goal.title}`;
        goalDiv.appendChild(title);

        const description = document.createElement("p");
        description.className = "mb-0"; // No bottom margin for description
        description.textContent = goal.description;
        goalDiv.appendChild(description);

        selectedGoalsList.appendChild(goalDiv);
      });
    }
  });
}

// Function to download selected goals
function downloadSelectedGoals() {
  const goalsArray = [];
  // Collect all selected goals
  Object.keys(selectedGoals).forEach((category) => {
    selectedGoals[category].forEach((goal) => {
      goalsArray.push(`${category}: ${goal.title}\n${goal.description}\n`);
    });
  });

  // Create a blob from the goals array
  const blob = new Blob([goalsArray.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
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

// Fetch JSON from external file and populate goals
fetch("goals.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate Employment Goals
    populateEmploymentGoals(data.EmploymentGoals);

    // Populate Short-Term Goals
    populateGoals(
      data.ShortTermGoals,
      "short-term-goals-container",
      "Short-Term Goals"
    );

    // Populate Personal Goals
    populateGoals(
      data.PersonalGoals,
      "personal-goals-container",
      "Personal Goals"
    );

    // Populate Long-Term Goals
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

  // Populate subcategories
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

// Populate the goals dynamically with a single button that toggles between Add/Remove
function populateSubCategoryGoals(
  goals,
  container,
  category,
  subCategory = null
) {
  goals.forEach((goalData) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group", "p-2", "bg-dark", "text-light"); // Dark theme classes

    // Create label for each goal
    const label = document.createElement("label");
    label.textContent = goalData.goal;
    label.className = "text-light"; // Light text for label
    formGroup.appendChild(label);

    // Create select dropdown for options
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

    // Create a single button that toggles between Add/Remove
    const actionButton = document.createElement("button");
    actionButton.classList.add("btn", "btn-light", "mt-2", "ml-0");
    actionButton.textContent = "Add";
    formGroup.appendChild(actionButton);

    // Track if the goal has been selected
    let isGoalSelected = false;

    // Add event listener for the button
    actionButton.addEventListener("click", () => {
      if (!isGoalSelected) {
        // Try to add the goal
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

            // Change text color to green
            label.classList.add("active-goal"); // Add active class to label
            updateGoalSelectionUI();
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

          // Change text color to green
          label.classList.add("active-goal"); // Add active class to label
          updateGoalSelectionUI();
        } else {
          alert(`You can only select up to 2 goals in ${category}.`);
        }
      } else {
        // Remove the goal
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

          // Revert text color to original
          label.classList.remove("active-goal"); // Remove active class from label
          updateGoalSelectionUI();
        }
      }
    });

    container.appendChild(formGroup);
  });
}

// Populate general goals for categories other than Employment
function populateGoals(goals, containerId, category) {
  const container = document.getElementById(containerId);
  populateSubCategoryGoals(goals, container, category);
}
