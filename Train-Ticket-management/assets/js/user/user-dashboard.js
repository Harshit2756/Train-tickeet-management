// User Dashboard JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // MODIFIED: No authentication check needed
    // Get dummy user data instead
    const currentUser = {
        id: 'user-123456',
        username: 'Harshit',
        role: 'customer',
        email: 'harshit@gmail.com',
        mobile: '9876543210',
        address: '123 Main Street, Bangalore, Karnataka, 560001'
    };

    // Save user data to localStorage for persistance
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Update user info in UI
    updateUserInfo(currentUser);

    // Add dummy ticket data
    addDummyTickets();

    // Initialize dashboard stats with dummy data
    initializeDashboardStats();

    // Initialize ticket tables with dummy data
    initializeTicketsTable();

    // Setup event listeners
    setupEventListeners();

    // Show success message if redirected from booking confirmation
    const successMessage = getQueryParam('success');
    if (successMessage) {
        showAlert(decodeURIComponent(successMessage), 'success');
    }
});

// Update user information in the UI
function updateUserInfo(user) {
    // Display username in navbar
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.username;
    }

    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.username}`;
    }

    // Update user name in dropdown
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.username;
    }

    // Update account creation date if available
    const accountCreated = document.getElementById('accountCreated');
    if (accountCreated && user.registrationDate) {
        accountCreated.textContent = `Account created: ${formatDate(user.registrationDate)}`;
    }
}

// Initialize dashboard statistics
function initializeDashboardStats() {
    document.getElementById('totalBookings').textContent = '3';
    document.getElementById('activeBookings').textContent = '2';
    document.getElementById('firstClassBookings').textContent = '1';
    document.getElementById('acBookings').textContent = '1';
}

// Add dummy ticket data
function addDummyTickets() {
    // Create dummy ticket data
    const dummyTickets = [
        {
            bookingId: 'TKT-12345',
            userId: 'user-123456',
            trainId: 'TRN-001',
            trainNumber: '12345',
            trainName: 'Rajdhani Express',
            source: 'Delhi',
            destination: 'Mumbai',
            departureTime: '16:30',
            arrivalTime: '08:45',
            journeyDate: '2023-12-15',
            bookingDate: '2023-11-30',
            passengerName: 'John Doe',
            passengerAge: 32,
            passengerGender: 'Male',
            passengerCount: 2,
            class: 'AC Tier 1',
            fare: 3200,
            status: 'confirmed'
        },
        {
            bookingId: 'TKT-67890',
            userId: 'user-123456',
            trainId: 'TRN-002',
            trainNumber: '54321',
            trainName: 'Shatabdi Express',
            source: 'Bangalore',
            destination: 'Chennai',
            departureTime: '09:15',
            arrivalTime: '14:30',
            journeyDate: '2023-12-20',
            bookingDate: '2023-12-01',
            passengerName: 'Jane Smith',
            passengerAge: 28,
            passengerGender: 'Female',
            passengerCount: 1,
            class: 'AC Tier 2',
            fare: 1800,
            status: 'confirmed'
        },
        {
            bookingId: 'TKT-24680',
            userId: 'user-123456',
            trainId: 'TRN-003',
            trainNumber: '98765',
            trainName: 'Duronto Express',
            source: 'Kolkata',
            destination: 'Delhi',
            departureTime: '23:55',
            arrivalTime: '12:40',
            journeyDate: '2023-11-25',
            bookingDate: '2023-11-10',
            passengerName: 'Alex Johnson',
            passengerAge: 45,
            passengerGender: 'Male',
            passengerCount: 3,
            class: 'Sleeper',
            fare: 2500,
            status: 'cancelled'
        }
    ];

    // Store in localStorage
    localStorage.setItem('bookings', JSON.stringify(dummyTickets));
}

// Initialize tickets table with dummy data
function initializeTicketsTable() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const tableBody = document.getElementById('ticketsTableBody');

    if (tableBody) {
        tableBody.innerHTML = '';

        if (bookings.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="11" class="text-center py-5">
                        <div class="empty-tickets-message">
                            <i class="bi bi-ticket-detailed text-muted" style="font-size: 3rem;"></i>
                            <p class="mt-3 mb-0 fw-bold">No tickets found.</p>
                            <p class="text-muted">Book your first journey!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Display tickets
        bookings.forEach(ticket => {
            const row = document.createElement('tr');

            // Get status badge class
            let statusBadgeClass = 'bg-success';
            if (ticket.status === 'cancelled') {
                statusBadgeClass = 'bg-danger';
            } else if (ticket.status === 'pending') {
                statusBadgeClass = 'bg-warning';
            }

            // Only show cancel button if ticket is not cancelled
            const cancelButtonHtml = ticket.status !== 'cancelled' ?
                `<button class="btn cancel-ticket-btn btn-danger" data-booking-id="${ticket.bookingId}" data-bs-toggle="tooltip" title="Cancel Ticket">
                    <i class="bi bi-x-circle"></i>
                </button>` : '';

            // Get user data
            const userData = JSON.parse(localStorage.getItem('currentUser')) || {};

            row.innerHTML = `
                <td>${ticket.bookingId}</td>
                <td>${ticket.trainId}</td>
                <td>${ticket.userId}</td>
                <td>${userData.username || ticket.passengerName}</td>
                <td>${ticket.source}</td>
                <td>${ticket.destination}</td>
                <td>${formatDate(ticket.journeyDate)} ${ticket.departureTime}</td>
                <td>${formatDate(ticket.journeyDate)} ${ticket.arrivalTime}</td>
                <td>${ticket.passengerCount}</td>
                <td><span class="badge ${statusBadgeClass}">${ticket.status}</span></td>
                <td>
                    <div class="actions-container">
                        <button class="btn view-ticket-btn btn-primary" data-booking-id="${ticket.bookingId}" data-bs-toggle="tooltip" title="View Ticket">
                        <i class="bi bi-eye"></i>
                    </button>
                        ${cancelButtonHtml}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Populate train search results
function populateTrainSearchResults(searchResults) {
    const resultsContainer = document.getElementById('trainSearchResults');

    if (resultsContainer) {
        resultsContainer.innerHTML = '';

        searchResults.forEach(train => {
            const card = document.createElement('div');
            card.className = 'card mb-3 train-card';
            card.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <h5 class="card-title mb-1">${train.name}</h5>
                            <p class="text-muted mb-0">#${train.trainNumber}</p>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex align-items-center">
                                <div class="train-route me-3">
                                    <div class="route-point from-point">
                                        <span class="route-time">${train.departureTime}</span>
                                        <span class="route-station">${train.source}</span>
                                    </div>
                                    <div class="route-line"></div>
                                    <div class="route-point to-point">
                                        <span class="route-time">${train.arrivalTime}</span>
                                        <span class="route-station">${train.destination}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <p class="mb-0"><i class="bi bi-clock me-2"></i>${train.duration}</p>
                            <p class="mb-0"><i class="bi bi-calendar me-2"></i>Daily</p>
                        </div>
                        <div class="col-md-2">
                            <div class="price-container">
                                <span class="label">Starting from</span>
                                <h5 class="price mb-0">${formatCurrency(train.fareEconomy)}</h5>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-primary book-train-btn w-100" data-train-id="${train.id}">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });

        // Add event listeners to book buttons
        document.querySelectorAll('.book-train-btn').forEach(button => {
            button.addEventListener('click', function () {
                const trainId = this.getAttribute('data-train-id');
                showBookingForm(trainId, searchResults);
            });
        });
    }
}

// Show booking form for selected train
function showBookingForm(trainId, searchResults) {
    // Find selected train
    const selectedTrain = searchResults.find(train => train.id === trainId);

    if (!selectedTrain) return;

    // Show booking form
    const bookingFormContainer = document.getElementById('bookTicketForm');
    bookingFormContainer.classList.remove('d-none');

    // Hide search results
    document.getElementById('trainSearchResults').classList.add('d-none');

    // Populate train details
    document.getElementById('selectedTrainName').textContent = selectedTrain.name;
    document.getElementById('selectedTrainNumber').textContent = selectedTrain.trainNumber;
    document.getElementById('selectedJourneyDetails').textContent =
        `${selectedTrain.source} to ${selectedTrain.destination} | ${selectedTrain.departureTime} - ${selectedTrain.arrivalTime}`;

    // Populate fare options
    const fareContainer = document.getElementById('fareOptions');
    fareContainer.innerHTML = '';

    // Add fare options
    const fareOptions = [
        { class: 'Economy', fare: selectedTrain.fareEconomy },
        { class: 'Standard', fare: selectedTrain.fareStandard || (selectedTrain.fareEconomy * 1.3) },
        { class: 'Business', fare: selectedTrain.fareBusiness || (selectedTrain.fareEconomy * 1.8) },
        { class: 'First Class', fare: selectedTrain.fareFirstClass || (selectedTrain.fareEconomy * 2.5) }
    ];

    fareOptions.forEach(option => {
        const fareOption = document.createElement('div');
        fareOption.className = 'form-check mb-3';
        fareOption.innerHTML = `
            <input class="form-check-input" type="radio" name="fareClass" id="fare${option.class}" 
                value="${option.class}" data-fare="${option.fare}" ${option.class === 'Economy' ? 'checked' : ''}>
            <label class="form-check-label d-flex justify-content-between" for="fare${option.class}">
                <span>${option.class}</span>
                <span>${formatCurrency(option.fare)}</span>
            </label>
        `;
        fareContainer.appendChild(fareOption);
    });

    // Add event listener to passenger count input
    const passengerCount = document.getElementById('passengerCount');
    const selectedFare = document.querySelector('input[name="fareClass"]:checked');

    if (passengerCount && selectedFare) {
        updateTotalFare(parseInt(passengerCount.value), parseFloat(selectedFare.getAttribute('data-fare')));
    }

    passengerCount.addEventListener('change', function () {
        const selectedFare = document.querySelector('input[name="fareClass"]:checked');
        if (selectedFare) {
            updateTotalFare(parseInt(this.value), parseFloat(selectedFare.getAttribute('data-fare')));
        }
    });

    // Add event listener to fare class radio buttons
    document.querySelectorAll('input[name="fareClass"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const passengerCount = parseInt(document.getElementById('passengerCount').value);
            updateTotalFare(passengerCount, parseFloat(this.getAttribute('data-fare')));
        });
    });

    // Store selected train for booking
    storage.set('selectedTrain', selectedTrain);

    // Scroll to booking form
    bookingFormContainer.scrollIntoView({ behavior: 'smooth' });
}

// Update total fare based on passenger count and selected fare class
function updateTotalFare(passengerCount, fare) {
    const totalFare = passengerCount * fare;
    document.getElementById('totalFare').textContent = formatCurrency(totalFare);
}

// Setup event listeners
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

    // View Tickets link
    const viewTicketsLink = document.getElementById('viewTicketsLink');
    if (viewTicketsLink) {
        viewTicketsLink.addEventListener('click', function (e) {
            e.preventDefault();
            const ticketsSection = document.getElementById('ticketsSection');
            if (ticketsSection) {
                ticketsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // View ticket buttons
    document.addEventListener('click', function (e) {
        if (e.target.closest('.view-ticket-btn')) {
            const button = e.target.closest('.view-ticket-btn');
            const bookingId = button.getAttribute('data-booking-id');
            viewTicket(bookingId);
        }
    });

    // Cancel ticket buttons in the tickets table
    document.addEventListener('click', function (e) {
        if (e.target.closest('.cancel-ticket-btn')) {
            const button = e.target.closest('.cancel-ticket-btn');
            const bookingId = button.getAttribute('data-booking-id');
            showCancelConfirmation(bookingId);
        }
    });

    // Print ticket button
    const printTicketBtn = document.getElementById('printTicketBtn');
    if (printTicketBtn) {
        printTicketBtn.addEventListener('click', function () {
            window.print();
        });
    }
}

// Show cancel confirmation modal
function showCancelConfirmation(bookingId) {
    // Get booking details
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
        return;
    }

    // Create and show confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'cancelTicketModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Cancel Ticket</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to cancel the following ticket?</p>
                    <div class="alert alert-info">
                        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                        <p><strong>Train:</strong> ${booking.trainName} (${booking.trainNumber})</p>
                        <p><strong>Journey:</strong> ${booking.source} to ${booking.destination}</p>
                        <p><strong>Date:</strong> ${formatDate(booking.journeyDate)}</p>
                    </div>
                    <p class="text-danger">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No, Keep My Ticket</button>
                    <button type="button" class="btn btn-danger" id="confirmCancelBtn">Yes, Cancel Ticket</button>
                </div>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modal);

    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Add event listener to confirm button
    document.getElementById('confirmCancelBtn').addEventListener('click', function () {
        cancelTicket(bookingId);
        modalInstance.hide();

        // Remove modal from DOM after hiding
        modal.addEventListener('hidden.bs.modal', function () {
            modal.remove();
        });
    });

    // Remove modal from DOM when hidden
    modal.addEventListener('hidden.bs.modal', function () {
        modal.remove();
    });
}

// Cancel ticket function
function cancelTicket(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingIndex = bookings.findIndex(b => b.bookingId === bookingId);

    if (bookingIndex === -1) {
        return;
    }

    // Update status to cancelled
    bookings[bookingIndex].status = 'cancelled';

    // Save back to localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Refresh tickets table
    initializeTicketsTable();

    // Show success message
    showAlert('Ticket cancelled successfully!', 'success');
}

// View ticket details
function viewTicket(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
        return;
    }

    // Populate modal with ticket details
    document.getElementById('modalTrainName').textContent = `${booking.trainName} (${booking.trainNumber})`;
    document.getElementById('modalJourneyDetails').textContent = `${booking.source} to ${booking.destination}`;
    document.getElementById('modalStatus').textContent = booking.status;
    document.getElementById('modalStatus').className = `badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'} mb-3`;

    // Train details
    document.getElementById('modalTrainId').textContent = booking.trainId;
    document.getElementById('modalBoardingStation').textContent = booking.source;
    document.getElementById('modalDestinationStation').textContent = booking.destination;
    document.getElementById('modalJourneyDate').textContent = formatDate(booking.journeyDate);
    document.getElementById('modalDepartureTime').textContent = booking.departureTime;
    document.getElementById('modalArrivalTime').textContent = booking.arrivalTime;
    document.getElementById('modalClass').textContent = booking.class;

    // Passenger details
    document.getElementById('modalUserId').textContent = booking.userId;
    document.getElementById('modalPassengerName').textContent = booking.passengerName;
    document.getElementById('modalPassengerDetails').textContent = `${booking.passengerAge} years, ${booking.passengerGender}`;
    document.getElementById('modalPassengerCount').textContent = booking.passengerCount;
    document.getElementById('modalFare').textContent = `₹${booking.fare}`;

    // Booking details
    document.getElementById('modalBookingId').textContent = booking.bookingId;
    document.getElementById('modalBookingDate').textContent = formatDate(booking.bookingDate);
    document.getElementById('modalStatusDetail').textContent = booking.status;
    document.getElementById('modalStatusDetail').className = `badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`;

    // Handle cancel button - only create it if ticket is not cancelled
    const cancelButtonContainer = document.getElementById('cancelButtonContainer');
    cancelButtonContainer.innerHTML = ''; // Clear previous button

    if (booking.status !== 'cancelled') {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-danger';
        cancelBtn.id = 'cancelTicketBtn';
        cancelBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i> Cancel Ticket';
        cancelBtn.setAttribute('data-booking-id', booking.bookingId);
        cancelBtn.style.borderRadius = '4px';  // Make it look consistent
        cancelBtn.style.padding = '0.5rem 1rem';  // Proper padding

        // Add event listener
        cancelBtn.addEventListener('click', function () {
            const bookingId = this.getAttribute('data-booking-id');
            // Hide the current modal
            const ticketModal = bootstrap.Modal.getInstance(document.getElementById('ticketDetailsModal'));
            if (ticketModal) {
                ticketModal.hide();
            }

            // Show the cancel confirmation
            setTimeout(() => {
                showCancelConfirmation(bookingId);
            }, 500);
        });

        cancelButtonContainer.appendChild(cancelBtn);
    }

    // Show modal
    const ticketModal = new bootstrap.Modal(document.getElementById('ticketDetailsModal'));
    ticketModal.show();
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

// Get URL query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}