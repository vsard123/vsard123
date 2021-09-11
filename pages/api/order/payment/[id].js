import connectDB from "../../../../utils/connectDB";
import auth from "../../../../middleware/auth";
import Orders from "../../../../models/orderModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await paymentOrder(req, res);
      break;
  }
};

const paymentOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result === "user") {
      const { id } = req.query;
      const { paymentId } = req.body;

      await Orders.findOneAndUpdate(
        { _id: id },
        {
          paid: true,
          dateOfPayment: new Date().toISOString(),
          paymentId,
          method: "Paypal",
        }
      );
      res.json({ msg: "Thanh toán thành công!" });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
