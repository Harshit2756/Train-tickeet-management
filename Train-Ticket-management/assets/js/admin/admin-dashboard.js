// Admin Dashboard JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in and is admin
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }

    // Update admin name in UI
    updateAdminInfo(currentUser);

    // Initialize dashboard stats
    initializeDashboardStats();

    // Generate charts
    generateRevenueChart();
    generateTicketTypeChart();
    generateUserRegistrationChart();

    // Initialize tables
    initializeUserTable();
    initializeTrainTable();
    initializeRecentBookingsTable();

    // Setup event listeners for dynamically loaded content
    setupEventListeners();

    // Show success message if redirected from train management
    const successMessage = getQueryParam('success');
    if (successMessage) {
        showAlert(decodeURIComponent(successMessage), 'success');
    }
});

// Update admin information in the UI
function updateAdminInfo(adminUser) {
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${adminUser.name || adminUser.username}`;
    }

    // Update admin name in dropdown
    const adminName = document.getElementById('adminName');
    if (adminName) {
        adminName.textContent = adminUser.name || adminUser.username;
    }

    // Update last login time
    const lastLogin = document.getElementById('lastLogin');
    if (lastLogin) {
        lastLogin.textContent = `Last login: ${formatDate(new Date())}`;
    }
}

// Initialize dashboard statistics
function initializeDashboardStats() {
    // Get data from storage
    const bookings = storage.get('bookings') || [];
    const users = storage.get('users') || [];
    const trains = storage.get('trains') || [];

    // Calculate stats
    const totalRevenue = calculateTotalRevenue(bookings);
    const totalUsers = users.length;
    const totalTrains = trains.length;
    const totalBookings = bookings.length;

    // Update UI with stats
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalTrains').textContent = totalTrains;
    document.getElementById('totalBookings').textContent = totalBookings;

    // Calculate conversion rate
    const unfulfilledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
    const conversionRate = totalBookings > 0
        ? ((totalBookings - unfulfilledBookings) / totalBookings * 100).toFixed(1)
        : 0;

    document.getElementById('conversionRate').textContent = `${conversionRate}%`;
}

// Generate revenue chart
function generateRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    // Get last 6 months
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push(month.toLocaleDateString('en-US', { month: 'short' }));
    }

    // Simulate revenue data (in a real app, this would come from the backend)
    const revenueData = [4800, 5200, 6000, 4900, 6500, 7200];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Revenue (₹)',
                data: revenueData,
                borderColor: 'rgba(0, 86, 179, 1)',
                backgroundColor: 'rgba(0, 86, 179, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(0, 86, 179, 1)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Revenue: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

// Generate ticket type chart
function generateTicketTypeChart() {
    const ctx = document.getElementById('ticketTypeChart').getContext('2d');

    // Simulate ticket type data (in a real app, this would come from the backend)
    const ticketTypes = ['Economy', 'Standard', 'Business', 'First Class'];
    const ticketData = [452, 256, 128, 64];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ticketTypes,
            datasets: [{
                data: ticketData,
                backgroundColor: [
                    'rgba(0, 86, 179, 0.8)',
                    'rgba(0, 68, 148, 0.8)',
                    'rgba(255, 107, 0, 0.8)',
                    'rgba(40, 167, 69, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} tickets (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Generate user registration chart
function generateUserRegistrationChart() {
    const ctx = document.getElementById('userRegistrationChart').getContext('2d');

    // Get last 7 days
    const days = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
        const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
        days.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // Simulate user registration data (in a real app, this would come from the backend)
    const registrationData = [8, 12, 5, 7, 10, 15, 9];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'New Users',
                data: registrationData,
                backgroundColor: 'rgba(255, 107, 0, 0.7)',
                borderColor: 'rgba(255, 107, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Initialize user table
function initializeUserTable() {
    const users = storage.get('users') || [];
    const userTableBody = document.getElementById('userTableBody');

    if (userTableBody) {
        userTableBody.innerHTML = '';

        if (users.length === 0) {
            userTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No users found</td>
                </tr>
            `;
            return;
        }

        // Take only latest 5 users and sort by registration date
        const latestUsers = users
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, 5);

        latestUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.mobileNumber}</td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>
                    <button class="btn btn-action btn-edit me-1" data-bs-toggle="tooltip" title="Edit User">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-action btn-delete" data-bs-toggle="tooltip" title="Delete User" data-user-id="${user.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        // Initialize tooltips
        initializeTooltips();
    }
}

// Initialize train table
function initializeTrainTable() {
    const trains = storage.get('trains') || [];
    const trainTableBody = document.getElementById('trainTableBody');

    if (trainTableBody) {
        trainTableBody.innerHTML = '';

        if (trains.length === 0) {
            trainTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No trains found</td>
                </tr>
            `;
            return;
        }

        // Take only latest 5 trains and sort by added date
        const latestTrains = trains
            .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
            .slice(0, 5);

        latestTrains.forEach(train => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${train.trainNumber}</td>
                <td>${train.name}</td>
                <td>${train.source} to ${train.destination}</td>
                <td>${train.departureTime}</td>
                <td>${train.type}</td>
                <td>
                    <button class="btn btn-action btn-edit me-1" data-bs-toggle="tooltip" title="Edit Train">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-action btn-delete" data-bs-toggle="tooltip" title="Delete Train" data-train-id="${train.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            trainTableBody.appendChild(row);
        });

        // Initialize tooltips
        initializeTooltips();
    }
}

// Initialize recent bookings table
function initializeRecentBookingsTable() {
    const bookings = storage.get('bookings') || [];
    const bookingTableBody = document.getElementById('recentBookingsTableBody');

    if (bookingTableBody) {
        bookingTableBody.innerHTML = '';

        if (bookings.length === 0) {
            bookingTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No bookings found</td>
                </tr>
            `;
            return;
        }

        // Take only latest 5 bookings and sort by booking date
        const latestBookings = bookings
            .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
            .slice(0, 5);

        latestBookings.forEach(booking => {
            const row = document.createElement('tr');

            // Get status badge class
            let statusBadgeClass;
            switch (booking.status) {
                case 'confirmed':
                    statusBadgeClass = 'bg-success';
                    break;
                case 'cancelled':
                    statusBadgeClass = 'bg-danger';
                    break;
                case 'pending':
                    statusBadgeClass = 'bg-warning';
                    break;
                default:
                    statusBadgeClass = 'bg-secondary';
            }

            row.innerHTML = `
                <td>${booking.bookingId}</td>
                <td>${booking.userId}</td>
                <td>${booking.trainName} (${booking.trainNumber})</td>
                <td>${formatDate(booking.journeyDate)}</td>
                <td>${formatCurrency(booking.fare)}</td>
                <td><span class="badge ${statusBadgeClass}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-action btn-info me-1" data-bs-toggle="tooltip" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            bookingTableBody.appendChild(row);
        });

        // Initialize tooltips
        initializeTooltips();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            auth.logout();
        });
    }

    // Admin profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Redirect to admin profile page
            window.location.href = 'admin-profile.html';
        });
    }

    // View all users button
    const viewAllUsersBtn = document.getElementById('viewAllUsersBtn');
    if (viewAllUsersBtn) {
        viewAllUsersBtn.addEventListener('click', function () {
            window.location.href = 'manage-users.html';
        });
    }

    // View all trains button
    const viewAllTrainsBtn = document.getElementById('viewAllTrainsBtn');
    if (viewAllTrainsBtn) {
        viewAllTrainsBtn.addEventListener('click', function () {
            window.location.href = 'manage-trains.html';
        });
    }

    // View all bookings button
    const viewAllBookingsBtn = document.getElementById('viewAllBookingsBtn');
    if (viewAllBookingsBtn) {
        viewAllBookingsBtn.addEventListener('click', function () {
            window.location.href = 'manage-bookings.html';
        });
    }

    // Add train button
    const addTrainBtn = document.getElementById('addTrainBtn');
    if (addTrainBtn) {
        addTrainBtn.addEventListener('click', function () {
            window.location.href = 'train-form.html';
        });
    }

    // Delete user buttons
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.btn-delete[data-user-id]')) {
            const button = e.target.closest('.btn-delete[data-user-id]');
            const userId = button.getAttribute('data-user-id');

           utils.createConfirmationModal(
                'Delete User',
                'Are you sure you want to delete this user? This action cannot be undone.',
                function () {
                    deleteUser(userId);
                }
            );
        }
    });

    // Delete train buttons
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.btn-delete[data-train-id]')) {
            const button = e.target.closest('.btn-delete[data-train-id]');
            const trainId = button.getAttribute('data-train-id');

            utils.createConfirmationModal(
                'Delete Train',
                'Are you sure you want to delete this train? This action cannot be undone.',
                function () {
                    deleteTrain(trainId);
                }
            );
        }
    });
}

// Delete user
function deleteUser(userId) {
    const users = storage.get('users') || [];
    const filteredUsers = users.filter(user => user.id !== userId);

    storage.set('users', filteredUsers);

    showAlert('User deleted successfully', 'success');

    // Refresh user table
    initializeUserTable();
}

// Delete train
function deleteTrain(trainId) {
    const trains = storage.get('trains') || [];
    const filteredTrains = trains.filter(train => train.id !== trainId);

    storage.set('trains', filteredTrains);

    showAlert('Train deleted successfully', 'success');

    // Refresh train table
    initializeTrainTable();
}

// Calculate total revenue from bookings
function calculateTotalRevenue(bookings) {
    return bookings
        .filter(booking => booking.status !== 'cancelled')
        .reduce((total, booking) => total + booking.fare, 0);
} 