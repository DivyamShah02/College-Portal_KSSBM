    // Set current date
    const currentDateElement = document.getElementById("currentDate")
    if (currentDateElement) {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      const today = new Date()
      currentDateElement.textContent = today.toLocaleDateString("en-US", options)
    }
  

document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.querySelector(".navbar-toggler")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      document.querySelector("#sidebar").classList.toggle("show")
    })
  }

  // Filter assignments
  const subjectFilter = document.getElementById("subjectFilter")
  const statusFilter = document.getElementById("statusFilter")
  const searchInput = document.getElementById("searchAssignments")

  function filterAssignments() {
    const subject = subjectFilter.value.toLowerCase()
    const status = statusFilter.value.toLowerCase()
    const searchTerm = searchInput.value.toLowerCase()

    const rows = document.querySelectorAll("#assignmentsTableBody tr")

    rows.forEach((row) => {
      const titleCell = row.cells[0].textContent.toLowerCase()
      const subjectCell = row.cells[1].textContent.toLowerCase()
      const statusCell = row.cells[3].textContent.toLowerCase()

      const matchesSubject = subject === "" || subjectCell.includes(subject)
      const matchesStatus = status === "" || statusCell.includes(status)
      const matchesSearch = searchTerm === "" || titleCell.includes(searchTerm) || subjectCell.includes(searchTerm)

      if (matchesSubject && matchesStatus && matchesSearch) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  if (subjectFilter) subjectFilter.addEventListener("change", filterAssignments)
  if (statusFilter) statusFilter.addEventListener("change", filterAssignments)
  if (searchInput) searchInput.addEventListener("input", filterAssignments)

  // Create new assignment
  const saveAssignmentBtn = document.getElementById("saveAssignmentBtn")
  if (saveAssignmentBtn) {
    saveAssignmentBtn.addEventListener("click", () => {
      const form = document.getElementById("createAssignmentForm")
      if (form.checkValidity()) {
        // In a real application, you would send this data to the server
        const title = document.getElementById("assignmentTitle").value
        const subject = document.getElementById("assignmentSubject").value
        const dueDate = document.getElementById("assignmentDueDate").value
        const dueTime = document.getElementById("assignmentDueTime").value
        const description = document.getElementById("assignmentDescription").value
        const points = document.getElementById("assignmentPoints").value

        // For demo purposes, add the new assignment to the table
        addNewAssignment(title, subject, dueDate, points)

        // Close the modal
        const modalElement = document.getElementById("createAssignmentModal")
        const modal = bootstrap.Modal.getInstance(modalElement)
        modal.hide()

        // Reset the form
        form.reset()
      } else {
        form.reportValidity()
      }
    })
  }

  function addNewAssignment(title, subject, dueDate, points) {
    const tableBody = document.getElementById("assignmentsTableBody")
    const newRow = document.createElement("tr")

    // Format the date
    const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    // Determine status based on due date
    const today = new Date()
    const dueDateTime = new Date(dueDate)
    let status, statusClass

    if (dueDateTime < today) {
      status = "Past"
      statusClass = "bg-secondary"
    } else if (dueDateTime.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
      status = "Active"
      statusClass = "bg-success"
    } else {
      status = "Upcoming"
      statusClass = "bg-warning text-dark"
    }

    newRow.innerHTML = `
            <td>${title}</td>
            <td>${subject}</td>
            <td>${formattedDate}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>0/30</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
            </td>
        `

    tableBody.insertBefore(newRow, tableBody.firstChild)
  }
})

