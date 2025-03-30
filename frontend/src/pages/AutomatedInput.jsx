import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Switch,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import axios from 'axios';

// Mock transaction data generator
const generateMockTransaction = () => {
  // Generate random transaction amount between $10 and $10000
  const amount = parseFloat((Math.random() * 9990 + 10).toFixed(2));
  
  // Generate random card IDs
  const card1 = Math.floor(Math.random() * 9000) + 1000;
  const card2 = Math.floor(Math.random() * 900) + 100;
  const card3 = Math.floor(Math.random() * 900) + 100;
  const card5 = Math.floor(Math.random() * 900) + 100;
  
  // Generate random address and distance
  const addr1 = Math.floor(Math.random() * 900) + 100;
  const dist1 = Math.floor(Math.random() * 5000);
  
  // Generate other random values
  const C1 = Math.floor(Math.random() * 10);
  const C2 = Math.floor(Math.random() * 5);
  const D1 = Math.floor(Math.random() * 30);
  const D15 = Math.floor(Math.random() * 5);
  
  // Generate random V values
  const V95 = parseFloat((Math.random() * 4 - 2).toFixed(2));
  const V96 = parseFloat((Math.random() * 4 - 2).toFixed(2));
  const V97 = parseFloat((Math.random() * 4 - 2).toFixed(2));
  const V126 = parseFloat((Math.random() * 4 - 2).toFixed(2));
  const V127 = parseFloat((Math.random() * 4 - 2).toFixed(2));
  
  // Generate transaction timestamp
  const TransactionDT = Math.floor(Date.now() / 1000);
  
  // Generate email domain
  const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'protonmail.com'];
  const P_emaildomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  
  // Generate product code
  const productCodes = ['H', 'C', 'S', 'R', 'W'];
  const ProductCD = productCodes[Math.floor(Math.random() * productCodes.length)];
  
  // Generate transaction sequence (previous transactions)
  const transactionSequence = [];
  for (let i = 0; i < 5; i++) {
    const seqAmount = parseFloat((Math.random() * 2000 + 50).toFixed(2));
    transactionSequence.push([seqAmount, card1, card2, card3, card5, addr1, dist1, C1, C2, D1, D15]);
  }
  
  // Generate transaction description
  const descriptions = [
    "Purchase at online retailer",
    "Subscription payment",
    "Wire transfer to business account",
    "International payment",
    "ATM withdrawal",
    "Mobile payment to peer",
    "Bill payment",
    "Recurring payment to service provider",
    "International wire transfer",
    "Large purchase at electronics store"
  ];
  const transactionText = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Generate network data
  const userId = 'user_' + Math.floor(Math.random() * 1000);
  const recipientId = 'recipient_' + Math.floor(Math.random() * 1000);
  const bankId = 'bank_' + Math.floor(Math.random() * 100);
  
  const networkData = {
    nodes: {
      [userId]: {
        transaction_count: Math.floor(Math.random() * 50) + 1,
        total_amount: parseFloat((Math.random() * 50000).toFixed(2)),
        risk_score: parseFloat((Math.random() * 0.9).toFixed(2)),
        age: Math.floor(Math.random() * 1000) + 1,
        is_business: Math.random() > 0.7 ? 1 : 0
      },
      [recipientId]: {
        transaction_count: Math.floor(Math.random() * 500) + 1,
        total_amount: parseFloat((Math.random() * 1000000).toFixed(2)),
        risk_score: parseFloat((Math.random() * 0.9).toFixed(2)),
        age: Math.floor(Math.random() * 3650) + 30,
        is_business: Math.random() > 0.3 ? 1 : 0
      },
      [bankId]: {
        transaction_count: Math.floor(Math.random() * 10000) + 1000,
        total_amount: parseFloat((Math.random() * 100000000).toFixed(2)),
        risk_score: parseFloat((Math.random() * 0.5).toFixed(2)),
        age: Math.floor(Math.random() * 10000) + 365,
        is_business: 1
      }
    },
    edges: [
      {
        source: userId,
        target: bankId,
        amount: amount,
        timestamp: TransactionDT,
        frequency: Math.floor(Math.random() * 100) + 1,
        is_international: Math.random() > 0.7 ? 1 : 0
      },
      {
        source: bankId,
        target: recipientId,
        amount: amount,
        timestamp: TransactionDT + 1,
        frequency: Math.floor(Math.random() * 100) + 1,
        is_international: Math.random() > 0.7 ? 1 : 0
      }
    ]
  };
  
  // Generate metadata
  const metadata = {
    user_id: userId,
    device_fingerprint: 'device_' + Math.floor(Math.random() * 10000),
    ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
    login_time: new Date().toISOString(),
    account_age_days: Math.floor(Math.random() * 1000) + 1
  };
  
  return {
    transaction_data: {
      TransactionAmt: amount,
      ProductCD,
      card1,
      card2,
      card3,
      card5,
      addr1,
      dist1,
      C1,
      C2,
      D1,
      D15,
      V95,
      V96,
      V97,
      V126,
      V127,
      TransactionDT,
      P_emaildomain
    },
    transaction_sequence: transactionSequence,
    transaction_text: transactionText,
    network_data: networkData,
    metadata
  };
};

const AutomatedInput = ({ addResult }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [apiSource, setApiSource] = useState('plaid');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useRealApi, setUseRealApi] = useState(false);
  const intervalRef = useRef(null);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle API source change
  const handleApiSourceChange = (event) => {
    setApiSource(event.target.value);
  };

  // Start automated transaction feed
  const startAutomatedFeed = () => {
    setIsRunning(true);
    setProgress(0);
    setError('');
    
    // Set interval to generate and process transactions (5 per minute = 1 every 12 seconds)
    intervalRef.current = setInterval(() => {
      processTransaction();
    }, 12000); // 12 seconds interval
    
    // Process first transaction immediately
    processTransaction();
  };

  // Stop automated transaction feed
  const stopAutomatedFeed = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  // Process a single transaction
  const processTransaction = async () => {
    try {
      // Generate mock transaction data
      const transactionData = generateMockTransaction();
      
      // If using real API, we would fetch data here instead of generating mock data
      // For now, we'll use the mock data for demonstration
      
      // Send transaction data to fraud detection API
      const response = await axios.post('/api/detect-fraud', transactionData);
      
      // Add timestamp and transaction info to result
      const resultWithInfo = {
        ...response.data,
        timestamp: new Date().toISOString(),
        transaction_amount: transactionData.transaction_data.TransactionAmt,
        transaction_text: transactionData.transaction_text,
        api_source: apiSource
      };
      
      // Add result to results list
      addResult(resultWithInfo);
      
      // Add transaction to local list
      setTransactions(prev => [resultWithInfo, ...prev].slice(0, 10)); // Keep only the 10 most recent
      
      // Update progress
      setProgress(prev => (prev + 20) % 100); // 5 transactions = 100%
      
    } catch (err) {
      console.error('Error processing transaction:', err);
      setError(err.response?.data?.detail || 'An error occurred while processing the transaction');
      stopAutomatedFeed();
    }
  };

  // Get risk level color
  const getRiskColor = (risk) => {
    if (risk < 0.3) return theme.palette.success.main;
    if (risk < 0.7) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

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
          Automated Transaction Feed
        </Typography>
        <Typography variant="body1">
          Connect to an external API to automatically feed transaction data into our fraud detection system.
          The system will process 5 transactions per minute and display the results in real-time.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Data Source
              </Typography>
              <RadioGroup
                name="api-source"
                value={apiSource}
                onChange={handleApiSourceChange}
              >
                <FormControlLabel 
                  value="plaid" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>Plaid API</Typography>
                      <Chip 
                        label="Recommended" 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1, height: 20 }} 
                      />
                    </Box>
                  } 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Connect to Plaid for real-time banking transaction data
                </Typography>
                
                <FormControlLabel value="stripe" control={<Radio />} label="Stripe API" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Connect to Stripe for payment processing transaction data
                </Typography>
              </RadioGroup>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                API Key (Optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isRunning}
                variant="outlined"
                size="small"
                type="password"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                For demo purposes, you can leave this blank to use simulated data
              </Typography>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={useRealApi} 
                  onChange={(e) => setUseRealApi(e.target.checked)}
                  disabled={!apiKey || isRunning}
                />
              }
              label="Use real API connection"
            />
            
            <Divider sx={{ my: 3 }} />
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
              onClick={isRunning ? stopAutomatedFeed : startAutomatedFeed}
              sx={{
                py: 1.5,
                background: isRunning 
                  ? theme.palette.error.main 
                  : 'linear-gradient(90deg, #2196f3, #4caf50)',
                '&:hover': {
                  background: isRunning 
                    ? theme.palette.error.dark 
                    : 'linear-gradient(90deg, #0069c0, #087f23)'
                }
              }}
            >
              {isRunning ? 'Stop Transaction Feed' : 'Start Transaction Feed'}
            </Button>
            
            {isRunning && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Processing transactions (5 per minute)...
                </Typography>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {transactions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No transactions processed yet. Start the automated feed to see results.
                </Typography>
              </Box>
            ) : (
              <List>
                {transactions.map((transaction, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'background.paper',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      {transaction.overall_risk < 0.3 ? (
                        <CheckIcon sx={{ color: theme.palette.success.main }} />
                      ) : (
                        <WarningIcon sx={{ color: getRiskColor(transaction.overall_risk) }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            ${transaction.transaction_amount.toFixed(2)}
                          </Typography>
                          <Chip 
                            label={`Risk: ${(transaction.overall_risk * 100).toFixed(0)}%`}
                            size="small"
                            sx={{ 
                              bgcolor: getRiskColor(transaction.overall_risk),
                              color: '#fff'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.transaction_text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            {transactions.length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/results')}
                sx={{ mt: 2 }}
              >
                View All Results
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AutomatedInput;