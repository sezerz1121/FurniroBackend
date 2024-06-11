import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,userInfo,userProductSave,userProductRemove,userProductCheck} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount: 1
    },
    {
        name:"coverImage",
        maxCount: 1
    }
]),registerUser);
// router.route("/pdf").get(PDF);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").post(verfiyJWT,logoutUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/userinfo").post(userInfo);
router.route("/userproductsave").post(userProductSave);
router.route("/userproductremove").post(userProductRemove);
router.route("/userproductsavecheck").post(userProductCheck);


export default router