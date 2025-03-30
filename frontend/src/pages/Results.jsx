import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Demo data for static demonstration
const DEMO_RESULTS = [
  {
    id: 1,
    fraud_probability: 0.82,
    compliance_risk: 0.75,
    behavior_anomaly: 0.68,
    overall_risk: 0.78,
    timestamp: "2023-06-15T14:32:45",
    transaction_amount: 15000,
    transaction_text: "International wire transfer to offshore account",
    details: {
      fraud: 0.82,
      compliance: [0.25, 0.75],
      behavior: 0.68,
      network: 0.65
    }
  },
  {
    id: 2,
    fraud_probability: 0.15,
    compliance_risk: 0.22,
    behavior_anomaly: 0.18,
    overall_risk: 0.17,
    timestamp: "2023-06-15T15:10:22",
    transaction_amount: 350.50,
    transaction_text: "Regular monthly payment to vendor",
    details: {
      fraud: 0.15,
      compliance: [0.78, 0.22],
      behavior: 0.18,
      network: 0.12
    }
  },
  {
    id: 3,
    fraud_probability: 0.45,
    compliance_risk: 0.58,
    behavior_anomaly: 0.62,
    overall_risk: 0.52,
    timestamp: "2023-06-15T16:05:11",
    transaction_amount: 4200,
    transaction_text: "New recipient payment with unusual amount",
    details: {
      fraud: 0.45,
      compliance: [0.42, 0.58],
      behavior: 0.62,
      network: 0.48
    }
  },
  {
    id: 4,
    fraud_probability: 0.08,
    compliance_risk: 0.12,
    behavior_anomaly: 0.05,
    overall_risk: 0.08,
    timestamp: "2023-06-15T16:45:30",
    transaction_amount: 125.75,
    transaction_text: "Regular subscription payment",
    details: {
      fraud: 0.08,
      compliance: [0.88, 0.12],
      behavior: 0.05,
      network: 0.06
    }
  },
  {
    id: 5,
    fraud_probability: 0.92,
    compliance_risk: 0.85,
    behavior_anomaly: 0.78,
    overall_risk: 0.88,
    timestamp: "2023-06-15T17:22:18",
    transaction_amount: 25000,
    transaction_text: "Large transfer to newly created account in high-risk jurisdiction",
    details: {
      fraud: 0.92,
      compliance: [0.15, 0.85],
      behavior: 0.78,
      network: 0.88
    }
  }
];

const Results = ({ results = [] }) => {
  // Use demo data if no results are provided
  const displayResults = results.length > 0 ? results : DEMO_RESULTS;
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    averageRisk: 0,
  });

  // Calculate statistics when displayResults change
  useEffect(() => {
    if (displayResults.length > 0) {
      const highRisk = displayResults.filter(r => r.overall_risk >= 0.7).length;
      const mediumRisk = displayResults.filter(r => r.overall_risk >= 0.3 && r.overall_risk < 0.7).length;
      const lowRisk = displayResults.filter(r => r.overall_risk < 0.3).length;
      const avgRisk = displayResults.reduce((acc, r) => acc + r.overall_risk, 0) / displayResults.length;
      
      setStats({
        totalTransactions: displayResults.length,
        highRiskCount: highRisk,
        mediumRiskCount: mediumRisk,
        lowRiskCount: lowRisk,
        averageRisk: avgRisk,
      });
    }
  }, [displayResults]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get risk level color
  const getRiskColor = (risk) => {
    if (risk < 0.3) return theme.palette.success.main;
    if (risk < 0.7) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Get risk level text
  const getRiskLevel = (risk) => {
    if (risk < 0.3) return 'Low';
    if (risk < 0.7) return 'Medium';
    return 'High';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'High Risk', value: stats.highRiskCount, color: theme.palette.error.main },
    { name: 'Medium Risk', value: stats.mediumRiskCount, color: theme.palette.warning.main },
    { name: 'Low Risk', value: stats.lowRiskCount, color: theme.palette.success.main },
  ];

  // Prepare data for bar chart
  const barChartData = displayResults.slice(0, 10).map(result => ({
    name: formatDate(result.timestamp).split(',')[1].trim(),
    fraud: parseFloat((result.fraud_probability * 100).toFixed(1)),
    compliance: parseFloat((result.compliance_risk * 100).toFixed(1)),
    behavior: parseFloat((result.behavior_anomaly * 100).toFixed(1)),
    overall: parseFloat((result.overall_risk * 100).toFixed(1)),
  })).reverse();

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(76, 175, 80, 0.1))'
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Fraud Detection Results
        </Typography>
        <Typography variant="body1">
          View and analyze the results of fraud detection analysis on your transactions.
        </Typography>
      </Paper>

      {
        // Always show results UI, using demo data if no actual results
        (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-hover" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Transactions</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.totalTransactions}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-hover" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Average Risk</Typography>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ color: getRiskColor(stats.averageRisk) }}
                  >
                    {(stats.averageRisk * 100).toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-hover" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>High Risk Transactions</Typography>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ color: theme.palette.error.main }}
                  >
                    {stats.highRiskCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-hover" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Low Risk Transactions</Typography>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ color: theme.palette.success.main }}
                  >
                    {stats.lowRiskCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Risk Distribution</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Recent Transaction Risks</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fraud" name="Fraud" fill={theme.palette.error.main} />
                      <Bar dataKey="compliance" name="Compliance" fill={theme.palette.warning.main} />
                      <Bar dataKey="behavior" name="Behavior" fill={theme.palette.info.main} />
                      <Bar dataKey="overall" name="Overall" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Results Table */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Transaction Results</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Fraud Risk</TableCell>
                    <TableCell>Compliance Risk</TableCell>
                    <TableCell>Behavior Anomaly</TableCell>
                    <TableCell>Overall Risk</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayResults
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((result, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{formatDate(result.timestamp)}</TableCell>
                        <TableCell>
                          ${typeof result.transaction_amount === 'number' 
                            ? result.transaction_amount.toFixed(2) 
                            : '0.00'}
                        </TableCell>
                        <TableCell>{result.transaction_text || 'N/A'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={result.fraud_probability * 100} 
                                sx={{ 
                                  height: 10, 
                                  borderRadius: 5,
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.error.main,
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">
                                {(result.fraud_probability * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={result.compliance_risk * 100} 
                                sx={{ 
                                  height: 10, 
                                  borderRadius: 5,
                                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.warning.main,
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">
                                {(result.compliance_risk * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={result.behavior_anomaly * 100} 
                                sx={{ 
                                  height: 10, 
                                  borderRadius: 5,
                                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.info.main,
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">
                                {(result.behavior_anomaly * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${getRiskLevel(result.overall_risk)} (${(result.overall_risk * 100).toFixed(0)}%)`}
                            sx={{ 
                              bgcolor: getRiskColor(result.overall_risk),
                              color: '#fff',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayResults.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Results;