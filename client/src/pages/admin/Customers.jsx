import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { customerService } from '../../services/customerService';
import { useTranslation } from '../../hooks/useTranslation';

const Customers = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', notes: '', password: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      const res = await customerService.getCustomers(search);
      setCustomers(res.data);
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await customerService.updateCustomer(editId, formData);
        showToast(t('updateSuccess'));
      } else {
        await customerService.createCustomer(formData);
        showToast(t('createSuccess'));
      }
      setDialogOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '', password: '' });
      setEditId(null);
      loadCustomers();
    } catch (error) {
      showToast(error.response?.data?.message || t('operationFailed'), 'error');
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      address: customer.address || '',
      notes: customer.notes || '',
      password: ''
    });
    setEditId(customer._id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await customerService.deleteCustomer(deleteDialog.id);
      showToast(t('deleteSuccess'));
      setDeleteDialog({ open: false, id: null });
      loadCustomers();
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="700">{t('customers')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('manageCustomers')}</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          {t('addCustomer')}
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      ) : customers.length === 0 ? (
        <Card><EmptyState title={t('noCustomersYet')} message={t('addYourFirstCustomer')} actionLabel={t('addCustomer')} onAction={() => setDialogOpen(true)} /></Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>{t('name')}</strong></TableCell>
                  <TableCell><strong>{t('phone')}</strong></TableCell>
                  <TableCell><strong>{t('email')}</strong></TableCell>
                  <TableCell><strong>{t('total')}</strong></TableCell>
                  <TableCell align="right"><strong>{t('actions')}</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id} hover>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell><Chip label={`₹${customer.totalSpending.toLocaleString()}`} color="primary" size="small" /></TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(customer)} size="small"><Edit /></IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, id: customer._id })} size="small" color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditId(null); setFormData({ name: '', email: '', phone: '', address: '', notes: '', password: '' }); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? t('edit') : t('addCustomer')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label={t('name')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('phone')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('email')} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('address')} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('password')} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} helperText={t('leaveBlankToKeepPassword')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('notes')} multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setEditId(null); }}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{editId ? t('update') : t('create')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} title={t('delete')} message={t('areYouSureDeleteEmployee')} onConfirm={handleDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} />
    </AppLayout>
  );
};

export default Customers;
