// Authentication JavaScript file for Indian Railways Ticket Management System

document.addEventListener('DOMContentLoaded', function () {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginForm(loginForm);
    }

    // Handle registration form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        setupRegistrationForm(registrationForm);
    }

    // Handle toggle password visibility buttons
    const togglePasswordButtons = document.querySelectorAll('#togglePassword');
    if (togglePasswordButtons.length > 0) {
        togglePasswordButtons.forEach(button => {
            const inputId = button.closest('.input-group').querySelector('input').id;
            const passwordField = document.getElementById(inputId);

            button.addEventListener('click', function () {
                utils.togglePasswordVisibility(passwordField, this);
            });
        });
    }

    // Setup password strength meter if on registration page
    const passwordField = document.getElementById('password');
    if (passwordField && document.getElementById('confirmPassword')) {
        setupPasswordStrengthMeter(passwordField);
    }
});

// Setup login form validation and submission
function setupLoginForm(loginForm) {
    // Add real-time validation for username and password
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    // Add input event listener for username
    if (usernameField) {
        usernameField.addEventListener('input', function () {
            const username = this.value.trim();
            const usernameError = document.getElementById('usernameError');

            // Use the existing validateEmpty function
            const usernameValidation = validation.validateEmpty(username, 'username');
            usernameError.textContent = usernameValidation.isValid ? '' : usernameValidation.error;

            // Update classes based on validation
            if (username === '') {
                this.classList.remove('is-valid', 'is-invalid');
            } else if (usernameValidation.isValid) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        });
    }

    // Add input event listener for password
    if (passwordField) {
        passwordField.addEventListener('input', function () {
            const password = this.value.trim();
            const passwordError = document.getElementById('passwordError');

            // Use the existing validateEmpty function
            const passwordValidation = validation.validateEmpty(password, 'password');
            passwordError.textContent = passwordValidation.isValid ? '' : passwordValidation.error;

            // Update classes based on validation
            if (password === '') {
                this.classList.remove('is-valid', 'is-invalid');
            } else if (passwordValidation.isValid) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        });
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const username = usernameField.value.trim();
        const password = passwordField.value.trim();
        const loginType = document.querySelector('input[name="loginType"]:checked').value;

        // Reset previous error messages
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        // Validate input fields using our validation utilities
        const usernameValidation = validation.validateEmpty(username, 'username');
        const passwordValidation = validation.validateEmpty(password, 'password');

        // Check username validation
        if (!usernameValidation.isValid) {
            document.getElementById('usernameError').textContent = usernameValidation.error;
            return;
        }

        // Check password validation
        if (!passwordValidation.isValid) {
            document.getElementById('passwordError').textContent = passwordValidation.error;
            return;
        }

        // Show spinner
        const loginSpinner = document.getElementById('loginSpinner');
        if (loginSpinner) {
            loginSpinner.classList.remove('d-none');
        }

        // Simulate authentication with a small delay
        setTimeout(() => {
            // Hide spinner
            if (loginSpinner) {
                loginSpinner.classList.add('d-none');
            }

            // MODIFIED: Always proceed with login, bypassing actual authentication
            // Redirect based on user role
            if (loginType === 'admin') {
                window.location.href = '../admin/admin-dashboard.html';
            } else {
                window.location.href = '../user/user-dashboard.html';
            }
        }, 1000); // Simulate network delay
    });
}

// Setup registration form validation and submission
function setupRegistrationForm(registrationForm) {
    // Username validation
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.addEventListener('input', function () {
            const username = this.value.trim();

            // Check if empty
            if (username.length === 0) {
                document.getElementById('usernameError').textContent = 'Username is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Length check (at least 6 characters)
            if (username.length < 6) {
                document.getElementById('usernameError').textContent = 'Username must be at least 6 characters long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // No special characters or numbers
            if (/[^a-zA-Z]/.test(username)) {
                document.getElementById('usernameError').textContent = 'Username should only contain letters';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            document.getElementById('usernameError').textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', function () {
            const email = this.value.trim();

            // Check if empty
            if (email.length === 0) {
                document.getElementById('emailError').textContent = 'Email is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for @ symbol
            if (!email.includes('@')) {
                document.getElementById('emailError').textContent = 'Email must contain @ symbol';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check for domain
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('emailError').textContent = 'Email must contain a valid domain (e.g., gmail.com)';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            document.getElementById('emailError').textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Password validation
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function () {
            const password = this.value;

            // Check if empty
            if (password.length === 0) {
                document.getElementById('passwordError').textContent = 'Password is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Uppercase check
            if (!/[A-Z]/.test(password)) {
                document.getElementById('passwordError').textContent = 'Password must contain at least 1 uppercase letter';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Number check
            if (!/[0-9]/.test(password)) {
                document.getElementById('passwordError').textContent = 'Password must contain at least 1 number';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Special character check
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                document.getElementById('passwordError').textContent = 'Password must contain at least 1 special character';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Length check (at least 8 characters)
            if (password.length < 8) {
                document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            document.getElementById('passwordError').textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Confirm Password validation
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField && passwordField) {
        confirmPasswordField.addEventListener('input', function () {
            const confirmPassword = this.value;
            const password = passwordField.value;

            // Check if empty
            if (confirmPassword.length === 0) {
                document.getElementById('confirmPasswordError').textContent = 'Confirm password is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Match check
            if (confirmPassword !== password) {
                document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            document.getElementById('confirmPasswordError').textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Mobile Number validation
    const mobileNumberField = document.getElementById('mobileNumber');
    if (mobileNumberField) {
        mobileNumberField.addEventListener('input', function () {
            const mobileNumber = this.value.trim();

            // Check if empty
            if (mobileNumber.length === 0) {
                document.getElementById('mobileError').textContent = 'Mobile number is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for non-numeric characters
            if (/[^0-9]/.test(mobileNumber)) {
                document.getElementById('mobileError').textContent = 'Mobile number should not contain any alphabet';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check length
            if (mobileNumber.length !== 10) {
                document.getElementById('mobileError').textContent = 'Mobile number must be 10 digits long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            document.getElementById('mobileError').textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Aadhar Number validation
    const aadharNumberField = document.getElementById('aadharNumber');
    if (aadharNumberField) {
        aadharNumberField.addEventListener('input', function () {
            const aadharNumber = this.value.trim();

            // Check if empty
            if (aadharNumber.length === 0) {
                document.getElementById('aadharError').textContent = 'Aadhar number is required';
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }

            // Check for non-numeric characters
            if (/[^0-9]/.test(aadharNumber)) {
                document.getElementById('aadharError').textContent = 'Aadhar number should only contain digits';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Check length
            if (aadharNumber.length !== 12) {
                document.getElementById('aadharError').textContent = 'Aadhar number must be 12 digits long';
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }

            // Clear error if all validations pass
            document.getElementById('aadharError').textContent = '';
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        });
    }

    // Handle form submission
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // MODIFIED: Skip validation and storage, directly redirect to login
        window.location.href = 'login.html?registered=true';
    });
}

