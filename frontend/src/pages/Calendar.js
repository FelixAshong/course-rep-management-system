import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  Event,
  Add,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  Assignment,
  School,
  Today,
  NextWeek,
  DateRange,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const eventTypes = [
  { value: 'lecture', label: 'Lecture', color: '#6366f1' },
  { value: 'exam', label: 'Exam', color: '#ef4444' },
  { value: 'assignment', label: 'Assignment Due', color: '#f59e0b' },
  { value: 'meeting', label: 'Meeting', color: '#10b981' },
  { value: 'workshop', label: 'Workshop', color: '#8b5cf6' },
  { value: 'other', label: 'Other', color: '#64748b' },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'lecture',
    courseId: '',
  });

  useEffect(() => {
    fetchEvents();
    fetchCourses();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await axios.get(`http://localhost:4000/calendar/events`, {
        params: { year, month }
      });
      setEvents(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch events');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/course');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      type: 'lecture',
      courseId: '',
    });
    setOpenDialog(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      location: event.location,
      type: event.type,
      courseId: event.courseId,
    });
    setOpenDialog(true);
  };

  const handleSaveEvent = async () => {
    try {
      if (selectedEvent) {
        await axios.put(`http://localhost:4000/event/${selectedEvent.eventId}`, formData);
      } else {
        await axios.post('http://localhost:4000/event', formData);
      }
      setOpenDialog(false);
      fetchEvents();
    } catch (error) {
      setError('Failed to save event');
      console.error('Error:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:4000/event/${eventId}`);
        fetchEvents();
      } catch (error) {
        setError('Failed to delete event');
        console.error('Error:', error);
      }
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeColor = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.color : '#64748b';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 3 }}
    >
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
            Calendar & Schedule
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage your academic schedule and events
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddEvent}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)',
            },
          }}
        >
          Add Event
        </Button>
      </Box>

      {/* Calendar Navigation */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        sx={{ mb: 3 }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigateMonth(-1)}>
              <DateRange />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => navigateMonth(1)}>
              <DateRange />
            </IconButton>
          </Box>

          {/* Event Type Legend */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {eventTypes.map((type) => (
              <Chip
                key={type.value}
                label={type.label}
                size="small"
                sx={{
                  backgroundColor: type.color,
                  color: 'white',
                  '& .MuiChip-label': { color: 'white' },
                }}
              />
            ))}
          </Box>
        </CardContent>
      </MotionCard>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Calendar Grid */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardContent>
          {/* Days of Week Header */}
          <Grid container sx={{ mb: 1 }}>
            {daysOfWeek.map((day) => (
              <Grid item xs key={day}>
                <Box
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#64748b',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  {day.slice(0, 3)}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container>
            {days.map((day, index) => (
              <Grid item xs key={index}>
                <Box
                  sx={{
                    minHeight: 120,
                    p: 1,
                    border: '1px solid #e2e8f0',
                    backgroundColor: day ? 'white' : '#f8fafc',
                    position: 'relative',
                  }}
                >
                  {day && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: day.toDateString() === new Date().toDateString() ? '#6366f1' : '#64748b',
                          mb: 1,
                        }}
                      >
                        {day.getDate()}
                      </Typography>
                      
                      {/* Events for this day */}
                      {getEventsForDate(day).map((event, eventIndex) => (
                        <Box
                          key={eventIndex}
                          sx={{
                            backgroundColor: getEventTypeColor(event.type),
                            color: 'white',
                            p: 0.5,
                            mb: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => handleEditEvent(event)}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {event.title}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Upcoming Events */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        sx={{ mt: 3 }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Upcoming Events
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {events
                .filter(event => new Date(event.startDate) >= new Date())
                .slice(0, 5)
                .map((event, index) => (
                  <React.Fragment key={event.eventId}>
                    <ListItem
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: '#f8fafc',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Event sx={{ color: getEventTypeColor(event.type) }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.startDate).toLocaleDateString()} - {event.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditEvent(event)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteEvent(event.eventId)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
            </List>
          )}
        </CardContent>
      </MotionCard>

      {/* Add/Edit Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Edit Event' : 'Add New Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Event Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={formData.courseId}
                    label="Course"
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    <MenuItem value="">No Course</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course.courseId} value={course.courseId}>
                        {course.courseName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            {selectedEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
}

export default Calendar; 