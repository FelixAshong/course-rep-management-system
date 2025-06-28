const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get calendar events for a specific month
router.get('/events', async (req, res) => {
  try {
    const { year, month, courseId } = req.query;
    
    let query = `
      SELECT 
        e.eventId,
        e.title,
        e.description,
        e.startDate,
        e.endDate,
        e.location,
        e.type,
        c.courseName,
        c.courseCode
      FROM events e
      LEFT JOIN courses c ON e.courseId = c.courseId
      WHERE YEAR(e.startDate) = ? AND MONTH(e.startDate) = ?
    `;
    
    const params = [year, month];
    
    if (courseId) {
      query += ' AND e.courseId = ?';
      params.push(courseId);
    }
    
    query += ' ORDER BY e.startDate ASC';
    
    const [results] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching calendar events',
      error: error.message
    });
  }
});

// Get upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const query = `
      SELECT 
        e.eventId,
        e.title,
        e.description,
        e.startDate,
        e.endDate,
        e.location,
        e.type,
        c.courseName,
        c.courseCode
      FROM events e
      LEFT JOIN courses c ON e.courseId = c.courseId
      WHERE e.startDate >= CURDATE()
      ORDER BY e.startDate ASC
      LIMIT ?
    `;
    
    const [results] = await db.execute(query, [parseInt(limit)]);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
});

// Get student schedule
router.get('/schedule/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { weekStart } = req.query;
    
    let dateFilter = '';
    const params = [studentId];
    
    if (weekStart) {
      dateFilter = 'AND e.startDate >= ? AND e.startDate < DATE_ADD(?, INTERVAL 7 DAY)';
      params.push(weekStart, weekStart);
    }
    
    const query = `
      SELECT 
        e.eventId,
        e.title,
        e.description,
        e.startDate,
        e.endDate,
        e.location,
        e.type,
        c.courseName,
        c.courseCode,
        DAYOFWEEK(e.startDate) as dayOfWeek,
        TIME(e.startDate) as time
      FROM events e
      LEFT JOIN courses c ON e.courseId = c.courseId
      LEFT JOIN students s ON c.courseId = s.courseId
      WHERE s.studentId = ? ${dateFilter}
      ORDER BY e.startDate ASC
    `;
    
    const [results] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student schedule',
      error: error.message
    });
  }
});

// Get assignment deadlines
router.get('/deadlines', async (req, res) => {
  try {
    const { courseId, studentId } = req.query;
    
    let query = `
      SELECT 
        a.assignmentId,
        a.title,
        a.description,
        a.dueDate,
        a.points,
        c.courseName,
        c.courseCode,
        CASE WHEN sa.submissionId IS NOT NULL THEN 'submitted' ELSE 'pending' END as status
      FROM assignments a
      LEFT JOIN courses c ON a.courseId = c.courseId
      LEFT JOIN students s ON c.courseId = s.courseId
      LEFT JOIN submissionAssignments sa ON a.assignmentId = sa.assignmentId AND sa.studentId = s.studentId
      WHERE a.dueDate >= CURDATE()
    `;
    
    const params = [];
    
    if (courseId) {
      query += ' AND a.courseId = ?';
      params.push(courseId);
    }
    
    if (studentId) {
      query += ' AND s.studentId = ?';
      params.push(studentId);
    }
    
    query += ' ORDER BY a.dueDate ASC';
    
    const [results] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment deadlines',
      error: error.message
    });
  }
});

module.exports = router; 