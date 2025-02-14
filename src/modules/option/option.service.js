const autoBind = require("auto-bind");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const { OptionMessage } = require("./option.message");
const { default: slugify } = require("slugify");
const OptionModel = require("./option.model");
const CategoryModel = require("../category/category.model");
const CategoryService = require("../category/category.service");
const { isTrue, isFalse } = require("../../common/utils/functions");

class optionService {
  #categoryModel;
  #model;
  #categoryService
  constructor() {
    autoBind(this);
    this.#categoryModel = CategoryModel;
    this.#model = OptionModel;
    this.#categoryService = CategoryService;
  }
  async find() {
    const option = await this.#model
      .find({}, { __v: 0 }, { sort: { _id: -1 } })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
    return option;
  }
  async create(optionDto) {
    const category = await this.checkExistById(optionDto.category);
    optionDto.category = category._id;
    optionDto.key = slugify(optionDto.key, {
      trim: true,
      replacement: "_",
      lower: true,
    });
    await this.alredyExistByCategoryAndKey(optionDto.key, category._id);
    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (!Array.isArray(optionDto.enum)) optionDto.enum = [];
    const option = await this.#model.create(optionDto);
    return option;
  }
  async update(id , optionDto) {
    const existOption = await this.checkExistByOptionId(id);
    if(optionDto.category && isValidObjectId(optionDto.category)) {
      const category = await this.#categoryService.checkExistById(optionDto.category)
      optionDto.category = category._id
    }else {
      delete optionDto.category
    }
    if(optionDto.slug) {
      optionDto.key = slugify(optionDto.key, {
        trim: true,
        replacement: "_",
        lower: true,
      });
      let categoryId = existOption.category
      if(optionDto.category) categoryId = optionDto.category
      await this.alredyExistByCategoryAndKey(optionDto.key , categoryId)
    }
    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (!Array.isArray(optionDto.enum)) delete optionDto.enum;
    if(isTrue(optionDto?.required)) optionDto.required = true;
    else if(isFalse(optionDto?.required)) optionDto.required = false;
    else delete optionDto?.required;
    return await this.#model.updateOne({_id: id} , {$set: optionDto})
  }
  async findById(id) {
    return await this.checkExistByOptionId(id);
  }
  async removeById(id) {
    await this.checkExistByOptionId(id);
    return await this.#model.deleteOne({ _id: id });
  }
  async findByCategorySlug(slug) {
    const options = await this.#model.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $addFields: {
          categorySlug: "$category.slug",
          categoryName: "$category.name",
          categoryIcon: "$category.icon",
        },
      },
      {
        $project: {
          category: 0,
          __v: 0,
        },
      },
      {
        $match: {
          categorySlug: slug,
        },
      },
    ]);
    return options;
  }
  async findByCategoryId(category) {
    return await this.#model
      .find({ category }, { __v: 0 })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
  }
  async checkExistById(id) {
    const category = await this.#categoryModel.findById(id, { __v: 0 });
    if (!category) throw new createHttpError.NotFound(OptionMessage.NotFound);
    return category;
  }
  async checkExistByOptionId(id) {
    const option = await this.#model.findById(id, { __v: 0 });
    if (!option) throw new createHttpError.NotFound(OptionMessage.NotFound);
    return option;
  }
  async alredyExistByCategoryAndKey(key, category) {
    const isExist = await this.#model.findOne({ category, key });
    if (isExist) throw new createHttpError.Conflict(OptionMessage.AlreadyExist);
    return null;
  }
}

module.exports = new optionService();
