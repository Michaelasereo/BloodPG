import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatDateShort } from '../../utils/dateUtils';
import './TrendsChart.css';

const TrendsChart = ({ records }) => {
  // Transform records data for chart
  const chartData = records.map(record => ({
    date: formatDateShort(record.date),
    'Systolic AM': record.am?.systolic || null,
    'Diastolic AM': record.am?.diastolic || null,
    'Systolic PM': record.pm?.systolic || null,
    'Diastolic PM': record.pm?.diastolic || null,
  }));

  return (
    <div className="trends-chart">
      <div className="trends-chart-container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Systolic AM"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="Diastolic AM"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="Systolic PM"
                stroke="#ffc658"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="Diastolic PM"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="trends-chart-empty">
            <p>No data available. Start tracking your blood pressure to see trends.</p>
          </div>
        )}
      </div>
      <div className="trends-chart-footer">
        <h3 className="trends-chart-title">
          <span>📈</span>
          Trends
        </h3>
      </div>
    </div>
  );
};

export default TrendsChart;

