# NCSC Web App

A full-stack web application using **Strapi v5** as the backend CMS and **Next.js 15** as the frontend framework. This project is designed for seamless content management with a modern, fast, and customizable frontend.

---

## 🚀 Technologies Used

- **Strapi v5**: A powerful, open-source headless CMS for creating flexible APIs and managing content easily.
- **Next.js 15**: A modern React framework for building fast, server-rendered web applications with great developer experience.
- **pnpm**: A fast, disk space-efficient package manager.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Nash-ken/NCSC.git
cd NCSC
```

### 2. Backend
```bash
cd server
pnpm install
pnpm develop
```

### 3. Frontend
```bash
cd client
pnpm install
pnpm dev
```

### 4. Environment Variables Setup
After starting Strapi for the first time, locate the JWT secret from the .env file inside the server folder.

Copy This Line
```bash
JWT_SECRET=your-strapi-jwt-secret
```

Paste JWT Secret in Client
Open the .env.local file in the client folder and paste the same JWT secret.

#### Generate Full Access API Token

Go to Strapi admin panel.

Navigate to Settings > API Tokens.

Generate a Full Access API Token.

Copy the token.

Add API Token to Client
In the client’s .env.local file:
STRAPI_API_TOKEN=your-full-access-api-token

### Additional Notes
Ensure both server and client .env files are properly configured for smooth authentication and API access.

Make sure ports 1337 (Strapi) and 3000 (Next.js) are not blocked or used by other services.
