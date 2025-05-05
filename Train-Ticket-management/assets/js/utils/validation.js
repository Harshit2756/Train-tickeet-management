// Validation utilities for Indian Railways Ticket Management System

// Validation regex patterns
const validationPatterns = {
    // User account validation
    username: {
        regex: /^[a-zA-Z]{6,}$/,
        error: 'Username must be at least 6 characters long without numbers or special characters'
    },
    email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        error: 'Please enter a valid email address'
    },
    password: {
        regex: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        error: 'Password must be at least 8 characters with at least 1 uppercase letter, 1 number, and 1 special character'
    },
    mobileNumber: {
        regex: /^[0-9]{10}$/,
        error: 'Mobile number must be 10 digits without letters or special characters'
    },
    aadharNumber: {
        regex: /^[0-9]{12}$/,
        error: 'Aadhar number must be exactly 12 digits'
    },

    // Ticket & Reservation validation
    trainNumber: {
        regex: /^[0-9]{5}$/,
        error: 'Train number must be 5 digits'
    },
    pnrNumber: {
        regex: /^[0-9]{10}$/,
        error: 'PNR number must be 10 digits'
    }
};

// Generic validation function
function validateField(value, fieldName) {
    if (!value || value.trim() === '') {
        return {
            isValid: false,
            error: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`
        };
    }

    const pattern = validationPatterns[fieldName];
    if (pattern && !pattern.regex.test(value.trim())) {
        return {
            isValid: false,
            error: pattern.error
        };
    }

    return {
        isValid: true,
        error: ''
    };
}

// Individual validation functions for specific fields
function validateEmpty(value, fieldName) {
    if (!value || value.trim() === '') {
        return {
            isValid: false,
            error: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`
        };
    }
    return {
        isValid: true,
        error: ''
    };
}

function validateUsername(username) {
    return validateField(username, 'username');
}

function validateEmail(email) {
    return validateField(email, 'email');
}

function validatePassword(password) {
    return validateField(password, 'password');
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword || confirmPassword.trim() === '') {
        return {
            isValid: false,
            error: 'Please confirm your password'
        };
    }

    if (password !== confirmPassword) {
        return {
            isValid: false,
            error: 'Passwords do not match'
        };
    }

    return {
        isValid: true,
        error: ''
    };
}

function validateMobileNumber(mobileNumber) {
    return validateField(mobileNumber, 'mobileNumber');
}

function validateAadharNumber(aadharNumber) {
    return validateField(aadharNumber, 'aadharNumber');
}

function validateTrainNumber(trainNumber) {
    return validateField(trainNumber, 'trainNumber');
}

function validatePNRNumber(pnrNumber) {
    return validateField(pnrNumber, 'pnrNumber');
}

// Simple validation helpers (returning boolean)
function isValidEmail(email) {
    return validationPatterns.email.regex.test(email);
}

function isValidPhoneNumber(phone) {
    return validationPatterns.mobileNumber.regex.test(phone);
}

function isValidAadhar(aadhar) {
    return validationPatterns.aadharNumber.regex.test(aadhar);
}

function isValidPassword(password) {
    return validationPatterns.password.regex.test(password);
}

function isValidUsername(username) {
    return validationPatterns.username.regex.test(username);
}

// Form validation helper
function validateForm(formData) {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
        if (field === 'confirmPassword') {
            const result = validateConfirmPassword(formData.password, formData[field]);
            if (!result.isValid) {
                errors[field] = result.error;
                isValid = false;
            }
        } else if (validationPatterns[field]) {
            const result = validateField(formData[field], field);
            if (!result.isValid) {
                errors[field] = result.error;
                isValid = false;
            }
        }
    });

    return {
        isValid,
        errors
    };
}


// Export all validation functions
const validation = {
    patterns: validationPatterns,
    validateEmpty,
    validateField,
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateMobileNumber,
    validateAadharNumber,
    validateTrainNumber,
    validatePNRNumber,
    isValidEmail,
    isValidPhoneNumber,
    isValidAadhar,
    isValidPassword,
    isValidUsername,
    validateForm,
};