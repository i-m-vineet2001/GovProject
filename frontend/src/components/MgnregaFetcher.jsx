// import { useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:3001/api";

// export default function MgnregaFetcher() {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleFetchData = async () => {
//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await axios.post(`${API_BASE}/fetch-mgnrega`);
//       setMessage(response.data.message || "Data fetched successfully!");
      
//       // Reload the page after 2 seconds to show new data
//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to fetch data");
//       console.error("Error fetching MGNREGA data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-md mb-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">
//             Fetch Latest MGNREGA Data
//           </h2>
//           <p className="text-sm text-gray-600">
//             Click to fetch the latest MGNREGA performance data from the government API for all states (FY 2024-2025)
//           </p>
//         </div>
//         <button
//           onClick={handleFetchData}
//           disabled={loading}
//           className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
//           }`}
//         >
//           {loading ? "Fetching..." : "Fetch Data"}
//         </button>
//       </div>
      
//       {message && (
//         <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//           ✓ {message}
//         </div>
//       )}
      
//       {error && (
//         <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//           ✗ {error}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001/api";

export default function MgnregaFetcher() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await axios.post(`${API_BASE}/fetch-mgnrega`);
      setMessage(response.data.message || "Data fetched successfully!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data");
      console.error("Error fetching MGNREGA data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-md mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Fetch Latest MGNREGA Data
          </h2>
          <p className="text-sm text-gray-600">
            Click to fetch the newest data for all states (FY 2024-2025)
          </p>
        </div>
        <button
          onClick={handleFetchData}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Fetching...
            </>
          ) : (
            "Fetch Data"
          )}
        </button>
      </div>
      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ✗ {error}
        </div>
      )}
    </div>
  );
}
