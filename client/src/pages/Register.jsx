import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Receipt } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { authService } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessCategory: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register(formData);
      login(response.data.user, response.data.token);
      showToast('Registration successful! Welcome to BizFlow!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: isDark ? '#001E2B' : '#F9FBFA',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <Box 
                component="img" 
                src="/bizflow_logo.png" 
                sx={{ width: 40, height: 40, borderRadius: 1 }} 
                alt="BizFlow"
            />
            <Typography variant="h4" fontWeight="700" sx={{ color: isDark ? 'white' : '#001E2B', letterSpacing: '-0.5px' }}>
              BizFlow <span style={{ color: '#00ED64' }}>Atlas</span>
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#5C6B75', fontWeight: 400 }}>
            The most effective way to manage your local business
          </Typography>
        </Box>

        <Card sx={{ 
            borderRadius: 3, 
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB'}`, 
            bgcolor: isDark ? '#092230' : '#FFFFFF', 
            boxShadow: isDark ? '0 40px 100px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.03)' 
        }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h5" fontWeight="700" sx={{ color: isDark ? 'white' : '#001E2B', mb: 1 }} textAlign="center">
              Create Your Atlas Account
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#5C6B75', mb: 4 }} textAlign="center">
              No credit card required. Start your 30-day free trial.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@company.com"
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 8 characters"
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    Business Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="Your shop or company name"
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    Business Category
                  </Typography>
                  <TextField
                    fullWidth
                    name="businessCategory"
                    placeholder="e.g., Retail, Cafe, Salon"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    required
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                    py: 1.5, 
                    mt: 4, 
                    mb: 4, 
                    bgcolor: '#00ED64', 
                    color: '#001E2B', 
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#00DA5C' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create My Atlas Account'}
              </Button>

              <Box sx={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#E8EDEB'}`, pt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#5C6B75' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#00ED64', textDecoration: 'none', fontWeight: 600 }}>
                      Log In
                    </Link>
                  </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
