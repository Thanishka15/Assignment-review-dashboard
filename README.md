# Assignment & Review Dashboard

A responsive frontend dashboard for student-assignment management with role-based behavior:

- Students can view only their assigned assignments, track completion, and confirm submission with a two-step verification flow.
- Admins (professors) can create/manage assignments, attach Drive links, and monitor student submission progress through individual progress bars.
- App state is simulated using local data + `localStorage` (no backend).

## Stack

- React (Vite)
- Tailwind CSS
- HTML + CSS (utility-first Tailwind styling)
- React hooks: `useState`, `useEffect`, `useMemo`

## Features

- Role switcher to simulate login as student/admin
- Student-only assignment list and completion percentage
- Two-step submission confirmation:
  - "Yes, I have submitted"
  - Final confirmation before marking as submitted
- Admin assignment creation with:
  - title
  - description
  - due date
  - Drive submission link
- Admin assignment management (delete assignment)
- Admin view of submission status by student with progress bars
- Responsive layout for mobile and desktop
- Persistent state with `localStorage`

## Project Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build production bundle

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Folder Structure Overview

```text
assignment-review-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── Header.jsx
│   │   ├── ProgressBar.jsx
│   │   └── StudentDashboard.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── utils/
│   │   └── storage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Component Structure & Design Decisions

- `App.jsx`
  - Bootstraps mock data into `localStorage`
  - Stores app-level state for users, assignments, submissions, current user
  - Routes UI by role (`student` vs `admin`)
- `Header.jsx`
  - Displays app title and role/user switch control
- `StudentDashboard.jsx`
  - Filters assignments to current student only
  - Shows submission status and completion progress
  - Implements two-step confirmation flow before submission is marked complete
- `AdminDashboard.jsx`
  - Creates assignments with Drive link and metadata
  - Shows student-wise progress bars for assignments created by current admin
  - Provides assignment management actions
- `ProgressBar.jsx`
  - Reusable visual component for completion metrics
- `storage.js`
  - Encapsulates all `localStorage` read/write logic for cleaner component code

## Data Model (Simulated)

- `users`: student/admin user list
- `assignments`: assignment metadata (`createdBy`, `assignedTo`, `driveLink`, etc.)
- `submissions`: flat map using `${assignmentId}_${studentId}` keys to store submission state
- `currentUser`: active role simulation user

## Deployment (Netlify / Vercel)

- Push this project to GitHub
- Import repository in Netlify or Vercel
- Build command: `npm run build`
- Output directory: `dist`

## Notes
- `localStorage` is used to persist progress without any backend service.

