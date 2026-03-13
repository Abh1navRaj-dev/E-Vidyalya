document.addEventListener('DOMContentLoaded', function() {
    //================================================
    // PERSONALIZATION: Greet user and set details
    //================================================
    function personalizeDashboard() {
        const username = localStorage.getItem('username');
        const gender = localStorage.getItem('gender');
        const userClass = localStorage.getItem('userClass');
        const userSection = localStorage.getItem('userSection');
        const userRoll = localStorage.getItem('userRoll');

        // Set user name in the navbar
        const userNameElement = document.getElementById('user-name');
        if (username && userNameElement) {
            userNameElement.textContent = `Name: ${username}`;
        }

        // Set student details in the navbar
        const userClassElement = document.getElementById('user-class');
        if (userClass && userClassElement) {
            userClassElement.textContent = `Class: ${userClass}`;
        }

        const userSecElement = document.getElementById('user-sec');
        if (userSection && userSecElement) {
            userSecElement.textContent = `Section: ${userSection}`;
        }

        const userRollElement = document.getElementById('user-roll');
        if (userRoll && userRollElement) {
            userRollElement.textContent = `Roll No: ${userRoll}`;
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
            optionsIcon.addEventListener('click', () => optionsMenu.classList.toggle('hidden'));

            // Close the menu if user clicks anywhere else on the page
            document.addEventListener('click', (event) => {
                if (!userOptionsContainer.contains(event.target)) {
                    optionsMenu.classList.add('hidden');
                }
            });
        }
    }

    //================================================
    // INTERACTIVITY: Handle subject tabs on Academic Records page
    //================================================
    function setupSubjectTabs() {
        const subjectTabs = document.querySelectorAll('.subject-tabs .tab');
        const recordsTableBody = document.querySelector('.records-table tbody');
        if (!subjectTabs.length || !recordsTableBody) return; // Only run if elements exist

        // --- Dummy Data for Academic Records ---
        const academicData = {
            math: [
                { exam: 'Unit Test 1', marks: '85 / 100', percentage: '85%', rank: '3rd' },
                { exam: 'Mid-Term Exam', marks: '78 / 100', percentage: '78%', rank: '5th' }
            ],
            physics: [
                { exam: 'Unit Test 1', marks: '92 / 100', percentage: '92%', rank: '1st' },
                { exam: 'Practical Exam', marks: '45 / 50', percentage: '90%', rank: '2nd' }
            ],
            chemistry: [
                { exam: 'Unit Test 1', marks: '88 / 100', percentage: '88%', rank: '2nd' }
            ],
            english: [
                { exam: 'Unit Test 1', marks: '75 / 100', percentage: '75%', rank: '8th' },
                { exam: 'Orals', marks: '22 / 25', percentage: '88%', rank: '4th' }
            ]
        };

        function renderRecords(subject) {
            // Clear existing rows
            recordsTableBody.innerHTML = '';

            const records = academicData[subject] || [];

            if (records.length === 0) {
                recordsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No records found for this subject.</td></tr>`;
                return;
            }

            records.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.exam}</td>
                    <td>${record.marks}</td>
                    <td>${record.percentage}</td>
                    <td>${record.rank}</td>
                    <td class="download-links">
                        <a href="#" title="Answer Key"><i class="fa-solid fa-key"></i></a>
                        <a href="#" title="Question Paper"><i class="fa-solid fa-file-lines"></i></a>
                    </td>
                `;
                recordsTableBody.appendChild(row);
            });
        }

        subjectTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                subjectTabs.forEach(t => t.classList.remove('active'));
                // Add active class to the clicked tab
                tab.classList.add('active');

                const subject = tab.dataset.subject;
                renderRecords(subject);
            });
        });

        // Initial render for the default active tab
        const initialSubject = document.querySelector('.subject-tabs .tab.active').dataset.subject;
        renderRecords(initialSubject);
    }

    //================================================
    // INTERACTIVITY: Handle assignment filters
    //================================================
    function setupAssignmentFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const assignmentCards = document.querySelectorAll('.assignment-card');
        if (!filterButtons.length) return; // Only run if filters exist

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;

                // Show/hide cards based on filter
                assignmentCards.forEach(card => {
                    if (filter === 'all' || card.dataset.status === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
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
                if (navbar.classList.contains('open') && !navbar.contains(event.target)) {
                    navbar.classList.remove('open');
                }
            });
        }
    }

    //================================================
    // FEATURE: Role-Based Visibility
    //================================================
    function setupRoleBasedVisibility() {
        const userRole = localStorage.getItem('userRole');
        // Define who IS allowed, not who is restricted.
        // This correctly handles null/undefined roles and is more secure.
        const allowedRoles = ['Admin', 'Principal'];
    
        // Hide Online Class feature if the user's role is NOT in the allowed list.
        if (!allowedRoles.includes(userRole)) {
            const onlineClassNavItem = document.querySelector('a[href="Online class.html"]');
            if (onlineClassNavItem) {
                onlineClassNavItem.parentElement.classList.add('hidden');
            }
            
            // Also hide the dashboard card if it exists
            const onlineClassCard = document.querySelector('[data-target="Online class.html"]');
            if (onlineClassCard) {
                onlineClassCard.style.display = 'none';
            }
        }
    }

    //================================================
    // FEATURE: Online Class (Jitsi Integration)
    //================================================
    function setupOnlineClass() {
        const classSetupDiv = document.querySelector('.online-class-setup');
        if (!classSetupDiv) {
            return; // Only run if on the online class page
        }

        const userRole = localStorage.getItem('userRole');
        // Define who IS allowed. This is more secure and handles null roles.
        const allowedRoles = ['Admin', 'Principal'];

        // If the user's role is NOT in the allowed list, show the R&D message.
        if (!allowedRoles.includes(userRole)) {
            const pageContent = classSetupDiv.parentElement;
            pageContent.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <i class="fa-solid fa-person-digging" style="font-size: 48px; color: var(--primary-color); margin-bottom: 20px;"></i>
                    <h2 style="font-size: 24px; color: var(--text-dark);">Feature Under R&D</h2>
                    <p style="margin-top: 15px; font-size: 16px; color: var(--text-muted); max-width: 600px; margin-left: auto; margin-right: auto;">
                        The Online Class feature is currently undergoing research and development to ensure the best experience. It is unavailable for your role at this moment.
                    </p>
                </div>
            `;
            return; // Stop execution for non-allowed roles
        }

        // The rest of the function only runs for permitted roles (Admin, Principal)
        const startBtn = document.getElementById('start-join-btn');
        const roomNameInput = document.getElementById('room-name');
        const jitsiContainer = document.getElementById('jitsi-container');
        const passwordInput = document.getElementById('room-password');
        const passwordContainer = document.getElementById('teacher-password-setup');

        // --- Role-based UI ---
        // This check is now simpler as we know the role is either Admin or Principal
        const isPrivilegedUser = userRole === 'Admin' || userRole === 'Principal';

        if (isPrivilegedUser) {
            if (passwordContainer) passwordContainer.classList.remove('hidden');
            startBtn.textContent = 'Start Secure Class';
        }

        startBtn.addEventListener('click', () => {
            const roomName = roomNameInput.value.trim();
            if (!roomName) {
                alert('Please enter a class name to start.');
                return;
            }

            const roomPassword = isPrivilegedUser ? passwordInput.value.trim() : null;

            // Hide the setup form and show the meeting container
            if (classSetupDiv) {
                classSetupDiv.classList.add('hidden');
            }
            jitsiContainer.classList.remove('hidden');

            // This is the crucial change for self-hosting.
            // Replace 'meet.jit.si' with the domain of YOUR Jitsi server.
            // For example: 'meet.your-school.com'
            const domain = 'meet.jit.si'; // <-- CHANGE THIS to your own server domain
            const options = {
                roomName: `E-Vidyalaya-${roomName}`, // Prefix to make room names more unique
                width: '100%',
                height: '100%',
                parentNode: jitsiContainer,
                userInfo: {
                    displayName: localStorage.getItem('username') || 'Guest'
                },
                configOverwrite: {
                    prejoinPageEnabled: false // Skip the pre-join screen for a smoother experience
                },
                interfaceConfigOverwrite: {
                   TILE_VIEW_MAX_COLUMNS: 4,
                }
            };

            // Create the Jitsi API instance
            const api = new JitsiMeetExternalAPI(domain, options);

            // If the user is a privileged user and set a password, lock the room upon joining
            if (isPrivilegedUser && roomPassword) {
                api.addEventListener('videoConferenceJoined', () => {
                    console.log('Privileged user joined, setting password...');
                    api.executeCommand('password', roomPassword);
                });
            }

            // Add a listener for when the meeting is over to clean up
            api.addEventListener('videoConferenceLeft', () => {
                api.dispose();
                jitsiContainer.classList.add('hidden');
                jitsiContainer.innerHTML = ''; // Clean up the container
                if (classSetupDiv) classSetupDiv.classList.remove('hidden'); // Show setup again
            });
        });
    }

    //================================================
    // FEATURE: Chat Page
    //================================================
    function setupChatPage() {
        const contactList = document.querySelector('.contact-list');
        if (!contactList) return; // Only run on chat page
        const chatPlaceholder = document.getElementById('chat-placeholder');
        const activeChatWindow = document.getElementById('active-chat-window');


        // --- Dummy Data for School Directory ---
        const schoolDirectory = [
            { name: 'Dr. Sharma', role: 'Principal', online: true },
            { name: 'Mrs. Gupta', role: 'Teacher', online: false },
            { name: 'Mr. Singh', role: 'Teacher', online: true },
            { name: 'Rohan Verma', role: 'Student', online: true },
            { name: 'Priya Mehra', role: 'Student', online: false },
            { name: 'Mr. Kumar', role: 'staff', online: true },
            { name: 'Anjali Desai', role: 'Parent', online: false },
        ];

        // Helper to render participants grouped by role (Student, Staff, Parent)
        const renderCategorizedParticipants = (container, idPrefix) => {
            container.innerHTML = '';
            const categories = { 'Student': [], 'Staff': [], 'Parent': [] };
            
            schoolDirectory.forEach(contact => {
                const role = contact.role.toLowerCase();
                if (role.includes('student')) categories['Student'].push(contact);
                else if (role.includes('parent')) categories['Parent'].push(contact);
                else categories['Staff'].push(contact); // Teachers and Principal will fall under Staff
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

        // --- Handle UI Interactions ---
        const allContactItems = document.querySelectorAll('.contact-item');

        allContactItems.forEach(item => {
            item.addEventListener('click', () => {
                // Check if the clicked item is already active
                if (item.classList.contains('active')) {
                    // It's the second click, so deselect and show placeholder
                    item.classList.remove('active');
                    activeChatWindow.classList.add('hidden');
                    chatPlaceholder.classList.remove('hidden');
                } else {
                    // It's the first click, so select and show chat window
                    chatPlaceholder.classList.add('hidden');
                    activeChatWindow.classList.remove('hidden');

                    // Update active contact in the list
                    allContactItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');

                    // Update chat header
                    const name = item.dataset.name;
                    const role = item.dataset.role;
                    document.getElementById('chat-header-name').textContent = name;
                    document.getElementById('chat-header-role').textContent = role;

                    // Attach call logic to the call button
                    const callBtn = document.getElementById('chat-call-btn');
                    const newCallBtn = callBtn.cloneNode(true); // Clone to remove old listeners
                    callBtn.parentNode.replaceChild(newCallBtn, callBtn);

                    newCallBtn.addEventListener('click', () => handleCallRequest(name, role));
                }
            });
        });

        // --- Search/Filter Logic ---
        const searchInput = document.getElementById('contact-search-input');
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

        // --- Message Handling (Send, Edit, Delete, Unsend) ---
        const messageArea = document.querySelector('.message-area');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message-btn');

        // Function to create a new message element
        function createMessageElement(text, type) {
            const wrapper = document.createElement('div');
            wrapper.className = `message-wrapper ${type}`;

            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            wrapper.innerHTML = `
                <div class="message ${type}">
                    <p>${text}</p>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="message-options-btn"><i class="fa-solid fa-ellipsis-vertical"></i></div>
            `;
            return wrapper;
        }

        // Send Message Function
        function sendMessage() {
            const text = messageInput.value.trim();
            if (text) {
                const msgElement = createMessageElement(text, 'sent');
                messageArea.appendChild(msgElement);
                messageInput.value = '';
                messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
            }
        }

        // Event Listeners for Sending
        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        // Event Delegation for Message Options (Edit, Delete, Unsend)
        messageArea.addEventListener('click', (e) => {
            // First, check if the click is on a menu action button (most specific)
            if (e.target.tagName === 'BUTTON' && e.target.closest('.message-context-menu')) {
                const action = e.target.dataset.action;
                const wrapper = e.target.closest('.message-wrapper');
                const messageP = wrapper.querySelector('.message p');
                
                // Close the menu for instant feedback
                e.target.closest('.message-context-menu').remove();

                if (action === 'delete' || action === 'unsend') {
                    // SILENT DELETE: Just remove the element
                    wrapper.remove();
                } else if (action === 'edit') {
                    // SILENT EDIT: Replace text with an input field
                    const currentText = messageP.textContent;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentText;
                    input.className = 'edit-input';
                    
                    messageP.replaceWith(input);
                    input.focus();

                    // Save on Enter or Blur
                    const saveEdit = () => {
                        // Make sure the input is still part of the document
                        if (document.body.contains(input)) {
                            const newText = input.value.trim() || currentText; // Revert if empty
                            const newP = document.createElement('p');
                            newP.textContent = newText; // No "(edited)" tag is added
                            input.replaceWith(newP);
                        }
                    };

                    input.addEventListener('keypress', (ev) => {
                        if (ev.key === 'Enter') saveEdit();
                    });
                    input.addEventListener('blur', saveEdit);
                }
            }
            // Else, check if the click is on the three-dots button to open/toggle the menu
            else if (e.target.closest('.message-options-btn')) {
                const btn = e.target.closest('.message-options-btn');
                const isMenuOpen = btn.querySelector('.message-context-menu');

                // Always close all menus first
                document.querySelectorAll('.message-context-menu').forEach(menu => menu.remove());

                // If the menu for this button wasn't open, create and open it now
                if (!isMenuOpen) {
                    const wrapper = btn.closest('.message-wrapper');
                    const menu = document.createElement('div');
                    menu.className = 'message-context-menu';
                    
                    if (wrapper.classList.contains('sent')) {
                        menu.innerHTML = `
                            <button data-action="edit">Edit</button>
                            <button data-action="unsend">Unsend</button>
                            <button data-action="delete">Delete</button>
                        `;
                    } else {
                        menu.innerHTML = `
                            <button data-action="delete">Delete For Me</button>
                        `;
                    }

                    btn.appendChild(menu);
                    e.stopPropagation(); // Prevent the document-level click listener from closing it immediately
                }
            }
        });

        // Close menus when clicking elsewhere
        document.addEventListener('click', () => {
            document.querySelectorAll('.message-context-menu').forEach(menu => menu.remove());
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

                    // Add click listener to the new group item to make it functional
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
                    
                    // Dummy participants logic replacement
                    const participantsListEl = document.getElementById('info-panel-participants-list');
                    participantsListEl.innerHTML = ''; // Clear existing
                    
                    const currentUser = localStorage.getItem('username') || 'You';
                    let groupMembers = [];

                    // Try to get members from dataset
                    if (activeContact.dataset.members) {
                        try {
                            groupMembers = JSON.parse(activeContact.dataset.members);
                        } catch(e) { console.error("Error parsing members", e); }
                    }
                    
                    // If no members found (e.g. dummy group), use default
                    if (groupMembers.length === 0) {
                        groupMembers = [currentUser, 'Rohan Verma'];
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

                        // For students, only the admin (creator) can remove others.
                        // We'll assume the current user is the admin for this demo.
                        if (canRemove) {
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
                        }
                        participantsListEl.appendChild(li);
                    };

                    // Render Members
                    groupMembers.forEach(member => {
                        const isAdmin = (member === currentUser);
                        const role = isAdmin ? 'Admin' : 'Member';
                        // Admin cannot be removed, others can (if current user is admin, but simplified here)
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
                // Prevent duplicate listeners
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
                                // Re-implementing append logic here for safety
                                const li = document.createElement('li');
                                li.style.display = 'flex';
                                li.style.justifyContent = 'space-between';
                                li.style.alignItems = 'center';
                                
                                const infoDiv = document.createElement('div');
                                infoDiv.innerHTML = `<span class="participant-name" style="display:block; font-weight:500;">${name}</span>
                                                    <span class="participant-role" style="font-size:0.85em; color:#666;">Member</span>`;
                                li.appendChild(infoDiv);

                                // Add to data if not exists
                                if (!currentMembers.includes(name)) {
                                    currentMembers.push(name);
                                }

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
                            // We prevent the default form submission behavior if it's inside a form
                            e.preventDefault();
                            saveName();
                        }
                    });
                });
            }
        }
    }

    function handleCallRequest(name, role) {
        const restrictedRoles = ['Teacher', 'Admin', 'Principal', 'staff'];

        if (restrictedRoles.includes(role)) {
            // Role requires a request first
            alert(`A call request has been sent to ${name} (${role}). You can call once they accept.`);
            console.log(`UI_INFO: Call request sent to ${name}.`);
        } else {
            // Role does not require a request (e.g., Student, Parent)
            alert(`Starting call with ${name} (${role})...`);
            console.log(`UI_INFO: Starting direct call with ${name}.`);
        }
    }

    //================================================
    // INTERACTIVITY: Dashboard Cards Navigation
    //================================================
    function setupDashboardCards() {
        // Find all elements that have a 'data-target' attribute. This is much more reliable.
        const cards = document.querySelectorAll('[data-target]');
        if (!cards.length) return;

        cards.forEach(card => {
            card.style.cursor = 'pointer'; // Add a visual cue that it's clickable
            card.addEventListener('click', () => {
                // Get the target page from the data-target attribute
                const target = card.dataset.target;
                if (target) {
                    window.location.href = target;
                }
            });
        });
    }

    //================================================
    // INTERACTIVITY: Dashboard Tabs Navigation
    //================================================
    function setupDashboardTabs() {
        // Specifically targets the tab buttons on the student dashboard
        const tabsContainer = document.querySelector('.tabs-container');
        if (!tabsContainer) return;

        const tabs = tabsContainer.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabText = tab.textContent.trim();
                let targetPage = '';

                switch(tabText) {
                    case 'My Grades':
                        targetPage = 'academic-records.html';
                        break;
                    case 'Attendance':
                        targetPage = 'Attendance.html';
                        break;
                    case 'Events':
                        targetPage = 'Announcement.html'; // Map "Events" to the announcements page
                        break;
                }

                if (targetPage) {
                    window.location.href = targetPage;
                }
            });
        });
    }

    // --- Initialize Page ---
    personalizeDashboard();
    setupOptionsMenu();
    setupSubjectTabs();
    setupAssignmentFilters();
    setupResponsiveNavbar();
    setupRoleBasedVisibility();
    setupOnlineClass();
    setupChatPage();
    setupDashboardCards();
    setupDashboardTabs();
});