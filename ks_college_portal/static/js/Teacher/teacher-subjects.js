let csrf_token = null;
let teacher_subject_url = null;
let teacher_subject_detail_url = null;

async function TeacherSubjects(csrf_token_param, teacher_subject_url_param, teacher_subject_detail_url_param) {
  csrf_token = csrf_token_param;
  teacher_subject_url = teacher_subject_url_param;
  teacher_subject_detail_url = teacher_subject_detail_url_param;

  const currentDateElement = document.getElementById("currentDate");
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

  // Load subjects
  await loadStudents();

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
    saveSubjectBtn.addEventListener("click", saveSubject);
  }
}

document.getElementById("add_subject_form").addEventListener("submit", async (event) => {
  toggle_loader();
  const form = event.target;

  // Prevent the form from submitting
  event.preventDefault();

  // Check form validity
  if (!form.checkValidity()) {
      // Trigger the browser's built-in validation tooltips
      form.reportValidity();
      toggle_loader();
      return;
  }
  let bodyData = {
      subject_name: document.getElementById('subject_name').value,
      college_year: document.getElementById('college_year').value,
      class_division: document.getElementById('class_division').value,
  }
  const url = teacher_subject_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
      console.log("Result:", result);

      if (result.success) {
        document.getElementById("close_add_subject_modal").click();
        await loadStudents();
      }

      else {
          document.getElementById('error-unexpected').innerText = result.error;
          document.getElementById('error-unexpected').style.display = '';
      }

  } else {
      document.getElementById('error-unexpected').style.display = '';
  }
  toggle_loader();

  window.scrollTo({
      top: 0, // Set the scroll position to the top
      behavior: 'smooth' // Optional: Adds smooth scrolling
  });


});

let subjects = []

async function loadStudents() {
  const subjectsList = document.getElementById("subjectsList")
  if (!subjectsList) return

  const url = teacher_subject_url;
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      // createSubjectCards(result.data.all_subjects);
      renderSubjects(result.data.all_subjects);
      subjects = result.data.all_subjects;
    }
    else {
    }
  } else {
  }
}

function renderSubjects(subjectsToRender) {
  const subjectsList = document.getElementById("subjectsList")
  if (!subjectsList) return

  let html = ""

  if (subjectsToRender.length === 0) {
    subjectsList.innerHTML = '<div class="col-12 text-center py-5"><h5>No subjects found</h5></div>'
    return
  }

  // <p class="card-text">${subject.description}</p>

  subjectsToRender.forEach((subject) => {
    html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card subject-card h-100" style="border-top: 5px solid var(--secondary);">
                    
                    <div class="card-body pb-0">
                        <h5 class="card-title">${subject.subject_name}</h5>
                        <div class="d-flex gap-2">
                            <span class="badge bg-info">${subject.college_year}</span>
                            <span class="badge bg-secondary">Division ${subject.class_division}</span>
                        </div>                        
                    </div>
                    <div class="card-footer bg-secondary">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-white">${subject.student_counts} students enrolled</small>
                            <a href="${teacher_subject_detail_url}?subject_id=${subject.subject_id}" class="btn btn-sm btn-outline-light">Manage</a>
                        </div>
                    </div>
                </div>
            </div>
        `
  })

  subjectsList.innerHTML = html
}

function filterSubjects() {
  const yearFilter = document.getElementById("yearFilter").value
  const divisionFilter = document.getElementById("divisionFilter").value
  const searchFilter = document.getElementById("searchSubject").value.toLowerCase()

  const filteredSubjects = subjects.filter((subject) => {
    // Filter by year
    if (yearFilter && subject.college_year != yearFilter) {
      return false
    }

    // Filter by division
    if (divisionFilter && subject.class_division !== divisionFilter) {
      return false
    }

    // Filter by search term
    if (searchFilter && !subject.subject_name.toLowerCase().includes(searchFilter)) {
      return false
    }

    return true
  })

  renderSubjects(filteredSubjects)
}

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
