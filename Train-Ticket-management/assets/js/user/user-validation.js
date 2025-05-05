// User Dashboard Form Validation

document.addEventListener('DOMContentLoaded', function () {
    setupBookTicketValidation();
    setupUpdateProfileValidation();
});

// Book Ticket Form Validation
function setupBookTicketValidation() {
    // Passenger Name Validation
    const passengerNameField = document.getElementById('passengerName');
    if (passengerNameField) {
        passengerNameField.addEventListener('input', function () {
            const name = this.value.trim();
            const nameError = document.getElementById('passengerNameError');

            // Check if empty
            if (name.length === 0) {
                nameError.textContent = 'Name is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for minimum length
            if (name.length < 3) {
                nameError.textContent = 'Name must be at least 3 characters long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check for valid characters (only letters and spaces)
            if (!/^[a-zA-Z\s]+$/.test(name)) {
                nameError.textContent = 'Name should only contain letters and spaces';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            nameError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Mobile Number Validation
    const passengerMobileField = document.getElementById('passengerMobile');
    if (passengerMobileField) {
        passengerMobileField.addEventListener('input', function () {
            const mobile = this.value.trim();
            const mobileError = document.getElementById('passengerMobileError');

            // Check if empty
            if (mobile.length === 0) {
                mobileError.textContent = 'Mobile number is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for non-numeric characters
            if (/[^0-9]/.test(mobile)) {
                mobileError.textContent = 'Mobile number should only contain digits';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check for length
            if (mobile.length !== 10) {
                mobileError.textContent = 'Mobile number must be 10 digits long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            mobileError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Age Validation
    const passengerAgeField = document.getElementById('passengerAge');
    if (passengerAgeField) {
        passengerAgeField.addEventListener('input', function () {
            const age = this.value.trim();
            const ageError = document.getElementById('passengerAgeError');

            // Check if empty
            if (age.length === 0) {
                ageError.textContent = 'Age is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Convert to number and validate
            const ageNum = parseInt(age);

            // Check if it's a valid number
            if (isNaN(ageNum)) {
                ageError.textContent = 'Please enter a valid age';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check range
            if (ageNum < 1 || ageNum > 120) {
                ageError.textContent = 'Age must be between 1 and 120';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            ageError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Date Validation
    const travelDateField = document.getElementById('travelDate');
    if (travelDateField) {
        travelDateField.addEventListener('change', function () {
            const date = this.value;
            const dateError = document.getElementById('travelDateError');

            // Check if empty
            if (date.length === 0) {
                dateError.textContent = 'Travel date is required';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check if date is in the past
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                dateError.textContent = 'Travel date cannot be in the past';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            dateError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Station Selection Validation
    const boardingStationField = document.getElementById('boardingStation');
    const destinationStationField = document.getElementById('destinationStation');

    if (boardingStationField && destinationStationField) {
        // Boarding Station
        boardingStationField.addEventListener('change', function () {
            const boardingStation = this.value;
            const boardingError = document.getElementById('boardingStationError');
            const destinationStation = destinationStationField.value;

            // Check if empty
            if (boardingStation === "" || boardingStation === null) {
                boardingError.textContent = 'Boarding station is required';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check if same as destination
            if (boardingStation === destinationStation && destinationStation !== "") {
                boardingError.textContent = 'Boarding and destination stations cannot be the same';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            boardingError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });

        // Destination Station
        destinationStationField.addEventListener('change', function () {
            const destinationStation = this.value;
            const destinationError = document.getElementById('destinationStationError');
            const boardingStation = boardingStationField.value;

            // Check if empty
            if (destinationStation === "" || destinationStation === null) {
                destinationError.textContent = 'Destination station is required';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check if same as boarding
            if (destinationStation === boardingStation && boardingStation !== "") {
                destinationError.textContent = 'Boarding and destination stations cannot be the same';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            destinationError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Ticket Category Validation
    const ticketCategoryField = document.getElementById('ticketCategory');
    if (ticketCategoryField) {
        ticketCategoryField.addEventListener('change', function () {
            const category = this.value;
            const categoryError = document.getElementById('ticketCategoryError');

            // Check if empty
            if (category === "" || category === null) {
                categoryError.textContent = 'Ticket category is required';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            categoryError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Number of Tickets Validation
    const numTicketsField = document.getElementById('numTickets');
    if (numTicketsField) {
        numTicketsField.addEventListener('input', function () {
            const numTickets = this.value.trim();
            const numTicketsError = document.getElementById('numTicketsError');

            // Check if empty
            if (numTickets.length === 0) {
                numTicketsError.textContent = 'Number of tickets is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Convert to number and validate
            const numTicketsNum = parseInt(numTickets);

            // Check if it's a valid number
            if (isNaN(numTicketsNum)) {
                numTicketsError.textContent = 'Please enter a valid number';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check range
            if (numTicketsNum < 1 || numTicketsNum > 6) {
                numTicketsError.textContent = 'You can book 1-6 tickets at a time';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            numTicketsError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }
}

// Update Profile Form Validation
function setupUpdateProfileValidation() {
    // Email Validation
    const updateEmailField = document.getElementById('updateEmail');
    if (updateEmailField) {
        updateEmailField.addEventListener('input', function () {
            const email = this.value.trim();
            const emailError = document.getElementById('updateEmailError');

            // Check if empty
            if (email.length === 0) {
                emailError.textContent = 'Email is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for @ symbol
            if (!email.includes('@')) {
                emailError.textContent = 'Email must contain @ symbol';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check for domain
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = 'Email must contain a valid domain (e.g., gmail.com)';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            emailError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Mobile Number Validation
    const updateMobileField = document.getElementById('updateMobile');
    if (updateMobileField) {
        updateMobileField.addEventListener('input', function () {
            const mobile = this.value.trim();
            const mobileError = document.getElementById('updateMobileError');

            // Check if empty
            if (mobile.length === 0) {
                mobileError.textContent = 'Mobile number is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for non-numeric characters
            if (/[^0-9]/.test(mobile)) {
                mobileError.textContent = 'Mobile number should only contain digits';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check for length
            if (mobile.length !== 10) {
                mobileError.textContent = 'Mobile number must be 10 digits long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            mobileError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Password Update Checkbox
    const updatePasswordCheck = document.getElementById('updatePasswordCheck');
    const passwordUpdateFields = document.getElementById('passwordUpdateFields');
    if (updatePasswordCheck && passwordUpdateFields) {
        updatePasswordCheck.addEventListener('change', function () {
            if (this.checked) {
                passwordUpdateFields.classList.remove('d-none');
            } else {
                passwordUpdateFields.classList.add('d-none');
            }
        });
    }

    // Current Password Validation
    const currentPasswordField = document.getElementById('currentPassword');
    if (currentPasswordField) {
        currentPasswordField.addEventListener('input', function () {
            const password = this.value;
            const passwordError = document.getElementById('currentPasswordError');

            // Only validate if password update is checked
            if (!document.getElementById('updatePasswordCheck').checked) return;

            // Check if empty
            if (password.length === 0) {
                passwordError.textContent = 'Current password is required';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            passwordError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // New Password Validation
    const newPasswordField = document.getElementById('newPassword');
    if (newPasswordField) {
        newPasswordField.addEventListener('input', function () {
            const password = this.value;
            const passwordError = document.getElementById('newPasswordError');

            // Only validate if password update is checked
            if (!document.getElementById('updatePasswordCheck').checked) return;

            // Check if empty
            if (password.length === 0) {
                passwordError.textContent = 'New password is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Length check (at least 8 characters)
            if (password.length < 8) {
                passwordError.textContent = 'Password must be at least 8 characters long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Uppercase check
            if (!/[A-Z]/.test(password)) {
                passwordError.textContent = 'Password must contain at least 1 uppercase letter';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Number check
            if (!/[0-9]/.test(password)) {
                passwordError.textContent = 'Password must contain at least 1 number';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Special character check
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                passwordError.textContent = 'Password must contain at least 1 special character';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            passwordError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Confirm New Password Validation
    const confirmNewPasswordField = document.getElementById('confirmNewPassword');
    if (confirmNewPasswordField && newPasswordField) {
        confirmNewPasswordField.addEventListener('input', function () {
            const confirmPassword = this.value;
            const password = newPasswordField.value;
            const confirmPasswordError = document.getElementById('confirmNewPasswordError');

            // Only validate if password update is checked
            if (!document.getElementById('updatePasswordCheck').checked) return;

            // Check if empty
            if (confirmPassword.length === 0) {
                confirmPasswordError.textContent = 'Confirm password is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Match check
            if (confirmPassword !== password) {
                confirmPasswordError.textContent = 'Passwords do not match';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            confirmPasswordError.textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }
} 