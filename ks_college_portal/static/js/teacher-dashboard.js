document.addEventListener("DOMContentLoaded", () => {
  // Set current date
  const currentDateElement = document.getElementById("currentDate")
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

  // Load mock data
  loadRecentSubjects()
  loadRecentAttendance()
  loadRecentAnnouncements()
  loadUpcomingPlacements()
})

// Mock data functions
function loadRecentSubjects() {
  const recentSubjectsTable = document.getElementById("recentSubjectsTable")
  if (!recentSubjectsTable) return

  // Mock data for recent subjects
  const subjects = [
    { name: "Data Structures", year: 2, division: "A", students: 42 },
    { name: "Web Development", year: 3, division: "B", students: 38 },
    { name: "Database Management", year: 2, division: "C", students: 45 },
    { name: "Artificial Intelligence", year: 4, division: "A", students: 31 },
  ]

  let html = ""
  subjects.forEach((subject) => {
    html += `
            <tr>
                <td>${subject.name}</td>
                <td><span class="badge bg-info">Year ${subject.year}</span></td>
                <td><span class="badge bg-secondary">Division ${subject.division}</span></td>
                <td>${subject.students}</td>
            </tr>
        `
  })

  recentSubjectsTable.innerHTML = html
}

function loadRecentAttendance() {
  const recentAttendanceTable = document.getElementById("recentAttendanceTable")
  if (!recentAttendanceTable) return

  // Mock data for recent attendance
  const attendances = [
    { subject: "Data Structures", date: "2023-03-15", present: "38/42", status: "Completed" },
    { subject: "Web Development", date: "2023-03-14", present: "35/38", status: "Completed" },
    { subject: "Database Management", date: "2023-03-14", present: "40/45", status: "Completed" },
    { subject: "Artificial Intelligence", date: "2023-03-13", present: "28/31", status: "Completed" },
  ]

  let html = ""
  attendances.forEach((attendance) => {
    html += `
            <tr>
                <td>${attendance.subject}</td>
                <td>${new Date(attendance.date).toLocaleDateString()}</td>
                <td>${attendance.present}</td>
                <td><span class="badge bg-success">${attendance.status}</span></td>
            </tr>
        `
  })

  recentAttendanceTable.innerHTML = html
}

function loadRecentAnnouncements() {
  const recentAnnouncementsList = document.getElementById("recentAnnouncementsList")
  if (!recentAnnouncementsList) return

  // Mock data for recent announcements
  const announcements = [
    {
      subject: "Data Structures",
      title: "Mid-term Exam Schedule",
      content: "The mid-term exam for Data Structures will be held on March 25th, 2023. Please prepare accordingly.",
      date: "2023-03-10",
    },
    {
      subject: "Web Development",
      title: "Project Submission Deadline",
      content: "The deadline for the final project submission has been extended to April 5th, 2023.",
      date: "2023-03-12",
    },
    {
      subject: "Database Management",
      title: "Guest Lecture",
      content: "There will be a guest lecture on Advanced SQL by Dr. James Wilson on March 20th, 2023.",
      date: "2023-03-14",
    },
  ]

  let html = ""
  announcements.forEach((announcement) => {
    html += `
            <div class="announcement-card p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">${announcement.title}</h6>
                    <span class="badge bg-primary text-white">${announcement.subject}</span>
                </div>
                <p class="mb-1">${announcement.content}</p>
                <small class="text-muted">Posted on ${new Date(announcement.date).toLocaleDateString()}</small>
            </div>
        `
  })

  recentAnnouncementsList.innerHTML = html
}

function loadUpcomingPlacements() {
  const upcomingPlacementsList = document.getElementById("upcomingPlacementsList")
  if (!upcomingPlacementsList) return

  // Mock data for upcoming placements
  const placements = [
    {
      company: "TechCorp",
      position: "Software Engineer",
      package: "₹12 LPA",
      date: "2023-03-25",
      registrations: 45,
    },
    {
      company: "DataSystems",
      position: "Data Analyst",
      package: "₹10 LPA",
      date: "2023-04-02",
      registrations: 32,
    },
    {
      company: "WebSolutions",
      position: "Frontend Developer",
      package: "₹8 LPA",
      date: "2023-04-10",
      registrations: 28,
    },
  ]

  let html = ""
  placements.forEach((placement) => {
    html += `
            <div class="placement-card p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">${placement.company}</h6>
                    <span class="badge bg-success">${placement.package}</span>
                </div>
                <p class="mb-1">${placement.position}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Drive on ${new Date(placement.date).toLocaleDateString()}</small>
                    <span class="badge bg-primary text-light">${placement.registrations} registrations</span>
                </div>
            </div>
        `
  })

  upcomingPlacementsList.innerHTML = html
}

