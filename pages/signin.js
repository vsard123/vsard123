import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import valid from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import IconButton from "@material-ui/core/IconButton";
import FacebookIcon from "@material-ui/icons/Facebook";
import { Container } from "@material-ui/core";

const Signin = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  //Lay State tu DataContext
  const { state, dispatch } = useContext(DataContext);

  //Lay thong tin User tu Store
  const { auth } = state;

  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    //lấy thông tin user từ api auth/login
    const res = await postData("auth/login", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    //Đẩy thông tin user lên store
    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };

  //Nếu đã Login rồi thì sẽ đẩy sang trang Home
  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <Container className="py-5">
      <Head>
        <title>Đăng Nhập</title>
      </Head>
      <form
        className="mx-auto my-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group social-login d-flex justify-content-between">
          <IconButton
            aria-label="Đăng nhập bằng Facebook"
            style={{
              backgroundColor: "rgb(59, 89, 153)",
              color: "rgb(255, 255, 255)",
              borderRadius: "8px",
              minWidth: "240px",
            }}
            className="py-2"
          >
            <FacebookIcon color="inherit" />
            <span className="pl-2" style={{ fontSize: "15px" }}>
              Đăng nhập bằng Facebook
            </span>
          </IconButton>
          <IconButton
            aria-label="Đăng nhập bằng Google"
            style={{
              backgroundColor: "#CF1515",
              color: "rgb(255, 255, 255)",
              borderRadius: "8px",
              minWidth: "240px",
            }}
            className="py-2"
          >
            <i
              className="fab fa-google"
              aria-hidden="true"
              style={{ fontSize: "16px" }}
            ></i>
            <span className="pl-2" style={{ fontSize: "15px" }}>
              Đăng nhập bằng Google
            </span>
          </IconButton>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Đăng nhập
        </button>
        <p className="my-2">
          Bạn chưa có tài khoản?
          <Link href="/register">
            <a style={{ color: "crimson" }}> Đăng ký ngay </a>
          </Link>
        </p>
      </form>
    </Container>
  );
};

export default Signin;
