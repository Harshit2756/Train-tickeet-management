// Edit Profile JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Get user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        id: 'user-123456',
        username: 'Harshit',
        role: 'customer',
        email: 'harshit@gmail.com',
        mobile: '9876543210',
        address: '123 Main Street, New Delhi, 110001'
    };

    // setup event listeners
    setupEventListeners();

    // Update navbar username
    updateNavUsername(currentUser);

    // Pre-fill the form with user data
    prefillFormData(currentUser);

    // Set up form submission
    setupFormSubmission();
});

// setup event listeners
function setupEventListeners() {
    // Logout button event listener with direct window.location redirect
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Logout button clicked in user-dashboard.js');
            // Direct redirect without using utils
            window.location.href = '../../pages/auth/login.html';
        });
    }
}


// Update username in the navbar
function updateNavUsername(user) {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.username;
    }
}

// Pre-fill form with user data
function prefillFormData(user) {
    // Show loading indicator or spinner if needed
    const saveSpinner = document.getElementById('saveSpinner');
    if (saveSpinner) {
        saveSpinner.classList.remove('d-none');
    }

    // Create some sample comprehensive user data with additional fields
    // In a real application, this would come from the API
    const dummyUserData = {
        id: user.id || 'user-123456',
        username: user.username || 'Harshit',
        email: user.email || 'harshit@gmail.com',
        mobile: user.mobile || '9876543210',
        address: user.address || '123, Railway Colony, M.G. Road, Bangalore, Karnataka - 560001',
        role: user.role || 'customer',
        preferences: {
            preferred_class: 'AC Tier 1',
            meal_preference: 'Vegetarian',
            seat_preference: 'Window'
        },
        profile_details: {
            age: 32,
            gender: 'Male',
            aadhar: 'XXXX-XXXX-XXXX',
            nationality: 'Indian'
        },
        account: {
            joined: '2022-01-15',
            last_login: '2023-12-01',
            status: 'active'
        }
    };

    // Set values in the form with a slight delay to show the spinner
    setTimeout(() => {
        document.getElementById('userId').value = dummyUserData.id;
        document.getElementById('username').value = dummyUserData.username;
        document.getElementById('email').value = dummyUserData.email;
        document.getElementById('mobile').value = dummyUserData.mobile;
        document.getElementById('address').value = dummyUserData.address;

        // Hide spinner after loading data
        if (saveSpinner) {
            saveSpinner.classList.add('d-none');
        }

        // Display a success message that data was loaded
        showAlert('User profile data loaded successfully.', 'info');
    }, 800); // 800ms delay to simulate loading
}

// Set up form submission handling
function setupFormSubmission() {
    const editProfileForm = document.getElementById('editProfileForm');
    if (!editProfileForm) return;

    editProfileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show spinner
        const saveSpinner = document.getElementById('saveSpinner');
        if (saveSpinner) {
            saveSpinner.classList.remove('d-none');
        }

        // Validate form
        if (!validateForm()) {
            if (saveSpinner) {
                saveSpinner.classList.add('d-none');
            }
            return;
        }

        // Get form values
        const userId = document.getElementById('userId').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const address = document.getElementById('address').value;

        // Check if password change is requested
        const changePasswordSwitch = document.getElementById('changePasswordSwitch');
        let passwordChanged = false;

        if (changePasswordSwitch && changePasswordSwitch.checked) {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Simple password validation
            if (!currentPassword) {
                showFieldError('currentPassword', 'Please enter your current password');
                if (saveSpinner) saveSpinner.classList.add('d-none');
                return;
            }

            if (!newPassword) {
                showFieldError('newPassword', 'Please enter a new password');
                if (saveSpinner) saveSpinner.classList.add('d-none');
                return;
            }

            if (newPassword !== confirmPassword) {
                showFieldError('confirmPassword', 'Passwords do not match');
                if (saveSpinner) saveSpinner.classList.add('d-none');
                return;
            }

            // Mock password change - in a real app, this would be done securely
            passwordChanged = true;
        }

        // Get current user data
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

        // Update user data
        const updatedUser = {
            ...currentUser,
            username: username,
            email: email,
            mobile: mobile,
            address: address
        };

        // Save updated user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Simulate API call delay
        setTimeout(() => {
            // Hide spinner
            if (saveSpinner) {
                saveSpinner.classList.add('d-none');
            }

            // Show success message
            let message = 'Profile updated successfully';
            if (passwordChanged) {
                message += ' and password changed';
            }
            showAlert(message, 'success');

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'view-profile.html';
            }, 2000);
        }, 1500);
    });
}

// Validate the form
function validateForm() {
    let isValid = true;

    // Clear previous errors
    clearFieldErrors();

    // Validate username
    const username = document.getElementById('username').value.trim();
    if (!username) {
        showFieldError('username', 'Name is required');
        isValid = false;
    }

    // Validate email
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate mobile
    const mobile = document.getElementById('mobile').value.trim();
    if (!mobile) {
        showFieldError('mobile', 'Mobile number is required');
        isValid = false;
    } else if (!isValidMobile(mobile)) {
        showFieldError('mobile', 'Please enter a valid 10-digit mobile number');
        isValid = false;
    }

    // Validate address
    const address = document.getElementById('address').value.trim();
    if (!address) {
        showFieldError('address', 'Address is required');
        isValid = false;
    }

    return isValid;
}

// Show field error
function showFieldError(fieldId, errorMessage) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    // Add error class to input
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.classList.add('is-invalid');
    }
}

// Clear all field errors
function clearFieldErrors() {
    const errorElements = document.querySelectorAll('[id$="Error"]');
    errorElements.forEach(element => {
        element.textContent = '';
    });

    const inputElements = document.querySelectorAll('input, textarea');
    inputElements.forEach(element => {
        element.classList.remove('is-invalid');
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate mobile format
function isValidMobile(mobile) {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

// Show alert function
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) return;

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Clear previous alerts
    alertContainer.innerHTML = '';

    // Add alert to container
    alertContainer.appendChild(alert);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
}
