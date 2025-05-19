const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../../data/watchList.json");
let watchList = [];
try {
  const data = fs.readFileSync(filePath, "utf-8");
  watchList = JSON.parse(data);
} catch {
  watchList = [];
}

// Helper: persistir watchList en archivo
function saveWatchList() {
  fs.writeFileSync(filePath, JSON.stringify(watchList, null, 2));
}

// GET
router.get("/", (req, res) => {
  const userList = watchList.filter((item) => item.user === req.user.user);
  res.json(userList);
});

// GET por id
router.get("/:id", (req, res) => {
  const { id: cryptoId } = req.params;
  const watchListItem = watchList.find(
    (item) => item.id === cryptoId && item.user === req.user.user
  );
  if (!watchListItem) {
    return res.status(404).json({ error: "No encontrado" });
  }
  res.json(watchListItem);
});

// POST
router.post("/", (req, res) => {
  const { id: cryptoId, symbol: cryptoSymbol } = req.body;
  if (!cryptoId || !cryptoSymbol) {
    return res.status(400).json({ error: "id y symbol requeridos" });
  }
  const newEntry = { user: req.user.user, id: cryptoId, symbol: cryptoSymbol };
  watchList.push(newEntry);
  saveWatchList();
  res.status(201).json({ added: newEntry });
});

// UPDATE (PATCH)
router.patch("/:id", (req, res) => {
  const { id: cryptoId } = req.params;
  const { symbol: newSymbol } = req.body;
  if (!newSymbol) {
    return res.status(400).json({ error: "symbol requerido" });
  }
  const index = watchList.findIndex(
    (item) => item.id === cryptoId && item.user === req.user.user
  );
  if (index < 0) {
    return res.status(404).json({ error: "No encontrado" });
  }
  watchList[index].symbol = newSymbol;
  saveWatchList();
  res.json({ updated: watchList[index] });
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id: cryptoId } = req.params;
  const initialLength = watchList.length;
  watchList = watchList.filter(
    (item) => !(item.id === cryptoId && item.user === req.user.user)
  );
  saveWatchList();
  const removed = watchList.length < initialLength;
  res.json({ removed: removed ? cryptoId : null });
});

module.exports = router;
