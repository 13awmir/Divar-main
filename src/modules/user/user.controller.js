
const UserService = require("./user.service");
const autoBind = require("auto-bind");
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async whoami(req, res, next) {
    try {
      const user = req.user;
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
