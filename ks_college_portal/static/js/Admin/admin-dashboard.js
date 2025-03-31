let csrf_token = null;
let admin_dashboard_url = null;
let admin_user_creation_url = null;
let dashboard_data = null;

async function AdminDashboard(csrf_token_param, admin_dashboard_url_param, admin_user_creation_url_param) {
  csrf_token = csrf_token_param;
  admin_dashboard_url = admin_dashboard_url_param;
  admin_user_creation_url = admin_user_creation_url_param;

  const url = admin_dashboard_url;
  const [success, result] = await callApi("GET", url);
  if (success) {
    if (result.success) {
      dashboard_data = result.data;
      console.log(dashboard_data);

      document.getElementById("active_students").innerText = dashboard_data.total_students;
      document.getElementById("active_teachers").innerText = dashboard_data.total_teachers;
      
      document.getElementById("total_placements").innerText = dashboard_data.total_company;
      
      document.getElementById("total_subjects").innerText = dashboard_data.total_subjects;
      document.getElementById("total_announcements").innerText = dashboard_data.total_announcement;
      document.getElementById("attendance_sessions").innerText = dashboard_data.total_attendance;

      // Load data
      loadRecentSubjects(dashboard_data.all_subjects);
      loadRecentAttendance(dashboard_data.all_attendance);
      loadRecentAnnouncements(dashboard_data.all_announcement);
      loadUpcomingPlacements(dashboard_data.all_company);
    }
    else {
    }
  } else {
  }

  const currentDateElement = document.getElementById("currentDate")
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

}


// Mock data functions
function loadRecentSubjects(subjects) {
  const recentSubjectsTable = document.getElementById("recentSubjectsTable");
  const recentSubjects = document.getElementById("recentSubjects");
  if (!recentSubjectsTable) return

  if (subjects.length === 0) {
    recentSubjects.innerHTML = '<div class="text-center py-5"><h5>No subjects found</h5></div>'
    return
  }
  let html = ""
  subjects.forEach((subject) => {
    html += `
            <tr>
                <td>${subject.subject_name}</td>
                <td><span class="badge bg-info">${subject.college_year}</span></td>
                <td><span class="badge bg-secondary">Division ${subject.class_division}</span></td>
                <td>${subject.student_counts}</td>
            </tr>
        `
  })

  recentSubjectsTable.innerHTML = html
}

function loadRecentAttendance(attendances) {
  const recentAttendanceTable = document.getElementById("recentAttendanceTable");
  const recentAttendance = document.getElementById("recentAttendance");

  if (!recentAttendanceTable) return

  if (attendances.length === 0) {
    recentAttendance.innerHTML = '<div class="text-center py-5"><h5>No attendance found</h5></div>'
    return
  }

  let html = ""
  attendances.forEach((attendance) => {
    const now = new Date()
    const attendanceDate = new Date(`${attendance.created_at}`)
    let attendanceEndDate = attendanceDate
    attendanceEndDate.setHours(attendanceDate.getHours() + 1);
    let attendance_completed = "In Progress";

    if (attendanceEndDate <= now) {
      attendance_completed = "Completed";
    }

    html += `
            <tr>
                <td class="text-nowrap">${attendance.subject_name}</td>
                <td>${new Date(attendance.created_at).toLocaleDateString()}</td>
                <td>${attendance.attendance_data}/${attendance.student_counts}</td>
                <td><span class="badge bg-${attendance_completed === "Completed" ? "success" : "primary"}">${attendance_completed}</span></td>
            </tr>
        `
  })

  recentAttendanceTable.innerHTML = html
}

function loadRecentAnnouncements(announcements) {
  const recentAnnouncementsList = document.getElementById("recentAnnouncementsList")
  const recentAnnouncements = document.getElementById("recentAnnouncements");
  
  if (!recentAnnouncementsList) return

  if (announcements.length === 0) {
    recentAnnouncements.innerHTML = '<div class="text-center py-5"><h5>No announcement found</h5></div>'
    return
  }

  let html = ""
  announcements.forEach((announcement) => {
    let doc_html = ""
    if (announcement.document_paths.length === 0) {
      doc_html = "";
    }
    else {
      announcement.document_paths.forEach((doc) => {
        doc_path = String(doc).replace('\\', '/');
        doc_html += `<button href="/media/${doc}" class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('/media/${doc_path}', '${String(doc).replace('uploads\\', '')}')">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('uploads\\', '')}
          </button>`        
      });
    }
    html += `
            <div class="announcement-card p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">${announcement.subject_name}</h6>
                    <span class="badge bg-primary text-white">${announcement.created_at}</span>
                </div>
                <p class="mb-1">${announcement.text_content}</p>  
                ${doc_html
        ? `
                                    <div class="mt-3 text-wrap text-break">
                                        ${doc_html}
                                    </div>
                                `
        : ""
      }              
            </div>
        `
  })

  recentAnnouncementsList.innerHTML = html
}

function loadUpcomingPlacements(placements) {
  const upcomingPlacementsList = document.getElementById("upcomingPlacementsList")
  const upcomingPlacements = document.getElementById("upcomingPlacements");
  
  if (!upcomingPlacementsList) return

  if (placements.length === 0) {
    upcomingPlacements.innerHTML = '<div class="text-center py-5"><h5>No company found</h5></div>'
    return
  }

  let html = ""
  placements.forEach((placement) => {
    html += `
            <div class="placement-card p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">${placement.company_name}</h6>
                    <span class="badge bg-success">${placement.estimated_package} LPA</span>
                </div>
                <p class="mb-1">${placement.job_role}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">${placement.created_at}</small>
                    <span class="badge bg-primary text-light">5 registrations</span>
                </div>
            </div>
        `
  })

  upcomingPlacementsList.innerHTML = html
}

function openDocModal(doc_path, doc_name) {
  displayDocument(doc_path);
  document.getElementById('viewDocumentModalLabel').innerText = doc_name;
  const myModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  myModal.show();
}


document.getElementById("register_form").addEventListener("submit", async (event) => {
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
      name: document.getElementById('firstname').value + ' ' + document.getElementById('lastname').value,
      password: document.getElementById('password').value,
      contact_number: document.getElementById('contact_number').value,
      email: document.getElementById('email').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      role: document.getElementById('role').value,
      roll_no: document.getElementById('roll_no').value,
      year: document.getElementById('year').value,
      division: document.getElementById('division').value,
  }
  const url = admin_user_creation_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
      console.log("Result:", result);

      if (result.success){
          document.getElementById('user-created-success').style.display = '';
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
