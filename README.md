# Trackora 💰

A production-ready full-stack personal finance platform that enables users to track expenses, analyze spending behavior, and gain AI-powered financial insights. Designed with scalable architecture, secure authentication, and automated cloud deployment.

👉 **Live App:** https://trackora.org
👉 **GitHub:** https://github.com/tdjndv/trackora

---

## 🌟 What Makes Trackora Unique

* ⚡ **AI-powered Quick Add**: Users can enter natural text (e.g., “lunch at McDonald’s $12”), and the system automatically infers category, amount, and type
* 🧠 Combines traditional finance tracking with **AI-driven insights and automation**
* 🏗️ Built with **production-level architecture and deployment pipeline**, not just a demo app
* 🚀 Optimized for performance using **caching and modern data synchronization strategies**

---

## 🚀 Key Features

* 🔐 Secure authentication using JWT stored in HTTP-only cookies
* 💸 Expense and income tracking with full CRUD operations
* ⚡ AI-powered **Quick Add transaction parsing**
* 📊 Real-time financial analytics and spending insights
* ⚡ Optimized data fetching and caching with TanStack Query
* 🧠 AI-generated financial insights via OpenAI API
* 💳 Stripe integration for subscription-based features
* 📱 Responsive, production-ready UI

---

## 🧱 Tech Stack

**Frontend**

* React
* TanStack Query

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

## ⚡ Performance & Scalability

* Reduced redundant API calls using intelligent caching strategies
* Improved data synchronization with client-side caching (TanStack Query)
* Optimized backend response times with Redis caching
* Containerized application using Docker for consistent environments
* Designed backend layers to support future scaling and feature expansion

---

## 🚀 Deployment & DevOps

* Deployed on Amazon EC2 using Docker containers
* Implemented CI/CD pipeline with GitHub Actions

  * Automated build and deployment on push to main branch
* Environment-based configuration using secure environment variables

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

## ⚔️ Challenges & Solutions

* **Maintaining frontend-backend data consistency**
  → Solved using TanStack Query for caching and refetching

* **Scaling backend structure beyond simple CRUD**
  → Introduced service/repository layers for clean separation of concerns

* **Secure authentication handling**
  → Used HTTP-only cookies instead of localStorage

* **Transforming unstructured user input into structured data**
  → Implemented AI-based parsing for the Quick Add feature

* **Automating deployment**
  → Built CI/CD pipeline with Docker and GitHub Actions

---

## 🔮 Future Improvements

* Budget planning and financial goal tracking
* Advanced analytics and forecasting
* Improved test coverage (unit + integration)
* Mobile application

---

## 📌 Highlights

Trackora demonstrates:

* Production-level full-stack development
* Scalable backend architecture and clean code organization
* Secure authentication and API design
* Cloud deployment and CI/CD automation
* Integration with real-world services (Stripe, OpenAI)
* AI-powered user experience improvements

---

## 📄 License

MIT License