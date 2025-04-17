let csrf_token = null;
let admin_dashboard_url = null;
let admin_user_creation_url = null;
let promote_student_url = null;
let admin_student_autocomplete_url = null;
let upload_student_excel_url = null;
let dashboard_data = null;
let failed_students = []
let failed_students_names = []
let SelectedFiles = []

async function AdminDashboard(csrf_token_param, admin_dashboard_url_param, admin_user_creation_url_param, admin_student_autocomplete_url_param, promote_student_url_param, upload_student_excel_url_param) {
  csrf_token = csrf_token_param;
  admin_dashboard_url = admin_dashboard_url_param;
  admin_user_creation_url = admin_user_creation_url_param;
  admin_student_autocomplete_url = admin_student_autocomplete_url_param;
  promote_student_url = promote_student_url_param;
  upload_student_excel_url = upload_student_excel_url_param;

  const url = admin_dashboard_url;
  const [success, result] = await callApi("GET", url);
  if (success) {
    if (result.success) {
      dashboard_data = result.data;
      console.log(dashboard_data);

      document.getElementById("active_students").innerText = dashboard_data.total_students;
      document.getElementById("active_teachers").innerText = dashboard_data.total_teachers;

      document.getElementById("total_placements").innerText = dashboard_data.total_company;

      document.getElementById("total_subjects").innerText = dashboard_data.total_subjects;
      document.getElementById("total_announcements").innerText = dashboard_data.total_announcement;
      document.getElementById("attendance_sessions").innerText = dashboard_data.total_attendance;
      const current_academic_year = dashboard_data.current_acedemic_year;

      document.getElementById("current_academic_year").innerText = current_academic_year;
      document.getElementById("final_current_academic_year").innerText = current_academic_year;

      const parts = current_academic_year.split("-");
      const new_academic_year = (parseInt(parts[0]) + 1) + "-" + (parseInt(parts[1]) + 1);

      document.getElementById("transitioned_academic_year").innerText = new_academic_year;
      document.getElementById("final_transitioned_academic_year").innerText = new_academic_year;

      // Load data
      loadRecentSubjects(dashboard_data.all_subjects);

      const failed_student_roll_no_input = document.getElementById('failed_student_roll_no');
      const autocompleteStudentList = document.getElementById('autocomplete-student-list');
      const failed_students_list = document.getElementById('failed-students-list');
      const final_failed_students_list = document.getElementById('final-failed-students-list');
      const no_students_failed = document.getElementById('no-students-failed');
      const final_no_students_failed = document.getElementById('final-no-students-failed');

      failed_student_roll_no_input.addEventListener('input', async () => {
        const query = failed_student_roll_no_input.value;
        if (!query) {
          autocompleteStudentList.innerHTML = '';
          return;
        }

        const Params = {
          q: query,
        };

        const url = `${admin_student_autocomplete_url}?` + toQueryString(Params);
        const [success, result] = await callApi("GET", url);
        if (success) {
          if (result.success) {
            const data = result.data;
            autocompleteStudentList.innerHTML = '';

            data.forEach(student => {
              const div = document.createElement('div');
              div.classList.add('autocomplete-student-item');
              div.textContent = `${student.roll_no} - ${student.name}`;
              div.dataset.id = student.user_id;

              div.addEventListener('click', () => {
                no_students_failed.style.display = 'none';
                final_no_students_failed.style.display = 'none';
                document.getElementById('total_failed_students').innerText = failed_students.length + 1;
                document.getElementById('final_total_failed_students').innerText = failed_students.length + 1;
                failed_students_list.innerHTML += `<li>${student.roll_no} - ${student.name}</li>`;
                final_failed_students_list.innerHTML += `<li>${student.roll_no} - ${student.name}</li>`;

                failed_students.push(student.user_id);
                failed_students_names.push(`${student.roll_no} - ${student.name}`);
                failed_student_roll_no_input.value = '';
                autocompleteStudentList.innerHTML = '';
              });
              autocompleteStudentList.appendChild(div);
            });
          }
          else {
            console.error("GET User Failed:", result);
          }

        } else {
          console.error("GET User Failed:", result);
        }
      });

      failed_student_roll_no_input.addEventListener("blur", function () {
        setTimeout(() => {
          autocompleteStudentList.innerHTML = '';
          console.log('grnis');
        }, 150);
      });

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
                <td>${subject.subject_name}</td>
                <td><span class="badge bg-info">${subject.college_year}</span></td>
                <td><span class="badge bg-secondary">Division ${subject.class_division}</span></td>
                <td>${subject.student_counts}</td>
            </tr>
        `
  })

  recentSubjectsTable.innerHTML = html
}

function openDocModal(doc_path, doc_name) {
  displayDocument(doc_path);
  document.getElementById('viewDocumentModalLabel').innerText = doc_name;
  const myModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  myModal.show();
}

document.getElementById("register_form").addEventListener("submit", async (event) => {
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
    name: document.getElementById('firstname').value + ' ' + document.getElementById('lastname').value,
    password: document.getElementById('password').value,
    contact_number: document.getElementById('contact_number').value,
    email: document.getElementById('email').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    role: document.getElementById('role').value,
    roll_no: document.getElementById('roll_no').value,
    year: document.getElementById('year').value,
    division: document.getElementById('division').value,
  }
  const url = admin_user_creation_url;
  const [success, result] = await callApi("POST", url, bodyData, csrf_token);
  if (success) {
    console.log("Result:", result);

    if (result.success) {
      document.getElementById('user-created-success').style.display = '';
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

async function transitToNewAcademicYear() {

  showModal(
    'Confirm Action',
    '<p>Are you sure you want to transit to the new academic year? Once the transition is completed, it cannot be undone.</p>',

    async () => {
      toggle_loader()
      let bodyData = {
        failed: failed_students,
      }
      const url = promote_student_url;
      const [success, result] = await callApi("POST", url, bodyData, csrf_token);
      console.log("Result:", result);
      if (success) {
        if (result.success) {
          location.reload();
        }

        else {

        }

      } else {

      }
      toggle_loader()
    }
  );
}

document.getElementById('students_excel_file').addEventListener('change', function (event) {
  handleFiles(event.target.files);
});

function handleFiles(files) {
  const allowedExtensions = ['xlsx', 'xls', 'csv'];

  for (let file of files) {
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`Unsupported file type: ${file.name}`);
      continue;
    }
    document.getElementById(`upload_input_text_students_excel_file`).style.display = 'none';
    document.getElementById(`upload_input_file_text_students_excel_file`).style.display = '';
    document.getElementById(`upload_input_file_text_students_excel_file`).innerText = file.name;
    document.getElementById(`students_excel_file_DocUploadIcon`).className = 'bi bi-cloud-check fa-xl';
    SelectedFiles = [];
    SelectedFiles.push(file);

  }
}

async function uploadStudentExcel() {
  if (SelectedFiles.length === 0) {
    alert("Please select a file!");
    return;
  }
  if (SelectedFiles.length > 1) {
    alert("Please select only one file!");
    return;
  }
  const file = SelectedFiles[0];
  if (!file) {
    alert("Please select a file!");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  toggle_loader();
  try {
    const url = upload_student_excel_url;
    const [success, result] = await callApi("POST", url, formData, csrf_token, true);
    console.log("Result:", result);
    if (success) {
      if (result.success) {
        alert("File uploaded successfully!");
        location.reload();
      }

      else {
        alert(result.error);
      }

    } else {
      alert("Upload failed!");

    }
    toggle_loader();

  } catch (err) {
    console.error("Error uploading file", err);
    alert("Upload failed!");
  }
}
