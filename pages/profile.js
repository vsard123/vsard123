import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";

import valid from "../utils/valid";
import { patchData } from "../utils/fetchData";

import { imageUpload } from "../utils/imageUpload";

const profile = () => {
  const initialState = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
  };
  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    //Nếu tồn tại password thì gọi hàm updatePassword
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    }

    //Nếu name đã được thay đổi hoặc tồn tại avatar thì gọi hàm updateInfo
    if (name !== auth.user.name || avatar) updateInfor();
  };

  //Hàm thay đổi thông tin(tên và avatar)
  const updateInfor = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      "user",
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "AUTH",
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  //Hàm thay đổi Password
  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.msg } });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  //Hàm thay đổi avatar
  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File không tồn tại!" },
      });

    if (file.size > 1024 * 1024)
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Kích thước hình ảnh lớn nhất là 1 Mb" },
      });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      //type jpeg hoac png
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Định dạng hình ảnh không chính xác!" },
      });

    setData({ ...data, avatar: file });
  };

  if (!auth.user) return null;
  return (
    <div className="profile_page py-3">
      <Head>
        <title>Quản lý tài khoản</title>
      </Head>
      <section className="row text-secondary">
        <div className="col-md-4">
          <h4 className="text-center text-uppercase">
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </h4>
          {/* AVATAR */}
          <div className="avatar">
            <img
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt="avatar"
            />
            <span>
              <i className="fas fa-camera"></i>
              <p>Thay đổi</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
                accept="image/*"
              />
            </span>
          </div>
          {/* NAME */}
          <div className="form-group">
            <label htmlFor="name">Tên</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              className="form-control"
              placeholder="Nhập tên"
              onChange={handleChange}
            />
          </div>
          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Địa chỉ Email</label>
            <input
              type="text"
              name="email"
              id="email"
              defaultValue={auth.user.email}
              className="form-control"
              placeholder="Nhập Email"
              readOnly
            />
          </div>
          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="passwprd">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={password}
              className="form-control"
              placeholder="Mật khẩu mới"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cf_password">Nhập lại mật khẩu</label>
            <input
              type="password"
              name="cf_password"
              value={cf_password}
              className="form-control"
              placeholder="Nhập lại mật khẩu mới"
              onChange={handleChange}
            />
          </div>
          <button
            className="btn btn-info"
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Cập nhật
          </button>
        </div>
        <div className="col-md-8 ">
          <h4 className="text-uppercase">Danh sách đơn hàng</h4>
          <div className="my-3 table-responsive">
            <table
              className="table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: "600px", cursor: "pointer" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">Ngày mua</td>
                  <td className="p-2">Tông cộng</td>
                  <td className="p-2">Tình trạng giao hàng</td>
                  <td className="p-2">Tình trạng thanh toán</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>
                        <a>{order._id}</a>
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">
                      {order.delivered ? (
                        <i
                          className="fas fa-check text-success"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <i
                          className="fas fa-times text-danger"
                          aria-hidden="true"
                        ></i>
                      )}
                    </td>
                    <td className="p-2">
                      {order.paid ? (
                        <i
                          className="fas fa-check text-success"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <i
                          className="fas fa-times text-danger"
                          aria-hidden="true"
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default profile;
