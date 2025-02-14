const autoBind = require("auto-bind");
const userModel = require("./user.model");
const dotenv = require("dotenv");
const createHttpError = require("http-errors");

dotenv.config();
class Userservice {
  #model;
  constructor() {
    autoBind(this);
    this.#model = userModel;
  }
}

module.exports = new Userservice();
