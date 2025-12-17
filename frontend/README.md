# Database Analysis System - React Frontend

Modern React + Redux SPA frontend for the Database Analysis System.

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Vite** - Build tool & dev server
- **Bootstrap 5** - UI framework
- **Axios** - HTTP client
- **Recharts** - Charting library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will run on `http://localhost:3000` and proxy API requests to Flask backend on port 5000.

### Build for Production

```bash
npm run build
```

This builds the app to `../static/react` directory which can be served by Flask.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── store/          # Redux store and slices
│   ├── services/       # API service layer
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## Features

- ✅ Authentication (Login/Register/Logout)
- ✅ Protected routes with role-based access
- ✅ Admin panel for record management
- ✅ Responsive layout with sidebar navigation
- 🚧 Table analysis & pivot tables
- 🚧 Data visualization & charts
- 🚧 File upload functionality
- 🚧 Advanced filtering

## Development

```bash
# Run dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## Integration with Flask

The Vite dev server proxies `/api` and `/static` requests to Flask backend running on port 5000. 

In production, build the React app and serve it from Flask using a catch-all route.
