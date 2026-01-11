import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Avatar, 
  Stack, 
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme
} from '@mui/material';
import { 
  ExpandMore, 
  Email, 
  Code, 
  Info, 
  Verified, 
  HelpCenter,
  Launch
} from '@mui/icons-material';
import AppLayout from '../components/Layout/AppLayout';

const Support = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleEmailDeveloper = () => {
    const subject = encodeURIComponent("BizFlow App Query / Support Request");
    const body = encodeURIComponent("Hello Madhan,\n\nI have the following query regarding the BizFlow app:\n\n[Describe your query here]\n\nRegards,\n[Your Name]");
    window.location.href = `mailto:madhanac0711@gmail.com?subject=${subject}&body=${body}`;
  };

  const faqs = [
    {
      q: "How do I clear numeric fields in sales?",
      a: "You can simply backspace the entire value in quantity or amount fields. The app will let you leave it blank while typing and will only apply safe defaults (like 0 or 1) when you finish or submit."
    },
    {
      q: "Can staff members see total business profit?",
      a: "No. The dashboard is personalized. Staff members can only see their own sales performance and revenue. Sensitive business-wide financial data is restricted to Admins."
    },
    {
      q: "How do I update my business information?",
      a: "Admins can go to the Business Profile page from the sidebar to update details like name, category, and contact information."
    },
    {
      q: "Is dark mode supported?",
      a: "Yes! You can toggle between light and dark modes using the theme icon in the sidebar for a more comfortable viewing experience."
    }
  ];

  return (
    <AppLayout>
      <Box mb={6} textAlign="center">
        <Typography variant="h4" fontWeight="900" color="text.primary" gutterBottom>
          About & Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Everything you need to know about BizFlow and how to get help.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* App Info Section */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 6, 
              height: '100%',
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#F9FBFA',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Box 
              component="img" 
              src="/bizflow_logo.png" 
              alt="BizFlow Logo" 
              sx={{ width: 120, height: 120, mb: 3, borderRadius: 3, boxShadow: 4 }} 
            />
            
            <Typography variant="h5" fontWeight="800" color="primary.main">
              BizFlow
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ opacity: 0.8, mb: 3 }}>
              Version 1.1.0 (Stable)
            </Typography>

            <Stack spacing={2} width="100%" mb={4}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Code fontSize="small" color="action" />
                <Typography variant="body2" fontWeight="600">Developed by Madhan</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Verified fontSize="small" color="success" />
                <Typography variant="body2" color="text.secondary">Running on Smart-Engine v2</Typography>
              </Box>
            </Stack>

            <Divider sx={{ width: '80%', mb: 4 }} />

            <Typography variant="h6" fontWeight="700" mb={2}>Have a Quick Query?</Typography>
            <Button 
              variant="contained" 
              size="large" 
              fullWidth
              startIcon={<Email />}
              onClick={handleEmailDeveloper}
              sx={{ 
                borderRadius: 3, 
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#00ED64',
                color: '#001E2B',
                '&:hover': { bgcolor: '#00DA5C' }
              }}
            >
              Email Developer Directly
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
              madhanac0711@gmail.com
            </Typography>
          </Paper>
        </Grid>

        {/* Questions Section */}
        <Grid item xs={12} md={7}>
          <Box mb={3} display="flex" alignItems="center" gap={1}>
            <HelpCenter color="primary" />
            <Typography variant="h5" fontWeight="800">General Q&A</Typography>
          </Box>
          
          <Stack spacing={2}>
            {faqs.map((faq, index) => (
              <Accordion 
                key={index} 
                elevation={0} 
                sx={{ 
                  borderRadius: '16px !important', 
                  border: '1px solid', 
                  borderColor: 'divider',
                  '&:before': { display: 'none' },
                  bgcolor: 'transparent',
                  '&.Mui-expanded': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="700">{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          <Card sx={{ mt: 4, borderRadius: 4, bgcolor: '#001E2B', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="start" gap={2}>
                <Info sx={{ color: '#00ED64', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="700">Need Feature Customization?</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                    If your business requires specific features or custom reports, don't hesitate to reach out. I can help tailor BizFlow to your exact needs.
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={handleEmailDeveloper}
                    sx={{ color: '#00ED64', borderColor: '#00ED64', fontWeight: 700, '&:hover': { borderColor: '#00ED64', bgcolor: 'rgba(0,237,100,0.1)' } }}
                  >
                    Request Feature
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default Support;
