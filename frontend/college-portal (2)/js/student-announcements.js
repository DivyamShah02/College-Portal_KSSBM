document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Load announcements
  loadAnnouncements()

  // Add event listeners for filters
  const subjectFilter = document.getElementById("subjectFilter")
  const dateFilter = document.getElementById("dateFilter")
  const searchAnnouncement = document.getElementById("searchAnnouncement")

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterAnnouncements)
  }

  if (dateFilter) {
    dateFilter.addEventListener("change", filterAnnouncements)
  }

  if (searchAnnouncement) {
    searchAnnouncement.addEventListener("input", filterAnnouncements)
  }
})

// Mock data for announcements
const announcements = [
  {
    id: 1,
    subjectId: 1,
    subjectName: "Data Structures and Algorithms",
    title: "Mid-term Exam Schedule",
    content:
      "The mid-term exam for Data Structures will be held on March 25th, 2023. The exam will cover all topics discussed up to Week 6. Please prepare accordingly and bring your ID cards.",
    date: "2023-03-10",
    attachment: null,
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: "Data Structures and Algorithms",
    title: "Guest Lecture on Advanced Algorithms",
    content:
      'We will have a guest lecture by Dr. Robert Chen from Stanford University on "Advanced Algorithms in Industry" on March 18th, 2023. Attendance is mandatory for all students.',
    date: "2023-03-12",
    attachment: "guest_lecture_details.pdf",
  },
  {
    id: 3,
    subjectId: 2,
    subjectName: "Web Development",
    title: "Project Submission Deadline",
    content:
      "The deadline for the final project submission has been extended to April 5th, 2023. Please make sure to submit your projects on time.",
    date: "2023-03-14",
    attachment: null,
  },
  {
    id: 4,
    subjectId: 3,
    subjectName: "Database Management Systems",
    title: "Guest Lecture",
    content:
      "There will be a guest lecture on Advanced SQL by Dr. James Wilson on March 20th, 2023. All students are encouraged to attend.",
    date: "2023-03-14",
    attachment: "guest_lecture_sql.pdf",
  },
  {
    id: 5,
    subjectId: 4,
    subjectName: "Artificial Intelligence",
    title: "AI Workshop",
    content:
      'We are organizing a workshop on "Practical Applications of AI" on March 22nd, 2023. The workshop will be conducted by industry experts from Google and Microsoft.',
    date: "2023-03-15",
    attachment: "ai_workshop.pdf",
  },
  {
    id: 6,
    subjectId: 5,
    subjectName: "Computer Networks",
    title: "Network Lab Setup",
    content:
      "The network lab has been set up with new equipment. Students can now access the lab for practical sessions starting from March 20th, 2023.",
    date: "2023-03-16",
    attachment: null,
  },
  {
    id: 7,
    subjectId: 6,
    subjectName: "Software Engineering",
    title: "Industry Visit",
    content:
      "We have arranged an industry visit to Microsoft Development Center on March 28th, 2023. All students interested in participating should register by March 22nd.",
    date: "2023-03-17",
    attachment: "industry_visit_details.pdf",
  },
  {
    id: 8,
    subjectId: 0,
    subjectName: "College Administration",
    title: "Holiday Notice",
    content:
      "The college will remain closed on March 30th, 2023 on account of the annual function. Regular classes will resume from March 31st.",
    date: "2023-03-18",
    attachment: null,
  },
]

// Function to load announcements
function loadAnnouncements() {
  const announcementsList = document.getElementById("announcementsList")
  if (!announcementsList) return

  renderAnnouncements(announcements)
}

// Function to render announcements
function renderAnnouncements(announcementsToRender) {
  const announcementsList = document.getElementById("announcementsList")
  if (!announcementsList) return

  if (announcementsToRender.length === 0) {
    announcementsList.innerHTML = '<div class="text-center py-5"><h5>No announcements found</h5></div>'
    return
  }

  let html = ""
  announcementsToRender.forEach((announcement) => {
    html += `
            <div class="card announcement-card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${announcement.title}</h5>
                        <span class="badge bg-light text-dark">${new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${announcement.subjectName}</h6>
                    <p class="card-text">${announcement.content}</p>
                    ${
                      announcement.attachment
                        ? `
                        <div class="mt-3">
                            <a href="#" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-file-earmark me-2"></i>${announcement.attachment}
                            </a>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `
  })

  announcementsList.innerHTML = html
}

// Function to filter announcements
function filterAnnouncements() {
  const subjectFilter = document.getElementById("subjectFilter").value
  const dateFilter = document.getElementById("dateFilter").value
  const searchFilter = document.getElementById("searchAnnouncement").value.toLowerCase()

  const filteredAnnouncements = announcements.filter((announcement) => {
    // Filter by subject
    if (subjectFilter && announcement.subjectId != subjectFilter) {
      return false
    }

    // Filter by date
    if (dateFilter) {
      const announcementDate = new Date(announcement.date)
      const today = new Date()

      if (dateFilter === "today") {
        if (announcementDate.toDateString() !== today.toDateString()) {
          return false
        }
      } else if (dateFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(today.getDate() - 7)
        if (announcementDate < weekAgo) {
          return false
        }
      } else if (dateFilter === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(today.getMonth() - 1)
        if (announcementDate < monthAgo) {
          return false
        }
      }
    }

    // Filter by search term
    if (
      searchFilter &&
      !announcement.title.toLowerCase().includes(searchFilter) &&
      !announcement.content.toLowerCase().includes(searchFilter)
    ) {
      return false
    }

    return true
  })

  renderAnnouncements(filteredAnnouncements)
}

