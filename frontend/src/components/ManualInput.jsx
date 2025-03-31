import React, { useState } from 'react';
import { analyzeTransaction } from '../services/api';

export default function ManualInput({ onAnalysisComplete }) {
  const [formData, setFormData] = useState({
    TransactionAmount: '',
    AvgTransactionAmount: '',
    AmountDeviationFromAvg: '',
    TransactionsLast1Hr: '',
    TransactionsLast24Hr: '',
    TimeSinceLastTransaction: '',
    DistanceFromHome: '',
    UserAccountAgeDays: '',
    PaymentMethod: 'CreditCard',
    CardType: 'Visa',
    CardIssuer: '',
    CardCountry: 'US',
    MerchantCategory: 'Groceries',
    MerchantCountry: 'US',
    DeviceType: 'Desktop',
    DeviceOS: 'Windows',
    Browser: 'Chrome',
    IsHighRiskMerchant: false,
    IPIsProxy: false,
    IsNewDevice: false,
    IsEmailGeneric: false,
    IsHoliday: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const numericFields = {
        TransactionAmount: parseFloat(formData.TransactionAmount),
        AvgTransactionAmount: parseFloat(formData.AvgTransactionAmount),
        AmountDeviationFromAvg: parseFloat(formData.AmountDeviationFromAvg),
        TransactionsLast1Hr: parseInt(formData.TransactionsLast1Hr),
        TransactionsLast24Hr: parseInt(formData.TransactionsLast24Hr),
        TimeSinceLastTransaction: parseFloat(formData.TimeSinceLastTransaction),
        DistanceFromHome: parseFloat(formData.DistanceFromHome),
        UserAccountAgeDays: parseInt(formData.UserAccountAgeDays)
      };

      const response = await analyzeTransaction({ ...formData, ...numericFields });
      onAnalysisComplete(response);
    } catch (err) {
      setError('Failed to analyze transaction. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="manual-input-form">
      {/* Form fields would be implemented here */}
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Transaction'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}