import express from "express";
import { prisma } from "../db.js";
import { fetchAndStoreData } from "../fetchData.js";
const router = express.Router();

// Get all unique states
router.get("/states", async (req, res) => {
  try {
    const result = await prisma.mgnregaData.findMany({
      distinct: ['state'],
      select: { state: true },
      orderBy: { state: 'asc' }
    });
    res.json(result.map(r => r.state));
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
      distinct: ['district'],
      select: { district: true },
      orderBy: { district: 'asc' }
    });
    res.json(result.map(r => r.district));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all districts
router.get("/districts", async (req, res) => {
  try {
    const result = await prisma.mgnregaData.findMany({
      distinct: ['district'],
      select: { district: true },
      orderBy: { district: 'asc' }
    });
    res.json(result.map(r => r.district));
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
      orderBy: { month: 'desc' },
      take: 12
    });
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
      orderBy: { month: 'desc' }
    });
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
    const uniqueStates = new Set(data.map(d => d.state)).size;
    const uniqueDistricts = new Set(data.map(d => d.district)).size;
    const totalHouseholds = data.reduce((sum, d) => sum + d.households, 0);
    const totalWorkdays = data.reduce((sum, d) => sum + d.workdays, 0);
    const totalWages = data.reduce((sum, d) => sum + parseFloat(d.wages.toString()), 0);

    res.json({
      total_states: uniqueStates,
      total_districts: uniqueDistricts,
      total_households: totalHouseholds,
      total_workdays: totalWorkdays,
      total_wages: totalWages
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
    res.status(500).json({ error: "Failed to fetch MGNREGA data", details: err.message });
  }
});

// Add sample data for testing
router.post("/seed", async (req, res) => {
  try {
    const sampleData = [
      { state: "Bihar", district: "Gaya", month: "2024-01", households: 12000, workdays: 45000, wages: 6750000 },
      { state: "Bihar", district: "Gaya", month: "2024-02", households: 11500, workdays: 43000, wages: 6450000 },
      { state: "Bihar", district: "Gaya", month: "2024-03", households: 13000, workdays: 48000, wages: 7200000 },
      { state: "Bihar", district: "Patna", month: "2024-01", households: 15000, workdays: 52000, wages: 7800000 },
      { state: "Bihar", district: "Patna", month: "2024-02", households: 14500, workdays: 50000, wages: 7500000 },
      { state: "Bihar", district: "Patna", month: "2024-03", households: 16000, workdays: 55000, wages: 8250000 },
      { state: "Bihar", district: "Nalanda", month: "2024-01", households: 10000, workdays: 38000, wages: 5700000 },
      { state: "Bihar", district: "Nalanda", month: "2024-02", households: 9500, workdays: 36000, wages: 5400000 },
      { state: "Bihar", district: "Nalanda", month: "2024-03", households: 11000, workdays: 40000, wages: 6000000 },
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
        create: {
          state: row.state,
          district: row.district,
          month: row.month,
          households: row.households,
          workdays: row.workdays,
          wages: row.wages
        }
      });
    }

    res.json({ message: "Sample data seeded successfully", count: sampleData.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

export default router;
