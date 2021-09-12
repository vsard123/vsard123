import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProducts(req, res);
      break;
  }
};

const getProducts = async (req, res) => {
  try {
    const product = await Products.find();
    if (!product)
      return res.status(400).json({ err: "Sản phẩm không tồn tại" });
    res.json({ product });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
