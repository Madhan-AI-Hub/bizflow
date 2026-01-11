# BizFlow – Smart Local Business Operations & Analytics Platform

**Functional Requirements Document (FRD)**
**Version:** 1.0
**Application Type:** Production-Ready Full-Stack MERN SaaS
**Target Users:** Local Business Owners & Staff
**UI Priority:** Mobile-First, Premium UI/UX

---

## 1. 📌 Project Overview

### 1.1 Problem Statement

Local businesses (shops, cafés, clinics, salons, service centers, etc.) still depend on notebooks, spreadsheets, or WhatsApp messages to manage daily operations such as sales, expenses, customers, and staff. This results in poor tracking, no analytics, data loss, and zero growth insights.

### 1.2 Solution

BizFlow is a **mobile-first, production-ready web platform** that digitizes daily business operations and provides **real-time analytics dashboards**, secure access, and structured data storage.

---

## 2. 🎯 Objectives

* Digitize daily business operations
* Provide real-time financial insights
* Enable role-based secure access
* Deliver a premium, modern SaaS-level UI
* Be fully deployable and client-shareable

---

## 3. 👥 User Roles & Permissions

### 3.1 Roles

| Role  | Description    |
| ----- | -------------- |
| ADMIN | Business Owner |
| STAFF | Employee       |

### 3.2 Permissions

| Module              | Admin | Staff         |
| ------------------- | ----- | ------------- |
| Business Profile    | Full  | Read          |
| Customers           | CRUD  | Create / Read |
| Products / Services | CRUD  | Read          |
| Sales               | CRUD  | Create / Read |
| Expenses            | CRUD  | ❌             |
| Employees           | CRUD  | ❌             |
| Analytics Dashboard | ✅     | ❌             |
| Delete Operations   | ✅     | ❌             |

---

## 4. 🔐 Authentication & Security Requirements

* JWT-based authentication
* Password hashing using bcrypt
* Role-based access control (RBAC)
* Protected REST APIs
* Token expiration & logout handling
* No hard-coded secrets
* Environment variables for all credentials

---

## 5. 🧭 Application Flow (End-User Perspective)

### 5.1 Entry Flow

1. User opens BizFlow web app
2. Views landing page with value proposition
3. CTA → Login / Register
4. Fully responsive (mobile priority)

---

### 5.2 Registration Flow (Admin)

1. User registers with:

   * Name
   * Email
   * Password
   * Business Name
   * Business Category
2. Backend:

   * Hash password
   * Assign role = ADMIN
   * Create business entity
3. JWT issued
4. Redirect to dashboard

---

### 5.3 Login Flow

1. User logs in
2. JWT validated
3. Role detected
4. Redirect:

   * Admin → Admin Dashboard
   * Staff → Staff Dashboard

---

### 5.4 Business Profile Flow

* Admin can:

  * View & update business details
  * Add GST / License info (optional)
* Business profile acts as root reference for all data

---

### 5.5 Customer Management Flow

* Add / Edit / Delete customers
* Store contact & visit history
* Auto-calculate total spending per customer

---

### 5.6 Product / Service Management Flow

* Add products/services
* Define price, category, availability
* Track stock (if applicable)
* Used directly in sales module

---

### 5.7 Sales & Expense Flow

**Sales**

* Add daily sales
* Select customer & products
* Auto total calculation

**Expenses**

* Add expense category
* Track amount & date

---

### 5.8 Employee Management Flow

* Admin creates staff accounts
* Assigns role
* Staff has limited access

---

### 5.9 Analytics Dashboard Flow (Admin)

* Revenue (Daily / Weekly / Monthly)
* Expense vs Income charts
* Profit / Loss summary
* Top customers
* Top products

---

## 6. 📊 Analytics Requirements

* Real data only (MongoDB aggregation)
* No static values
* Charts integrated into MUI layout
* Mobile-friendly visualization

---

## 7. 🎨 UI / UX Design Requirements (STRICT)

### 7.1 UI Principles

* Mobile-first design
* Premium SaaS feel
* Clean spacing & hierarchy
* Smooth transitions & micro-interactions
* Zero clutter

### 7.2 Color & Theme Palette

**Primary Color:**

* Indigo Blue `#4F46E5`

**Secondary Color:**

* Emerald Green `#10B981`

**Background (Light):**

* `#F9FAFB`

**Background (Dark):**

* `#0F172A`

**Text Primary:**

* `#111827`

**Accent / Warning:**

* Amber `#F59E0B`

### 7.3 Typography

* Font Family: Inter / Roboto
* Clear hierarchy:

  * Headings: Bold
  * Body: Regular
* Readability first

### 7.4 UX Enhancements

* Loading skeletons
* Toast notifications
* Confirmation dialogs
* Empty state illustrations
* Dark / Light mode toggle

---

## 8. 🧱 Technical Requirements (STRICT)

### 8.1 Frontend

* React + Vite
* Material UI (MUI) only
* Axios for API calls
* Protected routes
* Reusable components
* Mobile-first responsive layout

### 8.2 Backend

* Node.js + Express
* RESTful APIs
* MongoDB with Mongoose
* Modular architecture
* Input validation & error handling

---

## 9. 🗂️ Mandatory Folder Structure

```
client/
 └── src/
     ├── components/
     ├── pages/
     ├── services/
     ├── hooks/
     ├── utils/
     └── App.jsx

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 └── server.js
```

---

## 10. 🧪 Testing Requirements

* Manual end-to-end testing
* Role-based testing
* Mobile responsiveness testing
* CRUD validation testing
* Authentication & authorization testing

---

## 11. 🚫 Strict Restrictions

* ❌ No mock data
* ❌ No UI-only implementation
* ❌ No skipped modules
* ❌ No unsecured APIs
* ❌ No hard-coded credentials

---

## 12. 🚀 Deployment Readiness

* Environment-based configs
* Production-ready build
* Clean console
* Ready for cloud deployment

---

## 13. 🌟 Bonus Features

* PDF export of reports
* Advanced search & filters
* Dark / Light mode
* Notifications system

---



