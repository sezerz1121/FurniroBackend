import { Router } from "express";
import { productListing,productList,productAll,savedProductList,productInfo,orderProductList } from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/product").post(
upload.fields([
    {
        name:"productImage",
        maxCount: 1
    }
]),productListing)
router.route("/productList").post(productList)
router.route("/productAll").get(productAll)
router.route("/savedproductlist").post(savedProductList)
router.route("/productinfo").post(productInfo)
router.route("/orderproduct").post(orderProductList)

export default router