import { Router } from "express";
import { addressSetup } from "../controllers/address.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/addresssetup").post(addressSetup);


export default router