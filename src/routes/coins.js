const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      { params: { vs_currency: 'usd', per_page: 10 } }
    );
    const coins = data.map(c => ({
      id: c.id,
      symbol: c.symbol,
      price: c.current_price,
      image: c.image
    }));
    res.json(coins);
  } catch (err) {
    next(err);
  }
});

module.exports = router;