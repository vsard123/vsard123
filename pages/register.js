import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import valid from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";
import Typography from "@material-ui/core/Typography";

const Register = () => {
  const initialState = { name: "", email: "", password: "", cf_password: "" };
  const [userData, setUserData] = useState(initialState);
  const { name, email, password, cf_password } = userData;

  const router = useRouter();

  //Lay State tu DataContext
  const { state, dispatch } = useContext(DataContext);

  //Lay auth tu store
  const { auth } = state;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = valid(name, email, password, cf_password);
    if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await postData("auth/register", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  //Nếu đã Login rồi thì sẽ đẩy sang trang Home
  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <div>
      <Head>
        <title>Đăng kí</title>
      </Head>
      <form
        className="mx-auto my-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" className="mb-2 text-center" color="initial">
          Đăng ký
        </Typography>

        <div className="form-group form-register">
          <label htmlFor="name">Tên</label>
          <input
            type="text"
            className="form-control"
            id="name"
            aria-describedby="name"
            name="name"
            value={name}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Địa chỉ Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
          <small id="emailHelp" className="form-text text-muted">
            Chúng tôi sẽ không bao giờ chia sẻ email của bạn với bất kỳ ai khác.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Nhập lại mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Đăng kí
        </button>
        <p className="my-2">
          Bạn đã có tài khoản?
          <Link href="/signin">
            <a style={{ color: "crimson" }}> Đăng nhập </a>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
