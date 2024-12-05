const schedule = require("node-schedule");
const Order = require("../models/OrderProduct");
const Voucher = require("../models/Voucher");
const { distributeVoucherLogic } = require("../controllers/voucherController");

const cancelUnpaidOrders = async () => {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const ordersToCancel = await Order.find({
    status: "pending",
    createdAt: { $lt: cutoffTime },
  });

  for (const order of ordersToCancel) {
    order.status = "cancelled";
    await order.save();
    console.log(`Order ${order.idOrder} has been cancelled.`);
  }
};

const distributeVouchers = async () => {
  try {
    const vouchers = await Voucher.find();

    for (const voucher of vouchers) {
      await distributeVoucherLogic(voucher._id);
      console.log(`Phân phối voucher ${voucher.code} hoàn tất.`);
    }
  } catch (error) {
    console.error("Lỗi khi phân phối voucher:", error.message);
  }
};

const scheduleJobs = () => {
  schedule.scheduleJob("0 * * * *", cancelUnpaidOrders);
  schedule.scheduleJob("* * * * *", distributeVouchers);
};

module.exports = scheduleJobs;
