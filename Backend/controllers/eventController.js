const db = require('../config/db');
const {
  generatedId,
  formatDateAndTime,
} = require('../services/customServices');
const { handleError } = require('../services/errorService');
const { handleResponse } = require('../services/responseService');

exports.addEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, type, courseId } = req.body;

    if (!title || !description || !startDate || !endDate || !location) {
      return handleError(
        res,
        409,
        'Title, description, startDate, endDate, and location are required',
      );
    }

    const id = await generatedId('EVT');
    const query = `
      INSERT INTO events (eventId, title, description, startDate, endDate, location, type, courseId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await db.execute(query, [
      id, title, description, startDate, endDate, location, type || 'general', courseId || null
    ]);

    const [newEvent] = await db.execute(
      'SELECT * FROM events WHERE eventId = ?',
      [id]
    );

    return handleResponse(
      res,
      201,
      'Event added successfully',
      newEvent[0],
    );
  } catch (error) {
    console.error('Error adding event:', error);
    return handleError(res, 500, 'Error adding event', error);
  }
};

exports.getAllEvent = async (req, res) => {
  try {
    const query = `
      SELECT 
        eventId,
        title,
        description,
        startDate,
        endDate,
        location,
        type,
        courseId,
        createdAt
      FROM events
      ORDER BY startDate DESC
    `;
    
    const [events] = await db.execute(query);
    
    if (!events.length) {
      return handleError(res, 404, 'No Events found');
    }

    return handleResponse(
      res,
      200,
      'Events retrieved successfully',
      events,
    );
  } catch (error) {
    console.error('Error retrieving events:', error);
    return handleError(res, 500, 'Error retrieving events', error);
  }
};

exports.eventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [event] = await db.execute(
      'SELECT * FROM events WHERE eventId = ?',
      [id],
    );

    if (!event.length) {
      return handleError(res, 404, 'Event not found');
    }

    return handleResponse(
      res,
      200,
      'Event retrieved successfully',
      event[0],
    );
  } catch (error) {
    console.error('Error retrieving event:', error);
    return handleError(res, 500, 'Error retrieving event', error);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, location, type, courseId } = req.body;
    
    if (!title || !description || !startDate || !endDate || !location) {
      return handleError(
        res,
        409,
        'Title, description, startDate, endDate, and location are required',
      );
    }

    const query = `
      UPDATE events SET 
        title = ?,
        description = ?,
        startDate = ?,
        endDate = ?,
        location = ?,
        type = ?,
        courseId = ?
        WHERE eventId = ?
    `;
    
    const [result] = await db.execute(query, [
      title, description, startDate, endDate, location, type || 'general', courseId || null, id
    ]);

    if (result.affectedRows === 0) {
      return handleError(res, 404, 'Event not found for update');
    }

    const [updatedEvent] = await db.execute(
      'SELECT * FROM events WHERE eventId = ?',
      [id]
    );

    return handleResponse(
      res,
      200,
      'Event updated successfully',
      updatedEvent[0],
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return handleError(res, 500, 'Error updating event', error);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM events WHERE eventId = ?', [id]);
    
    if (result.affectedRows === 0) {
      return handleError(res, 404, 'Event not found');
    }
    
    return handleResponse(res, 200, 'Event deleted successfully');
  } catch (error) {
    console.error('Error deleting event:', error);
    return handleError(res, 500, 'Error deleting event', error);
  }
};
