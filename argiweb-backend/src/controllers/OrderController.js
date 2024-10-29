const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const dayjs = require('dayjs');

const createOrder = async(req, res) => {
    try {
        const {
            orderProducts,
            shippingInfo,
            paymentMethod,
            totalPrice,
            user,
            note
        } = req.body

        if (!orderProducts || !shippingInfo || !paymentMethod || !totalPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const order = new Order({
            orderItems: orderProducts.map(item => ({
                name: item.name,
                quantity: item.quantity,
                image: item.image,
                price: item.price,
                id: item.id
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
            user: user || '',
            note
        });

        for (const item of orderProducts) {
            try {
                const currentMonth = dayjs().format('YYYY-MM');
                const product = await Product.findById(item.id);
                if (!product) {
                    console.error(`Product not found: ${item.id}`);
                    continue;
                }
                
                product.selled += item.quantity;

                const existingSalesEntry = product.salesHistory.find(sale => sale.month === currentMonth);
                if (existingSalesEntry) {
                    existingSalesEntry.totalCount += item.quantity;
                } else {
                    product.salesHistory.push({ month: currentMonth, totalCount: item.quantity });
                }
                
                const updatedProduct = await product.save();
                console.log('Updated Product:', updatedProduct);
            } catch (error) {
                console.error('Error updating product:', error);
                throw new Error('Failed to update product');
            }
        }

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

const getDetailOrderByOrderId = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Order by orderId not found'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Fetched order successfully',
            data: order
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Failed to fetch order',
            error: e.message
        });
    }
};


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

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findById(id);

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status === 'delivered') {
            updatedOrder.isDelivered = true;
            updatedOrder.deliveredAt = Date.now();
            updatedOrder.isPaid = true;
            updatedOrder.paidAt = Date.now();
        }

        updatedOrder.status = status;

        await updatedOrder.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            data: updatedOrder
        });
    } catch (e) {
        res.status(500).json({ message: 'Failed to update order status', error: e.message });
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order can only be cancelled if it is pending' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel order', error: error.message });
    }
}

const confirmOrderReceived = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Đơn hàng phải ở trạng thái "Đã giao hàng"' });
        }

        if (!order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now()
        }

        order.status = 'completed';
        await order.save();

        res.status(200).json({
            message: 'Order confirmed as received successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to confirm order received', error: error.message });
    }
}


module.exports = {
    createOrder,
    getDetailOrder,
    getAllOrder,
    updateOrderStatus,
    cancelOrder,
    confirmOrderReceived,
    getDetailOrderByOrderId

}