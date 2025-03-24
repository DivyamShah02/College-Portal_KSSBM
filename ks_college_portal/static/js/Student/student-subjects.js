document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Add event listeners for filters
  const semesterFilter = document.getElementById("semesterFilter")
  const searchSubject = document.getElementById("searchSubject")

  if (semesterFilter) {
    semesterFilter.addEventListener("change", filterSubjects)
  }

  if (searchSubject) {
    searchSubject.addEventListener("input", filterSubjects)
  }
})

// Function to filter subjects
function filterSubjects() {
  const semesterFilter = document.getElementById("semesterFilter").value
  const searchFilter = document.getElementById("searchSubject").value.toLowerCase()

  const subjectCards = document.querySelectorAll(".subject-card")

  subjectCards.forEach((card) => {
    const cardTitle = card.querySelector(".card-title").textContent.toLowerCase()
    const cardText = card.querySelector(".card-text").textContent.toLowerCase()

    let showCard = true

    // Filter by semester
    if (semesterFilter === "current") {
      // For demo purposes, all cards are considered current semester
      showCard = true
    } else if (semesterFilter === "previous") {
      // For demo purposes, no cards are considered previous semester
      showCard = false
    }

    // Filter by search term
    if (searchFilter && !cardTitle.includes(searchFilter) && !cardText.includes(searchFilter)) {
      showCard = false
    }

    // Show or hide the card
    card.closest(".col-md-6").style.display = showCard ? "block" : "none"
  })
}

