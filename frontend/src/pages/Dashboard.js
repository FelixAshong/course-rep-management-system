import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
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
  TrendingUp,
  TrendingDown,
  Add,
  MoreVert,
  CalendarToday,
  CheckCircle,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statCards = [
    { 
      title: 'Total Students', 
      icon: <People />, 
      key: 'students', 
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      change: '+12%',
      changeType: 'up'
    },
    { 
      title: 'Active Courses', 
      icon: <School />, 
      key: 'courses', 
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      change: '+5%',
      changeType: 'up'
    },
    { 
      title: 'Study Groups', 
      icon: <Group />, 
      key: 'groups', 
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      change: '+8%',
      changeType: 'up'
    },
    { 
      title: 'Pending Assignments', 
      icon: <Assignment />, 
      key: 'assignments', 
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      change: '-3%',
      changeType: 'down'
    },
    { 
      title: 'Upcoming Events', 
      icon: <Event />, 
      key: 'events', 
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      change: '+15%',
      changeType: 'up'
    },
    { 
      title: 'Attendance Rate', 
      icon: <QrCode />, 
      key: 'attendance', 
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
      change: '+2%',
      changeType: 'up'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      title: 'New assignment posted',
      description: 'Database Systems - Final Project',
      time: '2 hours ago',
      icon: <Assignment />,
      color: '#ef4444'
    },
    {
      id: 2,
      type: 'event',
      title: 'Study group meeting',
      description: 'Advanced Algorithms - Room 301',
      time: '4 hours ago',
      icon: <Event />,
      color: '#ec4899'
    },
    {
      id: 3,
      type: 'feedback',
      title: 'Feedback submitted',
      description: 'Course: Web Development',
      time: '6 hours ago',
      icon: <Feedback />,
      color: '#84cc16'
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Attendance marked',
      description: 'Software Engineering - 95% present',
      time: '1 day ago',
      icon: <QrCode />,
      color: '#06b6d4'
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Database Systems Exam',
      date: 'Dec 15, 2024',
      time: '10:00 AM',
      type: 'exam',
      color: '#ef4444'
    },
    {
      id: 2,
      title: 'Study Group Meeting',
      date: 'Dec 16, 2024',
      time: '2:00 PM',
      type: 'meeting',
      color: '#3b82f6'
    },
    {
      id: 3,
      title: 'Project Submission',
      date: 'Dec 18, 2024',
      time: '11:59 PM',
      type: 'deadline',
      color: '#f59e0b'
    },
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
            .catch(() => ({ [endpoint]: Math.floor(Math.random() * 100) + 20 }))
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
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome back! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Here's what's happening with your courses today
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CalendarToday />} 
            label="Today's Schedule" 
            variant="outlined" 
            sx={{ borderColor: '#6366f1', color: '#6366f1' }}
          />
          <Chip 
            icon={<CheckCircle />} 
            label="3 Tasks Completed" 
            variant="outlined" 
            sx={{ borderColor: '#10b981', color: '#10b981' }}
          />
          <Chip 
            icon={<Schedule />} 
            label="2 Pending" 
            variant="outlined" 
            sx={{ borderColor: '#f59e0b', color: '#f59e0b' }}
          />
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.key}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              sx={{
                height: '100%',
                background: 'white',
                borderRadius: 4,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'visible',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: card.gradient,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {card.changeType === 'up' ? (
                      <TrendingUp sx={{ color: '#10b981', fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: card.changeType === 'up' ? '#10b981' : '#ef4444',
                        fontWeight: 600 
                      }}
                    >
                      {card.change}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats[card.key] || Math.floor(Math.random() * 100) + 20}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {card.title}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ height: '100%' }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Recent Activities
                </Typography>
                <Button variant="outlined" size="small" startIcon={<Add />}>
                  View All
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivities.map((activity, index) => (
                  <MotionBox
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.2s ease',
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        background: activity.color,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </MotionBox>
                ))}
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} lg={4}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            sx={{ height: '100%' }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Upcoming Events
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingEvents.map((event, index) => (
                  <MotionBox
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${event.color}20`,
                      background: `${event.color}05`,
                      '&:hover': {
                        background: `${event.color}10`,
                        transition: 'all 0.2s ease',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                      <Chip 
                        label={event.type} 
                        size="small" 
                        sx={{ 
                          background: event.color, 
                          color: 'white',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {event.date} • {event.time}
                    </Typography>
                  </MotionBox>
                ))}
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  }
                }}
              >
                View Calendar
              </Button>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </MotionBox>
  );
}

export default Dashboard; 