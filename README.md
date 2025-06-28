# Course Representative Management System

A comprehensive full-stack web application for managing course representatives, assignments, attendance, and communication between students, lecturers, and course representatives. This system provides a modern, feature-rich platform for academic management with real-time analytics, scheduling, and communication tools.

## ✨ Features

### Core Management
- **User Authentication**: Secure login system with JWT tokens for students, lecturers, and course representatives
- **Course Management**: Create and manage courses with assigned representatives and comprehensive tracking
- **Student Management**: Complete student lifecycle management with detailed profiles and enrollment tracking
- **Lecturer Management**: Manage lecturer profiles, course assignments, and academic responsibilities
- **Assignment Management**: Post, track, submit, and grade assignments with deadline management
- **Attendance Tracking**: Real-time attendance monitoring with QR code support and detailed reporting
- **Event Management**: Schedule and manage academic events, meetings, and workshops
- **Group Management**: Organize students into study groups with collaborative features
- **Feedback System**: Collect, manage, and analyze feedback from students and staff
- **Notification System**: Real-time notifications for important updates and announcements

### 🆕 New Advanced Features

#### 📊 Reports & Analytics Dashboard
- **Attendance Analytics**: Visual charts showing attendance trends and percentages
- **Assignment Performance**: Track submission rates, grades, and performance metrics
- **Course Statistics**: Comprehensive course analytics with student engagement data
- **Real-time Dashboard**: Live statistics and key performance indicators
- **Export Functionality**: Download reports in various formats (PDF, CSV, Excel)
- **Interactive Charts**: Bar charts, line charts, and data visualizations using Recharts
- **Filtering Options**: Filter data by course, date range, and other criteria

#### 📅 Calendar & Schedule Management
- **Monthly Calendar View**: Interactive calendar with event visualization
- **Event Management**: Add, edit, and delete events with full CRUD operations
- **Event Categories**: Different event types (lecture, exam, assignment, meeting, workshop)
- **Course Integration**: Link events to specific courses and track course schedules
- **Upcoming Events**: Smart listing of future events with priority indicators
- **Navigation Controls**: Month-to-month navigation with date range selection
- **Color-coded Events**: Visual distinction for different event types and priorities

#### 💬 Chat & Messaging System
- **Real-time Messaging**: Instant messaging with live updates
- **Conversation Types**: Support for direct messages, group chats, and course-based chats
- **User Management**: Add/remove participants from conversations
- **Message History**: Complete conversation history with search functionality
- **Course Group Chats**: Automatic course-based chat rooms for each course
- **Modern Chat UI**: Clean, intuitive interface with message status indicators
- **File Sharing**: Support for file attachments and media sharing

#### 🔍 Enhanced Search & Filtering
- **Advanced Search**: Search across students, courses, assignments, and events
- **Smart Filtering**: Filter by multiple criteria with dynamic results
- **Quick Actions**: Fast access to common operations
- **Bulk Operations**: Perform actions on multiple items simultaneously

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MySQL** database with optimized queries and indexing
- **JWT** for secure authentication and session management
- **Nodemailer** for automated email notifications
- **Bcrypt** for password hashing and security
- **CORS** enabled for cross-origin requests
- **Dotenv** for environment configuration

### Frontend
- **React.js** with modern hooks and functional components
- **Material-UI (MUI)** for consistent, beautiful UI components
- **Framer Motion** for smooth animations and transitions
- **Recharts** for data visualization and analytics charts
- **Axios** for HTTP requests and API communication
- **React Router** for navigation and routing
- **Context API** for state management
- **CSS3** with custom styling and responsive design

## 📁 Project Structure

```
course-rep-management-system/
├── Backend/                          # Node.js/Express backend
│   ├── controllers/                  # Route controllers with business logic
│   │   ├── authController.js         # Authentication and user management
│   │   ├── studentController.js      # Student CRUD operations
│   │   ├── courseController.js       # Course management
│   │   ├── assignmentController.js   # Assignment handling
│   │   ├── attendanceController.js   # Attendance tracking
│   │   ├── eventController.js        # Event management
│   │   ├── feedbackController.js     # Feedback system
│   │   ├── notificationController.js # Notification handling
│   │   └── ...
│   ├── routes/                       # API route definitions
│   │   ├── authRoute.js              # Authentication routes
│   │   ├── studentRoute.js           # Student management routes
│   │   ├── courseRoute.js            # Course routes
│   │   ├── assignmentRoute.js        # Assignment routes
│   │   ├── attendanceRoute.js        # Attendance routes
│   │   ├── eventRoute.js             # Event routes
│   │   ├── feedbackRoute.js          # Feedback routes
│   │   ├── notificationRoute.js      # Notification routes
│   │   ├── reportRoute.js            # 🆕 Analytics and reporting routes
│   │   ├── calendarRoute.js          # 🆕 Calendar and scheduling routes
│   │   └── chatRoute.js              # 🆕 Chat and messaging routes
│   ├── middleware/                   # Custom middleware functions
│   │   └── authMiddleware.js         # JWT authentication middleware
│   ├── services/                     # Business logic and external services
│   │   ├── customEmails.js           # Email templates and services
│   │   ├── customServices.js         # Custom business logic
│   │   ├── errorService.js           # Error handling services
│   │   └── responseService.js        # Standardized API responses
│   ├── utils/                        # Utility functions
│   │   └── sendEmail.js              # Email sending utilities
│   ├── config/                       # Configuration files
│   │   ├── db.js                     # Database connection configuration
│   │   └── logger.js                 # Logging configuration
│   ├── database_schema.sql           # Complete database schema with new tables
│   ├── app.js                        # Main Express application setup
│   └── index.js                      # Server entry point
├── frontend/                         # React.js frontend
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   └── Layout.js             # Main layout with navigation
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.js          # Main dashboard with analytics
│   │   │   ├── Login.js              # Authentication page
│   │   │   ├── Students.js           # Student management
│   │   │   ├── Courses.js            # Course management
│   │   │   ├── Assignments.js        # Assignment management
│   │   │   ├── Attendance.js         # Attendance tracking
│   │   │   ├── Events.js             # Event management
│   │   │   ├── Groups.js             # Group management
│   │   │   ├── Feedback.js           # Feedback system
│   │   │   ├── Notifications.js      # Notification center
│   │   │   ├── Reports.js            # 🆕 Analytics and reporting
│   │   │   ├── Calendar.js           # 🆕 Calendar and scheduling
│   │   │   └── Chat.js               # 🆕 Chat and messaging
│   │   ├── contexts/                 # React contexts for state management
│   │   │   └── AuthContext.js        # Authentication context
│   │   ├── App.js                    # Main React application
│   │   ├── App.css                   # Global styles
│   │   └── index.js                  # React entry point
│   ├── public/                       # Static assets
│   └── package.json                  # Frontend dependencies
└── README.md                         # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

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
   - Import the `database_schema.sql` file to set up all tables and sample data
   - Configure database connection in `config/db.js`

4. **Environment Variables**

   Create a `.env` file in the Backend directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h

   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587

   # Server Configuration
   PORT=4000
   NODE_ENV=development
   ```

5. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd Backend
   npm start
   ```

   The backend API will be available at: http://localhost:4000

2. **Start the Frontend Development Server**

   ```bash
   cd frontend
   npm start
   ```

   The frontend application will be available at: http://localhost:3000

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login with JWT token
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Student Management
- `GET /student` - Get all students with pagination
- `POST /student` - Create new student
- `GET /student/:id` - Get student by ID
- `PUT /student/:id` - Update student information
- `DELETE /student/:id` - Delete student

### Course Management
- `GET /course` - Get all courses
- `POST /course` - Create new course
- `GET /course/:id` - Get course by ID
- `PUT /course/:id` - Update course
- `DELETE /course/:id` - Delete course

### Assignment Management
- `GET /assignment` - Get all assignments
- `POST /assignment` - Create new assignment
- `GET /assignment/:id` - Get assignment by ID
- `PUT /assignment/:id` - Update assignment
- `DELETE /assignment/:id` - Delete assignment

### Attendance Management
- `GET /attendance` - Get attendance records
- `POST /attendance` - Mark attendance
- `GET /attendance/student/:id` - Get student attendance
- `GET /attendance/course/:id` - Get course attendance

### Event Management
- `GET /event` - Get all events
- `POST /event` - Create new event
- `GET /event/:id` - Get event by ID
- `PUT /event/:id` - Update event
- `DELETE /event/:id` - Delete event

### 🆕 Reports & Analytics
- `GET /report/dashboard` - Get dashboard analytics
- `GET /report/attendance` - Get attendance reports with filters
- `GET /report/assignments` - Get assignment performance reports
- `GET /report/courses` - Get course statistics

### 🆕 Calendar & Scheduling
- `GET /calendar/events` - Get calendar events by month/year
- `GET /calendar/upcoming` - Get upcoming events
- `GET /calendar/schedule/:studentId` - Get student schedule
- `GET /calendar/deadlines` - Get assignment deadlines

### 🆕 Chat & Messaging
- `GET /chat/conversations/:userId` - Get user conversations
- `GET /chat/messages/:conversationId` - Get conversation messages
- `POST /chat/messages` - Send new message
- `POST /chat/conversations` - Create new conversation
- `GET /chat/course-chat/:courseId` - Get course group chat

### Feedback System
- `GET /feedback` - Get all feedback
- `POST /feedback` - Submit new feedback
- `GET /feedback/:id` - Get feedback by ID
- `PUT /feedback/:id` - Update feedback

### Notification System
- `GET /notification` - Get user notifications
- `POST /notification` - Create new notification
- `PUT /notification/:id/read` - Mark notification as read

## 🎨 UI/UX Features

### Modern Design
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Material Design**: Consistent Material-UI components throughout
- **Dark/Light Theme**: Support for theme switching
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Loading States**: Proper loading indicators and skeleton screens

### Interactive Elements
- **Real-time Updates**: Live data updates without page refresh
- **Drag & Drop**: Intuitive file uploads and reordering
- **Search & Filter**: Advanced search with real-time filtering
- **Bulk Actions**: Perform operations on multiple items
- **Keyboard Shortcuts**: Power user shortcuts for efficiency

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Cross-origin request security
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Lazy Loading**: Component and route-based code splitting
- **Caching**: API response caching for better performance
- **Image Optimization**: Compressed images and lazy loading
- **Bundle Optimization**: Tree shaking and code splitting

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Build Testing
```bash
cd frontend
npm run build
```

## 📦 Deployment

### Backend Deployment
1. Set up production environment variables
2. Configure database for production
3. Set up PM2 or similar process manager
4. Configure reverse proxy (Nginx/Apache)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure environment variables
4. Set up custom domain and SSL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add proper error handling and validation
- Include comprehensive documentation
- Write tests for new features
- Update the README for any new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Check the inline code documentation
- **Email**: Contact the development team for support

## 🗺️ Roadmap

### Upcoming Features
- **Real-time Notifications**: WebSocket-based live notifications
- **File Management**: Advanced file upload and management system
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning-based insights
- **Integration APIs**: Third-party service integrations
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Reporting**: Custom report builder
- **Video Conferencing**: Built-in video call functionality

### Performance Improvements
- **Caching Layer**: Redis-based caching system
- **CDN Integration**: Content delivery network optimization
- **Database Optimization**: Query optimization and indexing
- **Progressive Web App**: PWA features for offline support

---

**Built with ❤️ for better academic management** 