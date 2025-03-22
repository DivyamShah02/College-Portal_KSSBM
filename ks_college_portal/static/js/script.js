function setFormValues(data) {
    // Loop through each key-value pair in the dictionary (data)
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            // Find the input element(s) where name attribute matches the key
            const input = document.querySelector(`[name="${key}"]`);
            const inputs = document.querySelectorAll(`[name="${key}"]`);

            if (input) {
                if (input.type === 'radio') {
                    // If the input is a radio button group, loop through all radio buttons
                    inputs.forEach(radio => {
                        // Check for true/false values and map them to 'Yes'/'No'
                        if ((data[key] === true || data[key] === "true") && radio.value.toLowerCase() === 'yes') {
                            radio.checked = true;  // Select the "Yes" radio button
                        } else if ((data[key] === false || data[key] === "false") && radio.value.toLowerCase() === 'no') {
                            radio.checked = true;  // Select the "No" radio button
                        } else if (radio.value === data[key]) {
                            // For other radio buttons, match by value
                            radio.checked = true;
                        }
                    });
                } else if (input.type === 'checkbox') {
                    // Handle checkboxes
                    if (Array.isArray(data[key])) {
                        // If the data is an array, check each checkbox that matches
                        inputs.forEach(checkbox => {
                            checkbox.checked = data[key].includes(checkbox.value);
                        });
                    } else {
                        // If it's a single value, just check/uncheck the box
                        input.checked = data[key] === true || data[key] === "true";
                    }
                } else if (input.type === 'file') {
                    const file_input = document.querySelector(`[id="${key}"]`);
                    if (file_input) {
                        if (file_input.tagName === 'A' && data[key] !== null) {
                            let file_input_obj = document.getElementById(key)
                            file_input_obj.style.display = 'block';
                            file_input_obj.href = data[key]
                            file_input_obj.innerText = String(data[key]).split('/').pop();
                        } else {
                            let file_input_obj = document.getElementById(key)
                            file_input_obj.style.display = 'block';
                            file_input_obj.src = data[key]
                        }
                    }
                } else {
                    input.value = data[key];
                }
            }
        }
    }

}


try {
    const currentDateElement = document.getElementById("currentDate")
    if (currentDateElement) {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        const today = new Date()
        currentDateElement.textContent = today.toLocaleDateString("en-US", options)
    }
}
catch (error) {
    console.log(error);
}


const sidebarToggle = document.getElementById("sidebarToggle")
const sidebar = document.getElementById("sidebar")

if (sidebarToggle && sidebar) {
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show")
})
}

function logPageLoadUrl() {
    const currentUrl = window.location.href;
    console.log(`Page loaded from URL: ${currentUrl}`);

    if (currentUrl.includes('dashboard')) {
        document.getElementById('Dashboard-nav').className = 'nav-link active';
    }

    else if (currentUrl.includes('subjects')) {
        document.getElementById('Subjects-nav').className = 'nav-link active';
    }
    else if (currentUrl.includes('placements')) {
        document.getElementById('Placements-nav').className = 'nav-link active';
    }
    else if (currentUrl.includes('announcements')) {
        document.getElementById('Announcements-nav').className = 'nav-link active';
    }

    else if (currentUrl.includes('assignments')) {
        document.getElementById('Assignments-nav').className = 'nav-link active';
    }

    else if (currentUrl.includes('attendance')) {
        document.getElementById('Attendance-nav').className = 'nav-link active';
    }
    
    else if (currentUrl.includes('students')) {
        document.getElementById('Students-nav').className = 'nav-link active';
    }

}

logPageLoadUrl();
