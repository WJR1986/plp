function showCopySuccessMessage(button) {
  // Check if a success message already exists
  let existingMessage = button.parentElement.querySelector(".copy-success");
  if (existingMessage) {
    button.parentElement.removeChild(existingMessage);
  }

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
        copyButton.className = "btn btn-light btn-sm ml-2 ms-2"; // Styling for the button
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
                if (copySuccessMessage.parentElement) {
                  copySuccessMessage.style.display = "none"; // Hide after 2 seconds
                  copySuccessMessage.parentElement.removeChild(
                    copySuccessMessage
                  ); // Remove the element from the DOM
                }
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

// Function to add a goal to the list with a copy button
function addGoalToList(goalText) {
  const goalItem = document.createElement("li");
  goalItem.className = "goal-item";

  // Create the goal text span
  const goalTextSpan = document.createElement("span");
  goalTextSpan.textContent = goalText;
  goalTextSpan.className = "goal-text";

  // Create the copy button
  const copyButton = document.createElement("button");
  copyButton.className = "btn btn-outline-primary btn-sm ml-2";
  copyButton.innerHTML = '<i class="fas fa-copy"></i>'; // Font Awesome icon
  copyButton.onclick = () => copyGoalToClipboard(goalText);

  // Append elements to the list item
  goalItem.appendChild(goalTextSpan);
  goalItem.appendChild(copyButton);

  // Append the goal item to the selected goals list
  document.getElementById("selected-goals-list").appendChild(goalItem);
}

// Function to copy text to clipboard
function copyGoalToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Goal copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

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
  const confirmationModalElement = document.getElementById("confirmationModal");
  const confirmationModal = bootstrap.Modal.getInstance(
    confirmationModalElement
  );
  confirmationModal.hide();
}

// Add event listener for the "Remove All Goals" button
document
  .getElementById("confirmRemoval")
  .addEventListener("click", removeAllGoals);
