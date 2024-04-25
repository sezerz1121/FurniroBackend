import { Router } from "express";
import { registerUser, PDF} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"

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
router.route("/pdf").get(PDF)

export default router