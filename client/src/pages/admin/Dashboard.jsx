import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme // Moved useTheme here from @mui/icons-material
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  People,
  ShoppingCart
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AppLayout from '../../components/Layout/AppLayout';
import { analyticsService } from '../../services/analyticsService';
import { useToast } from '../../components/Toast';

const Dashboard = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, revenueRes, customersRes, productsRes, expensesRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getRevenueByPeriod('daily', 7),
        analyticsService.getTopCustomers(5),
        analyticsService.getTopProducts(5),
        analyticsService.getExpensesByCategory()
      ]);

      setStats(statsRes.data);
      setRevenueData(revenueRes.data);
      setTopCustomers(customersRes.data);
      setTopProducts(productsRes.data);
      setExpensesByCategory(expensesRes.data);
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
    const theme = useTheme();
    return (
      <Card sx={{ height: '100%', p: 0.5 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                ₹{value.toLocaleString()}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: 1.5,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ color, fontSize: 24 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const COLORS = ['#00ED64', '#00684A', '#001E2B', '#5C6B75', '#E8EDEB'];

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
    <AppLayout>
      <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of your business performance
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={stats.revenue.total}
            icon={TrendingUp}
            color="#00ED64"
            subtitle={`This month: ₹${stats.revenue.thisMonth.toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expenses"
            value={stats.expenses.total}
            icon={AttachMoney}
            color="#FF0000"
            subtitle={`This month: ₹${stats.expenses.thisMonth.toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net Profit"
            value={stats.profit.total}
            icon={ShoppingCart}
            color="#00684A"
            subtitle={`This month: ₹${stats.profit.thisMonth.toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.counts.customers}
            icon={People}
            color="#00ED64"
            subtitle={`${stats.counts.sales} total sales`}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Revenue Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB'} />
                  <XAxis 
                    dataKey="_id.day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB'}`, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#00ED64" strokeWidth={4} dot={{ fill: '#00ED64', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses by Category */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Expenses by Category
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry._id}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Customers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Top Customers
              </Typography>
              <Box>
                {topCustomers.map((customer, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: index < topCustomers.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {customer.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer.totalPurchases} purchases
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary.main" fontWeight="700">
                      ₹{customer.totalSpent.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Top Products
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB'} />
                  <XAxis 
                    dataKey="productName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E8EDEB'}`, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary
                    }} 
                  />
                  <Bar dataKey="totalRevenue" fill="#00ED64" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default Dashboard;
