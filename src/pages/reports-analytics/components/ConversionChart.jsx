import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ConversionChart = ({ data }) => {
  const formatTooltip = (value, name) => {
    if (name === 'conversion') {
      return [`${value}%`, 'Conversion Rate'];
    }
    return [value, name === 'submitted' ? 'Submitted' : 'Accepted'];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Quotation Conversion Rates
        </h3>
        <p className="text-sm text-muted-foreground">
          Monthly quotation submission and acceptance trends
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#64748B"
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="submitted"
              stroke="#E53E3E"
              strokeWidth={2}
              dot={{ fill: '#E53E3E', strokeWidth: 2, r: 4 }}
              name="Submitted"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="accepted"
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              name="Accepted"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversion"
              stroke="#FF8C42"
              strokeWidth={2}
              dot={{ fill: '#FF8C42', strokeWidth: 2, r: 4 }}
              strokeDasharray="5 5"
              name="Conversion Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionChart;