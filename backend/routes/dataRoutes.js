import express from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../db.js";
import { fetchAndStoreData } from "../fetchData.js";
import { seedFromCsv } from "../seedCsvToPrisma.js";
const router = express.Router();

// CSV fallback helper: parse the provided CSV file into rows the API can use
const CSV_PATH = path.join(process.cwd(), "backend", "govproject dataset.csv");

function finMonthToIso(finYear, monthStr) {
  // finYear like "2024-2025", monthStr like "Dec" or "July" or numeric-like
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    July: 7,
    Aug: 8,
    Sep: 9,
    Sept: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  // fallback: try numeric
  let m = months[monthStr] || Number(monthStr);
  if (!m || Number.isNaN(m)) return null;
  const [start, end] = finYear.split("-");
  const startYear = Number(start);
  // fiscal year Apr-Dec -> start year, Jan-Mar -> end year
  const year = m >= 4 && m <= 12 ? startYear : startYear + 1;
  return `${year}-${String(m).padStart(2, "0")}`;
}

async function parseCsvRows() {
  try {
    const text = await fs.promises.readFile(CSV_PATH, "utf8");
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headerLine = lines.shift();
    const headers = headerLine.split(",").map((h) => h.trim());
    const rows = lines.map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const obj = {};
      headers.forEach((h, i) => (obj[h] = cols[i] || ""));
      // Map to our internal shape
      const fin_year = obj["fin_year"] || obj["finYear"] || "";
      const monthRaw = obj["month"] || obj["Month"] || "";
      const month = finMonthToIso(fin_year, monthRaw) || monthRaw;
      const state =
        obj["state_name"] ||
        obj["state"] ||
        obj["state_name\r"] ||
        obj["state_name\n"] ||
        obj["state_name "] ||
        "";
      const district = obj["district_name"] || obj["district"] || "";
      const households =
        Number(
          obj["Total_Households_Worked"] ||
            obj["Total_Households_Worked\r"] ||
            obj["Total_Individuals_Worked"] ||
            0
        ) || 0;
      const workdays =
        Number(
          obj["Persondays_of_Central_Liability_so_far"] ||
            obj["Persondays_of_Central_Liability_so_far\r"] ||
            obj["Persondays_of_Central_Liability_so_far "] ||
            0
        ) || 0;
      const wages =
        Number(obj["Wages"] || obj["Wages\r"] || obj["Wages "] || 0) || 0;

      return {
        fin_year,
        month,
        state,
        district,
        households,
        workdays,
        wages,
        raw: obj,
      };
    });
    return rows;
  } catch (err) {
    console.error("CSV parse error:", err);
    return [];
  }
}

// Get all unique states
router.get("/states", async (req, res) => {
  try {
    const result = await prisma.mgnregaData.findMany({
      distinct: ["state"],
      select: { state: true },
      orderBy: { state: "asc" },
    });
    if (!result || result.length === 0) {
      const rows = await parseCsvRows();
      const states = Array.from(new Set(rows.map((r) => r.state))).sort();
      return res.json(states);
    }
    res.json(result.map((r) => r.state));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get districts by state
router.get("/districts/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const result = await prisma.mgnregaData.findMany({
      where: { state },
      distinct: ["district"],
      select: { district: true },
      orderBy: { district: "asc" },
    });
    if (!result || result.length === 0) {
      const rows = await parseCsvRows();
      const districts = Array.from(
        new Set(rows.filter((r) => r.state === state).map((r) => r.district))
      ).sort();
      return res.json(districts);
    }
    res.json(result.map((r) => r.district));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all districts
router.get("/districts", async (req, res) => {
  try {
    const result = await prisma.mgnregaData.findMany({
      distinct: ["district"],
      select: { district: true },
      orderBy: { district: "asc" },
    });
    if (!result || result.length === 0) {
      const rows = await parseCsvRows();
      const districts = Array.from(new Set(rows.map((r) => r.district))).sort();
      return res.json(districts);
    }
    res.json(result.map((r) => r.district));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get data by district
router.get("/district/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await prisma.mgnregaData.findMany({
      where: { district: name },
      orderBy: { month: "desc" },
      take: 12,
    });
    if (!result || result.length === 0) {
      const rows = await parseCsvRows();
      const filtered = rows
        .filter((r) => r.district === name)
        .sort((a, b) => (b.month || "").localeCompare(a.month || ""))
        .slice(0, 12);
      return res.json(filtered);
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get data by state and district
router.get("/data/:state/:district", async (req, res) => {
  try {
    const { state, district } = req.params;
    const result = await prisma.mgnregaData.findMany({
      where: { state, district },
      orderBy: { month: "desc" },
    });
    if (!result || result.length === 0) {
      const rows = await parseCsvRows();
      const filtered = rows
        .filter((r) => r.state === state && r.district === district)
        .sort((a, b) => (b.month || "").localeCompare(a.month || ""));
      return res.json(filtered);
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get summary statistics
router.get("/summary", async (req, res) => {
  try {
    const data = await prisma.mgnregaData.findMany();
    if (!data || data.length === 0) {
      const rows = await parseCsvRows();
      const uniqueStates = new Set(rows.map((d) => d.state)).size;
      const uniqueDistricts = new Set(rows.map((d) => d.district)).size;
      const totalHouseholds = rows.reduce(
        (sum, d) => sum + (d.households || 0),
        0
      );
      const totalWorkdays = rows.reduce((sum, d) => sum + (d.workdays || 0), 0);
      const totalWages = rows.reduce((sum, d) => sum + (d.wages || 0), 0);

      return res.json({
        total_states: uniqueStates,
        total_districts: uniqueDistricts,
        total_households: totalHouseholds,
        total_workdays: totalWorkdays,
        total_wages: totalWages,
      });
    }
    const uniqueStates = new Set(data.map((d) => d.state)).size;
    const uniqueDistricts = new Set(data.map((d) => d.district)).size;
    const totalHouseholds = data.reduce((sum, d) => sum + d.households, 0);
    const totalWorkdays = data.reduce((sum, d) => sum + d.workdays, 0);
    const totalWages = data.reduce(
      (sum, d) => sum + parseFloat(d.wages.toString()),
      0
    );

    res.json({
      total_states: uniqueStates,
      total_districts: uniqueDistricts,
      total_households: totalHouseholds,
      total_workdays: totalWorkdays,
      total_wages: totalWages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch and store data from MGNREGA API
router.post("/fetch-mgnrega", async (req, res) => {
  try {
    await fetchAndStoreData();
    res.json({ message: "MGNREGA data fetch initiated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch MGNREGA data", details: err.message });
  }
});

// Add sample data for testing
router.post("/seed", async (req, res) => {
  try {
    const sampleData = [
      {
        state: "Bihar",
        district: "Gaya",
        month: "2024-01",
        households: 12000,
        workdays: 45000,
        wages: 6750000,
      },
      {
        state: "Bihar",
        district: "Gaya",
        month: "2024-02",
        households: 11500,
        workdays: 43000,
        wages: 6450000,
      },
      {
        state: "Bihar",
        district: "Gaya",
        month: "2024-03",
        households: 13000,
        workdays: 48000,
        wages: 7200000,
      },
      {
        state: "Bihar",
        district: "Patna",
        month: "2024-01",
        households: 15000,
        workdays: 52000,
        wages: 7800000,
      },
      {
        state: "Bihar",
        district: "Patna",
        month: "2024-02",
        households: 14500,
        workdays: 50000,
        wages: 7500000,
      },
      {
        state: "Bihar",
        district: "Patna",
        month: "2024-03",
        households: 16000,
        workdays: 55000,
        wages: 8250000,
      },
      {
        state: "Bihar",
        district: "Nalanda",
        month: "2024-01",
        households: 10000,
        workdays: 38000,
        wages: 5700000,
      },
      {
        state: "Bihar",
        district: "Nalanda",
        month: "2024-02",
        households: 9500,
        workdays: 36000,
        wages: 5400000,
      },
      {
        state: "Bihar",
        district: "Nalanda",
        month: "2024-03",
        households: 11000,
        workdays: 40000,
        wages: 6000000,
      },
    ];

    for (const row of sampleData) {
      await prisma.mgnregaData.upsert({
        where: {
          state_district_month: {
            state: row.state,
            district: row.district,
            month: row.month,
          },
        },
        update: {
          households: row.households,
          workdays: row.workdays,
          wages: row.wages,
        },
        create: {
          state: row.state,
          district: row.district,
          month: row.month,
          households: row.households,
          workdays: row.workdays,
          wages: row.wages,
        },
      });
    }

    res.json({
      message: "Sample data seeded successfully",
      count: sampleData.length,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

export default router;

// Seed data from CSV file (large dataset)
router.post("/seed-csv", async (req, res) => {
  try {
    const result = await seedFromCsv();
    res.json({ message: "CSV seed completed", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "CSV seed failed", details: err.message });
  }
});
