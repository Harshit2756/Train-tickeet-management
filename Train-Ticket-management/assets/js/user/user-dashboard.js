// User Dashboard JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in and is a customer
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'customer') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }

    // Update user info in UI
    updateUserInfo(currentUser);

    // Initialize dashboard stats
    initializeDashboardStats(currentUser.id);

    // Generate charts
    generateBookingHistoryChart(currentUser.id);
    generateFareDistributionChart(currentUser.id);

    // Initialize ticket tables
    initializeUpcomingTicketsTable(currentUser.id);
    initializePastTicketsTable(currentUser.id);

    // Setup event listeners
    setupEventListeners();

    // Check for search results and show the booking form if needed
    const searchResults = storage.get('trainSearchResults');
    if (searchResults && searchResults.length > 0) {
        // Show booking form
        document.getElementById('bookingFormSection').classList.remove('d-none');
        // Populate form with search results
        populateTrainSearchResults(searchResults);
    }

    // Show success message if redirected from booking confirmation
    const successMessage = getQueryParam('success');
    if (successMessage) {
        showAlert(decodeURIComponent(successMessage), 'success');
    }
});

// Update user information in the UI
function updateUserInfo(user) {
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
function initializeDashboardStats(userId) {
    // Get all bookings for the user
    const bookings = storage.get('bookings') || [];
    const userBookings = bookings.filter(booking => booking.userId === userId);

    // Calculate stats
    const totalBookings = userBookings.length;
    const upcomingBookings = userBookings.filter(booking =>
        booking.status !== 'cancelled' &&
        new Date(booking.journeyDate) > new Date()
    ).length;

    const pastBookings = userBookings.filter(booking =>
        booking.status !== 'cancelled' &&
        new Date(booking.journeyDate) <= new Date()
    ).length;

    const cancelledBookings = userBookings.filter(booking =>
        booking.status === 'cancelled'
    ).length;

    const totalSpent = userBookings
        .filter(booking => booking.status !== 'cancelled')
        .reduce((total, booking) => total + booking.fare, 0);

    // Update UI with stats
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('upcomingTrips').textContent = upcomingBookings;
    document.getElementById('pastTrips').textContent = pastBookings;
    document.getElementById('cancelledTrips').textContent = cancelledBookings;
    document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
}

// Generate booking history chart
function generateBookingHistoryChart(userId) {
    const ctx = document.getElementById('bookingHistoryChart').getContext('2d');

    // Get all bookings for the user
    const bookings = storage.get('bookings') || [];
    const userBookings = bookings.filter(booking => booking.userId === userId);

    // Get last 6 months
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push(month.toLocaleDateString('en-US', { month: 'short' }));
    }

    // Count bookings per month
    const bookingsPerMonth = Array(6).fill(0);

    userBookings.forEach(booking => {
        const bookingDate = new Date(booking.bookingDate);

        for (let i = 0; i < 6; i++) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

            if (bookingDate.getMonth() === monthDate.getMonth() &&
                bookingDate.getFullYear() === monthDate.getFullYear()) {
                bookingsPerMonth[5 - i]++;
                break;
            }
        }
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Bookings',
                data: bookingsPerMonth,
                backgroundColor: 'rgba(0, 86, 179, 0.7)',
                borderColor: 'rgba(0, 86, 179, 1)',
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

// Generate fare distribution chart
function generateFareDistributionChart(userId) {
    const ctx = document.getElementById('fareDistributionChart').getContext('2d');

    // Get all bookings for the user
    const bookings = storage.get('bookings') || [];
    const userBookings = bookings.filter(booking =>
        booking.userId === userId &&
        booking.status !== 'cancelled'
    );

    // Count tickets by class
    const ticketClasses = ['Economy', 'Standard', 'Business', 'First Class'];
    const ticketsByClass = [0, 0, 0, 0];

    userBookings.forEach(booking => {
        if (booking.class === 'Economy') ticketsByClass[0]++;
        else if (booking.class === 'Standard') ticketsByClass[1]++;
        else if (booking.class === 'Business') ticketsByClass[2]++;
        else if (booking.class === 'First Class') ticketsByClass[3]++;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ticketClasses,
            datasets: [{
                data: ticketsByClass,
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
                }
            }
        }
    });
}

// Initialize upcoming tickets table
function initializeUpcomingTicketsTable(userId) {
    const bookings = storage.get('bookings') || [];
    const today = new Date();

    // Filter upcoming tickets
    const upcomingTickets = bookings.filter(booking =>
        booking.userId === userId &&
        booking.status !== 'cancelled' &&
        new Date(booking.journeyDate) > today
    );

    // Sort by journey date (ascending)
    upcomingTickets.sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate));

    const tableBody = document.getElementById('upcomingTicketsTableBody');

    if (tableBody) {
        tableBody.innerHTML = '';

        if (upcomingTickets.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No upcoming tickets found</td>
                </tr>
            `;
            return;
        }

        // Display tickets
        upcomingTickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.bookingId}</td>
                <td>${ticket.trainName} (${ticket.trainNumber})</td>
                <td>${ticket.source} to ${ticket.destination}</td>
                <td>${formatDate(ticket.journeyDate)}</td>
                <td>${ticket.departureTime}</td>
                <td>${ticket.class}</td>
                <td>
                    <button class="btn btn-action btn-info me-1 view-ticket-btn" data-booking-id="${ticket.bookingId}" data-bs-toggle="tooltip" title="View Ticket">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-action btn-danger cancel-ticket-btn" data-booking-id="${ticket.bookingId}" data-bs-toggle="tooltip" title="Cancel Ticket">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Initialize tooltips
        initializeTooltips();
    }
}

// Initialize past tickets table
function initializePastTicketsTable(userId) {
    const bookings = storage.get('bookings') || [];
    const today = new Date();

    // Filter past tickets
    const pastTickets = bookings.filter(booking =>
        booking.userId === userId &&
        (booking.status !== 'cancelled' && new Date(booking.journeyDate) <= today)
    );

    // Sort by journey date (descending)
    pastTickets.sort((a, b) => new Date(b.journeyDate) - new Date(a.journeyDate));

    const tableBody = document.getElementById('pastTicketsTableBody');

    if (tableBody) {
        tableBody.innerHTML = '';

        if (pastTickets.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No past tickets found</td>
                </tr>
            `;
            return;
        }

        // Display tickets
        pastTickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.bookingId}</td>
                <td>${ticket.trainName} (${ticket.trainNumber})</td>
                <td>${ticket.source} to ${ticket.destination}</td>
                <td>${formatDate(ticket.journeyDate)}</td>
                <td>${ticket.class}</td>
                <td>
                    <button class="btn btn-action btn-info view-ticket-btn" data-booking-id="${ticket.bookingId}" data-bs-toggle="tooltip" title="View Ticket">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Initialize tooltips
        initializeTooltips();
    }
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
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            auth.logout();
        });
    }

    // Profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'user-profile.html';
        });
    }

    // Train search form
    const searchForm = document.getElementById('trainSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const source = document.getElementById('sourceStation').value;
            const destination = document.getElementById('destinationStation').value;
            const journeyDate = document.getElementById('journeyDate').value;

            // Validate form
            if (!source || !destination || !journeyDate) {
                showAlert('Please fill all required fields', 'danger');
                return;
            }

            if (source === destination) {
                showAlert('Source and destination cannot be the same', 'danger');
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const selectedDate = new Date(journeyDate);
            if (selectedDate < today) {
                showAlert('Journey date cannot be in the past', 'danger');
                return;
            }

            // Show loading spinner
            document.getElementById('searchSpinner').classList.remove('d-none');

            // Simulate API call to search trains
            setTimeout(() => {
                // Get available trains
                const trains = storage.get('trains') || [];

                // Filter trains by route
                const availableTrains = trains.filter(train =>
                    train.source.toLowerCase() === source.toLowerCase() &&
                    train.destination.toLowerCase() === destination.toLowerCase()
                );

                // Hide loading spinner
                document.getElementById('searchSpinner').classList.add('d-none');

                if (availableTrains.length === 0) {
                    showAlert('No trains found for this route. Please try different stations or dates.', 'warning');
                    return;
                }

                // Store search results
                storage.set('trainSearchResults', availableTrains);

                // Show booking form section
                document.getElementById('bookingFormSection').classList.remove('d-none');

                // Populate search results
                populateTrainSearchResults(availableTrains);

                // Scroll to results
                document.getElementById('bookingFormSection').scrollIntoView({ behavior: 'smooth' });

            }, 1500); // Simulate network delay
        });
    }

    // Book ticket form
    const bookTicketForm = document.getElementById('bookTicketForm');
    if (bookTicketForm) {
        bookTicketForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get current user
            const currentUser = auth.getCurrentUser();
            if (!currentUser) {
                window.location.href = '../../pages/auth/login.html';
                return;
            }

            // Get selected train
            const selectedTrain = storage.get('selectedTrain');
            if (!selectedTrain) {
                showAlert('No train selected. Please search and select a train first.', 'danger');
                return;
            }

            // Get form values
            const passengerName = document.getElementById('passengerName').value;
            const passengerAge = document.getElementById('passengerAge').value;
            const passengerGender = document.getElementById('passengerGender').value;
            const passengerCount = parseInt(document.getElementById('passengerCount').value);
            const journeyDate = document.getElementById('bookingJourneyDate').value;
            const fareClass = document.querySelector('input[name="fareClass"]:checked').value;
            const farePer = parseFloat(document.querySelector('input[name="fareClass"]:checked').getAttribute('data-fare'));

            // Validate form
            if (!passengerName || !passengerAge || !passengerGender || !passengerCount || !journeyDate || !fareClass) {
                showAlert('Please fill all required fields', 'danger');
                return;
            }

            if (passengerCount < 1) {
                showAlert('Passenger count must be at least 1', 'danger');
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const selectedDate = new Date(journeyDate);
            if (selectedDate < today) {
                showAlert('Journey date cannot be in the past', 'danger');
                return;
            }

            // Show loading spinner
            document.getElementById('bookingSpinner').classList.remove('d-none');

            // Simulate API call to book ticket
            setTimeout(() => {
                // Calculate total fare
                const totalFare = passengerCount * farePer;

                // Create booking object
                const booking = {
                    bookingId: `BOOKING-${Date.now()}`,
                    userId: currentUser.id,
                    trainId: selectedTrain.id,
                    trainNumber: selectedTrain.trainNumber,
                    trainName: selectedTrain.name,
                    source: selectedTrain.source,
                    destination: selectedTrain.destination,
                    departureTime: selectedTrain.departureTime,
                    arrivalTime: selectedTrain.arrivalTime,
                    journeyDate: journeyDate,
                    bookingDate: new Date().toISOString(),
                    passengerName: passengerName,
                    passengerAge: passengerAge,
                    passengerGender: passengerGender,
                    passengerCount: passengerCount,
                    class: fareClass,
                    fare: totalFare,
                    status: 'confirmed'
                };

                // Get existing bookings or initialize empty array
                const bookings = storage.get('bookings') || [];

                // Add booking
                bookings.push(booking);

                // Save to localStorage
                storage.set('bookings', bookings);

                // Reset form
                bookTicketForm.reset();

                // Hide booking form
                bookTicketForm.classList.add('d-none');

                // Hide search results
                document.getElementById('trainSearchResults').classList.add('d-none');

                // Clear stored search results and selected train
                storage.remove('trainSearchResults');
                storage.remove('selectedTrain');

                // Hide loading spinner
                document.getElementById('bookingSpinner').classList.add('d-none');

                // Redirect to ticket confirmation or show success message
                window.location.href = 'user-dashboard.html?success=' + encodeURIComponent('Ticket booked successfully! You can view it in your upcoming tickets.');

            }, 2000); // Simulate network delay
        });
    }

    // Cancel booking buttons
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.cancel-ticket-btn')) {
            const button = e.target.closest('.cancel-ticket-btn');
            const bookingId = button.getAttribute('data-booking-id');

            utils.createConfirmationModal(
                'Cancel Ticket',
                'Are you sure you want to cancel this ticket? This action cannot be undone.',
                function () {
                    cancelTicket(bookingId);
                }
            );
        }
    });

    // View ticket buttons
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.view-ticket-btn')) {
            const button = e.target.closest('.view-ticket-btn');
            const bookingId = button.getAttribute('data-booking-id');

            viewTicket(bookingId);
        }
    });
}

// Cancel ticket
function cancelTicket(bookingId) {
    const bookings = storage.get('bookings') || [];

    // Find the booking
    const bookingIndex = bookings.findIndex(booking => booking.bookingId === bookingId);

    if (bookingIndex === -1) {
        showAlert('Booking not found', 'danger');
        return;
    }

    // Update the booking status
    bookings[bookingIndex].status = 'cancelled';

    // Save to localStorage
    storage.set('bookings', bookings);

    // Show success message
    showAlert('Ticket cancelled successfully', 'success');

    // Refresh ticket tables
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        initializeUpcomingTicketsTable(currentUser.id);
        initializeDashboardStats(currentUser.id);
    }
}

// View ticket details
function viewTicket(bookingId) {
    const bookings = storage.get('bookings') || [];

    // Find the booking
    const booking = bookings.find(booking => booking.bookingId === bookingId);

    if (!booking) {
        showAlert('Booking not found', 'danger');
        return;
    }

    // Populate ticket modal
    const modal = new bootstrap.Modal(document.getElementById('ticketDetailsModal'));

    document.getElementById('modalTrainName').textContent = `${booking.trainName} (${booking.trainNumber})`;
    document.getElementById('modalJourneyDetails').textContent = `${booking.source} to ${booking.destination}`;
    document.getElementById('modalJourneyDate').textContent = formatDate(booking.journeyDate);
    document.getElementById('modalDepartureTime').textContent = booking.departureTime;
    document.getElementById('modalClass').textContent = booking.class;
    document.getElementById('modalPassengerName').textContent = booking.passengerName;
    document.getElementById('modalPassengerDetails').textContent = `${booking.passengerAge} years, ${booking.passengerGender}`;
    document.getElementById('modalPassengerCount').textContent = booking.passengerCount;
    document.getElementById('modalFare').textContent = formatCurrency(booking.fare);
    document.getElementById('modalBookingId').textContent = booking.bookingId;
    document.getElementById('modalBookingDate').textContent = formatDate(booking.bookingDate);

    // Update status badge
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.textContent = booking.status;

    if (booking.status === 'confirmed') {
        statusBadge.className = 'badge bg-success';
    } else if (booking.status === 'cancelled') {
        statusBadge.className = 'badge bg-danger';
    } else {
        statusBadge.className = 'badge bg-warning';
    }

    // Show print and cancel buttons based on status
    const printBtn = document.getElementById('printTicketBtn');
    const cancelBtn = document.getElementById('cancelTicketBtn');

    if (booking.status === 'confirmed' && new Date(booking.journeyDate) > new Date()) {
        printBtn.classList.remove('d-none');
        cancelBtn.classList.remove('d-none');

        // Update cancel button data attribute
        cancelBtn.setAttribute('data-booking-id', booking.bookingId);
    } else {
        printBtn.classList.add('d-none');
        cancelBtn.classList.add('d-none');
    }

    // Set up print button
    printBtn.addEventListener('click', function () {
        window.print();
    });

    // Show modal
    modal.show();
} 