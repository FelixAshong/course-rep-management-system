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
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from '@mui/material';
import { Add, QrCode, Close, Delete, Visibility } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

function Attendance() {
  const [instances, setInstances] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [qrDialog, setQrDialog] = useState(false);
  const [currentQR, setCurrentQR] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    date: '',
    classType: 'physical',
    latitude: '',
    longitude: '',
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [instancesRes, coursesRes] = await Promise.all([
        axios.get('http://localhost:4000/attendance'),
        axios.get('http://localhost:4000/course'),
      ]);
      
      // Handle empty data responses
      if (instancesRes.data.success === false && instancesRes.data.error?.includes('No instance was found')) {
        setInstances([]);
      } else {
        setInstances(instancesRes.data.data || []);
      }
      
      if (coursesRes.data.success === false && coursesRes.data.error?.includes('No courses found')) {
        setCourses([]);
      } else {
        setCourses(coursesRes.data.data || []);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      courseId: '',
      date: '',
      classType: 'physical',
      latitude: '',
      longitude: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/attendance/initialize', formData);
      setCurrentQR(response.data);
      setQrDialog(true);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleCloseAttendance = async (instanceId) => {
    try {
      await axios.post(`http://localhost:4000/attendance/close?instanceId=${instanceId}`);
      fetchData();
    } catch (err) {
      setError('Failed to close attendance');
    }
  };

  const handleDelete = async (instanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance session?')) {
      try {
        await axios.delete(`http://localhost:4000/attendance/instance/${instanceId}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete attendance session');
      }
    }
  };

  const handleViewQR = (qrToken) => {
    setSelectedQRCode(qrToken);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedQRCode('');
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
        <Typography variant="h4">Attendance Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Initialize Attendance
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
              <TableCell>Instance ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Class Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>{instance.id}</TableCell>
                <TableCell>
                  {courses.find(c => c.id === instance.course_id)?.name || 'N/A'}
                </TableCell>
                <TableCell>{instance.date}</TableCell>
                <TableCell>{instance.class_type || 'N/A'}</TableCell>
                <TableCell>
                  {instance.is_close ? 'Closed' : 'Active'}
                </TableCell>
                <TableCell>
                  {!instance.is_close && (
                    <IconButton onClick={() => handleCloseAttendance(instance.id)}>
                      <Close />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(instance.id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleViewQR(instance.qr_token || `ATT-${instance.id}`)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Initialize Attendance Session</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Course</InputLabel>
              <Select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                label="Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.classType === 'online'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    classType: e.target.checked ? 'online' : 'physical' 
                  })}
                />
              }
              label="Online Class"
            />
            {formData.classType === 'physical' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Latitude"
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Initialize
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={qrDialog} onClose={() => setQrDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attendance QR Code</DialogTitle>
        <DialogContent>
          {currentQR && (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" gutterBottom>
                {currentQR.classType === 'physical' ? 'Physical Class' : 'Online Class'}
              </Typography>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  {currentQR.qrCode && (
                    <QRCodeSVG value={currentQR.qrCode} size={256} />
                  )}
                </CardContent>
              </Card>
              <Typography variant="body2" color="text.secondary">
                Students can scan this QR code to mark their attendance
              </Typography>
              {currentQR.data?.id && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Code: {currentQR.data.id}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onClose={closeQRModal} maxWidth="sm" fullWidth>
        <DialogTitle>Attendance QR Code</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Attendance QR Code
            </Typography>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <QRCodeSVG value={selectedQRCode} size={256} />
              </CardContent>
            </Card>
            <Typography variant="body2" color="text.secondary">
              Code: {selectedQRCode}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQRModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Attendance; 