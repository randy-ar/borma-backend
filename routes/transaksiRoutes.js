// routes/tokoRoutes.js
const express = require("express");
const transaksiController = require("../controllers/transaksiController");

const router = express.Router();

router.get("/", transaksiController.index);
router.get("/show", transaksiController.show);
router.post("/store", transaksiController.store);
router.post("/update", transaksiController.update);
router.delete("/delete", transaksiController.delete);

module.exports = router;
