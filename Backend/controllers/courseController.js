const { handleError } = require('../services/errorService');
const { handleResponse } = require('../services/responseService');
const db = require('../config/db');

exports.addCourse = async (req, res) => {
  try {
    const { courseId, courseName, courseCode, lecturerId, description, credits, semester } = req.body;

    if (!courseId || !courseName || !courseCode || !lecturerId) {
      return handleError(
        res,
        409,
        'Course ID, course name, course code, and lecturer ID are required',
      );
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.execute(
        `INSERT INTO courses (courseId, courseName, courseCode, lecturerId, description, credits, semester, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [courseId, courseName, courseCode, lecturerId, description || null, credits || 3, semester || 'Fall 2024'],
      );

      await connection.commit();

      const [newCourse] = await db.execute(
        'SELECT * FROM courses WHERE courseId = ?',
        [courseId]
      );

      return handleResponse(
        res,
        201,
        'Course added successfully',
        newCourse[0],
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error adding course:', error);
    return handleError(res, 500, 'Error adding course', error);
  }
};

exports.getAllCourse = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT 
        c.courseId,
        c.courseName,
        c.courseCode,
        c.description,
        c.credits,
        c.semester,
        c.createdAt,
        l.name as lecturerName,
        l.email as lecturerEmail
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturerId = l.lecturerId
      ORDER BY c.courseName ASC
    `);

    if (!courses.length) {
      return handleError(res, 404, 'No courses found');
    }

    return handleResponse(
      res,
      200,
      'Courses retrieved successfully',
      courses,
    );
  } catch (error) {
    console.error('Error retrieving courses:', error);
    return handleError(res, 500, 'Error retrieving courses', error);
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [course] = await db.execute(
      `SELECT 
        c.courseId,
        c.courseName,
        c.courseCode,
        c.description,
        c.credits,
        c.semester,
        c.createdAt,
        l.lecturerId,
        l.name AS lecturerName,
        l.email AS lecturerEmail,
        l.phone AS lecturerPhone,
        COUNT(s.studentId) AS totalStudents
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturerId = l.lecturerId
      LEFT JOIN students s ON c.courseId = s.courseId
      WHERE c.courseId = ?
      GROUP BY c.courseId, l.lecturerId`,
      [id],
    );

    if (!course.length) {
      return handleError(res, 404, 'Course not found');
    }

    return handleResponse(
      res,
      200,
      'Course retrieved successfully',
      course[0],
    );
  } catch (error) {
    console.error('Error retrieving course:', error);
    return handleError(res, 500, 'Error retrieving course', error);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, courseCode, lecturerId, description, credits, semester } = req.body;

    const [result] = await db.execute(
      `UPDATE courses
       SET courseName = ?,
           courseCode = ?,
           lecturerId = ?,
           description = ?,
           credits = ?,
           semester = ?
       WHERE courseId = ?`,
      [courseName, courseCode, lecturerId, description || null, credits || 3, semester || 'Fall 2024', id],
    );

    if (result.affectedRows === 0) {
      return handleError(res, 404, 'Course not found for update');
    }

    const [updatedCourse] = await db.execute(
      'SELECT * FROM courses WHERE courseId = ?',
      [id]
    );

    return handleResponse(
      res,
      200,
      'Course updated successfully',
      updatedCourse[0],
    );
  } catch (error) {
    console.error('Error updating course:', error);
    return handleError(res, 500, 'Error updating course', error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(`DELETE FROM courses WHERE courseId = ?`, [id]);

    if (result.affectedRows === 0) {
      return handleError(res, 404, 'Course not found');
    }

    return handleResponse(res, 200, 'Course deleted successfully');
  } catch (error) {
    console.error('Error deleting course:', error);
    return handleError(res, 500, 'Error deleting course', error);
  }
};

exports.registerCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    
    if (!courseId || !studentId) {
      return handleError(
        res,
        409,
        'Course ID and student ID required to register course',
      );
    }

    // Check if student is already registered for this course
    const [existingRegistration] = await db.execute(
      `SELECT * FROM students WHERE studentId = ? AND courseId = ?`,
      [studentId, courseId],
    );

    if (existingRegistration.length > 0) {
      return handleError(res, 409, 'Student already registered for this course');
    }

    // Register student for the course
    await db.execute(
      `UPDATE students SET courseId = ? WHERE studentId = ?`,
      [courseId, studentId],
    );

    return handleResponse(res, 201, 'Course registered successfully');
  } catch (error) {
    console.error('Error registering course:', error);
    return handleError(res, 500, 'Error registering course', error);
  }
};

exports.getCourseByStudentId = async (req, res) => {
  let client;
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return handleError(res, 409, 'Student ID required');
    }
    client = await connect();

    const studentCourse = await client.query(
      `SELECT 
        c.*,
        cs.is_register AS isRegistered,
        l.name AS lecturer_name
        FROM course c
        INNER JOIN course_student cs ON cs.courseid = c.id
        LEFT JOIN lecturer l ON c.lecturerid = c.lecturerid
        WHERE cs.studentId = $1`,
      [studentId],
    );

    if (!studentCourse.rows || studentCourse.rows.length === 0) {
      return handleError(res, 404, 'No courses found for this student');
    }
    if (studentCourse.rows.length > 0) {
      return handleResponse(
        res,
        200,
        'Courses retrieved successfully',
        studentCourse.rows,
      );
    }
  } catch (error) {
    return handleError(res, 500, 'Error retrieving courses for student', error);
  } finally {
    if (client) client.release();
  }
};
