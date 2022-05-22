const Users = require("../models/userModel");
const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({ _id: req.user.userId });
    //role==0->user,1->admin
    if (!user.isAdmin) {
      return res.status(400).json({ msg: "admin resources access denied" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
module.exports = authAdmin;

