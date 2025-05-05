// General utilities for Indian Railways Ticket Management System

// Toggle password visibility
function togglePasswordVisibility(passwordField, toggleButton) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
        passwordField.type = 'password';
        toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Format time
function formatTime(timeString) {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', options);
}

// Show alert message
function showAlert(message, type = 'info', container = '.alert-container', autoClose = true) {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll(`${container} .alert`);
    existingAlerts.forEach(alert => alert.remove());

    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add to container
    const alertContainer = document.querySelector(container);
    if (alertContainer) {
        alertContainer.appendChild(alertElement);

        // Auto close after 5 seconds if autoClose is true
        if (autoClose) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            }, 5000);
        }
    }
}

// Get query parameter from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Create confirmation modal
function createConfirmationModal(title, message, confirmCallback, cancelCallback) {
    // Check if modal already exists and remove it
    const existingModal = document.getElementById('confirmationModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal element
    const modalElement = document.createElement('div');
    modalElement.className = 'modal fade';
    modalElement.id = 'confirmationModal';
    modalElement.tabIndex = '-1';
    modalElement.setAttribute('aria-hidden', 'true');

    modalElement.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmModalBtn">Confirm</button>
                </div>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modalElement);

    // Create modal instance
    const modal = new bootstrap.Modal(modalElement);

    // Add event listener to confirm button
    document.getElementById('confirmModalBtn').addEventListener('click', function () {
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
        modal.hide();
    });

    // Add event listener to modal hidden event
    modalElement.addEventListener('hidden.bs.modal', function () {
        if (typeof cancelCallback === 'function') {
            cancelCallback();
        }
    });

    // Show modal
    modal.show();

    return modal;
}

// Format duration (HH:MM)
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Format distance (km)
function formatDistance(distance) {
    return `${distance} km`;
}

// Local storage helpers
const storage = {
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    remove: function (key) {
        localStorage.removeItem(key);
    },
    clear: function () {
        localStorage.clear();
    }
};

// Session and authentication helpers
const auth = {
    // Login - modified to bypass session storage
    login: function (userData, remember = false) {
        console.log('Login successful for:', userData);
        return true;
    },
    // Check if user is logged in - always return true
    isLoggedIn: function () {
        return true;
    },
    // Get current user - return dummy user data
    getCurrentUser: function () {
        return {
            id: 'user-1234',
            username: 'Harshith',
            role: 'customer',
            email: 'harshith@gmail.com'
        };
    },
    // Logout - just redirect without clearing storage
    logout: function () {
        window.location.href = '../../pages/auth/login.html';
    }
};


// Copy text to clipboard
function copyToClipboard(text) {
    return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch(() => false);
}

// // Calculate time difference between two time strings (HH:MM)
// function calculateTimeDifference(startTime, endTime) {
//     const [startHour, startMinute] = startTime.split(':').map(Number);
//     const [endHour, endMinute] = endTime.split(':').map(Number);

//     let diffMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

//     // Handle overnight journeys
//     if (diffMinutes < 0) {
//         diffMinutes += 24 * 60; // Add 24 hours in minutes
//     }

//     return diffMinutes;
// }

// Export utilities
const utils = {
    togglePasswordVisibility,
    formatCurrency,
    formatDate,
    formatTime,
    showAlert,
    getQueryParam,
    createConfirmationModal,
    formatDuration,
    formatDistance,
    storage,
    auth,
    copyToClipboard,
    // calculateTimeDifference
};