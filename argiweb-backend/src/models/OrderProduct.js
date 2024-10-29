const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            id: { type: String, require: true }, 
        },
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        street: { type: String, required: true },
        addressType: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: String},
    note: { type: String, default: null },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'],
        default: 'pending' 
    },
},
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;