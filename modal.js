document.addEventListener("DOMContentLoaded", function () {
  const motivationButton = document.getElementById("motivationButton");
  const jokeButton = document.getElementById("jokeButton");

  if (motivationButton) {
    motivationButton.addEventListener("click", fetchMotivation);
  } else {
    console.error("motivationButton not found!");
  }

  if (jokeButton) {
    jokeButton.addEventListener("click", fetchJoke);
  } else {
    console.error("jokeButton not found!");
  }
});

// Fetch random motivation quote
function fetchMotivation() {
  fetch("quotes.json")
    .then((response) => response.json())
    .then((data) => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      document.getElementById("motivationQuote").innerText = randomQuote;

      // Show the modal after setting the quote
      $("#motivationModal").modal("show"); // Use jQuery to trigger the modal
    })
    .catch((error) => console.error("Error fetching quotes:", error));
}

// Fetch random joke
function fetchJoke() {
  fetch("jokes.json")
    .then((response) => response.json())
    .then((data) => {
      const randomJoke = data[Math.floor(Math.random() * data.length)];
      document.getElementById("jokeText").innerText = randomJoke;

      // Show the modal after setting the joke
      $("#jokeModal").modal("show"); // Use jQuery to trigger the modal
    })
    .catch((error) => console.error("Error fetching jokes:", error));
}
