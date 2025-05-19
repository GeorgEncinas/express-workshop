# Crypto Tracker

API REST en Node.js y Express para:
- Listar criptomonedas con CoinGecko
- CRUD de watchlist en memoria
- Auth JWT simple

## Instalación

```
npm install
```

## Uso

```
npm run dev
```

Endpoints:
- GET /ping
- GET /api/coins
- POST /api/auth/login
- GET/POST/DELETE /api/watchlist (protegido)
