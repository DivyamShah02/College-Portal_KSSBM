let csrf_token = null;
let student_events_url = null;
let student_events_detail_url = null;
let student_event_registrations_url = null;

async function StudentEvents(csrf_token_param, student_events_url_param, student_events_detail_url_param, student_event_registrations_url_param) {
  csrf_token = csrf_token_param;
  student_events_url = student_events_url_param;
  student_events_detail_url = student_events_detail_url_param;
  student_event_registrations_url = student_event_registrations_url_param;

  const currentDateElement = document.getElementById("currentDate");
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

  // Load subjects
  await loadEvents();

}

let subjects = []

async function loadEvents() {
  const eventsList = document.getElementById("eventsList")
  if (!eventsList) return

  const url = student_events_url;
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      // createSubjectCards(result.data.all_subjects);
      renderEvents(result.data.all_events);
    }
    else {
    }
  } else {
  }
}

function renderEvents(eventsToRender) {
  const eventsList = document.getElementById("eventsList")
  if (!eventsList) return

  let html = ""

  if (eventsToRender.length === 0) {
    eventsList.innerHTML = '<div class="col-12 text-center py-5"><h5>No events found</h5></div>'
    return
  }

  // <p class="card-text">${subject.description}</p>

  eventsToRender.forEach((event) => {
    html += `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0"><b>${event.event_name}</b></h5>
                    <p class="card-text text-muted"><b><u>${event.event_type}</u></b></p>
                  </div>
                  <h6 class="text-info mb-3">${event.event_duration}</h6>                  
                  <p class="card-text">${event.description}</p>                  
                  <p class="card-text text-muted"><u>${event.notes ? `${event.notes}` : ""}</u></p>                  
                </div>
                <div class="card-footer bg-secondary border-top-0">
                  <div class="d-grid">
                    ${event.student_registered ?
                      `<button class="btn btn-outline-light" disabled href="${student_events_detail_url}?event_id=${event.event_id}">Registered</button>`
                      :
                      `<button class="btn btn-primary w-100" onclick="handleRegisterEvent('${event.event_id}', '${event.event_name}', '${event.event_duration}')">
                          <b class="me-2">Register for Event</b><i class="bi bi-box-arrow-in-right"></i>
                        </button>`}
                  </div>
                </div>
              </div>
            </div>
        `
  })

  eventsList.innerHTML = html
}

document.getElementById("add_event_form").addEventListener("submit", async (event) => {
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
    event_name: document.getElementById('event_name').value,
    description: document.getElementById('description').value,
    website: document.getElementById('website').value,
    job_role: document.getElementById('job_role').value,
    notes: document.getElementById('notes').value,
    internship_duration: document.getElementById('internship_duration').value,
    internship_stipend: document.getElementById('internship_stipend').value,
    estimated_package: document.getElementById('estimated_package').value,
  }
  const url = student_events_url;
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

function handleRegisterEvent(event_id, event_name, job_role) {
  document.getElementById('register-event-name').textContent = event_name;
  document.getElementById('register-event-duration').textContent = job_role;
  document.getElementById('register-event-id').value = event_id;

  const registerEventModal = new bootstrap.Modal(document.getElementById('registerEventModal'));
  registerEventModal.show();
  
}

async function event_register() {
  let event_id = document.getElementById('register-event-id').value
  let bodyData = {
    event_id: event_id
  }
  const url = student_event_registrations_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
      console.log("Result:", result);
      if (result.success) {          
          location.reload();
      }

      else {
      }

  } else {
  }

}
