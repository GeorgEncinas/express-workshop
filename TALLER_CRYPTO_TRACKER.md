# Taller Práctico: Crypto Tracker con Node.js y Express (2 horas)

## Agenda (120 min)

| Tiempo   | Tema                                                        |
|---------:|-------------------------------------------------------------|
| 00–10′   | Introducción y objetivos                                    |
| 10–25′   | Inicializar proyecto y estructura                           |
| 25–40′   | Primer endpoint: `/ping` y levantar servidor                |
| 40–60′   | Consumir API pública (CoinGecko)                            |
| 60–80′   | CRUD de `watchlist` en memoria                              |
| 80–95′   | Middleware: Logger y manejo de errores                      |
| 95–115′  | Autenticación JWT simple                                    |
| 115–120′ | Testing con Postman y cierre/Q&A                            |

---

## 00–10′ Introducción

1. Presentación del instructor y experiencia.
2. Objetivos:
   - Crear una API REST con Express.
   - Consumir API externa de criptomonedas.
   - CRUD en memoria para watchlist.
   - Proteger ruta con JWT.
3. Descripción: "Crypto Tracker" permite listar criptos, marcarlas favoritas y proteger la lista.

## 10–25′ Inicializar proyecto

```bash
mkdir crypto-tracker && cd crypto-tracker
npm init -y
npm install express axios jsonwebtoken dotenv
```

Estructura mínima:
```
crypto-tracker/
├ .env
├ package.json
├ src/
│  ├ app.js
│  ├ routes/
│  └ middleware/
└ README.md
```

En `package.json`:
```json
"scripts": {
  "start": "node src/app.js",
  "dev": "node --watch src/app.js"
}
```

## 25–40′ Primer endpoint

En `src/app.js`:

```js
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/ping', (req, res) => res.json({ message: 'pong 🏓' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server en http://localhost:${PORT}`)
);
```

**Demo**: `curl http://localhost:3000/ping`

## 40–60′ API pública (CoinGecko)

En `src/routes/coins.js`:

```js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      { params: { vs_currency: 'usd', per_page: 10 } }
    );
    const coins = data.map(c => ({ id: c.id, symbol: c.symbol, price: c.current_price, image: c.image }));
    res.json(coins);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

En `app.js`:
```js
const coinsRouter = require('./routes/coins');
app.use('/api/coins', coinsRouter);
```

**Demo**: `curl http://localhost:3000/api/coins`

## 60–80′ CRUD watchlist

En `src/routes/watchlist.js`:

```js
const express = require('express');
const router = express.Router();
let watchlist = [];

router.get('/', (req, res) => res.json(watchlist));
router.post('/', (req, res) => {
  const { id, symbol } = req.body;
  if (!id || !symbol) return res.status(400).json({ error: 'id y symbol requeridos' });
  watchlist.push({ id, symbol });
  res.status(201).json({ added: { id, symbol } });
});
router.delete('/:id', (req, res) => {
  watchlist = watchlist.filter(c => c.id !== req.params.id);
  res.json({ removed: req.params.id });
});

module.exports = router;
```

En `app.js`:
```js
const watchlistRouter = require('./routes/watchlist');
app.use('/api/watchlist', watchlistRouter);
```

## 80–95′ Middleware y errores  

En `app.js`, tras `express.json()`:
```js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});
```

Manejador global de errores al final:
```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno' });
});
```

## 95–115′ Autenticación JWT

**Middleware** `src/middleware/auth.js`:
```js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token faltante' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

**Auth route** `src/routes/auth.js`:
```js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: 'user requerido' });
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
```

En `app.js`, registra y protege:
```js
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
app.use('/api/auth', authRouter);
app.use('/api/watchlist', authMiddleware, watchlistRouter);
```

## 115–120′ Testing y cierre

1. Probar con Postman:
   - `/ping`
   - `/api/coins`
   - `/api/auth/login` → Bearer token
   - `/api/watchlist` (GET/POST/DELETE)
2. Q&A: persistencia real, validación, NestJS, Swagger.
