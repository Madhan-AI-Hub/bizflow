import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, CircularProgress, TextField, MenuItem } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { expenseService } from '../../services/expenseService';
import { useTranslation } from '../../hooks/useTranslation';

const Expenses = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ category: 'OTHER', amount: '', description: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { loadExpenses(); }, []);

  const loadExpenses = async () => {
    try {
      const res = await expenseService.getExpenses();
      setExpenses(res.data);
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await expenseService.updateExpense(editId, formData);
        showToast(t('updateSuccess'));
      } else {
        await expenseService.createExpense(formData);
        showToast(t('createSuccess'));
      }
      setDialogOpen(false);
      setFormData({ category: 'OTHER', amount: '', description: '', date: new Date().toISOString().split('T')[0], notes: '' });
      setEditId(null);
      loadExpenses();
    } catch (error) {
      showToast(error.response?.data?.message || t('operationFailed'), 'error');
    }
  };

  const handleEdit = (expense) => {
    setFormData({ category: expense.category, amount: expense.amount, description: expense.description, date: new Date(expense.date).toISOString().split('T')[0], notes: expense.notes || '' });
    setEditId(expense._id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await expenseService.deleteExpense(deleteDialog.id);
      showToast(t('deleteSuccess'));
      setDeleteDialog({ open: false, id: null });
      loadExpenses();
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    }
  };

  const categories = ['RENT', 'UTILITIES', 'INVENTORY', 'SALARY', 'MARKETING', 'MAINTENANCE', 'OTHER'];

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">{t('expenses')}</Typography><Typography variant="body2" color="text.secondary">{t('trackExpenses')}</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>{t('addExpense')}</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : expenses.length === 0 ? (<Card><EmptyState title={t('noExpensesYet')} message={t('recordYourFirstExpense')} actionLabel={t('addExpense')} onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>{t('date')}</strong></TableCell><TableCell><strong>{t('category')}</strong></TableCell><TableCell><strong>{t('notes')}</strong></TableCell><TableCell><strong>{t('amount')}</strong></TableCell><TableCell align="right"><strong>{t('actions')}</strong></TableCell></TableRow></TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense._id} hover>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell><Chip label={t(expense.category.toLowerCase())} color="warning" size="small" /></TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell><Chip label={`₹${expense.amount.toLocaleString()}`} color="error" /></TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(expense)} size="small"><Edit /></IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, id: expense._id })} size="small" color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditId(null); setFormData({ category: 'OTHER', amount: '', description: '', date: new Date().toISOString().split('T')[0], notes: '' }); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? t('edit') : t('addExpense')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField select fullWidth label={t('category')} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>{categories.map(cat => <MenuItem key={cat} value={cat}>{t(cat.toLowerCase())}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('amount')} type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('description') || 'Description'} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('date')} type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('notes')} multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setEditId(null); }}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{editId ? t('update') : t('create')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} title={t('delete')} message={t('thisActionCannotBeUndone')} onConfirm={handleDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} />
    </AppLayout>
  );
};

export default Expenses;
