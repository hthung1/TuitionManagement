import express from "express";
import postCtrl from "../controllers/posts.js";
const router = express.Router();

router.route("/").get(postCtrl.getPosts).post(postCtrl.createPost);

router.route("/:id").patch(postCtrl.updatePost);
export default router;
