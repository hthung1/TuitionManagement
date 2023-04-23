import express from "express";
import feeCtrl from "../controllers/feeCtrl.js";
const router = express.Router();

router
  .route("/")
  .post(feeCtrl.pay)
  .delete(feeCtrl.delete)
  .patch(feeCtrl.update);

export default router;
