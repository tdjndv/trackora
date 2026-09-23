# Trackora

A personal finance tracker. Multiple accounts, each in its own currency, with transactions you can filter, edit and delete.

**[Live demo →](http://54.87.62.235)**

Angular 22 · NestJS 11 · MySQL 8.4 · TypeORM · Nx monorepo · Docker

---

## What's in here

**JWT authentication end to end.** Passwords hashed with bcrypt at cost 12, tokens signed on sign-in and sign-up, and a global guard that protects every route unless it carries `@Public()`. Sign-in runs bcrypt against a dummy hash when the email doesn't exist, so response time doesn't leak whether an account is registered.

**Ownership enforced at the query layer.** Every read and write is scoped by the `sub` claim from the token — an account lookup is `where: { id, userId }`, and a transaction's owner is verified through a join to its account. Requesting someone else's row returns 404, not 403, so the response doesn't confirm the id exists.

**Money stored as integer cents.** `bigint` columns, never floats. Conversion happens once at the form boundary and formatting once at display, through `Intl.NumberFormat` so each account renders in its own currency.

**Filters live in the URL.** Type, category and description search are query params, debounced on input, so a filtered view is shareable and survives a refresh. The URL is the single source of truth — the form writes to it, and a signal reads back from it to trigger the fetch.

**Signals throughout the frontend.** Shared state (the account list, the selected account, the transaction list) lives in root-provided services as signals. Selecting a different account in the top bar re-runs an `effect` that refetches transactions, with no event wiring between components.

**Schema managed by migrations.** `synchronize` is off; TypeORM applies pending migrations on boot.

**Three containers, one exposed port.** nginx serves the built Angular bundle and proxies `/api` to Nest over Docker's internal network. The API and MySQL aren't reachable from outside.

---

## API

All routes are prefixed `/api`. Everything except sign-in and sign-up requires `Authorization: Bearer <token>`.

### Auth

| Method | Route | Body | Returns |
|---|---|---|---|
| `POST` | `/auth/signup` | `{ email, password }` | `201` · `{ access_token }` |
| `POST` | `/auth/signin` | `{ email, password }` | `200` · `{ access_token }` |
| `GET` | `/profile` | — | the decoded token payload |
| `GET` | `/health` | — | liveness check |

Passwords are 8–72 characters. A duplicate email returns `409`; bad credentials return `401` with the same message either way.

### Accounts

| Method | Route | Body | Returns |
|---|---|---|---|
| `POST` | `/accounts` | `{ name, type, currency }` | `201` · the created account |
| `GET` | `/accounts` | — | the signed-in user's accounts |

`type` is one of `cash`, `credit_card`, `checkings`, `savings`. `currency` is validated against ISO 4217. Account names are unique per user — a collision returns `409`.

### Transactions

| Method | Route | Body / params | Returns |
|---|---|---|---|
| `POST` | `/transactions` | `{ description?, amountCents, type, category, accountId }` | `201` · the created transaction |
| `GET` | `/transactions` | `?accountId=&type=&category=&search=` | matching transactions, newest first |
| `PATCH` | `/transactions/:id` | any subset of the create fields | `200` · the updated transaction |
| `DELETE` | `/transactions/:id` | — | `204` |

`type` is `Income` or `Expense`. `category` is one of `Grocery`, `Travel`, `Food`, `Rent`, `Purchase`, `Transfer`, `Other`. `accountId` is deliberately not patchable — moving a transaction between accounts would need a second ownership check on the destination.

```bash
TOKEN=$(curl -s -X POST localhost/api/signin \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"your-password"}' | jq -r .access_token)

curl -X POST localhost/api/accounts \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Chequing","type":"checkings","currency":"CAD"}'

curl "localhost/api/transactions?accountId=$ID&type=Expense&search=groc" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Data model

```
users ──< accounts ──< transactions
```

A user has many accounts; an account has many transactions. Both foreign keys cascade on delete, so removing a user removes everything below it. `accounts` carries a composite unique index on `(userId, name)`.

Amounts are `bigint` cents. Timestamps are `datetime(6)` — microsecond precision, so two rows created in the same second still sort deterministically.

---

## Running it

### Docker (the whole stack)

```bash
cp .env.example .env.docker     # then fill in DB_PASSWORD and JWT_SECRET
docker compose up -d --build
```

Generate real values rather than reusing the examples:

```bash
openssl rand -base64 24    # DB_PASSWORD  (must match MYSQL_PASSWORD in compose.yaml)
openssl rand -base64 48    # JWT_SECRET
```

The app is on `http://localhost`. nginx serves the frontend and proxies `/api` to the backend; neither the API nor MySQL publishes a port.

### Local development

```bash
docker compose up -d db                       # MySQL on 127.0.0.1:3307
npx nx run-many -t serve -p frontend backend  # :4200 and :3000
```

The Angular dev server proxies `/api` to port 3000, so there's no CORS configuration in either environment.

```
DB_HOST=localhost
DB_PORT=3307
DB_USER=trackora
DB_PASSWORD=...
DB_NAME=trackora
JWT_SECRET=...
```

### Migrations

```bash
npm run migration:generate -- apps/backend/src/migrations/DescribeTheChange
npm run migration:run
npm run migration:show
npm run migration:revert
```

Migration classes are imported explicitly in `apps/backend/src/app/config/typeorm.config.ts`. A glob won't work — webpack tree-shakes files nothing imports, so a new migration must be added to that array or it will silently never run.

---

## Layout

```
apps/
  backend/src/
    app/
      auth/          guard, decorators, sign-in and sign-up
      users/         entity, service
      accounts/      entity, service, controller, dto
      transactions/  entity, service, controller, dto
      config/        TypeORM configuration
    migrations/
    data-source.ts   standalone DataSource for the CLI
  frontend/src/app/
    core/            auth and data services, interceptors, route guard
    features/        home, sign-in, sign-up, accounts, transactions
    layout/          top bar with the account picker
```

`nx graph` draws the dependency graph. `nx affected -t test lint` runs only what a change touched.

---

## Notes and trade-offs

**Tokens live in `localStorage`.** Simple, survives a refresh, and vulnerable to XSS in principle. httpOnly cookies with a refresh-token rotation would be the hardened version.

**No refresh tokens.** Access tokens are short-lived and an expired one signs you out via a response interceptor that catches `401`. A silent refresh would be the next step.

**Accounts are immutable.** Deliberate — currency can't change once transactions are denominated in it, and type is close to identity. Rename and archive are the useful operations, and neither is built yet.

**Filtering is server-side; there's no pagination.** Fine at this size, and the shape is ready for `LIMIT`/`OFFSET` when it isn't.

**A transfer is two rows.** `Transfer` is a category, so the two halves of a transfer are an `Expense` and an `Income` with nothing linking them. A `transferGroupId` would pair them.