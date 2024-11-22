const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const Voucher = require("../models/Voucher");
const dayjs = require("dayjs");

const createOrder = async (req, res) => {
  try {
    const {
      orderProducts,
      shippingInfo,
      paymentMethod,
      totalPrice,
      user,
      note,
      idOrder,
      voucherCode,
      discountValue,
    } = req.body;

    if (!orderProducts || !shippingInfo || !paymentMethod || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (voucherCode) {
      await Voucher.findOneAndUpdate(
        { code: voucherCode },
        { $inc: { usedCount: 1 } }
      );
    }

    for (const item of orderProducts) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(400).json({
          message: `Không tìm thấy sản phẩm: ${item.name}`,
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Không đủ ${item.name} trong kho. Chỉ còn: ${product.countInStock} sản phẩm`,
        });
      }
    }

    const order = new Order({
      orderItems: orderProducts.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        id: item.id,
      })),
      shippingAddress: {
        fullName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        province: shippingInfo.province,
        district: shippingInfo.district,
        ward: shippingInfo.ward,
        street: shippingInfo.street,
        addressType: shippingInfo.addressType,
      },
      paymentMethod,
      totalPrice,
      user: user || "",
      note,
      idOrder,
      voucherCode,
      discountValue,
    });

    for (const item of orderProducts) {
      const product = await Product.findById(item.id);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    const createdOrder = await order.save();
    res
      .status(201)
      .json({ message: "Order created successfully", data: createdOrder });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: e.message });
  }
};

const getDetailOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy đơn hàng nào cho người dùng này",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Fetched orders successfully",
      data: orders,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Failed to fetch orders",
      error: e.message,
    });
  }
};

const getDetailOrderByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy ID của đơn hàng!",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Fetched order successfully",
      data: order,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Failed to fetch order",
      error: e.message,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng!",
      });
    }

    res.status(200).json({
      message: "Fetched orders successfully",
      data: orders,
    });
  } catch (e) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: e.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await Order.findById(id);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "cancelled") {
      for (const item of updatedOrder.orderItems) {
        const product = await Product.findById(item.id);
        if (product) {
          product.countInStock += item.quantity;
          await product.save();
        }
      }
    }

    if (status === "delivered" && !updatedOrder.isDelivered) {
      updatedOrder.isDelivered = true;
      updatedOrder.deliveredAt = Date.now();
      if (!updatedOrder.isPaid) {
        updatedOrder.isPaid = true;
        updatedOrder.paidAt = Date.now();
      }

      for (const item of updatedOrder.orderItems) {
        const product = await Product.findById(item.id);
        if (!product) {
          console.error(`Không tìm thấy sản phẩm: ${item.id}`);
          continue;
        }

        const currentMonth = dayjs().format("YYYY-MM");
        product.selled += item.quantity;

        const existingSalesEntry = product.salesHistory.find(
          (sale) => sale.month === currentMonth
        );

        if (existingSalesEntry) {
          existingSalesEntry.totalCount += item.quantity;
        } else {
          product.salesHistory.push({
            month: currentMonth,
            totalCount: item.quantity,
          });
        }
        await product.save();
      }
    }

    updatedOrder.status = status;

    await updatedOrder.save();

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: updatedOrder,
    });
  } catch (e) {
    res.status(500).json({
      message: "Cập nhật trạng thái đơn hàng thất bại!",
      error: e.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: 'Chỉ có thể hủy đơn hàng khi ở trạng thái "Chờ xác nhận"',
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Đơn hàng đã được hủy rồi" });
    }

    for (const item of order.orderItems) {
      const product = await Product.findById(item.id);
      if (product) {
        product.countInStock += item.quantity;
        await product.save();
      }
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Hủy đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hủy đơn hàng thất bại!", error: error.message });
  }
};

const confirmOrderReceived = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: 'Đơn hàng phải ở trạng thái "Đã giao hàng"' });
    }

    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    order.status = "completed";

    await order.save();

    res.status(200).json({
      message: "Xác nhận đã nhận đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xác nhận đã nhận đơn hàng",
      error: error.message,
    });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPaymentMethod } = req.body;

    const validPaymentMethods = ["momo", "cod"];
    if (!validPaymentMethods.includes(newPaymentMethod)) {
      return res
        .status(400)
        .json({ message: "Phương thức thanh toán không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isPaid) {
      return res
        .status(400)
        .json({ message: "Cannot change payment method for a paid order" });
    }
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot change payment method for this order status",
      });
    }

    order.paymentMethod = newPaymentMethod;

    if (newPaymentMethod === "cod") {
      order.momoOrderId = null;
    }

    await order.save();

    res.status(200).json({
      message: "Thay đổi phương thức thanh toán thành công!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thay đổi phương thức thanh toán",
      error: error.message,
    });
  }
};

const getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate, interval } = req.query;

    const start = dayjs(startDate || dayjs().startOf("year")).toDate();
    const end = dayjs(endDate || dayjs().endOf("year")).toDate();

    const orders = await Order.aggregate([
      {
        $match: {
          isDelivered: true,
          deliveredAt: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          year: { $year: "$deliveredAt" },
          month: { $month: "$deliveredAt" },
          day: { $dayOfMonth: "$deliveredAt" },
          revenue: {
            $cond: {
              if: { $gt: ["$totalPrice", 549000] },
              then: { $subtract: ["$totalPrice", 40000] },
              else: "$totalPrice",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            ...(interval === "month" && { month: "$month" }),
            ...(interval === "day" && { month: "$month", day: "$day" }),
          },
          totalRevenue: { $sum: "$revenue" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const currentMonth = dayjs().month() + 1;
    const currentDay = dayjs().date();
    const formattedData = orders.map((order) => {
      const { year, month, day } = order._id;
      let label;

      if (interval === "year") {
        label = `${year}`;
      } else if (interval === "month") {
        label = `${month || currentMonth}-${year}`;
      } else {
        label = `${day || currentDay}-${month || currentMonth}-${year}`;
      }

      return { label, revenue: order.totalRevenue };
    });

    res.status(200).json({
      message: "Fetched revenue statistics successfully",
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch revenue statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getDetailOrder,
  getAllOrder,
  updateOrderStatus,
  cancelOrder,
  confirmOrderReceived,
  getDetailOrderByOrderId,
  updatePaymentMethod,
  getRevenueStats,
};
