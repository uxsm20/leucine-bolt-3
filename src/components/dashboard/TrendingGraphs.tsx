import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  timeRange: '7d' | '30d' | '90d';
  selectedArea?: string;
  activityStatus?: 'production-ongoing' | 'idle';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
  onAreaChange?: (area: string) => void;
  onActivityStatusChange?: (status: 'production-ongoing' | 'idle' | '') => void;
}

export const TrendingGraphs: React.FC<Props> = ({ 
  timeRange, 
  selectedArea,
  activityStatus,
  onTimeRangeChange = () => {},
  onAreaChange = () => {},
  onActivityStatusChange = () => {}
}) => {
  useEffect(() => {
    // Ensure Chart.js is properly initialized
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
  }, []);

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Filling Room',
        data: [2, 5, 3, 7, 4, 6, 3],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Material Airlock',
        data: [3, 4, 2, 5, 3, 4, 2],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: ['Filling Room', 'Material Airlock', 'Compounding Room'],
    datasets: [
      {
        label: 'Average CFU Count',
        data: [4, 3, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 1
      }
    ]
  };

  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'CFU Count Trend'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'CFU Count'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Area-wise CFU Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average CFU Count'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">CFU Count Trends</h3>
          <div className="flex space-x-2">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value as '7d' | '30d' | '90d')}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
            >
              <option value="">All Areas</option>
              <option value="filling">Filling Room</option>
              <option value="material">Material Airlock</option>
              <option value="compounding">Compounding Room</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={activityStatus}
              onChange={(e) => onActivityStatusChange(e.target.value as 'production-ongoing' | 'idle' | '')}
            >
              <option value="">All Activities</option>
              <option value="production-ongoing">Production</option>
              <option value="idle">Idle</option>
            </select>
          </div>
        </div>
        <div className="h-[300px] relative">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Area-wise Comparison</h3>
        <div className="h-[300px] relative">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};