let csrf_token = null;
let student_subject_assignments_url = null;
let student_subject_url = null;
let student_subject_submit_assignments_url = null;
let assignmentSelectedFiles = [];
let student_id = null;
let assignments = null;

async function HandleAnnouncementsDetail(csrf_token_param,  student_subject_assignments_url_param,  student_subject_url_param, student_subject_submit_assignments_url_param, student_id_param) {
	csrf_token = csrf_token_param;	
	student_subject_assignments_url = student_subject_assignments_url_param;
  student_subject_url = student_subject_url_param;
  student_subject_submit_assignments_url = student_subject_submit_assignments_url_param;
  student_id = student_id_param;

	await GetAssignments();

}

async function GetAssignments() {

	const url = `${student_subject_assignments_url}?`;
	const [success, result] = await callApi("GET", url);
	console.log(result);
	if (success) {
		if (result.success) {
			assignments = result.data.all_assignments;
      loadAssignments(assignments.pending_assignments, 'pending-assignmentsList');
      loadAssignments(assignments.completed_assignments, 'completed-assignmentsList');
      loadAssignments(assignments.missed_assignments, 'missed-assignmentsList');
		}
		else {
			window.location.href = "/dashboard/";
			return;
		}
	} else {
		window.location.href = "/dashboard/";
		return;
	}

}


function loadAssignments(subjectAssignments, assignmentsList_id) {
  let assignmentsList = document.getElementById(assignmentsList_id);

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
        action_button = `<button class="btn btn-sm btn-primary" onclick="submitAssignment('${assignment.assignment_id}', '${assignment.subject_id}')">
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

function submitAssignment(assignment_id, subject_id) {
  document.getElementById('assignment_id').value = assignment_id;
  document.getElementById('subject_id').value = subject_id;
  const submitAssignmentModal = new bootstrap.Modal(document.getElementById("submitAssignmentModal"))
  submitAssignmentModal.show();
}

document.getElementById('assignmentsDoc').addEventListener('change', function (event) {
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
    document.getElementById(`assignmentsDocUploadIcon`).className = 'bi bi-cloud-check fa-xl';

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
