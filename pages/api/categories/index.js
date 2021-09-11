import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModel";
import auth from "../../../middleware/auth";
// import StringToSlug from "../../../utils/slug";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCategory(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

const createCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Xác thực không hợp lệ!" });

    const { name, parent_id, icon } = req.body;
    if (!name) return res.status(400).json({ err: "Tên không được để trống" });
    const slug = StringToSlug(name);
    const newCategory = new Categories({ name, parent_id, icon, slug });

    await newCategory.save();
    res.json({
      msg: "Thêm danh mục thành công",
      newCategory,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();

    res.json({ categories });
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
