let csrf_token = null;
let admin_teachers_url = null;
let teachers = null;

async function AdminTeachers(csrf_token_param, admin_teachers_url_param) {
  csrf_token = csrf_token_param;
  admin_teachers_url = admin_teachers_url_param;
  await getTeachersList();

  const searchTeacher = document.getElementById("searchTeacher")
  if (searchTeacher) {
    searchTeacher.addEventListener("input", filterTeachers)
  }
}

let subjects = []

async function getTeachersList() {
  const url = `${admin_teachers_url}?`;
  const [success, result] = await callApi("GET", url);
  if (success) {
    if (result.success) {
      teachers = result.data.all_teachers;
      renderTeachersList(teachers);
      
    }
    else {
    }
  } else {
  }
}

function renderTeachersList(teachers) {
  const teachersTableElement = document.getElementById('teachersTableElement');
  const teacherNotFound = document.getElementById('teacherNotFound')

  teachersTableElement.style.display = '';
  teacherNotFound.style.display = 'none';

  const teachersTable = document.getElementById("teachersTable");
  if (!teachersTable) return

  if (teachers.length === 0) {
    teacherNotFound.style.display = '';
    teachersTableElement.style.display = 'none';
    return
  }
  let html = ""
  let index = 0
  teachers.forEach((teacher) => {
    index += 1;
    html += `
        <tr>
            <td class="text-nowrap">${index}</td>
            <td class="text-nowrap">${teacher.teacher_name}</td>
            <td class="text-nowrap">${teacher.teacher_mail}</td>
            <td class="text-nowrap">${teacher.total_subjects}</td>
            <td class="text-nowrap">${teacher.total_announcements}</td>
            <td class="text-nowrap">${teacher.total_assignments}</td>
            <td class="text-nowrap">${teacher.total_attendance}</td>
            
        </tr>
    `
  })

  teachersTable.innerHTML = html
}

function filterTeachers() {
  const searchFilter = document.getElementById("searchTeacher").value.toLowerCase()

  const filteredTeachers = teachers.filter((teacher) => {
    if (searchFilter && !teacher.teacher_name.toLowerCase().includes(searchFilter)) {
      return false
    }

    return true
  })


  renderTeachersList(filteredTeachers);
}
