document.addEventListener("DOMContentLoaded", () => {
  // Check for saved dark mode preference
  const darkMode = localStorage.getItem("darkMode")

  // If dark mode was previously enabled, apply it
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode")
    updateDarkModeIcons()
  }

  // Add event listeners to all dark mode toggles
  const darkModeToggles = document.querySelectorAll(".dark-mode-toggle")
  darkModeToggles.forEach((toggle) => {
    toggle.addEventListener("click", toggleDarkMode)
  })
})

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
  const darkModeToggles = document.querySelectorAll(".dark-mode-toggle")

  darkModeToggles.forEach((toggle) => {
    const icon = toggle.querySelector("i")
    if (isDarkMode) {
      icon.classList.remove("bi-moon")
      icon.classList.add("bi-sun")
    } else {
      icon.classList.remove("bi-sun")
      icon.classList.add("bi-moon")
    }
  })
}

