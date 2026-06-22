# Trackora

A fullstack expanse tracking platform to help users manage transactions, analyze spending patterns.

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

## Tech Stack

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

## API Overview

All endpoints (except authentication) require JWT authentication via HTTP-only cookies.

* `POST /auth/signup` — Register a new user
* `POST /auth/signin` — Authenticate user and issue JWT (stored in HTTP-only cookie)
* `POST /auth/signout` — Clear authentication cookie
* `GET /transactions` — Get paginated transactions
* `POST /transactions` — Create a new transaction
* `GET /transactions/summary` — Get aggregated financial summary
* `GET /transactions/ai_insights` — Generate AI-powered financial insights
* `POST /transactions/quick_add` — Create a transaction using AI parsing
* `GET /transactions/:id` — Get transaction by ID
* `PUT /transactions/:id` — Update transaction
* `DELETE /transactions/:id` — Delete transaction
* `GET /accounts` — Get all accounts
* `POST /accounts` — Create a new account
* `GET /accounts/recent` — Get recently used accounts
* `PUT /accounts/recent` — Update recent accounts
* `GET /accounts/:id` — Get account by ID
* `PUT /accounts/:id` — Update account
* `DELETE /accounts/:id` — Delete account

---

## License

MIT License