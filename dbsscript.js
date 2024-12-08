// Store answers in a global object
let answers = {};

// Handle user answers and navigate the question flow
function handleAnswer(questionId, answer) {
  // Store the answer
  answers[`question-${questionId}`] = answer;

  // Hide the current question
  document.getElementById(`question-${questionId}`).style.display = "none";

  // Show the next question or result based on the user's input
  if (questionId === 1) {
    if (answer === "yes") {
      displayResult(
        "You need to disclose your conviction due to the serious nature of the offence."
      );
    } else {
      document.getElementById("question-2").style.display = "block";
    }
  } else if (questionId === 2) {
    if (answer === "yes") {
      displayResult(
        "You do not need to disclose your conviction as it is spent."
      );
    } else {
      document.getElementById("question-3").style.display = "block";
    }
  } else if (questionId === 3) {
    if (answer === "less-than-5") {
      document.getElementById("question-4").style.display = "block"; // Go to question 4
    } else if (answer === "more-than-5") {
      document.getElementById("question-4").style.display = "block"; // Go to question 4
    }
  } else if (questionId === 4) {
    if (answer === "yes") {
      document.getElementById("question-5").style.display = "block"; // Go to question 5
    } else {
      displayResult(
        "You may need to disclose your conviction if the employer requests a DBS check."
      );
    }
  } else if (questionId === 5) {
    if (answer === "standard") {
      displayResult(
        "You do not need to disclose your conviction unless it is unspent."
      );
    } else if (answer === "enhanced") {
      document.getElementById("question-6").style.display = "block"; // Go to question 6
    }
  } else if (questionId === 6) {
    if (answer === "yes") {
      displayResult(
        "You need to disclose your conviction because the job involves working with vulnerable groups."
      );
    } else {
      displayResult(
        "You do not need to disclose your conviction unless asked by the employer."
      );
    }
  }
}

// Display the final result with explanation
function displayResult(message) {
  document.getElementById("result-text").innerText = message;
  document.getElementById("result").style.display = "block";
}
