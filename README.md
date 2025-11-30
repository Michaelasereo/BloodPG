# BloodPG - Blood Pressure Tracker

A Next.js 14 application for tracking blood pressure and glucose levels, built from Figma design specifications.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Server Components** for static content
- **Client Components** for interactive elements

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
bloodpg/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header/            # Header component
│   ├── Sidebar/           # Sidebar with forms
│   ├── MainContent/       # Main content area
│   └── MainTabs/          # Main tab navigation
├── lib/                   # Utility functions
│   ├── mockData.ts       # Mock data service
│   └── dateUtils.ts      # Date utility functions
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types
└── public/               # Static assets
```

## Features

- Blood pressure tracking with AM/PM readings
- Medication management
- Records table with filtering
- Trends visualization
- Date range selection
- Theme toggle (light/dark mode)

## Design

The application is built to match the Figma design exactly, including:
- Exact spacing and sizing
- Color palette
- Typography (Helvetica Neue)
- Component layouts
- Interactive states

## Development

The project uses:
- **Server Components** by default for better performance
- **Client Components** (`'use client'`) only when needed for interactivity
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom configuration matching Figma specs
# BloodPG
