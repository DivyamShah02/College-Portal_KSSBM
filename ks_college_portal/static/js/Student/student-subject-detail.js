let csrf_token = null;
let student_subject_details_url = null;
let student_subject_announcements_url = null;
let student_subject_announcements_comments_url = null;
let student_subject_assignments_url = null;
let student_subject_attendance_url = null;
let subjectId = null;
let student_counts = null;
let announcementSelectedFiles = [];
let assignmentSelectedFiles = [];
let subject = null;

async function HandleSubjectDetail(csrf_token_param, student_subject_details_url_param, student_subject_announcements_url_param, student_subject_announcements_comments_url_param, student_subject_assignments_url_param, student_subject_attendance_url_param) {
	csrf_token = csrf_token_param;
	student_subject_details_url = student_subject_details_url_param;
	student_subject_announcements_url = student_subject_announcements_url_param;
	student_subject_announcements_comments_url = student_subject_announcements_comments_url_param;
	student_subject_assignments_url = student_subject_assignments_url_param;
	student_subject_attendance_url = student_subject_attendance_url_param;

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

					doc_html += `<a href="/media/${doc}" class="btn btn-sm btn-outline-primary me-2 mb-2">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('uploads\\', '')}
          </a>`
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
					doc_html += `<a href="/media/${doc}" class="btn btn-sm btn-outline-primary me-2 mb-2">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('uploads\\', '')}
          </a>`
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
						<span class="text-muted">${assignment.all_submits.length} / ${student_counts} submissions</span>   
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
