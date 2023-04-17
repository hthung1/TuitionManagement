import express from "express";
import loginCtrl from "../controllers/loginCtrl.js";
const router = express.Router();

router.route("/").post(loginCtrl.login);
router.route("/register").get(loginCtrl.register);

export default router;
