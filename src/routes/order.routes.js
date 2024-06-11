import { Router } from "express";
import { Buy , orderList } from "../controllers/order.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/buy").post(Buy);
router.route("/userorders").post(orderList);


export default router