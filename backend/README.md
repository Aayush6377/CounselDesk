# CounselDesk Backend

This directory contains the complete **Node.js**, **Express**, and **MongoDB** backend for the **CounselDesk** platform.  
It handles all business logic, user authentication, data persistence, and secure integrations with third-party services.

This API is built to be **stateless**, **scalable**, and deployed as a **serverless application** on **Vercel**.

---

## Features

- **Authentication:** Secure JWT (access & refresh tokens) with local (email/password) and Google OAuth 2.0.
- **Role-Based Access Control:** Distinct roles (user, lawyer, admin) with protected routes and permissions.
- **Lawyer Management:** Full CRUD for lawyer profiles, including document uploads, verification status, and scheduling.
- **Appointment Booking:** Handles slot generation, booking, and cancellation.
- **Payment Integration:** Stripe Checkout and Stripe Connect for secure transactions, platform fees, and lawyer payouts.
- **Video Conferencing:** Jitsi meeting link generation for one-on-one sessions.
- **Legal Q&A Platform:** APIs for users to ask questions and lawyers to manage answers.
- **Legal Code Explorer:** AI-powered search and summarization for Indian legal codes.
- **Admin Panel:** Endpoints for analytics, verification, and user management.
- **File Storage:** Cloudinary integration for all uploaded files.
- **Scheduled Jobs:** Daily maintenance via cron jobs (node-cron locally, Vercel Cron in production).

---

## Tech Stack

| Category         | Technology                              |
|------------------|------------------------------------------|
| **Framework**    | Node.js, Express.js                      |
| **Database**     | MongoDB (with Mongoose)                  |
| **Authentication** | JWT, Google OAuth 2.0                 |
| **Payments**     | Stripe API (Checkout & Connect)          |
| **File Storage** | Cloudinary                               |
| **Video Conferencing** | Jitsi                              |
| **File Uploads** | Multer, multer-storage-cloudinary        |
| **Validation**   | express-validator                        |
| **Email**        | Nodemailer                               |
| **Scheduling**   | node-cron (local), Vercel Cron (production) |

---

## Project Structure
```bash
/backend
|-- /assets # Static assets (e.g., plan seeders)
|-- /config # Database (connectDB) & Cloudinary config
|-- /controllers # Logic for routes
|-- /middleware # Auth (isLogin, isAdmin), file upload, error handlers
|-- /models # Mongoose schemas (User, Lawyer, Appointment, etc.)
|-- /routes # Express router files (auth.routes.js, user.routes.js, etc.)
|-- /uploads # Local file uploads
|-- /utils # Helper functions (sendEmail, slotGenerator, deleteFile)
|-- .env # Environment variables (MUST BE CREATED)
|-- .gitignore 
|-- package.json # Project dependencies
|-- server.js # Main application entry point
|-- vercel.json # Vercel deployment configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18.x or v20.x)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Cloudinary](https://cloudinary.com/) account
- [Stripe](https://stripe.com/) account
- [Jitsi](https://jaas.8x8.vc/) account

---

### Local Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/Aayush6377/CounselDesk.git
```

**2. Navigate to the backend directory**
```bash
cd CounselDesk/backend
```

**3. Install dependencies**
```bash
npm install
```

If you encounter a peer dependency conflict with Cloudinary:
```bash
npm install --legacy-peer-deps
```

**4. Create your .env file**

Create a `.env` file in the backend directory and fill in your environment variables.
```bash
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# MongoDB
MONGO_PATH="your_mongodb_connection_string"

# JWT & Cookie Secrets (use long, random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
COOKIE_KEY=your_cookie_parser_secret_key

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Nodemailer (for sending emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Jitsi (for secure meetings)
JITSI_APP_ID=vpaas-magic-cookie-...
JITSI_KID=vpaas-magic-cookie-...
JITSI_SECRET_KEY_BASE64=your_base64_encoded_private_key

# Cron Job Security
CRON_SECRET=a_very_long_and_random_secret_string
```
---

### 5. Start the Development Server
```bash
npm run dev
```


The server will start on [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

All routes are prefixed with `/api`.

| Endpoint | Description |
|-----------|-------------|
| `/api/auth` | User & lawyer registration, login (local & Google), logout, token refresh |
| `/api/user` | Find lawyers, book/cancel appointments, manage reviews |
| `/api/lawyer` | Profile setup, scheduling, earnings view |
| `/api/admin` | Admin dashboard, verification, user management |
| `/api/landing` | Public routes (featured lawyers, reviews) |
| `/api/jitsi` | Jitsi meeting authorization and link generation |
| `/api/cron` | Secure endpoint for scheduled jobs |
| `/api/seed` | (Optional) Seed/Unseed database for admin |

---








