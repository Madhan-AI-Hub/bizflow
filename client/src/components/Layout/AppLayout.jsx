import React, { useState } from 'react';
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
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  Receipt,
  AccountBalance,
  Business,
  Brightness4,
  Brightness7,
  Logout,
  HelpOutline
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const drawerWidth = 260;

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let menuItems = [];
  
  if (isAdmin()) {
    menuItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Business Profile', icon: <Business />, path: '/business' },
      { text: 'Customers', icon: <People />, path: '/customers' },
      { text: 'Products', icon: <Inventory />, path: '/products' },
      { text: 'Sales', icon: <ShoppingCart />, path: '/sales' },
      { text: 'Expenses', icon: <AccountBalance />, path: '/expenses' },
      { text: 'Employees', icon: <People />, path: '/employees' },
      { text: 'Support', icon: <HelpOutline />, path: '/support' }
    ];
  } else if (isCustomer && isCustomer()) {
    menuItems = [
      { text: 'My Dashboard', icon: <Dashboard />, path: '/customer/dashboard' },
      { text: 'Support', icon: <HelpOutline />, path: '/support' }
    ];
  } else {
    menuItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/staff/dashboard' },
      { text: 'Customers', icon: <People />, path: '/staff/customers' },
      { text: 'Sales', icon: <ShoppingCart />, path: '/staff/sales' },
      { text: 'Products', icon: <Inventory />, path: '/staff/products' },
      { text: 'Support', icon: <HelpOutline />, path: '/support' }
    ];
  }

  const drawer = (
    <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : '#001E2B', 
        color: theme.palette.text.primary,
        borderRight: theme.palette.mode === 'light' ? '1px solid #E8EDEB' : 'none'
    }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          component="img" 
          src="/bizflow_logo.png" 
          sx={{ width: 32, height: 32, borderRadius: 1 }} 
          alt="BizFlow"
        />
        <Box>
          <Typography variant="h6" fontWeight="700" sx={{ color: theme.palette.text.primary, lineHeight: 1 }}>
            BizFlow
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            ATLAS DASHBOARD
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: theme.palette.mode === 'light' ? '#E8EDEB' : 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  backgroundColor: isActive ? '#00ED64' : 'transparent',
                  color: isActive ? '#001E2B' : theme.palette.text.primary,
                  borderLeft: isActive ? '4px solid #00684A' : '4px solid transparent', // Darker green for active border
                  '&:hover': {
                    backgroundColor: isActive ? '#00DA5C' : theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#001E2B' : theme.palette.text.primary
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  px: 2
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#001E2B' : theme.palette.text.secondary, minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem', 
                    fontWeight: isActive ? 600 : 400 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: theme.palette.mode === 'light' ? '#E8EDEB' : 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#00ED64', color: '#001E2B', fontSize: '0.8rem', fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight="600" sx={{ color: theme.palette.text.primary }} noWrap>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.default',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" fontWeight="600" color="text.primary">
              {menuItems.find(item => item.path === location.pathname)?.text || 'Overview'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7 sx={{ fontSize: 20 }} /> : <Brightness4 sx={{ fontSize: 20 }} />}
            </IconButton>
            <IconButton onClick={handleUserMenuOpen} color="inherit">
              <Logout sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
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
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
