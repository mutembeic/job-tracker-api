import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

const JobProgressChart = ({ data = [], dailyTarget }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="text-lg font-semibold mb-2">Daily Job Applications</h4>
      <LineChart width={600} height={300} data={Array.isArray(data) ? data : []}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
        <ReferenceLine y={dailyTarget} label="Target" stroke="red" strokeDasharray="3 3" />
      </LineChart>
    </div>
  );
};

export default JobProgressChart;

