import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import valid from "../../../utils/valid";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
} from "../../../utils/generateToken";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await login(req, res);
      break;
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Kiểm tra xem User email có tồn tại
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ err: "This email does not exists." });

    //Kiểm tra xem password có đúng?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ err: "Incorrect Password" });

    //Tạo json web token
    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    //Trả dữ liệu về dưới dạng json
    res.json({
      msg: "Đăng nhập thành công!",
      refresh_token,
      access_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
