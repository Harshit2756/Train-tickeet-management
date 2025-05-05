# Indian Railways Ticket Management System

A comprehensive web-based ticket management system for Indian Railways with user and admin interfaces.

## Features

### For Users

- User registration and authentication
- Dashboard with booking statistics and visualizations
- Train search by source, destination, and date
- Ticket booking with different class options
- View and manage booked tickets
- Ticket cancellation
- Profile management

### For Administrators

- Admin authentication
- Admin dashboard with system statistics and visualizations
- User management
- Train management (add, edit, delete)
- Booking oversight
- System settings

## Project Structure

```
Train-Ticket-Management/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   └── ... (various images)
│   └── js/
│       ├── admin/
│       │   └── admin-dashboard.js
│       ├── auth/
│       │   └── auth.js
│       ├── user/
│       │   └── user-dashboard.js
│       └── utils/
│           └── main.js
├── pages/
│   ├── admin/
│   │   ├── admin-dashboard.html
│   │   └── ... (other admin pages)
│   ├── auth/
│   │   ├── login.html
│   │   └── register.html
│   └── user/
│       ├── user-dashboard.html
│       └── ... (other user pages)
└── index.html
```

## Technology Stack

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (Vanilla)

## Local Storage Architecture

The application uses browser's localStorage for data persistence with the following structure:

### Users

```json
[
  {
    "id": "user-1234567890",
    "username": "john_doe",
    "password": "Password@123",
    "email": "john.doe@example.com",
    "mobileNumber": "9876543210",
    "aadharNumber": "123456789012",
    "registrationDate": "2023-06-01T08:30:00.000Z"
  }
]
```

### Trains

```json
[
  {
    "id": "train-1234567890",
    "trainNumber": "12345",
    "name": "Rajdhani Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "departureTime": "16:00",
    "arrivalTime": "08:00",
    "duration": "16h 00m",
    "fareEconomy": 800,
    "fareStandard": 1200,
    "fareBusiness": 2000,
    "fareFirstClass": 3500,
    "type": "Super Fast",
    "addedDate": "2023-05-15T10:30:00.000Z"
  }
]
```

### Bookings

```json
[
  {
    "bookingId": "BOOKING-1234567890",
    "userId": "user-1234567890",
    "trainId": "train-1234567890",
    "trainNumber": "12345",
    "trainName": "Rajdhani Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "departureTime": "16:00",
    "arrivalTime": "08:00",
    "journeyDate": "2023-08-15",
    "bookingDate": "2023-07-20T14:30:00.000Z",
    "passengerName": "John Doe",
    "passengerAge": "30",
    "passengerGender": "Male",
    "passengerCount": 1,
    "class": "Economy",
    "fare": 800,
    "status": "confirmed"
  }
]
```

## How to Use

1. **Setup**: Simply open the index.html file in a web browser.

2. **Login Credentials**:

   - **Admin**:
     - Username: admin
     - Password: Admin@123
   - **User**:
     - Create a new account via the registration page or use any existing account.

3. **Navigation**:
   - Use the navigation bar to move between different sections.
   - For mobile devices, use the hamburger menu.

## Form Validations

All forms include robust validation:

- **Username**: At least 6 characters long without numbers or special characters
- **Password**: At least 8 characters with at least 1 uppercase letter, 1 number, and 1 special character
- **Email**: Valid email format
- **Mobile Number**: 10 digits without letters or special characters
- **Aadhar Number**: Exactly 12 digits

## Responsive Design

This application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices

## Browser Compatibility

Tested and working in:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Limitations

Since this is a frontend-only application using localStorage:

- Data will be retained only in the browser where it was created
- Data will be lost if browser storage is cleared
- No true multi-user support (would require a backend)

## Future Enhancements

- Backend integration with Node.js/Express
- Database integration (MongoDB)
- Real-time notifications
- Payment gateway integration
- PDF ticket generation
- Email confirmations
- Mobile app integration

## License

This project is open-source and available under the MIT License.

## Credits

Developed as a demonstration project for the Indian Railways ticket management system.
