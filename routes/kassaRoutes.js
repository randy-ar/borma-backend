const express = require("express");
const kassaController = require("../controllers/kassaController");

const router = express.Router();

router.get("/", kassaController.index);
router.get("/:kode_kassa/show", kassaController.show);
router.post("/store", kassaController.store);
router.post("/:kode_kassa/update", kassaController.update);
router.delete("/:kode_kassa/delete", kassaController.delete);

module.exports = router;