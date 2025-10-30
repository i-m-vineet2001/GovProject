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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
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

export default function ChartDisplay({ data, district }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available for the selected district.</p>
      </div>
    );
  }

  // Sort data by month (newest first, then reverse for display)
  const sortedData = [...data].sort((a, b) => b.month.localeCompare(a.month)).reverse();
  
  const months = sortedData.map((d) => d.month);
  const wages = sortedData.map((d) => parseFloat(d.wages));
  const households = sortedData.map((d) => d.households);
  const workdays = sortedData.map((d) => d.workdays);

  const wagesChartData = {
    labels: months,
    datasets: [
      {
        label: 'Wages Paid (₹)',
        data: wages,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const householdsChartData = {
    labels: months,
    datasets: [
      {
        label: 'Households Employed',
        data: households,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const workdaysChartData = {
    labels: months,
    datasets: [
      {
        label: 'Total Workdays',
        data: workdays,
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        MGNREGA Data for {district}
      </h2>

      <div className="space-y-8">
        {/* Wages Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-700">
            Monthly Wages Paid Trend
          </h3>
          <div className="h-64">
            <Line data={wagesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Households Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-700">
            Households Employed (Monthly)
          </h3>
          <div className="h-64">
            <Bar data={householdsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Workdays Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-purple-700">
            Total Workdays (Monthly)
          </h3>
          <div className="h-64">
            <Bar data={workdaysChartData} options={chartOptions} />
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Detailed Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Households
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workdays
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wages (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.households.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.workdays.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{parseFloat(row.wages).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
