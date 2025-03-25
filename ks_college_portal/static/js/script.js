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

function displayDocument(url) {
    console.log(url);
    const viewer = document.getElementById('document-viewer');
    viewer.innerHTML = ''; // Clear previous content

    // Get the file extension
    const extension = url.split('.').pop().toLowerCase();

    // Create the appropriate element based on the file type
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        // Image
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Image document";
        img.className = 'img-fluid';
        viewer.appendChild(img);
    }
    else if (extension === 'pdf') {
        // Custom PDF Viewer
        console.log('Rendering PDF:', url);

        // Create navigation controls
        const controls = document.createElement('div');
        controls.id = 'pdf-controls';
        controls.innerHTML = `
            <button id="prev-page" class="btn btn-primary eh-btn-blue-primary-no-hover"><i class="fa fa-circle-chevron-left"></i></button>
            <span id="page-info">Page <span id="current-page">1</span> of <span id="total-pages">1</span></span>
            <button id="next-page" class="btn btn-primary eh-btn-blue-primary-no-hover"><i class="fa fa-circle-chevron-right"></i></button>
        `;
        viewer.appendChild(controls);

        // Create canvas for rendering the PDF
        const canvas = document.createElement('canvas');
        canvas.id = 'pdf-render';
        viewer.appendChild(canvas);

        // Initialize PDF.js
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        const pdfRender = canvas;
        const ctx = pdfRender.getContext('2d');
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 0;

        // Render the current page
        function renderPage(pageNum) {
            pdfDoc.getPage(pageNum).then((page) => {
                const viewport = page.getViewport({ scale: 1.5 });
                pdfRender.width = viewport.width;
                pdfRender.height = viewport.height;

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport,
                };
                page.render(renderContext);
                document.getElementById('current-page').textContent = pageNum;
            });
        }

        // Load the PDF and initialize the viewer
        pdfjsLib.getDocument(url).promise.then((pdf) => {
            pdfDoc = pdf;
            totalPages = pdf.numPages;
            document.getElementById('total-pages').textContent = totalPages;
            renderPage(currentPage);
        });

        // Add event listeners for navigation
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage <= 1) return;
            currentPage--;
            renderPage(currentPage);
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage >= totalPages) return;
            currentPage++;
            renderPage(currentPage);
        });
    }
    else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        // Video
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.width = "100%";
        video.style.maxHeight = '500px';
        viewer.appendChild(video);
    }
    else if (['mp3', 'wav', 'ogg'].includes(extension)) {
        // Audio
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;
        audio.style.width = "100%";
        audio.style.maxHeight = '500px';
        viewer.appendChild(audio);
    }
    else {
        // Unsupported file type
        viewer.innerHTML = `<p>Unsupported document type: ${extension}</p>`;
    }
}
