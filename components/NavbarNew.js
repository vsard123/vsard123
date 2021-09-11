import React, { useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import { getData } from "../utils/fetchData";
import DrawerMenu from "../components/DrawerMenu";
import Cookie from "js-cookie";

//Meterial UI
import { alpha, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MailIcon from "@material-ui/icons/Mail";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import MoreIcon from "@material-ui/icons/MoreVert";
import Container from "@material-ui/core/Container";
import { Hidden, Divider, Drawer } from "@material-ui/core";

const drawerWidth = 240;

//Styles
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  toolbar: {
    margin: "0 auto",
    padding: "0 0 0 0",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.5),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    borderRadius: "10px",
    boxShadow:
      " rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "000",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      marginRight: 0,
    },
  },
  inputRoot: {},
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const { window } = props;
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);

  //lay du lieu tu store
  const { auth, cart } = state;
  let role;
  if (auth.user) {
    role = auth.user.role;
  } else {
    role = "";
  }

  const isActive = (r) => {
    if (r === router.pathname) {
      return "active";
    } else {
      return "";
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [dataSearch, setDataSearch] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const typingTimeoutRef = useRef(null);

  const handleChangSearch = (e) => {
    setSearch(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      const title = e.target.value;
      const res = await getData(`search?limit=6&title=${title}`);
      setDataSearch(res.products);
    }, 300);
  };

  // useEffect(async () => {
  //   if (search !== "") {
  //     const res = await getData(`search?limit=6&title=${search}`);
  //     setDataSearch(res.products);
  //   } else {
  //     setDataSearch([]);
  //   }
  // }, [search]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link href="/cart">
          <a onClick={handleMobileMenuClose}>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
            <span>Giỏ hàng</span>
          </a>
        </Link>
      </MenuItem>

      <MenuItem>
        <Link href={Object.keys(auth).length === 0 ? "/signin" : "/profile"}>
          <a onClick={handleMobileMenuClose}>
            <IconButton aria-label="account of current user" color="inherit">
              <AccountCircle />
            </IconButton>
            <span>Tài khoản</span>
          </a>
        </Link>
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <DrawerMenu />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  //Ham logout
  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Đăng xuất thành công!" } });
    return router.push("/");
  };

  //Neu đã Login
  const loggedRouter = () => {
    return (
      <>
        <IconButton
          aria-label={auth.user.name}
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          className="rounded"
        >
          <span className="fs-large">
            {auth.user.name}
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
          <img
            src={auth.user.avatar}
            alt="avatar"
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              transform: "translateY(-3px)",
              marginLeft: "10px",
            }}
          />
        </IconButton>
        {renderMenu}
      </>
    );
  };

  const renderMenu = (
    <>
      {role === "admin" ? (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem>
            <Link href="/profile">
              <a onClick={handleMenuClose}>Tài khoản</a>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/users">
              <a onClick={handleMenuClose}>Khách hàng</a>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/create">
              <a onClick={handleMenuClose}>Quản lý sản phẩm</a>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/categories">
              <a onClick={handleMenuClose}>Quản lý danh mục</a>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <Link href="/profile">
            <a>
              <MenuItem>Tài khoản</MenuItem>
            </a>
          </Link>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      )}
    </>
  );

  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        color="default"
        style={{ boxShadow: "none", border: "1px solid #ddd" }}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbar}>
            {/* Toggle */}

            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Link href="/">
              <a>
                <img
                  className="logo"
                  src="https://res.cloudinary.com/mctgear/image/upload/v1629738673/logo_banner/Logo_500x230_px_spwyon.png"
                  alt="logo"
                />
              </a>
            </Link>
            {/* Search */}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Tìm kiếm…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={handleChangSearch}
                value={search.toLowerCase()}
              />
              {dataSearch && search !== "" && (
                <ul className="list-none search-result box-shadow">
                  {dataSearch.length === 0 && search !== "" ? (
                    <h6 className="p-3">Không tìm thấy sản phẩm</h6>
                  ) : (
                    dataSearch.map((item) => (
                      <li className="result-item" key={item._id}>
                        <Link href={`/product/${item._id}`}>
                          <a
                            className="d-flex justify-content-between align-items-center"
                            onClick={() => setSearch("")}
                          >
                            <img
                              src={item.images[0].url}
                              alt={item.title}
                              className="px-2"
                            />
                            <span className="px-2 title-product-result text-capitalize">
                              {item.title}
                            </span>
                            <span className="price color-red fs-large px-2">
                              {item.price.toLocaleString("vi", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </a>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
            <div className={classes.grow} />

            {/* Accout    */}
            <div className={classes.sectionDesktop}>
              {Object.keys(auth).length === 0 ? (
                <Link href="/signin">
                  <a>
                    <IconButton
                      aria-label="account of current user"
                      style={{ color: "#444", borderRadius: "10px" }}
                    >
                      <span
                        className="pr-2"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        Đăng nhập
                      </span>
                      <AccountCircle fontSize="large" />
                    </IconButton>
                  </a>
                </Link>
              ) : (
                loggedRouter()
              )}

              {/* Cart */}
              <Link href="/cart">
                <a>
                  <IconButton
                    aria-label="show 17 new notifications"
                    style={{ color: "#444", borderRadius: "10px" }}
                  >
                    <Badge
                      badgeContent={cart.length}
                      color="secondary"
                      style={{ alignItems: "center" }}
                    >
                      <span
                        className="pr-2"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        Giỏ hàng
                      </span>
                      <ShoppingCartOutlinedIcon fontSize="large" />
                    </Badge>
                  </IconButton>
                </a>
              </Link>
            </div>
            {/* Mobile */}
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      {renderMobileMenu}
    </div>
  );
}
