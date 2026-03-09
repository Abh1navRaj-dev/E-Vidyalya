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
    // PAGE-SPECIFIC: Manage Users Table Search
    //================================================
    function setupUserSearch() {
        const searchInput = document.getElementById('user-search-input');
        // Only run this function if the search input exists on the page
        if (!searchInput) return;

        const tableBody = document.querySelector('table tbody');
        if (!tableBody) return;
        
        const tableRows = tableBody.querySelectorAll('tr');

        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();

            tableRows.forEach(row => {
                // Get all text content from the row and convert to lower case
                const rowText = row.textContent.toLowerCase();

                // If the row's text includes the search term, show it, otherwise hide it
                row.style.display = rowText.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    //================================================
    // PAGE-SPECIFIC: Manage Users Actions
    //================================================
    function setupUserManagement() {
        const addUserBtn = document.getElementById('add-user-btn');
        const modal = document.getElementById('add-user-modal');
        const closeModal = document.querySelector('.close-modal');
        const addUserForm = document.getElementById('add-user-form');
        const tableBody = document.querySelector('table tbody');

        // Open Modal
        if (addUserBtn && modal) {
            addUserBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        }

        // Close Modal
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => modal.classList.add('hidden'));
            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }

        // Handle Form Submit
        if (addUserForm && tableBody) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('new-user-name').value;
                const role = document.getElementById('new-user-role').value;
                const email = document.getElementById('new-user-email').value;

                // Create new row
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${name}</td>
                    <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${role}</td>
                    <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${email}</td>
                    <td style="padding: 15px; border-bottom: 1px solid #dee2e6;"><span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Active</span></td>
                    <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">
                        <button style="color: #007bff; background: none; border: none; cursor: pointer; margin-right: 10px;"><i class="fa-solid fa-pen"></i></button>
                        <button class="delete-btn" style="color: #dc3545; background: none; border: none; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;

                tableBody.appendChild(newRow);
                modal.classList.add('hidden');
                addUserForm.reset();
                alert(`${name} has been added successfully!`);
            });
        }

        // Handle Delete Buttons (Event Delegation)
        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                if (e.target.closest('.fa-trash')) {
                    if (confirm('Are you sure you want to remove this user?')) {
                        e.target.closest('tr').remove();
                    }
                }
            });
        }
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
    setupUserSearch();
    setupUserManagement();
    setupOtherPages();
});