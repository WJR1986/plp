// Fetch JSON from external file and populate goals
fetch("goals.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate Employment Goals (iterate through categories like "WithJobWaiting", "UnsureCareerDirection")
    Object.keys(data.EmploymentGoals).forEach((category) => {
      populateGoals(
        data.EmploymentGoals[category],
        "employment-goals-container",
        category
      );
    });

    // Populate Short-Term Goals
    populateGoals(data.ShortTermGoals, "short-term-goals-container");

    // Populate Personal Goals
    populateGoals(data.PersonalGoals, "personal-goals-container");

    // Populate Long-Term Goals
    populateGoals(data.LongTermGoals, "long-term-goals-container");
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Populate the goals dynamically, include category headings when available
function populateGoals(goals, containerId, category = null) {
  const container = document.getElementById(containerId);

  // Create a category heading if provided
  if (category) {
    const categoryHeading = document.createElement("h4");
    categoryHeading.textContent = category.replace(/([A-Z])/g, " $1"); // Add spaces between camelCase words
    categoryHeading.classList.add("mt-3");
    container.appendChild(categoryHeading);
  }

  // Create form groups for each goal
  goals.forEach((goalData) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

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
    container.appendChild(formGroup);
  });
}

// Show selected goals in a list with category headings
function showSelectedGoals() {
  const selectedGoals = {
    "Employment Goals": [],
    "Short-Term Goals": [],
    "Personal Goals": [],
    "Long-Term Goals": [],
  };

  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    const goalText = select.previousElementSibling.textContent; // Get the goal text from the label
    const selectedOption = select.value;

    // Determine which category the goal belongs to
    if (select.closest("#employment-goals-container")) {
      selectedGoals["Employment Goals"].push(`${goalText}: ${selectedOption}`);
    } else if (select.closest("#short-term-goals-container")) {
      selectedGoals["Short-Term Goals"].push(`${goalText}: ${selectedOption}`);
    } else if (select.closest("#personal-goals-container")) {
      selectedGoals["Personal Goals"].push(`${goalText}: ${selectedOption}`);
    } else if (select.closest("#long-term-goals-container")) {
      selectedGoals["Long-Term Goals"].push(`${goalText}: ${selectedOption}`);
    }
  });

  // Display the selected goals with headings
  let displayHtml = "<h4>Selected Goals:</h4>";
  Object.keys(selectedGoals).forEach((category) => {
    if (selectedGoals[category].length > 0) {
      displayHtml += `<h5>${category}</h5><ul>`;
      selectedGoals[category].forEach((goal) => {
        displayHtml += `<li>${goal}</li>`;
      });
      displayHtml += "</ul>";
    }
  });

  document.getElementById("selected-goals").innerHTML = displayHtml;
}
