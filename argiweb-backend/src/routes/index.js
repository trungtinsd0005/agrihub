const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const PaymentRouter = require("./PaymentRouter");
const OrderRouter = require("./OrderRouter");
const ImageRouter = require("./ImageRouter");
const InvoiceRouter = require("./InvoiceRouter");
const VoucherRouter = require("./VoucherRouter");
const WebhookRouter = require("./WebhookRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/image", ImageRouter);
  app.use("/api/invoice", InvoiceRouter);
  app.use("/api/vouchers", VoucherRouter);
  app.use("/api/webhook", WebhookRouter);
};

module.exports = routes;
