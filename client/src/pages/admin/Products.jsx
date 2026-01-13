import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, CircularProgress, MenuItem } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { productService } from '../../services/productService';
import { useTranslation } from '../../hooks/useTranslation';

const Products = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ name: '', category: '', price: '', stockQuantity: 0, unit: 'piece', isAvailable: true, description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await productService.getProducts();
      setProducts(res.data);
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await productService.updateProduct(editId, formData);
        showToast(t('updateSuccess'));
      } else {
        await productService.createProduct(formData);
        showToast(t('createSuccess'));
      }
      setDialogOpen(false);
      setFormData({ name: '', category: '', price: '', stockQuantity: 0, unit: 'piece', isAvailable: true, description: '' });
      setEditId(null);
      loadProducts();
    } catch (error) {
      showToast(error.response?.data?.message || t('operationFailed'), 'error');
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, category: product.category, price: product.price, stockQuantity: product.stockQuantity, unit: product.unit, isAvailable: product.isAvailable, description: product.description || '' });
    setEditId(product._id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteDialog.id);
      showToast(t('deleteSuccess'));
      setDeleteDialog({ open: false, id: null });
      loadProducts();
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">{t('products')}</Typography><Typography variant="body2" color="text.secondary">{t('manageProducts')}</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>{t('addProduct')}</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : products.length === 0 ? (<Card><EmptyState title={t('noProductsYet')} message={t('addYourFirstProduct')} actionLabel={t('addProduct')} onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>{t('name')}</strong></TableCell><TableCell><strong>{t('category')}</strong></TableCell><TableCell><strong>{t('price')}</strong></TableCell><TableCell><strong>{t('stock')}</strong></TableCell><TableCell><strong>{t('status')}</strong></TableCell><TableCell align="right"><strong>{t('actions')}</strong></TableCell></TableRow></TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stockQuantity} {product.unit}</TableCell>
                    <TableCell><Chip label={product.isAvailable ? t('yes') : t('no')} color={product.isAvailable ? 'success' : 'default'} size="small" /></TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(product)} size="small"><Edit /></IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, id: product._id })} size="small" color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditId(null); setFormData({ name: '', category: '', price: '', stockQuantity: 0, unit: 'piece', isAvailable: true, description: '' }); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? t('edit') : t('addProduct')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label={t('productName')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('category')} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('price')} type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('stock')} type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={t('unit') || 'Unit'} value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField select fullWidth label={t('status')} value={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value })}><MenuItem value={true}>{t('yes')}</MenuItem><MenuItem value={false}>{t('no')}</MenuItem></TextField></Grid>
            <Grid item xs={12}><TextField fullWidth label={t('notes')} multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>
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

export default Products;
