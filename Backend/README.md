# Course Representative Management System

A comprehensive full-stack web application for managing course representatives, students, lecturers, courses, assignments, attendance, and more.

## 🏗️ **System Architecture**

This is a **full-stack application** with:

### **Backend (Node.js/Express.js)**
- **Server**: Running on `http://localhost:4000`
- **Database**: PostgreSQL with 15 tables
- **API**: RESTful endpoints for all operations
- **Authentication**: JWT-based security

### **Frontend (React.js)**
- **Client**: Running on `http://localhost:3000`
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router DOM

## 🚀 **Quick Start**

### **1. Start the Backend**
```bash
# From the root directory
npm run dev
```
Backend will be available at: `http://localhost:4000`

### **2. Start the Frontend**
```bash
# From the frontend directory
cd frontend
npm start
```
Frontend will be available at: `http://localhost:3000`

### **3. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 🔐 **Test Credentials**

Use these credentials to login to the system:

### **Student Account 1:**
- **Student ID**: `STU002`
- **Password**: `password123`

### **Student Account 2:**
- **Student ID**: `TEST001`
- **Password**: `password123`

### **How to Login:**
1. Go to http://localhost:3000
2. Enter any of the credentials above
3. Click "Login"
4. You'll be redirected to the Dashboard

## 📋 **Features**

### **🔐 Authentication System**
- Student login with JWT tokens
- Secure password hashing
- Protected routes

### **👥 Student Management**
- Add, edit, delete students
- View student details
- Manage course representatives
- Student status tracking

### **👨‍🏫 Lecturer Management**
- Add, edit, delete lecturers
- Lecturer contact information
- Course assignments

### **📚 Course Management**
- Create and manage courses
- Assign lecturers to courses
- Course scheduling (day, time, semester)
- Course registration tracking

### **👥 Group Management**
- Create student groups
- General and course-specific groups
- Group member management

### **📝 Assignment Management**
- Create course assignments
- Set deadlines
- Assignment descriptions

### **📅 Event Management**
- Schedule academic events
- Event details (title, description, venue)
- Date and time management

### **📊 Attendance System**
- QR code-based attendance tracking
- Physical and online class support
- Location verification for physical classes
- Real-time attendance monitoring

### **💬 Feedback System**
- Anonymous and named feedback
- Student feedback submission
- Feedback management

### **🔔 Notification System**
- System-wide notifications
- Notification management

## 🛠️ **Technology Stack**

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Email**: Nodemailer
- **Logging**: Winston

### **Frontend**
- **Framework**: React.js
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **QR Code**: qrcode.react
- **Date Handling**: date-fns

## 📁 **Project Structure**

```
course-rep-management-system/
├── backend/
│   ├── config/          # Database and logger configuration
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── App.js       # Main app component
│   └── package.json     # Frontend dependencies
├── database_schema.sql  # Database schema
├── setup.sh            # Setup script
└── README.md           # This file
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /auth/login` - Student login
- `POST /auth/register` - Student registration

### **Students**
- `GET /student` - Get all students
- `POST /student` - Create student
- `PUT /student/:id` - Update student
- `DELETE /student/:id` - Delete student

### **Courses**
- `GET /course` - Get all courses
- `POST /course` - Create course
- `PUT /course/:id` - Update course
- `DELETE /course/:id` - Delete course

### **Lecturers**
- `GET /lecturer` - Get all lecturers
- `POST /lecturer` - Create lecturer
- `PUT /lecturer/:id` - Update lecturer
- `DELETE /lecturer/:id` - Delete lecturer

### **Groups**
- `GET /group` - Get all groups
- `POST /group` - Create group
- `PUT /group/:id` - Update group
- `DELETE /group/:id` - Delete group

### **Assignments**
- `GET /assignment` - Get all assignments
- `POST /assignment` - Create assignment
- `PUT /assignment/:id` - Update assignment
- `DELETE /assignment/:id` - Delete assignment

### **Events**
- `GET /event` - Get all events
- `POST /event` - Create event
- `PUT /event/:id` - Update event
- `DELETE /event/:id` - Delete event

### **Attendance**
- `GET /attendance` - Get attendance instances
- `POST /attendance/initialize` - Initialize attendance session
- `POST /attendance/close` - Close attendance session
- `POST /attendance/mark` - Mark student attendance

### **Feedback**
- `GET /feedback` - Get all feedback
- `POST /feedback` - Submit feedback
- `DELETE /feedback/:id` - Delete feedback

### **Notifications**
- `GET /notification` - Get all notifications
- `POST /notification` - Create notification
- `PUT /notification/:id` - Update notification
- `DELETE /notification/:id` - Delete notification

## 🗄️ **Database Schema**

The system uses PostgreSQL with the following main tables:

- **student** - Student information and authentication
- **lecturer** - Lecturer information
- **course** - Course details and scheduling
- **group** - Student groups (general and course-specific)
- **assignment** - Course assignments
- **event** - Academic events
- **attendance_instance** - Attendance sessions
- **attendance_record** - Individual attendance records
- **feedback** - Student feedback
- **notification** - System notifications
- **course_registration** - Student-course relationships
- **group_member** - Student-group relationships

## 🔐 **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side data validation
- **CORS Configuration**: Cross-origin resource sharing setup

## 📱 **User Interface**

The frontend provides a modern, responsive interface with:

- **Material Design**: Clean and intuitive UI
- **Responsive Layout**: Works on desktop and mobile
- **Navigation**: Sidebar navigation with icons
- **Data Tables**: Sortable and searchable data tables
- **Forms**: Modal dialogs for data entry
- **QR Code Generation**: For attendance tracking
- **Real-time Updates**: Live data synchronization

## 🚀 **Deployment**

### **Development**
```bash
# Start backend
npm run dev

# Start frontend (in another terminal)
cd frontend && npm start
```

### **Production**
```bash
# Build frontend
cd frontend && npm run build

# Start backend with production settings
NODE_ENV=production npm start
```

## 📝 **Environment Variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=course_rep_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_RESET=your_jwt_reset_secret_key

# Email Configuration
SERVICE=gmail
SERVICE_USER=your_email@gmail.com
SERVICE_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Check the documentation
- Review the API endpoints
- Test the system functionality
- Contact the development team

---

**🎉 Your Course Representative Management System is now complete and ready to use!** 