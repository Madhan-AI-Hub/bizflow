import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, CircularProgress, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { employeeService } from '../../services/employeeService';

const Employees = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees();
      setEmployees(res.data);
    } catch (error) {
      showToast('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await employeeService.updateEmployee(editId, formData);
        showToast('Employee updated successfully');
      } else {
        await employeeService.createEmployee(formData);
        showToast('Employee created successfully');
      }
      setDialogOpen(false);
      setFormData({ name: '', email: '', password: '' });
      setEditMode(false);
      setEditId(null);
      loadEmployees();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (employee) => {
    setFormData({ name: employee.name, email: employee.email, password: '' });
    setEditId(employee._id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await employeeService.deleteEmployee(deleteDialog.id);
      showToast('Employee deleted successfully');
      setDeleteDialog({ open: false, id: null });
      loadEmployees();
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">Employees</Typography><Typography variant="body2" color="text.secondary">Manage staff accounts</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Add Employee</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : employees.length === 0 ? (<Card><EmptyState title="No employees yet" message="Start by adding your first staff member" actionLabel="Add Employee" onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>Name</strong></TableCell><TableCell><strong>Email</strong></TableCell><TableCell><strong>Role</strong></TableCell><TableCell><strong>Joined</strong></TableCell><TableCell align="right"><strong>Actions</strong></TableCell></TableRow></TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp._id} hover>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{new Date(emp.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(emp)} size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, id: emp._id })} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setFormData({ name: '', email: '', password: '' }); setEditMode(false); setEditId(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editMode} helperText={editMode ? "Leave blank to keep current password" : ""} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} title="Delete Employee" message="Are you sure you want to delete this employee?" onConfirm={handleDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} />
    </AppLayout>
  );
};

export default Employees;
