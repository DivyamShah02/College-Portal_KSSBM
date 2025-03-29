let csrf_token = null;
let student_placement_details_url = null;
let placement = null;
let student_name = null;
let company_id = null;

async function HandlePlacementDetail(csrf_token_param, student_placement_details_url_param) {
	csrf_token = csrf_token_param;
	student_placement_details_url = student_placement_details_url_param;

	const urlParams = new URLSearchParams(window.location.search);
	company_id = urlParams.get("company_id");

	await loadPlacementDetails(company_id);

}

// Function to load subject details
async function loadPlacementDetails(company_id) {
	const Params = {
		company_id: company_id
	};

	const url = `${student_placement_details_url}?` + toQueryString(Params);
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
	document.title = `${placement.company_data.company_name} | Student Dashboard`

	// Update subject details
	document.getElementById("company-name").textContent = placement.company_data.company_name;
	document.getElementById("company-description").textContent = placement.company_data.description;
	document.getElementById("company-role").innerHTML = `<i class="bi bi-briefcase me-1"></i>${placement.company_data.job_role}`;
	document.getElementById("company-package").textContent = `₹${placement.company_data.estimated_package} LPA`;
	document.getElementById("internship-duration").textContent = `Internship Duration: ${placement.company_data.internship_duration} Months`;
	document.getElementById("internship-stipend").textContent = `Internship Stipend: ₹${placement.company_data.internship_stipend}`;
	document.getElementById("company-website").href = placement.company_data.website;
	document.getElementById("company-notes").textContent = placement.company_data.notes;


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
