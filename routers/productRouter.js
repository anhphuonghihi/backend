const router = require("express").Router();
const productCtrl = require("../controllers/productCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const multer = require("multer");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isVaild = FILE_TYPE_MAP[file.mimetype];
    let uploadErr = new Error("isVaild image type");
    if (isVaild) {
      uploadErr = null;
    }
    cb(uploadErr, "public/upload");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

router
  .get("/product", productCtrl.productList)
  .post(
    "/product",
    upload.single("image"),
    auth,
    authAdmin,
    productCtrl.createProduct
  );
router.get("/product/count", productCtrl.count);
router.get("/product/featured", productCtrl.featured);
router.get("/product/featured/:count", productCtrl.featuredCount);
router
  .delete("/product/:id", auth, authAdmin, productCtrl.deleteProduct)
  .put("/product/:id", auth, authAdmin, productCtrl.updateProduct)
  .get("/product/:id", auth, authAdmin, productCtrl.product);
router.put(
  "/product/image/:id",
  auth,
  authAdmin,
  upload.array("images", 10),
  productCtrl.updateImage
);
module.exports = router;
