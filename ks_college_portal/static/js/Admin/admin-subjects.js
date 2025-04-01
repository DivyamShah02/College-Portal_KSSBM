let csrf_token = null;
let admin_subject_url = null;
let admin_subject_detail_url = null;

async function AdminSubjects(csrf_token_param, admin_subject_url_param, admin_subject_detail_url_param) {
  csrf_token = csrf_token_param;
  admin_subject_url = admin_subject_url_param;
  admin_subject_detail_url = admin_subject_detail_url_param;

  const currentDateElement = document.getElementById("currentDate");
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

  // Load subjects
  await loadSubjects();

  // Add event listeners for filters  
  const searchSubject = document.getElementById("searchSubject")

  if (searchSubject) {
    searchSubject.addEventListener("input", filterSubjects)
  }
}

let subjects = []

async function loadSubjects() {
  const subjectsList = document.getElementById("subjectsList")
  if (!subjectsList) return

  const url = admin_subject_url;
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
    console.log(subject);
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
                            <small class="text-white">Prof. ${subject.teacher_name}</small>
                            <a href="${admin_subject_detail_url}?subject_id=${subject.subject_id}" class="btn btn-sm btn-outline-light">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        `
  })

  subjectsList.innerHTML = html
}

function filterSubjects() {    
  const searchFilter = document.getElementById("searchSubject").value.toLowerCase()

  const filteredSubjects = subjects.filter((subject) => {
    // Filter by search term
    if (searchFilter && !subject.subject_name.toLowerCase().includes(searchFilter)) {
      return false
    }

    return true
  })

  renderSubjects(filteredSubjects)
}
