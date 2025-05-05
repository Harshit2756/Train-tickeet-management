// Edit Admin Profile JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Get admin data from localStorage
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || {
        id: 'admin-001',
        username: 'Jainam',
        role: 'admin',
        email: 'jainam@indianrail.gov.in',
        contact: '+91 9876543210'
    };

    // Setup event listeners
    setupEventListeners();

    // Update navbar username
    updateNavUsername(currentAdmin);

    // Pre-fill the form with admin data
    prefillFormData(currentAdmin);

    // Set up form submission
    setupFormSubmission();

    // Handle password change switch
    setupPasswordChangeSwitch();
});

// Setup event listeners
function setupEventListeners() {
    // Logout button event listener with direct window.location redirect
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Logout button clicked in admin-edit-profile.js');
            // Direct redirect without using utils
            window.location.href = '../../pages/auth/login.html';
        });
    }
}

// Update username in the navbar
function updateNavUsername(admin) {
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    if (adminNameDisplay) {
        adminNameDisplay.textContent = admin.username;
    }
}

// Handle password change switch
function setupPasswordChangeSwitch() {
    const changePasswordSwitch = document.getElementById('changePasswordSwitch');
    const passwordFields = document.getElementById('passwordFields');

    if (changePasswordSwitch && passwordFields) {
        changePasswordSwitch.addEventListener('change', function () {
            if (this.checked) {
                passwordFields.classList.remove('d-none');
            } else {
                passwordFields.classList.add('d-none');
                // Clear password fields when hiding
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';

                // Clear any error messages
                clearPasswordErrors();
            }
        });
    }
}

// Clear password field errors
function clearPasswordErrors() {
    document.getElementById('currentPasswordError').textContent = '';
    document.getElementById('newPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
}

// Pre-fill form with admin data
function prefillFormData(admin) {
    // Show loading indicator or spinner if needed
    const saveSpinner = document.getElementById('saveSpinner');
    if (saveSpinner) {
        saveSpinner.classList.remove('d-none');
    }

    // Create some sample comprehensive admin data
    // In a real application, this would come from the API
    const dummyAdminData = {
        id: admin.id || 'ADM-123456',
        username: admin.username || 'Rajesh Kumar',
        email: admin.email || 'rajesh.admin@indianrail.gov.in',
        contact: admin.contact || '+91 11 2345 6789'
    };

    // Set values in the form with a slight delay to show the spinner
    setTimeout(() => {
        document.getElementById('adminId').value = dummyAdminData.id;
        document.getElementById('fullName').value = dummyAdminData.username;
        document.getElementById('email').value = dummyAdminData.email;
        document.getElementById('contact').value = dummyAdminData.contact;

        // Hide spinner after loading data
        if (saveSpinner) {
            saveSpinner.classList.add('d-none');
        }

        // Display a success message that data was loaded
        showAlert('Admin profile data loaded successfully.', 'info');
    }, 800); // 800ms delay to simulate loading
}

// Set up form submission handling
function setupFormSubmission() {
    const editAdminProfileForm = document.getElementById('editAdminProfileForm');
    if (!editAdminProfileForm) return;

    editAdminProfileForm.addEventListener('submit', function (e) {
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
        const adminId = document.getElementById('adminId').value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const contact = document.getElementById('contact').value;

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

        // Get current admin data
        const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || {};

        // Update admin data
        const updatedAdmin = {
            ...currentAdmin,
            id: adminId,
            username: fullName,
            email: email,
            contact: contact
        };

        // Save updated admin to localStorage
        localStorage.setItem('currentAdmin', JSON.stringify(updatedAdmin));

        // Simulate API call delay
        setTimeout(() => {
            // Hide spinner
            if (saveSpinner) {
                saveSpinner.classList.add('d-none');
            }

            // Show success message
            let message = 'Admin profile updated successfully';
            if (passwordChanged) {
                message += ' and password changed';
            }
            showAlert(message, 'success');

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'admin-profile.html';
            }, 2000);
        }, 1500);
    });
}

// Validate the form
function validateForm() {
    let isValid = true;

    // Clear previous errors
    clearFieldErrors();

    // Validate full name
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
        showFieldError('fullName', 'Full name is required');
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

    // Validate contact
    const contact = document.getElementById('contact').value.trim();
    if (!contact) {
        showFieldError('contact', 'Office contact is required');
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
}

// Clear all field errors
function clearFieldErrors() {
    document.getElementById('fullNameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('contactError').textContent = '';

    // Also clear password errors
    if (document.getElementById('changePasswordSwitch').checked) {
        clearPasswordErrors();
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';

    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
} 