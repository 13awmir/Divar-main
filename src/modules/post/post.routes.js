const { Router } = require("express");
const postController = require("./post.controller");
const { upload } = require("../../common/utils/multer");
const router = Router();
const Authorization = require("../../common/guard/authorization.guard");
router.get("/create", Authorization, postController.creatPostPage);
router.post(
  "/create",
  Authorization,
  upload.array("images", 10),
  postController.create
);
router.get("/my", Authorization, postController.findMyposts);
router.delete("/delete/:id", Authorization, postController.remove);
router.get("/:id", postController.showPost);

module.exports = {
  PostRouter: router,
};
