const autoBind = require("auto-bind");
const Httpcodes = require("http-codes");
const { OptionMessage } = require("./option.message");
const optionService = require("./option.service");
class OptionController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = optionService;
  }

  async create(req, res, next) {
    try {
      const {
        title,
        key,
        type,
        enum: list,
        guid,
        category,
        required,
      } = req.body;
      await this.#service.create({
        title,
        key,
        type,
        enum: list,
        guid,
        category,
        required,
      });
      return res.status(Httpcodes.CREATED).json({
        message: OptionMessage.Created,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const {
        title,
        key,
        type,
        enum: list,
        guid,
        category,
        required,
      } = req.body;
      const { id } = req.params;
      await this.#service.update(id, {
        title,
        key,
        type,
        enum: list,
        guid,
        category,
        required,
      });
      return res.json({
        message: OptionMessage.Updated,
      });
    } catch (error) {
      next(error);
    }
  }
  async find(req, res, next) {
    try {
      const option = await this.#service.find();
      return res.json(option);
    } catch (error) {
      next(error);
    }
  }
  async findByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const options = await this.#service.findByCategoryId(categoryId);
      return res.json(options);
    } catch (error) {
      next(error);
    }
  }
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const option = await this.#service.findById(id);
      return res.json(option);
    } catch (error) {
      next(error);
    }
  }
  async removedById(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.removeById(id);
      return res.json({
        message: OptionMessage.Deleted,
      });
    } catch (error) {
      next(error);
    }
  }
  async findByCategorySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const option = await this.#service.findByCategorySlug(slug);
      return res.json(option);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OptionController();
