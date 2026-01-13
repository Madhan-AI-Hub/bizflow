import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, TextField, Grid, CircularProgress, Avatar, Divider, Paper, Stack, Chip } from '@mui/material';
import { Edit, Save, Business, ContactPhone, LocationOn, Badge, Category, Description, Email, Phone, Language, Cancel } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import { useToast } from '../../components/Toast';
import { businessService } from '../../services/businessService';
import { useTranslation } from '../../hooks/useTranslation';

const BusinessProfile = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', category: '', email: '', phone: '', address: '', 
    gstNumber: '', licenseNumber: '', description: '', website: '' 
  });

  useEffect(() => { loadBusiness(); }, []);

  const loadBusiness = async () => {
    try {
      const res = await businessService.getBusiness();
      setBusiness(res.data);
      setFormData({ 
        name: res.data.name, 
        category: res.data.category, 
        email: res.data.email || '', 
        phone: res.data.phone || '', 
        address: res.data.address || '', 
        gstNumber: res.data.gstNumber || '', 
        licenseNumber: res.data.licenseNumber || '', 
        description: res.data.description || '',
        website: res.data.website || ''
      });
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await businessService.updateBusiness(formData);
      showToast(t('updateSuccess'));
      setEditing(false);
      loadBusiness();
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (business) {
        setFormData({ 
            name: business.name, 
            category: business.category, 
            email: business.email || '', 
            phone: business.phone || '', 
            address: business.address || '', 
            gstNumber: business.gstNumber || '', 
            licenseNumber: business.licenseNumber || '', 
            description: business.description || '',
            website: business.website || ''
        });
    }
  };

  if (loading) return <AppLayout><Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box></AppLayout>;

  return (
    <AppLayout>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', mb: 10 }}>
        <Paper 
          sx={{ 
            height: 200, 
            background: 'linear-gradient(135deg, #001E2B 0%, #00684A 100%)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            px: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Abstract decoration */}
          <Box sx={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, background: 'rgba(0, 237, 100, 0.1)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', left: '20%', bottom: -30, width: 100, height: 100, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%' }} />
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h3" color="white" fontWeight="800" sx={{ mb: 1 }}>
              {business?.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={business?.category} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
              {business?.gstNumber && <Chip label={t('gstRegistered')} size="small" sx={{ bgcolor: 'primary.main', color: 'dark.main', fontWeight: 600 }} />}
            </Stack>
          </Box>
        </Paper>

        {/* Floating Avatar & Actions */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -60, 
            left: 32, 
            display: 'flex', 
            alignItems: 'flex-end', 
            width: 'calc(100% - 64px)',
            zIndex: 2
          }}
        >
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: 'primary.main', 
              border: '6px solid',
              borderColor: 'background.default',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              fontSize: '3rem',
              fontWeight: 800,
              color: 'dark.main'
            }}
          >
            {business?.name?.charAt(0)}
          </Avatar>
          
          <Box sx={{ ml: 'auto', mb: 2 }}>
            {!editing ? (
              <Button 
                variant="contained" 
                startIcon={<Edit />} 
                onClick={() => setEditing(true)}
                sx={{ 
                  borderRadius: 2, 
                  px: 4, 
                  boxShadow: '0 4px 12px rgba(0, 237, 100, 0.3)',
                  '&:hover': { transform: 'translateY(-2px)', transition: '0.2s' }
                }}
              >
                {t('edit')}
              </Button>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="primary" startIcon={<Cancel />} onClick={handleCancel}>
                  {t('cancel')}
                </Button>
                <Button variant="contained" startIcon={<Save />} onClick={handleSubmit}>
                  {t('save')}
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - General Info */}
        <Grid item xs={12} md={7}>
          <Stack spacing={4}>
            {/* Basic Details */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2, width: 40, height: 40 }}>
                    <Business />
                  </Avatar>
                  <Typography variant="h6">{t('overview')}</Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label={t('businessName')} 
                      variant="standard"
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      disabled={!editing} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label={t('category')} 
                      variant="standard"
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                      disabled={!editing} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label={t('notes')} 
                      multiline 
                      rows={4}
                      placeholder={t('tellUsAboutBusiness')}
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      disabled={!editing} 
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Legal & Registration */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.main', mr: 2, width: 40, height: 40 }}>
                    <Badge />
                  </Avatar>
                  <Typography variant="h6">{t('legalTaxID')}</Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label={t('gstNumber')} 
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      variant="standard"
                      value={formData.gstNumber} 
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} 
                      disabled={!editing} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label={t('businessLicense')} 
                      variant="standard"
                      value={formData.licenseNumber} 
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} 
                      disabled={!editing} 
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Contact Info */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={4}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', mr: 2, width: 40, height: 40 }}>
                  <ContactPhone />
                </Avatar>
                <Typography variant="h6">{t('contactLocation')}</Typography>
              </Box>

              <Stack spacing={4}>
                <Box display="flex" alignItems="flex-start">
                  <Email color="action" sx={{ mt: 2, mr: 2 }} />
                  <TextField 
                    fullWidth 
                    label={t('email')} 
                    variant="standard"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    disabled={!editing} 
                  />
                </Box>

                <Box display="flex" alignItems="flex-start">
                  <Phone color="action" sx={{ mt: 2, mr: 2 }} />
                  <TextField 
                    fullWidth 
                    label={t('phone')} 
                    variant="standard"
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    disabled={!editing} 
                  />
                </Box>

                <Box display="flex" alignItems="flex-start">
                  <LocationOn color="action" sx={{ mt: 2, mr: 2 }} />
                  <TextField 
                    fullWidth 
                    label={t('address')} 
                    multiline
                    rows={3}
                    variant="standard"
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    disabled={!editing} 
                  />
                </Box>

                <Box display="flex" alignItems="flex-start">
                  <Language color="action" sx={{ mt: 2, mr: 2 }} />
                  <TextField 
                    fullWidth 
                    label={t('websiteURL')} 
                    placeholder="https://example.com"
                    variant="standard"
                    value={formData.website} 
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                    disabled={!editing} 
                  />
                </Box>
              </Stack>

              {editing && (
                <Box sx={{ mt: 6, p: 2, bgcolor: 'rgba(0, 237, 100, 0.05)', borderRadius: 2, border: '1px dashed', borderColor: 'primary.main' }}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {t('editModeNotice')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default BusinessProfile;
