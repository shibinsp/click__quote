import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ data }) => {
  const formatTooltip = (value, name) => {
    const formattedValue = `££{(value / 1000)?.toFixed(0)}K`;
    return [formattedValue, name === 'revenue' ? 'Actual Revenue' : 'Target Revenue'];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Revenue Trends
        </h3>
        <p className="text-sm text-muted-foreground">
          Monthly revenue performance vs targets
        </p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickFormatter={(value) => `££{(value / 1000)?.toFixed(0)}K`}
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
            <Bar
              dataKey="target"
              fill="#F1F5F9"
              stroke="#E2E8F0"
              strokeWidth={1}
              name="Target Revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="revenue"
              fill="#E53E3E"
              name="Actual Revenue"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;