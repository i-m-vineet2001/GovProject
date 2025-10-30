# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Application
```bash
./start.sh
```

Or manually:
```bash
# Terminal 1
cd backend
node server.js

# Terminal 2  
cd frontend
npm run dev
```

### Step 2: Access the Dashboard
Open your browser to: **http://localhost:5173**

### Step 3: Fetch Data
Click the **"Fetch Data"** button to retrieve MGNREGA data!

---

## 📊 What You'll See

### Summary Cards
- Total States
- Total Districts  
- Total Households
- Total Workdays
- Total Wages

### Interactive Charts
1. **Monthly Wages Trend** (Line Chart)
2. **Households Employed** (Bar Chart)
3. **Total Workdays** (Bar Chart)

### Filters
- Select State: Bihar
- Select District: Gaya, Patna, Nalanda, Muzaffarpur

---

## 🔧 Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
node server.js
```

### Frontend not loading?
```bash
cd frontend
npm install
npm run dev
```

### Database issues?
```bash
npx prisma generate
npx prisma db push
```

### Need sample data?
```bash
curl -X POST http://localhost:3001/api/seed
```

---

## 📚 Full Documentation

- **README.md** - Complete setup guide
- **TESTING.md** - Testing instructions
- **PROJECT_SUMMARY.md** - Project overview

---

## ✅ What's Working

✅ Backend API (8 endpoints)  
✅ Frontend Dashboard  
✅ Database Integration  
✅ Government API Integration (with fallback)  
✅ Interactive Charts  
✅ Data Filtering

---

## 🎯 API Endpoint

The app fetches data from:
```
https://api.data.gov.in/resource/03d0a6e5-2c2f-4d46-b0b9-57bdb823e0a5
```

**Query**: Bihar state, Financial Year 2024-2025

**Note**: API currently returns "Meta not found" - app uses sample data as fallback

---

**Need Help?** Check README.md or TESTING.md for detailed guides!
