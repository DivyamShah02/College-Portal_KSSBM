// Mock API Data
const mockData = {
    // User data
    users: [
        { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'https://via.placeholder.com/40', status: 'online' },
        { id: 2, name: 'Sarah Williams', role: 'UI/UX Designer', avatar: 'https://via.placeholder.com/40', status: 'online' },
        { id: 3, name: 'Michael Brown', role: 'Developer', avatar: 'https://via.placeholder.com/40', status: 'away' },
        { id: 4, name: 'Emily Davis', role: 'Marketing', avatar: 'https://via.placeholder.com/40', status: 'busy' },
        { id: 5, name: 'Alex Johnson', role: 'Developer', avatar: 'https://via.placeholder.com/40', status: 'offline' }
    ],
    
    // Tasks data for Kanban board
    tasks: {
        todo: [
            { id: 1, title: 'Create wireframes for dashboard', description: 'Design initial wireframes for the new dashboard layout', category: 'Design', dueDate: '2023-10-15', assignee: 2 },
            { id: 2, title: 'Market research for new product', description: 'Conduct competitor analysis and identify market opportunities', category: 'Research', dueDate: '2023-10-20', assignee: 4 },
            { id: 3, title: 'Fix login page issue', description: 'Resolve the authentication error on the login page', category: 'Bug', dueDate: '2023-10-12', assignee: 3 },
            { id: 4, title: 'Implement dark mode', description: 'Add dark mode toggle and styling to the application', category: 'Feature', dueDate: '2023-10-25', assignee: 5 }
        ],
        inProgress: [
            { id: 5, title: 'User authentication system', description: 'Implement secure login and registration functionality', category: 'Feature', dueDate: '2023-10-18', assignee: 5 },
            { id: 6, title: 'Design system components', description: 'Create reusable UI components for the design system', category: 'Design', dueDate: '2023-10-14', assignee: 2 },
            { id: 7, title: 'API documentation', description: 'Document all API endpoints and usage examples', category: 'Documentation', dueDate: '2023-10-22', assignee: 3 }
        ],
        review: [
            { id: 8, title: 'Payment integration', description: 'Integrate payment gateway for subscription processing', category: 'Feature', dueDate: '2023-10-10', assignee: 1 },
            { id: 9, title: 'Landing page redesign', description: 'Redesign the landing page to improve conversion rate', category: 'Design', dueDate: '2023-10-08', assignee: 2 }
        ],
        done: [
            { id: 10, title: 'Email notification system', description: 'Implement email notifications for user actions', category: 'Feature', dueDate: '2023-10-05', assignee: 5 },
            { id: 11, title: 'Fix mobile responsiveness', description: 'Resolve layout issues on mobile devices', category: 'Bug', dueDate: '2023-10-03', assignee: 3 },
            { id: 12, title: 'Logo redesign', description: 'Create new logo variants for the brand refresh', category: 'Design', dueDate: '2023-10-01', assignee: 2 }
        ]
    },
    
    // Chat messages
    messages: [
        { id: 1, sender: 2, receiver: 1, text: 'Hi John, have you finished the wireframes for the new dashboard?', time: '10:30 AM', read: true },
        { id: 2, sender: 1, receiver: 2, text: 'Hey Sarah, I\'m working on them right now. Should be done by this afternoon.', time: '10:32 AM', read: true },
        { id: 3, sender: 2, receiver: 1, text: 'Great! The client meeting is tomorrow, so we need to have everything ready by end of day.', time: '10:35 AM', read: true },
        { id: 4, sender: 2, receiver: 1, text: 'Also, here\'s the document with the client\'s requirements.', time: '10:36 AM', read: true, attachment: { name: 'Client_Requirements.docx', type: 'document' } },
        { id: 5, sender: 1, receiver: 2, text: 'Thanks! I\'ll review it and make sure the wireframes align with their requirements.', time: '10:40 AM', read: true },
        { id: 6, sender: 1, receiver: 2, text: 'Do you want me to share the progress with the team in the design channel?', time: '10:41 AM', read: true },
        { id: 7, sender: 2, receiver: 1, text: 'Yes, that would be great. We can get some early feedback from the team.', time: '10:45 AM', read: false }
    ],
    
    // Calendar events
    events: [
        { id: 1, title: 'Team Meeting', start: '2023-10-10T15:00:00', end: '2023-10-10T16:00:00', category: 'meeting', participants: [1, 2, 3, 4, 5] },
        { id: 2, title: 'Client Presentation', start: '2023-10-11T10:00:00', end: '2023-10-11T11:30:00', category: 'meeting', participants: [1, 2, 4] },
        { id: 3, title: 'Project Deadline', start: '2023-10-15T00:00:00', end: '2023-10-15T23:59:59', category: 'deadline', participants: [1, 2, 3, 5] },
        { id: 4, title: 'Design Review', start: '2023-10-16T14:00:00', end: '2023-10-16T15:00:00', category: 'meeting', participants: [1, 2] },
        { id: 5, title: 'Marketing Strategy', start: '2023-10-18T11:00:00', end: '2023-10-18T12:30:00', category: 'meeting', participants: [1, 4] }
    ],
    
    // Documents
    documents: [
        { id: 1, name: 'Project Proposal.docx', type: 'Document', size: '245 KB', modified: '2023-10-07', owner: 1 },
        { id: 2, name: 'Q3 Budget.xlsx', type: 'Spreadsheet', size: '1.2 MB', modified: '2023-10-05', owner: 2 },
        { id: 3, name: 'Logo Design.png', type: 'Image', size: '3.5 MB', modified: '2023-10-04', owner: 4 },
        { id: 4, name: 'Client Contract.pdf', type: 'PDF', size: '2.1 MB', modified: '2023-10-03', owner: 3 },
        { id: 5, name: 'Marketing Presentation.pptx', type: 'Presentation', size: '5.7 MB', modified: '2023-10-02', owner: 5 }
    ],
    
    // Folders
    folders: [
        { id: 1, name: 'Project Files', files: 12, lastUpdated: '2023-10-05', owner: 1 },
        { id: 2, name: 'Marketing', files: 8, lastUpdated: '2023-10-03', owner: 4 },
        { id: 3, name: 'Design Assets', files: 15, lastUpdated: '2023-10-07', owner: 2 },
        { id: 4, name: 'Documentation', files: 6, lastUpdated: '2023-10-02', owner: 3 }
    ]
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
        });
    }
    
    // Tab navigation
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                const tabPane = document.querySelector(link.getAttribute('href'));
                if (tabPane) {
                    tabPane.classList.remove('show', 'active');
                }
            });
            
            // Add active class to clicked tab
            this.parentElement.classList.add('active');
            const targetPane = document.querySelector(this.getAttribute('href'));
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
        });
    });
    
    // Kanban board drag and drop
    setupKanbanDragAndDrop();
    
    // New Task Form
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', function() {
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const category = document.getElementById('taskCategory').value;
            const dueDate = document.getElementById('taskDueDate').value;
            const assignee = document.getElementById('taskAssignee').value;
            
            if (title) {
                // Create new task
                const newTask = {
                    id: mockData.tasks.todo.length + 1,
                    title: title,
                    description: description,
                    category: category,
                    dueDate: dueDate,
                    assignee: parseInt(assignee)
                };
                
                // Add to mock data
                mockData.tasks.todo.push(newTask);
                
                // Create task card
                const taskCard = createTaskCard(newTask);
                
                // Add to todo column
                const todoItems = document.getElementById('todo-items');
                if (todoItems) {
                    todoItems.appendChild(taskCard);
                }
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('newTaskModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Reset form
                document.getElementById('newTaskForm').reset();
            }
        });
    }
    
    // Calendar initialization
    initializeCalendar();
    
    // New Event Form
    const saveEventBtn = document.getElementById('saveEventBtn');
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', function() {
            const title = document.getElementById('eventTitle').value;
            const startDate = document.getElementById('eventStartDate').value;
            const startTime = document.getElementById('eventStartTime').value;
            const endDate = document.getElementById('eventEndDate').value;
            const endTime = document.getElementById('eventEndTime').value;
            const category = document.getElementById('eventCategory').value;
            
            if (title && startDate && endDate) {
                // Create new event
                const newEvent = {
                    id: mockData.events.length + 1,
                    title: title,
                    start: `${startDate}T${startTime || '00:00:00'}`,
                    end: `${endDate}T${endTime || '23:59:59'}`,
                    category: category,
                    participants: []
                };
                
                // Add to mock data
                mockData.events.push(newEvent);
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('newEventModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Reset form
                document.getElementById('newEventForm').reset();
                
                // Refresh calendar (in a real app)
                // refreshCalendar();
            }
        });
    }
});

// Kanban board drag and drop
function setupKanbanDragAndDrop() {
    const draggables = document.querySelectorAll('.kanban-item');
    const containers = document.querySelectorAll('.kanban-items');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });
    
    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Create task card
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'card kanban-item mb-2';
    card.draggable = true;
    
    // Get assignee info
    const assignee = mockData.users.find(user => user.id === task.assignee);
    
    // Get category class
    let categoryClass = 'bg-primary';
    switch(task.category) {
        case 'Bug':
            categoryClass = 'bg-danger';
            break;
        case 'Design':
            categoryClass = 'bg-info';
            break;
        case 'Research':
            categoryClass = 'bg-warning';
            break;
        case 'Documentation':
            categoryClass = 'bg-success';
            break;
    }
    
    card.innerHTML = `
        <div class="card-body">
            <span class="badge ${categoryClass} mb-2">${task.category}</span>
            <h6 class="card-title">${task.title}</h6>
            <p class="card-text small">${task.description}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Due: ${formatDate(task.dueDate)}</small>
                <img src="${assignee ? assignee.avatar : 'https://via.placeholder.com/30'}" alt="User" class="rounded-circle">
            </div>
        </div>
    `;
    
    // Add drag and drop event listeners
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });
    
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
    
    return card;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
}

// Initialize calendar
function initializeCalendar() {
    // This is a placeholder for calendar initialization
    // In a real application, you would use a library like FullCalendar
    
    // For the mini calendar, we'll just show the current month
    const miniCalendar = document.getElementById('mini-calendar');
    if (miniCalendar) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        miniCalendar.innerHTML = generateCalendarHTML(currentMonth, currentYear);
    }
    
    // For the main calendar, we'll show a simple month view
    const mainCalendar = document.getElementById('main-calendar');
    if (mainCalendar) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        mainCalendar.innerHTML = generateCalendarHTML(currentMonth, currentYear, true);
        
        // Update current month display
        const currentMonthElement = document.getElementById('current-month');
        if (currentMonthElement) {
            currentMonthElement.textContent = `${getMonthName(currentMonth)} ${currentYear}`;
        }
        
        // Add event listeners for month navigation
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        
        if (prevMonthBtn && nextMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                // Navigate to previous month
                // This would be implemented in a real application
            });
            
            nextMonthBtn.addEventListener('click', () => {
                // Navigate to next month
                // This would be implemented in a real application
            });
        }
        
        // Add event listeners for view switching
        const monthViewBtn = document.getElementById('month-view');
        const weekViewBtn = document.getElementById('week-view');
        const dayViewBtn = document.getElementById('day-view');
        
        if (monthViewBtn && weekViewBtn && dayViewBtn) {
            monthViewBtn.addEventListener('click', () => {
                // Switch to month view
                // This would be implemented in a real application
            });
            
            weekViewBtn.addEventListener('click', () => {
                // Switch to week view
                // This would be implemented in a real application
            });
            
            dayViewBtn.addEventListener('click', () => {
                // Switch to day view
                // This would be implemented in a real application
            });
        }
    }
}

// Generate calendar HTML
function generateCalendarHTML(month, year, includeEvents = false) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    let html = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                html += '<td></td>';
            } else if (day > daysInMonth) {
                html += '<td></td>';
            } else {
                const currentDate = new Date(year, month, day);
                const isToday = isDateToday(currentDate);
                const cellClass = isToday ? 'bg-light' : '';
                
                html += `<td class="${cellClass}">`;
                html += `<div class="calendar-day">${day}</div>`;
                
                if (includeEvents) {
                    // Add events for this day
                    const eventsForDay = getEventsForDay(currentDate);
                    eventsForDay.forEach(event => {
                        let eventClass = 'bg-primary';
                        switch(event.category) {
                            case 'deadline':
                                eventClass = 'bg-warning';
                                break;
                            case 'personal':
                                eventClass = 'bg-info';
                                break;
                            case 'reminder':
                                eventClass = 'bg-success';
                                break;
                        }
                        
                        html += `
                            <div class="calendar-event ${eventClass}">
                                <small>${event.title}</small>
                            </div>
                        `;
                    });
                }
                
                html += '</td>';
                day++;
            }
        }
        
        html += '</tr>';
        
        if (day > daysInMonth) {
            break;
        }
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    return html;
}

// Check if date is today
function isDateToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Get events for a specific day
function getEventsForDay(date) {
    return mockData.events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === date.getDate() &&
               eventDate.getMonth() === date.getMonth() &&
               eventDate.getFullYear() === date.getFullYear();
    });
}

// Get month name
function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}