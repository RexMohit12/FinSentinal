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
  CardContent
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
    TransactionAmt: '',
    ProductCD: 'H',
    card1: '',
    card2: '',
    card3: '',
    card5: '',
    addr1: '',
    dist1: '',
    C1: '',
    C2: '',
    D1: '',
    D15: '',
    V95: '',
    V96: '',
    V97: '',
    V126: '',
    V127: '',
    TransactionDT: Math.floor(Date.now() / 1000),
    P_emaildomain: ''
  });

  // Transaction sequence state
  const [transactionSequence, setTransactionSequence] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  // Transaction text state
  const [transactionText, setTransactionText] = useState('');

  // Network data state
  const [networkData, setNetworkData] = useState({
    nodes: {
      user: {
        transaction_count: 1,
        total_amount: 0,
        risk_score: 0.5,
        age: 30,
        is_business: 0
      },
      recipient: {
        transaction_count: 1,
        total_amount: 0,
        risk_score: 0.5,
        age: 365,
        is_business: 1
      },
      bank: {
        transaction_count: 1000,
        total_amount: 1000000,
        risk_score: 0.3,
        age: 3650,
        is_business: 1
      }
    },
    edges: [
      {
        source: 'user',
        target: 'bank',
        amount: 0,
        timestamp: Math.floor(Date.now() / 1000),
        frequency: 1,
        is_international: 0
      },
      {
        source: 'bank',
        target: 'recipient',
        amount: 0,
        timestamp: Math.floor(Date.now() / 1000) + 1,
        frequency: 1,
        is_international: 0
      }
    ]
  });

  // Metadata state
  const [metadata, setMetadata] = useState({
    user_id: 'user_' + Math.floor(Math.random() * 1000),
    device_fingerprint: 'device_' + Math.floor(Math.random() * 1000),
    ip_address: '192.168.1.1',
    browser: 'Chrome',
    login_time: new Date().toISOString(),
    account_age_days: 30
  });

  // Handle transaction data change
  const handleTransactionDataChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: name === 'TransactionAmt' ? parseFloat(value) || '' : value
    }));

    // Update network data edges with the transaction amount
    if (name === 'TransactionAmt') {
      const amount = parseFloat(value) || 0;
      setNetworkData(prev => ({
        ...prev,
        edges: prev.edges.map(edge => ({
          ...edge,
          amount: amount
        }))
      }));
    }
  };

  // Handle transaction sequence change
  const handleSequenceChange = (index, position, value) => {
    const newSequence = [...transactionSequence];
    newSequence[index][position] = parseFloat(value) || 0;
    setTransactionSequence(newSequence);
  };

  // Handle network data change
  const handleNetworkDataChange = (nodeId, field, value) => {
    setNetworkData(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          [field]: field === 'is_business' ? parseInt(value) : parseFloat(value) || 0
        }
      }
    }));
  };

  // Handle edge data change
  const handleEdgeChange = (index, field, value) => {
    setNetworkData(prev => ({
      ...prev,
      edges: prev.edges.map((edge, i) => {
        if (i === index) {
          return {
            ...edge,
            [field]: field === 'is_international' ? parseInt(value) : value
          };
        }
        return edge;
      })
    }));
  };

  // Handle metadata change
  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: name === 'account_age_days' ? parseInt(value) || 0 : value
    }));
  };

  // Steps for the stepper
  const steps = ['Transaction Details', 'Additional Information', 'Review & Submit'];

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
      // Update transaction amount in network data
      const updatedNetworkData = {
        ...networkData,
        edges: networkData.edges.map(edge => ({
          ...edge,
          amount: transactionData.TransactionAmt
        }))
      };

      // Prepare request payload
      const payload = {
        transaction_data: transactionData,
        transaction_sequence: transactionSequence,
        transaction_text: transactionText,
        network_data: updatedNetworkData,
        metadata: metadata
      };

      // Send request to API
      const response = await axios.post('/api/detect-fraud', payload);
      
      // Add timestamp to result
      const resultWithTimestamp = {
        ...response.data,
        timestamp: new Date().toISOString(),
        transaction_amount: transactionData.TransactionAmt,
        transaction_text: transactionText
      };

      // Add result to results list
      addResult(resultWithTimestamp);
      
      // Navigate to results page
      navigate('/results');
    } catch (err) {
      console.error('Error submitting transaction:', err);
      setError(err.response?.data?.detail || 'An error occurred while processing the transaction');
    } finally {
      setLoading(false);
    }
  };

  // Render transaction data form
  const renderTransactionDataForm = () => (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Transaction Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Transaction Amount"
            name="TransactionAmt"
            value={transactionData.TransactionAmt}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Product Code"
            name="ProductCD"
            value={transactionData.ProductCD}
            onChange={handleTransactionDataChange}
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="H">High Value</MenuItem>
            <MenuItem value="C">Credit</MenuItem>
            <MenuItem value="S">Standard</MenuItem>
            <MenuItem value="R">Recurring</MenuItem>
            <MenuItem value="W">Withdrawal</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Card ID 1"
            name="card1"
            value={transactionData.card1}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Card ID 2"
            name="card2"
            value={transactionData.card2}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Card ID 3"
            name="card3"
            value={transactionData.card3}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Card ID 5"
            name="card5"
            value={transactionData.card5}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address ID"
            name="addr1"
            value={transactionData.addr1}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Distance"
            name="dist1"
            value={transactionData.dist1}
            onChange={handleTransactionDataChange}
            type="number"
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Domain"
            name="P_emaildomain"
            value={transactionData.P_emaildomain}
            onChange={handleTransactionDataChange}
            variant="outlined"
            margin="normal"
            placeholder="example.com"
          />
        </Grid>
      </Grid>
    </>
  );

  // Render additional information form
  const renderAdditionalInfoForm = () => (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Transaction Description
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Transaction Description"
        value={transactionText}
        onChange={(e) => setTransactionText(e.target.value)}
        variant="outlined"
        margin="normal"
        placeholder="Describe the transaction (e.g., 'International wire transfer to XYZ Holdings')"
      />

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Transaction Sequence (Previous Transactions)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter details of the 5 most recent transactions (amount and other attributes)
      </Typography>
      
      {transactionSequence.map((seq, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={`Transaction ${index + 1} Amount`}
              value={seq[0]}
              onChange={(e) => handleSequenceChange(index, 0, e.target.value)}
              type="number"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4].map((pos) => (
                <TextField
                  key={pos}
                  label={`Attr ${pos}`}
                  value={seq[pos]}
                  onChange={(e) => handleSequenceChange(index, pos, e.target.value)}
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ width: '23%' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      ))}
    </>
  );

  // Render review and submit form
  const renderReviewForm = () => (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Review Transaction Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Data
              </Typography>
              <Typography variant="body1">
                Amount: ${transactionData.TransactionAmt}
              </Typography>
              <Typography variant="body1">
                Product: {transactionData.ProductCD}
              </Typography>
              <Typography variant="body1">
                Email Domain: {transactionData.P_emaildomain}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Description
              </Typography>
              <Typography variant="body1">
                {transactionText || 'No description provided'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            background: 'linear-gradient(90deg, #4caf50, #2196f3)',
            '&:hover': {
              background: 'linear-gradient(90deg, #087f23, #0069c0)'
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit for Analysis'}
        </Button>
      </Box>
    </>
  );

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
          Manual Transaction Input
        </Typography>
        <Typography variant="body1">
          Enter transaction details manually to analyze for potential fraud.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} sx={{ pt: 2, pb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 3 }} />

        {activeStep === 0 && renderTransactionDataForm()}
        {activeStep === 1 && renderAdditionalInfoForm()}
        {activeStep === 2 && renderReviewForm()}

        {activeStep !== 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Back
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
              sx={{
                background: 'linear-gradient(90deg, #4caf50, #2196f3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #087f23, #0069c0)'
                }
              }}
            >
              Next
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ManualInput;