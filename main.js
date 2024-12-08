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

// Fetch and populate PLP Created goals
fetch("goals.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Add this line to verify the structure
    populatePLPGoals(data);
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Example usage of adding a goal with a copy button
addGoalToList("Learn JavaScript");
addGoalToList("Improve Time Management");

// Initialize the UI
updateGoalSelectionUI();
