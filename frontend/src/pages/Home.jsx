import React, { useState } from 'react';
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
  useTheme,
  Link,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Input as InputIcon,
  AutoGraph as AutoGraphIcon,
  Security as SecurityIcon,
  Newspaper as NewspaperIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Static data for dashboard statistics
const DEMO_STATS = {
  totalTransactions: 1254,
  fraudDetected: 37,
  averageRiskScore: 0.18,
  highRiskTransactions: 42
};

// Mock financial news data
const FINANCIAL_NEWS = [
  {
    id: 1,
    title: 'New Regulations on Digital Payments Coming Soon',
    summary: 'Regulatory bodies are set to implement stricter verification processes for online transactions.',
    source: 'Financial Times',
    date: '2 hours ago',
    url: '#'
  },
  {
    id: 2,
    title: 'Major Bank Enhances Fraud Detection Systems',
    summary: 'Leading financial institution implements AI-powered fraud prevention technology.',
    source: 'Bloomberg',
    date: '5 hours ago',
    url: '#'
  },
  {
    id: 3,
    title: 'Rise in Contactless Payment Fraud Cases',
    summary: 'Experts warn of new techniques being used to compromise contactless payment systems.',
    source: 'Reuters',
    date: '1 day ago',
    url: '#'
  }
];

// Mock market trends data
const MARKET_TRENDS = [
  { name: 'S&P 500', value: '4,587.64', change: '+0.58%', up: true },
  { name: 'Dow Jones', value: '37,986.40', change: '+0.32%', up: true },
  { name: 'NASDAQ', value: '14,356.75', change: '-0.21%', up: false },
  { name: 'USD/EUR', value: '0.9245', change: '+0.15%', up: true },
  { name: 'Bitcoin', value: '$61,245.30', change: '-1.24%', up: false }
];

// Mock educational resources
const EDUCATIONAL_RESOURCES = [
  {
    id: 1,
    title: 'Understanding Transaction Fraud Patterns',
    description: 'Learn about common patterns in fraudulent transactions and how to identify them.',
    type: 'Article',
    url: '#'
  },
  {
    id: 2,
    title: 'Securing Your Financial Transactions',
    description: 'Best practices for ensuring your financial transactions remain secure.',
    type: 'Guide',
    url: '#'
  },
  {
    id: 3,
    title: 'The Role of AI in Fraud Detection',
    description: 'How artificial intelligence is revolutionizing the way we detect and prevent fraud.',
    type: 'Webinar',
    url: '#'
  }
];


const Home = () => {
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

      {/* Financial News Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          my: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(76, 175, 80, 0.05))'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <NewspaperIcon sx={{ fontSize: 32, mr: 2, color: theme.palette.info.main }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            Financial News & Updates
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {FINANCIAL_NEWS.map((news) => (
            <Grid item xs={12} md={4} key={news.id}>
              <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip 
                      size="small" 
                      label={news.source} 
                      sx={{ 
                        bgcolor: theme.palette.info.main + '20', 
                        color: theme.palette.info.main,
                        fontWeight: 'medium'
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">{news.date}</Typography>
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {news.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {news.summary}
                  </Typography>
                  <Link 
                    href={news.url} 
                    underline="none" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: theme.palette.info.main,
                      '&:hover': { color: theme.palette.info.dark }
                    }}
                  >
                    <Typography variant="button">Read More</Typography>
                    <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Market Trends Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 28, mr: 2, color: theme.palette.secondary.main }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Market Trends
              </Typography>
            </Box>
            <List>
              {MARKET_TRENDS.map((item, index) => (
                <React.Fragment key={item.name}>
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemText 
                      primary={item.name} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" component="span" sx={{ mr: 1, fontWeight: 'bold' }}>
                        {item.value}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: item.up ? theme.palette.success.main : theme.palette.error.main 
                      }}>
                        {item.up ? 
                          <ArrowUpwardIcon sx={{ fontSize: 16 }} /> : 
                          <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                        }
                        <Typography 
                          variant="body2" 
                          component="span" 
                          sx={{ fontWeight: 'medium' }}
                        >
                          {item.change}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < MARKET_TRENDS.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Educational Resources Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SchoolIcon sx={{ fontSize: 28, mr: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Educational Resources
              </Typography>
            </Box>
            <List>
              {EDUCATIONAL_RESOURCES.map((resource, index) => (
                <React.Fragment key={resource.id}>
                  <ListItem 
                    button 
                    component="a" 
                    href={resource.url}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 1,
                      '&:hover': { bgcolor: theme.palette.action.hover }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main + '20', 
                          color: theme.palette.primary.main,
                          width: 40, 
                          height: 40 
                        }}
                      >
                        <InfoIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary={resource.title} 
                      secondary={resource.description}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                      secondaryTypographyProps={{ 
                        variant: 'body2', 
                        color: 'text.secondary',
                        sx: { mt: 0.5 }
                      }}
                    />
                    <Chip 
                      label={resource.type} 
                      size="small" 
                      sx={{ 
                        bgcolor: theme.palette.primary.main + '20', 
                        color: theme.palette.primary.main,
                        fontWeight: 'medium'
                      }} 
                    />
                  </ListItem>
                  {index < EDUCATIONAL_RESOURCES.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;