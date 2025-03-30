import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import {
  Input as InputIcon,
  AutoGraph as AutoGraphIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Static data for dashboard statistics
const DEMO_STATS = {
  totalTransactions: 1254,
  fraudDetected: 37,
  averageRiskScore: 0.18,
  highRiskTransactions: 42
};

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            FinSentinal System
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>
          Choose how you want to analyze transactions for potential fraud
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Our advanced AI-powered system uses multiple models to detect fraudulent activities in financial transactions.
          Select one of the options below to get started.
        </Typography>
        
        {/* Demo Stats */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Total Transactions</Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {DEMO_STATS.totalTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Processed in the last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Fraud Detected</Typography>
                <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: theme.palette.error.main }}>
                  {DEMO_STATS.fraudDetected}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  High-risk transactions flagged
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Average Risk Score</Typography>
                <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
                  {(DEMO_STATS.averageRiskScore * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Across all transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>High Risk</Typography>
                <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: theme.palette.warning.dark }}>
                  {DEMO_STATS.highRiskTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Transactions requiring review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card 
            className="card-hover" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <InputIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                Manual Transaction Input
              </Typography>
              <Typography variant="body1" paragraph>
                Enter transaction details manually through a form interface. This option allows you to input
                specific transaction data and receive immediate fraud analysis results.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ideal for analyzing individual transactions or testing specific scenarios.
              </Typography>
            </CardContent>
            <Divider />
            <CardActions sx={{ p: 2 }}>
              <Button 
                size="large" 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/manual-input')}
                sx={{ 
                  py: 1.5,
                  background: 'linear-gradient(90deg, #4caf50, #2196f3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #087f23, #0069c0)'
                  }
                }}
              >
                Start Manual Input
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            className="card-hover" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AutoGraphIcon sx={{ fontSize: 80, color: theme.palette.secondary.main }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                Automated Transaction Feed
              </Typography>
              <Typography variant="body1" paragraph>
                Connect to an external API to automatically feed transaction data into our fraud detection system.
                Receive real-time analysis of multiple transactions (5 per minute).
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Perfect for continuous monitoring and batch processing of transaction data.
              </Typography>
            </CardContent>
            <Divider />
            <CardActions sx={{ p: 2 }}>
              <Button 
                size="large" 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/automated-input')}
                sx={{ 
                  py: 1.5,
                  background: 'linear-gradient(90deg, #2196f3, #4caf50)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #0069c0, #087f23)'
                  }
                }}
              >
                Start Automated Feed
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;