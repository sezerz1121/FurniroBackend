import { Router } from "express";
import  {saveProduct,checksavedProduct,unsaveProduct,savedProductList} from '../controllers/saved.controller.js'
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/saveproduct").post(saveProduct);
router.route("/unsaveproduct").post(unsaveProduct);
router.route("/checksavedproduct").post(checksavedProduct);
router.route("/savedproductlist").post(savedProductList);


export default router