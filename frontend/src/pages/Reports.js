import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  People,
  Assignment,
  Event,
  School,
  Download,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Reports() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchAttendanceReport();
    } else if (activeTab === 1) {
      fetchAssignmentReport();
    } else if (activeTab === 2) {
      fetchCourseStats();
    }
  }, [activeTab, selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/course');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:4000/report/dashboard');
      setDashboardStats(response.data.data || {});
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchAttendanceReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCourse) params.courseId = selectedCourse;
      
      const response = await axios.get('http://localhost:4000/report/attendance', { params });
      setAttendanceData(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch attendance report');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCourse) params.courseId = selectedCourse;
      
      const response = await axios.get('http://localhost:4000/report/assignments', { params });
      setAssignmentData(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch assignment report');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/report/courses');
      setCourseStats(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch course statistics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const exportReport = (type) => {
    // Implementation for exporting reports
    console.log(`Exporting ${type} report`);
  };

  const attendanceChartData = attendanceData.map(student => ({
    name: student.name,
    attendance: parseFloat(student.attendancePercentage) || 0,
    present: student.presentSessions,
    total: student.totalSessions,
  }));

  const assignmentChartData = assignmentData.map(assignment => ({
    name: assignment.title,
    submissions: assignment.totalSubmissions || 0,
    avgGrade: parseFloat(assignment.averageGrade) || 0,
  }));

  const courseChartData = courseStats.map(course => ({
    name: course.courseName,
    students: course.totalStudents || 0,
    assignments: course.totalAssignments || 0,
    events: course.totalEvents || 0,
  }));

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 3 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Comprehensive insights and analytics for your academic management
        </Typography>
      </Box>

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardStats.studentCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardStats.courseCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Courses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardStats.assignmentCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Assignments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            sx={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardStats.eventCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Filter by Course"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <MenuItem value="">All Courses</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.courseId} value={course.courseId}>
                {course.courseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => exportReport(activeTab === 0 ? 'attendance' : activeTab === 1 ? 'assignments' : 'courses')}
        >
          Export Report
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Attendance Report" />
          <Tab label="Assignment Performance" />
          <Tab label="Course Statistics" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Attendance Report Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <MotionCard
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Attendance Percentage by Student
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={attendanceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <MotionCard
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Attendance Summary
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Attendance %</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {attendanceData.slice(0, 5).map((student) => (
                            <TableRow key={student.studentId}>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${student.attendancePercentage}%`}
                                  color={parseFloat(student.attendancePercentage) >= 80 ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>
          )}

          {/* Assignment Performance Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <MotionCard
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Assignment Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={assignmentChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgGrade" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="submissions" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <MotionCard
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Assignment Details
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Assignment</TableCell>
                            <TableCell>Avg Grade</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {assignmentData.slice(0, 5).map((assignment) => (
                            <TableRow key={assignment.assignmentId}>
                              <TableCell>{assignment.title}</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${assignment.averageGrade || 0}%`}
                                  color={parseFloat(assignment.averageGrade) >= 70 ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>
          )}

          {/* Course Statistics Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <MotionCard
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Course Statistics
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={courseChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill="#6366f1" />
                        <Bar dataKey="assignments" fill="#10b981" />
                        <Bar dataKey="events" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <MotionCard
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Course Overview
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Course</TableCell>
                            <TableCell>Students</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {courseStats.slice(0, 5).map((course) => (
                            <TableRow key={course.courseId}>
                              <TableCell>{course.courseName}</TableCell>
                              <TableCell>
                                <Chip
                                  label={course.totalStudents || 0}
                                  color="primary"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </MotionBox>
  );
}

export default Reports; 