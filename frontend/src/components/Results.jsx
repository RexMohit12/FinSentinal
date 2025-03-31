import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Results({ analysis }) {
  if (!analysis) return null;

  const riskData = [
    { name: 'Fraud', value: analysis.fraud_percent, fill: '#ff6b6b' },
    { name: 'Compliance', value: analysis.compliance_percent, fill: '#4ecdc4' },
    { name: 'Anomaly', value: analysis.behavior_anomaly_percent, fill: '#ffe66d' },
  ];

  return (
    <div className="results-container">
      <h2>Risk Analysis Results</h2>
      
      <div className="risk-metrics">
        <div className="radial-chart">
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="20%"
              outerRadius="100%"
              data={riskData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
              />
              <Legend iconSize={10} layout="vertical" align="right" verticalAlign="middle" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="overall-risk">
          <CircularProgressbarWithChildren
            value={analysis.overall_risk}
            styles={{
              path: { stroke: analysis.risk_class === 'High' ? '#ff6b6b' : 
                      analysis.risk_class === 'Medium' ? '#ffe66d' : '#4ecdc4' },
              trail: { stroke: '#eee' }
            }}
          >
            <div className="risk-classification">
              <div className="risk-percent">{analysis.overall_risk}%</div>
              <div className={`risk-class ${analysis.risk_class.toLowerCase()}`}>
                {analysis.risk_class} Risk
              </div>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>

      <div className="metric-breakdown">
        <div className="metric-item fraud">
          <span>Fraud Probability</span>
          <div className="metric-value">{analysis.fraud_percent}%</div>
        </div>
        <div className="metric-item compliance">
          <span>Compliance Risk</span>
          <div className="metric-value">{analysis.compliance_percent}%</div>
        </div>
        <div className="metric-item anomaly">
          <span>Behavior Anomaly</span>
          <div className="metric-value">{analysis.behavior_anomaly_percent}%</div>
        </div>
      </div>
    </div>
  );
}