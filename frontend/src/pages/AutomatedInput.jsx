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
  
  // Generate random card IDs for legacy data format
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
  const TransactionDateTime = new Date().toISOString();
  
  // Generate random IDs
  const TransactionID = Math.floor(Math.random() * 90000000) + 10000000;
  const UserID = `USER_${Math.floor(Math.random() * 900000) + 100000}`;
  
  // Product categories and payment methods
  const productCategories = ['Electronics', 'Clothing', 'Food', 'Travel', 'Entertainment', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Automotive'];
  const paymentMethods = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'Cryptocurrency'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'RUB', 'MXN', 'SGD', 'HKD'];
  const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover', 'JCB', 'Diners Club', 'UnionPay'];
  const cardIssuers = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One', 'American Express', 'Discover'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'China', 'Australia', 'Brazil', 'India'];
  const deviceTypes = ['Mobile', 'Desktop', 'Tablet'];
  const operatingSystems = ['iOS', 'Android', 'Windows', 'macOS', 'Linux'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
  const merchantCategories = ['Retail', 'Food & Beverage', 'Travel', 'Entertainment', 'Technology', 'Healthcare', 'Financial Services'];
  
  // Generate email domain
  const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'protonmail.com'];
  const randomEmailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const randomUsername = 'user' + Math.floor(Math.random() * 10000);
  const userEmail = `${randomUsername}@${randomEmailDomain}`;
  
  // Generate product code (legacy format)
  const productCodes = ['H', 'C', 'S', 'R', 'W'];
  const ProductCD = productCodes[Math.floor(Math.random() * productCodes.length)];
  
  // Generate card number with format XXXX-XXXX-XXXX-XXXX
  const generateCardNumber = () => {
    const parts = [];
    for (let i = 0; i < 4; i++) {
      parts.push(Math.floor(1000 + Math.random() * 9000));
    }
    return parts.join('-');
  };
  
  // Generate card expiry date in MM/YY format (1-5 years in the future)
  const generateCardExpiry = () => {
    const now = new Date();
    const month = Math.floor(Math.random() * 12) + 1;
    const year = now.getFullYear() + Math.floor(Math.random() * 5) + 1;
    return `${month.toString().padStart(2, '0')}/${(year % 100).toString()}`;
  };
  
  // Generate CVV (3 digits)
  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };
  
  // Generate IP address
  const generateIPAddress = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };
  
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
    ip_address: generateIPAddress(),
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    login_time: new Date().toISOString(),
    account_age_days: Math.floor(Math.random() * 1000) + 1
  };
  
  // Create transaction data that matches the ManualInput.jsx schema
  const manualInputCompatibleData = {
    // Transaction Details
    TransactionAmount: amount,
    ProductCategory: productCategories[Math.floor(Math.random() * productCategories.length)],
    Currency: currencies[Math.floor(Math.random() * currencies.length)],
    PaymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    
    // Card Information
    CardNumber: generateCardNumber(),
    CardType: cardTypes[Math.floor(Math.random() * cardTypes.length)],
    CardIssuer: cardIssuers[Math.floor(Math.random() * cardIssuers.length)],
    CardCountry: countries[Math.floor(Math.random() * countries.length)],
    CardCVV: generateCVV(),
    CardExpiry: generateCardExpiry(),
    
    // Billing Information
    BillingAddress: `${Math.floor(Math.random() * 9000) + 1000} Main St`,
    BillingZIP: `${Math.floor(Math.random() * 90000) + 10000}`,
    BillingCity: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    BillingState: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
    BillingCountry: 'United States',
    
    // Device Information
    DeviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
    DeviceOS: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
    Browser: browsers[Math.floor(Math.random() * browsers.length)],
    ScreenResolution: ['1920x1080', '1366x768', '2560x1440', '3840x2160'][Math.floor(Math.random() * 4)],
    
    // User Information
    UserEmail: userEmail,
    UserAccountAgeDays: Math.floor(Math.random() * 1000),
    
    // Transaction History
    TransactionsLast1Hr: Math.floor(Math.random() * 5),
    TransactionsLast24Hr: Math.floor(Math.random() * 20),
    AvgTransactionAmount: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    TimeSinceLastTransaction: Math.floor(Math.random() * 86400), // seconds in a day
    
    // Merchant Information
    MerchantID: `MERCH_${Math.floor(Math.random() * 900000) + 100000}`,
    MerchantCategory: merchantCategories[Math.floor(Math.random() * merchantCategories.length)],
    MerchantCountry: countries[Math.floor(Math.random() * countries.length)],
    IsHighRiskMerchant: Math.random() > 0.8,
    
    // Risk Indicators
    IPAddress: generateIPAddress(),
    IPCountry: countries[Math.floor(Math.random() * countries.length)],
    DistanceFromHome: Math.floor(Math.random() * 10000),
    IPIsProxy: Math.random() > 0.9,
    IsNewDevice: Math.random() > 0.7,
    IsEmailGeneric: randomEmailDomain === 'gmail.com' || randomEmailDomain === 'yahoo.com',
    AmountDeviationFromAvg: parseFloat((Math.random() * 4 - 2).toFixed(2)),
    IsHoliday: Math.random() > 0.9,
    
    // System fields
    TransactionDateTime: TransactionDateTime,
    TransactionID: TransactionID,
    UserID: UserID
  };
  
  return {
    // Keep the original format for backward compatibility
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
    metadata,
    // Add the new format that matches ManualInput.jsx
    manual_input_data: manualInputCompatibleData
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
      
      // Send transaction data to fraud detection API using the same endpoint as ManualInput.jsx
      const response = await axios.post('http://localhost:8000/api/transactions', transactionData.manual_input_data);
      
      // Add timestamp and transaction info to result
      const resultWithInfo = {
        ...response.data,
        timestamp: new Date().toISOString(),
        transaction_amount: transactionData.manual_input_data.TransactionAmount,
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
      setError(err.response?.data?.message || 'An error occurred while processing the transaction');
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