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