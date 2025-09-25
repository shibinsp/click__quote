import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const GeographicalChart = ({ data }) => {
  const formatTooltip = (value, name) => {
    if (name === 'revenue') {
      return [`£${(value / 1000)?.toFixed(0)}K`, 'Revenue'];
    }
    if (name === 'conversion') {
      return [`${value}%`, 'Conversion Rate'];
    }
    return [value, 'Quotations'];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Geographical Performance
        </h3>
        <p className="text-sm text-muted-foreground">
          Quotation density and performance by zip code areas
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="zipcode" 
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
              tickFormatter={(value) => `${value}%`}
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
              yAxisId="left"
              dataKey="quotations"
              fill="#E53E3E"
              name="Quotations"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="#FF6B35"
              name="Revenue (£K)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="conversion"
              fill="#FF8C42"
              name="Conversion Rate (%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GeographicalChart;