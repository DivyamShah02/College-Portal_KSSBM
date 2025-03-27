let csrf_token = null;
let teacher_subject_announcements_url = null;
let teacher_subject_announcements_comments_url = null;
let teacher_subject_url = null;
let announcementSelectedFiles = [];
let announcements = null;

async function HandleAnnouncementsDetail(csrf_token_param,  teacher_subject_announcements_url_param, teacher_subject_announcements_comments_url_param, teacher_subject_url_param) {
	csrf_token = csrf_token_param;	
	teacher_subject_announcements_url = teacher_subject_announcements_url_param;
	teacher_subject_announcements_comments_url = teacher_subject_announcements_comments_url_param;
  teacher_subject_url = teacher_subject_url_param;

	await GetAnnoumcements();

  // Add event listeners for filters
  const subjectFilter = document.getElementById("subjectFilter")
  const searchAnnouncement = document.getElementById("searchAnnouncement")

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterAnnouncements)
  }


  if (searchAnnouncement) {
    searchAnnouncement.addEventListener("input", filterAnnouncements)
  }

}

async function GetAnnoumcements() {

	const url = `${teacher_subject_announcements_url}?`;
	const [success, result] = await callApi("GET", url);
	console.log(result);
	if (success) {
		if (result.success) {
			announcements = result.data.all_announcements;
      loadAnnouncements(announcements);
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


function loadAnnouncements(subjectAnnouncements) {
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
					doc_html += `<button class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="openDocModal('/media/${doc_path}', '${String(doc).replace('uploads\\', '')}')">
            <i class="bi bi-file-earmark me-2"></i>${String(doc).replace('uploads\\', '')}
          </button>`
				});
			}
			html += `
                <div class="card announcement-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${announcement.subject_name}</h5>
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
	 // Simulate loading delay
}

async function loadSubjects() {
  const subjectsList = document.getElementById("subjectFilter");
  const subject_id_select = document.getElementById("subject_id_select");
  subjectsList.innerHTML = '';
  subject_id_select.innerHTML = '';

  if (!subjectsList) return

  const url = teacher_subject_url;
  const [success, result] = await callApi("GET", url);

  if (success) {
    if (result.success) {
      let options_html = '<option value="">All Subjects</option>';

      result.data.all_subjects.forEach((subject) => {
        options_html += `<option value="${subject.subject_id}">${subject.subject_name}</option>`
      });

      subjectsList.innerHTML = options_html;
      subject_id_select.innerHTML = options_html;

    }
    else {
    }
  } else {
  }
}

// Function to filter announcements
function filterAnnouncements() {
  toggle_loader();
  const subjectFilter = document.getElementById("subjectFilter").value
  const searchFilter = document.getElementById("searchAnnouncement").value.toLowerCase()

  const filteredAnnouncements = announcements.filter((announcement) => {
    // Filter by subject
    if (subjectFilter && announcement.subject_id != subjectFilter) {
      return false
    }

    // Filter by search term
    if (
      searchFilter &&
      !announcement.subject_name.toLowerCase().includes(searchFilter) &&
      !announcement.text_content.toLowerCase().includes(searchFilter)
    ) {
      
      return false
    }

    return true
  })
  loadAnnouncements(filteredAnnouncements)
  toggle_loader();
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
	formData.append(`subject_id`, document.getElementById('subject_id_select').value);

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

function openDocModal(doc_path, doc_name) {
	displayDocument(doc_path);
	document.getElementById('viewDocumentModalLabel').innerText = doc_name;
	const myModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
	myModal.show();
}
