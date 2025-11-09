import { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '@/lib/api';

export default function ScoreVsAttendanceChart() {
  const [data, setData] = useState<{ attendance: number; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chartData = await api.getChartData();
        setData(chartData.scoreVsAttendance);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          type="number"
          dataKey="attendance"
          name="Attendance %"
          unit="%"
          domain={[0, 100]}
          label={{ value: 'Attendance Percentage', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="score"
          name="Exam Score"
          label={{ value: 'Exam Score', angle: -90, position: 'insideLeft', offset: 10 }}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold text-slate-700">
                    Attendance: {payload[0].value}%
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    Score: {payload[1].value}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{ paddingTop: '20px' }}
        />
        <Scatter
          name="Students"
          data={data}
          fill="#3b82f6"
          fillOpacity={0.6}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

