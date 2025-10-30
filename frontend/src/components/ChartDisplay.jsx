// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line, Bar } from 'react-chartjs-2';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function ChartDisplay({ data, district }) {
//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         <p>No data available for the selected district.</p>
//       </div>
//     );
//   }

//   // Sort data by month (newest first, then reverse for display)
//   const sortedData = [...data].sort((a, b) => b.month.localeCompare(a.month)).reverse();
  
//   const months = sortedData.map((d) => d.month);
//   const wages = sortedData.map((d) => parseFloat(d.wages));
//   const households = sortedData.map((d) => d.households);
//   const workdays = sortedData.map((d) => d.workdays);

//   const wagesChartData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Wages Paid (₹)',
//         data: wages,
//         borderColor: 'rgb(34, 197, 94)',
//         backgroundColor: 'rgba(34, 197, 94, 0.1)',
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   };

//   const householdsChartData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Households Employed',
//         data: households,
//         backgroundColor: 'rgba(59, 130, 246, 0.7)',
//         borderColor: 'rgb(59, 130, 246)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const workdaysChartData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Total Workdays',
//         data: workdays,
//         backgroundColor: 'rgba(168, 85, 247, 0.7)',
//         borderColor: 'rgb(168, 85, 247)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-6 text-gray-800">
//         MGNREGA Data for {district}
//       </h2>

//       <div className="space-y-8">
//         {/* Wages Chart */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3 text-green-700">
//             Monthly Wages Paid Trend
//           </h3>
//           <div className="h-64">
//             <Line data={wagesChartData} options={chartOptions} />
//           </div>
//         </div>

//         {/* Households Chart */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3 text-blue-700">
//             Households Employed (Monthly)
//           </h3>
//           <div className="h-64">
//             <Bar data={householdsChartData} options={chartOptions} />
//           </div>
//         </div>

//         {/* Workdays Chart */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3 text-purple-700">
//             Total Workdays (Monthly)
//           </h3>
//           <div className="h-64">
//             <Bar data={workdaysChartData} options={chartOptions} />
//           </div>
//         </div>

//         {/* Data Table */}
//         <div className="mt-8">
//           <h3 className="text-lg font-semibold mb-3 text-gray-700">Detailed Data</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Month
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Households
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Workdays
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Wages (₹)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {sortedData.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {row.month}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {row.households.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {row.workdays.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ₹{parseFloat(row.wages).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// new code

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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

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
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500 text-lg">
          No data available for the selected district.
        </p>
      </div>
    );
  }

  // Sort data by month chronologically (assuming format like "Jan 2023"; adjust parsing if needed for accuracy)
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(
      a.month.split(" ")[1] +
        "-" +
        getMonthNumber(a.month.split(" ")[0]) +
        "-01"
    );
    const dateB = new Date(
      b.month.split(" ")[1] +
        "-" +
        getMonthNumber(b.month.split(" ")[0]) +
        "-01"
    );
    return dateA - dateB;
  });

  const months = sortedData.map((d) => d.month);
  const wages = sortedData.map((d) => parseFloat(d.wages));
  const households = sortedData.map((d) => d.households);
  const workdays = sortedData.map((d) => d.workdays);

  // Helper function to get month number (e.g., 'Jan' -> 1)
  function getMonthNumber(monthStr) {
    const months = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    return months[monthStr] || 1;
  }

  const wagesChartData = {
    labels: months,
    datasets: [
      {
        label: "Wages Paid (₹)",
        data: wages,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const householdsChartData = {
    labels: months,
    datasets: [
      {
        label: "Households Employed",
        data: households,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const workdaysChartData = {
    labels: months,
    datasets: [
      {
        label: "Total Workdays",
        data: workdays,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value) {
            if (this.chart.data.datasets[0].label.includes("₹")) {
              return "₹" + value.toLocaleString();
            }
            return value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            MGNREGA Data for {district}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Insights on employment, workdays, and wages over time
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Wages Chart */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Monthly Wages Paid Trend
            </h3>
            <div className="h-80 rounded-lg overflow-hidden bg-white shadow-sm">
              <Line data={wagesChartData} options={chartOptions} />
            </div>
          </div>

          {/* Households Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Households Employed (Monthly)
            </h3>
            <div className="h-80 rounded-lg overflow-hidden bg-white shadow-sm">
              <Bar data={householdsChartData} options={chartOptions} />
            </div>
          </div>

          {/* Workdays Chart */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-purple-800 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Total Workdays (Monthly)
            </h3>
            <div className="h-80 rounded-lg overflow-hidden bg-white shadow-sm">
              <Bar data={workdaysChartData} options={chartOptions} />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Detailed Data
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Households
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Workdays
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Wages (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors duration-150 even:bg-gray-25"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {row.households.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {row.workdays.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
    </div>
  );
}