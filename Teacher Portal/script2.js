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

    function setupGradebookPage() {
        const pageContent = document.querySelector('.gradebook-controls');
        if (!pageContent) return; // Only run on gradebook page
    
        const loadBtn = document.getElementById('load-grades-btn');
        const saveBtn = document.querySelector('.save-grades-btn');
        const maxMarksInput = document.getElementById('max-marks');
        const gradeSheetContent = document.getElementById('grade-sheet-content');
        const importBtn = document.getElementById('import-grades-btn');
        const gradesFileInput = document.getElementById('grades-file-input');
    
        const avgDisplay = document.getElementById('class-average');
        const highestDisplay = document.getElementById('highest-score');
        const lowestDisplay = document.getElementById('lowest-score');
    
        const updateGradeStats = () => {
            const marksInputs = document.querySelectorAll('.marks-input');
            const maxMarks = parseInt(maxMarksInput.value, 10) || 100;
            let totalMarks = 0;
            let validEntries = 0;
            let scores = [];
    
            marksInputs.forEach(input => {
                const valueStr = input.value;
                if (valueStr === '') {
                    input.classList.remove('invalid');
                    return; // Skip empty inputs
                }
    
                const value = parseInt(valueStr, 10);
                if (isNaN(value) || value < 0 || value > maxMarks) {
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                    totalMarks += value;
                    validEntries++;
                    scores.push(value);
                }
            });
    
            if (validEntries > 0) {
                avgDisplay.textContent = (totalMarks / validEntries).toFixed(1);
                highestDisplay.textContent = Math.max(...scores);
                lowestDisplay.textContent = Math.min(...scores);
            } else {
                avgDisplay.textContent = '-';
                highestDisplay.textContent = '-';
                lowestDisplay.textContent = '-';
            }
        };

        if (importBtn && gradesFileInput) {
            importBtn.addEventListener('click', () => {
                gradesFileInput.click(); // Trigger the hidden file input
            });
    
            gradesFileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    alert(`File "${file.name}" selected.\n\nIn a real application, this file would be processed to populate the grade sheet. This requires a library to parse Excel/CSV files.`);
                    // To allow selecting the same file again
                    event.target.value = ''; 
                }
            });
        }
    
        loadBtn.addEventListener('click', () => {
            alert('Loading grade sheet...');
            gradeSheetContent.classList.remove('hidden');
            
            document.querySelectorAll('.marks-input').forEach(input => {
                input.addEventListener('input', updateGradeStats);
            });
            maxMarksInput.addEventListener('input', updateGradeStats);
            updateGradeStats(); // Initial calculation for pre-filled values
        });
    
        saveBtn.addEventListener('click', () => {
            if (document.querySelectorAll('.marks-input.invalid').length > 0) {
                alert('Please correct the invalid marks (highlighted in red) before saving.');
                return;
            }
            alert('Grades have been saved successfully!');
        });
    }

    //================================================
    // PAGE-SPECIFIC LOGIC: Teacher's Own Attendance Page
    //================================================
    function setupTeacherAttendancePage() {
        // --- Get Page Elements ---
        const page = document.querySelector('.teacher-attendance-page');
        if (!page) return; // Only run on the correct page

        // Modal elements
        const markAttendanceBtn = document.getElementById('mark-attendance-btn');
        const modalOverlay = document.getElementById('mark-attendance-modal');
        const closeModalBtn = modalOverlay.querySelector('.modal-close-btn');
        const submitBtn = document.getElementById('submit-teacher-attendance');

        // Form elements
        const teacherNameDisplay = document.getElementById('teacher-name-display');
        const attendanceHistoryTableBody = document.querySelector('.attendance-history-table tbody');

        // Main page calendar elements
        const calendarContainer = document.querySelector('.calendar-grid');
        const monthYearDisplay = document.getElementById('calendar-month-year');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');

        // Modal calendar elements
        const modalCalendarContainer = document.getElementById('modal-calendar-container');
        const displaySelectedDate = document.getElementById('display-selected-date');
        const modalMonthYear = document.getElementById('modal-month-year');
        const modalPrevBtn = document.getElementById('modal-prev-month-btn');
        const modalNextBtn = document.getElementById('modal-next-month-btn');
        const modalCalendarGrid = modalCalendarContainer.querySelector('.mini-calendar-grid');
        const hiddenDateInput = document.getElementById('attendance-date'); // Repurposed as hidden input
        const remarksGroup = document.getElementById('remarks-group');
        const remarksInput = document.getElementById('attendance-remarks');
        const statusRadios = modalOverlay.querySelectorAll('input[name="teacher-status"]');


        let mainCalendarDate = new Date();
        let modalCalendarDate = new Date();
        let selectedDate = new Date();

        // --- Modal Open/Close Logic ---
        markAttendanceBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('hidden');
            // Reset form on open
            remarksGroup.style.display = 'none';
            remarksInput.value = '';
            document.querySelector('input[name="teacher-status"][value="P"]').checked = true;

            modalCalendarDate = new Date();
            selectedDate = new Date();
            generateModalCalendar(modalCalendarDate);
        });

        closeModalBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
        });

        // Show/hide remarks based on status
        statusRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'L' || radio.value === 'A') {
                    remarksGroup.style.display = 'flex';
                } else {
                    remarksGroup.style.display = 'none';
                }
            });
        });
        // --- Form & Submission Logic ---
        const username = localStorage.getItem('username');
        if (username) {
            teacherNameDisplay.textContent = username;
        }

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedDateValue = hiddenDateInput.value;
            const selectedStatusElement = document.querySelector('input[name="teacher-status"]:checked');
            const selectedStatus = selectedStatusElement ? selectedStatusElement.value : null;
            const remarks = remarksInput.value;

            if (!selectedDateValue) {
                alert('Please select a date from the calendar.');
                return;
            }

            alert(`Attendance submitted for ${username} on ${selectedDateValue}: ${selectedStatus}. Remarks: ${remarks || 'N/A'}`);
            modalOverlay.classList.add('hidden');

            const statusText = selectedStatus === 'P' ? 'Present' : selectedStatus === 'A' ? 'Absent' : 'Leave';
            const statusClass = selectedStatus === 'P' ? 'status-present' : selectedStatus === 'A' ? 'status-absent' : 'status-leave';
            const newRow = `<tr><td>${selectedDateValue}</td><td><span class="status-tag ${statusClass}">${statusText}</span></td><td>${remarks || '-'}</td></tr>`;
            attendanceHistoryTableBody.prepend(document.createRange().createContextualFragment(newRow));

            // In a real app, you'd refetch data and then call this.
            generateCalendar(mainCalendarDate);
        });

        // --- Modal Calendar Generation ---
        function generateModalCalendar(date) {
            if (!modalCalendarGrid || !modalMonthYear) return;

            modalCalendarGrid.innerHTML = '';
            const month = date.getMonth();
            const year = date.getFullYear();
            const today = new Date();

            modalMonthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

            const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            dayNames.forEach(day => {
                const dayNameEl = document.createElement('div');
                dayNameEl.className = 'mini-calendar-day-name';
                dayNameEl.textContent = day;
                modalCalendarGrid.appendChild(dayNameEl);
            });

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayOfMonth; i++) {
                const blankDate = document.createElement('div');
                blankDate.className = 'mini-calendar-date other-month';
                modalCalendarGrid.appendChild(blankDate);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const dateEl = document.createElement('div');
                dateEl.className = 'mini-calendar-date';
                dateEl.textContent = i;

                dateEl.addEventListener('click', () => {
                    if (dateEl.classList.contains('other-month')) return;
                    selectedDate = new Date(year, month, i);
                    const allDates = modalCalendarGrid.querySelectorAll('.mini-calendar-date');
                    allDates.forEach(d => d.classList.remove('selected'));
                    dateEl.classList.add('selected');

                    const yyyy = selectedDate.getFullYear();
                    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(selectedDate.getDate()).padStart(2, '0');
                    hiddenDateInput.value = `${yyyy}-${mm}-${dd}`;
                    displaySelectedDate.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                });

                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dateEl.classList.add('today');
                }
                if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                    dateEl.classList.add('selected');
                    const yyyy = selectedDate.getFullYear();
                    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(selectedDate.getDate()).padStart(2, '0');
                    hiddenDateInput.value = `${yyyy}-${mm}-${dd}`;
                    displaySelectedDate.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                }
                modalCalendarGrid.appendChild(dateEl);
            }
        }

        modalPrevBtn.addEventListener('click', () => {
            modalCalendarDate.setMonth(modalCalendarDate.getMonth() - 1);
            generateModalCalendar(modalCalendarDate);
        });

        modalNextBtn.addEventListener('click', () => {
            modalCalendarDate.setMonth(modalCalendarDate.getMonth() + 1);
            generateModalCalendar(modalCalendarDate);
        });

        // --- Main Calendar Generation Logic ---
        function generateCalendar(date) {
            if (!calendarContainer || !monthYearDisplay) return;

            calendarContainer.innerHTML = ''; // Clear previous calendar
            const month = date.getMonth();
            const year = date.getFullYear();
            const today = new Date();

            monthYearDisplay.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayNames.forEach(day => {
                const dayNameEl = document.createElement('div');
                dayNameEl.className = 'calendar-day-name';
                dayNameEl.textContent = day;
                calendarContainer.appendChild(dayNameEl);
            });

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayOfMonth; i++) {
                const blankDate = document.createElement('div');
                blankDate.className = 'calendar-date other-month';
                calendarContainer.appendChild(blankDate);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const dateEl = document.createElement('div');
                dateEl.className = 'calendar-date';
                dateEl.textContent = i;

                // Dummy logic for styling. In a real app, you'd check against saved attendance data.
                const dayOfWeek = new Date(year, month, i).getDay();
                if (dayOfWeek === 0) dateEl.classList.add('holiday');
                else if (i % 9 === 0) dateEl.classList.add('absent');
                else if (i % 7 === 0) dateEl.classList.add('leave');
                else if (i < 21) dateEl.classList.add('present');

                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dateEl.classList.add('today');
                }

                calendarContainer.appendChild(dateEl);
            }
        }

        if(prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
            mainCalendarDate.setMonth(mainCalendarDate.getMonth() - 1);
            generateCalendar(mainCalendarDate);
        });

        if(nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
            mainCalendarDate.setMonth(mainCalendarDate.getMonth() + 1);
            generateCalendar(mainCalendarDate);
        });

        // Initial main calendar generation
        generateCalendar(mainCalendarDate);
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

        const chatPlaceholder = document.getElementById('chat-placeholder');
        const activeChatWindow = document.getElementById('active-chat-window');

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

        // Helper to render participants grouped by role (Student, Staff, Parent)
        const renderCategorizedParticipants = (container, idPrefix) => {
            container.innerHTML = '';
            const categories = { 'Student': [], 'Staff': [], 'Parent': [] };
            
            schoolDirectory.forEach(contact => {
                const role = contact.role.toLowerCase();
                if (role.includes('student')) categories['Student'].push(contact);
                else if (role.includes('parent')) categories['Parent'].push(contact);
                else categories['Staff'].push(contact);
            });

            Object.keys(categories).forEach(cat => {
                if (categories[cat].length > 0) {
                    const header = document.createElement('h5');
                    header.textContent = `${cat}s`;
                    header.style.margin = '10px 0 5px';
                    header.style.color = '#555';
                    header.style.borderBottom = '1px solid #eee';
                    header.style.paddingBottom = '2px';
                    container.appendChild(header);

                    categories[cat].forEach(contact => {
                        const uniqueId = `${idPrefix}-${contact.name.replace(/\s+/g, '-')}`;
                        const item = document.createElement('div');
                        item.className = 'participant-item';
                        item.innerHTML = `<input type="checkbox" id="${uniqueId}" value="${contact.name}">
                                          <label for="${uniqueId}">${contact.name} <small style="color:#777;">(${contact.role})</small></label>`;
                        container.appendChild(item);
                    });
                }
            });
        };

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

        // --- Group Creation Logic ---
        const createGroupBtn = document.getElementById('create-group-btn');
        const createGroupModal = document.getElementById('create-group-modal');
        const closeGroupModal = createGroupModal ? createGroupModal.querySelector('.modal-close-btn') : null;
        const createGroupForm = document.getElementById('create-group-form');
        const participantsListContainer = document.getElementById('participants-list');

        if (createGroupBtn && createGroupModal) {
            // Open Modal
            createGroupBtn.addEventListener('click', () => {
                // Populate participants list
                if (participantsListContainer) {
                    renderCategorizedParticipants(participantsListContainer, 'create-group');
                }
                createGroupModal.classList.remove('hidden');
            });

            // Close Modal
            if (closeGroupModal) {
                closeGroupModal.addEventListener('click', () => createGroupModal.classList.add('hidden'));
            }
            window.addEventListener('click', (e) => {
                if (e.target === createGroupModal) createGroupModal.classList.add('hidden');
            });

            // Handle Form Submission
            if (createGroupForm) {
                createGroupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const groupNameInput = document.getElementById('group-name-input');
                    const groupName = groupNameInput.value.trim();
                    const selectedParticipants = Array.from(participantsListContainer.querySelectorAll('input:checked'))
                                                      .map(input => input.value);

                    if (!groupName) {
                        alert('Please enter a group name.');
                        return;
                    }

                    if (selectedParticipants.length < 1) {
                        alert('Please select at least one participant.');
                        return;
                    }

                    const currentUser = localStorage.getItem('username') || 'You';
                    selectedParticipants.unshift(currentUser);

                    const groupItem = document.createElement('li');
                    groupItem.className = 'contact-item';
                    groupItem.dataset.name = groupName;
                    groupItem.dataset.members = JSON.stringify(selectedParticipants); // Save members
                    groupItem.dataset.role = `${selectedParticipants.length} members`;
                    groupItem.dataset.type = 'group';

                    groupItem.innerHTML = `
                        <div class="profile-pic">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div class="contact-details">
                            <h4>${groupName}</h4>
                            <p>${selectedParticipants.length} members</p>
                        </div>
                    `;
                    contactList.prepend(groupItem);

                    groupItem.addEventListener('click', () => {
                        if (groupItem.classList.contains('active')) {
                            groupItem.classList.remove('active');
                            activeChatWindow.classList.add('hidden');
                            chatPlaceholder.classList.remove('hidden');
                        } else {
                            chatPlaceholder.classList.add('hidden');
                            activeChatWindow.classList.remove('hidden');
                            document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('active'));
                            groupItem.classList.add('active');
                            document.getElementById('chat-header-name').textContent = groupItem.dataset.name;
                            document.getElementById('chat-header-role').textContent = groupItem.dataset.role;
                        }
                    });

                    createGroupModal.classList.add('hidden');
                    createGroupForm.reset();

                    alert(`Group "${groupName}" created successfully!`);
                });
            }
        }

        // --- Group Info Panel Logic ---
        const moreOptionsBtn = document.getElementById('chat-more-options-btn');
        const groupInfoPanel = document.getElementById('group-info-panel');
        const closeGroupInfoBtn = document.getElementById('close-group-info-btn');

        if (moreOptionsBtn && groupInfoPanel && closeGroupInfoBtn) {
            moreOptionsBtn.addEventListener('click', () => {
                const activeContact = document.querySelector('.contact-item.active');
                if (activeContact && activeContact.dataset.type === 'group') {
                    // It's a group, show the panel
                    document.getElementById('info-panel-group-name').textContent = activeContact.dataset.name;
                    document.getElementById('info-panel-member-count').textContent = activeContact.dataset.role;
                    
                    // Dummy participants for now
                    const participantsListEl = document.getElementById('info-panel-participants-list');
                    participantsListEl.innerHTML = ''; // Clear existing
                    
                    const currentUser = localStorage.getItem('username') || 'You';
                    let groupMembers = [];

                    // Try to get members from dataset, otherwise default
                    if (activeContact.dataset.members) {
                        try {
                            groupMembers = JSON.parse(activeContact.dataset.members);
                        } catch(e) { console.error("Error parsing members", e); }
                    }
                    
                    // If no members found (e.g. dummy group), use default
                    if (groupMembers.length === 0) {
                        groupMembers = [currentUser, 'Aarav Sharma'];
                    }

                    // Function to create participant list item
                    const addParticipantToPanel = (name, role, canRemove = false) => {
                        const li = document.createElement('li');
                        li.style.display = 'flex';
                        li.style.justifyContent = 'space-between';
                        li.style.alignItems = 'center';
                        
                        const infoDiv = document.createElement('div');
                        infoDiv.innerHTML = `<span class="participant-name" style="display:block; font-weight:500;">${name}</span>
                                             <span class="participant-role" style="font-size:0.85em; color:#666;">${role}</span>`;
                        li.appendChild(infoDiv);

                        if (canRemove) {
                            const removeBtn = document.createElement('button');
                            removeBtn.innerHTML = '<i class="fa-solid fa-user-minus"></i>';
                            removeBtn.className = 'btn-icon-danger'; // Assuming this class or style appropriately
                            removeBtn.style.color = '#dc3545';
                            removeBtn.style.background = 'none';
                            removeBtn.style.border = 'none';
                            removeBtn.style.cursor = 'pointer';
                            removeBtn.title = 'Remove Participant';
                            removeBtn.addEventListener('click', () => {
                                li.remove();
                                updateGroupMemberCount(-1);
                            });
                            li.appendChild(removeBtn);
                        }
                        participantsListEl.appendChild(li);
                    };

                    // Render Members
                    groupMembers.forEach(member => {
                        const isAdmin = (member === currentUser);
                        const role = isAdmin ? 'Admin' : 'Member';
                        // Admin cannot be removed, others can
                        addParticipantToPanel(member, role, !isAdmin);
                    });

                    groupInfoPanel.classList.remove('hidden');
                } else {
                    alert('More options for individual chats are coming soon!');
                }
            });

            // Helper to update member count text
            function updateGroupMemberCount(change) {
                const activeContact = document.querySelector('.contact-item.active');
                const countDisplay = document.getElementById('info-panel-member-count');
                if (activeContact && countDisplay) {
                    let currentText = countDisplay.textContent;
                    let count = parseInt(currentText) || 0;
                    count += change;
                    const newText = `${count} members`;
                    countDisplay.textContent = newText;
                    activeContact.dataset.role = newText;
                    activeContact.querySelector('p').textContent = newText;
                    document.getElementById('chat-header-role').textContent = newText;
                }
            }

            // --- Leave Group Logic ---
            const leaveGroupBtn = document.getElementById('leave-group-btn');
            if (leaveGroupBtn) {
                // Remove old listener to prevent duplicates if function reruns
                const newLeaveBtn = leaveGroupBtn.cloneNode(true);
                leaveGroupBtn.parentNode.replaceChild(newLeaveBtn, leaveGroupBtn);
                
                newLeaveBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to leave this group?')) {
                        const activeContact = document.querySelector('.contact-item.active');
                        if (activeContact) activeContact.remove();
                        groupInfoPanel.classList.add('hidden');
                        activeChatWindow.classList.add('hidden');
                        chatPlaceholder.classList.remove('hidden');
                    }
                });
            }

            // --- Add Participant Logic ---
            const addParticipantBtn = document.getElementById('add-participant-btn');
            const addParticipantModal = document.getElementById('add-participant-modal');
            const addParticipantForm = document.getElementById('add-participant-form');
            const closeAddModalBtn = addParticipantModal ? addParticipantModal.querySelector('.modal-close-btn') : null;

            if (addParticipantBtn && addParticipantModal) {
                addParticipantBtn.addEventListener('click', () => {
                    // Fetch the list container dynamically to ensure it exists
                    const listContainer = document.getElementById('add-participants-list');
                    if (listContainer) {
                        renderCategorizedParticipants(listContainer, 'add-participant');
                    }
                    addParticipantModal.classList.remove('hidden');
                });

                if (closeAddModalBtn) {
                    closeAddModalBtn.addEventListener('click', () => addParticipantModal.classList.add('hidden'));
                }

                if (addParticipantForm) {
                    // Prevent duplicate listeners
                    const newForm = addParticipantForm.cloneNode(true);
                    addParticipantForm.parentNode.replaceChild(newForm, addParticipantForm);

                    newForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const listContainer = document.getElementById('add-participants-list');
                        const selectedParticipants = Array.from(listContainer.querySelectorAll('input:checked'))
                                                          .map(input => input.value);
                        
                        if (selectedParticipants.length > 0) {
                            const participantsListEl = document.getElementById('info-panel-participants-list');
                            const activeContact = document.querySelector('.contact-item.active');
                            
                            // Update dataset.members
                            let currentMembers = [];
                            if (activeContact && activeContact.dataset.members) {
                                try { currentMembers = JSON.parse(activeContact.dataset.members); } catch(e){}
                            }

                            selectedParticipants.forEach(name => {
                                // Add to data if not exists
                                if (!currentMembers.includes(name)) {
                                    currentMembers.push(name);
                                }

                                // Add using the helper defined above (need to redefine or access scope)
                                // Since scope is tricky with cloneNode, we'll manually append here or ensure helper is accessible.
                                // Re-implementing append logic here for safety:
                                const li = document.createElement('li');
                                li.style.display = 'flex';
                                li.style.justifyContent = 'space-between';
                                li.style.alignItems = 'center';
                                
                                const infoDiv = document.createElement('div');
                                infoDiv.innerHTML = `<span class="participant-name" style="display:block; font-weight:500;">${name}</span>
                                                    <span class="participant-role" style="font-size:0.85em; color:#666;">Member</span>`;
                                li.appendChild(infoDiv);

                                const removeBtn = document.createElement('button');
                                removeBtn.innerHTML = '<i class="fa-solid fa-user-minus"></i>';
                                removeBtn.style.color = '#dc3545';
                                removeBtn.style.background = 'none';
                                removeBtn.style.border = 'none';
                                removeBtn.style.cursor = 'pointer';
                                removeBtn.title = 'Remove Participant';
                                removeBtn.addEventListener('click', () => {
                                    li.remove();
                                    updateGroupMemberCount(-1);
                                });
                                li.appendChild(removeBtn);
                                participantsListEl.appendChild(li);
                            });

                            // Save updated list back to contact item
                            if (activeContact) activeContact.dataset.members = JSON.stringify(currentMembers);
                            
                            updateGroupMemberCount(selectedParticipants.length);
                            addParticipantModal.classList.add('hidden');
                            alert(`${selectedParticipants.length} participant(s) added.`);
                        } else {
                            alert("Please select at least one contact to add.");
                        }
                    });
                }
            }

            closeGroupInfoBtn.addEventListener('click', () => {
                groupInfoPanel.classList.add('hidden');
            });

            // --- Edit Group Name Logic ---
            const editGroupNameBtn = document.getElementById('edit-group-name-btn');
            const groupNameDisplay = document.getElementById('info-panel-group-name');

            if (editGroupNameBtn && groupNameDisplay) {
                editGroupNameBtn.addEventListener('click', () => {
                    const currentName = groupNameDisplay.textContent;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentName;
                    input.className = 'group-name-input-editor';

                    groupNameDisplay.replaceWith(input);
                    input.focus();
                    input.select();

                    const saveName = () => {
                        const newName = input.value.trim();
                        const activeContact = document.querySelector('.contact-item.active');

                        if (newName && newName !== currentName && activeContact) {
                            // Update UI in all places
                            activeContact.dataset.name = newName;
                            activeContact.querySelector('h4').textContent = newName;
                            document.getElementById('chat-header-name').textContent = newName;
                            groupNameDisplay.textContent = newName;
                        } else {
                            groupNameDisplay.textContent = currentName; // Revert if empty or unchanged
                        }
                        input.replaceWith(groupNameDisplay);
                    };

                    input.addEventListener('blur', saveName);
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            saveName();
                        }
                    });
                });
            }
        }
    }

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
    setupTeacherAttendancePage(); // New function call
    setupGradebookPage();
    setupAnnouncementsPage();
    setupChatPage();
    setupFeesPage();
    setupDashboardCards();
});