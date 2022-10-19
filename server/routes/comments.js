import express from "express";

import AuthMiddleware from "../middlewares/AuthMiddleware.js";

import CommentsController from "../controllers/comments.js";

const router = express.Router();

router
  .route("/")
  .get(CommentsController.getPosts)
  .post(AuthMiddleware.validateToken, CommentsController.postPosts);

router.route("/:postId").get(CommentsController.getPostId);

export default router;
