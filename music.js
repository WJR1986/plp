try {
  document
    .getElementById("toggle-music-player")
    .addEventListener("click", function () {
      const musicPlayer = document.getElementById("music-player-container");
      if (musicPlayer.style.display === "none") {
        musicPlayer.style.display = "block";
        this.textContent = "Hide Music";
      } else {
        musicPlayer.style.display = "none";
        this.textContent = "Play Music";
      }
    });
} catch (error) {
  console.warn("Cross-origin restriction: ", error);
}
document
  .getElementById("close-music-player")
  .addEventListener("click", function () {
    document.getElementById("music-player-container").style.display = "none";
    document.getElementById("toggle-music-player").textContent = "Play Music";
  });
