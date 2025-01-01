const User=require("../../models/User");


const fetchAllUsers = async (req, res) => {
    try {
      const listOfUsers = await User.find({});
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

  module.exports = {
    fetchAllUsers
  };
