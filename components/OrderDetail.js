import React from "react";
import Link from "next/link";
import PaypalBtn from "./PaypalBtn";
import { patchData } from "../utils/fetchData";
import { updateItem } from "../store/Actions";

const OrderDetail = ({ orderDetail, state, dispatch }) => {
  const { auth, orders } = state;

  const handleDelivered = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      const { paid, dateOfPayment, method, delivered } = res.result;

      dispatch(
        updateItem(
          orders,
          order._id,
          {
            ...order,
            paid,
            dateOfPayment,
            method,
            delivered,
          },
          "ADD_ORDERS"
        )
      );

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          style={{ margin: "20px auto" }}
          className="row justify-content-around"
        >
          <div className="text-uppercase my-3" style={{ maxWidth: "600px" }}>
            <h2 className="text-break">Đơn hàng {order._id}</h2>
            <div className="mt-4 text-secondary">
              <h4>Thông tin</h4>
              <p>Tên người nhận: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Địa chỉ: {order.address}</p>
              <p>Số điện thoại: {order.mobile}</p>
            </div>

            <div
              className={`alert ${
                order.delivered ? "alert-success" : "alert-danger"
              } d-flex justify-content-between align-items-center`}
              role="alert"
            >
              {order.delivered
                ? `Delivered on ${order.updatedAt}`
                : "Chưa được giao"}
              {auth.user.role === "admin" && !order.delivered && (
                <button
                  className="btn btn-dark text-uppercase"
                  onClick={() => handleDelivered(order)}
                >
                  Đánh dấu đã giao
                </button>
              )}
            </div>

            <h3>Phương thức thanh toán</h3>
            {order.method && (
              <h6>
                Phương thức: <em>{order.method}</em>
              </h6>
            )}

            {order.paymentId && (
              <p>
                PaymentId: <em>{order.paymentId}</em>
              </p>
            )}
            <div
              className={`alert ${
                order.paid ? "alert-success" : "alert-danger"
              } d-flex justify-content-between align-items-center`}
              role="alert"
            >
              {order.paid
                ? `Đã thanh toán ${order.dayOfPayment}`
                : "Chưa thanh toán"}
            </div>

            <div>
              <h4>Sản phẩm</h4>
              {order.cart.map((item) => (
                <div
                  className="row border-bottom mx-0 p-2 justify-content-between align-middle"
                  key={item._id}
                  style={{ maxWidth: "550px" }}
                >
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    style={{
                      width: "50px",
                      height: "45px",
                      objectFit: "cover",
                    }}
                  />
                  <h6 className="flex-fill text-secondary px-3 m-0">
                    <Link href={`/product/${item._id}`}>
                      <a>{item.title}</a>
                    </Link>
                  </h6>
                  <span className="text-info text-lowercase m-0">
                    {item.quantity} x ${item.price} = $
                    {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {!order.paid && auth.user.role !== "admin" && (
            <div className="p-4">
              <h2 className="text-uppercase mb-4">
                Tổng tiền: {order.total} Vnđ{" "}
              </h2>
              <PaypalBtn total={order.total} order={order} />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default OrderDetail;
