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

}

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
                      <span><a href="${company.website}" style="color: inherit" target="_blank">Visit Website</a></span>
                    </div>                    
                  </div>
                  <p class="card-text">${company.description}</p>
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="badge bg-secondary">Internship duration: <b>${company.internship_duration}</b> Months</span>
                    <span class="badge bg-secondary">Internship stipend: <b>₹${company.internship_stipend}</b></span>                    
                  </div>
                  <p class="card-text text-muted"><u>${company.notes ? `${company.notes}` : ""}</u></p>
                  <span class="badge bg-primary p-2 me-2">
                      <i class="bi bi-people-fill me-1"></i> <span id="registered-count">${company.total_registrations}</span> Registered
                  </span> 
                </div>
                <div class="card-footer bg-secondary border-top-0">
                  <div class="d-grid">
                    <a class="btn btn-outline-light" href="${teacher_placements_detail_url}?company_id=${company.company_id}">Details</a>
                  </div>
                </div>
              </div>
            </div>
        `
  })

  placementsList.innerHTML = html
}

document.getElementById("add_company_form").addEventListener("submit", async (event) => {
  const form = event.target;

  // Prevent the form from submitting
  event.preventDefault();

  // Check form validity
  if (!form.checkValidity()) {
    // Trigger the browser's built-in validation tooltips
    form.reportValidity();
    return;
  }
  let is_valid_url = isValidURL('website');

  if (!is_valid_url) {
    alert('Please enter a valid website link, Url should start with "https://"');
    return;
  }
  let bodyData = {
    company_name: document.getElementById('company_name').value,
    description: document.getElementById('description').value,
    website: document.getElementById('website').value,
    job_role: document.getElementById('job_role').value,
    notes: document.getElementById('notes').value,
    internship_duration: document.getElementById('internship_duration').value,
    internship_stipend: document.getElementById('internship_stipend').value,
    estimated_package: document.getElementById('estimated_package').value,
  }
  const url = teacher_placements_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
    console.log("Result:", result);

    if (result.success) {
      location.reload();
    }

    else {
      document.getElementById('error-unexpected').innerText = result.error;
      document.getElementById('error-unexpected').style.display = '';
    }

  } else {
    document.getElementById('error-unexpected').style.display = '';
  }

  window.scrollTo({
    top: 0, // Set the scroll position to the top
    behavior: 'smooth' // Optional: Adds smooth scrolling
  });


});

function isValidURL(inputId) {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) {
    console.error("Invalid input ID");
    return false;
  }

  const url = inputElement.value.trim();
  const urlPattern = /^(https:\/\/)([\w\-]+\.)+[\w]{2,}(\/\S*)?$/;

  return urlPattern.test(url);
}
