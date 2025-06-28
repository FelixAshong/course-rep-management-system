const db = require('../config/db');
const bcrypt = require('bcrypt');
const { handleError } = require('../services/errorService');
const { handleResponse } = require('../services/responseService');
const { sendRegistrationSuccessMail } = require('../services/customEmails');

exports.registerStudent = async (req, res) => {
  try {
    const { studentId, name, email, phone, password, courseId } = req.body;
    
    if (!studentId || !name || !email || !phone || !password) {
      return handleError(
        res,
        409,
        'Student ID, name, email, phone, and password are required',
      );
    }

    // Check for existing student with same id
    const [existingStudent] = await db.execute(
      `SELECT * FROM students WHERE studentId = ?`,
      [studentId],
    );

    if (existingStudent.length > 0) {
      return handleError(res, 409, 'Student already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO students (studentId, name, email, phone, password, courseId, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [studentId, name, email, phone, hashedPassword, courseId || null],
    );

    const [newStudent] = await db.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    // Remove password from response
    delete newStudent[0].password;
    
    // Send registration mail
    sendRegistrationSuccessMail(
      newStudent[0].name,
      newStudent[0].email,
      newStudent[0].studentId,
    );
    
    return handleResponse(
      res,
      201,
      'Student registered successfully',
      newStudent[0],
    );
  } catch (error) {
    console.error('Error registering student:', error);
    return handleError(res, 500, 'Error registering student', error);
  }
};

exports.getAllStudent = async (req, res) => {
  try {
    const [students] = await db.execute(
      `SELECT studentId, name, email, phone, courseId, status, createdAt FROM students ORDER BY name ASC`,
    );

    if (!students.length) {
      return handleError(res, 409, 'No students found');
    }

    return handleResponse(
      res,
      200,
      'Students retrieved successfully',
      students,
    );
  } catch (error) {
    console.error('Error retrieving students:', error);
    return handleError(res, 500, 'Error retrieving students', error);
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [student] = await db.execute(
      `SELECT 
        s.studentId,
        s.name,
        s.email,
        s.phone,
        s.courseId,
        s.status,
        s.createdAt,
        c.courseName,
        c.courseCode
      FROM students s
      LEFT JOIN courses c ON s.courseId = c.courseId
      WHERE s.studentId = ?`,
      [id],
    );
    
    if (!student.length) {
      return handleError(res, 404, 'Student not found');
    }

    // Get student groups
    const [groups] = await db.execute(
      `SELECT 
        g.groupId,
        g.groupName,
        gm.isLeader
      FROM groupMembers gm
      LEFT JOIN groups g ON gm.groupId = g.groupId
      WHERE gm.studentId = ?`,
      [id]
    );

    const studentData = {
      ...student[0],
      groups: groups
    };

    return handleResponse(
      res,
      200,
      'Student retrieved successfully',
      studentData,
    );
  } catch (error) {
    console.error('Error retrieving student:', error);
    return handleError(res, 500, 'Error retrieving student', error);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, courseId, status } = req.body;

    const [result] = await db.execute(
      `UPDATE students SET
        name = ?,
        email = ?,
        phone = ?,
        courseId = ?,
        status = ?
        WHERE studentId = ?`,
      [name, email, phone, courseId || null, status || 'active', id],
    );

    if (result.affectedRows === 0) {
      return handleError(res, 404, 'Student not found for update');
    }

    const [updatedStudent] = await db.execute(
      'SELECT studentId, name, email, phone, courseId, status, createdAt FROM students WHERE studentId = ?',
      [id]
    );

    return handleResponse(
      res,
      200,
      'Student updated successfully',
      updatedStudent[0],
    );
  } catch (error) {
    console.error('Error updating student:', error);
    return handleError(res, 500, 'Error updating student', error);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(`DELETE FROM students WHERE studentId = ?`, [id]);

    if (result.affectedRows === 0) {
      return handleError(res, 404, 'Student not found');
    }

    return handleResponse(res, 200, 'Student deleted successfully');
  } catch (error) {
    console.error('Error deleting student:', error);
    return handleError(res, 500, 'Error deleting student', error);
  }
};
