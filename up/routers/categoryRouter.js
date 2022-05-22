const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middleware/auth")
const authAdmin =require("../middleware/authAdmin")
router
  .get("/category", categoryCtrl.categoryList)
  .post("/category", auth, authAdmin, categoryCtrl.createCategory);
router
  .delete("/category/:id", auth, authAdmin, categoryCtrl.deleteCategory)
  .put("/category/:id", auth, authAdmin, categoryCtrl.updateCategory)
  .get("/category/:id", auth, authAdmin, categoryCtrl.category);
module.exports = router;
