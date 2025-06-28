import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Lecturers from './pages/Lecturers';
import Groups from './pages/Groups';
import Assignments from './pages/Assignments';
import Events from './pages/Events';
import Attendance from './pages/Attendance';
import Feedback from './pages/Feedback';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="courses" element={<Courses />} />
              <Route path="lecturers" element={<Lecturers />} />
              <Route path="groups" element={<Groups />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="events" element={<Events />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
