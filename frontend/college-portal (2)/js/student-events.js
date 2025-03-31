document.addEventListener("DOMContentLoaded", () => {
    // Toggle sidebar on mobile
    const sidebarToggle = document.getElementById("sidebar-toggle")
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("show")
      })
    }
  
    // Mock data for events
    const events = [
      {
        id: 1,
        name: "TechFest 2023",
        type: "fest",
        organizer: "Computer Science Department",
        startDate: "2023-11-15",
        endDate: "2023-11-17",
        location: "Main Auditorium",
        description:
          "Annual technical festival featuring coding competitions, hackathons, and tech talks from industry experts.",
        image: "/placeholder.svg?height=200&width=300",
        status: "open", // open, closed, registered
        registrationDeadline: "2023-11-10",
        highlights: ["Coding Competition", "Hackathon", "Tech Talks", "Project Exhibition"],
        tags: ["technical", "coding", "hackathon"],
      },
      {
        id: 2,
        name: "Cultural Fiesta",
        type: "fest",
        organizer: "Student Council",
        startDate: "2023-12-05",
        endDate: "2023-12-07",
        location: "College Grounds",
        description: "Three-day cultural extravaganza with music, dance, drama, and art competitions.",
        image: "/placeholder.svg?height=200&width=300",
        status: "open",
        registrationDeadline: "2023-11-30",
        highlights: ["Music Competition", "Dance Battle", "Fashion Show", "Art Exhibition"],
        tags: ["cultural", "music", "dance", "art"],
      },
      {
        id: 3,
        name: "Web Development Workshop",
        type: "workshop",
        organizer: "IT Club",
        startDate: "2023-10-25",
        endDate: "2023-10-25",
        location: "Computer Lab 2",
        description:
          "Hands-on workshop on modern web development technologies including HTML5, CSS3, and JavaScript frameworks.",
        image: "/placeholder.svg?height=200&width=300",
        status: "closed",
        registrationDeadline: "2023-10-20",
        highlights: ["HTML5 & CSS3", "JavaScript Basics", "React Introduction", "Project Building"],
        tags: ["technical", "web", "coding"],
      },
      {
        id: 4,
        name: "Entrepreneurship Summit",
        type: "fest",
        organizer: "Business School",
        startDate: "2023-11-28",
        endDate: "2023-11-29",
        location: "Conference Hall",
        description:
          "Summit focused on entrepreneurship with keynote speeches, panel discussions, and networking opportunities.",
        image: "/placeholder.svg?height=200&width=300",
        status: "registered",
        registrationDeadline: "2023-11-20",
        highlights: ["Keynote Speeches", "Panel Discussions", "Startup Pitches", "Networking Sessions"],
        tags: ["business", "entrepreneurship", "networking"],
      },
      {
        id: 5,
        name: "AI & Machine Learning Workshop",
        type: "workshop",
        organizer: "AI Research Group",
        startDate: "2023-12-12",
        endDate: "2023-12-13",
        location: "Research Lab",
        description:
          "Two-day intensive workshop on artificial intelligence and machine learning fundamentals and applications.",
        image: "/placeholder.svg?height=200&width=300",
        status: "open",
        registrationDeadline: "2023-12-05",
        highlights: ["ML Basics", "Neural Networks", "Computer Vision", "Natural Language Processing"],
        tags: ["technical", "AI", "machine learning"],
      },
      {
        id: 6,
        name: "Sports Fest",
        type: "fest",
        organizer: "Sports Department",
        startDate: "2024-01-10",
        endDate: "2024-01-15",
        location: "College Sports Complex",
        description:
          "Annual sports festival featuring various indoor and outdoor sports competitions between departments.",
        image: "/placeholder.svg?height=200&width=300",
        status: "open",
        registrationDeadline: "2024-01-05",
        highlights: ["Cricket Tournament", "Football Championship", "Basketball Competition", "Athletics Meet"],
        tags: ["sports", "competition", "outdoor"],
      },
      {
        id: 7,
        name: "Research Methodology Workshop",
        type: "workshop",
        organizer: "Research Cell",
        startDate: "2023-11-05",
        endDate: "2023-11-06",
        location: "Seminar Hall",
        description:
          "Workshop on research methodologies, paper writing, and publication strategies for students and faculty.",
        image: "/placeholder.svg?height=200&width=300",
        status: "registered",
        registrationDeadline: "2023-10-30",
        highlights: ["Research Design", "Data Analysis", "Paper Writing", "Publication Strategies"],
        tags: ["research", "academic", "paper writing"],
      },
      {
        id: 8,
        name: "Photography Workshop",
        type: "workshop",
        organizer: "Photography Club",
        startDate: "2023-12-18",
        endDate: "2023-12-18",
        location: "Design Studio",
        description: "One-day workshop on photography basics, composition techniques, and photo editing.",
        image: "/placeholder.svg?height=200&width=300",
        status: "open",
        registrationDeadline: "2023-12-15",
        highlights: ["Camera Basics", "Composition", "Lighting", "Photo Editing"],
        tags: ["photography", "creative", "art"],
      },
    ]
  
    // Function to format date
    function formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" }
      return new Date(dateString).toLocaleDateString("en-US", options)
    }
  
    // Function to create event card
    function createEventCard(event) {
      // Determine card color based on event type
      const cardColorClass = event.type === "fest" ? "border-purple" : "border-teal"
      const badgeColorClass = event.type === "fest" ? "bg-purple" : "bg-teal"
      const iconClass = event.type === "fest" ? "bi-music-note-beamed" : "bi-tools"
  
      // Determine status badge
      let statusBadge = ""
      if (event.status === "open") {
        statusBadge = '<span class="badge bg-success">Registration Open</span>'
      } else if (event.status === "closed") {
        statusBadge = '<span class="badge bg-danger">Registration Closed</span>'
      } else if (event.status === "registered") {
        statusBadge = '<span class="badge bg-primary">Registered</span>'
      }
  
      // Create card HTML
      return `
              <div class="col-md-6 col-lg-4 mb-4 event-card" data-type="${event.type}" data-name="${event.name.toLowerCase()}" data-date="${event.startDate}">
                  <div class="card h-100 ${cardColorClass}" style="border-width: 2px;">
                      <div class="position-relative">
                          <img src="${event.image}" class="card-img-top" alt="${event.name}">
                          <span class="position-absolute top-0 end-0 m-2 badge ${badgeColorClass}">
                              <i class="bi ${iconClass} me-1"></i>${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                      </div>
                      <div class="card-body">
                          <div class="d-flex justify-content-between align-items-start mb-2">
                              <h5 class="card-title mb-0">${event.name}</h5>
                              ${statusBadge}
                          </div>
                          <p class="card-text text-muted mb-1">
                              <i class="bi bi-calendar-event me-1"></i> ${formatDate(event.startDate)}${event.endDate !== event.startDate ? " - " + formatDate(event.endDate) : ""}
                          </p>
                          <p class="card-text text-muted mb-2">
                              <i class="bi bi-geo-alt me-1"></i> ${event.location}
                          </p>
                          <p class="card-text mb-3">${event.description.substring(0, 100)}${event.description.length > 100 ? "..." : ""}</p>
                          <div class="d-flex flex-wrap mb-2">
                              ${event.highlights
                                .slice(0, 3)
                                .map(
                                  (highlight) => `<span class="badge bg-light text-dark me-1 mb-1">${highlight}</span>`,
                                )
                                .join("")}
                              ${event.highlights.length > 3 ? `<span class="badge bg-light text-dark me-1 mb-1">+${event.highlights.length - 3} more</span>` : ""}
                          </div>
                      </div>
                      <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
                          <small class="text-muted">Deadline: ${formatDate(event.registrationDeadline)}</small>
                          <a href="event-detail.html?id=${event.id}" class="btn btn-sm btn-outline-primary">View Details</a>
                      </div>
                  </div>
              </div>
          `
    }
  
    // Function to load events
    function loadEvents() {
      const allEventsContainer = document.getElementById("allEventsContainer")
      const festsContainer = document.getElementById("festsContainer")
      const workshopsContainer = document.getElementById("workshopsContainer")
  
      // Clear containers
      allEventsContainer.innerHTML = ""
      festsContainer.innerHTML = ""
      workshopsContainer.innerHTML = ""
  
      // Filter and sort events based on current settings
      let filteredEvents = [...events]
      const searchTerm = document.getElementById("searchEvents").value.toLowerCase()
  
      if (searchTerm) {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerm) ||
            event.organizer.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
        )
      }
  
      // Get current sort option
      const currentSort = document.querySelector(".sort-option.active")
        ? document.querySelector(".sort-option.active").getAttribute("data-sort")
        : "date-desc"
  
      // Sort events
      filteredEvents.sort((a, b) => {
        switch (currentSort) {
          case "date-asc":
            return new Date(a.startDate) - new Date(b.startDate)
          case "date-desc":
            return new Date(b.startDate) - new Date(a.startDate)
          case "name-asc":
            return a.name.localeCompare(b.name)
          case "name-desc":
            return b.name.localeCompare(a.name)
          default:
            return new Date(b.startDate) - new Date(a.startDate)
        }
      })
  
      // Show or hide no results message
      const noResultsMessage = document.getElementById("noResultsMessage")
      if (filteredEvents.length === 0) {
        noResultsMessage.style.display = "block"
      } else {
        noResultsMessage.style.display = "none"
      }
  
      // Populate containers
      filteredEvents.forEach((event) => {
        const eventCard = createEventCard(event)
        allEventsContainer.innerHTML += eventCard
  
        if (event.type === "fest") {
          festsContainer.innerHTML += eventCard
        } else if (event.type === "workshop") {
          workshopsContainer.innerHTML += eventCard
        }
      })
  
      // Add custom styles for event types
      document.head.insertAdjacentHTML(
        "beforeend",
        `
              <style>
                  .border-purple {
                      border-color: #8a2be2 !important;
                  }
                  .bg-purple {
                      background-color: #8a2be2 !important;
                  }
                  .border-teal {
                      border-color: #20c997 !important;
                  }
                  .bg-teal {
                      background-color: #20c997 !important;
                  }
              </style>
          `,
      )
    }
  
    // Initial load
    loadEvents()
  
    // Search functionality
    const searchInput = document.getElementById("searchEvents")
    searchInput.addEventListener("input", loadEvents)
  
    // Sort functionality
    const sortOptions = document.querySelectorAll(".sort-option")
    sortOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Remove active class from all options
        sortOptions.forEach((opt) => opt.classList.remove("active"))
  
        // Add active class to clicked option
        this.classList.add("active")
  
        // Reload events with new sort
        loadEvents()
      })
    })
  
    // Set default sort (newest first)
    document.querySelector('[data-sort="date-desc"]').classList.add("active")
  })
  
  