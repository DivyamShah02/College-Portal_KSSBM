let csrf_token = null;
let teacher_placements_url = null;
let teacher_placements_detail_url = null;

async function TeacherPlacements(csrf_token_param, teacher_placements_url_param, teacher_placements_detail_url_param) {
  csrf_token = csrf_token_param;
  teacher_placements_url = teacher_placements_url_param;
  teacher_placements_detail_url = teacher_placements_detail_url_param;

  const currentDateElement = document.getElementById("currentDate");
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

  // Load subjects
  await loadPlacements();

  // Add event listeners for filters
  // const yearFilter = document.getElementById("yearFilter")
  // const divisionFilter = document.getElementById("divisionFilter")
  // const searchSubject = document.getElementById("searchSubject")

  // if (yearFilter) {
  //   yearFilter.addEventListener("change", filterSubjects)
  // }

  // if (divisionFilter) {
  //   divisionFilter.addEventListener("change", filterSubjects)
  // }

  // if (searchSubject) {
  //   searchSubject.addEventListener("input", filterSubjects)
  // }

  // // Add event listener for save subject button
  // const saveSubjectBtn = document.getElementById("saveSubjectBtn")
  // if (saveSubjectBtn) {
  //   saveSubjectBtn.addEventListener("click", saveSubject);
  // }
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
  const url = teacher_placements_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
      console.log("Result:", result);

      if (result.success) {
        document.getElementById("close_add_subject_modal").click();
        await loadPlacements();
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

async function loadPlacements() {
  const placementsList = document.getElementById("placementsList")
  if (!placementsList) return

  const url = teacher_placements_url;
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      // createSubjectCards(result.data.all_subjects);
      renderPlacements(result.data.all_companies);      
    }
    else {
    }
  } else {
  }
}

function renderPlacements(placementsToRender) {
  const placementsList = document.getElementById("placementsList")
  if (!placementsList) return

  let html = ""

  if (placementsToRender.length === 0) {
    placementsList.innerHTML = '<div class="col-12 text-center py-5"><h5>No companies found</h5></div>'
    return
  }

  // <p class="card-text">${subject.description}</p>

  placementsToRender.forEach((company) => {
    html += `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0"><b>${company.company_name}</b></h5>
                  </div>
                  <h6 class="text-info mb-3">${company.job_role}</h6>
                  <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-cash-stack text-success me-2"></i>
                      <span class="fw-bold">₹${company.estimated_package} LPA</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-globe me-2"></i>
                      <span><a href="${company.website}" style="color: inherit">Visit Website</a></span>
                    </div>                    
                  </div>
                  <p class="card-text">${company.description}</p>
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="badge bg-secondary">Internship duration: <b>${company.internship_duration}</b> Months</span>
                    <span class="badge bg-secondary">Internship stipend: <b>₹${company.internship_stipend}</b></span>                    
                  </div>
                  <p class="card-text">${company.notes ? `${company.notes}` : ""}</p>
                </div>
                <div class="card-footer bg-secondary border-top-0">
                  <div class="d-grid">
                    <button class="btn btn-outline-light">Details</button>
                  </div>
                </div>
              </div>
            </div>
        `
  })

  placementsList.innerHTML = html
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

  renderPlacements(filteredSubjects)
}

