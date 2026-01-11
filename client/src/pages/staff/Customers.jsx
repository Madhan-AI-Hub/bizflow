import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { customerService } from '../../services/customerService';

const StaffCustomers = () => {
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
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await customerService.createCustomer(formData);
      showToast('Customer created successfully');
      setDialogOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '', password: '' });
      loadCustomers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">Customers</Typography><Typography variant="body2" color="text.secondary">View and add customers</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Add Customer</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : customers.length === 0 ? (<Card><EmptyState title="No customers yet" message="Start by adding your first customer" actionLabel="Add Customer" onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>Name</strong></TableCell><TableCell><strong>Phone</strong></TableCell><TableCell><strong>Email</strong></TableCell></TableRow></TableHead>
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
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password (for portal access)" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Set password for customer login" helperText="This password allows customers to log in to their portal." /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default StaffCustomers;
