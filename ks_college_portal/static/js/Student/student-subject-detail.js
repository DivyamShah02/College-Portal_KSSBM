let csrf_token = null;
let student_subject_details_url = null;
let student_subject_announcements_url = null;
let student_subject_announcements_comments_url = null;
let student_subject_submit_assignments_url = null;
let student_subject_mark_attendance_url = null;
let subjectId = null;
let student_counts = null;
let assignmentSelectedFiles = [];
let subject = null;
let student_id = null;

async function HandleSubjectDetail(csrf_token_param, student_subject_details_url_param, student_subject_announcements_url_param, student_subject_announcements_comments_url_param, student_subject_submit_assignments_url_param, student_id_param, student_subject_mark_attendance_url_param) {
  csrf_token = csrf_token_param;
  student_subject_details_url = student_subject_details_url_param;
  student_subject_announcements_url = student_subject_announcements_url_param;
  student_subject_announcements_comments_url = student_subject_announcements_comments_url_param;
  student_subject_submit_assignments_url = student_subject_submit_assignments_url_param;
  student_subject_mark_attendance_url = student_subject_mark_attendance_url_param;
  student_id = student_id_param;

  const urlParams = new URLSearchParams(window.location.search);
  subjectId = urlParams.get("subject_id");

  if (!subjectId) {
    window.location.href = "/subjects/";
    console.log('erabgyuobboawgreuy');
    return;
  }

  await loadSubjectDetails(subjectId);

  const submitAttendanceBtn = document.getElementById("submitAttendanceBtn")
  if (submitAttendanceBtn) {
    submitAttendanceBtn.addEventListener("click", submitAttendance)
  }

  const inputs = document.querySelectorAll(".attendance-code-input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      if (event.target.value.length === 1) {
        const nextInput = inputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && event.target.value === "") {
        const prevInput = inputs[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    });
  });


}

// Function to load subject details
async function loadSubjectDetails(subjectId) {
  const Params = {
    subject_id: subjectId
  };

  const url = `${student_subject_details_url}?` + toQueryString(Params);
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      subject = result.data;
    }
    else {
      window.location.href = "/subjects/";
      return;
    }
  } else {
    window.location.href = "/subjects/";
    return;
  }

  // Update page title
  document.title = `${subject.subject_data.subject_name} | Teacher Dashboard`

  student_counts = subject.subject_data.student_counts

  // Update subject details
  document.getElementById("subjectTitle").textContent = subject.subject_data.subject_name
  // document.getElementById("subjectDescriptionText").textContent = subject.subject_data.description
  document.getElementById("professorName").textContent = subject.subject_data.teacher_name
  document.getElementById("announcementsCount").textContent = subject.total_announcements
  document.getElementById("assignmentsCount").textContent = `${subject.total_assignments_pending} Pending, ${subject.total_assignments_submitted} Completed`
  document.getElementById("attendanceSessions").textContent = `${subject.attendance_percentage}% (${subject.total_marked_attendance}/${subject.total_attendances} classes)`
  // document.getElementById("subjectImage").src = subject.image

  // Update subject badges
  const subjectBadges = document.getElementById("subjectBadges")
  subjectBadges.innerHTML = `
        <span class="badge bg-info">${subject.subject_data.college_year}</span>
        <span class="badge bg-secondary">Division ${subject.subject_data.class_division}</span>
    `

  loadAssignments(subject.all_announcements);
  loadAssignments(subject.all_assignments);
  loadAttendance(subject.all_attendance);

}

// Function to load announcements
function loadAssignments(subjectAnnouncements) {
  const announcementsList = document.getElementById("announcementsList")

  if (subjectAnnouncements.length === 0) {
    announcementsList.innerHTML = '<div class="text-center py-4"><p>No announcements yet</p></div>'
    return
  }

  let html = ""
  let index = 0
  subjectAnnouncements.forEach((announcement) => {
    index += 1;
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
                <div class="card announcement-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${announcement.teacher_name}</h5>
                            <span class="badge bg-primary text-white">${announcement.created_at}</span>
                        </div>
                        <p class="card-text">${announcement.text_content}</p>
                        ${doc_html
        ? `
                            <div class="mt-3 text-wrap text-break">
                                ${doc_html}
                            </div>
                        `
        : ""
      }
                        <!-- Comments Section -->
                        <div class="mt-4">
                            <h6 class="mb-3"><i class="bi bi-chat-left-text me-2"></i>Comments (${announcement.comment_data ? announcement.comment_data.length : 0})</h6>
                            
                            <!-- Add Comment Form -->
                            <form class="add-comment-form mb-3">
                                <div class="input-group">
                                    <input 
                                        type="text" 
										id="announcement-${index}-comment-input"
                                        class="form-control" 
                                        placeholder="Write a comment..." 
                                        aria-label="Add a comment" 
                                        data-announcement-id="${announcement.announcement_id}"
                                    >
                                    <button class="btn btn-primary" type="button" onclick="addComment('${index}', '${announcement.announcement_id}')">
                                        <i class="bi bi-send"></i>
                                    </button>
                                </div>
                            </form>

                            <!-- Comments List -->
                            <div class="comments-list">
                                ${announcement.comment_data && announcement.comment_data.length > 0
        ? announcement.comment_data.map(comment => `
                                        <div class="comment mb-3">
                                            <div class="comment-header">
                                                <span class="comment-author">${comment.user_name}</span>
                                                <span class="comment-time">${comment.created_at}</span>
                                            </div>
                                            <div class="text-muted">
                                                ${comment.comment_content}
                                            </div>
                                        </div>
                                    `).join('')
        : '<p class="text-muted">No comments yet. Be the first to comment!</p>'
      }
                            </div>                        
                        </div>
                    </div>
                </div>
            `
  })

  announcementsList.innerHTML = html
}

// Function to load assignments
function loadAssignments(subjectAssignments) {
  if (subjectAssignments.length === 0) {
    assignmentsList.innerHTML = '<div class="text-center py-4"><p>No assignments yet</p></div>'
    return
  }

  let html = ""
  subjectAssignments.forEach((assignment) => {
    let doc_html = ""

    if (assignment.document_paths.length === 0) {
      doc_html = "";
    }
    else {
      assignment.document_paths.forEach((doc) => {
        doc_path = String(doc).replace('\\', '/');
        doc_html += `<button class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('/media/${doc_path}', '${String(doc).replace('uploads\\', '')}')">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('uploads\\', '')}
          </button>`
      });
    }

    const dueDateTime = new Date(`${assignment.deadline_date}`)
    const isOverdue = dueDateTime < new Date()

    let badge = null;
    let action_button = null;

    if (assignment.assignment_submitted) {
      badge = `<span class="badge bg-success text-white">
                    Submitted
                </span>`
      action_button = `
          <button class="btn btn-sm btn-outline-primary" onclick="view_submitted_assignment('${student_id}', '${assignment.assignment_id}')">
            <i class="bi bi-file-earmark-check me-2"></i>Your Submission
          </button>`
    }
    else {
      badge = `<span class="badge ${isOverdue ? "bg-danger" : "bg-warning"} text-white">
                    Due: ${new Date(assignment.deadline_date).toLocaleDateString()} at ${new Date(assignment.deadline_date).toLocaleTimeString()}
                </span>`
      if (isOverdue) {
        action_button = `<button class="btn btn-sm btn-outline-danger" disabled>
                            <i class="bi bi-x me-2"></i><b>Assignment Not Submitted</b>
                          </button>`
      }
      else {
        action_button = `<button class="btn btn-sm btn-primary" onclick="submitAssignment('${assignment.assignment_id}')">
                            <i class="bi bi-upload me-2"></i>Submit Assignment
                          </button>`
      }
    }

    // <h5 class="card-title mb-0">${assignment.title}</h5>
    html += `
                <div class="card assignment-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            ${badge}
                        </div>
                        <p class="card-text">${assignment.text_content}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
						${doc_html
        ? `
											<div class="mt-3 text-wrap text-break">
												${doc_html}
											</div>
										`
        : ""
      }
                        </div>
                        ${action_button}
                    </div>
                </div>
            `
  })

  assignmentsList.innerHTML = html
}

// Function to load attendance
function loadAttendance(subjectAttendance) {
  if (subjectAttendance.length === 0) {
    attendanceList.innerHTML = '<div class="text-center py-4"><p>No attendance sessions yet</p></div>'
    return
  }

  let html = ""
  subjectAttendance.forEach((session) => {
    const attendanceDate = new Date(`${session.created_at}`)
    console.log(session.created_at)

    const now = new Date()
    let attendanceEndDate = attendanceDate
    attendanceEndDate.setHours(attendanceDate.getHours() + 1);

    let attendancePercentage = getAssignmentProgress(new Date(`${session.created_at}`), attendanceEndDate)
    let attendanceProgressColor = getProgressColor(attendancePercentage);

    let attendance_completed = "Live";
    let attendance_badge_bg = "primary";
    let attendance_still_live = true;

    if (attendanceEndDate <= now) {
      attendance_still_live = false;
      if (!session.attendance_marked) {
        attendance_completed = "Absent";
        attendance_badge_bg = "danger";
      }

      else {
        attendance_completed = "Present";
        attendance_badge_bg = "success";
        attendance_still_live = false;
        attendancePercentage = 100
        attendanceProgressColor = "success";
      }
    }
    else {
      if (session.attendance_marked) {
          attendance_completed = "Present";
          attendance_badge_bg = "success";
          attendance_still_live = false;
          attendancePercentage = 100
          attendanceProgressColor = "success";
      }

    }

    console.log(attendanceProgressColor);

    html += `
                <div class="card attendance-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="card-title mb-0">${attendanceEndDate.toLocaleString()}</h6>
                            <span class="badge bg-${attendance_badge_bg} text-white">
                                ${attendance_completed}
                            </span>
                        </div>                        
                        <div class="mt-3">
                            <div class="progress" style="height: 10px;">
                                <div class="progress-bar bg-${attendanceProgressColor}" role="progressbar" style="width: ${attendancePercentage}%;" aria-valuenow="${attendancePercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="mt-3">
                        ${attendance_still_live ? `<button class="btn btn-sm btn-primary" onclick="mark_attendance(${session.attendance_id})">
                                <i class="bi bi-calendar-check me-2"></i>Mark Attendance
                            </button>` : ''}                            
                        </div>
                    </div>
                </div>
            `
  })

  attendanceList.innerHTML = html
}

function getAssignmentProgress(createdAt, deadline) {

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

async function addComment(index, announcement_id) {
  console.log(document.getElementById(`announcement-${index}-comment-input`))
  let comment_content = document.getElementById(`announcement-${index}-comment-input`).value;
  console.log(index);
  console.log(comment_content);
  if (comment_content != '') {
    let bodyData = {
      announcement_id: announcement_id,
      comment_content: comment_content
    }

    const url = student_subject_announcements_comments_url;
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
}

function submitAssignment(assignment_id) {
  document.getElementById('assignment_id').value = assignment_id;
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
  formData.append(`subject_id`, subjectId);
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


});

async function view_submitted_assignment(student_id, assignment_id) {
  const submittedAssignmentModal = new bootstrap.Modal(document.getElementById("submittedAssignmentModal"));
  submittedAssignmentModal.show();
  const container = document.getElementById('document_list_div');
  container.innerHTML = ''
  container.innerHTML = '<div class="col-12 text-center py-5"><h5>Loading...</h5></div>';
  await get_submitted_assignment(student_id, assignment_id);

}

async function get_submitted_assignment(student_id, assignment_id) {
  const Params = {
    student_id: student_id,
    assignment_id: assignment_id
  };

  const url = `${student_subject_submit_assignments_url}?` + toQueryString(Params);
  const [success, result] = await callApi("GET", url);
  console.log(result);
  if (success) {
    if (result.success) {
      console.log(result.data);
      createDocumentList(result.data.submitted_assignment.document_paths, result.data.submitted_assignment.created_at, result.data.submitted_assignment.text_content);

    }
    else {

      return;
    }
  } else {

    return;
  }
}

function createDocumentList(documentList, created_at, text_content) {
  const container = document.getElementById('document_list_div');

  let doc_index = 0;
  let doc_html = "";
  doc_html += `<p class="my-0"><b>Submitted on:</b> ${created_at}</p>`;
  doc_html += `<p><b>Text Content:</b> ${text_content}</p>`;
  documentList.forEach((doc) => {
    doc_index += 1;
    doc_path = String(doc).replace('\\', '/');
    doc_html += `<div class="d-flex align-items-center py-3 px-2 mb-2 document-card"
                            onclick="openDocModal('/media/${doc_path}', '${String(doc).replace('students_assignments\\', '')}')">
                            <i class="fa fa-file-pdf fa-xl text-danger"></i>&nbsp;&nbsp;&nbsp; <u>${String(doc).replace('students_assignments\\', '')}</u>
                            <div class="ms-auto"><a class="fa fa-download fa-xl mx-2 text-white" href="/media/${doc}" download="${String(doc).replace('students_assignments\\', '')}" id="doc-${doc_index}-downloader"></a></div>
    </div>`

  });

  container.innerHTML = '';
  container.innerHTML = doc_html;

  doc_index = 0;
  documentList.forEach((doc) => {
    doc_index += 1;
    document.getElementById(`doc-${doc_index}-downloader`).addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });

}

function openDocModal(doc_path, doc_name) {
  displayDocument(doc_path);
  document.getElementById('viewDocumentModalLabel').innerText = doc_name;
  const myModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  myModal.show();
}

function mark_attendance(attendance_id) {
  document.getElementById('attendance_id').value = attendance_id;
  const markAttendanceModal = new bootstrap.Modal(document.getElementById('markAttendanceModal'));
  markAttendanceModal.show();
}

async function submitAttendance() {
  const inputs = document.querySelectorAll(".attendance-code-input");
  document.getElementById('mark-attendance-error').style.display = 'none';
  let code = ""

  inputs.forEach((input) => {
    code += input.value
  })

  if (code.length !== 6) {
    alert("Please enter a valid 6-digit attendance code")
    return
  }

  let bodyData = {
    attendance_id: document.getElementById('attendance_id').value,
    unique_code: code
  }

  const url = student_subject_mark_attendance_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
    console.log("Result:", result);

    if (result.success) {
      location.reload();
    }

    else {
      document.getElementById('mark-attendance-error').style.display = '';
      document.getElementById('mark-attendance-error').innerText = result.error;
      inputs[0].focus();
    }

  } else {
    document.getElementById('mark-attendance-error').style.display = '';
    document.getElementById('mark-attendance-error').innerText = 'Unexpected Error occured!';
    inputs[0].focus();
  }

  // Reset inputs
  inputs.forEach((input) => {
    input.value = ""
  })

}
