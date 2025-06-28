import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    lecturerId: '',
    day: '',
    startTime: '',
    endTime: '',
    semester: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, lecturersRes] = await Promise.all([
        axios.get('http://localhost:4000/course'),
        axios.get('http://localhost:4000/lecturer'),
      ]);
      setCourses(coursesRes.data.data || []);
      setLecturers(lecturersRes.data.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        id: course.id,
        name: course.name,
        lecturerId: course.lecturerid,
        day: course.day,
        startTime: course.start_time,
        endTime: course.end_time,
        semester: course.semester,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        id: '',
        name: '',
        lecturerId: '',
        day: '',
        startTime: '',
        endTime: '',
        semester: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`http://localhost:4000/course/${editingCourse.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/course', formData);
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:4000/course/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Courses</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Lecturer</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>
                  {lecturers.find(l => l.id === course.lecturerid)?.name || 'N/A'}
                </TableCell>
                <TableCell>{course.day}</TableCell>
                <TableCell>{course.start_time} - {course.end_time}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(course)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course ID"
              name="id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              disabled={!!editingCourse}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Lecturer</InputLabel>
              <Select
                value={formData.lecturerId}
                onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
                label="Lecturer"
              >
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Day"
              name="day"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Start Time"
              name="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="End Time"
              name="endTime"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCourse ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Courses; 