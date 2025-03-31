import React, { useState } from 'react';
import ManualInput from './components/ManualInput';
import Results from './components/Results';
import './index.css';

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="app-container">
      <h1>FinSentinel Fraud Detection Dashboard</h1>
      <div className="content-wrapper">
        <div className="input-section">
          <ManualInput onAnalysisComplete={setAnalysis} />
        </div>
        <div className="results-section">
          <Results analysis={analysis} />
        </div>
      </div>
    </div>
  );
}