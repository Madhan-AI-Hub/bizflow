import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, CircularProgress, TextField, Autocomplete, Tooltip } from '@mui/material';
import { Add, Delete, Visibility, CheckCircle, Edit, Payment } from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { saleService } from '../../services/saleService';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';

const StaffSales = () => {
  const { showToast } = useToast();
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ customerId: null, items: [], paymentMethod: 'CASH', amountPaid: 0, notes: '' });
  const [selectedItems, setSelectedItems] = useState([{ product: null, quantity: 1 }]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [salesRes, customersRes, productsRes] = await Promise.all([saleService.getSales(), customerService.getCustomers(), productService.getProducts()]);
      setSales(salesRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const items = selectedItems.map(item => ({ 
        productId: item.product._id, 
        quantity: parseInt(item.quantity) || 1, 
        price: item.product.price 
      }));
      await saleService.createSale({ 
        customerId: formData.customerId, 
        items, 
        paymentMethod: formData.paymentMethod, 
        amountPaid: parseFloat(formData.amountPaid) || 0,
        notes: formData.notes 
      });
      showToast('Sale created successfully');
      setDialogOpen(false);
      setFormData({ customerId: null, items: [], paymentMethod: 'CASH', amountPaid: 0, notes: '' });
      setSelectedItems([{ product: null, quantity: 1 }]);
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleSettle = async (sale) => {
    try {
      await saleService.updateSale(sale._id, { amountPaid: sale.balanceAmount });
      showToast('Sale settled successfully');
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Settlement failed', 'error');
    }
  };

  const handleEditOpen = (sale) => {
    setSelectedSale(sale);
    setPaymentAmount(sale.balanceAmount);
    setEditDialogOpen(true);
  };

  const handleUpdatePayment = async () => {
    try {
      await saleService.updateSale(selectedSale._id, { amountPaid: parseFloat(paymentAmount) || 0 });
      showToast('Payment updated successfully');
      setEditDialogOpen(false);
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    }
  };

  const addItem = () => {
    setSelectedItems([...selectedItems, { product: null, quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => {
      if (!item.product) return sum;
      const qty = parseFloat(item.quantity) || 0;
      return sum + (item.product.price * qty);
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal();
    setFormData(prev => ({ ...prev, amountPaid: total }));
  }, [selectedItems, dialogOpen]);

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box><Typography variant="h4" fontWeight="700">Sales</Typography><Typography variant="body2" color="text.secondary">Track and manage all sales</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Create Sale</Button>
      </Box>

      {loading ? (<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>) : sales.length === 0 ? (<Card><EmptyState title="No sales yet" message="Start by creating your first sale" actionLabel="Create Sale" onAction={() => setDialogOpen(true)} /></Card>) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell><strong>Date</strong></TableCell><TableCell><strong>Customer</strong></TableCell><TableCell><strong>Total</strong></TableCell><TableCell><strong>Paid</strong></TableCell><TableCell><strong>Balance</strong></TableCell><TableCell><strong>Status</strong></TableCell><TableCell align="right"><strong>Actions</strong></TableCell></TableRow></TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale._id} hover>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>₹{sale.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{(sale.amountPaid || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      {(sale.balanceAmount || 0) > 0 ? (
                        <Typography color="error.main" variant="body2" fontWeight="600">₹{sale.balanceAmount.toLocaleString()}</Typography>
                      ) : (
                        <Typography color="success.main" variant="body2" fontWeight="600">Settled</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={sale.paymentStatus || 'PAID'} 
                        size="small" 
                        color={sale.paymentStatus === 'PAID' ? 'success' : sale.paymentStatus === 'PARTIAL' ? 'warning' : 'error'} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {sale.balanceAmount > 0 ? (
                        <Tooltip title="Update Payment">
                          <IconButton size="small" color="primary" onClick={() => handleEditOpen(sale)}>
                            <Payment fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <IconButton size="small" disabled>
                          <CheckCircle fontSize="small" color="disabled" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setSelectedItems([{ product: null, quantity: 1 }]); }} maxWidth="md" fullWidth>
        <DialogTitle>Create New Sale</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <Autocomplete options={customers} getOptionLabel={(option) => `${option.name} - ${option.phone}`} onChange={(e, value) => setFormData({ ...formData, customerId: value?._id })} renderInput={(params) => <TextField {...params} label="Select Customer" required />} />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="600">Products</Typography>
                <Button size="small" onClick={addItem}>Add Item</Button>
              </Box>
              {selectedItems.map((item, index) => (
                <Box key={index} display="flex" gap={1} mb={1}>
                  <Autocomplete sx={{ flex: 1 }} options={products} getOptionLabel={(option) => `${option.name} - ₹${option.price}`} value={item.product} onChange={(e, value) => updateItem(index, 'product', value)} renderInput={(params) => <TextField {...params} label="Product" size="small" />} />
                  <TextField type="number" label="Qty" size="small" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} sx={{ width: 100 }} />
                  {selectedItems.length > 1 && (
                    <IconButton onClick={() => removeItem(index)} color="error" size="small"><Delete /></IconButton>
                  )}
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}><TextField select fullWidth label="Payment Method" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} SelectProps={{ native: true }}><option value="CASH">Cash</option><option value="CARD">Card</option><option value="UPI">UPI</option><option value="OTHER">Other</option></TextField></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Amount Paid" value={formData.amountPaid} onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes" multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
            <Grid item xs={12}><Box sx={{ p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}><Typography variant="h6" color="primary.dark">Total: ₹{calculateTotal().toLocaleString()}</Typography></Box></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setSelectedItems([{ product: null, quantity: 1 }]); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!formData.customerId || selectedItems.length === 0}>Create Sale</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" gutterBottom color="text.secondary">
              Customer: <strong>{selectedSale?.customerName}</strong>
            </Typography>
            <Typography variant="body2" gutterBottom color="text.secondary">
              Total Amount: <strong>₹{selectedSale?.totalAmount.toLocaleString()}</strong>
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
              Current Balance: <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>₹{selectedSale?.balanceAmount.toLocaleString()}</span>
            </Typography>
            
            <TextField
              fullWidth
              label="Additional Amount Paid"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              helperText={`New Balance will be ₹${Math.max(0, (selectedSale?.balanceAmount || 0) - (parseFloat(paymentAmount) || 0)).toLocaleString()}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdatePayment} disabled={paymentAmount <= 0}>Update Payment</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default StaffSales;
