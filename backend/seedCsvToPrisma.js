import fs from "fs";
import path from "path";
import { prisma } from "./db.js";

// Use a safe path that works even when the workspace path contains spaces
const CSV_PATH = path.resolve(process.cwd(), "govproject dataset.csv");

const monthMap = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function parseMonth(finYear, monthStr) {
  if (!monthStr) return null;
  const m = monthStr.trim().slice(0, 3).toLowerCase();
  const monthNum = monthMap[m];
  if (!monthNum) return null;
  // fiscal year like "2024-2025" -> startYear = 2024
  const startYear =
    parseInt(finYear?.split("-")?.[0]) || new Date().getFullYear();
  // months Apr(4) .. Dec(12) belong to startYear, Jan-Mar to startYear+1
  const year = monthNum >= 4 ? startYear : startYear + 1;
  return `${year}-${String(monthNum).padStart(2, "0")}`;
}

function toNumber(v) {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export async function seedFromCsv(filePath = CSV_PATH) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`CSV file not found at ${fullPath}`);
  }

  const text = fs.readFileSync(fullPath, "utf8");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV appears to be empty");
  }

  const header = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1);

  let count = 0;
  for (const line of rows) {
    // simple split; expects no embedded commas inside fields
    const cols = line.split(",");
    if (cols.length < header.length) continue;

    const row = {};
    for (let i = 0; i < header.length; i++) {
      row[header[i]] = cols[i] !== undefined ? cols[i].trim() : "";
    }

    const fin_year = row["fin_year"];
    const monthRaw = row["month"];
    const month =
      parseMonth(fin_year, monthRaw) || `${new Date().getFullYear()}-01`;

    const state = row["state_name"] || row["state"] || "Unknown";
    const district = row["district_name"] || row["district"] || "Unknown";

    const households = toNumber(
      row["Total_Households_Worked"] ||
        row["Total_Households_Worked"] ||
        row["Total_No_of_HHs_completed_100_Days_of_Wage_Employment"] ||
        row["Total_No_of_HHs_completed_100_Days_of_Wage_Employment"]
    );
    const workdays = toNumber(
      row["Persondays_of_Central_Liability_so_far"] ||
        row["Total_Exp"] ||
        row["Persondays_of_Central_Liability_so_far"]
    );
    const wages = toNumber(row["Wages"] || row["wages"] || row["Wages"]);

    try {
      await prisma.mgnregaData.upsert({
        where: { state_district_month: { state, district, month } },
        update: {
          households: Math.round(households),
          workdays: Math.round(workdays),
          wages: String(wages),
        },
        create: {
          state,
          district,
          month,
          households: Math.round(households),
          workdays: Math.round(workdays),
          wages: String(wages),
        },
      });
      count++;
    } catch (err) {
      console.error(
        "Failed to upsert row:",
        state,
        district,
        month,
        err.message
      );
    }
  }

  return { imported: count };
}

if (process.argv[1] && process.argv[1].endsWith("seedCsvToPrisma.js")) {
  // allow running the script directly
  seedFromCsv()
    .then((r) => {
      console.log("CSV seed completed:", r);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
