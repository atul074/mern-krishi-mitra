// controllers/orderController.js
const Order = require("../model/order");
const Cart = require("../model/cart");
const Product = require("../model/product");
const paypal = require("../utility/paypal");
const { sendToQueue } = require("../utility/rabbitmq");
const { httpRequestDuration } = require("../utility/metrics");
const twilio = require("twilio");

// Twilio setup (for SMS)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * ========================
 * ADMIN FUNCTIONS
 * ========================
 */

// ✅ Get all orders of all users
const getAllOrdersOfAllUsers = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    end({ route: "getAllOrdersOfAllUsers", method: "GET", status_code: 200 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    end({ route: "getAllOrdersOfAllUsers", method: "GET", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get single order details (admin)
const getOrderDetailsForAdmin = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    end({ route: "getOrderDetailsForAdmin", method: "GET", status_code: 200 });
    res.status(200).json({ success: true, order });
  } catch (err) {
    end({ route: "getOrderDetailsForAdmin", method: "GET", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update order status
const updateOrderStatus = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus, orderUpdateDate: new Date() },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Publish to RabbitMQ
    sendToQueue("order_updates", { orderId, orderStatus });

    end({ route: "updateOrderStatus", method: "PUT", status_code: 200 });
    res.status(200).json({ success: true, order });
  } catch (err) {
    end({ route: "updateOrderStatus", method: "PUT", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * BUYER FUNCTIONS
 * ========================
 */

//  Create order (from cart)
const createOrder = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { userId, addressInfo, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      buyerId: userId,
      sellerId: cart.items[0].productId.userId,
      cartId: cart._id,
      cartItems: cart.items.map((item) => ({
        productId: item.productId._id,
        title: item.productId.title,
        image: item.productId.image,
        price: item.productId.price,
        quantity: item.quantity,
      })),
      addressInfo,
      orderStatus: "Pending",
      paymentMethod,
      paymentStatus: "Unpaid",
      totalAmount,
      orderDate: new Date(),
    });

    await order.save();

    // Publish event
    sendToQueue("new_orders", { orderId: order._id, buyerId: userId });

    end({ route: "createOrder", method: "POST", status_code: 201 });
    res.status(201).json({ success: true, order });
  } catch (err) {
    end({ route: "createOrder", method: "POST", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Capture payment (PayPal)
const capturePayment = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { orderId, paymentId, payerId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Execute PayPal payment
    paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, payment) => {
      if (error) {
        end({ route: "capturePayment", method: "POST", status_code: 500 });
        return res.status(500).json({ success: false, message: error.response });
      }

      order.paymentStatus = "Paid";
      order.paymentId = paymentId;
      order.payerId = payerId;
      order.orderStatus = "Confirmed";
      order.orderUpdateDate = new Date();

      await order.save();

      sendToQueue("payment_captured", { orderId: order._id, paymentId });

      end({ route: "capturePayment", method: "POST", status_code: 200 });
      res.status(200).json({ success: true, order });
    });
  } catch (err) {
    end({ route: "capturePayment", method: "POST", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all orders by user
const getAllOrdersByUser = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { userId } = req.params;
    const orders = await Order.find({ buyerId: userId }).sort({ orderDate: -1 });

    end({ route: "getAllOrdersByUser", method: "GET", status_code: 200 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    end({ route: "getAllOrdersByUser", method: "GET", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get order details by user
const getOrderDetails = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    end({ route: "getOrderDetails", method: "GET", status_code: 200 });
    res.status(200).json({ success: true, order });
  } catch (err) {
    end({ route: "getOrderDetails", method: "GET", status_code: 500 });
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * UTILITY
 * ========================
 */

// ✅ Send SMS using Twilio
const sendSms = async (phone, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return response;
  } catch (err) {
    console.error("Error sending SMS:", err.message);
    throw err;
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  sendSms,
};
