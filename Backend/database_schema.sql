-- MS SQL Server Database Schema
-- Course Representative Management System Database Schema

-- Student table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='student' AND xtype='U')
CREATE TABLE student (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    isRep BIT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Lecturer table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='lecturer' AND xtype='U')
CREATE TABLE lecturer (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Course table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='course' AND xtype='U')
CREATE TABLE course (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lecturerId VARCHAR(50),
    day VARCHAR(20),
    start_time TIME,
    end_time TIME,
    semester VARCHAR(20),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (lecturerId) REFERENCES lecturer(id) ON DELETE SET NULL
);

-- Course-Student relationship table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='course_student' AND xtype='U')
CREATE TABLE course_student (
    id INT IDENTITY(1,1) PRIMARY KEY,
    courseId VARCHAR(50),
    studentId VARCHAR(50),
    is_register BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (courseId) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES student(id) ON DELETE CASCADE,
    UNIQUE(courseId, studentId)
);

-- Groups table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='groups' AND xtype='U')
CREATE TABLE [groups] (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    courseId VARCHAR(50),
    isGeneral BIT DEFAULT 0,
    description VARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (courseId) REFERENCES course(id) ON DELETE SET NULL
);

-- Group members table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='group_member' AND xtype='U')
CREATE TABLE group_member (
    id INT IDENTITY(1,1) PRIMARY KEY,
    groupId VARCHAR(50),
    studentId VARCHAR(50),
    isLeader BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (groupId) REFERENCES [groups](id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES student(id) ON DELETE CASCADE,
    UNIQUE(groupId, studentId)
);

-- Assignment table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='assignment' AND xtype='U')
CREATE TABLE assignment (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    courseId VARCHAR(50),
    deadline DATE,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (courseId) REFERENCES course(id) ON DELETE CASCADE
);

-- Event table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='event' AND xtype='U')
CREATE TABLE [event] (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    date DATE,
    time TIME,
    venue VARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Notification table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notification' AND xtype='U')
CREATE TABLE notification (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Feedback table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='feedback' AND xtype='U')
CREATE TABLE feedback (
    id VARCHAR(50) PRIMARY KEY,
    studentId VARCHAR(50),
    content VARCHAR(MAX) NOT NULL,
    is_anonymous BIT DEFAULT 0,
    submitted_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (studentId) REFERENCES student(id) ON DELETE CASCADE
);

-- Attendance instance table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='attendance_instance' AND xtype='U')
CREATE TABLE attendance_instance (
    id VARCHAR(50) PRIMARY KEY,
    courseId VARCHAR(50),
    date DATE NOT NULL,
    qr_token VARCHAR(MAX),
    expires_at DATETIME2,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    class_type VARCHAR(20) DEFAULT 'physical',
    is_close BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (courseId) REFERENCES course(id) ON DELETE CASCADE
);

-- Attendance table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='attendance' AND xtype='U')
CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    instanceId VARCHAR(50),
    courseId VARCHAR(50),
    date DATE NOT NULL,
    studentId VARCHAR(50),
    status VARCHAR(20) DEFAULT 'absent',
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (instanceId) REFERENCES attendance_instance(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES student(id) ON DELETE CASCADE,
    UNIQUE(instanceId, studentId)
);

-- Verification table for password reset
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='verification' AND xtype='U')
CREATE TABLE verification (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id VARCHAR(50),
    reset_token VARCHAR(MAX),
    reset_token_expiration DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    UNIQUE(student_id)
);

-- Security logs table for attendance tracking
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='security_logs' AND xtype='U')
CREATE TABLE security_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id VARCHAR(50),
    instance_id VARCHAR(50),
    event_type VARCHAR(50),
    details VARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (instance_id) REFERENCES attendance_instance(id) ON DELETE CASCADE
);

-- Attendance logs table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='attendance_logs' AND xtype='U')
CREATE TABLE attendance_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id VARCHAR(50),
    instance_id VARCHAR(50),
    location_checked BIT DEFAULT 0,
    location_valid BIT DEFAULT 0,
    details VARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (instance_id) REFERENCES attendance_instance(id) ON DELETE CASCADE
);

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_course_student_courseid')
CREATE INDEX idx_course_student_courseid ON course_student(courseId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_course_student_studentid')
CREATE INDEX idx_course_student_studentid ON course_student(studentId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_group_member_groupid')
CREATE INDEX idx_group_member_groupid ON group_member(groupId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_group_member_studentid')
CREATE INDEX idx_group_member_studentid ON group_member(studentId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_attendance_instanceid')
CREATE INDEX idx_attendance_instanceid ON attendance(instanceId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_attendance_studentid')
CREATE INDEX idx_attendance_studentid ON attendance(studentId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_feedback_studentid')
CREATE INDEX idx_feedback_studentid ON feedback(studentId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_verification_student_id')
CREATE INDEX idx_verification_student_id ON verification(student_id); 