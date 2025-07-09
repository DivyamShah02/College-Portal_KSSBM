let csrf_token = null
let daily_track_api_url = null
let teacher_subjects_api_url = null

let entries = []
let subjects = []


async function TeacherDailyTrack(
  csrf_token_param,
  daily_track_api_url_param,
  teacher_subjects_api_url_param,
) {
  csrf_token = csrf_token_param
  daily_track_api_url = daily_track_api_url_param
  teacher_subjects_api_url = teacher_subjects_api_url_param


  // Set today's date
  const selectedDateInput = document.getElementById("selectedDate")
  const todayBtn = document.getElementById("todayBtn")
  if (selectedDateInput) {
    const today = new Date().toISOString().split("T")[0]
    selectedDateInput.value = today
    selectedDateInput.addEventListener("change", filterEntries)
  }
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      const today = new Date().toISOString().split("T")[0]
      selectedDateInput.value = today
      filterEntries()
    })
  }

  await loadSubjects()
  await loadEntries()

  // Add event listeners for filters
  document.getElementById("filterSubject").addEventListener("change", filterEntries)
  document.getElementById("filterActivity").addEventListener("change", filterEntries)

  // Add event listener for save entry button
  document.getElementById("saveEntryBtn").addEventListener("click", saveEntry)

  // Add event listener for time inputs to calculate duration
  document.getElementById("startTime").addEventListener("input", calculateDuration)
  document.getElementById("endTime").addEventListener("input", calculateDuration)
}

async function loadSubjects() {
  const [success, result] = await callApi("GET", teacher_subjects_api_url)
  if (success && result.success) {
    subjects = result.data.all_subjects
    populateSubjectDropdowns(subjects)
  }
}

function populateSubjectDropdowns(subjectsToPopulate) {
  const subjectFilter = document.getElementById("filterSubject")
  const subjectModal = document.getElementById("subject")

  subjectFilter.innerHTML = '<option value="">All Subjects</option>'
  subjectModal.innerHTML = '<option value="">Select Subject</option><option value="General">General</option>'

  subjectsToPopulate.forEach((subject) => {
    const optionHTML = `<option value="${subject.subject_name}">${subject.subject_name}</option>`
    subjectFilter.innerHTML += optionHTML
    subjectModal.innerHTML += optionHTML
  })
}

async function loadEntries() {
  // In a real app, you'd fetch this from an API
  // For now, we'll use mock data
  entries = [
    {
      id: 1,
      date: "2024-07-24",
      activity: "Teaching",
      subject: "Data Structures",
      description: "Lecture on Binary Search Trees.",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      date: "2024-07-24",
      activity: "Grading",
      subject: "Web Development",
      description: "Graded Assignment 2 submissions.",
      startTime: "11:30",
      endTime: "13:00",
    },
    {
      id: 3,
      date: "2024-07-23",
      activity: "Meeting",
      subject: "General",
      description: "Departmental meeting to discuss curriculum.",
      startTime: "14:00",
      endTime: "15:00",
    },
  ]
  filterEntries()
}

function renderEntries(entriesToRender) {
  const entriesList = document.getElementById("entriesList")
  if (!entriesList) return

  entriesList.innerHTML = ""

  if (entriesToRender.length === 0) {
    entriesList.innerHTML =
      '<tr><td colspan="6" class="text-center py-5"><h5>No entries found for this date</h5></td></tr>'
    updateSummary(entriesToRender)
    return
  }

  entriesToRender.forEach((entry) => {
    const duration = calculateDuration(entry.startTime, entry.endTime)
    const row = `
            <tr>
                <td><span class="badge bg-primary">${entry.activity}</span></td>
                <td>${entry.subject}</td>
                <td>${entry.description}</td>
                <td>${entry.startTime} - ${entry.endTime}</td>
                <td>${duration}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editEntry(${entry.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${entry.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `
    entriesList.innerHTML += row
  })

  updateSummary(entriesToRender)
}

function filterEntries() {
  const selectedDate = document.getElementById("selectedDate").value
  const subjectFilter = document.getElementById("filterSubject").value
  const activityFilter = document.getElementById("filterActivity").value

  const filteredEntries = entries.filter((entry) => {
    if (selectedDate && entry.date !== selectedDate) return false
    if (subjectFilter && entry.subject !== subjectFilter) return false
    if (activityFilter && entry.activity !== activityFilter) return false
    return true
  })

  renderEntries(filteredEntries)
}

function saveEntry() {
  const entryId = document.getElementById("entryId").value
  const activityType = document.getElementById("activityType").value
  const subject = document.getElementById("subject").value
  const startTime = document.getElementById("startTime").value
  const endTime = document.getElementById("endTime").value
  const description = document.getElementById("description").value
  const notes = document.getElementById("notes").value
  const date = document.getElementById("selectedDate").value

  if (!activityType || !startTime || !endTime || !description) {
    alert("Please fill in all required fields.")
    return
  }

  const newEntry = {
    id: entryId ? Number.parseInt(entryId) : Date.now(),
    date: date,
    activity: activityType,
    subject: subject || "General",
    startTime: startTime,
    endTime: endTime,
    description: description,
    notes: notes,
  }

  if (entryId) {
    // Update existing entry
    const index = entries.findIndex((e) => e.id === newEntry.id)
    entries[index] = newEntry
  } else {
    // Add new entry
    entries.push(newEntry)
  }

  filterEntries()

  // Close modal and reset form
  const modal = bootstrap.Modal.getInstance(document.getElementById("addEntryModal"))
  modal.hide()
  document.getElementById("entryForm").reset()
  document.getElementById("entryId").value = ""
}

function editEntry(id) {
  const entry = entries.find((e) => e.id === id)
  if (!entry) return

  document.getElementById("entryId").value = entry.id
  document.getElementById("activityType").value = entry.activity
  document.getElementById("subject").value = entry.subject
  document.getElementById("startTime").value = entry.startTime
  document.getElementById("endTime").value = entry.endTime
  document.getElementById("description").value = entry.description
  document.getElementById("notes").value = entry.notes

  document.getElementById("entryModalTitle").innerText = "Edit Entry"
  const modal = new bootstrap.Modal(document.getElementById("addEntryModal"))
  modal.show()
}

function deleteEntry(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    entries = entries.filter((e) => e.id !== id)
    filterEntries()
  }
}

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return "0h 0m"

  const start = new Date(`1970-01-01T${startTime}`)
  const end = new Date(`1970-01-01T${endTime}`)

  if (end < start) return "Invalid"

  let diff = end.getTime() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours * (1000 * 60 * 60)
  const minutes = Math.floor(diff / (1000 * 60))

  return `${hours}h ${minutes}m`
}

function updateSummary(entriesForSummary) {
  let totalMinutes = 0
  const subjectsCovered = new Set()

  entriesForSummary.forEach((entry) => {
    const start = new Date(`1970-01-01T${entry.startTime}`)
    const end = new Date(`1970-01-01T${entry.endTime}`)
    if (end > start) {
      totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60)
    }
    if (entry.subject !== "General") {
      subjectsCovered.add(entry.subject)
    }
  })

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  document.getElementById("totalHours").textContent = `${hours}h ${minutes}m`
  document.getElementById("totalTasks").textContent = entriesForSummary.length
  document.getElementById("totalSubjects").textContent = subjectsCovered.size
}
