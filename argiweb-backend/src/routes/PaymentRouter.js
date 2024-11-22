const express = require("express");
const axios = require("axios");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/OrderProduct");

const config = require("./config");

router.post("/createMoMo", async (req, res) => {
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  const { amount, idOrder } = req.body;
  var orderId = idOrder;
  var requestId = orderId;

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //signature
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });
  //Options for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios(options);
    console.log("MoMo response:", result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

router.post("/callbackMOMO", async (req, res) => {
  const { orderId, resultCode, transId } = req.body;
  try {
    const order = await Order.findOne({ idOrder: orderId });

    if (!order) {
      console.log("Order not found.");
      return res.status(404).json({ message: "Order not found" });
    }

    if (resultCode === 0) {
      order.isPaid = true;
      order.status = "processing";
      order.paidAt = new Date();
      order.momoOrderId = transId;
    }

    await order.save();
    console.log("Order updated based on Momo callback.");

    res.status(204).end();
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

router.post("/check-status-transaction", async (req, res) => {
  const { orderId } = req.body;

  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var accessKey = "F8BBA842ECF85";

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  const result = await axios(options);

  if (result.data.resultCode === "0") {
    try {
      const order = await Order.findOne({ idOrder: orderId });

      if (order) {
        order.isPaid = true;
        order.status = "processing";
        order.paidAt = new Date();
        order.momoOrderId = result.data.transId;
        await order.save();
        console.log("Order updated successfully.");
      } else {
        console.log("Order not found.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order status" });
    }
  }

  return res.status(200).json(result.data);
});

module.exports = router;
