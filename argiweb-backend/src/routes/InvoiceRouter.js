const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/InvoiceController");

router.post("/create", InvoiceController.createInvoice);
router.get("/get-details/:id", InvoiceController.getInvoiceDetails);
router.get("/print/:id", InvoiceController.printInvoice);
router.get("/get-all", InvoiceController.getAllInvoice);

module.exports = router;
