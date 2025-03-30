import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  FormControlLabel,
  Switch
} from '@mui/material';
import axios from 'axios';

const ManualInput = ({ addResult }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Transaction data state
  const [transactionData, setTransactionData] = useState({
    TransactionAmount: '',
    ProductCategory: 'Electronics',
    Currency: 'USD',
    PaymentMethod: 'Credit Card',
    
    // Card Information
    CardNumber: '',
    CardType: 'Visa',
    CardIssuer: 'Chase',
    CardCountry: 'US',
    CardCVV: '',
    CardExpiry: '',
    
    // Billing Information
    BillingAddress: '',
    BillingZIP: '',
    BillingCity: '',
    BillingState: '',
    BillingCountry: 'US',
    
    // Device Information
    DeviceType: 'Desktop',
    DeviceOS: 'Windows',
    Browser: 'Chrome',
    ScreenResolution: '1920x1080',
    
    // User Information
    UserEmail: '',
    UserAccountAgeDays: 0,
    
    // Transaction History
    TransactionsLast1Hr: 0,
    TransactionsLast24Hr: 0,
    AvgTransactionAmount: 0,
    TimeSinceLastTransaction: 0,
    
    // Merchant Information
    MerchantID: '',
    MerchantCategory: 'Retail',
    MerchantCountry: 'US',
    IsHighRiskMerchant: false,
    
    // Risk Indicators
    IPAddress: '',
    IPCountry: 'US',
    DistanceFromHome: 0,
    IPIsProxy: false,
    IsNewDevice: false,
    IsEmailGeneric: false,
    AmountDeviationFromAvg: 0,
    IsHoliday: false
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Steps for the stepper
  const steps = [
    'Transaction Details',
    'Card Information',
    'Billing Details',
    'Device & User Info',
    'Review & Submit'
  ];

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/transactions', {
        ...transactionData,
        TransactionDateTime: new Date().toISOString(),
        TransactionID: Math.floor(Math.random() * 90000000) + 10000000,
        UserID: `USER_${Math.floor(Math.random() * 900000) + 100000}`
      });

      addResult(response.data);
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the transaction');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transaction Amount"
                name="TransactionAmount"
                type="number"
                value={transactionData.TransactionAmount}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Currency"
                name="Currency"
                value={transactionData.Currency}
                onChange={handleChange}
              >
                {['USD', 'EUR', 'GBP', 'JPY', 'CAD'].map((currency) => (
                  <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Product Category"
                name="ProductCategory"
                value={transactionData.ProductCategory}
                onChange={handleChange}
              >
                {['Electronics', 'Clothing', 'Food', 'Travel', 'Entertainment'].map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                name="PaymentMethod"
                value={transactionData.PaymentMethod}
                onChange={handleChange}
              >
                {['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'].map((method) => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Card Number"
                name="CardNumber"
                value={transactionData.CardNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Card Type"
                name="CardType"
                value={transactionData.CardType}
                onChange={handleChange}
              >
                {['Visa', 'MasterCard', 'American Express', 'Discover'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CVV"
                name="CardCVV"
                type="number"
                value={transactionData.CardCVV}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Expiry (MM/YY)"
                name="CardExpiry"
                value={transactionData.CardExpiry}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Card Country"
                name="CardCountry"
                value={transactionData.CardCountry}
                onChange={handleChange}
              >
                {['US', 'UK', 'CA', 'DE', 'FR'].map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Billing Address"
                name="BillingAddress"
                value={transactionData.BillingAddress}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="BillingZIP"
                value={transactionData.BillingZIP}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="BillingCity"
                value={transactionData.BillingCity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                name="BillingState"
                value={transactionData.BillingState}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Country"
                name="BillingCountry"
                value={transactionData.BillingCountry}
                onChange={handleChange}
              >
                {['US', 'UK', 'CA', 'DE', 'FR'].map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Device Type"
                name="DeviceType"
                value={transactionData.DeviceType}
                onChange={handleChange}
              >
                {['Mobile', 'Desktop', 'Tablet'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Operating System"
                name="DeviceOS"
                value={transactionData.DeviceOS}
                onChange={handleChange}
              >
                {['iOS', 'Android', 'Windows', 'macOS', 'Linux'].map((os) => (
                  <MenuItem key={os} value={os}>{os}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="UserEmail"
                type="email"
                value={transactionData.UserEmail}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IP Address"
                name="IPAddress"
                value={transactionData.IPAddress}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={transactionData.IsNewDevice}
                    onChange={handleChange}
                    name="IsNewDevice"
                  />
                }
                label="New Device"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={transactionData.IPIsProxy}
                    onChange={handleChange}
                    name="IPIsProxy"
                  />
                }
                label="IP is Proxy"
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Transaction Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Amount:</Typography>
                      <Typography>{transactionData.TransactionAmount} {transactionData.Currency}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Payment Method:</Typography>
                      <Typography>{transactionData.PaymentMethod}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Card Number:</Typography>
                      <Typography>{transactionData.CardNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Billing Address:</Typography>
                      <Typography>{transactionData.BillingAddress}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Manual Transaction Input</Typography>
        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManualInput;