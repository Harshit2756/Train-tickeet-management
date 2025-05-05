// Train Registration JavaScript for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Check if admin is logged in
    checkAdminAuth();

    // Get URL parameters to see if we're in edit mode
    const params = new URLSearchParams(window.location.search);
    const trainId = params.get('trainId');
    const mode = params.get('mode');

    // If we're in edit mode, load train data
    if (trainId && mode === 'edit') {
        loadTrainData(trainId);
    }

    // Load the train table
    loadTrainTable();

    // Setup event listeners
    setupEventListeners();
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

// Load train table
function loadTrainTable() {
    const trains = localStorageUtil.get('trains') || [];
    const trainsTableBody = document.getElementById('trainsTableBody');

    if (!trainsTableBody) return;

    if (trains.length === 0) {
        trainsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No trains found</td></tr>';
        return;
    }

    trainsTableBody.innerHTML = '';

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

    // Initialize tooltips
    initializeTooltips();

    // Setup delete buttons
    setupDeleteButtons();
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Setup delete buttons
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-danger[data-train-id]');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trainId = this.getAttribute('data-train-id');
            deleteTrain(trainId);
        });
    });
}

// Load train data for editing
function loadTrainData(trainId) {
    const trains = localStorageUtil.get('trains') || [];
    const train = trains.find(t => t.id === trainId);

    if (!train) {
        showAlert('Train not found', 'danger');
        return;
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = 'Edit Train';
    }

    // Update submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.textContent = 'Update Train';
    }

    // Add a hidden input for trainId
    const trainForm = document.getElementById('trainForm');
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'trainId';
    hiddenInput.value = trainId;
    trainForm.appendChild(hiddenInput);

    // Set form values
    document.getElementById('trainName').value = train.name;
    document.getElementById('trainSeats').value = train.seats || '';
    document.getElementById('trainFrom').value = train.source;
    document.getElementById('trainTo').value = train.destination;
    document.getElementById('trainOwnership').value = train.ownership || '';
}

// Setup event listeners
function setupEventListeners() {
    // Train form submission
    const trainForm = document.getElementById('trainForm');
    if (trainForm) {
        trainForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveTrainData();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // In a real app, this would clear the session
            window.location.href = '../auth/login.html';
        });
    }

    // Success modal hidden event
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('hidden.bs.modal', function () {
            // Reload the train table after modal is closed
            loadTrainTable();

            // Reset the form if not in edit mode
            const trainIdInput = document.getElementById('trainId');
            if (!trainIdInput) {
                document.getElementById('trainForm').reset();
            }
        });
    }
}

// Save train data
function saveTrainData() {
    // Get form values
    const trainName = document.getElementById('trainName').value.trim();
    const trainSeats = document.getElementById('trainSeats').value.trim();
    const trainFrom = document.getElementById('trainFrom').value;
    const trainTo = document.getElementById('trainTo').value;
    const trainOwnership = document.getElementById('trainOwnership').value;

    // Validate form data
    if (!trainName || !trainSeats || !trainFrom || !trainTo || !trainOwnership) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    // Check if from and to are different
    if (trainFrom === trainTo) {
        showAlert('Source and destination stations cannot be the same', 'danger');
        return;
    }

    // Get existing trains
    const trains = localStorageUtil.get('trains') || [];

    // Check if we're in edit mode
    const trainIdInput = document.getElementById('trainId');
    const isEditMode = !!trainIdInput;

    if (isEditMode) {
        const trainId = trainIdInput.value;

        // Update existing train
        const updatedTrains = trains.map(train => {
            if (train.id === trainId) {
                return {
                    ...train,
                    name: trainName,
                    seats: parseInt(trainSeats),
                    source: trainFrom,
                    destination: trainTo,
                    ownership: trainOwnership,
                    updatedDate: new Date().toISOString()
                };
            }
            return train;
        });

        // Save updated trains
        localStorageUtil.set('trains', updatedTrains);

        // Show success message in modal
        const successTitle = document.getElementById('successTitle');
        if (successTitle) {
            successTitle.textContent = 'Train Updated Successfully';
        }

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = `Train "${trainName}" has been successfully updated in the system.`;
        }

        // Show the success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    } else {
        // Create new train
        const newTrain = {
            id: 'TRN' + (trains.length + 1).toString().padStart(3, '0'),
            name: trainName,
            seats: parseInt(trainSeats),
            source: trainFrom,
            destination: trainTo,
            ownership: trainOwnership,
            departureTime: '00:00', // Default value, would be set in a real app
            addedDate: new Date().toISOString()
        };

        // Add to trains array
        trains.push(newTrain);

        // Save updated trains
        localStorageUtil.set('trains', trains);

        // Show success message in modal
        const successTitle = document.getElementById('successTitle');
        if (successTitle) {
            successTitle.textContent = 'Train Registered Successfully';
        }

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = `Train "${trainName}" has been successfully registered in the system.`;
        }

        // Show the success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    }
}

// Delete train
function deleteTrain(trainId) {
    const trains = localStorageUtil.get('trains') || [];
    const train = trains.find(train => train.id === trainId);

    if (!train) {
        showAlert('Train not found', 'danger');
        return;
    }

    // Confirm deletion
    if (confirm(`Are you sure you want to delete train "${train.name}"?`)) {
        const filteredTrains = trains.filter(train => train.id !== trainId);

        // Save updated trains
        localStorageUtil.set('trains', filteredTrains);

        // Show success message
        showAlert(`Train "${train.name}" has been deleted`, 'success');

        // Reload train table
        loadTrainTable();
    }
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

// Storage utility for maintaining data
const localStorageUtil = {
    get: function (key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error accessing storage (get):', error);
            return [];
        }
    },
    set: function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error accessing storage (set):', error);
            return false;
        }
    },
    remove: function (key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error accessing storage (remove):', error);
            return false;
        }
    }
}; 