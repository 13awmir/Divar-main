const { Router } = require("express");
const { Authrouter } = require("./modules/auth/auth.routes");
const { Userrouter } = require("./modules/user/user.routes");
const { CategoryRouter } = require("./modules/category/category.routes");
const { OptionRoutes } = require("./modules/option/option.routes");
const { PostRouter } = require("./modules/post/post.routes");
const postController = require("../src/modules/post/post.controller");

const mainRoutes = Router();
mainRoutes.use("/auth", Authrouter);
mainRoutes.use("/user", Userrouter);
mainRoutes.use("/category", CategoryRouter);
mainRoutes.use("/option", OptionRoutes);
mainRoutes.use("/post", PostRouter);
mainRoutes.get("/", postController.postList);
mainRoutes.get("/panel", (req, res) => {
  res.render("./pages/panel/dashboard.ejs");
});
mainRoutes.get("/auth/login", (req, res) => {
  res.locals.layout = "./layouts/auth/main.ejs";
  res.render("./pages/auth/login.ejs");
});
module.exports = mainRoutes;
