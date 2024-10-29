import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrderByOrderId } from "../../services/OrderService";

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getDetailOrderByOrderId(orderId);
                setOrderDetails(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (!orderDetails) return <div>Loading...</div>;

    return (
        <div>
            <h1>Chi tiết đơn hàng: {orderId}</h1>
        </div>
    );
};

export default OrderDetailsPage;
