import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { customerService } from '../../services/customerService';
import { useTranslation } from '../../hooks/useTranslation';

const StaffCustomers = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', notes: '', password: '' });

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const res = await customerService.getCustomers();
      setCustomers(res.data);
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await customerService.createCustomer(formData);
      showToast(t('createSuccess'));
      setDialogOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '', password: '' });
      loadCustomers();
    } catch (error) {
      showToast(error.response?.data?.message || t('operationFailed'), 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">{t('customers')}</Typography><Typography variant="body2" color="text.secondary">{t('viewAddCustomers')}</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>{t('addCustomer')}</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : customers.length === 0 ? (<Card><EmptyState title={t('noCustomersYet')} message={t('addYourFirstCustomer')} actionLabel={t('addCustomer')} onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>{t('name')}</strong></TableCell><TableCell><strong>{t('phone')}</strong></TableCell><TableCell><strong>{t('email')}</strong></TableCell></TableRow></TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id} hover><TableCell>{customer.name}</TableCell><TableCell>{customer.phone}</TableCell><TableCell>{customer.email || '-'}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('addCustomer')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label={t('name')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('phone')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('email')} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('address')} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('passwordPortalAccess')} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={t('setPasswordCustomerLogin')} helperText={t('passwordHelperText')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{t('create')}</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default StaffCustomers;
