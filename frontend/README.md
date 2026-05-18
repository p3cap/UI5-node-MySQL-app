# Frontend

OpenUI5 single-page application. Connects to the backend via `fetch()`.

## Stack

| Technology | Role |
|---|---|
| **OpenUI5** | UI framework — controls, MVC |
| **@ui5/cli** | Dev server & build tooling |

### OpenUI5 libraries used

| Library | What it provides |
|---|---|
| `sap.m` | Core controls — `Input`, `Button`, `VBox`, `HBox`, `Select`, `Text`, `Title`, `MessageToast` |
| `sap.ui.core` | MVC base, `ListItem`, component bootstrap |

---

## Structure

```
frontend/
├── webapp/
│   ├── Component.js           # App entry point — loads manifest.json
│   ├── manifest.json          # App config — root view, dependencies
│   ├── index.html             # Bootstrap page
│   ├── view/
│   │   └── Main.view.xml      # XML view — layout and controls
│   └── controller/
│       └── Main.controller.js # Logic — search, create user, load countries
└── ui5.yaml                   # UI5 CLI config — framework, version, webapp path
```

---

## What it does

- **Create user** — name + country code + phone number, validated server-side before saving
- **Search by name** — OData `$filter` with `substringof`
- **Search by phone** — same filter on `phone_number`
- **Show all** — clears filters and reloads the full list

---

## Start

```
npm start
```
Opens **http://localhost:8080/index.html**

> The backend must be running first on `http://localhost:3000`.
