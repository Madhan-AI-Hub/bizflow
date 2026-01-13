import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Button, Avatar } from '@mui/material';
import { People, ShoppingCart, Inventory, Add, TrendingUp, AssignmentTurnedIn, Today } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { saleService } from '../../services/saleService';
import { analyticsService } from '../../services/analyticsService';
import { useToast } from '../../components/Toast';
import { useTranslation } from '../../hooks/useTranslation';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [recentSales, setRecentSales] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [salesRes, statsRes] = await Promise.all([
        saleService.getSales(),
        analyticsService.getDashboardStats()
      ]);
      setRecentSales(salesRes.data.slice(0, 5));
      setStats(statsRes.data);
    } catch (error) {
      showToast(t('operationFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AppLayout><Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box></AppLayout>;

  return (
    <AppLayout>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="800" color="text.primary">{t('staffDashboard')}</Typography>
        <Typography variant="body1" color="text.secondary">{t('staffWelcome')}</Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="overline" fontWeight="700" color="text.secondary">{t('myTotalRevenue')}</Typography>
                  <Typography variant="h4" fontWeight="700" color="primary.main">₹{stats?.revenue?.total?.toLocaleString() || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#00ED64', color: '#001E2B' }}><TrendingUp /></Avatar>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{t('totalGeneratedSales')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="overline" fontWeight="700" color="text.secondary">{t('mySalesFinished')}</Typography>
                  <Typography variant="h4" fontWeight="700" color="secondary.main">{stats?.counts?.sales || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.light', color: '#001E2B' }}><AssignmentTurnedIn /></Avatar>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{t('totalOrdersProcessed')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="overline" fontWeight="700" color="text.secondary">{t('myTodaysSales')}</Typography>
                  <Typography variant="h4" fontWeight="700" color="warning.main">{stats?.counts?.salesToday || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: '#001E2B' }}><Today /></Avatar>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{t('ordersCompletedShift')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" fontWeight="700" mb={2}>{t('quickOperations')}</Typography>
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }} onClick={() => navigate('/staff/sales')}>
            <CardContent><Box display="flex" alignItems="center" gap={2}><ShoppingCart sx={{ fontSize: 32, color: 'secondary.main' }} /><Box><Typography variant="subtitle1" fontWeight="700">{t('manageSales')}</Typography><Typography variant="body2" color="text.secondary">{t('recordViewSales')}</Typography></Box></Box></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }} onClick={() => navigate('/staff/customers')}>
            <CardContent><Box display="flex" alignItems="center" gap={2}><People sx={{ fontSize: 32, color: 'primary.main' }} /><Box><Typography variant="subtitle1" fontWeight="700">{t('customers')}</Typography><Typography variant="body2" color="text.secondary">{t('manageCustomers')}</Typography></Box></Box></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }} onClick={() => navigate('/staff/products')}>
            <CardContent><Box display="flex" alignItems="center" gap={2}><Inventory sx={{ fontSize: 32, color: 'warning.main' }} /><Box><Typography variant="subtitle1" fontWeight="700">{t('products')}</Typography><Typography variant="body2" color="text.secondary">{t('checkProductCatalog')}</Typography></Box></Box></CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="700">{t('yourRecentSales')}</Typography>
            <Button size="small" onClick={() => navigate('/staff/sales')}>{t('viewAll')}</Button>
          </Box>
          {recentSales.length > 0 ? (
            recentSales.map((sale) => (
              <Box key={sale._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                <Box><Typography variant="body1" fontWeight="600">{sale.customerName}</Typography><Typography variant="caption" color="text.secondary">{new Date(sale.createdAt).toLocaleString()}</Typography></Box>
                <Box textAlign="right"><Typography variant="subtitle1" fontWeight="700" color="primary.main">₹{sale.totalAmount.toLocaleString()}</Typography><Typography variant="caption" sx={{ px: 1, py: 0.2, borderRadius: 1, bgcolor: sale.paymentStatus === 'PAID' ? 'success.light' : 'warning.light', color: '#001E2B', fontWeight: 600 }}>{t(sale.paymentStatus.toLowerCase())}</Typography></Box>
              </Box>
            ))
          ) : (
            <Box py={4} textAlign="center"><Typography color="text.secondary">{t('noSalesRecorded')}</Typography></Box>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default StaffDashboard;

