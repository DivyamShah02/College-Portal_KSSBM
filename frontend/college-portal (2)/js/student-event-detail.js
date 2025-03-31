document.addEventListener("DOMContentLoaded", () => {
    // Toggle sidebar on mobile
    const sidebarToggle = document.getElementById("sidebar-toggle")
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("show")
      })
    }
  
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const eventId = Number.parseInt(urlParams.get("id"))
  
    // Mock event data
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
          "Annual technical festival featuring coding competitions, hackathons, and tech talks from industry experts. TechFest is the flagship event of the Computer Science Department, bringing together students, faculty, and industry professionals for three days of innovation, learning, and networking.\n\nThis year's theme is 'AI and the Future of Technology', with a focus on how artificial intelligence is transforming various industries and our daily lives. The event will feature workshops, panel discussions, and competitions centered around this theme.\n\nParticipants will have the opportunity to showcase their technical skills, learn from industry experts, and win exciting prizes. Whether you're a coding enthusiast, a design wizard, or just curious about technology, TechFest has something for everyone.",
        image: "/placeholder.svg?height=400&width=800",
        status: "open", // open, closed, registered
        registrationDeadline: "2023-11-10",
        highlights: ["Coding Competition", "Hackathon", "Tech Talks", "Project Exhibition"],
        tags: ["technical", "coding", "hackathon", "AI", "innovation"],
        contact: {
          email: "techfest@college.edu",
          phone: "+1 (555) 123-4567",
          website: "techfest.college.edu",
        },
        schedule: [
          {
            day: "Day 1 - November 15, 2023",
            events: [
              {
                time: "09:00 AM - 10:00 AM",
                title: "Opening Ceremony",
                description: "Welcome address by the Dean and introduction to TechFest 2023",
              },
              {
                time: "10:30 AM - 12:30 PM",
                title: "Keynote Speech",
                description: "The Future of AI by Dr. Jane Smith, Chief AI Scientist at Tech Corp",
              },
              {
                time: "01:30 PM - 03:30 PM",
                title: "Workshop: Introduction to Machine Learning",
                description: "Hands-on workshop for beginners",
              },
              {
                time: "04:00 PM - 06:00 PM",
                title: "Coding Competition Round 1",
                description: "Preliminary round of the coding competition",
              },
            ],
          },
          {
            day: "Day 2 - November 16, 2023",
            events: [
              { time: "09:00 AM - 11:00 AM", title: "Hackathon Kickoff", description: "24-hour hackathon begins" },
              {
                time: "11:30 AM - 01:00 PM",
                title: "Panel Discussion",
                description: "Ethics in AI - Challenges and Solutions",
              },
              {
                time: "02:00 PM - 04:00 PM",
                title: "Workshop: Web Development with React",
                description: "Advanced web development techniques",
              },
              {
                time: "04:30 PM - 06:30 PM",
                title: "Coding Competition Round 2",
                description: "Final round of the coding competition",
              },
            ],
          },
          {
            day: "Day 3 - November 17, 2023",
            events: [
              {
                time: "09:00 AM - 11:00 AM",
                title: "Hackathon Presentations",
                description: "Teams present their hackathon projects",
              },
              {
                time: "11:30 AM - 01:00 PM",
                title: "Tech Talk",
                description: "Blockchain and its Applications by Prof. Robert Johnson",
              },
              { time: "02:00 PM - 04:00 PM", title: "Project Exhibition", description: "Showcase of student projects" },
              {
                time: "04:30 PM - 06:00 PM",
                title: "Closing Ceremony & Prize Distribution",
                description: "Announcement of winners and closing remarks",
              },
            ],
          },
        ],
        speakers: [
          {
            name: "Dr. Jane Smith",
            title: "Chief AI Scientist, Tech Corp",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Dr. Jane Smith is a leading expert in artificial intelligence with over 15 years of experience in the field. She has published numerous papers on machine learning and neural networks.",
          },
          {
            name: "Prof. Robert Johnson",
            title: "Professor of Computer Science",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Prof. Johnson is a renowned academic in the field of blockchain technology and distributed systems. He has authored several books on the subject.",
          },
          {
            name: "Sarah Williams",
            title: "Senior Software Engineer, InnovateTech",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Sarah is an experienced software engineer specializing in web development and cloud computing. She has worked on several high-profile projects.",
          },
          {
            name: "Michael Chen",
            title: "Founder & CEO, StartupX",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Michael is a successful entrepreneur who has founded multiple tech startups. He is passionate about innovation and technology entrepreneurship.",
          },
        ],
        gallery: [
          { image: "/placeholder.svg?height=300&width=400", caption: "Opening Ceremony from TechFest 2022" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Hackathon Winners from TechFest 2022" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Coding Competition in progress" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Panel Discussion on AI Ethics" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Project Exhibition" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Networking Session" },
        ],
        faqs: [
          {
            question: "Who can participate in TechFest?",
            answer:
              "TechFest is open to all students of the college. Some competitions may have specific eligibility criteria, which will be mentioned in their respective rules.",
          },
          {
            question: "Is there a registration fee?",
            answer:
              "No, there is no registration fee for TechFest. However, some workshops may have limited seats, so early registration is recommended.",
          },
          {
            question: "Can I participate in multiple events?",
            answer: "Yes, you can participate in multiple events as long as there are no schedule conflicts.",
          },
          {
            question: "What should I bring to the hackathon?",
            answer:
              "Participants should bring their own laptops, chargers, and any other equipment they might need. Food and refreshments will be provided.",
          },
          {
            question: "Will certificates be provided?",
            answer:
              "Yes, certificates will be provided to all participants. Winners will receive special certificates and prizes.",
          },
        ],
      },
      {
        id: 2,
        name: "Cultural Fiesta",
        type: "fest",
        organizer: "Student Council",
        startDate: "2023-12-05",
        endDate: "2023-12-07",
        location: "College Grounds",
        description:
          "Three-day cultural extravaganza with music, dance, drama, and art competitions. Cultural Fiesta is the annual cultural festival that celebrates the diverse talents of our students. It provides a platform for students to showcase their artistic abilities and creativity.\n\nThe festival features a wide range of events including music performances, dance competitions, theatrical plays, art exhibitions, and literary contests. It's a celebration of culture, creativity, and talent.\n\nCultural Fiesta attracts participants and audiences from various colleges, making it one of the most anticipated events of the academic year. Join us for three days of fun, entertainment, and artistic expression!",
        image: "/placeholder.svg?height=400&width=800",
        status: "open",
        registrationDeadline: "2023-11-30",
        highlights: ["Music Competition", "Dance Battle", "Fashion Show", "Art Exhibition"],
        tags: ["cultural", "music", "dance", "art", "drama"],
        contact: {
          email: "culturalfiesta@college.edu",
          phone: "+1 (555) 987-6543",
          website: "culturalfiesta.college.edu",
        },
        schedule: [
          {
            day: "Day 1 - December 5, 2023",
            events: [
              {
                time: "09:00 AM - 10:00 AM",
                title: "Inauguration Ceremony",
                description: "Opening of Cultural Fiesta 2023",
              },
              { time: "10:30 AM - 01:00 PM", title: "Solo Singing Competition", description: "Preliminary round" },
              { time: "02:00 PM - 04:00 PM", title: "Group Dance Competition", description: "Preliminary round" },
              {
                time: "04:30 PM - 06:30 PM",
                title: "Art Exhibition Opening",
                description: "Showcase of student artwork",
              },
            ],
          },
          {
            day: "Day 2 - December 6, 2023",
            events: [
              { time: "09:00 AM - 11:00 AM", title: "Solo Dance Competition", description: "All categories" },
              { time: "11:30 AM - 01:30 PM", title: "Battle of Bands", description: "Music band competition" },
              { time: "02:30 PM - 04:30 PM", title: "Theatrical Play", description: "Drama club performance" },
              {
                time: "05:00 PM - 07:00 PM",
                title: "Fashion Show",
                description: "Theme: Fusion of Traditional and Modern",
              },
            ],
          },
          {
            day: "Day 3 - December 7, 2023",
            events: [
              {
                time: "09:00 AM - 11:00 AM",
                title: "Literary Contests",
                description: "Poetry, debate, and creative writing",
              },
              {
                time: "11:30 AM - 01:30 PM",
                title: "Solo Singing Finals",
                description: "Final round of singing competition",
              },
              {
                time: "02:30 PM - 04:30 PM",
                title: "Group Dance Finals",
                description: "Final round of group dance competition",
              },
              {
                time: "05:00 PM - 07:00 PM",
                title: "Closing Ceremony & Cultural Night",
                description: "Prize distribution and cultural performances",
              },
            ],
          },
        ],
        speakers: [
          {
            name: "Ms. Priya Sharma",
            title: "Renowned Classical Dancer",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Ms. Sharma is an accomplished classical dancer with expertise in Bharatanatyam and Kathak. She has performed at various national and international events.",
          },
          {
            name: "Mr. David Rodriguez",
            title: "Music Director",
            image: "/placeholder.svg?height=200&width=200",
            bio: "David is a music director and composer who has worked on several theatrical productions and films. He will be judging the music competitions.",
          },
          {
            name: "Ms. Emily Chen",
            title: "Fashion Designer",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Emily is a fashion designer known for her innovative designs that blend traditional elements with modern aesthetics. She will be judging the fashion show.",
          },
          {
            name: "Mr. Rajiv Mehta",
            title: "Theater Director",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Rajiv is a theater director with over 20 years of experience in directing plays and mentoring young actors. He will be overseeing the theatrical performances.",
          },
        ],
        gallery: [
          { image: "/placeholder.svg?height=300&width=400", caption: "Dance Performance from Cultural Fiesta 2022" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Music Band Competition" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Art Exhibition" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Fashion Show" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Theatrical Play" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Award Ceremony" },
        ],
        faqs: [
          {
            question: "How can I register for Cultural Fiesta events?",
            answer:
              "You can register for individual events through this portal. Each event may have specific registration requirements.",
          },
          {
            question: "Can I participate in multiple events?",
            answer: "Yes, you can participate in multiple events as long as there are no schedule conflicts.",
          },
          {
            question: "Is there an entry fee for the audience?",
            answer:
              "No, entry is free for all college students with valid ID cards. External visitors may need to register at the entry gate.",
          },
          {
            question: "Will there be food available during the festival?",
            answer: "Yes, there will be food stalls set up throughout the venue offering a variety of cuisines.",
          },
          {
            question: "Can alumni participate in the events?",
            answer: "Some events have special categories for alumni. Please check the specific event rules for details.",
          },
        ],
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
          "Hands-on workshop on modern web development technologies including HTML5, CSS3, and JavaScript frameworks. This intensive one-day workshop is designed for students who want to learn practical web development skills.\n\nThe workshop will cover the fundamentals of web development, starting with HTML5 and CSS3, and progressing to JavaScript and popular frameworks like React. Participants will build a complete web application by the end of the day.\n\nThis workshop is suitable for beginners with basic programming knowledge as well as intermediate developers looking to enhance their skills. All participants will receive a certificate of completion.",
        image: "/placeholder.svg?height=400&width=800",
        status: "closed",
        registrationDeadline: "2023-10-20",
        highlights: ["HTML5 & CSS3", "JavaScript Basics", "React Introduction", "Project Building"],
        tags: ["technical", "web", "coding", "development", "workshop"],
        contact: {
          email: "itclub@college.edu",
          phone: "+1 (555) 234-5678",
          website: "itclub.college.edu/workshop",
        },
        schedule: [
          {
            day: "October 25, 2023",
            events: [
              {
                time: "09:00 AM - 09:30 AM",
                title: "Registration & Setup",
                description: "Check-in and environment setup",
              },
              {
                time: "09:30 AM - 11:00 AM",
                title: "HTML5 & CSS3 Fundamentals",
                description: "Building the structure and styling of web pages",
              },
              {
                time: "11:15 AM - 12:45 PM",
                title: "JavaScript Essentials",
                description: "Core concepts and DOM manipulation",
              },
              {
                time: "01:30 PM - 03:00 PM",
                title: "Introduction to React",
                description: "Components, props, and state management",
              },
              {
                time: "03:15 PM - 04:45 PM",
                title: "Building a Complete Project",
                description: "Hands-on project development",
              },
              {
                time: "04:45 PM - 05:00 PM",
                title: "Closing & Certificate Distribution",
                description: "Workshop conclusion and next steps",
              },
            ],
          },
        ],
        speakers: [
          {
            name: "Alex Johnson",
            title: "Senior Web Developer, WebTech Solutions",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Alex is a senior web developer with expertise in frontend technologies. He has worked on numerous web applications and is passionate about teaching web development.",
          },
          {
            name: "Sophia Lee",
            title: "UI/UX Designer",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Sophia specializes in user interface and experience design. She will be covering the design aspects of web development during the workshop.",
          },
        ],
        gallery: [
          { image: "/placeholder.svg?height=300&width=400", caption: "Previous Web Development Workshop" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Hands-on Coding Session" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Group Project Work" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Certificate Distribution" },
        ],
        faqs: [
          {
            question: "What prerequisites are required for this workshop?",
            answer:
              "Basic knowledge of programming concepts is helpful but not mandatory. The workshop is designed to accommodate beginners.",
          },
          {
            question: "Do I need to bring my own laptop?",
            answer:
              "Yes, participants should bring their own laptops. All necessary software will be installed during the setup session.",
          },
          {
            question: "Will the workshop materials be available after the event?",
            answer:
              "Yes, all slides, code examples, and additional resources will be shared with participants after the workshop.",
          },
          {
            question: "Is there a certificate for attending?",
            answer: "Yes, all participants who complete the workshop will receive a certificate of completion.",
          },
          {
            question: "How many participants will be in the workshop?",
            answer:
              "The workshop is limited to 30 participants to ensure individual attention and a better learning experience.",
          },
        ],
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
          "Summit focused on entrepreneurship with keynote speeches, panel discussions, and networking opportunities. This two-day event brings together successful entrepreneurs, investors, and business experts to share insights and experiences with aspiring entrepreneurs.\n\nThe summit will cover various aspects of entrepreneurship including ideation, business planning, funding, marketing, and scaling. Participants will have the opportunity to pitch their business ideas and receive feedback from experts.\n\nWhether you're a student with a business idea or someone interested in the world of startups and entrepreneurship, this summit offers valuable knowledge and networking opportunities.",
        image: "/placeholder.svg?height=400&width=800",
        status: "registered",
        registrationDeadline: "2023-11-20",
        highlights: ["Keynote Speeches", "Panel Discussions", "Startup Pitches", "Networking Sessions"],
        tags: ["business", "entrepreneurship", "networking", "startups"],
        contact: {
          email: "entrepreneurship@college.edu",
          phone: "+1 (555) 876-5432",
          website: "business.college.edu/summit",
        },
        schedule: [
          {
            day: "Day 1 - November 28, 2023",
            events: [
              {
                time: "09:00 AM - 09:30 AM",
                title: "Registration",
                description: "Check-in and welcome kit distribution",
              },
              {
                time: "09:30 AM - 10:30 AM",
                title: "Opening Keynote",
                description: "The Future of Entrepreneurship by Ms. Lisa Chen, CEO of InnovateX",
              },
              {
                time: "10:45 AM - 12:15 PM",
                title: "Panel Discussion",
                description: "From Idea to Startup: The Journey",
              },
              {
                time: "01:30 PM - 03:00 PM",
                title: "Workshop",
                description: "Business Model Canvas: Building Your Business Plan",
              },
              {
                time: "03:15 PM - 04:45 PM",
                title: "Startup Showcase",
                description: "Presentations by successful startups",
              },
              {
                time: "05:00 PM - 06:30 PM",
                title: "Networking Reception",
                description: "Informal networking session with refreshments",
              },
            ],
          },
          {
            day: "Day 2 - November 29, 2023",
            events: [
              {
                time: "09:30 AM - 10:30 AM",
                title: "Keynote Speech",
                description: "Funding Strategies for Startups by Mr. James Wilson, Venture Capitalist",
              },
              {
                time: "10:45 AM - 12:15 PM",
                title: "Panel Discussion",
                description: "Scaling Your Business: Challenges and Opportunities",
              },
              {
                time: "01:30 PM - 03:30 PM",
                title: "Pitch Competition",
                description: "Students pitch their business ideas to a panel of judges",
              },
              {
                time: "03:45 PM - 04:45 PM",
                title: "Mentoring Sessions",
                description: "One-on-one mentoring with industry experts",
              },
              {
                time: "05:00 PM - 06:00 PM",
                title: "Closing Ceremony",
                description: "Award announcement and closing remarks",
              },
            ],
          },
        ],
        speakers: [
          {
            name: "Lisa Chen",
            title: "CEO, InnovateX",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Lisa is the founder and CEO of InnovateX, a successful tech startup that was recently acquired for $50 million. She has extensive experience in building and scaling startups.",
          },
          {
            name: "James Wilson",
            title: "Partner, Venture Capital Firm",
            image: "/placeholder.svg?height=200&width=200",
            bio: "James is a partner at a leading venture capital firm with a portfolio of over 100 startups. He specializes in early-stage investments in technology and healthcare.",
          },
          {
            name: "Dr. Maria Rodriguez",
            title: "Professor of Entrepreneurship",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Dr. Rodriguez is a professor of entrepreneurship with research focus on innovation and startup ecosystems. She has authored several books on entrepreneurship.",
          },
          {
            name: "Tom Baker",
            title: "Serial Entrepreneur",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Tom has founded and successfully exited three startups in the past decade. He now mentors young entrepreneurs and invests in promising startups.",
          },
        ],
        gallery: [
          { image: "/placeholder.svg?height=300&width=400", caption: "Keynote Speech from Last Year's Summit" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Panel Discussion" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Pitch Competition" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Networking Session" },
          { image: "/placeholder.svg?height=300&width=400", caption: "Award Ceremony" },
        ],
        faqs: [
          {
            question: "Who can attend the Entrepreneurship Summit?",
            answer:
              "The summit is open to all students, faculty, and external participants interested in entrepreneurship.",
          },
          {
            question: "How can I participate in the pitch competition?",
            answer:
              "You can apply for the pitch competition during registration. Selected participants will be notified a week before the event.",
          },
          {
            question: "Is there a registration fee?",
            answer:
              "There is a nominal registration fee of $10 for students and $25 for external participants. This covers all sessions, materials, and refreshments.",
          },
          {
            question: "Will there be opportunities to meet investors?",
            answer:
              "Yes, several investors will be present at the summit, particularly during the networking sessions and after the pitch competition.",
          },
          {
            question: "Can I get a certificate of participation?",
            answer: "Yes, all registered participants will receive a certificate of participation.",
          },
        ],
      },
    ]
  
    // Find the event by ID
    const event = events.find((e) => e.id === eventId)
  
    if (!event) {
      // Handle event not found
      alert("Event not found!")
      window.location.href = "events.html"
      return
    }
  
    // Function to format date
    function formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("en-US", options)
    }
  
    // Update page title
    document.title = `${event.name} - College Portal`
  
    // Update breadcrumb
    document.getElementById("eventBreadcrumb").textContent = event.name
  
    // Update banner
    const eventBanner = document.getElementById("eventBanner")
    eventBanner.style.backgroundImage = `url(${event.image})`
  
    // Update event details
    document.getElementById("eventName").textContent = event.name
    document.getElementById("eventType").textContent = event.type.charAt(0).toUpperCase() + event.type.slice(1)
    document.getElementById("eventDates").textContent =
      formatDate(event.startDate) + (event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : "")
    document.getElementById("eventLocation").textContent = event.location
    document.getElementById("eventDescription").textContent = event.description
    document.getElementById("eventStartDate").textContent = formatDate(event.startDate)
    document.getElementById("eventEndDate").textContent = formatDate(event.endDate)
    document.getElementById("eventLocationSidebar").textContent = event.location
    document.getElementById("eventOrganizer").textContent = event.organizer
    document.getElementById("registrationDeadline").textContent = formatDate(event.registrationDeadline)
  
    // Update contact information
    document.getElementById("contactEmail").textContent = event.contact.email
    document.getElementById("contactEmail").href = `mailto:${event.contact.email}`
    document.getElementById("contactPhone").textContent = event.contact.phone
    document.getElementById("contactWebsite").textContent = event.contact.website
    document.getElementById("contactWebsite").href = `https://${event.contact.website}`
  
    // Update tags
    const tagsContainer = document.getElementById("eventTags")
    tagsContainer.innerHTML = ""
    event.tags.forEach((tag) => {
      tagsContainer.innerHTML += `<span class="badge bg-light text-dark me-1 mb-1">#${tag}</span>`
    })
  
    // Update schedule
    const scheduleContainer = document.getElementById("eventSchedule")
    scheduleContainer.innerHTML = ""
  
    event.schedule.forEach((day) => {
      const dayElement = document.createElement("div")
      dayElement.className = "mb-4"
  
      dayElement.innerHTML = `<h5 class="mb-3">${day.day}</h5>`
  
      day.events.forEach((item) => {
        dayElement.innerHTML += `
                  <div class="timeline-item">
                      <h6 class="mb-1">${item.time}</h6>
                      <div class="d-flex">
                          <div>
                              <strong>${item.title}</strong>
                              <p class="mb-0 text-muted">${item.description}</p>
                          </div>
                      </div>
                  </div>
              `
      })
  
      scheduleContainer.appendChild(dayElement)
    })
  
    // Update speakers/performers
    const speakersContainer = document.getElementById("speakersContainer")
    const speakersTitle = document.getElementById("speakersTitle")
  
    // Change title based on event type
    speakersTitle.textContent = event.type === "fest" ? "Speakers & Performers" : "Instructors"
  
    speakersContainer.innerHTML = ""
  
    event.speakers.forEach((speaker) => {
      speakersContainer.innerHTML += `
              <div class="col-md-6 col-lg-3 mb-4">
                  <div class="card h-100 speaker-card">
                      <img src="${speaker.image}" class="card-img-top rounded-circle mx-auto mt-3" alt="${speaker.name}" style="width: 120px; height: 120px; object-fit: cover;">
                      <div class="card-body text-center">
                          <h5 class="card-title mb-1">${speaker.name}</h5>
                          <p class="card-text text-muted mb-2">${speaker.title}</p>
                          <p class="card-text small">${speaker.bio}</p>
                      </div>
                  </div>
              </div>
          `
    })
  
    // Update gallery
    const galleryContainer = document.getElementById("galleryContainer")
    galleryContainer.innerHTML = ""
  
    event.gallery.forEach((item) => {
      galleryContainer.innerHTML += `
              <div class="col-md-4 mb-4">
                  <div class="card h-100">
                      <img src="${item.image}" class="card-img-top gallery-img" alt="${item.caption}">
                      <div class="card-body">
                          <p class="card-text text-center small">${item.caption}</p>
                      </div>
                  </div>
              </div>
          `
    })
  
    // Update FAQs
    const faqAccordion = document.getElementById("faqAccordion")
    faqAccordion.innerHTML = ""
  
    event.faqs.forEach((faq, index) => {
      faqAccordion.innerHTML += `
              <div class="accordion-item">
                  <h2 class="accordion-header" id="faqHeading${index}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse${index}" aria-expanded="false" aria-controls="faqCollapse${index}">
                          ${faq.question}
                      </button>
                  </h2>
                  <div id="faqCollapse${index}" class="accordion-collapse collapse" aria-labelledby="faqHeading${index}" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                          ${faq.answer}
                      </div>
                  </div>
              </div>
          `
    })
  
    // Update registration button
    const registrationBtnContainer = document.getElementById("registrationBtnContainer")
    const registrationStatusCard = document.getElementById("registrationStatusCard")
  
    if (event.status === "open") {
      registrationBtnContainer.innerHTML = `
              <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#registrationModal">
                  Register Now
              </button>
          `
      registrationStatusCard.style.display = "none"
    } else if (event.status === "closed") {
      registrationBtnContainer.innerHTML = `
              <button class="btn btn-secondary btn-lg" disabled>
                  Registration Closed
              </button>
          `
      registrationStatusCard.style.display = "none"
    } else if (event.status === "registered") {
      registrationBtnContainer.innerHTML = `
              <button class="btn btn-success btn-lg" disabled>
                  <i class="bi bi-check-circle-fill me-2"></i> Registered
              </button>
          `
      registrationStatusCard.style.display = "block"
      document.getElementById("registrationId").textContent = "REG" + Math.floor(10000 + Math.random() * 90000)
      document.getElementById("registrationDate").textContent = formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // 7 days ago
    }
  
    // Handle registration form submission
    const submitRegistrationBtn = document.getElementById("submitRegistration")
    submitRegistrationBtn.addEventListener("click", () => {
      const form = document.getElementById("registrationForm")
  
      // Basic form validation
      const phone = document.getElementById("registrationPhone").value
      const department = document.getElementById("registrationDepartment").value
      const year = document.getElementById("registrationYear").value
      const terms = document.getElementById("registrationTerms").checked
  
      if (!phone || !department || !year || !terms) {
        alert("Please fill in all required fields and accept the terms and conditions.")
        return
      }
  
      // Generate registration ID
      const registrationId = "REG" + Math.floor(10000 + Math.random() * 90000)
      document.getElementById("successRegistrationId").textContent = registrationId
  
      // Hide registration modal and show success modal
      const registrationModal = bootstrap.Modal.getInstance(document.getElementById("registrationModal"))
      registrationModal.hide()
  
      const successModal = new bootstrap.Modal(document.getElementById("successModal"))
      successModal.show()
  
      // Update UI to show registered status
      event.status = "registered"
      registrationBtnContainer.innerHTML = `
              <button class="btn btn-success btn-lg" disabled>
                  <i class="bi bi-check-circle-fill me-2"></i> Registered
              </button>
          `
      registrationStatusCard.style.display = "block"
      document.getElementById("registrationId").textContent = registrationId
      document.getElementById("registrationDate").textContent = formatDate(new Date())
    })
  
    const registrationModalElement = document.getElementById("registrationModal")
    if (registrationModalElement) {
      registrationModalElement.addEventListener("show.bs.modal", (event) => {
        // Clear previous values
        document.getElementById("registrationPhone").value = ""
        document.getElementById("registrationDepartment").value = ""
        document.getElementById("registrationYear").value = ""
        document.getElementById("registrationTerms").checked = false
      })
    }
  
    // Initialize Bootstrap modals
    const bootstrap = window.bootstrap
  })
  
  