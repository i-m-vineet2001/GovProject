# MGNREGA Dashboard Project

A full-stack web application to fetch and visualize MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data for Bihar state from the Government of India's Open Data API.

## Project Structure

```
govProject/
├── backend/              # Node.js Express backend
│   ├── server.js        # Main server file
│   ├── db.js            # Database configuration
│   ├── fetchData.js     # MGNREGA API data fetcher
│   └── routes/
│       └── dataRoutes.js # API endpoints
├── frontend/            # React frontend with Vite
│   └── src/
│       ├── App.jsx      # Main app component
│       ├── pages/
│       │   └── Home.jsx # Home page with filters
│       └── components/
│           ├── ChartDisplay.jsx    # Data visualization
│           └── MgnregaFetcher.jsx  # API fetch button
├── prisma/
│   └── schema.prisma    # Database schema
└── .env                 # Environment variables
```

## Features

- **Fetch MGNREGA Data**: Retrieve real-time data from Government API for Bihar (FY 2024-2025)
- **Data Visualization**: Interactive charts showing:
  - Monthly wages paid trends
  - Households employed statistics
  - Total workdays generated
- **State & District Filters**: Select specific regions to view data
- **Summary Statistics**: Overview of total states, districts, households, workdays, and wages
- **Automatic Fallback**: Uses sample data when API is unavailable

## Tech Stack

### Backend
- Node.js with Express
- Prisma ORM with PostgreSQL
- node-fetch for API calls
- node-cron for scheduled data fetching

### Frontend
- React 19
- Vite for build tooling
- Axios for HTTP requests
- Chart.js & react-chartjs-2 for data visualization
- Tailwind CSS for styling (implied from classes)

## API Endpoint

The application fetches data from:
```
https://api.data.gov.in/resource/03d0a6e5-2c2f-4d46-b0b9-57bdb823e0a5
```

**Query Parameters:**
- `api-key`: 579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
- `format`: json
- `limit`: 100
- `filters[state_name]`: Bihar
- `filters[fin_year]`: 2024-2025

**Expected Fields:**
- `state_name`: Name of the state
- `district_name`: Name of the district
- `month`: Month of data
- `households_completed`: Number of households employed
- `total_persondays_generated`: Total workdays
- `total_wages_paid_in_lakhs`: Wages paid in lakhs (₹)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

```bash
# Generate Prisma client
cd ../
npx prisma generate

# Run database migrations
npx prisma db push
```

### 3. Environment Variables

The `.env` file should contain your database URL:
```
DATABASE_URL="your_database_connection_string"
```

### 4. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
node server.js
```
Backend will run on `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173` (or as shown in terminal)

## Usage

1. **Access the Dashboard**: Open your browser to the frontend URL (typically `http://localhost:5173`)

2. **Fetch Data**: Click the "Fetch Data" button to retrieve the latest MGNREGA data from the government API

3. **View Data**: 
   - Select a state from the dropdown (currently Bihar)
   - Select a district to view detailed performance metrics
   - Explore interactive charts and data tables

4. **Scheduled Updates**: The backend automatically fetches new data daily at midnight (configured via cron job)

## API Endpoints

### Backend API Routes (localhost:3001/api)

- `GET /states` - Get list of all states
- `GET /districts` - Get list of all districts
- `GET /districts/:state` - Get districts for a specific state
- `GET /district/:name` - Get data for a specific district
- `GET /data/:state/:district` - Get data for specific state and district
- `GET /summary` - Get summary statistics
- `POST /fetch-mgnrega` - Manually trigger data fetch from government API
- `POST /seed` - Seed sample data for testing

## Database Schema

```prisma
model MgnregaData {
  state      String
  district   String
  month      String
  households Int
  workdays   Int
  wages      Decimal

  @@id([state, district, month])
  @@map("mgnrega_data")
}
```

## Troubleshooting

### API Returns Error
The government API endpoint may return "Meta not found" error. In this case, the application automatically falls back to sample data to demonstrate functionality.

### Database Connection Issues
Ensure your PostgreSQL database is running and the DATABASE_URL in `.env` is correct.

### CORS Issues
The backend is configured with CORS enabled. Ensure both frontend and backend are running on their respective ports.

## Development Notes

- The API key is included in the code for demonstration purposes. In production, store it securely in environment variables.
- The cron job runs daily at midnight to fetch fresh data automatically.
- Sample data represents realistic MGNREGA statistics for Bihar districts.

## Future Enhancements

- Add more states and districts
- Implement date range filters
- Add export functionality (CSV, PDF)
- Create comparison views between districts
- Add authentication and user management
- Implement data caching for better performance

## License

This project is for educational purposes to demonstrate full-stack development with government open data APIs.
