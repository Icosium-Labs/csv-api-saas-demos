# CSV Gateway Demo - Student Exam Scores Dashboard

This is a demonstration application showcasing the capabilities of **CSV Gateway** - a SaaS platform that transforms CSV files into production-ready REST APIs.

## 🎯 Demo Purpose

This demo illustrates how CSV Gateway can be used to build a real-world application that:
- Displays data from a CSV file in an interactive table
- Provides search and filtering capabilities
- Implements pagination for large datasets
- Visualizes data relationships through charts
- Demonstrates API integration patterns

## 📊 Features Demonstrated

### 1. Data Table with Full CRUD Operations
- **Pagination**: Navigate through 200 student records with configurable page sizes (5, 10, 20, 50 per page)
- **Search**: Real-time search across all fields
- **Sorting**: Click column headers to sort by any field (ascending/descending)
- **Color-coded scores**: Visual indicators for performance levels
  - Green: Score ≥ 35 (Excellent)
  - Yellow: Score 25-34 (Good)
  - Red: Score < 25 (Needs Improvement)

### 2. Data Visualizations

#### Chart 1: Exam Score vs Attendance Percentage
- **Type**: Scatter plot
- **Purpose**: Shows the correlation between student attendance and exam performance
- **Insight**: Higher attendance generally correlates with better exam scores
- **API Endpoint**: Uses the base data endpoint to fetch all records

#### Chart 2: Study & Sleep Impact
- **Type**: Scatter plot with color-coded bubbles
- **Purpose**: Displays average scores grouped by hours studied and hours slept
- **Color Coding**:
  - Green bubbles: High average scores (≥35)
  - Yellow bubbles: Medium scores (30-34)
  - Red bubbles: Low scores (<30)
- **Insight**: Reveals the combined impact of study time and sleep on performance
- **API Endpoint**: Uses aggregation endpoint to group and average data

### 3. CSV Gateway API Integration

The demo simulates the following CSV Gateway API endpoints:

```typescript
// GET /api/data - List all records with pagination
GET /api/data?page=1&pageSize=10&search=query&sortBy=exam_score&sortOrder=desc

// GET /api/data/:id - Get single record
GET /api/data/S001

// GET /api/search - Search records
GET /api/search?q=searchterm

// GET /api/aggregate - Aggregate data
GET /api/aggregate?field=exam_score&operations=avg,min,max,count
```

## 🗂️ Data Structure

The demo uses `student_exam_scores.csv` with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | auto-generated unique Identifier |
| `student_id` | string | Unique student identifier (S001-S200) |
| `hours_studied` | number | Hours spent studying |
| `sleep_hours` | number | Hours of sleep per night |
| `attendance_percent` | number | Class attendance percentage |
| `previous_scores` | number | Previous exam scores |
| `exam_score` | number | Current exam score |

**Total Records**: 200 students

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Recharts**: Data visualization library
- **Wouter**: Lightweight routing

### Mock API Layer
The demo includes a complete mock API (`client/src/lib/api.ts`) that simulates CSV Gateway's REST API:

```typescript
class CSVGatewayAPI {
  // Simulates CSV Gateway endpoints
  async getRecords(params) { /* pagination, search, sort */ }
  async getRecord(id) { /* single record */ }
  async aggregate(params) { /* aggregations */ }
  async search(query) { /* full-text search with pagination */ }
  async getChartData() { /* visualization data */ }
}
```

### File Structure
```
client/
  src/
    pages/
      Dashboard.tsx          # Main dashboard page
    components/
      ScoreVsAttendanceChart.tsx    # Chart 1
      StudySleepScatterChart.tsx    # Chart 2
      ui/                    # shadcn/ui components
    lib/
      api.ts                 # Mock CSV Gateway API
  public/
    student_exam_scores.csv  # Source data
```

## 🚀 Running the Demo

### Prerequisites
- Node.js 18+ installed
- pnpm package manager

### Installation
```bash
cd csv-gateway-demo
pnpm install
```

### Development
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the dashboard.

### Build for Production
```bash
pnpm build
```

## 💡 Use Case Scenario

### Problem
A university wants to analyze student performance data to identify factors affecting exam scores. They have CSV exports from their student information system but no easy way to:
- Browse and search student records
- Visualize relationships between variables
- Share insights with faculty and administrators

### Solution with CSV Gateway

1. **Upload CSV**: Upload `student_exam_scores.csv` to CSV Gateway
2. **Get Instant API**: CSV Gateway generates a REST API with:
   - CRUD endpoints for all operations
   - Built-in pagination and filtering
   - Search capabilities
   - Aggregation functions
   - Authentication and API keys
3. **Build Dashboard**: Create this dashboard (or any application) that consumes the API
4. **Share & Collaborate**: Share the dashboard URL with stakeholders

### Benefits
- **No Backend Development**: CSV Gateway handles all API infrastructure
- **Instant Deployment**: API is live in seconds
- **Scalable**: Handles growing datasets automatically
- **Secure**: Built-in authentication and API key management
- **Cost-Effective**: Serverless architecture means you only pay for what you use

## 🎨 Design Features

### Professional UI/UX
- Clean, modern design with gradient backgrounds
- Responsive layout (mobile, tablet, desktop)
- Interactive elements with hover states
- Color-coded data for quick insights
- Loading states and error handling
- Smooth transitions and animations

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast text for readability

## 📈 Insights from the Demo Data

Based on the 200 student records:

1. **Attendance Matters**: Students with >80% attendance tend to score higher
2. **Study-Sleep Balance**: Optimal performance occurs with 6-10 hours of study AND 7-9 hours of sleep
3. **Previous Performance**: Past scores are a strong predictor of current performance
4. **Diminishing Returns**: Studying >10 hours doesn't guarantee higher scores without adequate sleep

## 🔗 CSV Gateway Features Demonstrated

✅ **Data Table Display**: Browse all records with clean UI  
✅ **Pagination**: Handle large datasets efficiently  
✅ **Search**: Find records quickly  
✅ **Sorting**: Order data by any field  
✅ **Filtering**: (Implicit through search)  
✅ **Aggregation**: Calculate averages, min, max, etc.  
✅ **Data Visualization**: Build charts from API data  
✅ **Responsive Design**: Works on all devices  

## 🎯 Next Steps

To use this demo with a real CSV Gateway API:

1. Sign up at [csvgateway.app](https://csvgateway.app)
2. Upload your `student_exam_scores.csv` file
3. Get your API endpoint and API key
4. Update `client/src/lib/api.ts` to use the real API:

```typescript
const API_BASE_URL = 'https://api.csvgateway.app/v1/your-api-id';
const API_KEY = 'your-api-key';

// Replace mock implementation with real fetch calls
async getRecords(params) {
  const response = await fetch(`${API_BASE_URL}/data?${queryString}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  return response.json();
}
```

## 📝 License

This demo is provided as-is for demonstration purposes. Feel free to use it as a starting point for your own CSV Gateway applications.

## 🤝 Support

For questions about CSV Gateway:
- Website: [csvgateway.app](https://csvgateway.app)
- Documentation: [docs.csvgateway.app](https://docs.csvgateway.app)
- Support: support@csvgateway.app

---

**Built with CSV Gateway** - Transform your CSV files into production-ready REST APIs instantly.

