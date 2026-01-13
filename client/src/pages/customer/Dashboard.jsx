import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import { 
  ShoppingCart, 
  Receipt, 
  AccountBalanceWallet, 
  CreditCard,
  Business as BusinessIcon
} from '@mui/icons-material';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { saleService } from '../../services/saleService';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMySales();
  }, []);

  const loadMySales = async () => {
    try {
      const res = await saleService.getSales();
      setSales(res.data);
    } catch (error) {
      showToast('Failed to load your purchase history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalBalance = sales.reduce((sum, sale) => sum + (sale.balanceAmount || 0), 0);
  const lastPurchase = sales.length > 0 ? sales[0] : null;

  const StatCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
      <Card 
        sx={{ 
          height: '100%', 
          borderRadius: 3, 
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s',
          '&:hover': { 
              borderColor: '#00ED64',
              transform: 'translateY(-2px)' 
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {value}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                bgcolor: `${color}15`, 
                color: color,
                width: 44,
                height: 44,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="primary" />
        </Box>
      </AppLayout>
    );
  }

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <AppLayout>
      <Box mb={5}>
        <Typography variant="h4" fontWeight="700" sx={{ color: 'text.primary', mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Hello, {user?.name}!
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Welcome to your customer portal. Track your purchases and payments here.
        </Typography>
      </Box>

      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Purchases" 
            value={`₹${totalSpent.toLocaleString()}`} 
            icon={<ShoppingCart sx={{ fontSize: 24 }} />} 
            color="#00ED64"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Remaining Balance" 
            value={`₹${totalBalance.toLocaleString()}`} 
            icon={<AccountBalanceWallet sx={{ fontSize: 24 }} />} 
            color={totalBalance > 0 ? '#FF0000' : '#00684A'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Recent Activity" 
            value={lastPurchase ? new Date(lastPurchase.createdAt).toLocaleDateString() : 'N/A'} 
            icon={<Receipt sx={{ fontSize: 24 }} />} 
            color="#00ED64"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="700" sx={{ color: 'text.primary', mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Recent Transactions
      </Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'auto', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FBFA' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Paid</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Balance</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#5C6B75' }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale._id} hover sx={{ '&:hover': { bgcolor: 'rgba(0, 237, 100, 0.02) !important' } }}>
                  <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ maxWidth: '300px' }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }} noWrap>
                        {sale.items.map(item => `${item.productName} (x${item.quantity})`).join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>₹{sale.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>₹{sale.amountPaid.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: sale.balanceAmount > 0 ? '#FF0000' : '#00684A', fontWeight: 600 }}>
                    ₹{sale.balanceAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={sale.paymentStatus} 
                      size="small" 
                      sx={{ 
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          borderRadius: '4px',
                          bgcolor: sale.paymentStatus === 'PAID' ? 'rgba(0, 237, 100, 0.1)' : sale.paymentStatus === 'PARTIAL' ? 'rgba(255, 200, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                          color: sale.paymentStatus === 'PAID' ? '#00684A' : sale.paymentStatus === 'PARTIAL' ? '#997000' : '#FF0000',
                          border: 'none'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {user?.businessId && (
        <Box sx={{ mt: 8, p: 4, bgcolor: isDark ? '#092230' : '#001E2B', color: 'white', borderRadius: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}` }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box sx={{ width: 48, height: 48, bgcolor: '#00ED64', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BusinessIcon sx={{ color: '#001E2B' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700" sx={{ color: 'white' }}>
                {user.businessId.name || 'BizFlow Atlas Business'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {user.businessId.category || 'Local Business'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', lineHeight: 1.6 }}>
            Thank you for being a valued customer! Track your purchases, payments, and balances in real-time. If you have any questions, please contact our support team.
          </Typography>
        </Box>
      )}
    </AppLayout>
  );
};

export default CustomerDashboard;
