import User from "../model/user.js";
import { producer } from "../utility/producer.js";
import { Counter } from "prom-client";


// Prometheus metric
const requestCounter = new Counter({
  name: "admin_users_requests_total",
  help: "Total Admin Users API requests",
  labelNames: ["method", "route", "status"]
});

const countRequest = (req, res) => {
  res.on("finish", () => {
    requestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
};

// Existing function wrapped
const fetchAllUsers = async (req, res) => {
  countRequest(req, res);
  try {
    const listOfUsers = await User.find({});
    
    await producer.send({
      topic: "user-events",
      messages: [{ value: JSON.stringify({ type: "USERS_FETCHED", data: listOfUsers }) }]
    });

    res.status(200).json({
      success: true,
      data: listOfUsers,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

export { fetchAllUsers };
