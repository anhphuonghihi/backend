const router = require("express").Router();
const orderCtrl = require("../controllers/orderCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
router
  .get("/order", orderCtrl.orderList)
  .post("/order", auth, orderCtrl.createOrder);
  router.get("/order/totalSales", auth,orderCtrl.totalSales);
router.get("/order/count", auth,orderCtrl.count);
router
  .delete("/order/:id", auth, orderCtrl.deleteOrder)
  .put("/order/:id", auth, orderCtrl.updateOrder)
  .get("/order/:id",  orderCtrl.order);
module.exports = router;
