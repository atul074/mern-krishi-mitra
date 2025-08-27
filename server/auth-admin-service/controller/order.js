import Order from "../model/order.js";
import { sendMessage } from "../utility/producer.js";
import { Counter } from "prom-client";

// per-controller Prometheus counter (optional extra)
const requestCounter = new Counter({
  name: "admin_orders_requests_total",
  help: "Total Admin Orders API requests",
  labelNames: ["method", "route", "status"]
});

const countRequest = (req, res) => {
  res.on("finish", () => {
    try {
      requestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
    } catch (e) {
      // ignore metric errors
    }
  });
};

const getAllOrdersOfAllUsers = async (req, res) => {
  countRequest(req, res);
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    // produce Kafka event (non-blocking)
    sendMessage("order-events", { type: "ORDERS_FETCHED", data: orders });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  countRequest(req, res);
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // produce Kafka event
    sendMessage("order-events", { type: "ORDER_DETAIL_FETCHED", data: order });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  countRequest(req, res);
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    // produce Kafka event
    sendMessage("order-events", { type: "ORDER_STATUS_UPDATED", data: { id, orderStatus } });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export  {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
