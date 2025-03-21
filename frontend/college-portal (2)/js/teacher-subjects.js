document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Load subjects
  loadSubjects()

  // Add event listeners for filters
  const yearFilter = document.getElementById("yearFilter")
  const divisionFilter = document.getElementById("divisionFilter")
  const searchSubject = document.getElementById("searchSubject")

  if (yearFilter) {
    yearFilter.addEventListener("change", filterSubjects)
  }

  if (divisionFilter) {
    divisionFilter.addEventListener("change", filterSubjects)
  }

  if (searchSubject) {
    searchSubject.addEventListener("input", filterSubjects)
  }

  // Add event listener for save subject button
  const saveSubjectBtn = document.getElementById("saveSubjectBtn")
  if (saveSubjectBtn) {
    saveSubjectBtn.addEventListener("click", saveSubject)
  }
})

// Mock data for subjects
const subjects = [
  {
    id: 1,
    name: "Data Structures and Algorithms",
    year: 2,
    division: "A",
    students: 42,
    description: "Study of fundamental data structures, algorithms, and their applications.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 2,
    name: "Web Development",
    year: 3,
    division: "B",
    students: 38,
    description: "Introduction to web technologies including HTML, CSS, JavaScript, and modern frameworks.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 3,
    name: "Database Management Systems",
    year: 2,
    division: "C",
    students: 45,
    description: "Fundamentals of database design, SQL, and database management systems.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 4,
    name: "Artificial Intelligence",
    year: 4,
    division: "A",
    students: 31,
    description: "Introduction to AI concepts, machine learning, and neural networks.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 5,
    name: "Computer Networks",
    year: 3,
    division: "A",
    students: 36,
    description: "Study of network protocols, architecture, and security principles.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 6,
    name: "Operating Systems",
    year: 2,
    division: "B",
    students: 40,
    description: "Concepts of operating systems, process management, and memory management.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 7,
    name: "Software Engineering",
    year: 4,
    division: "C",
    students: 28,
    description: "Software development lifecycle, project management, and quality assurance.",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 8,
    name: "Mobile App Development",
    year: 3,
    division: "C",
    students: 33,
    description: "Development of mobile applications for iOS and Android platforms.",
    image: "/placeholder.svg?height=150&width=300",
  },
]

// Function to load subjects
function loadSubjects() {
  const subjectsList = document.getElementById("subjectsList")
  if (!subjectsList) return

  renderSubjects(subjects)
}

// Function to render subjects
function renderSubjects(subjectsToRender) {
  const subjectsList = document.getElementById("subjectsList")
  if (!subjectsList) return

  let html = ""

  if (subjectsToRender.length === 0) {
    subjectsList.innerHTML = '<div class="col-12 text-center py-5"><h5>No subjects found</h5></div>'
    return
  }

  subjectsToRender.forEach((subject) => {
    html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card subject-card h-100" style="border-top: 5px solid var(--secondary);">
                    
                    <div class="card-body">
                        <h5 class="card-title">${subject.name}</h5>
                        <div class="d-flex gap-2 mb-2">
                            <span class="badge bg-info">Year ${subject.year}</span>
                            <span class="badge bg-secondary">Division ${subject.division}</span>
                        </div>
                        <p class="card-text">${subject.description}</p>
                    </div>
                    <div class="card-footer bg-secondary">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-white">${subject.students} students enrolled</small>
                            <a href="subject-detail.html?id=${subject.id}" class="btn btn-sm btn-outline-light">Manage</a>
                        </div>
                    </div>
                </div>
            </div>
        `
  })

  subjectsList.innerHTML = html
}

// Function to filter subjects
function filterSubjects() {
  const yearFilter = document.getElementById("yearFilter").value
  const divisionFilter = document.getElementById("divisionFilter").value
  const searchFilter = document.getElementById("searchSubject").value.toLowerCase()

  const filteredSubjects = subjects.filter((subject) => {
    // Filter by year
    if (yearFilter && subject.year != yearFilter) {
      return false
    }

    // Filter by division
    if (divisionFilter && subject.division !== divisionFilter) {
      return false
    }

    // Filter by search term
    if (searchFilter && !subject.name.toLowerCase().includes(searchFilter)) {
      return false
    }

    return true
  })

  renderSubjects(filteredSubjects)
}

// Function to save a new subject
function saveSubject() {
  const subjectName = document.getElementById("subjectName").value
  const subjectYear = document.getElementById("subjectYear").value
  const subjectDivision = document.getElementById("subjectDivision").value
  const subjectDescription = document.getElementById("subjectDescription").value

  if (!subjectName || !subjectYear || !subjectDivision) {
    alert("Please fill in all required fields")
    return
  }

  // Create new subject object
  const newSubject = {
    id: subjects.length + 1,
    name: subjectName,
    year: Number.parseInt(subjectYear),
    division: subjectDivision,
    students: 0, // New subject, no students yet
    description: subjectDescription || "No description provided",
    image: "/placeholder.svg?height=150&width=300",
  }

  // Add to subjects array
  subjects.unshift(newSubject)

  // Refresh the subjects list
  renderSubjects(subjects)

  // Close the modal
  const addSubjectModal = document.getElementById("addSubjectModal")
  const modal = bootstrap.Modal.getInstance(addSubjectModal)
  modal.hide()

  // Reset the form
  document.getElementById("addSubjectForm").reset()
}

