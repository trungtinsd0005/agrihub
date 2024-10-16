const Order = require('../models/OrderProduct');

const createOrder = async(req, res) => {
    try {
        const {
            orderProducts,
            shippingInfo,
            paymentMethod,
            totalPrice,
            user
        } = req.body

        if (!orderProducts || !shippingInfo || !paymentMethod || !totalPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const order = new Order({
            orderItems: orderProducts.map(item => ({
                name: item.name,
                amount: item.amount,
                image: item.image,
                price: item.price,
                product: item.productId
            })),
            shippingAddress: {
                fullName: shippingInfo.fullName,
                phone: shippingInfo.phone,
                province: shippingInfo.province,
                district: shippingInfo.district,
                ward: shippingInfo.ward,
                street: shippingInfo.street,
                addressType: shippingInfo.addressType
            },
            paymentMethod,
            totalPrice,
            user: user || ''
        });

        const createdOrder = await order.save();
        res.status(201).json({ message: 'Order created successfully', data: createdOrder });
    }catch(e) {
        res.status(500).json({ message: 'Failed to create order', error: e.message });
    }
}

const getDetailOrder = async(req, res) => {
    try {
        const userId = req.params.userId
        const orders = await Order.find({ user: userId });
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: 'ERR',
                message: 'No orders found for this user'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Fetched orders successfully',
            data: orders
        });
    }catch(e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Failed to fetch orders',
            error: e.message
        });
    }
}

const getAllOrder = async(req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found'
            });
        }

        res.status(200).json({
            message: 'Fetched orders successfully',
            data: orders
        });
    }catch(e) {
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: e.message
        });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            data: updatedOrder
        });
    } catch (e) {
        res.status(500).json({ message: 'Failed to update order status', error: e.message });
    }
}

module.exports = {
    createOrder,
    getDetailOrder,
    getAllOrder,
    updateOrderStatus
}