import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import CartItem from "../components/CartItem";
import Link from "next/link";
import { getData, postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Cart = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;

  const [total, setTotal] = useState(0);

  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [callback, setCallback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(res);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("__next__cart01__devat"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          try {
            const { _id, title, images, price, price_sale, inStock, sold } =
              res.product;

            if (inStock > 0) {
              newArr.push({
                _id,
                title,
                images,
                price,
                price_sale,
                inStock,
                sold,
                quantity: item.quantity > inStock ? 1 : item.quantity,
              });
            }
          } catch (error) {}
        }

        dispatch({ type: "ADD_CART", payload: newArr });
      };

      updateCart();
    }
  }, [callback]);

  const handlePayment = async () => {
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: {
          error: "Vui lòng thêm địa chỉ và điện thoại di động của bạn!",
        },
      });

    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      return dispatch({
        type: "NOTIFY",
        payload: {
          error: "Sản phẩm hết hàng hoặc số lượng không đủ!",
        },
      });
    }

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    postData("order", { address, mobile, cart, total }, auth.token).then(
      (res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "ADD_CART", payload: [] });

        const newOrder = {
          ...res.newOrder,
          user: auth.user,
        };
        dispatch({ type: "ADD_ORDERS", payload: [...orders, newOrder] });
        dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        return router.push(`/order/${res.newOrder._id}`);
      }
    );
  };

  if (cart.length === 0)
    return (
      <img
        className="py-5 img-responsive w-100"
        src="/empty_cart.jpg"
        alt="not empty"
      />
    );

  return (
    <div className="row mx-auto py-5">
      <Head>
        <title>Giỏ hàng</title>
      </Head>

      <div className="col-md-12 text-secondary table-responsive my-3">
        <h4 className="text-capitalize text-center" style={{ color: "#000" }}>
          Giỏ hàng
        </h4>

        <table className="table my-3 table-bordered table-cart">
          <thead className="thead-dark">
            <tr>
              <th>Sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá tiền</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                dispatch={dispatch}
                cart={cart}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-md-4 offset-md-8 my-5 text-secondary">
        <form>
          <h4 className="text-capitalize mb-3" style={{ color: "#000" }}>
            Thông tin giao hàng
          </h4>

          <div className="form-group">
            {/* <label htmlFor="address">Địa chỉ</label> */}

            <input
              type="text"
              name="address"
              id="address"
              className="form-control mb-2"
              placeholder="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            {/* <label htmlFor="mobile">Số điện thoại</label> */}
            <input
              type="text"
              name="mobile"
              id="mobile"
              className="form-control mb-2"
              value={mobile}
              placeholder="Số điện thoại"
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </form>

        <h4 className="py-4 text-right">
          Tổng tiền:
          <span className="text-danger pl-2">
            {total.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </h4>

        <Link href={auth.user ? "#!" : "/signin"}>
          <a className="btn btn-info my-2 float-right" onClick={handlePayment}>
            Thanh toán
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
