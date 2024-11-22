const express = require("express");
const router = express.Router();
const voucher = require("../controllers/voucherController");

router.post("/create", voucher.createVoucher);
router.post("/apply", voucher.applyVoucher);
router.put("/update/:code", voucher.updateVoucher);
router.delete("/delete/:code", voucher.deleteVoucher);
router.get("/get-all", voucher.getAllVouchers);

module.exports = router;
