const express = require("express");
const barangController = require("../controllers/barangController");

const router = express.Router();

router.get("/", barangController.index);
router.get("/paginate", barangController.paginate);
router.get("/:kode_barang/show", barangController.show);
router.post("/store", barangController.store);
router.post("/:param_kode_barang/update", barangController.update);
router.delete("/:kode_barang/delete", barangController.delete);

module.exports = router;
