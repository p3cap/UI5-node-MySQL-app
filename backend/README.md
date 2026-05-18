# Backend

Node.js REST + OData v2 API backed by MySQL.

## Stack

| Technology | Role |
|---|---|
| **Node.js** | Runtime |
| **Express 5** | HTTP server & routing |
| **MySQL2** | MySQL driver — raw queries via a connection pool |
| **dotenv** | Loads DB credentials from `.env` |
| **cors** | Allows the frontend (different port) to call the API |
| **libphonenumber-js** | Phone number validation & country code list |

### Dev / Test

| Tool | Role |
|---|---|
| **Jest** | Test runner |
| **Supertest** | HTTP assertions against the Express app |

---

## Structure

```
backend/
├── server.js          # Express app — all routes defined here
├── setup.js           # One-time DB setup script (runs init.sql)
├── db/
│   ├── init.sql       # Creates the database
│   └── EDMX_metadata.xml  # OData schema served at /odata/$metadata
├── tests/
│   ├── users.test.js
│   └── metadata.test.js
└── .env               # DB credentials (not committed)
```

---

## API

| Method | URL | Description |
|---|---|---|
| `GET` | `/odata/$metadata` | OData EDMX schema (XML) |
| `GET` | `/odata/Users` | List users (supports `$filter`) |
| `GET` | `/odata/Users/$count` | User count |
| `POST` | `/odata/Users` | Create a user |
| `GET` | `/countries` | Country calling codes |
| `POST` | `/validate/phone` | Validate a phone number |

### Filtering example
```
GET /odata/Users?$filter=substringof('John',user_name)
```

---

## Setup

1. Copy `.env.example` to `.env` and fill in DB credentials
2. Run the DB setup once:
   ```
   node setup.js
   ```
3. Start the server:
   ```
   node server.js
   ```
   Runs on **http://localhost:3000**

### Tests
```
npm test
```
