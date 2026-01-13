import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, CircularProgress, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { employeeService } from '../../services/employeeService';
import { useTranslation } from '../../hooks/useTranslation';

const Employees = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
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
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await employeeService.updateEmployee(editId, formData);
        showToast(t('employeeUpdatedSuccess'));
      } else {
        await employeeService.createEmployee(formData);
        showToast(t('employeeCreatedSuccess'));
      }
      setDialogOpen(false);
      setFormData({ name: '', email: '', password: '' });
      setEditMode(false);
      setEditId(null);
      loadEmployees();
    } catch (error) {
      showToast(error.response?.data?.message || t('operationFailed'), 'error');
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
      showToast(t('employeeDeletedSuccess'));
      setDeleteDialog({ open: false, id: null });
      loadEmployees();
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">{t('employees')}</Typography><Typography variant="body2" color="text.secondary">{t('manageStaffAccounts')}</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>{t('addEmployee')}</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : employees.length === 0 ? (<Card><EmptyState title={t('noEmployeesYet')} message={t('addYourFirstStaff')} actionLabel={t('addEmployee')} onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>{t('name')}</strong></TableCell><TableCell><strong>{t('email')}</strong></TableCell><TableCell><strong>{t('role')}</strong></TableCell><TableCell><strong>{t('joined')}</strong></TableCell><TableCell align="right"><strong>{t('actions')}</strong></TableCell></TableRow></TableHead>
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
        <DialogTitle>{editMode ? t('editEmployee') : t('addEmployee')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label={t('name')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('email')} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('password')} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editMode} helperText={editMode ? t('leaveBlankToKeepPassword') : ""} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); }}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{editMode ? t('update') : t('create')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} title={t('deleteEmployee')} message={t('areYouSureDeleteEmployee')} onConfirm={handleDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} />
    </AppLayout>
  );
};

export default Employees;
