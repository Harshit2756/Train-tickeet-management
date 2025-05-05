// Book Ticket JavaScript for Indian Railways Ticket Management System

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

    // Update user info in UI
    updateUserInfo(currentUser);

    // Auto-populate ONLY user ID in the form
    document.getElementById('userId').value = currentUser.id;

    // Set minimum date for travel to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('travelDate').min = formattedDate;

    // Add event listeners to form elements
    setupEventListeners();

    // Load dummy trains for selection
    loadDummyTrains();
});

// Update user information in the UI
function updateUserInfo(user) {
    // Display username in navbar
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.username;
    }

    // Update profile view modal
    populateProfileViewModal(user);
}

// Populate the profile view modal with user data
function populateProfileViewModal(user) {
    // Update profile username
    const profileUsername = document.getElementById('profileUsername');
    if (profileUsername) {
        profileUsername.textContent = user.username;
    }

    // Update profile role
    const profileRole = document.getElementById('profileRole');
    if (profileRole) {
        profileRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    // Update user ID
    const profileUserId = document.getElementById('profileUserId');
    if (profileUserId) {
        profileUserId.textContent = user.id;
    }

    // Update email
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = user.email;
    }

    // Update mobile
    const profileMobile = document.getElementById('profileMobile');
    if (profileMobile) {
        profileMobile.textContent = user.mobile;
    }

    // Update address
    const profileAddress = document.getElementById('profileAddress');
    if (profileAddress) {
        profileAddress.textContent = user.address;
    }
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Load dummy trains for route selection
function loadDummyTrains() {
    // Sample train data
    const dummyTrains = [
        {
            id: 'TRN-001',
            trainNumber: '12345',
            name: 'Rajdhani Express',
            source: 'Delhi',
            destination: 'Mumbai',
            departureTime: '16:30',
            arrivalTime: '08:45',
            duration: '16h 15m',
            fareEconomy: 1200,
            fareStandard: 1800,
            fareBusiness: 2500,
            fareFirstClass: 3200
        },
        {
            id: 'TRN-002',
            trainNumber: '54321',
            name: 'Shatabdi Express',
            source: 'Bangalore',
            destination: 'Chennai',
            departureTime: '09:15',
            arrivalTime: '14:30',
            duration: '5h 15m',
            fareEconomy: 800,
            fareStandard: 1200,
            fareBusiness: 1600,
            fareFirstClass: 2000
        },
        {
            id: 'TRN-003',
            trainNumber: '98765',
            name: 'Duronto Express',
            source: 'Kolkata',
            destination: 'Delhi',
            departureTime: '23:55',
            arrivalTime: '12:40',
            duration: '12h 45m',
            fareEconomy: 1100,
            fareStandard: 1500,
            fareBusiness: 2000,
            fareFirstClass: 2800
        },
        {
            id: 'TRN-004',
            trainNumber: '67890',
            name: 'Garib Rath Express',
            source: 'Mumbai',
            destination: 'Ahmedabad',
            departureTime: '11:20',
            arrivalTime: '19:45',
            duration: '8h 25m',
            fareEconomy: 700,
            fareStandard: 1000,
            fareBusiness: 1400,
            fareFirstClass: 1800
        },
        {
            id: 'TRN-005',
            trainNumber: '13579',
            name: 'Vande Bharat Express',
            source: 'Delhi',
            destination: 'Bangalore',
            departureTime: '06:10',
            arrivalTime: '22:30',
            duration: '16h 20m',
            fareEconomy: 1500,
            fareStandard: 2100,
            fareBusiness: 2800,
            fareFirstClass: 3500
        }
    ];

    // Store trains in localStorage
    localStorage.setItem('trains', JSON.stringify(dummyTrains));
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
    // Form submission
    const bookTicketForm = document.getElementById('bookTicketForm');
    if (bookTicketForm) {
        bookTicketForm.addEventListener('submit', handleBookingSubmit);
    }

    // Station selection changes
    const boardingStation = document.getElementById('boardingStation');
    const destinationStation = document.getElementById('destinationStation');

    if (boardingStation && destinationStation) {
        boardingStation.addEventListener('change', updateAvailableTrains);
        destinationStation.addEventListener('change', updateAvailableTrains);
    }

    // Ticket category change
    const ticketCategory = document.getElementById('ticketCategory');
    if (ticketCategory) {
        ticketCategory.addEventListener('change', function () {
            const selectedTrainId = document.getElementById('selectedTrainId').value;
            if (selectedTrainId) {
                updateFareDetails(selectedTrainId);
            }
        });
    }

    // Number of tickets change
    const numTickets = document.getElementById('numTickets');
    if (numTickets) {
        numTickets.addEventListener('change', function () {
            const selectedTrainId = document.getElementById('selectedTrainId').value;
            if (selectedTrainId) {
                updateFareDetails(selectedTrainId);
            }
        });
    }
}

// Display available trains in the UI
function displayAvailableTrains(trains) {
    const availableTrainsContainer = document.getElementById('availableTrains');

    if (!availableTrainsContainer) return;

    if (trains.length === 0) {
        availableTrainsContainer.innerHTML = `
            <div class="alert alert-warning">
                No trains available for the selected route. Please try a different route or date.
            </div>
        `;
        return;
    }

    let trainsHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Train</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Duration</th>
                        <th>Starting Fare</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
    `;

    trains.forEach(train => {
        trainsHTML += `
            <tr data-train-id="${train.id}" data-train-data='${JSON.stringify(train)}'>
                <td>
                    <div class="fw-bold">${train.name}</div>
                    <div class="text-muted small">#${train.trainNumber}</div>
                </td>
                <td>
                    <div class="fw-bold">${train.departureTime}</div>
                    <div class="text-muted small">${train.source}</div>
                </td>
                <td>
                    <div class="fw-bold">${train.arrivalTime}</div>
                    <div class="text-muted small">${train.destination}</div>
                </td>
                <td>${train.duration}</td>
                <td>${formatCurrency(train.fareEconomy)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-primary select-train-btn">Select</button>
                </td>
            </tr>
        `;
    });

    trainsHTML += `
                </tbody>
            </table>
        </div>
    `;

    availableTrainsContainer.innerHTML = trainsHTML;

    // Add event listeners to select train buttons
    const selectButtons = availableTrainsContainer.querySelectorAll('.select-train-btn');
    selectButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const trainId = row.dataset.trainId;
            const trainData = JSON.parse(row.dataset.trainData);

            // Highlight the selected row
            const allRows = availableTrainsContainer.querySelectorAll('tr[data-train-id]');
            allRows.forEach(r => r.classList.remove('table-primary'));
            row.classList.add('table-primary');

            // Update the selected train display
            selectTrain(trainData);
        });
    });
}

// New function to handle train selection
function selectTrain(trainData) {
    // Update hidden input with selected train ID
    const selectedTrainIdInput = document.getElementById('selectedTrainId');
    selectedTrainIdInput.value = trainData.id;

    // Update the train display area
    const selectedTrainDisplay = document.getElementById('selectedTrainDisplay');
    selectedTrainDisplay.innerHTML = `
        <div class="fw-bold">${trainData.name} (#${trainData.trainNumber})</div>
        <div class="text-muted small mb-1">${trainData.source} → ${trainData.destination}</div>
        <div class="d-flex justify-content-between align-items-center">
            <span>${trainData.departureTime} - ${trainData.arrivalTime}</span>
            <span class="badge bg-primary">${trainData.duration}</span>
        </div>
    `;

    // Update fare details
    updateFareDetails(trainData.id);
}

// Update available trains based on selected stations
function updateAvailableTrains() {
    const boardingStation = document.getElementById('boardingStation').value;
    const destinationStation = document.getElementById('destinationStation').value;

    if (!boardingStation || !destinationStation) return;

    // Check if both stations are selected and different
    if (boardingStation === destinationStation) {
        showAlert('Boarding and destination stations cannot be the same', 'danger');
        return;
    }

    // Get trains from localStorage
    const trains = JSON.parse(localStorage.getItem('trains')) || [];

    // Filter trains based on selected route
    let availableTrains = trains.filter(train => {
        // Exact match
        if (train.source === boardingStation && train.destination === destinationStation) {
            return true;
        }
        // For demo purposes, also show some trains for any combination (would be more sophisticated in a real app)
        return Math.random() > 0.5; // Randomly show some trains
    });

    // Show available trains
    displayAvailableTrains(availableTrains);

    // Clear any previously selected train
    document.getElementById('selectedTrainId').value = '';
    document.getElementById('selectedTrainDisplay').innerHTML = `
        <p class="text-muted mb-0">Please select a train from the list below</p>
    `;
}

// Update fare details based on selected train and ticket category
function updateFareDetails(trainId) {
    const trains = JSON.parse(localStorage.getItem('trains')) || [];
    const selectedTrain = trains.find(train => train.id === trainId);

    if (!selectedTrain) return;

    const ticketCategory = document.getElementById('ticketCategory').value;
    const numTickets = parseInt(document.getElementById('numTickets').value) || 1;

    // Get base fare based on ticket category
    let baseFare = selectedTrain.fareEconomy; // Default

    switch (ticketCategory) {
        case 'First Class':
            baseFare = selectedTrain.fareFirstClass;
            break;
        case 'AC Tier 1':
            baseFare = selectedTrain.fareBusiness;
            break;
        case 'AC Tier 2':
            baseFare = selectedTrain.fareStandard;
            break;
        case 'Tatkal':
            // Tatkal is 30% extra on the highest class
            baseFare = selectedTrain.fareFirstClass * 1.3;
            break;
    }

    // Calculate total fare
    const totalBaseFare = baseFare * numTickets;
    const gst = totalBaseFare * 0.05; // 5% GST
    const totalFare = totalBaseFare + gst;

    // Update fare display
    document.getElementById('baseFareDisplay').textContent = formatCurrency(totalBaseFare);
    document.getElementById('gstDisplay').textContent = formatCurrency(gst);
    document.getElementById('totalFareDisplay').textContent = formatCurrency(totalFare);
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();

    // Show spinner
    const bookingSpinner = document.getElementById('bookingSpinner');
    if (bookingSpinner) {
        bookingSpinner.classList.remove('d-none');
    }

    // Get form values
    const userId = document.getElementById('userId').value;
    const passengerName = document.getElementById('passengerName').value;
    const passengerMobile = document.getElementById('passengerMobile').value;
    const passengerAge = document.getElementById('passengerAge').value;
    const travelDate = document.getElementById('travelDate').value;
    const numTickets = document.getElementById('numTickets').value;
    const boardingStation = document.getElementById('boardingStation').value;
    const destinationStation = document.getElementById('destinationStation').value;
    const ticketCategory = document.getElementById('ticketCategory').value;
    const selectedTrainId = document.getElementById('selectedTrainId').value;

    if (!selectedTrainId) {
        showAlert('Please select a train from the list', 'danger');
        if (bookingSpinner) {
            bookingSpinner.classList.add('d-none');
        }
        return;
    }

    // Get selected train data
    const trains = JSON.parse(localStorage.getItem('trains')) || [];
    const trainData = trains.find(train => train.id === selectedTrainId);

    if (!trainData) {
        showAlert('Invalid train selection', 'danger');
        if (bookingSpinner) {
            bookingSpinner.classList.add('d-none');
        }
        return;
    }

    // Get fare details
    const basefare = parseFloat(document.getElementById('baseFareDisplay').textContent.replace('₹', '').replace(',', ''));
    const totalFare = parseFloat(document.getElementById('totalFareDisplay').textContent.replace('₹', '').replace(',', ''));

    // Create booking object
    const booking = {
        bookingId: 'TKT-' + Math.floor(100000 + Math.random() * 900000), // Random 6-digit number
        userId: userId,
        trainId: trainData.id,
        trainNumber: trainData.trainNumber,
        trainName: trainData.name,
        source: boardingStation,
        destination: destinationStation,
        departureTime: trainData.departureTime,
        arrivalTime: trainData.arrivalTime,
        journeyDate: travelDate,
        bookingDate: new Date().toISOString().split('T')[0],
        passengerName: passengerName,
        passengerAge: passengerAge,
        passengerGender: 'Not specified', // Could add gender field if needed
        passengerCount: numTickets,
        class: ticketCategory,
        fare: totalFare,
        status: 'confirmed'
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Simulate network delay (would be an actual API call in a real app)
    setTimeout(() => {
        // Hide spinner
        if (bookingSpinner) {
            bookingSpinner.classList.add('d-none');
        }

        // Redirect to confirmation page with booking details
        const bookingDetails = encodeURIComponent(JSON.stringify(booking));
        window.location.href = `booking-confirmation.html?booking=${bookingDetails}`;
    }, 1500);
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