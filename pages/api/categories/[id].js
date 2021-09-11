import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Categories from "../../../models/categoriesModel";
import Products from "../../../models/productModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategories(req, res);
      break;
    case "DELETE":
      await deleteCategories(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // if (queryObj.title !== "all")
    //   this.query.find({ title: { $regex: queryObj.title } });

    this.query.find();
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const updateCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { name, parent_id, icon } = req.body;
    const slug = StringToSlug(name);
    const newCategory = await Categories.findOneAndUpdate(
      { _id: id },
      { name, parent_id, icon, slug }
    );
    res.json({
      msg: "Update Categories Success",
      category: { ...newCategory._doc, name },
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const deleteCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Xác thực không hợp lệ!" });

    const { id } = req.query;

    const products = await Products.findOne({ category: id });
    if (products)
      return res
        .status(400)
        .json({ err: "Vui lòng xóa tất cả sản phẩm trong danh mục này!" });

    await Categories.findByIdAndDelete(id);
    res.json({ msg: "Xóa danh mục thành công!" });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const { id } = req.query;
    let features;

    features = new APIfeatures(Products.find({ category: id }), req.query)
      .filtering()
      .sorting()
      .paginating();

    const products = await features.query;

    const category = await Categories.findById(id);
    if (!category)
      return res.status(400).json({ err: "Danh mục không tồn tại" });

    res.json({
      status: "success",
      result: products.length,
      products,
      category,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const StringToSlug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaaaeeeeiiiioooouuuunc------";

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, ""); // trim - from end of text

  return str;
};
