# Mock Project

A frontend mock project for the flows of a wine store interface.

This project uses:

- `React 19`
- `TypeScript`
- `Vite`
- `Tailwind CSS v4`
- `Zustand`
- `react-hook-form`
- `json-server` for mock authentication APIs

## Main Structure

```text
src/
  components/
    auth/
    layout/
    ui/
  hooks/
  pages/
    auth/
    user/
  services/
  store/
  types/
db.json
```

## Installation

```bash
npm install
```

## Run the Project

Run the frontend and mock API together:

```bash
npm run start
```

Run them separately:

```bash
npm run dev
npm run server
```

Default URLs:

- Frontend: `http://localhost:5173`
- JSON Server: `http://localhost:3001`
