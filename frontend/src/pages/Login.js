import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  School,
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  TrendingUp,
  People,
  Assignment,
  Event,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

function Login() {
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.studentId, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const features = [
    {
      icon: <People />,
      title: 'Student Management',
      description: 'Efficiently manage student records and information'
    },
    {
      icon: <Assignment />,
      title: 'Assignment Tracking',
      description: 'Track assignments, submissions, and grades'
    },
    {
      icon: <Event />,
      title: 'Event Coordination',
      description: 'Organize and manage academic events'
    },
    {
      icon: <TrendingUp />,
      title: 'Performance Analytics',
      description: 'Monitor attendance and academic progress'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Left Side - Features */}
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />

        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}
        >
          <School sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Course Rep
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 300, opacity: 0.9 }}>
            Management System
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.8, maxWidth: 400 }}>
            Streamline your academic management with our comprehensive platform
          </Typography>
        </MotionBox>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, maxWidth: 600 }}>
          {features.map((feature, index) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box sx={{ mb: 1 }}>
                {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {feature.description}
              </Typography>
            </MotionBox>
          ))}
        </Box>
      </MotionBox>

      {/* Right Side - Login Form */}
      <MotionBox
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          background: 'white',
        }}
      >
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ mb: 3 }}
            >
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </MotionBox>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="studentId"
              label="Student ID"
              name="studentId"
              autoComplete="username"
              autoFocus
              value={formData.studentId}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  opacity: 0.6,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Demo Credentials: student1 / password123
            </Typography>
          </Box>
        </MotionPaper>
      </MotionBox>
    </Box>
  );
}

export default Login; 