const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    minOrderValue: { type: Number, default: 0 },
    expirationDate: { type: Date },
    maxUses: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    targetAudience: {
      type: String,
      enum: ["newUser", "loyalCustomer", "allUsers"],
      default: "allUsers",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
