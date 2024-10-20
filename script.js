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
  selectedGoalsList.innerHTML = "";

  // Render selected goals
  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      selectedGoals[category].forEach((goal) => {
        const li = document.createElement("li");
        li.textContent = `${category}: ${goal}`;
        selectedGoalsList.appendChild(li);
      });
    }
  });
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

  populateSubCategoryGoals(
    goals.WithJobWaiting,
    withJobContainer,
    "Employment Goals",
    "With Job Waiting"
  );
  populateSubCategoryGoals(
    goals.UnsureCareerDirection,
    unsureCareerContainer,
    "Employment Goals",
    "Unsure Career Direction"
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
    formGroup.classList.add("form-group", "p-2");
    formGroup.style.border = "1px solid #ddd"; // Visual indication of goal block

    // Create label for each goal
    const label = document.createElement("label");
    label.textContent = goalData.goal;
    formGroup.appendChild(label);

    // Create select dropdown for options
    const select = document.createElement("select");
    select.classList.add("form-control");

    goalData.options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    formGroup.appendChild(select);

    // Create a single button that toggles between Add/Remove
    const actionButton = document.createElement("button");
    actionButton.classList.add("btn", "ml-2");
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
            selectedGoals[category].push(`${goalData.goal}: ${select.value}`);
            employmentGoalCount++;
            employmentCategorySelected = subCategory;
            isGoalSelected = true;
            actionButton.textContent = "Remove";
            formGroup.style.backgroundColor = "#e6ffe6"; // Highlight the selected goal
            updateGoalSelectionUI();
          } else {
            alert("You can only select up to 3 Employment Goals.");
          }
        } else if (selectedGoals[category].length < maxOtherGoals) {
          selectedGoals[category].push(`${goalData.goal}: ${select.value}`);
          isGoalSelected = true;
          actionButton.textContent = "Remove";
          formGroup.style.backgroundColor = "#e6ffe6"; // Highlight the selected goal
          updateGoalSelectionUI();
        } else {
          alert(`You can only select up to 2 goals in ${category}.`);
        }
      } else {
        // Remove the goal
        const index = selectedGoals[category].findIndex((goal) =>
          goal.includes(goalData.goal)
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
          formGroup.style.backgroundColor = ""; // Remove the highlight
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
