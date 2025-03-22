let csrf_token = null;
let teacher_subject_announcements_url = null;
let teacher_subject_announcements_comments_url = null;
let subjectId = null;

async function HandleSubjectDetail(csrf_token_param, teacher_subject_announcements_url_param, teacher_subject_announcements_comments_url_param) {
	csrf_token = csrf_token_param;
	teacher_subject_announcements_url = teacher_subject_announcements_url_param;
	teacher_subject_announcements_comments_url = teacher_subject_announcements_comments_url_param;

	// Get subject ID from URL
	const urlParams = new URLSearchParams(window.location.search);
	subjectId = urlParams.get("subject_id");

	if (!subjectId) {
		window.location.href = "/subjects/";
		console.log('erabgyuobboawgreuy');
		return;
	}

	// Load subject details
	await loadSubjectDetails(subjectId);

}

let subject = null;

// Mock data for subjects
const subjects = [
	{
		id: 1,
		name: "Data Structures and Algorithms",
		year: 2,
		division: "A",
		students: 42,
		description:
			"Study of fundamental data structures, algorithms, and their applications. This course covers arrays, linked lists, stacks, queues, trees, graphs, sorting algorithms, and searching algorithms. Students will learn to analyze algorithm efficiency and implement various data structures.",
		image: "/placeholder.svg?height=200&width=200",
		announcements: 5,
		assignments: 3,
		attendanceSessions: 8,
	},
	{
		id: 2,
		name: "Web Development",
		year: 3,
		division: "B",
		students: 38,
		description:
			"Introduction to web technologies including HTML, CSS, JavaScript, and modern frameworks. Students will learn to build responsive and interactive web applications using current industry standards and best practices.",
		image: "/placeholder.svg?height=200&width=200",
		announcements: 7,
		assignments: 4,
		attendanceSessions: 10,
	},
	{
		id: 3,
		name: "Database Management Systems",
		year: 2,
		division: "C",
		students: 45,
		description:
			"Fundamentals of database design, SQL, and database management systems. This course covers relational database concepts, normalization, query optimization, transaction management, and database security.",
		image: "/placeholder.svg?height=200&width=200",
		announcements: 4,
		assignments: 2,
		attendanceSessions: 6,
	},
	{
		id: 4,
		name: "Artificial Intelligence",
		year: 4,
		division: "A",
		students: 31,
		description:
			"Introduction to AI concepts, machine learning, and neural networks. Students will explore problem-solving methods, knowledge representation, reasoning, planning, and machine learning algorithms.",
		image: "/placeholder.svg?height=200&width=200",
		announcements: 6,
		assignments: 5,
		attendanceSessions: 9,
	},
]

// Mock data for announcements
const announcements = [
	{
		id: 1,
		subjectId: 1,
		title: "Mid-term Exam Schedule",
		content:
			"The mid-term exam for Data Structures will be held on March 25th, 2023. The exam will cover all topics discussed up to Week 6. Please prepare accordingly and bring your ID cards.",
		date: "2023-03-10",
		attachment: null,
	},
	{
		id: 2,
		subjectId: 1,
		title: "Guest Lecture on Advanced Algorithms",
		content:
			'We will have a guest lecture by Dr. Robert Chen from Stanford University on "Advanced Algorithms in Industry" on March 18th, 2023. Attendance is mandatory for all students.',
		date: "2023-03-12",
		attachment: "guest_lecture_details.pdf",
	},
	{
		id: 3,
		subjectId: 1,
		title: "Lab Session Rescheduled",
		content:
			"The lab session scheduled for March 15th has been rescheduled to March 17th due to maintenance work in the computer lab. Same time and same lab number.",
		date: "2023-03-14",
		attachment: null,
	},
]

// Mock data for assignments
const assignments = [
	{
		id: 1,
		subjectId: 1,
		title: "Implementation of Sorting Algorithms",
		description:
			"Implement the following sorting algorithms in a language of your choice: Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, and Quick Sort. Compare their performance with different input sizes.",
		dueDate: "2023-03-25",
		dueTime: "23:59",
		attachment: "sorting_algorithms_assignment.pdf",
		submissions: 28,
	},
	{
		id: 2,
		subjectId: 1,
		title: "Binary Search Tree Operations",
		description:
			"Implement a Binary Search Tree with the following operations: insert, delete, search, traversal (in-order, pre-order, post-order). Write test cases to verify your implementation.",
		dueDate: "2023-04-05",
		dueTime: "23:59",
		attachment: "bst_assignment.pdf",
		submissions: 15,
	},
]

// Mock data for attendance
const attendance = [
	{
		id: 1,
		subjectId: 1,
		title: "Lecture - Introduction to Trees",
		date: "2023-03-10",
		time: "10:00",
		code: "123456",
		duration: 30,
		status: "Completed",
		present: 38,
		total: 42,
	},
	{
		id: 2,
		subjectId: 1,
		title: "Lab Session - Implementing Binary Trees",
		date: "2023-03-12",
		time: "14:00",
		code: "789012",
		duration: 45,
		status: "Completed",
		present: 40,
		total: 42,
	},
	{
		id: 3,
		subjectId: 1,
		title: "Lecture - Graph Algorithms",
		date: "2023-03-15",
		time: "10:00",
		code: "345678",
		duration: 30,
		status: "Completed",
		present: 36,
		total: 42,
	},
]

// Mock data for students
const students = [
	{
		id: "S2001",
		name: "John Smith",
		year: 2,
		division: "A",
		email: "john.smith@college.edu",
	},
	{
		id: "S2002",
		name: "Emily Johnson",
		year: 2,
		division: "A",
		email: "emily.johnson@college.edu",
	},
	{
		id: "S2003",
		name: "Michael Brown",
		year: 2,
		division: "A",
		email: "michael.brown@college.edu",
	},
	{
		id: "S2004",
		name: "Jessica Davis",
		year: 2,
		division: "A",
		email: "jessica.davis@college.edu",
	},
	{
		id: "S2005",
		name: "David Wilson",
		year: 2,
		division: "A",
		email: "david.wilson@college.edu",
	},
]

// Function to load subject details
async function loadSubjectDetails(subjectId) {
	const Params = {
		subject_id: subjectId
	};

	const url = `${teacher_subject_announcements_url}?` + toQueryString(Params);
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

	// Update subject details
	document.getElementById("subjectTitle").textContent = subject.subject_data.subject_name
	// document.getElementById("subjectDescriptionText").textContent = subject.subject_data.description
	document.getElementById("studentsEnrolled").textContent = subject.subject_data.student_counts
	document.getElementById("announcementsCount").textContent = subject.total_announcements
	document.getElementById("assignmentsCount").textContent = subject.total_announcements
	document.getElementById("attendanceSessions").textContent = subject.total_announcements
	// document.getElementById("subjectImage").src = subject.image

	// Update subject badges
	const subjectBadges = document.getElementById("subjectBadges")
	subjectBadges.innerHTML = `
        <span class="badge bg-info">${subject.subject_data.college_year}</span>
        <span class="badge bg-secondary">Division ${subject.subject_data.class_division}</span>
    `

	loadAnnouncements(subject.all_announcements);
	// loadAssignments(subjectId);
	// loadAttendance(subjectId);

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
function loadAssignments(subjectId) {
	const assignmentsList = document.getElementById("assignmentsList")

	// Filter assignments by subject ID
	const subjectAssignments = assignments.filter((a) => a.subjectId == subjectId)

	setTimeout(() => {
		if (subjectAssignments.length === 0) {
			assignmentsList.innerHTML = '<div class="text-center py-4"><p>No assignments yet</p></div>'
			return
		}

		let html = ""
		subjectAssignments.forEach((assignment) => {
			const dueDateTime = new Date(`${assignment.dueDate}T${assignment.dueTime}`)
			const isOverdue = dueDateTime < new Date()

			html += `
                <div class="card assignment-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${assignment.title}</h5>
                            <span class="badge ${isOverdue ? "bg-danger" : "bg-warning"} text-white">
                                Due: ${new Date(assignment.dueDate).toLocaleDateString()} at ${assignment.dueTime}
                            </span>
                        </div>
                        <p class="card-text">${assignment.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            ${assignment.attachment
					? `
                                <a href="#" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-file-earmark me-2"></i>${assignment.attachment}
                                </a>
                            `
					: "<span></span>"
				}
                            <span class="text-muted">${assignment.submissions} / ${subjects.find((s) => s.id == subjectId).students} submissions</span>
                        </div>
                    </div>
                </div>
            `
		})

		assignmentsList.innerHTML = html
	}, 1000) // Simulate loading delay
}

// Function to load attendance
function loadAttendance(subjectId) {
	const attendanceList = document.getElementById("attendanceList")

	// Filter attendance by subject ID
	const subjectAttendance = attendance.filter((a) => a.subjectId == subjectId)

	setTimeout(() => {
		if (subjectAttendance.length === 0) {
			attendanceList.innerHTML = '<div class="text-center py-4"><p>No attendance sessions yet</p></div>'
			return
		}

		let html = ""
		subjectAttendance.forEach((session) => {
			const attendanceDate = new Date(`${session.date}T${session.time}`)
			const attendancePercentage = Math.round((session.present / session.total) * 100)

			html += `
                <div class="card attendance-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${session.title}</h5>
                            <span class="badge bg-${session.status === "Completed" ? "success" : "primary"} text-white">
                                ${session.status}
                            </span>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-calendar text-primary me-2"></i>
                                    <div>
                                        <small class="text-muted d-block">Date & Time</small>
                                        <span>${attendanceDate.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-people text-success me-2"></i>
                                    <div>
                                        <small class="text-muted d-block">Attendance</small>
                                        <span>${session.present} / ${session.total} (${attendancePercentage}%)</span>
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

// Function to load students list
function loadStudentsList() {
	const studentsListTable = document.getElementById("studentsListTable")

	if (!studentsListTable) return

	let html = ""
	students.forEach((student) => {
		html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Year ${student.year}</td>
                <td>Division ${student.division}</td>
                <td>${student.email}</td>
            </tr>
        `
	})

	studentsListTable.innerHTML = html
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


let selectedFiles = [];

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
		document.getElementById('upload_input_text').style.display = 'none';
		document.getElementById('upload_input_file_text').style.display = '';
		document.getElementById('upload_input_file_text').innerText = file.name + ", " + document.getElementById('upload_input_file_text').innerText;
		document.getElementById('announcementDocUploadIcon').className = 'bi bi-cloud-check fa-xl';
		selectedFiles.push(file);
	}
	console.log("Selected files:", selectedFiles);
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

	selectedFiles.forEach((file, index) => {
		formData.append(`files[${index}]`, file);
	});

	// formData.append(`files`, selectedFiles);
	formData.append(`text_content`, document.getElementById('text_content').value);
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
