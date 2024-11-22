const Invoice = require("../models/InvoiceModel");
const Product = require("../models/ProductModel");

const createInvoice = async (req, res) => {
  try {
    const { supplier, products } = req.body;

    const productIds = products.map((p) => p.product);
    const productList = await Product.find({ _id: { $in: productIds } });

    if (productList.length !== products.length) {
      return res
        .status(404)
        .json({ message: "Một hoặc nhiều sản phẩm không tồn tại trong kho" });
    }

    const productDetails = products.map((product) => {
      const foundProduct = productList.find(
        (p) => p._id.toString() === product.product.toString()
      );
      return {
        product: product.product,
        name: foundProduct.name,
        quantity: product.quantity,
        price: product.price,
      };
    });

    const totalAmount = productDetails.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    );
    const invoice = new Invoice({
      supplier,
      products: productDetails,
      totalAmount,
    });
    const savedInvoice = await invoice.save();
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.quantity;
        await product.save();
      }
    }
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo phiếu nhập hàng", error });
  }
};

const getInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("products.product");

    if (!invoice) {
      return res.status(404).json({ message: "Phiếu nhập hàng không tồn tại" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xem chi tiết phiếu nhập hàng", error });
  }
};

const PDFDocument = require("pdfkit");
const removeAccents = require("remove-accents");

const printInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("products.product");

    if (!invoice) {
      return res.status(404).json({ message: "Phiếu nhập hàng không tồn tại" });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${invoice._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(`Invoice ID: ${invoice._id}`, { align: "center" });
    doc
      .fontSize(14)
      .font("Helvetica")
      .text(`Supplier: ${invoice.supplier}`, { align: "center" });
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, {
      align: "center",
    });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Product", {
        x: 0,
        y: doc.y,
        width: 400,
        align: "left",
        continued: true,
      })
      .text("Quantity", {
        x: 250,
        y: doc.y,
        width: 100,
        align: "center",
        continued: true,
      })
      .text("Price", {
        x: 400,
        y: doc.y,
        width: 300,
        align: "right",
      });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown(1);

    invoice.products.forEach((p) => {
      const yPos = doc.y;
      doc
        .fontSize(12)
        .font("Helvetica")
        .text(removeAccents(p.product.name), {
          x: 0,
          y: yPos,
          width: 400,
          align: "left",
          continued: true,
        })
        .text(`x${p.quantity}`, {
          x: 500,
          y: yPos,
          width: 50,
          align: "center",
          continued: true,
        })
        .text(`${p.price.toLocaleString()} VND`, {
          x: 400,
          y: yPos,
          width: 300,
          align: "right",
        });
    });
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(2);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Total Price: ${invoice.totalAmount.toLocaleString()} VND`, {
        align: "right",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi in hóa đơn", error });
  }
};

const getAllInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        message: "No invoices found",
      });
    }

    res.status(200).json({
      message: "Fetched invoices successfully",
      data: invoices,
    });
  } catch (e) {
    res.status(500).json({
      message: "Failed to fetch invoices",
      error: e.message,
    });
  }
};

module.exports = {
  createInvoice,
  printInvoice,
  getInvoiceDetails,
  getAllInvoice,
};
