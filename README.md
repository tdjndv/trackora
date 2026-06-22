# Trackora 💰

A fullstack expanse tracking platform to help users manage transactions, analyze spending patterns.

---

## Objective
The primary goal of the project was to explore the design and
implementation of fullstack web application using common software
engineering practices, including frontend async, global states management, layered backend architecture, caching, containerization, and automated deployment.

---

## Core Features
* Authentication and authroization using JWT sessions
* Expense and income CRUD functionality
* AI powered transaction parsing
* Reponsive user interface (pagination)

---

## 🧱 Tech Stack

**Frontend**

* React
* TanStack Query
* Redux

**Backend**

* Node.js + Express
* Zod (runtime validation)
* DTO pattern + layered architecture (Routes → Controllers → Services → Repositories)

**Infrastructure**

* PostgreSQL
* Redis (caching)
* Docker
* Amazon EC2
* GitHub Actions (CI/CD pipeline)

**Integrations**

* Stripe
* OpenAI

---

## 🏗️ System Design Highlights

* Designed a **modular backend architecture** separating concerns across controllers, services, and repositories
* Implemented **type-safe request validation** using Zod to prevent invalid API inputs
* Used **HTTP-only cookies for JWT storage** to improve security and mitigate XSS risks
* Leveraged **Redis caching** to reduce database load and improve response times
* Managed frontend server-state with **TanStack Query** for efficient caching, refetching, and synchronization
* Built AI-powered parsing logic to transform unstructured user input into structured financial data

---

## 🔌 API Overview

All endpoints (except authentication) require JWT authentication via HTTP-only cookies.

---

### Authentication (`/auth`)

* `POST /auth/signup` — Register a new user
* `POST /auth/signin` — Authenticate user and issue JWT (stored in HTTP-only cookie)
* `POST /auth/signout` — Clear authentication cookie

---

### Transactions (`/transactions`)

* `GET /transactions` — Get paginated transactions

  * Query params:

    * `page` — page number
    * `limit` — number of items per page

* `POST /transactions` — Create a new transaction

* `GET /transactions/summary` — Get aggregated financial summary

* `GET /transactions/ai_insights` — Generate AI-powered financial insights

* `POST /transactions/quick_add` — Create a transaction using AI parsing

* `GET /transactions/:id` — Get transaction by ID

* `PUT /transactions/:id` — Update transaction

* `DELETE /transactions/:id` — Delete transaction

---

### Accounts (`/accounts`)

* `GET /accounts` — Get all accounts

* `POST /accounts` — Create a new account

* `GET /accounts/recent` — Get recently used accounts

* `PUT /accounts/recent` — Update recent accounts

* `GET /accounts/:id` — Get account by ID

* `PUT /accounts/:id` — Update account

* `DELETE /accounts/:id` — Delete account

---

## 📄 Pagination

Transactions endpoint supports pagination to efficiently handle large datasets:

```http
GET /transactions?page=1&limit=10
```

### Example Response

```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 125
}
```

---

## 📄 License

MIT License