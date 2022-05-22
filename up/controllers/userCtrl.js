const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCtrl = {
  listUser: async (req, res) => {
    try {
      const user = await Users.find();
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists" });
      if (password.length < 6)
        return res.status(400).json({ msg: "password is at the 6 char" });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await Users({
        name,
        email,
        password: passwordHash,
        phone,
      });
      await newUser.save();
      const accesstoken = jwt.sign({ userId: newUser._id }, process.env.ACCESS, {
        expiresIn: "1d",
      });
      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exists" });
      const isWatch = await bcrypt.compare(password, user.password);
      if (!isWatch) return res.status(400).json({ msg: "incorrect password" });
      const accesstoken = jwt.sign({ userId: user._id }, process.env.ACCESS, {
        expiresIn: "1d",
      });
      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = userCtrl;
