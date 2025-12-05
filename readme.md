# Endüstri 4.0 Mini Accounting — Node/React

![node](https://img.shields.io/badge/Node.js-20.x-informational)
![ts](https://img.shields.io/badge/TypeScript-5.x-blue)
![express](https://img.shields.io/badge/Express-REST%20API-green)
![react](https://img.shields.io/badge/React-18.x-61dafb)
![vite](https://img.shields.io/badge/Vite-React_TS-purple)
![license](https://img.shields.io/badge/License-MIT-lightgrey)

Concrete domain: **Industry 4.0** muhasebe microservice + dashboard.

- **Backend**: Node.js + TypeScript + Express, double-entry accounting engine.
- **Frontend**: React + Vite + TypeScript, dark-themed accounting console.
- **Demo**: IoT sensör giderleri, üretim hattı yatırımı, predictive maintenance gelirleri.
- **Purpose**: MES/ERP entegrasyonları için hafif, anlaşılır ve genişletilebilir bir örnek.

---

## Quick Start (Backend – Accounting Microservice)

```bash
cd mini-accounting-service
npm install
npm run dev
curl http://localhost:4000/health
```

---

## Quick Start (Frontend – React Dashboard)

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

---

## Demo Data (Industry 4.0 Seed)

```bash
curl -X POST http://localhost:4000/dev/seed
```

---

## Endpoints

```
GET    /health
GET    /accounts
POST   /accounts
GET    /journal
POST   /journal
GET    /reports/trial-balance
GET    /reports/ledger/:accountId
POST   /dev/seed
```

---

## Project Structure

```
mini-accounting-service/
├─ src/
│  ├─ accounting/
│  ├─ routes/
│  └─ server.ts
├─ public/
└─ frontend/
   ├─ src/
   └─ vite.config.ts
```

---

## Tech Highlights

- Double-entry accounting engine
- Node.js + TypeScript backend
- React + Vite dashboard
- Mizan, hesap ekstresi, journal, chart of accounts

---

**By:** Orçun
