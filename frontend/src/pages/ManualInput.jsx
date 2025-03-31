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
  Switch,
  FormHelperText
} from '@mui/material';
import axios from 'axios';

// API endpoint for fraud detection
const FRAUD_DETECTION_API = '/api/detect_fraud';

// List of all countries for dropdown menus
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic',
  'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti',
  'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
  'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Currency options
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'RUB', 'MXN', 'SGD', 'HKD'];

// Product categories
const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Travel', 'Entertainment', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Automotive'];

// Payment methods
const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'Cryptocurrency'];

// Card types
const CARD_TYPES = ['Visa', 'MasterCard', 'American Express', 'Discover', 'JCB', 'Diners Club', 'UnionPay'];

const ManualInput = ({ addResult }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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
    CardCountry: 'United States',
    CardCVV: '',
    CardExpiry: '',
    
    // Billing Information
    BillingAddress: '',
    BillingZIP: '',
    BillingCity: '',
    BillingState: '',
    BillingCountry: 'United States',
    
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
    MerchantCountry: 'United States',
    IsHighRiskMerchant: false,
    
    // Risk Indicators
    IPAddress: '',
    IPCountry: 'United States',
    DistanceFromHome: 0,
    IPIsProxy: false,
    IsNewDevice: false,
    IsEmailGeneric: false,
    AmountDeviationFromAvg: 0,
    IsHoliday: false
  });

  // Validation rules
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'TransactionAmount':
        if (!value || isNaN(value) || parseFloat(value) <= 0) {
          error = 'Please enter a valid amount greater than 0';
        }
        break;
        
      case 'CardNumber':
        // Format: XXXX-XXXX-XXXX-XXXX (16 digits with 3 hyphens)
        const cardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        if (!cardNumberRegex.test(value)) {
          error = 'Card number must be in format: XXXX-XXXX-XXXX-XXXX';
        }
        break;
        
      case 'CardCVV':
        // Exactly 3 digits
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(value)) {
          error = 'CVV must be exactly 3 digits';
        }
        break;
        
      case 'CardExpiry':
        // Format: MM/YY
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(value)) {
          error = 'Expiry date must be in format: MM/YY';
        } else {
          // Check if card is not expired
          const [month, year] = value.split('/');
          const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const currentDate = new Date();
          if (expiryDate < currentDate) {
            error = 'Card has expired';
          }
        }
        break;
        
      case 'BillingZIP':
        // ZIP code validation (5-9 digits or 5+4 format)
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
          error = 'Please enter a valid ZIP code';
        }
        break;
        
      case 'UserEmail':
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'IPAddress':
        // Basic IP address validation
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(value)) {
          error = 'Please enter a valid IP address';
        }
        break;
        
      case 'BillingAddress':
      case 'BillingCity':
      case 'BillingState':
      case 'MerchantID':
        if (!value.trim()) {
          error = 'This field is required';
        }
        break;
        
      default:
        // No validation for other fields
        break;
    }
    
    return error;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Update transaction data
    setTransactionData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Validate field and update errors
    const error = validateField(name, newValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  // Format card number with hyphens as user types
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Add hyphens after every 4 digits
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
    if (value.length > 14) {
      value = value.slice(0, 14) + '-' + value.slice(14);
    }
    
    // Limit to 19 characters (16 digits + 3 hyphens)
    value = value.slice(0, 19);
    
    // Update field and validate
    setTransactionData(prev => ({
      ...prev,
      CardNumber: value
    }));
    
    const error = validateField('CardNumber', value);
    setValidationErrors(prev => ({
      ...prev,
      CardNumber: error
    }));
  };

  // Steps for the stepper
  const steps = [
    'Transaction Details',
    'Card Information',
    'Billing Details',
    'Device & User Info',
    'Merchant Information',
    'Review & Submit'
  ];

  // Handle next step
  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepValid = validateCurrentStep();
    
    if (currentStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  // Validate fields in the current step
  const validateCurrentStep = () => {
    let isValid = true;
    const errors = {};
    
    // Determine which fields to validate based on current step
    const fieldsToValidate = [];
    
    switch(activeStep) {
      case 0: // Transaction Details
        fieldsToValidate.push('TransactionAmount', 'Currency', 'ProductCategory', 'PaymentMethod');
        break;
      case 1: // Card Information
        fieldsToValidate.push('CardNumber', 'CardType', 'CardCVV', 'CardExpiry', 'CardCountry');
        break;
      case 2: // Billing Details
        fieldsToValidate.push('BillingAddress', 'BillingZIP', 'BillingCity', 'BillingState', 'BillingCountry');
        break;
      case 3: // Device & User Info
        fieldsToValidate.push('UserEmail', 'IPAddress');
        break;
      case 4: // Merchant Information
        fieldsToValidate.push('MerchantID', 'MerchantCategory', 'MerchantCountry');
        break;
      default:
        break;
    }
    
    // Validate each field
    fieldsToValidate.forEach(field => {
      const error = validateField(field, transactionData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    setValidationErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
  try {
    const response = await axios.post(FRAUD_DETECTION_API, values);
    addResult(response.data);
  } catch (error) {
    console.error('Error submitting transaction:', error);
  }
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
                error={!!validationErrors.TransactionAmount}
                helperText={validationErrors.TransactionAmount}
                inputProps={{ min: 0.01, step: 0.01 }}
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
                error={!!validationErrors.Currency}
                helperText={validationErrors.Currency}
              >
                {CURRENCIES.map((currency) => (
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
                error={!!validationErrors.ProductCategory}
                helperText={validationErrors.ProductCategory}
              >
                {PRODUCT_CATEGORIES.map((category) => (
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
                error={!!validationErrors.PaymentMethod}
                helperText={validationErrors.PaymentMethod}
              >
                {PAYMENT_METHODS.map((method) => (
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
                label="Card Number (XXXX-XXXX-XXXX-XXXX)"
                name="CardNumber"
                value={transactionData.CardNumber}
                onChange={handleCardNumberChange}
                required
                error={!!validationErrors.CardNumber}
                helperText={validationErrors.CardNumber || "Format: XXXX-XXXX-XXXX-XXXX"}
                inputProps={{ maxLength: 19 }}
                placeholder="1234-5678-9012-3456"
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
                error={!!validationErrors.CardType}
                helperText={validationErrors.CardType}
              >
                {CARD_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CVV"
                name="CardCVV"
                type="text"
                value={transactionData.CardCVV}
                onChange={handleChange}
                required
                error={!!validationErrors.CardCVV}
                helperText={validationErrors.CardCVV || "3 digits only"}
                inputProps={{ maxLength: 3, pattern: "[0-9]*" }}
                placeholder="123"
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
                error={!!validationErrors.CardExpiry}
                helperText={validationErrors.CardExpiry || "Format: MM/YY"}
                inputProps={{ maxLength: 5 }}
                placeholder="01/25"
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
                error={!!validationErrors.CardCountry}
                helperText={validationErrors.CardCountry}
              >
                {COUNTRIES.map((country) => (
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
                error={!!validationErrors.BillingAddress}
                helperText={validationErrors.BillingAddress}
                inputProps={{ maxLength: 100 }}
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
                error={!!validationErrors.BillingZIP}
                helperText={validationErrors.BillingZIP || "Format: 12345 or 12345-6789"}
                inputProps={{ maxLength: 10 }}
                placeholder="12345"
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
                error={!!validationErrors.BillingCity}
                helperText={validationErrors.BillingCity}
                inputProps={{ maxLength: 50 }}
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
                error={!!validationErrors.BillingState}
                helperText={validationErrors.BillingState}
                inputProps={{ maxLength: 50 }}
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
                error={!!validationErrors.BillingCountry}
                helperText={validationErrors.BillingCountry}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Typography variant="h6" sx={{ mb: 2, mt: 2, width: '100%', pl: 3 }}>Device Information</Typography>
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
                label="Browser"
                name="Browser"
                value={transactionData.Browser}
                onChange={handleChange}
                select
              >
                {['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'].map((browser) => (
                  <MenuItem key={browser} value={browser}>{browser}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Screen Resolution"
                name="ScreenResolution"
                value={transactionData.ScreenResolution}
                onChange={handleChange}
                placeholder="1920x1080"
              />
            </Grid>
            
            <Typography variant="h6" sx={{ mb: 2, mt: 3, width: '100%', pl: 3 }}>User Information</Typography>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="UserEmail"
                type="email"
                value={transactionData.UserEmail}
                onChange={handleChange}
                required
                error={!!validationErrors.UserEmail}
                helperText={validationErrors.UserEmail || "Format: user@example.com"}
                inputProps={{ maxLength: 100 }}
                placeholder="user@example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Age (Days)"
                name="UserAccountAgeDays"
                type="number"
                value={transactionData.UserAccountAgeDays}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={transactionData.IsEmailGeneric}
                    onChange={handleChange}
                    name="IsEmailGeneric"
                  />
                }
                label="Is Email Generic"
              />
              <FormHelperText>Check if email is from a generic provider</FormHelperText>
            </Grid>
            
            <Typography variant="h6" sx={{ mb: 2, mt: 3, width: '100%', pl: 3 }}>IP Information</Typography>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IP Address"
                name="IPAddress"
                value={transactionData.IPAddress}
                onChange={handleChange}
                required
                error={!!validationErrors.IPAddress}
                helperText={validationErrors.IPAddress || "Format: xxx.xxx.xxx.xxx"}
                inputProps={{ maxLength: 15 }}
                placeholder="192.168.1.1"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="IP Country"
                name="IPCountry"
                value={transactionData.IPCountry}
                onChange={handleChange}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Distance From Home (km)"
                name="DistanceFromHome"
                type="number"
                value={transactionData.DistanceFromHome}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.1 }}
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
                label="IP is Proxy/VPN"
              />
            </Grid>
            
            <Typography variant="h6" sx={{ mb: 2, mt: 3, width: '100%', pl: 3 }}>Transaction History</Typography>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transactions Last 1 Hour"
                name="TransactionsLast1Hr"
                type="number"
                value={transactionData.TransactionsLast1Hr}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transactions Last 24 Hours"
                name="TransactionsLast24Hr"
                type="number"
                value={transactionData.TransactionsLast24Hr}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Average Transaction Amount"
                name="AvgTransactionAmount"
                type="number"
                value={transactionData.AvgTransactionAmount}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time Since Last Transaction (hours)"
                name="TimeSinceLastTransaction"
                type="number"
                value={transactionData.TimeSinceLastTransaction}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount Deviation From Average"
                name="AmountDeviationFromAvg"
                type="number"
                value={transactionData.AmountDeviationFromAvg}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            
            <Typography variant="h6" sx={{ mb: 2, mt: 3, width: '100%', pl: 3 }}>Risk Indicators</Typography>
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
                    checked={transactionData.IsHoliday}
                    onChange={handleChange}
                    name="IsHoliday"
                  />
                }
                label="Is Holiday"
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Typography variant="h6" sx={{ mb: 2, mt: 2, width: '100%', pl: 3 }}>Merchant Information</Typography>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Merchant ID"
                name="MerchantID"
                type="text"
                value={transactionData.MerchantID}
                onChange={handleChange}
                required
                error={!!validationErrors.MerchantID}
                helperText={validationErrors.MerchantID}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Merchant Category"
                name="MerchantCategory"
                value={transactionData.MerchantCategory}
                onChange={handleChange}
              >
                {['Retail', 'Food', 'Travel', 'Entertainment', 'Services', 'Technology', 'Healthcare', 'Education', 'Finance'].map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Merchant Country"
                name="MerchantCountry"
                value={transactionData.MerchantCountry}
                onChange={handleChange}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={transactionData.IsHighRiskMerchant}
                    onChange={handleChange}
                    name="IsHighRiskMerchant"
                  />
                }
                label="High Risk Merchant"
              />
              <FormHelperText>Check if merchant is in a high-risk category</FormHelperText>
            </Grid>
          </Grid>
        );
        
      case 5:
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
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">IP Address:</Typography>
                      <Typography>{transactionData.IPAddress}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Merchant ID:</Typography>
                      <Typography>{transactionData.MerchantID}</Typography>
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