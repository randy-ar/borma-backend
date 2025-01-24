// routes/tokoRoutes.js
const express = require("express");
const tokoController = require("../controllers/tokoController");

const router = express.Router();

router.get("/", tokoController.index);
router.get("/show", tokoController.show);
router.get("/first", tokoController.first);
router.post("/store", tokoController.create);
router.post("/update", tokoController.update);

module.exports = router;
