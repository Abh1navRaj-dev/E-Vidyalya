document.addEventListener('DOMContentLoaded', function() {

    //================================================
    // PERSONALIZATION: Greet user and set details
    //================================================
    function personalizeDashboard() {
        const username = localStorage.getItem('username');
        const gender = localStorage.getItem('gender');

        // Set user name in the navbar
        const userNameElement = document.getElementById('user-name');
        if (username && userNameElement) {
            userNameElement.textContent = `Name: ${username}`;
        }

        // Set welcome message in the main header
        const welcomeElement = document.getElementById('welcome-message');
        if (username && gender && welcomeElement) {
            const title = gender === 'male' ? 'Mr.' : 'Mrs.';
            welcomeElement.textContent = `Welcome! ${title} ${username}`;
        } else if (username) {
            welcomeElement.textContent = `Welcome! ${username}`;
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
    // INTERACTIVITY: Dashboard Cards Navigation
    //================================================
    function setupDashboardCards() {
        const cards = document.querySelectorAll('.dashboard-card');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const h3 = card.querySelector('h3');
                if (!h3) return;

                const title = h3.textContent.trim();
                let targetPage = '';

                if (title.includes('User Management')) targetPage = 'manage-users.html';
                else if (title.includes('System Settings')) targetPage = 'system-settings.html';
                else if (title.includes('Generate Reports')) targetPage = 'reports.html';
                else if (title.includes('Database Backup')) targetPage = 'backup.html';

                if (targetPage) {
                    window.location.href = targetPage;
                }
            });
        });
    }

    //================================================
    // PAGE-SPECIFIC: Manage Users Page
    //================================================
    function setupManageUsersPage() {
        // --- SELECTORS ---
        const searchInput = document.getElementById('user-search-input');
        const roleFilter = document.getElementById('role-filter');
        const pageControls = document.querySelector('.page-controls');
        const tableBody = document.querySelector('table tbody');
        const addUserBtn = document.getElementById('add-user-btn');
        const modal = document.getElementById('add-user-modal');
        const closeModal = document.querySelector('.close-modal');
        const addUserForm = document.getElementById('add-user-form');

        // Only run if core elements exist
        if (!tableBody || !pageControls) return;

        const statusButtons = pageControls.querySelectorAll('.filter-btn');

        // --- FILTERING LOGIC ---
        function applyAllFilters() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const roleValue = roleFilter ? roleFilter.value.toLowerCase() : 'all';
            const activeStatusBtn = pageControls.querySelector('.filter-btn.active');
            const statusValue = activeStatusBtn ? activeStatusBtn.dataset.filter.toLowerCase() : 'all';

            const tableRows = tableBody.querySelectorAll('tr');

            tableRows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                const rowRole = (row.dataset.role || '').toLowerCase();
                const rowStatus = (row.dataset.status || '').toLowerCase();

                const searchMatch = rowText.includes(searchTerm);
                const roleMatch = (roleValue === 'all' || rowRole === roleValue);
                const statusMatch = (statusValue === 'all' || rowStatus === statusValue);

                if (searchMatch && roleMatch && statusMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // --- EVENT LISTENERS for filters ---
        if (searchInput) searchInput.addEventListener('keyup', applyAllFilters);
        if (roleFilter) roleFilter.addEventListener('change', applyAllFilters);

        statusButtons.forEach(button => {
            button.addEventListener('click', () => {
                statusButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                applyAllFilters();
            });
        });

        // --- USER MANAGEMENT ACTIONS ---

        // Open Modal
        if (addUserBtn && modal) {
            addUserBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        }

        // Close Modal logic
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => modal.classList.add('hidden'));
            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }

        // Handle Add User Form Submit
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('new-user-name').value;
                const role = document.getElementById('new-user-role').value;
                const email = document.getElementById('new-user-email').value;

                // Create new row element
                const newRow = document.createElement('tr');
                newRow.dataset.role = role;
                newRow.dataset.status = 'active';
                newRow.innerHTML = `
                    <td>${name}</td>
                    <td>${role}</td>
                    <td>${email}</td>
                    <td><span class="status-badge status-active">Active</span></td>
                    <td>
                        <button class="action-btn edit-btn"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;

                tableBody.appendChild(newRow);
                modal.classList.add('hidden');
                addUserForm.reset();

                // Re-apply filters to correctly show or hide the new user
                applyAllFilters();

                alert(`${name} has been added successfully!`);
            });
        }

        // Handle Delete Buttons (Event Delegation)
        tableBody.addEventListener('click', (e) => {
            if (e.target.closest('.fa-trash')) {
                if (confirm('Are you sure you want to remove this user?')) {
                    e.target.closest('tr').remove();
                }
            }
        });
    }

    //================================================
    // PAGE-SPECIFIC: Other Admin Pages
    //================================================
    function setupOtherPages() {
        // System Settings
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                alert('System settings have been saved successfully.');
            });
        }

        // Backup
        const createBackupBtn = document.getElementById('create-backup-btn');
        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', () => {
                alert('Database backup started. The file will download shortly.');
            });
        }

        const restoreBtns = document.querySelectorAll('.restore-btn');
        restoreBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if(confirm('Restoring will overwrite current data. Continue?')) {
                    alert('System restored from backup successfully.');
                }
            });
        });
    }

    // --- Initialize Page ---
    personalizeDashboard();
    setupOptionsMenu();
    setupResponsiveNavbar();
    setupDashboardCards();
    setupManageUsersPage();
    setupOtherPages();
});