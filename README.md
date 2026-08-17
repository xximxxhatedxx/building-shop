# Building Shop

E-commerce platform for construction and renovation materials. Built in 2024 as a student project.

## Overview

A full-stack web application with user registration/login, product catalog with filtering, shopping cart, order management, and admin panel for product management.

## Tech Stack

**Frontend:** React 18, Material-UI, Redux Toolkit, React Router, Axios, Formik

**Backend:** Node.js, Express, Sequelize ORM, MSSQL

**Other:** JWT authentication, bcryptjs for password hashing

## Features

- User registration and login with JWT
- Product catalog with search and filtering by category and price
- Shopping cart
- Order management
- Admin panel to create, edit, delete products
- Product pagination
- Responsive design

## Project Structure

```
building-shop/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Auth and Product contexts
│   │   └── styles/         # Theme config
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # Database config
│   ├── db/                 # Database scripts
│   ├── routes/             # API endpoints
│   ├── models/             # Database models
│   ├── middleware/         # Auth middleware
│   └── server.js
│
└── README.md
```

## Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- MSSQL Server (SQL Server Express is free)
  - [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
  - [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](https://azure.microsoft.com/en-us/products/data-studio/)

### Installation

1. Clone repo and navigate to it
   ```bash
   git clone <repository-url>
   cd building-shop
   ```

2. Setup backend
   ```bash
   cd server
   npm install
   ```

3. Configure `.env` file
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_SERVER=localhost\SQLEXPRESS
   DB_DATABASE=building_shop_db
   DB_USER=sa
   DB_PASSWORD=your_password
   DB_PORT=1433
   JWT_SECRET=your_secret_key
   ```

4. Initialize database (see Database Setup section below)

5. Setup frontend
   ```bash
   cd ../client
   npm install
   ```

### Running

Backend (Terminal 1):
```bash
cd server
npm start
# Runs on http://localhost:5000
```

Frontend (Terminal 2):
```bash
cd client
npm start
# Opens http://localhost:3000
```

## Database Setup

Run the initialization script before starting the app:

**SSMS:** Open `server/db/init-database.sql`, execute it on your database

**Command line:**
```bash
cd server
sqlcmd -S localhost\SQLEXPRESS -d building_shop_db -U sa -P your_password -i .\db\init-database.sql
```

**Azure Data Studio:** Open and execute `server/db/init-database.sql`

Verify with:
```sql
USE building_shop_db;
SELECT * FROM roles;
```

## API Endpoints

**Auth:**
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- PUT `/api/auth/me` - Update profile

**Products:**
- GET `/api/products` - List products (with filters: category, search, sortBy, minPrice, maxPrice, page, limit)
- GET `/api/products/categories` - Get categories
- GET `/api/products/max-price` - Get max price
- GET `/api/products/:id` - Get product
- POST `/api/products` - Create (admin only)
- PUT `/api/products/:id` - Update (admin only)
- DELETE `/api/products/:id` - Delete (admin only)

**Cart:**
- GET `/api/cart` - Get cart
- POST `/api/cart` - Add item
- PUT `/api/cart` - Update quantity
- DELETE `/api/cart/:id` - Remove item

**Orders:**
- GET `/api/orders/my` - Get user orders
- POST `/api/orders` - Create order

## Authentication

Uses JWT stored in localStorage. Automatically included in API requests. Admin routes require `role_id === 1`.

## Notes

This is a student project from 2024. Database scripts are in `/server/db`. Don't commit `.env` file to version control.
