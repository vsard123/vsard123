import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { useRouter } from "next/router";

import Head from "next/head";

import OrderDetail from "../../components/OrderDetail";

const DetailOrders = () => {
  const { state, dispatch } = useContext(DataContext);
  //const orders = state.orders
  const { orders, auth } = state;
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  if (!auth.user) return null;

  return (
    <div className="my-3">
      <Head>
        <title>Chi tiết đơn hàng</title>
      </Head>
      <div className="">
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Trở
          về
        </button>
        <OrderDetail
          orderDetail={orderDetail}
          state={state}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};

export default DetailOrders;
