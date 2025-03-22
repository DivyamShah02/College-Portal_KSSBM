document.addEventListener("DOMContentLoaded", () => {
  // Check for saved dark mode preference
  const darkMode = localStorage.getItem("darkMode")

  // If dark mode was previously enabled, apply it
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode")
    updateDarkModeIcons()
  }

  // Add event listeners to all dark mode toggles
  const darkModeToggles = document.querySelectorAll(".dark-mode-toggle-btn")
  darkModeToggles.forEach((toggle) => {
    toggle.addEventListener("click", toggleDarkMode)
  })
})

function toggleTableDarkMode(darkmode) {
  const tables = document.querySelectorAll("table");

  tables.forEach(table => {
      const headers = table.querySelectorAll("th");

      if (darkmode) {
          table.classList.add("table-dark");
          headers.forEach(th => {
              th.classList.add("text-white");
              th.classList.remove("text-dark");
          });
      } else {
          table.classList.remove("table-dark");
          headers.forEach(th => {
              th.classList.add("text-dark");
              th.classList.remove("text-white");
          });
      }
  });
}

// Function to toggle dark mode
function toggleDarkMode() {
  if (document.body.classList.contains("dark-mode")) {
    // Disable dark mode
    document.body.classList.remove("dark-mode")
    localStorage.setItem("darkMode", "disabled")
  } else {
    // Enable dark mode
    document.body.classList.add("dark-mode")
    localStorage.setItem("darkMode", "enabled")
  }

  // Update icons
  updateDarkModeIcons()
}

// Function to update dark mode icons
function updateDarkModeIcons() {
  const isDarkMode = document.body.classList.contains("dark-mode")
  const darkModeToggles = document.querySelectorAll(".dark-mode-toggle-btn")

  darkModeToggles.forEach((toggle) => {
    const icon = toggle.querySelector("i")
    console.log(isDarkMode);
    toggleTableDarkMode(isDarkMode);
    if (isDarkMode) {      
      document.getElementById('dark-mode-toggle-btn-text').innerText = "Light Mode";
      icon.classList.remove("bi-moon")
      icon.classList.add("bi-sun")
    } else {
      document.getElementById('dark-mode-toggle-btn-text').innerText = "Dark Mode";
      icon.classList.remove("bi-sun")
      icon.classList.add("bi-moon")
    }
  })
}

