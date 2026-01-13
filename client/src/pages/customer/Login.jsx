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
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Receipt, Phone, Email } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import ForgotPasswordDialog from '../../components/Auth/ForgotPasswordDialog';
import { useTranslation } from '../../hooks/useTranslation';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [loginType, setLoginType] = useState('email'); // 'email' for Email, 'phone' for Phone
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = loginType === 'phone'
        ? { phone: formData.phone, password: formData.password }
        : { email: formData.email, password: formData.password };
        
      const response = await authService.customerLogin(payload);
      login(response.data.user, response.data.token);
      showToast(t('welcomeBack'), 'success');
      navigate('/customer/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || t('loginFailed'), 'error');
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
      <Container maxWidth="sm">
        <Box textAlign="center" mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <Box 
                component="img" 
                src="/bizflow_logo.png" 
                sx={{ width: 40, height: 40, borderRadius: 1 }} 
                alt="BizFlow"
            />
            <Typography variant="h4" fontWeight="700" sx={{ color: isDark ? 'white' : '#001E2B', letterSpacing: '-0.5px' }}>
              {t('customerPortalTitle').split(' ')[0]} <span style={{ color: '#00ED64' }}>{t('customerPortalTitle').split(' ')[1]}</span>
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#5C6B75', fontWeight: 400 }}>
            {t('portalSubtitle')}
          </Typography>
        </Box>

        <Card sx={{ 
            borderRadius: 3, 
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB'}`, 
            bgcolor: isDark ? '#092230' : '#FFFFFF', 
            boxShadow: isDark ? '0 40px 100px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.03)' 
        }}>
          <Box sx={{ borderBottom: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }}>
            <Tabs 
              value={loginType} 
              onChange={(e, v) => setLoginType(v)} 
              centered
              sx={{
                '& .MuiTab-root': { color: isDark ? 'rgba(255,255,255,0.6)' : '#5C6B75', fontWeight: 600 },
                '& .Mui-selected': { color: '#00ED64 !important' },
                '& .MuiTabs-indicator': { bgcolor: '#00ED64' }
              }}
            >
              <Tab label={t('loginEmail')} value="email" />
              <Tab label={t('loginPhone')} value="phone" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <form onSubmit={handleSubmit}>
              {loginType === 'email' ? (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    {t('email')}
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('emailPlaceholder')}
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                    {t('phone')}
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={t('phonePlaceholder')}
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            bgcolor: isDark ? '#001E2B' : '#FFFFFF', 
                            color: isDark ? 'white' : '#001E2B',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB' }
                        }
                    }}
                  />
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: isDark ? 'white' : '#001E2B', fontWeight: 600, mb: 1, display: 'block' }}>
                  {t('password')}
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={t('passwordPlaceholder')}
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
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                    py: 1.5, 
                    mb: 4, 
                    bgcolor: '#00ED64', 
                    color: '#001E2B', 
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#00DA5C' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t('accessPortal')}
              </Button>

              <Box sx={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#E8EDEB'}`, pt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#5C6B75' }}>
                  {t('adminAccessQuery')}{' '}
                  <Link to="/login" style={{ color: '#00ED64', textDecoration: 'none', fontWeight: 600 }}>
                    {t('switchToStaffLogin')}
                  </Link>
                </Typography>
              </Box>
              <Box textAlign="center" mt={2}>
                 <Button 
                   variant="text" 
                   size="small" 
                   sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', textTransform: 'none' }}
                   onClick={() => setForgotPasswordOpen(true)}
                 >
                   {t('forgotPassword')}
                 </Button>
              </Box>
              <Box textAlign="center" mt={1}>
                 <Button 
                   variant="text" 
                   size="small" 
                   sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', textTransform: 'none' }}
                   onClick={() => navigate('/')}
                 >
                   ← {t('backToHome')}
                 </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
      
      <ForgotPasswordDialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </Box>
  );
};

export default CustomerLogin;
