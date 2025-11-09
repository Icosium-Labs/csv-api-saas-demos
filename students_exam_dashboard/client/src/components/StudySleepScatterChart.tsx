import { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { api } from '@/lib/api';

export default function StudySleepScatterChart() {
  const [data, setData] = useState<{ hoursStudied: number; hoursSleep: number; avgScore: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chartData = await api.getChartData();
        setData(chartData.avgScoreByStudyAndSleep);
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

  // Color scale based on average score
  const getColor = (score: number) => {
    if (score >= 35) return '#10b981'; // green
    if (score >= 30) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          type="number"
          dataKey="hoursStudied"
          name="Hours Studied"
          label={{ value: 'Hours Studied', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="hoursSleep"
          name="Hours Sleep"
          label={{ value: 'Hours Sleep', angle: -90, position: 'insideLeft' }}
        />
        <ZAxis
          type="number"
          dataKey="avgScore"
          range={[50, 400]}
          name="Avg Score"
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold text-slate-700">
                    Study: {data.hoursStudied}h | Sleep: {data.hoursSleep}h
                  </p>
                  <p className="text-sm font-semibold text-purple-600">
                    Avg Score: {data.avgScore.toFixed(1)}
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
        <Scatter name="Average Score" data={data}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.avgScore)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

