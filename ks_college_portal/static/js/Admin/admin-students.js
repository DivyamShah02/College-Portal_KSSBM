let csrf_token = null;
let admin_students_unique_classes_url = null;
let admin_students_url = null;
let admin_students_detail_url = null;
let student_subject_submit_assignments_url = null;
let students = null;

async function AdminStudents(csrf_token_param, admin_students_unique_classes_url_param, admin_students_url_param, admin_students_detail_url_param, student_subject_submit_assignments_url_param) {
  csrf_token = csrf_token_param;
  admin_students_unique_classes_url = admin_students_unique_classes_url_param;
  admin_students_url = admin_students_url_param;
  admin_students_detail_url = admin_students_detail_url_param;
  student_subject_submit_assignments_url = student_subject_submit_assignments_url_param;


  await getClassInfo();

  const searchStudent = document.getElementById("searchStudent")
  if (searchStudent) {
    searchStudent.addEventListener("input", filterStudents)
  }

}


let subjects = []

async function getClassInfo() {
  const url = admin_students_unique_classes_url;
  const [success, result] = await callApi("GET", url);
  if (success) {
    if (result.success) {
      HandleUniqueClasses(result.data.unique_class);
    }
    else {
      // window.location = '/dashboard/';
    }
  } else {
    // window.location = '/dashboard/';
  }
}

function HandleUniqueClasses(uniqueClass) {
  let yearFilter = document.getElementById("yearFilter");
  let divisionFilter = document.getElementById("divisionFilter");

  // Mapping for formatted year names and sorting order
  let yearMapping = {
    "first_year": "First Year",
    "second_year": "Second Year",
    "third_year": "Third Year",
    "fourth_year": "Fourth Year",
    "fifth_year": "Fifth Year"
  };

  let yearOrder = ["first_year", "second_year", "third_year", "fourth_year", "fifth_year"];

  // Extract unique years and sort them based on predefined order
  let years = [...new Set(uniqueClass.map(item => item[0]))].sort((a, b) => yearOrder.indexOf(a) - yearOrder.indexOf(b));

  // Populate Year Select Options
  years.forEach(year => {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = yearMapping[year] || year.replace("_", " ");
    yearFilter.appendChild(option);
  });

  // Automatically select the first year
  if (years.length > 0) {
    yearFilter.value = years[0]; //TODO
  }

  // Function to populate Division Select based on selected year
  function updateDivisions(selectedYear) {
    divisionFilter.innerHTML = '<option value="">All Divisions</option>'; // Reset divisions

    if (selectedYear) {
      let divisions = uniqueClass
        .filter(item => item[0] === selectedYear) // Get divisions for selected year
        .map(item => item[1]);

      // Remove duplicates and sort divisions alphabetically
      divisions = [...new Set(divisions)].sort();

      // Populate Division Select
      divisions.forEach(division => {
        let option = document.createElement("option");
        option.value = division;
        option.textContent = division;
        divisionFilter.appendChild(option);
      });

      if (divisions.length > 0) {
        divisionFilter.value = divisions[0];
        loadStudents(selectedYear, divisions[0]); // Call function with default values
    }
    }
  }

  // Event listener for Year Select
  yearFilter.addEventListener("change", function () {
    updateDivisions(this.value);
  });

  divisionFilter.addEventListener("change", function () {
    let selectedYear = yearFilter.value;
    let selectedDivision = this.value;

    if (selectedYear && selectedDivision) {
      loadStudents(selectedYear, selectedDivision);
    }


  });

  updateDivisions(yearFilter.value);
  
  divisionFilter.selectedIndex = 1;
  loadStudents(years[0], divisionFilter.options[1].textContent);
}

async function loadStudents(college_year, division) {
  const Params = {
    college_year: college_year,
    class_division: division,
  };

  const url = `${admin_students_url}?` + toQueryString(Params);
  const [success, result] = await callApi("GET", url);
  if (success) {
    if (result.success) {
      renderStudentsList(result.data.all_students, college_year, division);
      students = result.data.all_students;
    }
    else {
    }
  } else {
  }
}

function renderStudentsList(students, college_year, division) {
  const studentsTableCard = document.getElementById("studentsTableCard");
  const studentsTableElement = document.getElementById('studentsTableElement');
  const studentNotFound = document.getElementById('studentNotFound')

  studentsTableElement.style.display = '';
  studentNotFound.style.display = 'none';
  
  const studentsTable = document.getElementById("studentsTable");
  if (!studentsTable) return

  if (students.length === 0) {    
    studentNotFound.style.display = '';
    studentsTableElement.style.display = 'none';
    return
  }
  let html = ""
  let index = 0
  let modified_college_year = String(college_year).replace(/_/g, ' ') // Replace underscores with spaces
              .split(' ')         // Split into words
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
              .join(' '); 
  students.forEach((student) => {
    index += 1;
    html += `
            <tr>
                <td class="text-nowrap">${index}</td>
                <td class="text-nowrap">${student.student_roll_no}</td>
                <td class="text-nowrap">${student.student_name}</td>
                <td class="text-nowrap">${student.student_mail}</td>
                <td class="text-nowrap"><span class="badge bg-info">${modified_college_year}</span></td>
                <td class="text-nowrap"><span class="badge bg-secondary">Division ${division}</span></td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-outline-info" title="View Profile" onclick="handleStudentDetail('${student.student_id}')">
                        <i class="bi bi-eye"></i> Student Details
                    </button>                                            
                </td>
            </tr>
        `
  })

  studentsTable.innerHTML = html
}

function filterStudents() {
  const searchFilter = document.getElementById("searchStudent").value.toLowerCase()

  const filteredStudents = students.filter((student) => {

    // Filter by search term
    if (searchFilter && !student.student_name.toLowerCase().includes(searchFilter)) {
      return false
    }

    return true
  })

  
  renderStudentsList(filteredStudents, document.getElementById('yearFilter').value, document.getElementById('divisionFilter').value);
}

async function handleStudentDetail(student_id) {
  await loadStudentDetails(student_id);
  
}

async function loadStudentDetails(student_id) {
  const Params = {
    student_id: student_id
  };

  const url = `${admin_students_detail_url}?` + toQueryString(Params);
  const [success, result] = await callApi("GET", url);
  if (success) {
    if (result.success) {
      console.log(result.data);

      // Handle student data
      let student_data = result.data.student_data;
      document.getElementById('studentDetailModalLabel').innerText = `${student_data.name}'s Acedemic Data`
      document.getElementById("fullName").innerText = student_data.name;
      document.getElementById("email").innerText = student_data.email;
      document.getElementById("mobile").innerText = student_data.contact_number;
      document.getElementById("year").innerText = String(student_data.year).replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      document.getElementById("division").innerText = student_data.division;

      

      // document.getElementById("attendance_percentage").innerText = `${result.data.total_attendance_percentage}%`;

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
      
      loadAssignments(result.data.pending_assignment, 'pending-assignmentsList', student_id);
      loadAssignments(result.data.submitted_assignment, 'completed-assignmentsList', student_id);
      loadAssignments(result.data.missed_assignment, 'missed-assignmentsList', student_id);

      const studentDetailModal = new bootstrap.Modal(document.getElementById("studentDetailModal"))
      studentDetailModal.show()
      // renderStudentsList(result.data.all_students, college_year, division);
      // students = result.data.all_students;
    }
    else {
    }
  } else {
  }
}


function loadAssignments(subjectAssignments, assignmentsList_id, student_id) {
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
    let card_border_color = 'warning';

    if (assignment.assignment_submitted) {
      badge = `<span class="badge bg-success text-white">
                    Submitted
                </span>`
      card_border_color = 'success';
      action_button = `
          <button class="btn btn-sm btn-outline-primary" onclick="view_submitted_assignment('${student_id}', '${assignment.assignment_id}')">
            <i class="bi bi-file-earmark-check me-2"></i>Check Submission
          </button>`;
    }
    else {
      badge = `<span class="badge ${isOverdue ? "bg-danger" : "bg-warning"} text-white">
                    Due: ${new Date(assignment.deadline_date).toLocaleDateString()} at ${new Date(assignment.deadline_date).toLocaleTimeString()}
                </span>`
      if (isOverdue) {
        action_button = `<button class="btn btn-sm btn-outline-danger" disabled>
                            <i class="bi bi-x me-2"></i><b>Assignment Not Submitted</b>
                          </button>`;
        card_border_color = "danger";
      }
      else {
        action_button = ``
        card_border_color = "warning";
      }
    }

    // <h5 class="card-title mb-0">${assignment.title}</h5>
    html += `
                <div class="card assignment-card mb-3 border-${card_border_color}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            ${badge}
                        </div>
                        <h5>${assignment.subject_name}</h5>
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
                    <div class="card-footer">
                      <p class="text-muted"><u>${assignment.created_at}</u></p>
                    </div>
                </div>
            `
  })

  assignmentsList.innerHTML = html
}

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
