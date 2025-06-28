import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  School,
  Group,
  Assignment,
  Event,
  QrCode,
  Feedback,
  Notifications,
} from '@mui/icons-material';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statCards = [
    { title: 'Students', icon: <People />, key: 'students', color: '#1976d2' },
    { title: 'Courses', icon: <School />, key: 'courses', color: '#388e3c' },
    { title: 'Lecturers', icon: <School />, key: 'lecturers', color: '#f57c00' },
    { title: 'Groups', icon: <Group />, key: 'groups', color: '#7b1fa2' },
    { title: 'Assignments', icon: <Assignment />, key: 'assignments', color: '#d32f2f' },
    { title: 'Events', icon: <Event />, key: 'events', color: '#1976d2' },
    { title: 'Attendance Sessions', icon: <QrCode />, key: 'attendance', color: '#388e3c' },
    { title: 'Feedback', icon: <Feedback />, key: 'feedback', color: '#f57c00' },
    { title: 'Notifications', icon: <Notifications />, key: 'notifications', color: '#7b1fa2' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = [
          'student',
          'course',
          'lecturer',
          'group',
          'assignment',
          'event',
          'attendance',
          'feedback',
          'notification',
        ];

        const promises = endpoints.map(endpoint =>
          axios.get(`http://localhost:4000/${endpoint}`)
            .then(response => ({ [endpoint]: response.data.data?.length || 0 }))
            .catch(() => ({ [endpoint]: 0 }))
        );

        const results = await Promise.all(promises);
        const statsData = results.reduce((acc, result) => ({ ...acc, ...result }), {});
        
        setStats(statsData);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the Course Representative Management System
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.key}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {stats[card.key] || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the navigation menu on the left to access different sections of the system.
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard; 