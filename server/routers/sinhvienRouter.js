import express from "express";
import sinhvienCtrl from "../controllers/sinhvienCtrl.js";
const router = express.Router();

router.route("/").get(sinhvienCtrl.getSinhvien);

export default router;
