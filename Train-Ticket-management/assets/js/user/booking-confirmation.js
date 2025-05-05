// Booking Confirmation JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        id: 'user-123456',
        username: 'Harshit',
        role: 'customer',
        email: 'harshit@gmail.com',
        mobile: '9876543210',
        address: '123 Main Street, New Delhi, 110001'
    };

    // Update user info in navbar
    updateUserInfo(currentUser);

    // Get booking details from URL
    const bookingParam = getQueryParam('booking');

    if (bookingParam) {
        try {
            const bookingDetails = JSON.parse(decodeURIComponent(bookingParam));
            displayBookingDetails(bookingDetails);
        } catch (error) {
            console.error('Error parsing booking details:', error);
            showErrorMessage();
        }
    } else {
        // No booking parameter found
        showErrorMessage();
    }

    // Setup event listeners
    setupEventListeners();
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

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get URL query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Display booking details on the page
function displayBookingDetails(booking) {
    // Train name and route
    document.getElementById('trainName').textContent = `${booking.trainName} (${booking.trainNumber})`;
    document.getElementById('trainRoute').textContent = `${booking.source} to ${booking.destination}`;

    // Booking ID and date
    document.getElementById('bookingId').textContent = booking.bookingId;
    document.getElementById('bookingDate').textContent = formatDate(booking.bookingDate);

    // Journey details
    document.getElementById('departureTime').textContent = booking.departureTime;
    document.getElementById('sourceStation').textContent = booking.source;
    document.getElementById('journeyDate').textContent = formatDate(booking.journeyDate);

    document.getElementById('arrivalTime').textContent = booking.arrivalTime;
    document.getElementById('destinationStation').textContent = booking.destination;
    // For arrival date, we'll assume same day for simplicity (could be calculated based on journey time in a real app)
    document.getElementById('arrivalDate').textContent = formatDate(booking.journeyDate);

    // Passenger details
    document.getElementById('passengerName').textContent = booking.passengerName;
    document.getElementById('userId').textContent = booking.userId;
    document.getElementById('passengerMobile').textContent = document.getElementById('profileMobile').textContent; // Use profile mobile
    document.getElementById('ticketCount').textContent = booking.passengerCount;

    // Train details
    document.getElementById('trainNumber').textContent = booking.trainNumber;
    document.getElementById('trainId').textContent = booking.trainId;
    document.getElementById('ticketClass').textContent = booking.class;
    document.getElementById('ticketStatus').textContent = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

    // Payment details
    const baseFare = booking.fare / 1.05; // Remove GST for base fare
    const gst = booking.fare - baseFare;

    document.getElementById('baseFare').textContent = formatCurrency(baseFare);
    document.getElementById('gstAmount').textContent = formatCurrency(gst);
    document.getElementById('totalFare').textContent = formatCurrency(booking.fare);
}

// Show error message if booking details not found
function showErrorMessage() {
    const mainContent = document.querySelector('main .container');

    if (mainContent) {
        mainContent.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <div class="alert alert-danger p-5">
                        <i class="bi bi-exclamation-triangle-fill" style="font-size: 4rem;"></i>
                        <h2 class="mt-3 mb-3">Booking Details Not Found</h2>
                        <p class="lead">We couldn't find the booking details for this ticket.</p>
                        <div class="mt-4">
                            <a href="user-dashboard.html" class="btn btn-primary me-2">Go to Dashboard</a>
                            <a href="book-ticket.html" class="btn btn-success">Book a Ticket</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Print ticket button
    const printTicketBtn = document.getElementById('printTicketBtn');
    if (printTicketBtn) {
        printTicketBtn.addEventListener('click', function () {
            window.print();
        });
    }
} 