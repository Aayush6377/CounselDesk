# CounselDesk Frontend (Client & Lawyer Interface)

This directory contains the complete **React** frontend for the CounselDesk platform.  
It is a modern Single-Page Application (SPA) built with **Vite**, providing interfaces for clients, lawyers, and administrators.

---

## Features

- **Multi-Role Dashboards:** Secure dashboards for Users, Lawyers, and Admins.
- **Lawyer Discovery:** Advanced search, filtering, and pagination for finding lawyers.
- **Appointment Booking:** Interactive calendar and time slot selection for end-to-end bookings.
- **Secure Payments:** Stripe Checkout integration for appointments and subscriptions.
- **Stripe Connect Onboarding:** Lawyers can securely connect banks for payouts.
- **Video Conferencing:** Embedded Jitsi meetings for live consultations.
- **Legal Q&A Platform:** Forum for asking, answering, voting, and marking "best answer."
- **AI-Powered Tools:** "AI Legal Code Explorer" using Gemini API for legal text summaries.
- **Admin Panels:** Manage users, verify lawyers, and view platform analytics.

---

## Tech Stack

| Category            | Technology                |
|---------------------|--------------------------|
| **Framework**       | React 18 (Hooks)         |
| **Build Tool**      | Vite                     |
| **Styling**         | Tailwind CSS             |
| **Routing**         | React Router v7          |
| **State Management**| React Context (useStore) |
| **Data Fetching**   | React Query              |
| **HTTP Client**     | Axios                    |
| **Payments**        | Stripe.js / React Stripe |
| **Notifications**   | React Toastify           |

---

## Project Structure
```bash
/frontend
|-- /public             # Static assets
|-- /src
|   |-- /assets         # Images, fonts, and data files
|   |-- /components     # Reusable components (e.Example: Modal, Loader, CustomSelect)
|   |-- /context        # Global state (useStore)
|   |-- /hooks          # Custom React hooks
|   |-- /layouts        # Main page layouts (User, Lawyer, Admin)
|   |-- /pages          # Top-level page components for each route
|   |-- /services       # API functions (Axios instances, service files)
|   |-- /utils          # Helper functions (formatDate, validators, etc.)
|   |-- App.jsx         # Main router setup
|   |-- index.css       # Global styles & Tailwind imports
|   |-- main.jsx        # React DOM entry point
|-- .env                # Environment variables (MUST BE CREATED)
|-- package.json        # Project dependencies
|-- vercel.json         # Vercel deployment configuration
|-- vite.config.js    # Vite project configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18.x or v20.x recommended)
- A running instance of the CounselDesk Backend (`http://localhost:3000`)

---

### Installation & Setup

**1. Navigate to the frontend directory**
```bash
cd CounselDesk/frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Add environment variables**

Create a file named `.env` in the frontend directory and add:
```bash
# The URL of your local backend server
VITE_BACKEND_URL="http://localhost:3000"

# Your Google Gemini API Key for the AI summary feature
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: Vite requires all environment variables to be prefixed with `VITE_` for browser accessibility.)*

**4. Run the development server**
```bash
npm run dev
```


The server will start on [http://localhost:5173](http://localhost:5173).

---

## Deployment

This application is configured for deployment on **Vercel**.

- Import the project into Vercel and set the Root Directory to `frontend`.
- Vercel will auto-detect the Vite framework and apply appropriate build settings.
- Add your environment variables (`VITE_BACKEND_URL`, `VITE_GEMINI_API_KEY`) in the Vercel project settings.  
  Use your deployed backend's URL for `VITE_BACKEND_URL`.

---




