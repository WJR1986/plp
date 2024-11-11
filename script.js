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

function updateGoalSelectionUI() {
  const selectedGoalsList = document.getElementById("selected-goals-list");
  selectedGoalsList.innerHTML = ""; // Clear previous entries
  selectedGoalsList.style.paddingLeft = "0"; // Remove left padding

  // Render selected goals
  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      // Create a container for the category
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "goal-category"; // Custom class for styling
      categoryContainer.style.backgroundColor = "#495057";
      categoryContainer.style.border = "1px solid white"; // Set white border for the category
      categoryContainer.style.padding = "10px"; // Add padding
      categoryContainer.style.marginBottom = "15px"; // Spacing between categories

      // Create category title element
      const categoryTitle = document.createElement("h5");
      categoryTitle.style.color = "white"; // Set category title color
      categoryTitle.textContent = category; // Set category title text
      categoryContainer.appendChild(categoryTitle);

      selectedGoals[category].forEach((goal) => {
        const goalItem = document.createElement("div");
        goalItem.style.color = "white"; // Set text color to white
        goalItem.style.marginBottom = "5px"; // Spacing between goals

        // Create formatted text for the goal
        const goalText = document.createElement("span");
        goalText.innerHTML = `<strong>${goal.title}</strong><br>${goal.description}`;

        goalItem.appendChild(goalText);

        // Create a copy button
        const copyButton = document.createElement("button");
        copyButton.className = "btn btn-light btn-sm ml-2"; // Styling for the button
        copyButton.textContent = "Copy";

        // Create a span for the success message
        const copySuccessMessage = document.createElement("span");
        copySuccessMessage.className = "copy-success"; // Class for styling
        copySuccessMessage.style.color = "#aef7ae"; // Set the color to green
        copySuccessMessage.style.marginLeft = "10px"; // Space between button and message
        copySuccessMessage.style.display = "none"; // Initially hidden
        copySuccessMessage.innerHTML = `Copied! ✅`; // Success message

        // Add event listener to copy the goal description
        copyButton.addEventListener("click", () => {
          let textToCopy = goal.description; // Copy only the goal description

          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              // Show success message
              copySuccessMessage.style.display = "inline"; // Show the message
              setTimeout(() => {
                copySuccessMessage.style.display = "none"; // Hide after 2 seconds
              }, 2000); // Adjust the time as necessary
            })
            .catch((err) => {
              console.error("Error copying text: ", err);
            });
        });

        goalItem.appendChild(copyButton); // Append copy button to the goal item
        goalItem.appendChild(copySuccessMessage); // Append success message to the goal item
        categoryContainer.appendChild(goalItem); // Append goal item to category container
      });

      selectedGoalsList.appendChild(categoryContainer); // Append category container to the main list
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
  downloadButton.disabled = Object.values(selectedGoals).every(
    (goals) => goals.length === 0
  );
}

// Remove all goals function
function removeAllGoals() {
  // Show confirmation modal
  $("#confirmationModal").modal("show");
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

// Event listener for the "Remove All" button in the modal
document.getElementById("confirmRemoval").addEventListener("click", () => {
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

  // Close modal
  $("#confirmationModal").modal("hide");
});

// Fetch JSON from external file and populate goals
fetch("goals.json")
  .then((response) => response.json())
  .then((data) => {
    populateEmploymentGoals(data.Reviews);

    populateGoals(data.Retired, "retired-goals-container", "Retired");
    populateGoals(data.Sick, "sick-goals-container", "Sick");
    populateGoals(data.Short, "short-goals-container", "Short Term Goals"); // New Short Goals
  })
  .catch((error) => console.error("Error loading JSON:", error));

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

function populateGoals(goals, containerId, category) {
  const container = document.getElementById(containerId);
}

// Function for populating PLP Created goals
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

// Fetch and populate PLP Created goals
fetch("goals.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Add this line to verify the structure
    populatePLPGoals(data);
  })
  .catch((error) => console.error("Error loading JSON:", error));

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
  const CollapseAllButton = document.getElementById("collapseAll");

  scrollToResultsButton.style.display = isElementInViewport(resultsDiv)
    ? "none"
    : "block";
  CollapseAllButton.style.display = isElementInViewport(resultsDiv)
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

// Download logic
function downloadSelectedGoals() {
  let textContent = "";

  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      textContent += `${category}:\n`;
      selectedGoals[category].forEach((goal) => {
        textContent += `${goal.title}:\n${goal.description}\n`; // Ensure description is on a new line
      });
      textContent += "\n"; // Add an extra line for separation
    }
  });

  if (textContent.trim() === "") {
    alert("No goals selected for download.");
    return; // Early exit if there's no content
  }

  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "selected_goals.txt"; // Name of the downloaded file
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up
  URL.revokeObjectURL(url); // Clean up the URL object
}

// Add event listener for the download button
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadSelectedGoals);

// Event listener for Collapse All button:
// Add event listener for the "Collapse All" button
document.getElementById("collapseAll").addEventListener("click", function () {
  // Collapse all open accordion sections in both accordions
  $("#accordion .collapse.show").collapse("hide");
  $("#employment-accordion .collapse.show").collapse("hide");
});
