let selectedGoals = {
  "Employment Goals": [],
  "Short-Term Goals": [],
  "Personal Goals": [],
  "Long-Term Goals": [],
  "IAG Goals": [],
};

let employmentCategorySelected = null;
let employmentGoalCount = 0;

// Max limits for selections
const maxEmploymentGoals = 2;
const maxOtherGoals = 2;

function updateGoalSelectionUI() {
  const selectedGoalsList = document.getElementById("selected-goals-list");
  selectedGoalsList.innerHTML = ""; // Clear previous entries

  // Render selected goals
  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      // Create a container for the category
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "goal-category"; // Custom class for styling
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

        if (category === "IAG Goals") {
          goalText.innerHTML = `<strong>${goal.title}</strong><br>Personal Learning Plan created at HMP Northumberland on ${goal.date}.`;
        } else {
          goalText.innerHTML = `<strong>${goal.title}</strong><br>${goal.description}`; // Format with a line break
        }

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
          let textToCopy;

          if (category === "IAG Goals") {
            // Format the text to include both title and date
            textToCopy = `${goal.title}: Personal Learning Plan created at HMP Northumberland on ${goal.date}.`;
          } else {
            textToCopy = goal.description; // Just the description for other categories
          }

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

    // Track local state for this specific goal using data attribute
    actionButton.dataset.isGoalSelected = false;

    actionButton.addEventListener("click", () => {
      if (actionButton.dataset.isGoalSelected === "false") {
        // Handle adding goals
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
        } else if (category === "IAG Goals") {
          const currentDate = new Date().toLocaleDateString("en-GB"); // Get the current date
          selectedGoals[category].push({
            title: goalData.goal,
            description: select.value,
            date: currentDate, // Include the date here
          });
          actionButton.dataset.isGoalSelected = "true";
          actionButton.textContent = "Remove";
          label.classList.add("active-goal");
          randomButton.disabled = true;
          updateGoalSelectionUI();
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
          if (category === "Employment Goals") {
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
      const options = Array.from(select.options);
      const randomIndex = Math.floor(Math.random() * options.length);
      select.value = options[randomIndex].textContent;
      actionButton.click();
    });

    container.appendChild(formGroup);
  });
}

// Event listener for the "Remove All" button in the modal
document.getElementById("confirmRemoval").addEventListener("click", () => {
  // Reset the selected goals and counters
  selectedGoals = {
    "Employment Goals": [],
    "Short-Term Goals": [],
    "Personal Goals": [],
    "Long-Term Goals": [],
    "IAG Goals": [],
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
    populateGoals(data.IAGGoals, "IAG-goals-container", "IAG Goals");
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
// function toggleScrollButton() {
//   const resultsDiv = document.getElementById("results");
//   const scrollToResultsButton = document.getElementById("scrollToResults");

//   scrollToResultsButton.style.display = isElementInViewport(resultsDiv)
//     ? "none"
//     : "block";
// }

// Attach the scroll event listener
// window.addEventListener("scroll", toggleScrollButton);

// Smooth scroll to results section
// document.getElementById("scrollToResults").addEventListener("click", () => {
//   document.getElementById("results").scrollIntoView({ behavior: "smooth" });
// });

// Initialize the UI
updateGoalSelectionUI();

// Download logic
function downloadSelectedGoals() {
  let textContent = "";

  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      textContent += `${category}:\n`;
      selectedGoals[category].forEach((goal) => {
        if (category === "IAG Goals") {
          // Ensure the date is formatted correctly as DD/MM/YYYY
          textContent += `${goal.title}: Personal Learning Plan created at HMP Northumberland on ${goal.date}.\n`;
        } else {
          textContent += `${goal.title}:\n${goal.description}\n`; // Ensure description is on a new line
        }
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
