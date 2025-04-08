let csrf_token = null;
let teacher_events_url = null;
let teacher_events_detail_url = null;

async function TeacherEvents(csrf_token_param, teacher_events_url_param, teacher_events_detail_url_param) {
  csrf_token = csrf_token_param;
  teacher_events_url = teacher_events_url_param;
  teacher_events_detail_url = teacher_events_detail_url_param;

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

  const url = teacher_events_url;
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
                <span class="badge bg-secondary p-2 me-2 w-100">
                      <i class="bi bi-people-fill me-1"></i> <span id="registered-count">${event.total_registrations}</span> Registered
                  </span> 
                </div>
              </div>
            </div>
        `
        // <div class="d-grid">
        //             <a class="btn btn-outline-light" href="${teacher_events_detail_url}?event_id=${event.event_id}">Update Event</a>
        //           </div>
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

  let bodyData = {
    event_name: document.getElementById('event_name').value,
    event_type: document.getElementById('event_type').value,
    description: document.getElementById('description').value,
    notes: document.getElementById('notes').value,
    event_duration: document.getElementById('event_duration').value,
  }
  const url = teacher_events_url;
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
