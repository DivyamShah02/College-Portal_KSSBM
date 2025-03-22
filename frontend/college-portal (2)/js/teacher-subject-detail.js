document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Get subject ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const subjectId = urlParams.get("id")

  if (!subjectId) {
    window.location.href = "subjects.html"
    return
  }

  // Load subject details
  loadSubjectDetails(subjectId)

  // Load announcements, assignments, and attendance
  loadAnnouncements(subjectId)
  loadAssignments(subjectId)
  loadAttendance(subjectId)

  // Add event listeners for file uploads
  setupFileUploadListeners()

  // Add event listeners for form submissions
  setupFormSubmissionListeners(subjectId)

  // Add event listener for regenerate code button
  const regenerateCodeBtn = document.getElementById("regenerateCodeBtn")
  if (regenerateCodeBtn) {
    regenerateCodeBtn.addEventListener("click", generateAttendanceCode)
  }

  // Generate initial attendance code
  generateAttendanceCode()
})

// Mock data for subjects
const subjects = [
  {
    id: 1,
    name: "Data Structures and Algorithms",
    year: 2,
    division: "A",
    students: 42,
    description:
      "Study of fundamental data structures, algorithms, and their applications. This course covers arrays, linked lists, stacks, queues, trees, graphs, sorting algorithms, and searching algorithms. Students will learn to analyze algorithm efficiency and implement various data structures.",
    image: "/placeholder.svg?height=200&width=200",
    announcements: 5,
    assignments: 3,
    attendanceSessions: 8,
  },
  {
    id: 2,
    name: "Web Development",
    year: 3,
    division: "B",
    students: 38,
    description:
      "Introduction to web technologies including HTML, CSS, JavaScript, and modern frameworks. Students will learn to build responsive and interactive web applications using current industry standards and best practices.",
    image: "/placeholder.svg?height=200&width=200",
    announcements: 7,
    assignments: 4,
    attendanceSessions: 10,
  },
  {
    id: 3,
    name: "Database Management Systems",
    year: 2,
    division: "C",
    students: 45,
    description:
      "Fundamentals of database design, SQL, and database management systems. This course covers relational database concepts, normalization, query optimization, transaction management, and database security.",
    image: "/placeholder.svg?height=200&width=200",
    announcements: 4,
    assignments: 2,
    attendanceSessions: 6,
  },
  {
    id: 4,
    name: "Artificial Intelligence",
    year: 4,
    division: "A",
    students: 31,
    description:
      "Introduction to AI concepts, machine learning, and neural networks. Students will explore problem-solving methods, knowledge representation, reasoning, planning, and machine learning algorithms.",
    image: "/placeholder.svg?height=200&width=200",
    announcements: 6,
    assignments: 5,
    attendanceSessions: 9,
  },
]

// Mock data for announcements
const announcements = [
  {
    id: 1,
    subjectId: 1,
    title: "Mid-term Exam Schedule",
    content:
      "The mid-term exam for Data Structures will be held on March 25th, 2023. The exam will cover all topics discussed up to Week 6. Please prepare accordingly and bring your ID cards.",
    date: "2023-03-10",
    attachment: null,
  },
  {
    id: 2,
    subjectId: 1,
    title: "Guest Lecture on Advanced Algorithms",
    content:
      'We will have a guest lecture by Dr. Robert Chen from Stanford University on "Advanced Algorithms in Industry" on March 18th, 2023. Attendance is mandatory for all students.',
    date: "2023-03-12",
    attachment: "guest_lecture_details.pdf",
  },
  {
    id: 3,
    subjectId: 1,
    title: "Lab Session Rescheduled",
    content:
      "The lab session scheduled for March 15th has been rescheduled to March 17th due to maintenance work in the computer lab. Same time and same lab number.",
    date: "2023-03-14",
    attachment: null,
  },
]

// Mock data for assignments
const assignments = [
  {
    id: 1,
    subjectId: 1,
    title: "Implementation of Sorting Algorithms",
    description:
      "Implement the following sorting algorithms in a language of your choice: Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, and Quick Sort. Compare their performance with different input sizes.",
    dueDate: "2023-03-25",
    dueTime: "23:59",
    attachment: "sorting_algorithms_assignment.pdf",
    submissions: 28,
  },
  {
    id: 2,
    subjectId: 1,
    title: "Binary Search Tree Operations",
    description:
      "Implement a Binary Search Tree with the following operations: insert, delete, search, traversal (in-order, pre-order, post-order). Write test cases to verify your implementation.",
    dueDate: "2023-04-05",
    dueTime: "23:59",
    attachment: "bst_assignment.pdf",
    submissions: 15,
  },
]

// Mock data for attendance
const attendance = [
  {
    id: 1,
    subjectId: 1,
    title: "Lecture - Introduction to Trees",
    date: "2023-03-10",
    time: "10:00",
    code: "123456",
    duration: 30,
    status: "Completed",
    present: 38,
    total: 42,
  },
  {
    id: 2,
    subjectId: 1,
    title: "Lab Session - Implementing Binary Trees",
    date: "2023-03-12",
    time: "14:00",
    code: "789012",
    duration: 45,
    status: "Completed",
    present: 40,
    total: 42,
  },
  {
    id: 3,
    subjectId: 1,
    title: "Lecture - Graph Algorithms",
    date: "2023-03-15",
    time: "10:00",
    code: "345678",
    duration: 30,
    status: "Completed",
    present: 36,
    total: 42,
  },
]

// Mock data for students
const students = [
  {
    id: "S2001",
    name: "John Smith",
    year: 2,
    division: "A",
    email: "john.smith@college.edu",
  },
  {
    id: "S2002",
    name: "Emily Johnson",
    year: 2,
    division: "A",
    email: "emily.johnson@college.edu",
  },
  {
    id: "S2003",
    name: "Michael Brown",
    year: 2,
    division: "A",
    email: "michael.brown@college.edu",
  },
  {
    id: "S2004",
    name: "Jessica Davis",
    year: 2,
    division: "A",
    email: "jessica.davis@college.edu",
  },
  {
    id: "S2005",
    name: "David Wilson",
    year: 2,
    division: "A",
    email: "david.wilson@college.edu",
  },
]

// Function to load subject details
function loadSubjectDetails(subjectId) {
  // Find subject by ID
  const subject = subjects.find((s) => s.id == subjectId)

  if (!subject) {
    window.location.href = "subjects.html"
    return
  }

  // Update page title
  document.title = `${subject.name} | Teacher Dashboard`

  // Update subject details
  document.getElementById("subjectTitle").textContent = subject.name
  document.getElementById("subjectDescriptionText").textContent = subject.description
  document.getElementById("studentsEnrolled").textContent = subject.students
  document.getElementById("announcementsCount").textContent = subject.announcements
  document.getElementById("assignmentsCount").textContent = subject.assignments
  document.getElementById("attendanceSessions").textContent = subject.attendanceSessions
  // document.getElementById("subjectImage").src = subject.image

  // Update subject badges
  const subjectBadges = document.getElementById("subjectBadges")
  subjectBadges.innerHTML = `
        <span class="badge bg-info">Year ${subject.year}</span>
        <span class="badge bg-secondary">Division ${subject.division}</span>
    `

  // Load students list
  loadStudentsList()
}

// Function to load announcements
function loadAnnouncements(subjectId) {
  const announcementsList = document.getElementById("announcementsList")

  // Filter announcements by subject ID
  const subjectAnnouncements = announcements.filter((a) => a.subjectId == subjectId)

  setTimeout(() => {
    if (subjectAnnouncements.length === 0) {
      announcementsList.innerHTML = '<div class="text-center py-4"><p>No announcements yet</p></div>'
      return
    }

    let html = ""
    subjectAnnouncements.forEach((announcement) => {
      html += `
                <div class="card announcement-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${announcement.title}</h5>
                            <span class="badge bg-primary text-white">${new Date(announcement.date).toLocaleDateString()}</span>
                        </div>
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
  }, 1000) // Simulate loading delay
}

// Function to load assignments
function loadAssignments(subjectId) {
  const assignmentsList = document.getElementById("assignmentsList")

  // Filter assignments by subject ID
  const subjectAssignments = assignments.filter((a) => a.subjectId == subjectId)

  setTimeout(() => {
    if (subjectAssignments.length === 0) {
      assignmentsList.innerHTML = '<div class="text-center py-4"><p>No assignments yet</p></div>'
      return
    }

    let html = ""
    subjectAssignments.forEach((assignment) => {
      const dueDateTime = new Date(`${assignment.dueDate}T${assignment.dueTime}`)
      const isOverdue = dueDateTime < new Date()

      html += `
                <div class="card assignment-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${assignment.title}</h5>
                            <span class="badge ${isOverdue ? "bg-danger" : "bg-warning"} text-white">
                                Due: ${new Date(assignment.dueDate).toLocaleDateString()} at ${assignment.dueTime}
                            </span>
                        </div>
                        <p class="card-text">${assignment.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            ${
                              assignment.attachment
                                ? `
                                <a href="#" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-file-earmark me-2"></i>${assignment.attachment}
                                </a>
                            `
                                : "<span></span>"
                            }
                            <span class="text-muted">${assignment.submissions} / ${subjects.find((s) => s.id == subjectId).students} submissions</span>
                        </div>
                    </div>
                </div>
            `
    })

    assignmentsList.innerHTML = html
  }, 1000) // Simulate loading delay
}

// Function to load attendance
function loadAttendance(subjectId) {
  const attendanceList = document.getElementById("attendanceList")

  // Filter attendance by subject ID
  const subjectAttendance = attendance.filter((a) => a.subjectId == subjectId)

  setTimeout(() => {
    if (subjectAttendance.length === 0) {
      attendanceList.innerHTML = '<div class="text-center py-4"><p>No attendance sessions yet</p></div>'
      return
    }

    let html = ""
    subjectAttendance.forEach((session) => {
      const attendanceDate = new Date(`${session.date}T${session.time}`)
      const attendancePercentage = Math.round((session.present / session.total) * 100)

      html += `
                <div class="card attendance-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${session.title}</h5>
                            <span class="badge bg-${session.status === "Completed" ? "success" : "primary"} text-white">
                                ${session.status}
                            </span>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-calendar text-primary me-2"></i>
                                    <div>
                                        <small class="text-muted d-block">Date & Time</small>
                                        <span>${attendanceDate.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-people text-success me-2"></i>
                                    <div>
                                        <small class="text-muted d-block">Attendance</small>
                                        <span>${session.present} / ${session.total} (${attendancePercentage}%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <div class="progress" style="height: 10px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${attendancePercentage}%;" aria-valuenow="${attendancePercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-eye me-2"></i>View Details
                            </button>
                        </div>
                    </div>
                </div>
            `
    })

    attendanceList.innerHTML = html
  }, 1000) // Simulate loading delay
}

// Function to load students list
function loadStudentsList() {
  const studentsListTable = document.getElementById("studentsListTable")

  if (!studentsListTable) return

  let html = ""
  students.forEach((student) => {
    html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Year ${student.year}</td>
                <td>Division ${student.division}</td>
                <td>${student.email}</td>
            </tr>
        `
  })

  studentsListTable.innerHTML = html
}

// Function to setup file upload listeners
function setupFileUploadListeners() {
  // Announcement file upload
  const announcementFile = document.getElementById("announcementFile")
  const selectedAnnouncementFile = document.getElementById("selectedAnnouncementFile")
  const announcementFileName = document.getElementById("announcementFileName")
  const removeAnnouncementFile = document.getElementById("removeAnnouncementFile")

  if (announcementFile && selectedAnnouncementFile && announcementFileName && removeAnnouncementFile) {
    announcementFile.addEventListener("change", function () {
      if (this.files.length > 0) {
        announcementFileName.textContent = this.files[0].name
        selectedAnnouncementFile.classList.remove("d-none")
      }
    })

    removeAnnouncementFile.addEventListener("click", () => {
      announcementFile.value = ""
      selectedAnnouncementFile.classList.add("d-none")
    })
  }

  // Assignment file upload
  const assignmentFile = document.getElementById("assignmentFile")
  const selectedAssignmentFile = document.getElementById("selectedAssignmentFile")
  const assignmentFileName = document.getElementById("assignmentFileName")
  const removeAssignmentFile = document.getElementById("removeAssignmentFile")

  if (assignmentFile && selectedAssignmentFile && assignmentFileName && removeAssignmentFile) {
    assignmentFile.addEventListener("change", function () {
      if (this.files.length > 0) {
        assignmentFileName.textContent = this.files[0].name
        selectedAssignmentFile.classList.remove("d-none")
      }
    })

    removeAssignmentFile.addEventListener("click", () => {
      assignmentFile.value = ""
      selectedAssignmentFile.classList.add("d-none")
    })
  }
}

// Function to setup form submission listeners
function setupFormSubmissionListeners(subjectId) {
  // Save announcement button
  const saveAnnouncementBtn = document.getElementById("saveAnnouncementBtn")
  if (saveAnnouncementBtn) {
    saveAnnouncementBtn.addEventListener("click", () => {
      const title = document.getElementById("announcementTitle").value
      const content = document.getElementById("announcementContent").value
      const file = document.getElementById("announcementFile").files[0]

      if (!title || !content) {
        alert("Please fill in all required fields")
        return
      }

      // Create new announcement object
      const newAnnouncement = {
        id: announcements.length + 1,
        subjectId: Number.parseInt(subjectId),
        title: title,
        content: content,
        date: new Date().toISOString().split("T")[0],
        attachment: file ? file.name : null,
      }

      // Add to announcements array
      announcements.unshift(newAnnouncement)

      // Update announcements count
      const subject = subjects.find((s) => s.id == subjectId)
      if (subject) {
        subject.announcements++
        document.getElementById("announcementsCount").textContent = subject.announcements
      }

      // Refresh the announcements list
      loadAnnouncements(subjectId)

      // Close the modal
      const addAnnouncementModal = document.getElementById("addAnnouncementModal")
      const modal = bootstrap.Modal.getInstance(addAnnouncementModal)
      modal.hide()

      // Reset the form
      document.getElementById("addAnnouncementForm").reset()
      document.getElementById("selectedAnnouncementFile").classList.add("d-none")
    })
  }

  // Save assignment button
  const saveAssignmentBtn = document.getElementById("saveAssignmentBtn")
  if (saveAssignmentBtn) {
    saveAssignmentBtn.addEventListener("click", () => {
      const title = document.getElementById("assignmentTitle").value
      const description = document.getElementById("assignmentDescription").value
      const dueDate = document.getElementById("assignmentDueDate").value
      const dueTime = document.getElementById("assignmentDueTime").value
      const file = document.getElementById("assignmentFile").files[0]

      if (!title || !description || !dueDate || !dueTime) {
        alert("Please fill in all required fields")
        return
      }

      // Create new assignment object
      const newAssignment = {
        id: assignments.length + 1,
        subjectId: Number.parseInt(subjectId),
        title: title,
        description: description,
        dueDate: dueDate,
        dueTime: dueTime,
        attachment: file ? file.name : null,
        submissions: 0,
      }

      // Add to assignments array
      assignments.unshift(newAssignment)

      // Update assignments count
      const subject = subjects.find((s) => s.id == subjectId)
      if (subject) {
        subject.assignments++
        document.getElementById("assignmentsCount").textContent = subject.assignments
      }

      // Refresh the assignments list
      loadAssignments(subjectId)

      // Close the modal
      const addAssignmentModal = document.getElementById("addAssignmentModal")
      const modal = bootstrap.Modal.getInstance(addAssignmentModal)
      modal.hide()

      // Reset the form
      document.getElementById("addAssignmentForm").reset()
      document.getElementById("selectedAssignmentFile").classList.add("d-none")
    })
  }

  // Create attendance button
  const createAttendanceBtn = document.getElementById("createAttendanceBtn")
  if (createAttendanceBtn) {
    createAttendanceBtn.addEventListener("click", () => {
      const title = document.getElementById("attendanceTitle").value
      const date = document.getElementById("attendanceDate").value
      const time = document.getElementById("attendanceTime").value
      const duration = document.getElementById("attendanceDuration").value
      const code = document.getElementById("attendanceCode").value

      if (!title || !date || !time || !duration || !code) {
        alert("Please fill in all required fields")
        return
      }

      // Create new attendance object
      const newAttendance = {
        id: attendance.length + 1,
        subjectId: Number.parseInt(subjectId),
        title: title,
        date: date,
        time: time,
        code: code,
        duration: Number.parseInt(duration),
        status: "Active",
        present: 0,
        total: subjects.find((s) => s.id == subjectId).students,
      }

      // Add to attendance array
      attendance.unshift(newAttendance)

      // Update attendance sessions count
      const subject = subjects.find((s) => s.id == subjectId)
      if (subject) {
        subject.attendanceSessions++
        document.getElementById("attendanceSessions").textContent = subject.attendanceSessions
      }

      // Refresh the attendance list
      loadAttendance(subjectId)

      // Close the modal
      const createAttendanceModal = document.getElementById("createAttendanceModal")
      const modal = bootstrap.Modal.getInstance(createAttendanceModal)
      modal.hide()

      // Reset the form
      document.getElementById("createAttendanceForm").reset()
      generateAttendanceCode()
    })
  }
}

// Function to generate a random 6-digit attendance code
function generateAttendanceCode() {
  const attendanceCode = document.getElementById("attendanceCode")
  if (attendanceCode) {
    const code = Math.floor(100000 + Math.random() * 900000)
    attendanceCode.value = code
  }
}

