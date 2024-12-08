let selectedGoals = {
  "Employment Goals PLP": [],
  "Retired PLP": [],
  "Sick PLP": [],
  Sick: [],
  Retired: [],
  "Short-Term Goals": [],
  "Personal Goals": [],
  "Long-Term Goals": [],
  "EMP Goals": [],
  "Short Goals": [], // New category
};

let employmentCategorySelected = null;
let employmentGoalCount = 0;

// Max limits for selections
const maxEmploymentGoals = 10;
const maxOtherGoals = 10;

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

    // Check if 'options' exists and has values
    if (goalData.options && goalData.options.length > 0) {
      goalData.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });
    } else {
      // If options is empty, add a default message or option
      const optionElement = document.createElement("option");
      optionElement.textContent = "No options available";
      select.appendChild(optionElement);
    }

    formGroup.appendChild(select);

    const actionButton = document.createElement("button");
    actionButton.classList.add("btn", "btn-light", "mt-2", "ml-0");
    actionButton.textContent = "Add";
    formGroup.appendChild(actionButton);

    const randomButton = document.createElement("button");
    randomButton.classList.add("btn", "btn-warning", "mt-2", "ml-2");
    randomButton.textContent = "Select Random";
    formGroup.appendChild(randomButton);

    // Track local state for this specific goal using data attribute
    actionButton.dataset.isGoalSelected = false;

    actionButton.addEventListener("click", () => {
      if (!selectedGoals[category]) {
        selectedGoals[category] = []; // Initialize if undefined
      }

      if (actionButton.dataset.isGoalSelected === "false") {
        // Handle adding goals
        if (category === "Employment Goals PLP") {
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
              description: select.value,
            });
            employmentGoalCount++;
            employmentCategorySelected = subCategory;
            actionButton.dataset.isGoalSelected = "true";
            actionButton.textContent = "Remove";
            label.classList.add("active-goal");
            randomButton.disabled = true;
            updateGoalSelectionUI();
          } else {
            alert(
              `You can only select up to ${maxEmploymentGoals} goals in ${category}.`
            );
          }
        } else if (selectedGoals[category].length < maxOtherGoals) {
          selectedGoals[category].push({
            title: goalData.goal,
            description: select.value,
          });
          actionButton.dataset.isGoalSelected = "true";
          actionButton.textContent = "Remove";
          label.classList.add("active-goal");
          randomButton.disabled = true;
          updateGoalSelectionUI();
        } else {
          alert(
            `You can only select up to ${maxOtherGoals} goals in ${category}.`
          );
        }
      } else {
        // Handle removing goals
        const index = selectedGoals[category].findIndex(
          (goal) => goal.title === goalData.goal
        );
        if (index !== -1) {
          selectedGoals[category].splice(index, 1);
          if (category === "Employment Goals PLP") {
            employmentGoalCount--;
            if (employmentGoalCount === 0) {
              employmentCategorySelected = null;
            }
          }
          actionButton.dataset.isGoalSelected = "false"; // Reset local state
          actionButton.textContent = "Add";
          label.classList.remove("active-goal");
          randomButton.disabled = false;
          updateGoalSelectionUI();
        }
      }
    });

    randomButton.addEventListener("click", () => {
      // Only allow random selection if there are valid options
      if (select.options.length > 1) {
        const options = Array.from(select.options);
        const randomIndex = Math.floor(Math.random() * options.length);
        select.value = options[randomIndex].textContent;
        actionButton.click();
      }
    });

    container.appendChild(formGroup);
  });
}

function populateGoals(goals, containerId, category) {
  const container = document.getElementById(containerId);
  populateSubCategoryGoals(goals, container, category);
}

function populateEmploymentGoals(goals) {
  const withJobContainer = document.getElementById("with-job-waiting");
  const unsureCareerContainer = document.getElementById(
    "unsure-career-direction"
  );
  const sickContainer = document.getElementById("ShortGoalsRev-goals");
  const retiredContainer = document.getElementById("LongGoalsRev");

  populateSubCategoryGoals(
    goals.EmpGoalsReview || [],
    withJobContainer,
    "Employment Goals Review",
    "Employment Goals Review"
  );
  populateSubCategoryGoals(
    goals.PersonalGoalsRev || [],
    unsureCareerContainer,
    "Employment Goals Review",
    "Personal Goals Review"
  );
  populateSubCategoryGoals(
    goals.ShortGoalsRev || [],
    sickContainer,
    "Employment Goals Review",
    "ShortGoalsRev"
  );
  populateSubCategoryGoals(
    goals.LongGoalsRev || [],
    retiredContainer,
    "Employment Goals Review",
    "LongGoalsRev"
  );
}

function populatePLPGoals(goals) {
  const plpStart = goals.PLPStart || {}; // Use empty object if PLPStart is missing

  const subCategoryContainers = {
    "Employment Goals PLP": document.getElementById(
      "employment-goals-plp-container"
    ),
    "Personal Goals PLP": document.getElementById(
      "personal-goals-plp-container"
    ),
    "Short-Term Goals PLP": document.getElementById(
      "short-term-goals-plp-container"
    ),
    "Long-Term Goals PLP": document.getElementById(
      "long-term-goals-plp-container"
    ),
    "Retired Goals PLP": document.getElementById("retired-goals-plp-container"),
    "Sick Goals PLP": document.getElementById("sick-goals-plp-container"),
  };

  // Iterate over each subcategory in PLPStart
  Object.keys(plpStart).forEach((subCategory) => {
    const container = subCategoryContainers[subCategory];

    // Only populate if container exists in the HTML
    if (container) {
      populateSubCategoryGoals(
        plpStart[subCategory],
        container,
        "PLP Creation",
        subCategory
      );
    } else {
      console.warn(`Container for ${subCategory} does not exist in the HTML.`);
    }
  });
}
