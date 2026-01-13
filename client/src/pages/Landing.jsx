import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  Analytics,
  Security,
  FlashOn,
  ArrowForward
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 32, color: '#00ED64' }} />,
      title: 'Real-Time Analytics',
      description: 'Track revenue, expenses, and profit with live dashboards updated in real-time.'
    },
    {
      icon: <People sx={{ fontSize: 32, color: '#00ED64' }} />,
      title: 'Customer Management',
      description: 'Manage customers, track purchases, and build lasting business relationships.'
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 32, color: '#00ED64' }} />,
      title: 'Sales Tracking',
      description: 'Detailed recording of sales, inventory management, and performance monitoring.'
    },
    {
      icon: <Analytics sx={{ fontSize: 32, color: '#00ED64' }} />,
      title: 'Business Insights',
      description: 'Get actionable insights with powerful data-driven analytics tools.'
    },
    {
      icon: <Security sx={{ fontSize: 32, color: '#00ED64' }} />,
      title: 'Secure Access',
      description: 'Enterprise-grade role-based permissions to control your team access.'
    },
    {
      icon: <FlashOn sx={{ fontSize: 32, color: '#00ED64' }} />,
      title: 'Fast Deployment',
      description: 'Start managing your business in minutes with our cloud-native platform.'
    }
  ];

  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Header/Nav */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Box 
                component="img" 
                src="/bizflow_logo.png" 
                sx={{ width: 28, height: 28, borderRadius: 1 }} 
                alt="BizFlow"
             />
             <Typography variant="h6" fontWeight="700" color="text.primary">BizFlow</Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button color="inherit" sx={{ fontWeight: 500 }} onClick={() => navigate('/login')}>Sign In</Button>
            <Button 
                variant="contained" 
                sx={{ 
                    bgcolor: '#00ED64', 
                    color: '#001E2B', 
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#00DA5C' }
                }}
                onClick={() => navigate('/register')}
            >
                Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#001E2B',
          pt: { xs: 8, md: 15 },
          pb: { xs: 10, md: 20 },
          position: 'relative',
          overflow: 'hidden',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '2.8rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  mb: 2
                }}
              >
                BizFlow <span style={{ color: '#00ED64' }}>Atlas</span> Database
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mb: 5,
                  maxWidth: '600px',
                  fontWeight: 400,
                  fontSize: '1.25rem'
                }}
              >
                The most effective way to manage your local business operations. Enjoy unmatched resilience, scalability, and enterprise-grade security while eliminating operational complexity.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#00ED64',
                    color: '#001E2B',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#00DA5C' }
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <Button
                  variant="text"
                  size="large"
                  sx={{
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': { color: '#00ED64' }
                  }}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/customer/login')}
                >
                  Customer Portal
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Replicating the abstract MongoDB-style illustration with CSS shapes */}
                    <Box sx={{ 
                        width: '300px', 
                        height: '300px', 
                        bgcolor: 'rgba(0, 237, 100, 0.1)', 
                        borderRadius: '50% 20% 70% 30%', 
                        position: 'absolute' 
                    }} />
                    <Box sx={{ 
                        width: '120px', 
                        height: '240px', 
                        bgcolor: '#00ED64', 
                        borderRadius: '60px',
                        transform: 'rotate(-45deg)',
                        boxShadow: '0 0 40px rgba(0, 237, 100, 0.3)'
                    }}>
                        <Box sx={{ height: '33%', borderBottom: '2px solid #001E2B' }} />
                        <Box sx={{ height: '33%', borderBottom: '2px solid #001E2B' }} />
                    </Box>
                    <Box sx={{ 
                        width: '80px', 
                        height: '80px', 
                        bgcolor: '#FFFFFF', 
                        borderRadius: '20px', 
                        position: 'absolute',
                        right: '40px',
                        top: '60px',
                        transform: 'rotate(15deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShoppingCart sx={{ color: '#001E2B' }} />
                    </Box>
                </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Box sx={{ mb: 10 }}>
            <Typography
            variant="h2"
            sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'text.primary'
            }}
            >
            Everything you need to <br/> run your business
            </Typography>
            <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '700px', fontWeight: 400 }}
            >
            Powerful features designed to simplify operations, increase efficiency, and provide deep insights into your business performance.
            </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#00ED64',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 1.5, color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ borderTop: '1px solid #E8EDEB', py: 12 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" fontWeight="700" sx={{ mb: 3, color: 'text.primary' }}>
              Cloud-native business management
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 400 }}>
              Join hundreds of local businesses that have already scaled their operations with BizFlow.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                  bgcolor: '#00ED64', 
                  color: '#001E2B', 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#00DA5C' }
              }}
              onClick={() => navigate('/register')}
            >
              Try BizFlow Atlas for Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: isDark ? 'background.paper' : '#F9FBFA', py: 5, borderTop: 1, borderColor: 'divider' }}>
          <Container maxWidth="lg">
              <Typography variant="caption" color="text.secondary">
                  © 2026 BizFlow, Inc. Built for local business growth.
              </Typography>
          </Container>
      </Box>
    </Box>
  );
};

export default Landing;
