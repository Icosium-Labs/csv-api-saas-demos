# CSV Gateway Demo - Local Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- **pnpm** package manager ([Install guide](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```

## Installation Steps

### 1. Extract the Project

Extract the `csv-gateway-demo.zip` file to your desired location:

```bash
unzip csv-gateway-demo.zip
cd csv-gateway-demo
```

### 2. Install Dependencies

Install all required packages using pnpm:

```bash
pnpm install
```

This will install:
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Recharts for data visualization
- Wouter for routing
- And all other dependencies

### 3. Start the Development Server

Run the development server:

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

### 4. Open in VS Code

Open the project in Visual Studio Code:

```bash
code .
```

## Project Structure

```
csv-gateway-demo/
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   │   └── student_exam_scores.csv  # Demo data
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── AddStudentDialog.tsx
│   │   │   ├── ScoreVsAttendanceChart.tsx
│   │   │   └── StudySleepScatterChart.tsx
│   │   ├── pages/           # Page components
│   │   │   └── Dashboard.tsx
│   │   ├── lib/             # Utilities
│   │   │   └── api.ts       # Mock CSV Gateway API
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── vite.config.ts           # Vite config
├── README_DEMO.md           # Demo documentation
└── SETUP_GUIDE.md           # This file
```

## Available Scripts

### Development
```bash
pnpm dev
```
Starts the development server with hot reload at `http://localhost:3000`

### Build
```bash
pnpm build
```
Creates an optimized production build in the `dist/` folder

### Preview
```bash
pnpm preview
```
Preview the production build locally

### Type Check
```bash
pnpm typecheck
```
Run TypeScript type checking

## Features Included

✅ **Data Table**
- Pagination (5, 10, 20, 50 records per page)
- Search across all fields
- Column sorting (click headers)
- Color-coded exam scores

✅ **CRUD Operations**
- **Create**: "Add Student" button with modal form
- **Read**: Table display with pagination
- **Update**: (Can be extended)
- **Delete**: Delete button with confirmation dialog

✅ **Data Visualizations**
- Scatter plot: Exam Score vs Attendance %
- Scatter plot: Study & Sleep Impact on scores

✅ **Mock API**
- Simulates CSV Gateway REST API endpoints
- GET /api/data (with pagination, search, sort)
- POST /api/data (create record)
- DELETE /api/data/:id (delete record)
- GET /api/aggregate (aggregations)

## Using the Application

### Viewing Data
1. Browse the table with 200 student records
2. Use the search box to find specific students
3. Click column headers to sort
4. Change page size or navigate pages

### Adding a Student
1. Click the "Add Student" button (top right)
2. Fill in all required fields:
   - Hours Studied (0-24)
   - Sleep Hours (0-24)
   - Attendance % (0-100)
   - Previous Score (0-100)
   - Exam Score (0-100)
3. Click "Add Student"
4. The table will refresh with the new record

### Deleting a Student
1. Click the red trash icon in the Actions column
2. Confirm the deletion in the dialog
3. The table will refresh automatically

### Viewing Charts
Scroll down to see two interactive charts:
1. **Exam Score vs Attendance**: Shows correlation between attendance and performance
2. **Study & Sleep Impact**: Color-coded scatter plot showing optimal study/sleep combinations

## Customization

### Connecting to Real CSV Gateway API

To use this with a real CSV Gateway API instead of the mock:

1. Sign up at [csvgateway.app](https://csvgateway.app)
2. Upload your CSV file
3. Get your API endpoint and API key
4. Update `client/src/lib/api.ts`:

```typescript
const API_BASE_URL = 'https://api.csvgateway.app/v1/your-api-id';
const API_KEY = 'your-api-key';

// Replace mock methods with real API calls
async getRecords(params) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/data?${queryString}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  return response.json();
}

async createRecord(record) {
  const response = await fetch(`${API_BASE_URL}/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify(record)
  });
  return response.json();
}

async deleteRecord(id) {
  const response = await fetch(`${API_BASE_URL}/data/${id}`, {
    method: 'DELETE',
    headers: { 'X-API-Key': API_KEY }
  });
  return response.ok;
}
```

### Styling

The project uses Tailwind CSS 4. To customize:

1. **Colors**: Edit `client/src/index.css` (CSS variables)
2. **Components**: Modify files in `client/src/components/ui/`
3. **Layout**: Edit `client/src/pages/Dashboard.tsx`

### Adding More Features

The mock API in `client/src/lib/api.ts` includes an `updateRecord` method that's ready to use. You can add an "Edit" button to implement UPDATE operations.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
pnpm dev --port 3001
```

### Dependencies Issues
If you encounter dependency issues, try:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
Run type checking to see detailed errors:
```bash
pnpm typecheck
```

### Build Errors
Clear the build cache:
```bash
rm -rf dist .vite
pnpm build
```

## VS Code Extensions (Recommended)

For the best development experience, install these VS Code extensions:

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **TypeScript Vue Plugin (Volar)** - Better TypeScript support
5. **Error Lens** - Inline error display

## Tech Stack Details

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Routing**: Wouter
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Support

For questions about:
- **This Demo**: Check `README_DEMO.md`
- **CSV Gateway**: Visit [csvgateway.app](https://csvgateway.app)
- **React**: [react.dev](https://react.dev)
- **Tailwind**: [tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)

## License

This demo is provided as-is for demonstration and educational purposes.

---

**Happy Coding!** 🚀

If you have any questions or need help, feel free to reach out.

