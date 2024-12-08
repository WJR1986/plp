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

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Copied to clipboard:", text);
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
}

// Function to show success message
function showCopySuccessMessage(button) {
  const copySuccessMessage = document.createElement("span");
  copySuccessMessage.className = "copy-success"; // Class for styling
  copySuccessMessage.style.color = "#aef7ae"; // Set the color to green
  copySuccessMessage.style.marginLeft = "10px"; // Space between button and message
  copySuccessMessage.style.display = "inline"; // Initially hidden
  copySuccessMessage.innerHTML = `Copied! ✅`; // Success message

  button.parentElement.appendChild(copySuccessMessage);

  setTimeout(() => {
    if (copySuccessMessage.parentElement) {
      copySuccessMessage.style.display = "none"; // Hide after 2 seconds
      copySuccessMessage.parentElement.removeChild(copySuccessMessage); // Remove the element from the DOM
    }
  }, 2000); // Adjust the time as necessary
}

// Function to handle adding a goal
function handleAddGoal(
  actionButton,
  select,
  category,
  subCategory,
  goalData,
  label,
  randomButton
) {
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
        alert("You can only select from one subcategory in Employment Goals.");
        return;
      }
      if (employmentGoalCount < maxEmploymentGoals) {
        addGoal(
          category,
          goalData,
          select.value,
          subCategory,
          actionButton,
          label,
          randomButton
        );
      } else {
        alert(
          `You can only select up to ${maxEmploymentGoals} goals in ${category}.`
        );
      }
    } else if (selectedGoals[category].length < maxOtherGoals) {
      addGoal(
        category,
        goalData,
        select.value,
        subCategory,
        actionButton,
        label,
        randomButton
      );
    } else {
      alert(`You can only select up to ${maxOtherGoals} goals in ${category}.`);
    }
  } else {
    removeGoal(category, goalData, actionButton, label, randomButton);
  }
}

// Function to add a goal
function addGoal(
  category,
  goalData,
  description,
  subCategory,
  actionButton,
  label,
  randomButton
) {
  selectedGoals[category].push({
    title: goalData.goal,
    description: description,
  });
  if (category === "Employment Goals PLP") {
    employmentGoalCount++;
    employmentCategorySelected = subCategory;
  }
  actionButton.dataset.isGoalSelected = "true";
  actionButton.textContent = "Remove";
  label.classList.add("active-goal");
  randomButton.disabled = true;
  updateGoalSelectionUI();
  copyToClipboard(description); // Copy to clipboard
  showCopySuccessMessage(actionButton); // Show success message
}

// Function to remove a goal
function removeGoal(category, goalData, actionButton, label, randomButton) {
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

// Function to remove all goals
function removeAllGoals() {
  // Clear the selectedGoals object
  for (let category in selectedGoals) {
    if (selectedGoals.hasOwnProperty(category)) {
      selectedGoals[category] = [];
    }
  }

  // Update the UI to reflect the removal of all goals
  updateGoalSelectionUI();

  // Close the modal
  const confirmationModal = new bootstrap.Modal(
    document.getElementById("confirmationModal")
  );
  confirmationModal.hide();
}

// Function to update the UI after goals are modified
function updateGoalSelectionUI() {
  const selectedGoalsList = document.getElementById("selected-goals-list");
  selectedGoalsList.innerHTML = ""; // Clear the list

  // Disable the download button
  const downloadButton = document.getElementById("downloadButton");
  downloadButton.disabled = true;
  downloadButton.style.display = "none";
}

// Add event listener for the "Remove All Goals" button
document
  .getElementById("confirmRemoval")
  .addEventListener("click", removeAllGoals);

// Function to populate subcategory goals
function populateSubCategoryGoals(
  goals,
  container,
  category,
  subCategory = null
) {
  console.log(
    `Populating goals for category: ${category}, subCategory: ${subCategory}`
  );
  goals.forEach((goalData) => {
    console.log(`Processing goal: ${goalData.goal}`);
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
    actionButton.classList.add("btn", "btn-light", "mt-2"); // Added 'me-2' for margin-end
    actionButton.textContent = "Add";
    formGroup.appendChild(actionButton);

    const randomButton = document.createElement("button");
    randomButton.classList.add("btn", "btn-warning", "mt-2");
    randomButton.textContent = "Select Random";
    formGroup.appendChild(randomButton);

    // Track local state for this specific goal using data attribute
    actionButton.dataset.isGoalSelected = false;

    actionButton.addEventListener("click", () => {
      handleAddGoal(
        actionButton,
        select,
        category,
        subCategory,
        goalData,
        label,
        randomButton
      );
    });

    randomButton.addEventListener("click", () => {
      // Only allow random selection if there are valid options
      if (select.options.length > 1) {
        const options = Array.from(select.options);
        const randomIndex = Math.floor(Math.random() * options.length);
        select.value = options[randomIndex].textContent;
        copyToClipboard(select.value); // Copy to clipboard
        showCopySuccessMessage(randomButton); // Show success message
      }
    });

    container.appendChild(formGroup);
  });
}

// Function to populate goals
function populateGoals(goals, containerId, category) {
  const container = document.getElementById(containerId);
  console.log(
    `Populating goals for container: ${containerId}, category: ${category}`
  );
  populateSubCategoryGoals(goals, container, category);
}

// Function to populate employment goals
function populateEmploymentGoals(goals) {
  console.log("Populating Employment Goals:", goals);
  const withJobContainer = document.getElementById("with-job-waiting");
  const unsureCareerContainer = document.getElementById(
    "unsure-career-direction"
  );
  const sickContainer = document.getElementById("ShortGoalsRev-goals");
  const retiredContainer = document.getElementById("LongGoalsRev");
  const sickReviewContainer = document.getElementById(
    "sick-goals-review-container"
  );
  const retiredReviewContainer = document.getElementById(
    "retired-goals-review-container"
  );

  console.log("withJobContainer:", withJobContainer);
  console.log("unsureCareerContainer:", unsureCareerContainer);
  console.log("sickContainer:", sickContainer);
  console.log("retiredContainer:", retiredContainer);
  console.log("sickReviewContainer:", sickReviewContainer);
  console.log("retiredReviewContainer:", retiredReviewContainer);

  populateSubCategoryGoals(
    goals.Reviews.EmpGoalsReview || [],
    withJobContainer,
    "Employment Goals Review",
    "Employment Goals Review"
  );
  populateSubCategoryGoals(
    goals.Reviews.PersonalGoalsRev || [],
    unsureCareerContainer,
    "Employment Goals Review",
    "Personal Goals Review"
  );
  populateSubCategoryGoals(
    goals.Reviews.ShortGoalsRev || [],
    sickContainer,
    "Employment Goals Review",
    "ShortGoalsRev"
  );
  populateSubCategoryGoals(
    goals.Reviews.LongGoalsRev || [],
    retiredContainer,
    "Employment Goals Review",
    "LongGoalsRev"
  );
  populateSubCategoryGoals(
    goals.Reviews.SickGoalsRev || [],
    sickReviewContainer,
    "Employment Goals Review",
    "SickGoalsRev"
  );
  populateSubCategoryGoals(
    goals.Reviews.RetiredGoalsRev || [],
    retiredReviewContainer,
    "Employment Goals Review",
    "RetiredGoalsRev"
  );
}

// Function for populating PLP Created goals
function populatePLPGoals(goals) {
  console.log("Populating PLP Goals:", goals);
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
    console.log(
      `Populating subcategory: ${subCategory}, container: ${container}`
    );

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

// Function for populating PLP Exits goals
function populatePLPExits(goals) {
  console.log("Populating PLP Exits:", goals);
  const plpExits = goals.PLPExits || {}; // Use empty object if PLPExits is missing

  const subCategoryContainers = {
    EmpGoalsExit: document.getElementById("employment-goals-exit-container"),
    PersonalGoalsExit: document.getElementById("personal-goals-exit-container"),
    ShortGoalsExit: document.getElementById("short-term-goals-exit-container"),
    LongGoalsExit: document.getElementById("long-term-goals-exit-container"),
    SickGoalsExit: document.getElementById("sick-goals-exit-container"),
    RetiredGoalsExit: document.getElementById("retired-goals-exit-container"),
  };

  // Iterate over each subcategory in PLPExits
  Object.keys(plpExits).forEach((subCategory) => {
    const container = subCategoryContainers[subCategory];
    console.log(
      `Populating subcategory: ${subCategory}, container: ${container}`
    );

    // Only populate if container exists in the HTML
    if (container) {
      populateSubCategoryGoals(
        plpExits[subCategory],
        container,
        "PLP Exits",
        subCategory
      );
    } else {
      console.warn(`Container for ${subCategory} does not exist in the HTML.`);
    }
  });
}
