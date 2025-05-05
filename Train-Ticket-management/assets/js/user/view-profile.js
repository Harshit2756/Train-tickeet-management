// View Profile JavaScript for Indian Railways Ticket Management System

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

    // Load and display user information
    loadUserProfile(currentUser);

    // setup event listeners
    setupEventListeners();

    // Count user bookings
    countUserBookings(currentUser.id);
});

// Load and display user profile information
function loadUserProfile(user) {
    // Update header username and role
    const profileUsername = document.getElementById('profileUsername');
    const profileRole = document.getElementById('profileRole');

    if (profileUsername) {
        profileUsername.textContent = user.username;
    }

    if (profileRole) {
        profileRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    // Update navbar username display
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.username;
    }

    // Update profile details
    document.getElementById('profileUserId').textContent = user.id;
    document.getElementById('profileName').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileMobile').textContent = user.mobile;
    document.getElementById('profileAddress').textContent = user.address;

    // Set a placeholder member since date (in a real app, would come from the user object)
    const memberSinceDate = new Date();
    memberSinceDate.setMonth(memberSinceDate.getMonth() - 3); // 3 months ago as an example
    document.getElementById('profileMemberSince').textContent = memberSinceDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
}

// Count user bookings from localStorage
function countUserBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBookings = bookings.filter(booking => booking.userId === userId);

    // Update bookings count
    document.getElementById('profileTotalBookings').textContent = userBookings.length;

    // Set user status based on booking count
    const profileStatus = document.getElementById('profileStatus');
    if (profileStatus) {
        if (userBookings.length >= 10) {
            profileStatus.textContent = 'Gold Member';
            profileStatus.classList.add('text-warning', 'fw-bold');
        } else if (userBookings.length >= 5) {
            profileStatus.textContent = 'Silver Member';
            profileStatus.classList.add('fw-bold');
        } else {
            profileStatus.textContent = 'Regular';
        }
    }
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


