document.addEventListener('DOMContentLoaded', function() {

    //================================================================
    // UTILITY: Show/Hide Password Fields
    //================================================================
    function setupPasswordToggles() {
        const toggleIcons = document.querySelectorAll('.toggle-password');
        toggleIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                } else {
                    input.type = 'password';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                }
            });
        });
    }

    //================================================================
    // LOGIC FOR: login-signup.html
    //================================================================

    // --- Dynamic Form Fields based on Role on login-signup.html ---
    const roleSelect = document.querySelector('#role_select');

    // This block now specifically targets the main login page
    if (roleSelect) { 
        // --- Remember Me Logic on Page Load ---
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember_me').checked = true;
        }

        const staffFields = document.querySelector('#staff-login-fields');

        // Function to toggle fields based on selected role
        const toggleLoginFields = () => {
            const selectedRole = roleSelect.value;

            if (selectedRole) { // If any role is selected
                if (staffFields) staffFields.classList.remove('hidden');
            } else { // No role selected yet
                if (staffFields) staffFields.classList.add('hidden');
            }
        };

        roleSelect.addEventListener('change', toggleLoginFields);
        toggleLoginFields(); // Run on page load to set initial state

        const loginButton = document.querySelector('.btn[type="submit"]');
        const forgotPasswordLink = document.getElementById('forgot-password-link');

        // --- Forgot Password Logic ---
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                const emailInput = document.getElementById('email');
                if (!emailInput || !emailInput.value) {
                    alert('Please enter your email address in the email field to reset your password.');
                    return;
                }
                alert(`A password reset link has been sent to ${emailInput.value}. Please check your inbox.`);
            });
        }

        // --- New Login Logic ---
        loginButton.addEventListener('click', async function(e) {
            e.preventDefault(); // Stop form from submitting

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Login failed. Please check your credentials.');
                }

                // --- Login Success ---
                alert('Login Successful! Redirecting to your dashboard...');

                // Save token and user info from the backend response
                localStorage.setItem('token', data.token);
                
                if (data.user) {
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userRole', data.user.role);
                } else {
                    console.error("Backend response missing 'user' object:", data);
                    throw new Error("Server returned incomplete data. Please update routes/auth.js and restart the server.");
                }
                // Note: Gender is not part of the user model, so it won't be saved here.

                // --- Handle Remember Me ---
                const rememberMeCheckbox = document.getElementById('remember_me');
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Clear any old student-specific data that might conflict
                localStorage.removeItem('studentId');
                localStorage.removeItem('userClass');
                localStorage.removeItem('userSection');
                localStorage.removeItem('userRoll');

                // --- Role-based Redirection ---
                const role = data.user.role;
                if (role === 'Student' || role === 'Parent') {
                    window.location.href = 'Student Portal/student.html';
                } else if (role === 'Teacher' || role === 'Principal') {
                    window.location.href = 'Teacher Portal/teacher.html';
                } else if (role === 'Admin') {
                    window.location.href = 'Admin Portal/admin.html';
                } else if (role === 'staff') {
                    window.location.href = 'Teacher Portal/teacher.html'; // Fallback for staff
                } else {
                    alert(`Login successful, but no dashboard is defined for role: ${role}.`);
                }

            } catch (error) {
                console.error('Login Error:', error);
                alert(error.message);
            }
        });
    }

    //================================================================
    // LOGIC FOR: Developer Access (login-signup.html)
    //================================================================
    const devBtn = document.getElementById('dev-access-btn');
    const devModal = document.getElementById('dev-login-modal');
    const closeDevModal = document.querySelector('.close-dev-modal');
    const devForm = document.getElementById('dev-login-form');

    if (devBtn && devModal) {
        // Open Modal
        devBtn.addEventListener('click', () => {
            devModal.classList.remove('hidden');
        });

        // Close Modal via X button
        if (closeDevModal) {
            closeDevModal.addEventListener('click', () => {
                devModal.classList.add('hidden');
            });
        }

        // Close Modal via clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === devModal) {
                devModal.classList.add('hidden');
            }
        });

        // Handle Login
        if (devForm) {
            devForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const devId = document.getElementById('dev_id').value;
                const prodId = document.getElementById('product_id').value;
                const pin = document.getElementById('dev_pin').value;

                // Hardcoded credentials
                if (devId === 'admin' && prodId === 'evidya' && pin === '1234') {
                    alert('Access Granted. Redirecting to Dev Dashboard...');
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid Developer Credentials. Please try again.');
                }
            });
        }
    }

    //================================================================
    // LOGIC FOR: student-details-login.html
    //================================================================
    const studentDetailsSubmitButton = document.getElementById('student-details-submit');
    if (studentDetailsSubmitButton) {
        studentDetailsSubmitButton.addEventListener('click', function(e) {
            e.preventDefault();

            // --- Validation for student details ---
            const fieldsToValidate = [
                { selector: '#student_id', name: 'Student ID' },
                { selector: '#student_class', name: 'Class' },
                { selector: '#student_section', name: 'Section' },
                { selector: '#student_roll', name: 'Roll No.' },
                { selector: '#session_year', name: 'Session Year' },
            ];

            for (const field of fieldsToValidate) {
                const element = document.querySelector(field.selector);
                if (!element || !element.value) {
                    alert(`Please fill out the ${field.name} field.`);
                    return;
                }
            }

            // --- Store student-specific info ---
            localStorage.setItem('studentId', document.querySelector('#student_id').value);
            localStorage.setItem('userClass', document.querySelector('#student_class').value);
            localStorage.setItem('userSection', document.querySelector('#student_section').value);
            localStorage.setItem('userRoll', document.querySelector('#student_roll').value);

            console.log("Student details saved. Redirecting to portal.");

            // --- Redirect to the final portal ---
            window.location.href = 'Student Portal/student.html';
        });
    }

    //================================================================
    // LOGIC FOR: teacher-details-login.html
    //================================================================
    const teacherDetailsSubmitButton = document.getElementById('teacher-details-submit');
    if (teacherDetailsSubmitButton) {
        teacherDetailsSubmitButton.addEventListener('click', function(e) {
            e.preventDefault();

            // --- Validation for teacher details ---
            const fieldsToValidate = [
                { selector: '#teacher_id', name: 'Teacher ID' },
                { selector: '#teacher_subjects', name: 'Subjects Taught' },
                { selector: '#class_teacher', name: 'Class Teacher' },
            ];

            for (const field of fieldsToValidate) {
                const element = document.querySelector(field.selector);
                if (!element || !element.value) {
                    alert(`Please fill out the ${field.name} field.`);
                    return;
                }
            }

            // --- Store teacher-specific info ---
            localStorage.setItem('teacherId', document.querySelector('#teacher_id').value);
            localStorage.setItem('teacherSubjects', document.querySelector('#teacher_subjects').value);
            localStorage.setItem('teacherClass', document.querySelector('#class_teacher').value);

            console.log("Teacher details saved. Redirecting to portal.");

            // --- Redirect to the final portal ---
            window.location.href = 'Teacher Portal/teacher.html';
        });
    }
    
    // --- New User Button Logic on login-signup.html ---
    const newUserButton = document.querySelector('.new_user');
     if (newUserButton) {
         newUserButton.addEventListener('click', async function(e) {
             e.preventDefault();
 
             // --- Form se saara data collect karo ---
             const role = document.querySelector('#role_select').value;
             const username = document.querySelector('#username').value;
             const email = document.querySelector('#email').value;
             const password = document.querySelector('#password').value;
             const organizationName = document.querySelector('#organization_name').value;
 
             // --- Basic Validation ---
             if (!role || !username || !email || !password || !organizationName) {
                 alert('To sign up, please fill out all required fields: Role, Name, Email, Password, and Organization Name.');
                 return;
             }
 
             const registrationData = {
                 role,
                 username,
                 email,
                 password,
                 organizationName
             };
 
             // --- Registration API ko call karo ---
             try {
                 const response = await fetch('http://localhost:5000/api/auth/register', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(registrationData),
                 });
 
                 const data = await response.json();
 
                 if (!response.ok) {
                     // Backend se error message aayega, jaise "User already exists"
                     throw new Error(data.msg || 'Registration fail ho gaya. Kripya dobara koshish karein.');
                 }
 
                 alert('Registration successful! Ab aap apne naye email aur password se login kar sakte hain.');
                 document.querySelector('form').reset();
                 document.querySelector('#staff-login-fields').classList.add('hidden');
             } catch (error) {
                 console.error('Registration Error:', error);
                 alert(error.message);
             }
         });
     }

    //================================================================
    // LOGIC FOR: new-user-ls.html
    //================================================================

    // --- Organization Type Selection on new-user-ls.html ---
    const orgSelection = document.querySelector('#Select_your_organization_type');
    const newUserForm = document.querySelector('.main_wrapper.hidden');
 
    // This code will only run if it finds the org selection element
    if (orgSelection && newUserForm) {
        const orgChoices = orgSelection.querySelectorAll('.org-choice');

        orgChoices.forEach(choice => {
            choice.addEventListener('click', function() {
                orgSelection.classList.add('hidden'); // Hide the selection screen
                newUserForm.classList.remove('hidden'); // Show the form
            });
        });
    }

    // --- Organization Signup Form Submission on new-user-ls.html ---
     const signupButton = document.querySelector('.btns');
    if (signupButton) {
        signupButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert("The organization key will be emailed to you on your provided email");
            window.location.href = 'login-signup.html';
        });
    }

    //================================================================
    // LOGIC FOR: index.html (Dev Dashboard Responsive Navbar)
    //================================================================
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

        // --- Smooth scrolling for dev dashboard anchor links & close mobile nav on click ---
        const dashboardNavLinks = navbar.querySelectorAll('.nav-menu a[href^="#"]');
        if (dashboardNavLinks.length > 0) {
            dashboardNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent the default browser jump
                    const targetId = this.getAttribute('href');
                    try {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            // Manually scroll to the element smoothly
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    } catch (error) {
                        console.error("Could not scroll to target:", targetId, error);
                    }

                    // Close mobile navbar if it's open
                    if (navbar.classList.contains('open')) {
                        navbar.classList.remove('open');
                    }
                });
            });
        }
    }
    setupResponsiveNavbar(); // Run this for the dev dashboard
    setupPasswordToggles(); // Initialize password toggles on all pages

    //================================================================
    // LOGIC FOR: profile.html
    //================================================================
    function setupProfileTabs() {
        const tabButtons = document.querySelectorAll('.details-tabs .tab-btn');
        const contentPanes = document.querySelectorAll('.profile-details-section .details-content');
    
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all tabs and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                contentPanes.forEach(pane => pane.classList.remove('active'));
    
                // Activate the clicked tab and its corresponding content pane
                button.classList.add('active');
                const targetContent = document.querySelector(`.details-content[data-content="${button.dataset.tab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    if (document.body.classList.contains('profile-page-body')) {
        const username = localStorage.getItem('username') || 'User';
        const email = localStorage.getItem('userEmail') || 'email@example.com';
        const role = localStorage.getItem('userRole') || 'Guest';
        const gender = localStorage.getItem('gender') || 'Not Specified';

        // Populate Basic Info
        document.getElementById('profile-name').textContent = username;
        document.getElementById('detail-name').value = username;
        document.getElementById('profile-role').textContent = role;
        document.getElementById('profile-email').innerHTML = `<i class="fa-solid fa-envelope"></i> ${email}`;
        document.getElementById('detail-gender').value = gender;

        // --- Edit Profile Picture Logic ---
        const editPicBtn = document.querySelector('.edit-pic-btn');
        const profilePic = document.getElementById('profile-pic');
        
        // Load saved picture if exists
        const savedPic = localStorage.getItem('profilePic');
        if (savedPic && profilePic) profilePic.src = savedPic;

        if (editPicBtn && profilePic) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            editPicBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profilePic.src = e.target.result;
                        localStorage.setItem('profilePic', e.target.result); // Save to storage
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }

        // Populate Role Specific Info
        const label1 = document.getElementById('dynamic-label-1');
        const field1 = document.getElementById('dynamic-field-1');
        const label2 = document.getElementById('dynamic-label-2');
        const field2 = document.getElementById('dynamic-field-2');

        if (role === 'Student') {
            const sClass = localStorage.getItem('userClass') || '-';
            const sSection = localStorage.getItem('userSection') || '-';
            const sId = localStorage.getItem('studentId') || '-';

            label1.textContent = 'Student ID';
            field1.value = sId;
            label2.textContent = 'Class & Section';
            field2.value = `${sClass} - ${sSection}`;
        } else if (role === 'Teacher') {
            const tId = localStorage.getItem('teacherId') || '-';
            const tSubjects = localStorage.getItem('teacherSubjects') || '-';

            label1.textContent = 'Teacher ID';
            field1.value = tId;
            label2.textContent = 'Subjects';
            field2.value = tSubjects;
        } else {
            // Hide dynamic fields for other roles if not needed
            document.getElementById('dynamic-field-1-group').style.display = 'none';
            document.getElementById('dynamic-field-2-group').style.display = 'none';
        }

        // Back Button Logic
        document.getElementById('back-to-dashboard').addEventListener('click', () => {
            if (role === 'Student') {
                window.location.href = 'Student Portal/student.html';
            } else if (role === 'Teacher') {
                window.location.href = 'Teacher Portal/teacher.html';
            } else {
                window.history.back();
            }
        });

        // Logout Logic
        document.getElementById('logout-btn').addEventListener('click', () => {
            if(confirm("Are you sure you want to logout?")) {
                // In a real app, clear session/tokens here
                window.location.href = 'login-signup.html';
            }
        });

        // Initialize profile tabs
        setupProfileTabs();

        // Add feedback for save/update buttons
        const savePersonalBtn = document.getElementById('save-personal-details');
        if (savePersonalBtn) {
            savePersonalBtn.addEventListener('click', () => {
                alert('Personal details saved!');
            });
        }
        const updatePasswordBtn = document.getElementById('update-password-btn');
        if (updatePasswordBtn) {
            updatePasswordBtn.addEventListener('click', () => {
                alert('Password updated successfully!');
            });
        }
    }

    //================================================================
    // LOGIC FOR: help-support.html
    //================================================================
    function setupHelpPage() {
        if (!document.body.classList.contains('help-page-body')) return;

        // Back button
        const backBtn = document.getElementById('back-to-previous');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                question.classList.toggle('active');
                if (question.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0px';
                }
            });
        });

        // Support Form Submission
        const supportForm = document.getElementById('support-form');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your submission! Our support team will get back to you shortly.');
                supportForm.reset();
            });
        }
    }
    setupHelpPage(); // Run help page logic
});
