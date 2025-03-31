export const analyzeTransaction = async (transactionData) => {
  try {
    const response = await fetch('http://localhost:8000/detect_fraud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};