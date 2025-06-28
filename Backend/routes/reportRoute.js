const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get attendance reports
router.get('/attendance', async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    let query = `
      SELECT 
        s.studentId,
        s.name,
        s.email,
        COUNT(ai.attendanceInstanceId) as totalSessions,
        SUM(CASE WHEN ai.status = 'present' THEN 1 ELSE 0 END) as presentSessions,
        ROUND((SUM(CASE WHEN ai.status = 'present' THEN 1 ELSE 0 END) / COUNT(ai.attendanceInstanceId)) * 100, 2) as attendancePercentage
      FROM students s
      LEFT JOIN attendanceInstances ai ON s.studentId = ai.studentId
      LEFT JOIN courses c ON ai.courseId = c.courseId
    `;
    
    const conditions = [];
    const params = [];
    
    if (courseId) {
      conditions.push('c.courseId = ?');
      params.push(courseId);
    }
    if (startDate) {
      conditions.push('ai.date >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('ai.date <= ?');
      params.push(endDate);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY s.studentId, s.name, s.email ORDER BY attendancePercentage DESC';
    
    const [results] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance report',
      error: error.message
    });
  }
});

// Get assignment performance report
router.get('/assignments', async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = `
      SELECT 
        a.assignmentId,
        a.title,
        a.description,
        a.dueDate,
        COUNT(sa.submissionId) as totalSubmissions,
        AVG(sa.grade) as averageGrade,
        MIN(sa.grade) as lowestGrade,
        MAX(sa.grade) as highestGrade
      FROM assignments a
      LEFT JOIN submissionAssignments sa ON a.assignmentId = sa.assignmentId
    `;
    
    const params = [];
    if (courseId) {
      query += ' WHERE a.courseId = ?';
      params.push(courseId);
    }
    
    query += ' GROUP BY a.assignmentId, a.title, a.description, a.dueDate';
    
    const [results] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching assignment report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment report',
      error: error.message
    });
  }
});

// Get course statistics
router.get('/courses', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.courseId,
        c.courseName,
        c.courseCode,
        COUNT(DISTINCT s.studentId) as totalStudents,
        COUNT(DISTINCT a.assignmentId) as totalAssignments,
        COUNT(DISTINCT e.eventId) as totalEvents,
        AVG(ai.attendancePercentage) as avgAttendance
      FROM courses c
      LEFT JOIN students s ON c.courseId = s.courseId
      LEFT JOIN assignments a ON c.courseId = a.courseId
      LEFT JOIN events e ON c.courseId = e.courseId
      LEFT JOIN (
        SELECT 
          courseId,
          AVG(CASE WHEN status = 'present' THEN 100 ELSE 0 END) as attendancePercentage
        FROM attendanceInstances
        GROUP BY courseId
      ) ai ON c.courseId = ai.courseId
      GROUP BY c.courseId, c.courseName, c.courseCode
    `;
    
    const [results] = await db.execute(query);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching course statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course statistics',
      error: error.message
    });
  }
});

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const [studentCount] = await db.execute('SELECT COUNT(*) as count FROM students');
    const [courseCount] = await db.execute('SELECT COUNT(*) as count FROM courses');
    const [assignmentCount] = await db.execute('SELECT COUNT(*) as count FROM assignments');
    const [eventCount] = await db.execute('SELECT COUNT(*) as count FROM events');
    const [recentActivities] = await db.execute(`
      SELECT 
        'assignment' as type,
        a.title as title,
        a.createdAt as date
      FROM assignments a
      UNION ALL
      SELECT 
        'event' as type,
        e.title as title,
        e.createdAt as date
      FROM events e
      ORDER BY date DESC
      LIMIT 10
    `);
    
    res.json({
      success: true,
      data: {
        studentCount: studentCount[0].count,
        courseCount: courseCount[0].count,
        assignmentCount: assignmentCount[0].count,
        eventCount: eventCount[0].count,
        recentActivities: recentActivities
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
});

module.exports = router; 