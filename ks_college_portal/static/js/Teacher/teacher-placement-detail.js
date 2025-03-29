let csrf_token = null;
let teacher_placement_details_url = null;
let placement = null;
let teacher_name = null;
let company_id = null;

async function HandlePlacementDetail(csrf_token_param, teacher_placement_details_url_param) {
	csrf_token = csrf_token_param;
	teacher_placement_details_url = teacher_placement_details_url_param;

	const urlParams = new URLSearchParams(window.location.search);
	company_id = urlParams.get("company_id");

	await loadPlacementDetails(company_id);

}

// Function to load subject details
async function loadPlacementDetails(company_id) {
	const Params = {
		company_id: company_id
	};

	const url = `${teacher_placement_details_url}?` + toQueryString(Params);
	const [success, result] = await callApi("GET", url);
	console.log(result);
	if (success) {
		if (result.success) {
			placement = result.data;
		}
		else {
			window.location.href = "/placements/";
			return;
		}
	} else {
		window.location.href = "/placements/";
		return;
	}

	// Update page title
	document.title = `${placement.company_data.company_name} | Teacher Dashboard`

	// Update subject details
	document.getElementById("company-name").textContent = placement.company_data.company_name;
	document.getElementById("company-description").textContent = placement.company_data.description;
	document.getElementById("company-role").innerHTML = `<i class="bi bi-briefcase me-1"></i>${placement.company_data.job_role}`;
	document.getElementById("company-package").textContent = `₹${placement.company_data.estimated_package} LPA`;
	document.getElementById("internship-duration").textContent = `Internship Duration: ${placement.company_data.internship_duration} Months`;
	document.getElementById("internship-stipend").textContent = `Internship Stipend: ₹${placement.company_data.internship_stipend}`;
	document.getElementById("company-website").href = placement.company_data.website;
	document.getElementById("company-notes").textContent = placement.company_data.notes;
	document.getElementById('registered-count').textContent = placement.company_data.total_registrations;

	document.getElementById('PlacementRegisteredStudentsListTable').innerHTML = "";
	let student_index = 0
	placement.all_registered_students.forEach((registered_students) => {
		student_index += 1;
		document.getElementById('PlacementRegisteredStudentsListTable').innerHTML += `
		<tr>
			<td class="text-nowrap text-center">${student_index}</td>
			<td class="text-nowrap text-center">${registered_students.student_data.roll_no}</td>
			<td class="text-nowrap text-center">${registered_students.student_data.name}</td>
		</tr>
		`
	});

	loadAnnouncements(placement.all_company_announcements);
}

// Function to load announcements
function loadAnnouncements(placementAnnouncements) {
	const placementsAnnouncementList = document.getElementById("placementsAnnouncementList")


	if (placementAnnouncements.length === 0) {
		placementsAnnouncementList.innerHTML = '<div class="text-center py-4"><p>No announcements yet</p></div>'
		return
	}

	let html = ""
	placementAnnouncements.forEach((announcement) => {
		html += `
                <div class="card announcement-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">    
							<h5 class="card-title mb-0">${placement.company_data.teacher_name}</h5>                        
                            <span class="badge bg-primary text-white">${announcement.created_at}</span>
                        </div>
                        <p class="card-text">${announcement.announcement_content}</p>                                                
                    </div>
                </div>
            `
	})

	placementsAnnouncementList.innerHTML = html

}

document.getElementById("add_company_announcement_form").addEventListener("submit", async (event) => {
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
		announcement_content: document.getElementById('announcement_content').value,
		company_id: company_id

	}
	const url = teacher_placement_details_url;
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
