# Course Representative Management System

A full-stack web application for managing course representatives, assignments, 
attendance, and communication between students, lecturers, and course 
representatives.

## Features

- **User Authentication**: Secure login system for students, lecturers, and 
  course representatives
- **Course Management**: Create and manage courses with assigned representatives
- **Assignment Management**: Post, track, and submit assignments
- **Attendance Tracking**: Monitor student attendance for courses
- **Event Management**: Schedule and manage academic events
- **Group Management**: Organize students into study groups
- **Feedback System**: Collect and manage feedback from students
- **Notification System**: Real-time notifications for important updates
- **Email Integration**: Automated email notifications

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **Nodemailer** for email services
- **Bcrypt** for password hashing

### Frontend

- **React.js** with modern hooks
- **CSS3** for styling
- **Context API** for state management

## Project Structure

```text
course-rep-management-system/
├── Backend/                 # Node.js/Express backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── public/             # Static assets
└── database_schema.sql     # Database schema
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd course-rep-management-system
   ```

2. **Backend Setup**

   ```bash
   cd Backend
   npm install
   ```

3. **Database Setup**

   - Create a MySQL database
   - Import the `database_schema.sql` file
   - Configure database connection in `config/db.js`

4. **Environment Variables**

   Create a `.env` file in the Backend directory:

   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

5. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**

   ```bash
   cd Backend
   npm start
   ```

2. **Start the Frontend**

   ```bash
   cd frontend
   npm start
   ```

The application will be available at:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:5000>

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Courses

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student

### Assignments

- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment

### Attendance

- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for 
details.

## Contact

For any questions or support, please open an issue in the repository. 