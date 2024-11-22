const Voucher = require("../models/Voucher");
const User = require("../models/UserModel");
const Order = require("../models/OrderProduct");

const createVoucher = async (req, res) => {
  try {
    const {
      code,
      discount,
      type,
      minOrderValue,
      expirationDate,
      maxUses,
      targetAudience,
    } = req.body;

    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
      return res.status(400).json({ message: "Mã voucher đã tồn tại!" });
    }

    const currentDate = new Date();
    const expiration = new Date(expirationDate);
    if (expiration < currentDate) {
      return res
        .status(400)
        .json({ message: "Ngày hết hạn phải sau ngày hiện tại!" });
    }

    if (maxUses <= 0) {
      return res.status(400).json({ message: "maxUses phải lớn hơn 0!" });
    }

    if (type === "percentage") {
      if (discount >= 50) {
        return res
          .status(400)
          .json({ message: "Không được giảm giá hơn 50%!" });
      }
    } else {
      if (discount < 1000) {
        return res.status(400).json({ message: "Giảm giá ít nhất là 1000đ" });
      }
    }

    const voucher = new Voucher({
      code,
      discount,
      type,
      minOrderValue,
      expirationDate,
      maxUses,
      targetAudience,
    });

    await voucher.save();

    res.status(201).json({
      message: "Voucher created and distributed successfully",
      data: voucher,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create voucher", error: error.message });
  }
};

const applyVoucher = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy Voucher" });
    }

    if (new Date() > new Date(voucher.expirationDate)) {
      return res.status(400).json({ message: "Voucher đã hết hạn" });
    }

    if (voucher.usedCount >= voucher.maxUses) {
      return res
        .status(400)
        .json({ message: "Voucher đã đạt giới hạn sử dụng" });
    }

    if (orderValue < voucher.minOrderValue) {
      return res.status(400).json({
        message: `Giá trị tối thiểu để áp dụng voucher này là ${voucher.minOrderValue.toLocaleString(
          "Vi-vn"
        )} đ`,
      });
    }

    const discount =
      voucher.type === "percentage"
        ? (voucher.discount / 100) * orderValue
        : voucher.discount;

    res.status(200).json({
      message: "Sử dụng voucher thành công!",
      discount: discount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sử dụng voucher thất bại!", error: error.message });
  }
};

const updateVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const updateData = req.body;

    const voucher = await Voucher.findOneAndUpdate({ code }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật voucher thành công",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cập nhật voucher thất bại",
      error: error.message,
    });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const { code } = req.params;

    const voucher = await Voucher.findOneAndDelete({ code });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    res.status(200).json({
      message: "Xóa voucher thành công",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Xóa voucher thất bại",
      error: error.message,
    });
  }
};

const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });

    if (!vouchers || vouchers.length === 0) {
      return res.status(404).json({
        message: "No vouchers found",
      });
    }

    res.status(200).json({
      message: "Fetched vouchers successfully",
      data: vouchers,
    });
  } catch (e) {
    res.status(500).json({
      message: "Failed to fetch vouchers",
      error: e.message,
    });
  }
};

const distributeVoucherLogic = async (voucherId) => {
  try {
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) throw new Error("Voucher không tồn tại!");

    let users;

    switch (voucher.targetAudience) {
      case "newUser":
        users = await User.find({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        break;

      case "loyalCustomer":
        const loyalCustomerIds = await Order.aggregate([
          {
            $group: {
              _id: "$user",
              orderCount: { $sum: 1 },
            },
          },
          {
            $match: {
              orderCount: { $gte: 10 },
            },
          },
        ]).then((results) => results.map((result) => result._id));

        users = await User.find({ _id: { $in: loyalCustomerIds } });
        break;

      case "allUsers":
        users = await User.find();
        break;

      default:
        throw new Error("Loại đối tượng không hợp lệ!");
    }

    if (users && users.length > 0) {
      const updates = users.map((user) => {
        if (!user.vouchers.includes(voucher._id)) {
          user.vouchers.push(voucher._id);
          return user.save();
        }
      });

      await Promise.all(updates);
    }
  } catch (error) {
    console.error("Lỗi khi phân phối voucher:", error.message);
  }
};

module.exports = {
  createVoucher,
  applyVoucher,
  getAllVouchers,
  updateVoucher,
  deleteVoucher,
  distributeVoucherLogic,
};
