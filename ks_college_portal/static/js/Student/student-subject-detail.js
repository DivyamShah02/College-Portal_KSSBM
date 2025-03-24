document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Setup attendance code input
  setupAttendanceCodeInput()

  // Setup file upload listeners
  setupFileUploadListeners()

  // Add event listener for submit attendance button
  const submitAttendanceBtn = document.getElementById("submitAttendanceBtn")
  if (submitAttendanceBtn) {
    submitAttendanceBtn.addEventListener("click", submitAttendance)
  }

  // Add event listener for submit assignment button
  const submitAssignmentBtn = document.getElementById("submitAssignmentBtn")
  if (submitAssignmentBtn) {
    submitAssignmentBtn.addEventListener("click", submitAssignment)
  }

  // Add circular chart CSS
  const style = document.createElement("style")
  style.textContent = `
        .circular-chart {
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .circle-bg {
            fill: none;
            stroke: #eee;
            stroke-width: 2;
        }
        
        .circle {
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            animation: progress 1s ease-out forwards;
        }
        
        @keyframes progress {
            0% {
                stroke-dasharray: 0 100;
            }
        }
    `
  document.head.appendChild(style)
})

// Function to setup attendance code input
function setupAttendanceCodeInput() {
  const inputs = document.querySelectorAll(".attendance-code-input")

  inputs.forEach((input, index) => {
    // Auto focus next input on input
    input.addEventListener("input", function () {
      if (this.value.length === this.maxLength) {
        const nextInput = inputs[index + 1]
        if (nextInput) {
          nextInput.focus()
        }
      }
    })

    // Handle backspace
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value.length === 0) {
        const prevInput = inputs[index - 1]
        if (prevInput) {
          prevInput.focus()
        }
      }
    })

    // Handle paste
    input.addEventListener("paste", (e) => {
      e.preventDefault()
      const pasteData = e.clipboardData.getData("text")
      const pasteArray = pasteData.split("")

      for (let i = 0; i < inputs.length; i++) {
        if (i < pasteArray.length) {
          inputs[i].value = pasteArray[i]
          if (i === inputs.length - 1) {
            inputs[i].focus()
          }
        }
      }
    })
  })
}

// Function to setup file upload listeners
function setupFileUploadListeners() {
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

// Function to submit attendance
function submitAttendance() {
  const inputs = document.querySelectorAll(".attendance-code-input")
  let code = ""

  inputs.forEach((input) => {
    code += input.value
  })

  if (code.length !== 6) {
    alert("Please enter a valid 6-digit attendance code")
    return
  }

  // Simulate API call
  setTimeout(() => {
    alert("Attendance marked successfully!")

    // Close the modal
    const modalElement = document.getElementById("markAttendanceModal")
    const modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide()

    // Reset inputs
    inputs.forEach((input) => {
      input.value = ""
    })
  }, 1000)
}

// Function to submit assignment
function submitAssignment() {
  const assignmentFile = document.getElementById("assignmentFile")

  if (!assignmentFile.files.length) {
    alert("Please select a file to upload")
    return
  }

  // Simulate API call
  setTimeout(() => {
    alert("Assignment submitted successfully!")

    // Close the modal
    const modalElement = document.getElementById("submitAssignmentModal")
    // Access bootstrap through window object
    const modal = window.bootstrap.Modal.getInstance(modalElement)
    modal.hide()

    // Reset form
    document.getElementById("submitAssignmentForm").reset()
    document.getElementById("selectedAssignmentFile").classList.add("d-none")
  }, 1000)
}

