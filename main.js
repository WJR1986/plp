// Fetch JSON from external files and populate goals
Promise.all([
  fetch("plpStart.json").then((response) => response.json()),
  fetch("reviews.json").then((response) => response.json()),
  fetch("plpExits.json").then((response) => response.json()), // Add this line
])
  .then(([plpStartData, reviewsData, plpExitsData]) => {
    // Add plpExitsData
    console.log("PLP Start Data:", plpStartData);
    console.log("Reviews Data:", reviewsData);
    console.log("PLP Exits Data:", plpExitsData); // Add this line
    populatePLPGoals(plpStartData);
    populateEmploymentGoals(reviewsData);
    populatePLPExits(plpExitsData); // Add this line
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Example usage of adding a goal with a copy button
addGoalToList("Learn JavaScript");
addGoalToList("Improve Time Management");

// Initialize the UI
updateGoalSelectionUI();
