const autoBind = require("auto-bind");
const PostModel = require("./post.model");
const OptionModel = require("../option/option.model");
const CategoryModel = require("../category/category.model");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const { PostMessage } = require("./post.message");

class PostService {
  #model;
  #optionModel;
  #categoryModel;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
    this.#optionModel = OptionModel;
    this.#categoryModel = CategoryModel;
  }

  async getCategoryOptins(categoryId) {
    const optins = await this.#optionModel.find({ category: categoryId });
    return optins;
  }

  async create(dto) {
    return this.#model.create(dto);
  }
  async find(userId) {
    if (userId && isValidObjectId(userId))
      return await this.#model.find({ userId });
    throw new createHttpError.BadRequest(PostMessage.RequestNotValid);
  }
  async findAll(options) {
    let { category, search } = options;
    const query = {};
    if (category) {
      const result = await this.#categoryModel.findOne({ slug: category });
      let categories = await this.#categoryModel.find(
        { parents: result._id },
        { _id: 1 }
      );
      categories = categories.map((item) => item._id);
      if (result) {
        query["category"] = {
          $in: [result._id, ...categories],
        };
      } else {
        return [];
      }
    }
    if (search) {
      search = new RegExp(search, "ig");
      query["$or"] = [{ title: search }, { description: search }];
    }
    const posts = await this.#model.find(query, {}, { sort: { _id: -1 } });
    return posts;
  }
  async checkExist(postId) {
    if (!postId || !isValidObjectId(postId))
      throw new createHttpError.BadRequest(PostMessage.RequestNotValid);
    const [post] = await this.#model.aggregate([
      {
        $match: { _id: new Types.ObjectId(postId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userMobile: "$user.mobile",
        },
      },
      {
        $project: {
          user: 0,
        },
      },
    ]);
    if (!post) throw new createHttpError.NotFound(PostMessage.NotFound);
    return post;
  }
  async remove(postId) {
    await this.checkExist(postId);
    await this.#model.deleteOne({ _id: postId });
  }
}
module.exports = new PostService();
