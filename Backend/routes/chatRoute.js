const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT DISTINCT
        c.conversationId,
        c.title,
        c.type,
        c.createdAt,
        m.content as lastMessage,
        m.createdAt as lastMessageTime,
        m.senderId as lastSenderId,
        u.name as lastSenderName
      FROM conversations c
      LEFT JOIN conversationParticipants cp ON c.conversationId = cp.conversationId
      LEFT JOIN messages m ON c.conversationId = m.conversationId
      LEFT JOIN users u ON m.senderId = u.userId
      WHERE cp.userId = ?
      AND m.messageId = (
        SELECT MAX(messageId) 
        FROM messages 
        WHERE conversationId = c.conversationId
      )
      ORDER BY m.createdAt DESC
    `;
    
    const [results] = await db.execute(query, [userId]);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// Get messages for a conversation
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const query = `
      SELECT 
        m.messageId,
        m.content,
        m.senderId,
        m.createdAt,
        u.name as senderName,
        u.email as senderEmail
      FROM messages m
      LEFT JOIN users u ON m.senderId = u.userId
      WHERE m.conversationId = ?
      ORDER BY m.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    
    const [results] = await db.execute(query, [conversationId, parseInt(limit), parseInt(offset)]);
    
    res.json({
      success: true,
      data: results.reverse()
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    
    if (!conversationId || !senderId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const query = `
      INSERT INTO messages (conversationId, senderId, content, createdAt)
      VALUES (?, ?, ?, NOW())
    `;
    
    const [result] = await db.execute(query, [conversationId, senderId, content]);
    
    // Get the created message
    const [message] = await db.execute(`
      SELECT 
        m.messageId,
        m.content,
        m.senderId,
        m.createdAt,
        u.name as senderName,
        u.email as senderEmail
      FROM messages m
      LEFT JOIN users u ON m.senderId = u.userId
      WHERE m.messageId = ?
    `, [result.insertId]);
    
    res.json({
      success: true,
      data: message[0]
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// Create a new conversation
router.post('/conversations', async (req, res) => {
  try {
    const { title, type, participants } = req.body;
    
    if (!title || !type || !participants || participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Create conversation
    const [conversationResult] = await db.execute(`
      INSERT INTO conversations (title, type, createdAt)
      VALUES (?, ?, NOW())
    `, [title, type]);
    
    const conversationId = conversationResult.insertId;
    
    // Add participants
    for (const participantId of participants) {
      await db.execute(`
        INSERT INTO conversationParticipants (conversationId, userId, joinedAt)
        VALUES (?, ?, NOW())
      `, [conversationId, participantId]);
    }
    
    res.json({
      success: true,
      data: { conversationId, title, type }
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message
    });
  }
});

// Get course group chat
router.get('/course-chat/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get or create course group chat
    let [conversation] = await db.execute(`
      SELECT conversationId FROM conversations 
      WHERE type = 'course' AND title LIKE ?
    `, [`Course ${courseId}%`]);
    
    if (conversation.length === 0) {
      // Create new course chat
      const [course] = await db.execute('SELECT courseName FROM courses WHERE courseId = ?', [courseId]);
      const courseName = course[0]?.courseName || `Course ${courseId}`;
      
      const [result] = await db.execute(`
        INSERT INTO conversations (title, type, createdAt)
        VALUES (?, 'course', NOW())
      `, [courseName]);
      
      conversation = [{ conversationId: result.insertId }];
    }
    
    res.json({
      success: true,
      data: { conversationId: conversation[0].conversationId }
    });
  } catch (error) {
    console.error('Error getting course chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting course chat',
      error: error.message
    });
  }
});

module.exports = router; 