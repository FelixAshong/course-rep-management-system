-- PostgreSQL Database Schema
-- Course Representative Management System Database Schema

-- Student table
CREATE TABLE IF NOT EXISTS student (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    isRep BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lecturer table
CREATE TABLE IF NOT EXISTS lecturer (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course table
CREATE TABLE IF NOT EXISTS course (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lecturerId VARCHAR(50) REFERENCES lecturer(id),
    day VARCHAR(20),
    start_time TIME,
    end_time TIME,
    semester VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course-Student relationship table
CREATE TABLE IF NOT EXISTS course_student (
    id SERIAL PRIMARY KEY,
    courseId VARCHAR(50) REFERENCES course(id) ON DELETE CASCADE,
    studentId VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    is_register BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(courseId, studentId)
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    courseId VARCHAR(50) REFERENCES course(id) ON DELETE SET NULL,
    isGeneral BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_member (
    id SERIAL PRIMARY KEY,
    groupId VARCHAR(50) REFERENCES groups(id) ON DELETE CASCADE,
    studentId VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    isLeader BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(groupId, studentId)
);

-- Assignment table
CREATE TABLE IF NOT EXISTS assignment (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    courseId VARCHAR(50) REFERENCES course(id) ON DELETE CASCADE,
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event table
CREATE TABLE IF NOT EXISTS event (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    time TIME,
    venue VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification table
CREATE TABLE IF NOT EXISTS notification (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(50) PRIMARY KEY,
    studentId VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance instance table
CREATE TABLE IF NOT EXISTS attendance_instance (
    id VARCHAR(50) PRIMARY KEY,
    courseId VARCHAR(50) REFERENCES course(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    qr_token TEXT,
    expires_at TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    class_type VARCHAR(20) DEFAULT 'physical',
    is_close BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(50) PRIMARY KEY,
    instanceId VARCHAR(50) REFERENCES attendance_instance(id) ON DELETE CASCADE,
    courseId VARCHAR(50) REFERENCES course(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    studentId VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(instanceId, studentId)
);

-- Verification table for password reset
CREATE TABLE IF NOT EXISTS verification (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    reset_token TEXT,
    reset_token_expiration TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id)
);

-- Security logs table for attendance tracking
CREATE TABLE IF NOT EXISTS security_logs (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    instance_id VARCHAR(50) REFERENCES attendance_instance(id) ON DELETE CASCADE,
    event_type VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance logs table
CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES student(id) ON DELETE CASCADE,
    instance_id VARCHAR(50) REFERENCES attendance_instance(id) ON DELETE CASCADE,
    location_checked BOOLEAN DEFAULT FALSE,
    location_valid BOOLEAN DEFAULT FALSE,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_student_courseid ON course_student(courseId);
CREATE INDEX IF NOT EXISTS idx_course_student_studentid ON course_student(studentId);
CREATE INDEX IF NOT EXISTS idx_group_member_groupid ON group_member(groupId);
CREATE INDEX IF NOT EXISTS idx_group_member_studentid ON group_member(studentId);
CREATE INDEX IF NOT EXISTS idx_attendance_instanceid ON attendance(instanceId);
CREATE INDEX IF NOT EXISTS idx_attendance_studentid ON attendance(studentId);
CREATE INDEX IF NOT EXISTS idx_feedback_studentid ON feedback(studentId);
CREATE INDEX IF NOT EXISTS idx_verification_student_id ON verification(student_id); 