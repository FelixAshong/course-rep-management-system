import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  Group,
  Assignment,
  Event,
  QrCode,
  Feedback,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
  NotificationsActive,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <Dashboard />, 
    path: '/',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
  },
  { 
    text: 'Students', 
    icon: <People />, 
    path: '/students',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
  },
  { 
    text: 'Courses', 
    icon: <School />, 
    path: '/courses',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
  },
  { 
    text: 'Lecturers', 
    icon: <School />, 
    path: '/lecturers',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
  },
  { 
    text: 'Groups', 
    icon: <Group />, 
    path: '/groups',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
  },
  { 
    text: 'Assignments', 
    icon: <Assignment />, 
    path: '/assignments',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
  },
  { 
    text: 'Events', 
    icon: <Event />, 
    path: '/events',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
  },
  { 
    text: 'Attendance', 
    icon: <QrCode />, 
    path: '/attendance',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)'
  },
  { 
    text: 'Feedback', 
    icon: <Feedback />, 
    path: '/feedback',
    color: '#84cc16',
    gradient: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)'
  },
  { 
    text: 'Notifications', 
    icon: <Notifications />, 
    path: '/notifications',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
  },
];

const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);
const MotionCard = motion(Box);

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const drawer = (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderRight: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          color: 'white',
          borderRadius: '0 0 20px 0',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Course Rep
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Management System
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Chip
          label={`Welcome, ${user?.name || 'User'}`}
          variant="outlined"
          sx={{
            width: '100%',
            mb: 2,
            borderColor: 'rgba(99, 102, 241, 0.3)',
            color: '#6366f1',
            fontWeight: 500,
          }}
        />
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />
      
      <List sx={{ px: 2 }}>
        <AnimatePresence>
          {menuItems.map((item, index) => (
            <MotionListItem
              key={item.text}
              disablePadding
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{ mb: 1 }}
            >
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  '&.Mui-selected': {
                    background: item.gradient,
                    color: 'white',
                    '&:hover': {
                      background: item.gradient,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    background: `${item.color}15`,
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'white' : item.color,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </MotionListItem>
          ))}
        </AnimatePresence>
      </List>
    </MotionBox>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#1e293b',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#1e293b',
              fontWeight: 600,
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="large"
              sx={{ color: '#6366f1' }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsActive />
              </Badge>
            </IconButton>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ color: '#6366f1' }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                mt: 1,
                minWidth: 200,
              }
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user?.name} ({user?.id})
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <MotionBox
        component="main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </MotionBox>
    </Box>
  );
}

export default Layout; 