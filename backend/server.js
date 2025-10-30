import express from "express";
import cors from "cors";
import { fetchAndStoreData } from "./fetchData.js";
import cron from "node-cron";
import dataRoutes from "./routes/dataRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", dataRoutes);

// Run daily at midnight
cron.schedule("0 0 * * *", fetchAndStoreData);

app.listen(3001, () => console.log("Server running on port 3001"));
