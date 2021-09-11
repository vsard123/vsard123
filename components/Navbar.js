import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";
import Container from "@material-ui/core/Container";

const Navbar = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);

  //lay du lieu tu store
  const { auth, cart } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return "active";
    } else {
      return "";
    }
  };

  //Ham logout
  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Logged Out!" } });
    return router.push("/");
  };

  const adminRouter = () => {
    return (
      <>
        <Link href="/users">
          <a className="dropdown-item">Users</a>
        </Link>
        <Link href="/create">
          <a className="dropdown-item">Products</a>
        </Link>
        <Link href="/categories">
          <a className="dropdown-item">Categories</a>
        </Link>
      </>
    );
  };

  //Neu đã Login
  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt="avatar"
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              transform: "translateY(-3px)",
              marginRight: "3px",
            }}
          />{" "}
          {auth.user.name}
        </a>

        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <Link href="/profile">
            <a className="dropdown-item">Profile</a>
          </Link>
          {auth.user.role === "admin" && adminRouter()}
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </li>
    );
  };
  return (
    <header className="bg-light">
      <Container maxWidth="lg">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link href="/">
            <a className="navbar-brand">MCTGear</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav ">
              {Object.keys(auth).length === 0 ? (
                <li className="nav-item">
                  <Link href="/signin">
                    <a className={"nav-link " + isActive(`/signin`)} href="#">
                      <i className="fas fa-user" aria-hidden="true"></i> Sign In
                    </a>
                  </Link>
                </li>
              ) : (
                loggedRouter()
              )}
              <li className="nav-item">
                <Link href="/cart">
                  <a className={"nav-link " + isActive(`/cart`)} href="#">
                    <i
                      className="fas fa-shopping-cart position-relative"
                      aria-hidden="true"
                    >
                      <span
                        className="position-absolute"
                        style={{
                          padding: "4px 8px",
                          background: "#ed143dc2",
                          borderRadius: "50%",
                          top: "-10px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                      >
                        {cart.length}
                      </span>
                    </i>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
