require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
const coinsRouter = require('./routes/coins');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const watchlistRouter = require('./routes/watchlist');

app.use('/api/coins', coinsRouter);
app.use('/api/auth', authRouter);
app.use('/api/watchlist', authMiddleware, watchlistRouter);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server corriendo en http://localhost:${PORT}`));