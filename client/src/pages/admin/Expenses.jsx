import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, CircularProgress, TextField, MenuItem } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { expenseService } from '../../services/expenseService';

const Expenses = () => {
  const { showToast } = useToast();
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
      showToast('Failed to load expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await expenseService.updateExpense(editId, formData);
        showToast('Expense updated successfully');
      } else {
        await expenseService.createExpense(formData);
        showToast('Expense created successfully');
      }
      setDialogOpen(false);
      setFormData({ category: 'OTHER', amount: '', description: '', date: new Date().toISOString().split('T')[0], notes: '' });
      setEditId(null);
      loadExpenses();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
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
      showToast('Expense deleted successfully');
      setDeleteDialog({ open: false, id: null });
      loadExpenses();
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  const categories = ['RENT', 'UTILITIES', 'INVENTORY', 'SALARY', 'MARKETING', 'MAINTENANCE', 'OTHER'];

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">Expenses</Typography><Typography variant="body2" color="text.secondary">Track all business expenses</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Add Expense</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : expenses.length === 0 ? (<Card><EmptyState title="No expenses yet" message="Start by recording your first expense" actionLabel="Add Expense" onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>Date</strong></TableCell><TableCell><strong>Category</strong></TableCell><TableCell><strong>Description</strong></TableCell><TableCell><strong>Amount</strong></TableCell><TableCell align="right"><strong>Actions</strong></TableCell></TableRow></TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense._id} hover>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell><Chip label={expense.category} color="warning" size="small" /></TableCell>
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
        <DialogTitle>{editId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField select fullWidth label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>{categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Amount" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes" multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setEditId(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} title="Delete Expense" message="Are you sure you want to delete this expense?" onConfirm={handleDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} />
    </AppLayout>
  );
};

export default Expenses;
