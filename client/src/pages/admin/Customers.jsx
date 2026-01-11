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

const Customers = () => {
  const { showToast } = useToast();
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
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await customerService.updateCustomer(editId, formData);
        showToast('Customer updated successfully');
      } else {
        await customerService.createCustomer(formData);
        showToast('Customer created successfully');
      }
      setDialogOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '', password: '' });
      setEditId(null);
      loadCustomers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
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
      showToast('Customer deleted successfully');
      setDeleteDialog({ open: false, id: null });
      loadCustomers();
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="700">Customers</Typography>
          <Typography variant="body2" color="text.secondary">Manage your customer database</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          Add Customer
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      ) : customers.length === 0 ? (
        <Card><EmptyState title="No customers yet" message="Start by adding your first customer" actionLabel="Add Customer" onAction={() => setDialogOpen(true)} /></Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Total Spent</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
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
        <DialogTitle>{editId ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password (for portal access)" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={editId ? "Leave blank to keep current" : "Set password for customer login"} helperText="This password allows customers to log in to their portal." /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes" multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setEditId(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} title="Delete Customer" message="Are you sure you want to delete this customer?" onConfirm={handleDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} />
    </AppLayout>
  );
};

export default Customers;
