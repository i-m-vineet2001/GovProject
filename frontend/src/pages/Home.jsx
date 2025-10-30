import { useState, useEffect } from "react";
import axios from "axios";
import ChartDisplay from "../components/ChartDisplay";
import MgnregaFetcher from "../components/MgnregaFetcher";

const API_BASE = "http://localhost:3001/api";

export default function Home() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    axios
      .get(`${API_BASE}/states`)
      .then((res) => {
        setStates(res.data);
        if (res.data.length > 0) {
          setSelectedState(res.data[0]);
        }
      })
      .catch((err) => console.error("Error fetching states:", err));

    // Fetch summary
    axios
      .get(`${API_BASE}/summary`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Error fetching summary:", err));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${API_BASE}/districts/${selectedState}`)
        .then((res) => {
          setDistricts(res.data);
          if (res.data.length > 0) {
            setSelectedDistrict(res.data[0]);
          }
        })
        .catch((err) => console.error("Error fetching districts:", err));
    }
  }, [selectedState]);

  // Fetch data when district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      setLoading(true);
      axios
        .get(`${API_BASE}/data/${selectedState}/${selectedDistrict}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
    }
  }, [selectedState, selectedDistrict]);

  return (
    <div className="bg-yellow-50 max-w-6xl mx-auto">
      {/* MGNREGA Data Fetcher */}
      <MgnregaFetcher />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600">Total States</h3>
            <p className="text-2xl font-bold text-green-700">
              {summary.total_states}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600">Total Districts</h3>
            <p className="text-2xl font-bold text-green-700">
              {summary.total_districts}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600">Total Households</h3>
            <p className="text-2xl font-bold text-blue-700">
              {summary.total_households?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600">Total Workdays</h3>
            <p className="text-2xl font-bold text-purple-700">
              {summary.total_workdays?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600">Total Wages (₹)</h3>
            <p className="text-2xl font-bold text-orange-700">
              {(summary.total_wages / 10000000)?.toFixed(2)}Cr
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select State:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select District:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <ChartDisplay data={data} district={selectedDistrict} />
        )}
      </div>
    </div>
  );
}
