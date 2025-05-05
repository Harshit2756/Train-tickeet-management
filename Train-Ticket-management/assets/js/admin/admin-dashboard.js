// Admin Dashboard JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Check if admin is logged in
    checkAdminAuth();

    // Initialize dashboard
    initializeDashboard();

    // Setup event listeners
    setupEventListeners();

    // Show success message if redirected
    const successMessage = getQueryParam('success');
    if (successMessage) {
        showAlert(decodeURIComponent(successMessage), 'success');
    }
});

// Check admin authentication
function checkAdminAuth() {
    // In a real app, this would verify the admin session
    // For this demo, we'll just simulate an admin user
    const adminUser = {
        id: 'admin-001',
        name: 'Jainam',
        email: 'jainam@indianrail.gov.in',
        role: 'admin'
    };

    // Update admin name display
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    if (adminNameDisplay) {
        adminNameDisplay.textContent = adminUser.name;
    }
}

// Initialize dashboard data
function initializeDashboard() {
    // Load data from storage
    const users = localStorageUtil.get('users') || getMockUsers();
    const trains = localStorageUtil.get('trains') || getMockTrains();
    const bookings = localStorageUtil.get('bookings') || getMockBookings();

    // Initialize stats
    updateStats(users, trains, bookings);

    // Initialize tables
    populateTicketsPerClassTable(bookings);
    populateSalesPerQuarterTable(bookings);
    populateCustomersTable(users, bookings);
    populateTrainsTable(trains);

    // Initialize tooltips
    initializeTooltips();

    // Reinitialize event listeners for new elements
    setupActionButtons();
}

// Update dashboard statistics
function updateStats(users, trains, bookings) {
    // Update total users
    const totalUsers = document.getElementById('totalUsers');
    if (totalUsers) totalUsers.textContent = users.length;

    // Update total bookings
    const totalBookings = document.getElementById('totalBookings');
    if (totalBookings) totalBookings.textContent = bookings.length;

    // Update total trains
    const totalTrains = document.getElementById('totalTrains');
    if (totalTrains) totalTrains.textContent = trains.length;

    // Calculate and update total revenue
    const totalRevenue = calculateTotalRevenue(bookings);
    const totalRevenueElement = document.getElementById('totalRevenue');
    if (totalRevenueElement) totalRevenueElement.textContent = '₹' + totalRevenue.toLocaleString();
}

// Calculate total revenue
function calculateTotalRevenue(bookings) {
    return bookings.reduce((total, booking) => {
        // Only count confirmed bookings
        if (booking.status !== 'cancelled') {
            return total + booking.fare;
        }
        return total;
    }, 0);
}

// Populate tickets per class table
function populateTicketsPerClassTable(bookings) {
    const ticketsPerClassTable = document.getElementById('ticketsPerClassTable');
    if (!ticketsPerClassTable) return;

    // Calculate tickets per class
    const classStats = {
        'First Class': { count: 0, percentage: 0 },
        'AC Tier 1': { count: 0, percentage: 0 },
        'AC Tier 2': { count: 0, percentage: 0 },
        'AC Tier 3': { count: 0, percentage: 0 },
        'Sleeper': { count: 0, percentage: 0 },
        'General': { count: 0, percentage: 0 }
    };

    // Count bookings by class
    bookings.forEach(booking => {
        if (booking.status !== 'cancelled') {
            if (classStats[booking.class]) {
                classStats[booking.class].count += booking.passengers || 1;
            }
        }
    });

    // Calculate total tickets
    const totalTickets = Object.values(classStats).reduce((total, stat) => total + stat.count, 0);

    // Calculate percentages
    if (totalTickets > 0) {
        Object.keys(classStats).forEach(className => {
            classStats[className].percentage = ((classStats[className].count / totalTickets) * 100).toFixed(0);
        });
    }

    // Update table with real data
    ticketsPerClassTable.innerHTML = '';

    Object.keys(classStats).forEach(className => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${className}</td>
            <td>${classStats[className].count}</td>
            <td>${classStats[className].percentage}%</td>
        `;
        ticketsPerClassTable.appendChild(row);
    });
}

// Populate sales per quarter table
function populateSalesPerQuarterTable(bookings) {
    const salesPerQuarterTable = document.getElementById('salesPerQuarterTable');
    if (!salesPerQuarterTable) return;

    // Calculate sales per quarter
    const quarterStats = {
        'Q1 (Jan-Mar)': { sales: 0, percentage: 0 },
        'Q2 (Apr-Jun)': { sales: 0, percentage: 0 },
        'Q3 (Jul-Sep)': { sales: 0, percentage: 0 },
        'Q4 (Oct-Dec)': { sales: 0, percentage: 0 }
    };

    // Count sales by quarter
    bookings.forEach(booking => {
        if (booking.status !== 'cancelled') {
            const bookingDate = new Date(booking.bookingDate);
            const month = bookingDate.getMonth();

            if (month >= 0 && month <= 2) {
                quarterStats['Q1 (Jan-Mar)'].sales += booking.fare;
            } else if (month >= 3 && month <= 5) {
                quarterStats['Q2 (Apr-Jun)'].sales += booking.fare;
            } else if (month >= 6 && month <= 8) {
                quarterStats['Q3 (Jul-Sep)'].sales += booking.fare;
            } else {
                quarterStats['Q4 (Oct-Dec)'].sales += booking.fare;
            }
        }
    });

    // Calculate total sales
    const totalSales = Object.values(quarterStats).reduce((total, stat) => total + stat.sales, 0);

    // Calculate percentages
    if (totalSales > 0) {
        Object.keys(quarterStats).forEach(quarter => {
            quarterStats[quarter].percentage = ((quarterStats[quarter].sales / totalSales) * 100).toFixed(0);
        });
    }

    // Update table with real data
    salesPerQuarterTable.innerHTML = '';

    Object.keys(quarterStats).forEach(quarter => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quarter}</td>
            <td>₹${quarterStats[quarter].sales.toLocaleString()}</td>
            <td>${quarterStats[quarter].percentage}%</td>
        `;
        salesPerQuarterTable.appendChild(row);
    });
}

// Populate customers table
function populateCustomersTable(users, bookings) {
    const customersTableBody = document.getElementById('customersTableBody');
    if (!customersTableBody) return;

    // Calculate tickets booked per user
    const userTickets = {};
    bookings.forEach(booking => {
        if (!userTickets[booking.userId]) {
            userTickets[booking.userId] = 0;
        }
        userTickets[booking.userId] += booking.passengers || 1;
    });

    // Update table with user data
    customersTableBody.innerHTML = '';

    if (users.length === 0) {
        customersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No customers found</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.mobileNumber || 'N/A'}</td>
            <td>${userTickets[user.id] || 0}</td>
            <td>
                <button class="btn btn-action btn-danger" data-user-id="${user.id}" data-bs-toggle="tooltip" title="Delete Customer">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        customersTableBody.appendChild(row);
    });
}

// Populate trains table
function populateTrainsTable(trains) {
    const trainsTableBody = document.getElementById('trainsTableBody');
    if (!trainsTableBody) return;

    // Update table with train data
    trainsTableBody.innerHTML = '';

    if (trains.length === 0) {
        trainsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No trains found</td></tr>';
        return;
    }

    trains.forEach(train => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${train.id}</td>
            <td>${train.name}</td>
            <td>${train.seats || 'N/A'}</td>
            <td>${train.source}</td>
            <td>${train.destination}</td>
            <td>${train.ownership || 'Indian Railways'}</td>
            <td>
                <button class="btn btn-action btn-danger" data-train-id="${train.id}" data-bs-toggle="tooltip" title="Delete Train">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        trainsTableBody.appendChild(row);
    });
}

// Setup action buttons (delete, edit) - separate from main event listeners
function setupActionButtons() {
    console.log('Setting up action buttons');

    // Customer delete buttons
    const customerDeleteButtons = document.querySelectorAll('.btn-danger[data-user-id]');
    console.log('Found customer delete buttons:', customerDeleteButtons.length);

    customerDeleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Customer delete button clicked');
            const userId = this.getAttribute('data-user-id');
            console.log('User ID to delete:', userId);
            confirmDeleteCustomer(userId);
        });
    });

    // Train delete buttons
    const trainDeleteButtons = document.querySelectorAll('.btn-danger[data-train-id]');
    console.log('Found train delete buttons:', trainDeleteButtons.length);

    trainDeleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Train delete button clicked');
            const trainId = this.getAttribute('data-train-id');
            console.log('Train ID to delete:', trainId);
            confirmDeleteTrain(trainId);
        });
    });
}

// Setup event listeners for all interactive elements
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // In a real app, this would clear the session
            window.location.href = '../auth/login.html';
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Set up action buttons (delete, edit)
    setupActionButtons();

    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
            const itemType = this.getAttribute('data-type');
            const itemId = this.getAttribute('data-id');

            if (itemType === 'customer') {
                deleteCustomer(itemId);
            } else if (itemType === 'train') {
                deleteTrain(itemId);
            }
        });
    }
}

// Confirm delete customer
function confirmDeleteCustomer(userId) {
    console.log('Confirming delete for customer:', userId);

    const users = localStorageUtil.get('users') || [];
    const user = users.find(user => user.id === userId);

    if (!user) {
        console.error('User not found:', userId);
        showAlert('User not found', 'danger');
        return;
    }

    console.log('Found user to delete:', user);

    // Set delete item type
    const deleteItemType = document.getElementById('deleteItemType');
    if (deleteItemType) deleteItemType.textContent = 'customer';

    // Set delete item details
    const deleteItemDetails = document.getElementById('deleteItemDetails');
    if (deleteItemDetails) {
        deleteItemDetails.innerHTML = `
            <p class="mb-1"><strong>ID:</strong> ${user.id}</p>
            <p class="mb-1"><strong>Name:</strong> ${user.name}</p>
            <p class="mb-0"><strong>Mobile:</strong> ${user.mobileNumber || 'N/A'}</p>
        `;
    }

    // Set confirm button data
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.setAttribute('data-type', 'customer');
        confirmDeleteBtn.setAttribute('data-id', userId);
    }

    // Show the confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    modal.show();
    console.log('Delete confirmation modal shown for customer');
}

// Delete customer
function deleteCustomer(userId) {
    const users = localStorageUtil.get('users') || [];
    const user = users.find(user => user.id === userId);
    const filteredUsers = users.filter(user => user.id !== userId);

    // Save updated users to storage
    localStorageUtil.set('users', filteredUsers);

    // Close the delete confirmation modal and remove backdrop
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    if (deleteModal) {
        deleteModal.hide();
        // Remove modal backdrop
        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 200);
    }

    // After backdrop is removed, then show success message in modal
    setTimeout(() => {
        const successTitle = document.getElementById('successTitle');
        if (successTitle) {
            successTitle.textContent = 'Customer Deleted';
        }

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = `Customer "${user.name}" has been successfully deleted from the system.`;
        }

        // Show the success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // After modal is closed, refresh the dashboard
        document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
            // Ensure this modal's backdrop is also removed
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            initializeDashboard();
        }, { once: true });
    }, 300);
}

// Confirm delete train
function confirmDeleteTrain(trainId) {
    console.log('Confirming delete for train:', trainId);

    const trains = localStorageUtil.get('trains') || [];
    const train = trains.find(train => train.id === trainId);

    if (!train) {
        console.error('Train not found:', trainId);
        showAlert('Train not found', 'danger');
        return;
    }

    console.log('Found train to delete:', train);

    // Set delete item type
    const deleteItemType = document.getElementById('deleteItemType');
    if (deleteItemType) deleteItemType.textContent = 'train';

    // Set delete item details
    const deleteItemDetails = document.getElementById('deleteItemDetails');
    if (deleteItemDetails) {
        deleteItemDetails.innerHTML = `
            <p class="mb-1"><strong>ID:</strong> ${train.id}</p>
            <p class="mb-1"><strong>Name:</strong> ${train.name}</p>
            <p class="mb-1"><strong>Route:</strong> ${train.source} to ${train.destination}</p>
            <p class="mb-0"><strong>Train Number:</strong> ${train.trainNumber || 'N/A'}</p>
        `;
    }

    // Set confirm button data
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.setAttribute('data-type', 'train');
        confirmDeleteBtn.setAttribute('data-id', trainId);
    }

    // Show the confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    modal.show();
    console.log('Delete confirmation modal shown for train');
}

// Delete train
function deleteTrain(trainId) {
    const trains = localStorageUtil.get('trains') || [];
    const train = trains.find(train => train.id === trainId);
    const filteredTrains = trains.filter(train => train.id !== trainId);

    // Save updated trains to storage
    localStorageUtil.set('trains', filteredTrains);

    // Close the delete confirmation modal and remove backdrop
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    if (deleteModal) {
        deleteModal.hide();
        // Remove modal backdrop
        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 200);
    }

    // After backdrop is removed, then show success message in modal
    setTimeout(() => {
        const successTitle = document.getElementById('successTitle');
        if (successTitle) {
            successTitle.textContent = 'Train Deleted';
        }

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = `Train "${train.name}" has been successfully deleted from the system.`;
        }

        // Show the success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // After modal is closed, refresh the dashboard
        document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
            // Ensure this modal's backdrop is also removed
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            initializeDashboard();
        }, { once: true });
    }, 300);
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alertContainer.removeChild(alert);
        }, 300);
    }, 5000);
}

// Extract query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get mock users data
function getMockUsers() {
    const users = [
        {
            id: 'USR001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            mobileNumber: '9876543210',
            registrationDate: '2023-01-15T10:30:00Z'
        },
        {
            id: 'USR002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            mobileNumber: '8765432109',
            registrationDate: '2023-02-20T14:45:00Z'
        },
        {
            id: 'USR003',
            name: 'Rahul Kumar',
            email: 'rahul.kumar@example.com',
            mobileNumber: '7654321098',
            registrationDate: '2023-03-10T09:15:00Z'
        }
    ];

    // Save to storage if not already there
    if (!localStorageUtil.get('users')) {
        localStorageUtil.set('users', users);
    }

    return users;
}

// Get mock trains data
function getMockTrains() {
    const trains = [
        {
            id: 'TRN001',
            name: 'Rajdhani Express',
            trainNumber: '12301',
            source: 'Delhi',
            destination: 'Mumbai',
            departureTime: '16:00',
            type: 'Superfast',
            seats: 720,
            ownership: 'Indian Railways',
            addedDate: '2023-01-05T08:30:00Z'
        },
        {
            id: 'TRN002',
            name: 'Shatabdi Express',
            trainNumber: '12002',
            source: 'Chennai',
            destination: 'Bangalore',
            departureTime: '06:15',
            type: 'Superfast',
            seats: 650,
            ownership: 'IRCTC',
            addedDate: '2023-01-10T09:45:00Z'
        }
    ];

    // Save to storage if not already there
    if (!localStorageUtil.get('trains')) {
        localStorageUtil.set('trains', trains);
    }

    return trains;
}

// Get mock bookings data
function getMockBookings() {
    const bookings = [
        {
            bookingId: 'BK001',
            userId: 'USR001',
            trainNumber: '12301',
            trainName: 'Rajdhani Express',
            source: 'Delhi',
            destination: 'Mumbai',
            journeyDate: '2023-05-15T16:00:00Z',
            bookingDate: '2023-04-10T11:30:00Z',
            class: 'First Class',
            passengers: 2,
            fare: 3200,
            status: 'confirmed'
        },
        {
            bookingId: 'BK002',
            userId: 'USR002',
            trainNumber: '12002',
            trainName: 'Shatabdi Express',
            source: 'Chennai',
            destination: 'Bangalore',
            journeyDate: '2023-06-20T06:15:00Z',
            bookingDate: '2023-05-18T14:20:00Z',
            class: 'AC Tier 1',
            passengers: 1,
            fare: 1800,
            status: 'confirmed'
        },
        {
            bookingId: 'BK003',
            userId: 'USR003',
            trainNumber: '12301',
            trainName: 'Rajdhani Express',
            source: 'Delhi',
            destination: 'Mumbai',
            journeyDate: '2023-07-10T16:00:00Z',
            bookingDate: '2023-06-05T09:45:00Z',
            class: 'AC Tier 2',
            passengers: 3,
            fare: 4500,
            status: 'confirmed'
        },
        {
            bookingId: 'BK004',
            userId: 'USR001',
            trainNumber: '12002',
            trainName: 'Shatabdi Express',
            source: 'Bangalore',
            destination: 'Chennai',
            journeyDate: '2023-08-05T18:30:00Z',
            bookingDate: '2023-07-20T10:15:00Z',
            class: 'AC Tier 3',
            passengers: 2,
            fare: 2400,
            status: 'confirmed'
        },
        {
            bookingId: 'BK005',
            userId: 'USR002',
            trainNumber: '12301',
            trainName: 'Rajdhani Express',
            source: 'Mumbai',
            destination: 'Delhi',
            journeyDate: '2023-08-20T08:45:00Z',
            bookingDate: '2023-07-25T13:30:00Z',
            class: 'Sleeper',
            passengers: 1,
            fare: 900,
            status: 'cancelled'
        }
    ];

    // Save to storage if not already there
    if (!localStorageUtil.get('bookings')) {
        localStorageUtil.set('bookings', bookings);
    }

    return bookings;
}

// Storage utility for maintaining data
const localStorageUtil = {
    get: function (key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: function (key) {
        localStorage.removeItem(key);
    }
}; 