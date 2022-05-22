const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth")
const authAdmin =require("../middleware/authAdmin")
router
  .get("/user",auth, authAdmin, userCtrl.listUser)
  .post("/user/login", userCtrl.login)
  .post("/user/register", userCtrl.register);
module.exports = router;
