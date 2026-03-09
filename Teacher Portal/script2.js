document.addEventListener('DOMContentLoaded', function() {

    //================================================
    // PERSONALIZATION: Greet user and set details
    //================================================
    function personalizeDashboard() {
        const username = localStorage.getItem('username');
        const gender = localStorage.getItem('gender');

        // Get teacher details from localStorage, captured after login
        const teacherId = localStorage.getItem('teacherId');
        const teacherSubjects = localStorage.getItem('teacherSubjects');
        const teacherClass = localStorage.getItem('teacherClass');

        // Set user name in the navbar
        const userNameElement = document.getElementById('user-name');
        if (username && userNameElement) {
            userNameElement.textContent = `Name: ${username}`;
        }

        // Set other teacher details
        const classTeacherElement = document.getElementById('user-class-teacher');
        if (teacherClass && classTeacherElement) {
            classTeacherElement.textContent = `Class Teacher: ${teacherClass}`;
        }
        const subjectsElement = document.getElementById('user-subjects');
        if (teacherSubjects && subjectsElement) {
            subjectsElement.textContent = `Subjects: ${teacherSubjects}`;
        }
        const idElement = document.getElementById('user-id');
        if (teacherId && idElement) {
            idElement.textContent = `Teacher ID: ${teacherId}`;
        }

        // Set welcome message in the main header
        const welcomeElement = document.getElementById('welcome-message');
        if (username && gender && welcomeElement) {
            const title = gender === 'male' ? 'Mr.' : 'Mrs.';
            welcomeElement.textContent = `Welcome! ${title} ${username}`;
        }
    }

    //================================================
    // INTERACTIVITY: Handle user options menu
    //================================================
    function setupOptionsMenu() {
        const optionsIcon = document.querySelector('.options-icon');
        const optionsMenu = document.querySelector('.options-menu');
        const userOptionsContainer = document.querySelector('.user-options');

        if (optionsIcon && optionsMenu && userOptionsContainer) {
            // Toggle menu visibility on icon click
            optionsIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsMenu.classList.toggle('hidden');
            });

            // Close the menu if user clicks anywhere else on the page
            document.addEventListener('click', (event) => {
                if (!userOptionsContainer.contains(event.target)) {
                    optionsMenu.classList.add('hidden');
                }
            });
        }
    }

    //================================================
    // INTERACTIVITY: Handle responsive navbar
    //================================================
    function setupResponsiveNavbar() {
        const menuToggle = document.getElementById('menu-toggle');
        const navbar = document.getElementById('navbar');
        const contentWrapper = document.querySelector('.content-wrapper');

        if (menuToggle && navbar) {
            menuToggle.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent this click from closing the menu immediately
                navbar.classList.toggle('open');
            });
        }

        // Close navbar when clicking on the main content area
        if (contentWrapper && navbar) {
            document.addEventListener('click', (event) => {
                if (navbar.classList.contains('open') && !navbar.contains(event.target) && event.target !== menuToggle) {
                    navbar.classList.remove('open');
                }
            });
        }
    }

    //================================================
    // PAGE-SPECIFIC LOGIC
    //================================================

    function setupMyClassesPage() {
        const classItems = document.querySelectorAll('.class-selector-item');
        if (!classItems.length) return;

        classItems.forEach(item => {
            item.addEventListener('click', () => {
                classItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                // In a real app, you'd fetch and render the student list for the selected class.
                alert(`Loading students for ${item.querySelector('h4').textContent}...`);
            });
        });
    }

    function setupAnnouncementsPage() {
        const postBtn = document.getElementById('post-announcement-btn');
        if (!postBtn) return;

        postBtn.addEventListener('click', () => {
            const title = document.getElementById('announcement-title').value;
            if (title) {
                alert(`Announcement "${title}" has been posted!`);
            } else {
                alert('Please enter a title for the announcement.');
            }
        });
    }

    function setupFeesPage() {
        const feeControls = document.querySelector('.fee-controls');
        if (!feeControls) return; // Only run on fees page

        const filterButtons = feeControls.querySelectorAll('.filter-btn');
        const classFilter = document.getElementById('class-select-fee');
        const studentRows = document.querySelectorAll('.fee-status-table tbody tr');
        const reminderButtons = document.querySelectorAll('.btn-reminder');

        function applyFilters() {
            const statusFilter = feeControls.querySelector('.filter-btn.active').dataset.filter;
            const classFilterValue = classFilter.value;

            studentRows.forEach(row => {
                const rowStatus = row.dataset.status;
                const rowClass = row.dataset.class;

                const statusMatch = (statusFilter === 'all' || rowStatus === statusFilter);
                const classMatch = (classFilterValue === 'all' || rowClass === classFilterValue);

                if (statusMatch && classMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                applyFilters();
            });
        });

        classFilter.addEventListener('change', applyFilters);

        reminderButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const studentName = row.querySelector('td:nth-child(2)').textContent;
                alert(`A fee reminder has been sent to ${studentName}.`);
            });
        });
    }

    function setupChatPage() {
        const contactList = document.querySelector('.contact-list');
        if (!contactList) return; // Only run on chat page

        // --- Dummy Data for School Directory ---
        const schoolDirectory = [
            { name: 'Dr. Sharma', role: 'Principal', online: true },
            { name: 'Aarav Sharma', role: 'Student (10-B)', online: true },
            { name: 'Diya Patel', role: 'Student (10-B)', online: false },
            { name: 'Rohan Verma', role: 'Student (10-C)', online: true },
            { name: 'Priya Mehra', role: 'Student (9-A)', online: false },
            { name: 'Mr. Kumar', role: 'staff', online: true },
            { name: 'Mrs. Sunita Patel', role: 'Parent', online: false },
        ];

        // --- Populate Contact List ---
        schoolDirectory.forEach(contact => {
            const contactItem = document.createElement('li');
            contactItem.className = 'contact-item';
            contactItem.dataset.name = contact.name;
            contactItem.dataset.role = contact.role;

            contactItem.innerHTML = `
                <div class="profile-pic">
                    <div class="status-indicator ${contact.online ? 'online' : 'offline'}"></div>
                </div>
                <div class="contact-details">
                    <h4>${contact.name}</h4>
                    <p>${contact.role}</p>
                </div>
            `;
            contactList.appendChild(contactItem);
        });

        // --- Handle UI Interactions (Copied & adapted from script1.js) ---
        const chatPlaceholder = document.getElementById('chat-placeholder');
        const activeChatWindow = document.getElementById('active-chat-window');
        const allContactItems = document.querySelectorAll('.contact-item');

        allContactItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    activeChatWindow.classList.add('hidden');
                    chatPlaceholder.classList.remove('hidden');
                } else {
                    chatPlaceholder.classList.add('hidden');
                    activeChatWindow.classList.remove('hidden');
                    allContactItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    document.getElementById('chat-header-name').textContent = item.dataset.name;
                    document.getElementById('chat-header-role').textContent = item.dataset.role;
                }
            });
        });

        // --- Search/Filter Logic ---
        const searchInput = document.getElementById('contact-search-input');
        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                const filter = searchInput.value.toLowerCase();
                allContactItems.forEach(item => {
                    const name = item.dataset.name.toLowerCase();
                    if (name.includes(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // --- Message Sending Logic ---
        const messageArea = document.querySelector('.message-area');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message-btn');

        function sendMessage() {
            const text = messageInput.value.trim();
            if (text && messageArea) {
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const msgElement = document.createElement('div');
                msgElement.className = 'message-wrapper sent';
                msgElement.innerHTML = `
                    <div class="message sent">
                        <p>${text}</p>
                        <span class="timestamp">${time}</span>
                    </div>
                    <div class="message-options-btn"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                `;
                messageArea.appendChild(msgElement);
                messageInput.value = '';
                messageArea.scrollTop = messageArea.scrollHeight;
            }
        }

        if (sendBtn) sendBtn.addEventListener('click', sendMessage);
        if (messageInput) messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    //================================================
    // INTERACTIVITY: Dashboard Cards Navigation
    //================================================
    function setupDashboardCards() {
        // The teacher dashboard uses '.dashboard-card'. This function makes them clickable.
        const cards = document.querySelectorAll('.dashboard-card');
        if (!cards.length) return;

        cards.forEach(card => {
            card.style.cursor = 'pointer'; // Add a visual cue that it's clickable
            card.addEventListener('click', () => {
                const h3 = card.querySelector('h3');
                if (!h3) return;
                
                const title = h3.textContent.trim();
                let target = '';

                // Map card titles to file paths
                if (title.includes('Manage Classes')) target = 'my-classes.html';
                else if (title.includes('Take Attendance')) target = 'attendance.html';
                else if (title.includes('Grade Assignments')) target = 'gradebook.html';
                else if (title.includes('Post Announcement')) target = 'announcements.html';

                if (target) {
                    window.location.href = target;
                }
            });
        });
    }

    // --- Initialize Page ---
    personalizeDashboard();
    setupOptionsMenu();
    setupResponsiveNavbar();
    setupMyClassesPage();
    setupAnnouncementsPage();
    setupChatPage();
    setupFeesPage();
    setupDashboardCards();
});