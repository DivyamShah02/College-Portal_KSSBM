let csrf_token = null;
let teacher_subject_details_url = null;
let teacher_subject_announcements_url = null;
let teacher_subject_announcements_comments_url = null;
let teacher_subject_assignments_url = null;
let teacher_subject_attendance_url = null;
let teacher_all_assignment_url = null;
let teacher_subject_submit_assignments_url = null;
let subjectId = null;
let student_counts = null;
let announcementSelectedFiles = [];
let assignmentSelectedFiles = [];
let subject = null;

async function HandleSubjectDetail(csrf_token_param, teacher_subject_details_url_param, teacher_subject_announcements_url_param, teacher_subject_announcements_comments_url_param, teacher_subject_assignments_url_param, teacher_subject_attendance_url_param, teacher_all_assignment_url_param, teacher_subject_submit_assignments_url_param) {
	csrf_token = csrf_token_param;
	teacher_subject_details_url = teacher_subject_details_url_param;
	teacher_subject_announcements_url = teacher_subject_announcements_url_param;
	teacher_subject_announcements_comments_url = teacher_subject_announcements_comments_url_param;
	teacher_subject_assignments_url = teacher_subject_assignments_url_param;
	teacher_subject_attendance_url = teacher_subject_attendance_url_param;
	teacher_all_assignment_url = teacher_all_assignment_url_param;
	teacher_subject_submit_assignments_url = teacher_subject_submit_assignments_url_param;

	const urlParams = new URLSearchParams(window.location.search);
	subjectId = urlParams.get("subject_id");

	if (!subjectId) {
		window.location.href = "/subjects/";
		console.log('erabgyuobboawgreuy');
		return;
	}

	await loadSubjectDetails(subjectId);

}

// Function to load subject details
async function loadSubjectDetails(subjectId) {
	const Params = {
		subject_id: subjectId
	};

	const url = `${teacher_subject_details_url}?` + toQueryString(Params);
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
	document.getElementById("studentsEnrolled").textContent = subject.subject_data.student_counts
	document.getElementById("announcementsCount").textContent = subject.total_announcements
	document.getElementById("assignmentsCount").textContent = subject.total_assignments
	document.getElementById("attendanceSessions").textContent = subject.total_attendances
	// document.getElementById("subjectImage").src = subject.image

	// Update subject badges
	const subjectBadges = document.getElementById("subjectBadges")
	subjectBadges.innerHTML = `
        <span class="badge bg-info">${subject.subject_data.college_year}</span>
        <span class="badge bg-secondary">Division ${subject.subject_data.class_division}</span>
    `

	loadAnnouncements(subject.all_announcements);
	loadAssignments(subject.all_assignments);
	loadAttendance(subject.all_attendance);

	// Load students list
	// loadStudentsList()
}

// Function to load announcements
function loadAnnouncements(subjectAnnouncements) {
	const announcementsList = document.getElementById("announcementsList")

	setTimeout(() => {
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

					doc_html += `<button href="/media/${doc}" class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('${doc}', '${String(doc).replace('students_assignments\\', '')}')">
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
	}, 1000) // Simulate loading delay
}

// Function to load assignments
function loadAssignments(subjectAssignments) {
	setTimeout(() => {
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
					doc_html += `<button href="/media/${doc}" class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('${doc}', '${String(doc).replace('students_assignments\\', '')}')">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('uploads\\', '')}
          </button>`
				});
			}

			const dueDateTime = new Date(`${assignment.deadline_date}`)
			const isOverdue = dueDateTime < new Date()

			// <h5 class="card-title mb-0">${assignment.title}</h5>

			html += `
                <div class="card assignment-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge ${isOverdue ? "bg-danger" : "bg-warning"} text-white">
                                Due: ${new Date(assignment.deadline_date).toLocaleDateString()} at ${new Date(assignment.deadline_date).toLocaleTimeString()}
                            </span>
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
						<div class="d-flex justify-content-between align-items-center mt-3">
							<span class="text-muted">${assignment.total_assignment_submitted} / ${student_counts} submissions</span>
							<button class="btn btn-sm btn-primary" onclick="view_submitted_students_assignment('${assignment.assignment_id}')">
								<i class="bi bi-eye me-2"></i>View Submissions
							</button>
						</div>
                    </div>
                </div>
            `
		})

		assignmentsList.innerHTML = html
	}, 1000) // Simulate loading delay
}

// Function to load attendance
function loadAttendance(subjectAttendance) {
	setTimeout(() => {
		if (subjectAttendance.length === 0) {
			attendanceList.innerHTML = '<div class="text-center py-4"><p>No attendance sessions yet</p></div>'
			return
		}

		let html = ""
		subjectAttendance.forEach((session) => {
			const attendanceDate = new Date(`${session.created_at}`)
			const attendancePercentage = Math.round((session.attendance_data.length / student_counts) * 100)
			const now = new Date()
			let attendanceEndDate = attendanceDate
			attendanceEndDate.setHours(attendanceDate.getHours() + 1);
			let attendance_completed = "In Progress";

			if (attendanceEndDate <= now) {
				attendance_completed = "Completed";
			}

			html += `
                <div class="card attendance-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="card-title mb-0">${attendanceDate.toLocaleString()}</h6>
                            <span class="badge bg-${attendance_completed === "Completed" ? "success" : "primary"} text-white">
                                ${attendance_completed}
                            </span>
                        </div>
                        <div class="row g-3">
							<div class="col-6">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-calendar text-primary me-2"></i>
                                    <div>
                                        <small class="text-muted d-block">Unique Code</small>
                                        <span>${session.code}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-people text-success me-2"></i>
                                    <div>
                                        <small class="text-muted d-block">Attendance</small>
                                        <span>${session.attendance_data.length} / ${student_counts} (${attendancePercentage}%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <div class="progress" style="height: 10px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${attendancePercentage}%;" aria-valuenow="${attendancePercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-eye me-2"></i>View Details
                            </button>
                        </div>
                    </div>
                </div>
            `
		})

		attendanceList.innerHTML = html
	}, 1000) // Simulate loading delay
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

		const url = teacher_subject_announcements_comments_url;
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

document.getElementById('announcementDoc_announcement').addEventListener('change', function (event) {
	handleFiles(event.target.files, "announcement");
});

document.getElementById('announcementDoc_assignment').addEventListener('change', function (event) {
	handleFiles(event.target.files, "assignment");
});

function handleFiles(files, action_name) {
	const allowedExtensions = ['mp3', 'wav', 'ogg', 'mp4', 'webm', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'docx'];

	for (let file of files) {
		const fileExtension = file.name.split('.').pop().toLowerCase();

		if (!allowedExtensions.includes(fileExtension)) {
			alert(`Unsupported file type: ${file.name}`);
			continue;
		}
		document.getElementById(`upload_input_text_${action_name}`).style.display = 'none';
		document.getElementById(`upload_input_file_text_${action_name}`).style.display = '';
		document.getElementById(`upload_input_file_text_${action_name}`).innerText = file.name + ", " + document.getElementById(`upload_input_file_text_${action_name}`).innerText;
		document.getElementById(`announcementDocUploadIcon_${action_name}`).className = 'bi bi-cloud-check fa-xl';
		if (action_name == "announcement") {
			announcementSelectedFiles.push(file);
		}
		else if (action_name == "assignment") {
			assignmentSelectedFiles.push(file);
		}
	}
}

document.getElementById("add_announcement_form").addEventListener("submit", async (event) => {
	const form = event.target;

	// Prevent the form from submitting
	event.preventDefault();

	// Check form validity
	if (!form.checkValidity()) {
		// Trigger the browser's built-in validation tooltips
		form.reportValidity();
		return;
	}
	const formData = new FormData();

	announcementSelectedFiles.forEach((file, index) => {
		formData.append(`files[${index}]`, file);
	});

	// formData.append(`files`, selectedFiles);
	formData.append(`text_content`, document.getElementById('text_content_announcement').value);
	formData.append(`subject_id`, subjectId);

	const url = teacher_subject_announcements_url;
	const [success, result] = await callApi("POST", url, formData, csrf_token, true);

	console.log(result);
	if (success) {
		if (result.success) {
			location.reload();
		}
	}

	window.scrollTo({
		top: 0, // Set the scroll position to the top
		behavior: 'smooth' // Optional: Adds smooth scrolling
	});


});

document.getElementById("add_assignment_form").addEventListener("submit", async (event) => {
	const form = event.target;

	// Prevent the form from submitting
	event.preventDefault();

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
	formData.append(`text_content`, document.getElementById('text_content_assignment').value);
	formData.append(`subject_id`, subjectId);

	const deadlineDate = dateInput.value
	const deadlineTime = timeInput.value
	// const deadline = new Date(`${deadlineDate}T${deadlineTime}`)
	const deadline = `${deadlineDate} ${deadlineTime}`
	formData.append(`deadline_date`, deadline);

	const url = teacher_subject_assignments_url;
	const [success, result] = await callApi("POST", url, formData, csrf_token, true);

	console.log(result);
	if (success) {
		if (result.success) {
			location.reload();
		}
	}

	window.scrollTo({
		top: 0, // Set the scroll position to the top
		behavior: 'smooth' // Optional: Adds smooth scrolling
	});


});

const dateInput = document.getElementById("assignment_deadline_date")
const timeInput = document.getElementById("assignment_deadline_time")

const setDefaultDeadline = () => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)

	if (dateInput) {
		// Format date as YYYY-MM-DD for the input
		const year = tomorrow.getFullYear()
		const month = String(tomorrow.getMonth() + 1).padStart(2, "0")
		const day = String(tomorrow.getDate()).padStart(2, "0")
		dateInput.value = `${year}-${month}-${day}`
	}

	if (timeInput) {
		timeInput.value = "23:59"
	}
}

setDefaultDeadline()

function validateDeadline() {
	const selectedDate = dateInput.value
	const selectedTime = timeInput.value

	if (!selectedDate || !selectedTime) return true // Skip validation if fields are empty

	const now = new Date()
	const deadlineDate = new Date(`${selectedDate}T${selectedTime}`)

	// Check if the deadline is in the past
	if (deadlineDate <= now) {
		// Show error message
		const errorElement = document.createElement("div")
		errorElement.className = "invalid-feedback"
		errorElement.textContent = "Deadline must be in the future"
		errorElement.id = "deadline-error"

		// Remove any existing error message first
		const existingError = document.getElementById("deadline-error")
		if (existingError) existingError.remove()

		// Add error styling
		dateInput.classList.add("is-invalid")
		timeInput.classList.add("is-invalid")

		// Append error message after the time input
		timeInput.parentNode.appendChild(errorElement)

		document.getElementById('submit_new_assignment_btn').disabled = true;

		return false
	} else {
		// Remove error styling if validation passes
		dateInput.classList.remove("is-invalid")
		timeInput.classList.remove("is-invalid")

		// Remove any existing error message
		const existingError = document.getElementById("deadline-error")
		if (existingError) existingError.remove()

		document.getElementById('submit_new_assignment_btn').disabled = false;


		return true
	}
}

if (dateInput && timeInput) {
	dateInput.addEventListener("change", validateDeadline)
	timeInput.addEventListener("change", validateDeadline)
}

async function createAttendance() {
	let bodyData = {
		subject_id: subjectId
	}
	const url = teacher_subject_attendance_url;
	const [success, result] = await callApi("POST", url, bodyData, csrf_token);
	if (success) {
		console.log("Result:", result);

		if (result.success) {
			console.log(result.data.unique_code);
			const modal = bootstrap.Modal.getInstance(document.getElementById("createAttendanceModal"))
			modal.hide()

			document.getElementById('unique_code').innerText = String(result.data.unique_code);
			startAttendanceTimer(60 * 60);
			const attendanceCodeModal = new bootstrap.Modal(document.getElementById("createdAttendanceModal"))
			attendanceCodeModal.show();
		}

		else {
		}

	} else {

	}

}

function startAttendanceTimer(duration) {
	let timer = duration
	const timerElement = document.getElementById("codeTimer")

	if (!timerElement) return

	const interval = setInterval(() => {
		const minutes = Math.floor(timer / 60)
		const seconds = timer % 60

		timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

		if (--timer < 0) {
			clearInterval(interval)
			timerElement.textContent = "Expired"
		}
	}, 1000)
}


async function view_submitted_students_assignment(assignment_id) {
	const AssignmentStudentsListModal = new bootstrap.Modal(document.getElementById("AssignmentStudentsListModal"));
	AssignmentStudentsListModal.show();
	const container = document.getElementById('AssignmentStudentsListTable');
	container.innerHTML = ''
	container.innerHTML = '<div class="col-12 text-center py-5"><h5>Loading...</h5></div>';
	await get_submitted_assignment_assignment(assignment_id);

}

async function get_submitted_assignment_assignment(assignment_id) {
	const Params = {
		assignment_id: assignment_id
	};

	const url = `${teacher_all_assignment_url}?` + toQueryString(Params);
	const [success, result] = await callApi("GET", url);
	console.log(result);
	if (success) {
		if (result.success) {
			console.log(result.data);
			loadAssignmentStudentsList(result.data.all_assignments_submitted, assignment_id);

		}
		else {

			return;
		}
	} else {

		return;
	}
}

// Function to load students list
function loadAssignmentStudentsList(AssignmentStudent, assignment_id) {
	const AssignmentStudentsListTable = document.getElementById("AssignmentStudentsListTable")

	if (!AssignmentStudentsListTable) return

	let html = ""
	AssignmentStudent.forEach((student) => {
		html += `
            <tr>
                <td class="text-nowrap text-center">${student.student_roll_no}</td>
                <td class="text-nowrap text-center">${student.student_name}</td>
                <td class="text-nowrap text-center">${student.assignment_submitted ? '<i class="bi bi-check2"></i>' : '<i class="bi bi-x"></i>'}</td>
                <td class="text-nowrap text-center">
				${student.assignment_submitted ? `<button class="btn btn-sm btn-primary" onclick="view_submitted_assignment('${student.student_id}', '${assignment_id}', '${student.student_name}')">
						<i class="bi bi-eye bi-xl me-2"></i>View Assignment
					</button>` : `<b class="text-danger">Not Submitted</b>`}
				</td>
            </tr>
        `
	})

	AssignmentStudentsListTable.innerHTML = html
}

async function view_submitted_assignment(student_id, assignment_id, student_name) {
	document.getElementById('submittedAssignmentModalLabel').innerText = `${student_name}'s Assignment`
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

	const url = `${teacher_subject_submit_assignments_url}?` + toQueryString(Params);
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
		doc_html += `<div class="d-flex align-items-center py-3 px-2 mb-2 document-card"
							  onclick="openDocModal('${doc}', '${String(doc).replace('students_assignments\\', '')}')">
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
