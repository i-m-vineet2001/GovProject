import fetch from "node-fetch";
import { prisma } from "./db.js";

const MGNREGA_API_URL = "https://api.data.gov.in/resource/03d0a6e5-2c2f-4d46-b0b9-57bdb823e0a5";
const API_KEY = "579b464db66ec23bdd000001d94f5e4c569141fb6b0391b269f769b4";

export async function fetchAndStoreData() {
  try {
    console.log("Fetching MGNREGA data for all states...");
    
    // Define the states to fetch
    const states = [
      "Bihar", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "West Bengal",
      "Maharashtra", "Andhra Pradesh", "Tamil Nadu", "Karnataka", "Gujarat",
      "Odisha", "Jharkhand", "Chhattisgarh", "Assam", "Punjab"
    ];
    
    let totalRecords = 0;
    
    // Fetch data for each state
    for (const state of states) {
      try {
        console.log(`Fetching data for ${state}...`);
        const url = `${MGNREGA_API_URL}?api-key=${API_KEY}&format=json&limit=500&filters[state_name]=${encodeURIComponent(state)}&filters[fin_year]=2024-2025`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "error" || !data.records || data.records.length === 0) {
          console.log(`No records found for ${state}`);
          continue;
        }

        console.log(`Found ${data.records.length} records for ${state}`);

        // Process and store the fetched data
        for (const row of data.records) {
          await prisma.mgnregaData.upsert({
            where: {
              state_district_month: {
                state: row.state_name || state,
                district: row.district_name || "Unknown",
                month: row.month || new Date().toISOString().slice(0, 7)
              }
            },
            update: {
              households: parseInt(row.households_completed || 0),
              workdays: parseInt(row.total_persondays_generated || 0),
              wages: parseFloat(row.total_wages_paid_in_lakhs || 0) * 100000
            },
            create: {
              state: row.state_name || state,
              district: row.district_name || "Unknown",
              month: row.month || new Date().toISOString().slice(0, 7),
              households: parseInt(row.households_completed || 0),
              workdays: parseInt(row.total_persondays_generated || 0),
              wages: parseFloat(row.total_wages_paid_in_lakhs || 0) * 100000
            }
          });
        }
        
        totalRecords += data.records.length;
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (stateErr) {
        console.error(`Error fetching data for ${state}:`, stateErr.message);
      }
    }
    
    if (totalRecords === 0) {
      console.log("No records fetched from API. Using sample data instead.");
      await seedSampleData();
    } else {
      console.log(`Successfully stored ${totalRecords} total records across all states.`);
    }
  } catch (err) {
    console.error("Error fetching data:", err.message);
    console.log("Seeding sample data as fallback...");
    await seedSampleData();
  }
}

// Seed sample data when API is unavailable
async function seedSampleData() {
  const sampleData = [
    // Bihar
    {
      state: "Bihar",
      district: "Gaya",
      month: "2024-04",
      households: 12000,
      workdays: 45000,
      wages: 6750000,
    },
    {
      state: "Bihar",
      district: "Gaya",
      month: "2024-05",
      households: 11500,
      workdays: 43000,
      wages: 6450000,
    },
    {
      state: "Bihar",
      district: "Patna",
      month: "2024-04",
      households: 15000,
      workdays: 52000,
      wages: 7800000,
    },
    {
      state: "Bihar",
      district: "Patna",
      month: "2024-05",
      households: 14500,
      workdays: 50000,
      wages: 7500000,
    },
    {
      state: "Bihar",
      district: "Nalanda",
      month: "2024-04",
      households: 10000,
      workdays: 38000,
      wages: 5700000,
    },
    {
      state: "Bihar",
      district: "Muzaffarpur",
      month: "2024-04",
      households: 13500,
      workdays: 50000,
      wages: 7500000,
    },

    // Uttar Pradesh
    {
      state: "Uttar Pradesh",
      district: "Lucknow",
      month: "2024-04",
      households: 18000,
      workdays: 65000,
      wages: 9750000,
    },
    {
      state: "Uttar Pradesh",
      district: "Lucknow",
      month: "2024-05",
      households: 17500,
      workdays: 63000,
      wages: 9450000,
    },
    {
      state: "Uttar Pradesh",
      district: "Varanasi",
      month: "2024-04",
      households: 16000,
      workdays: 58000,
      wages: 8700000,
    },
    {
      state: "Uttar Pradesh",
      district: "Kanpur",
      month: "2024-04",
      households: 14000,
      workdays: 52000,
      wages: 7800000,
    },
    {
      state: "Uttar Pradesh",
      district: "Agra",
      month: "2024-04",
      households: 13000,
      workdays: 48000,
      wages: 7200000,
    },

    // Madhya Pradesh
    {
      state: "Madhya Pradesh",
      district: "Bhopal",
      month: "2024-04",
      households: 11000,
      workdays: 42000,
      wages: 6300000,
    },
    {
      state: "Madhya Pradesh",
      district: "Indore",
      month: "2024-04",
      households: 12500,
      workdays: 46000,
      wages: 6900000,
    },
    {
      state: "Madhya Pradesh",
      district: "Jabalpur",
      month: "2024-04",
      households: 10500,
      workdays: 40000,
      wages: 6000000,
    },
    {
      state: "Madhya Pradesh",
      district: "Gwalior",
      month: "2024-04",
      households: 9800,
      workdays: 38000,
      wages: 5700000,
    },

    // Rajasthan
    {
      state: "Rajasthan",
      district: "Jaipur",
      month: "2024-04",
      households: 14500,
      workdays: 54000,
      wages: 8100000,
    },
    {
      state: "Rajasthan",
      district: "Jodhpur",
      month: "2024-04",
      households: 13200,
      workdays: 50000,
      wages: 7500000,
    },
    {
      state: "Rajasthan",
      district: "Udaipur",
      month: "2024-04",
      households: 12000,
      workdays: 46000,
      wages: 6900000,
    },
    {
      state: "Rajasthan",
      district: "Kota",
      month: "2024-04",
      households: 10800,
      workdays: 42000,
      wages: 6300000,
    },

    // West Bengal
    {
      state: "West Bengal",
      district: "Kolkata",
      month: "2024-04",
      households: 16500,
      workdays: 60000,
      wages: 9000000,
    },
    {
      state: "West Bengal",
      district: "Howrah",
      month: "2024-04",
      households: 15200,
      workdays: 56000,
      wages: 8400000,
    },
    {
      state: "West Bengal",
      district: "Darjeeling",
      month: "2024-04",
      households: 11000,
      workdays: 42000,
      wages: 6300000,
    },

    // Maharashtra
    {
      state: "Maharashtra",
      district: "Mumbai",
      month: "2024-04",
      households: 19000,
      workdays: 70000,
      wages: 10500000,
    },
    {
      state: "Maharashtra",
      district: "Pune",
      month: "2024-04",
      households: 17500,
      workdays: 65000,
      wages: 9750000,
    },
    {
      state: "Maharashtra",
      district: "Nagpur",
      month: "2024-04",
      households: 14000,
      workdays: 52000,
      wages: 7800000,
    },

    // Tamil Nadu
    {
      state: "Tamil Nadu",
      district: "Chennai",
      month: "2024-04",
      households: 18500,
      workdays: 68000,
      wages: 10200000,
    },
    {
      state: "Tamil Nadu",
      district: "Coimbatore",
      month: "2024-04",
      households: 15500,
      workdays: 58000,
      wages: 8700000,
    },
    {
      state: "Tamil Nadu",
      district: "Madurai",
      month: "2024-04",
      households: 13500,
      workdays: 51000,
      wages: 7650000,
    },

    // Karnataka
    {
      state: "Karnataka",
      district: "Bangalore",
      month: "2024-04",
      households: 17000,
      workdays: 62000,
      wages: 9300000,
    },
    {
      state: "Karnataka",
      district: "Mysore",
      month: "2024-04",
      households: 13000,
      workdays: 49000,
      wages: 7350000,
    },
    {
      state: "Karnataka",
      district: "Mangalore",
      month: "2024-04",
      households: 11500,
      workdays: 44000,
      wages: 6600000,
    },

    // Kerala
    {
      state: "Kerala",
      district: "Thiruvananthapuram",
      month: "2024-04",
      households: 14500,
      workdays: 55000,
      wages: 8250000,
    },
    {
      state: "Kerala",
      district: "Kochi",
      month: "2024-04",
      households: 13700,
      workdays: 51000,
      wages: 7650000,
    },
    {
      state: "Kerala",
      district: "Kozhikode",
      month: "2024-04",
      households: 12000,
      workdays: 46000,
      wages: 6900000,
    },

    // Gujarat
    {
      state: "Gujarat",
      district: "Ahmedabad",
      month: "2024-04",
      households: 15500,
      workdays: 58000,
      wages: 8700000,
    },
    {
      state: "Gujarat",
      district: "Surat",
      month: "2024-04",
      households: 13500,
      workdays: 51000,
      wages: 7650000,
    },
    {
      state: "Gujarat",
      district: "Rajkot",
      month: "2024-04",
      households: 12000,
      workdays: 47000,
      wages: 7050000,
    },

    // Punjab
    {
      state: "Punjab",
      district: "Ludhiana",
      month: "2024-04",
      households: 14000,
      workdays: 51000,
      wages: 7650000,
    },
    {
      state: "Punjab",
      district: "Amritsar",
      month: "2024-04",
      households: 12500,
      workdays: 47000,
      wages: 7050000,
    },
    {
      state: "Punjab",
      district: "Jalandhar",
      month: "2024-04",
      households: 11000,
      workdays: 43000,
      wages: 6450000,
    },

    // Haryana
    {
      state: "Haryana",
      district: "Faridabad",
      month: "2024-04",
      households: 12700,
      workdays: 48000,
      wages: 7200000,
    },
    {
      state: "Haryana",
      district: "Gurugram",
      month: "2024-04",
      households: 13400,
      workdays: 51000,
      wages: 7650000,
    },
    {
      state: "Haryana",
      district: "Rohtak",
      month: "2024-04",
      households: 11600,
      workdays: 43000,
      wages: 6450000,
    },

    // Telangana
    {
      state: "Telangana",
      district: "Hyderabad",
      month: "2024-04",
      households: 16500,
      workdays: 60000,
      wages: 9000000,
    },
    {
      state: "Telangana",
      district: "Warangal",
      month: "2024-04",
      households: 12500,
      workdays: 47000,
      wages: 7050000,
    },

    // Andhra Pradesh
    {
      state: "Andhra Pradesh",
      district: "Visakhapatnam",
      month: "2024-04",
      households: 14000,
      workdays: 52000,
      wages: 7800000,
    },
    {
      state: "Andhra Pradesh",
      district: "Vijayawada",
      month: "2024-04",
      households: 12000,
      workdays: 47000,
      wages: 7050000,
    },
  ];

  for (const row of sampleData) {
    await prisma.mgnregaData.upsert({
      where: {
        state_district_month: {
          state: row.state,
          district: row.district,
          month: row.month
        }
      },
      update: {
        households: row.households,
        workdays: row.workdays,
        wages: row.wages
      },
      create: row
    });
  }
  
  console.log("Sample data seeded successfully.");
}
