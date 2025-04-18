let csrf_token = null;
let student_dashboard_url = null;
let student_dashboard_pending_assignment_count_url = null;
let student_subject_submit_assignments_url = null;
let student_dashboard_marked_attendance_url = null;
let student_placements_detail_url = null;
let student_subjects_detail_url = null;
let assignmentSelectedFiles = [];
let dashboard_data = null;

async function StudentDashboard(csrf_token_param, student_dashboard_url_param, student_dashboard_pending_assignment_count_url_param, student_subject_submit_assignments_url_param, student_dashboard_marked_attendance_url_param, student_placements_detail_url_param, student_subjects_detail_url_param) {
  csrf_token = csrf_token_param;
  student_dashboard_url = student_dashboard_url_param;
  student_dashboard_pending_assignment_count_url = student_dashboard_pending_assignment_count_url_param;
  student_subject_submit_assignments_url = student_subject_submit_assignments_url_param;
  student_dashboard_marked_attendance_url = student_dashboard_marked_attendance_url_param;
  student_placements_detail_url = student_placements_detail_url_param;
  student_subjects_detail_url = student_subjects_detail_url_param;

  const url = student_dashboard_url;
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      dashboard_data = result.data;
      console.log(dashboard_data);

      document.getElementById("total_subjects").innerText = dashboard_data.total_subjects
      // document.getElementById("active_students").innerText = dashboard_data.total_students;
      // document.getElementById("total_announcements").innerText = dashboard_data.total_announcement;
      // document.getElementById("attendance_sessions").innerText = dashboard_data.total_attendance;

      // Load data
      loadRecentSubjects(dashboard_data.all_subjects);
      loadPendingAssignment(dashboard_data.all_assignment);
      loadRecentAttendance(dashboard_data.all_attendance);
      loadRecentAnnouncements(dashboard_data.all_announcement);
      if (dashboard_data.student_data.year === 'fifth_year') {
        loadRecentCompanyAnnouncements(dashboard_data.all_company_announcement);
      }
      else {
        document.getElementById('recentCompanyAnnouncementsCard').style.display = 'none';
      }
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
                <td class="text-nowrap text-center">${subject.subject_name}</td>                
                <td class="text-nowrap text-center">${subject.teacher_name}</td>
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
                <td>${attendance.attendance_data.length}/${attendance.student_counts}</td>
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
        // // doc_path = String(doc).replace('\\', '/');
        doc_path = String(doc);
        doc_html += `<button href="${doc}" class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('${doc_path}', '${String(doc).replace('https://sankievents.s3.eu-north-1.amazonaws.com/uploads/', '')}')">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('https://sankievents.s3.eu-north-1.amazonaws.com/uploads/', '')}
          </button>`
      });
    }
    html += `
            <div class="announcement-card p-3 mb-3" onclick="window.location = '${student_subjects_detail_url}?subject_id=${announcement.subject_id}'" style="cursor: pointer;">
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

function loadRecentCompanyAnnouncements(company_announcements) {
  console.log('gnresignrengrjiagengi');
  const recentCompanyAnnouncementsList = document.getElementById("recentCompanyAnnouncementsList")
  const recentCompanyAnnouncements = document.getElementById("recentCompanyAnnouncements");

  if (!recentCompanyAnnouncementsList) return

  if (company_announcements.length === 0) {
    recentCompanyAnnouncements.innerHTML = '<div class="text-center py-5"><h5>No announcement found</h5></div>'
    return
  }

  let html = ""
  company_announcements.forEach((announcement) => {
    html += `
            <div class="announcement-card p-3 mb-3" onclick="window.location = '${student_placements_detail_url}?company_id=${announcement.company_id}'" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">${announcement.company_name}</h6>
                    <span class="badge bg-primary text-white">${announcement.created_at}</span>
                </div>
                <p class="mb-1">${announcement.announcement_content}</p>
            </div>
        `
  })

  recentCompanyAnnouncementsList.innerHTML = html
}

function loadPendingAssignment(pending_assignments) {
  const pendingAssignmentsList = document.getElementById("pendingAssignmentsList")
  const pendingAssignments = document.getElementById("pendingAssignments");

  if (!pendingAssignmentsList) return

  if (pending_assignments.length === 0) {
    pendingAssignments.innerHTML = '<div class="text-center py-5"><h5>No pending assignments!</h5></div>'
    return
  }

  let html = ""
  pending_assignments.forEach((pending_assignment) => {
    let doc_html = ""

    if (pending_assignment.document_paths.length === 0) {
      doc_html = "";
    }
    else {
      pending_assignment.document_paths.forEach((doc) => {
        // doc_path = String(doc).replace('\\', '/');
        doc_path = String(doc);
        doc_html += `<button class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('${doc_path}', '${String(doc).replace('https://sankievents.s3.eu-north-1.amazonaws.com/uploads/', '')}')">
          <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('https://sankievents.s3.eu-north-1.amazonaws.com/uploads/', '')}
        </button>`
      });
    }

    let assignment_progress = getAssignmentProgress(pending_assignment.created_at, pending_assignment.deadline_date).toFixed(2)
    let progress_color = getProgressColor(assignment_progress);

    html += `            
            <div class="assignment-card border-${progress_color} p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">${pending_assignment.subject_name}</h6>
                    <span class="badge bg-warning">Due: ${new Date(pending_assignment.deadline_date).toLocaleDateString()} at ${new Date(pending_assignment.deadline_date).toLocaleTimeString()}</span>
                </div>
                ${doc_html
        ? `
                              <div class="mt-3 text-wrap text-break">
                                ${doc_html}
                              </div>
                            `
        : ""
      }
                <p class="mb-1 text-muted small">${pending_assignment.text_content}</p>
                <button class="btn btn-sm btn-primary w-100 my-2" onclick="submitAssignment('${pending_assignment.assignment_id}', '${pending_assignment.subject_id}')">
                          <i class="bi bi-upload me-2"></i>Submit Assignment
                        </button>
                <div class="progress mt-2" style="height: 5px;">
                    <div class="progress-bar bg-${progress_color}" role="progressbar" style="width: ${assignment_progress}%;" aria-valuenow="${assignment_progress}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        `
  })

  pendingAssignmentsList.innerHTML = html
}

function getAssignmentProgress(createdAtStr, deadlineStr) {
  // Convert createdAt string to Date
  const [createdTime, createdDate] = createdAtStr.split(' | ');
  const [createdHours, createdMinutes] = createdTime.split(':');
  const [createdDay, createdMonth, createdYear] = createdDate.split('-');

  const createdAt = new Date(`${createdYear}-${createdMonth}-${createdDay}T${createdHours}:${createdMinutes}:00+05:30`);

  // Convert deadline string to Date
  const deadline = new Date(deadlineStr);

  const currentTime = new Date();

  if (currentTime < createdAt) return 0;
  if (currentTime > deadline) return 100;

  const totalDuration = deadline - createdAt;
  const elapsedDuration = currentTime - createdAt;

  return (elapsedDuration / totalDuration) * 100;
}

function getProgressColor(percentage) {
  if (percentage < 25) return 'info';
  if (percentage < 75) return 'warning';
  return 'danger';
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

async function GetPendingAssignmentCount() {
  const url = student_dashboard_pending_assignment_count_url;
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      document.getElementById("pending_assignments").innerText = result.data.total_pending_assignment;
      document.getElementById("missed_assignments").innerText = result.data.total_missed_assignment;
    }
    else {
    }
  } else {
  }

}

function openDocModal(doc_path, doc_name) {
  displayDocument(doc_path);
  document.getElementById('viewDocumentModalLabel').innerText = doc_name;
  const myModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  myModal.show();
}


function submitAssignment(assignment_id, subject_id) {
  document.getElementById('assignment_id').value = assignment_id;
  document.getElementById('subject_id').value = subject_id;
  const submitAssignmentModal = new bootstrap.Modal(document.getElementById("submitAssignmentModal"))
  submitAssignmentModal.show();
}

document.getElementById('announcementDoc').addEventListener('change', function (event) {
  handleFiles(event.target.files);
});

function handleFiles(files) {
  const allowedExtensions = ['mp3', 'wav', 'ogg', 'mp4', 'webm', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'docx'];

  for (let file of files) {
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`Unsupported file type: ${file.name}`);
      continue;
    }
    document.getElementById(`upload_input_text`).style.display = 'none';
    document.getElementById(`upload_input_file_text`).style.display = '';
    document.getElementById(`upload_input_file_text`).innerText = file.name + ", " + document.getElementById(`upload_input_file_text`).innerText;
    document.getElementById(`announcementDocUploadIcon`).className = 'bi bi-cloud-check fa-xl';

    assignmentSelectedFiles.push(file);

  }
}

document.getElementById("submit_assignment_form").addEventListener("submit", async (event) => {
  toggle_loader();
  event.preventDefault();
  if (assignmentSelectedFiles.length === 0) {
    document.getElementById('upload_box').classList.add('border-danger');
    return;
  }
  else {
    document.getElementById('upload_box').classList.remove('border-danger');
  }
  const form = event.target;

  // Check form validity
  if (!form.checkValidity()) {
    // Trigger the browser's built-in validation tooltips
    form.reportValidity();
    return;
  }
  const formData = new FormData();

  assignmentSelectedFiles.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  // formData.append(`files`, selectedFiles);
  formData.append(`text_content`, document.getElementById('text_content').value);  
  formData.append(`subject_id`, document.getElementById('subject_id').value);
  formData.append(`assignment_id`, document.getElementById('assignment_id').value);

  const url = student_subject_submit_assignments_url;
  const [success, result] = await callApi("POST", url, formData, csrf_token, true);

  console.log(result);
  if (success) {
    if (result.success) {
      location.reload();
    }
    else {
      document.getElementById('error-unexpected').style.display = '';
      document.getElementById('error-unexpected').innerText = result.error;
    }
  }
  else {
    document.getElementById('error-unexpected').style.display = '';
    document.getElementById('error-unexpected').innerText = 'Unexpected Error occured!';
  }

  window.scrollTo({
    top: 0, // Set the scroll position to the top
    behavior: 'smooth' // Optional: Adds smooth scrolling
  });
  toggle_loader();

});

async function GetMarkedAttendanceCount() {
  const url = student_dashboard_marked_attendance_url;
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      document.getElementById("attendance_percentage").innerText = `${result.data.total_attendance_percentage}%`;

      let subject_details_container = document.getElementById('subject_wise_attendance')
      subject_details_container.innerHTML = '';
      let subject_html_content = '';

      result.data.all_subject_attendance.forEach((subject_attendance) => {
        subject_html_content += `
          <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                  <span>${subject_attendance.subject_name} (${subject_attendance.marked_attendances}/${subject_attendance.all_attendance_subject})</span>
                  <span>${subject_attendance.attendance_percentage}%</span>
              </div>
              <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-success" role="progressbar" style="width: ${subject_attendance.attendance_percentage}%;" aria-valuenow="${subject_attendance.attendance_percentage}" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
          </div>
        `
      });

      subject_details_container.innerHTML = subject_html_content;

      let circle = document.querySelector('.circle');
      circle.setAttribute('stroke-dasharray', `${result.data.total_attendance_percentage}, 100`);
      document.getElementById('total_attendance_percentage').innerText = `${result.data.total_attendance_percentage}%`;
      
    }
    else {
    }
  } else {
  }

}
