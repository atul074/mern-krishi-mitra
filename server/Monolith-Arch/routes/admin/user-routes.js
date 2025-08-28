const express = require("express");

const {
  fetchAllUsers
} = require("../../controllers/admin/user-controller");



const router = express.Router();



router.get("/get", fetchAllUsers);

module.exports = router;