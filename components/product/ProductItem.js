import React, { useContext } from "react";
import Link from "next/link";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";
import IconButton from "@material-ui/core/IconButton";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";

const ProductItem = ({ product, handleCheck }) => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const handleAddCart = (product, cart) => {
    dispatch({
      type: "NOTIFY",
      payload: { success: "Thêm vào giỏ hàng thành công" },
    });
    dispatch(addToCart(product, cart));
  };

  const userLink = () => {
    return (
      <>
        {/* <Link href={`/product/${product._id}`}>
          <a className="btn btn-info" style={{ marginRight: "5px", flex: 1 }}>
            View
          </a>
        </Link> */}
        <IconButton
          color="primary"
          disabled={product.inStock === 0 ? true : false}
          onClick={() => handleAddCart(product, cart)}
          aria-label="add to shopping cart"
        >
          <AddShoppingCartIcon />
        </IconButton>
      </>
    );
  };

  const adminLink = () => {
    return (
      <>
        <Link href={`/create/${product._id}`}>
          <a>
            <IconButton
              aria-label="Sửa sản phẩm"
              style={{
                flex: 1,
                color: "#fff",
                borderRadius: "10px",
                backgroundColor: "#0069FE",
              }}
            >
              <EditIcon fontSize="small" />
              <span className="pl-2" style={{ fontSize: "14px" }}>
                Sửa
              </span>
            </IconButton>
          </a>
        </Link>

        <IconButton
          aria-label="Mua hàng"
          onClick={() =>
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: "",
                  id: product._id,
                  title: product.title,
                  type: "DELETE_PRODUCT",
                },
              ],
            })
          }
          style={{
            color: "#fff",
            borderRadius: "10px",
            backgroundColor: "#252638",
          }}
          disabled={product.inStock === 0 ? true : false}
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <DeleteIcon fontSize="small" />
          <span className="pl-2" style={{ fontSize: "14px" }}>
            Xóa
          </span>
        </IconButton>
      </>
    );
  };

  const getPercents = (price, price_sale) => {
    return Math.round(((price - price_sale) / price) * 100);
  };

  return (
    <div className="card align-content-center">
      {auth.user && auth.user.role === "admin" && (
        <input
          type="checkbox"
          checked={product.checked}
          className="position-absolute"
          style={{ height: "30px", width: "30px" }}
          onChange={() => handleCheck(product._id)}
        />
      )}
      {product.price_sale && product.price > product.price_sale && (
        <span
          style={{ backgroundImage: "url(/images/sale.png)" }}
          className="label_sale"
        >
          -{getPercents(product.price, product.price_sale)}%
        </span>
      )}
      {product.images.length > 1 ? (
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="front">
              <Link href={`/product/${product._id}`}>
                <a>
                  <img src={product.images[0].url} alt="" />
                </a>
              </Link>
            </div>

            <div className="back">
              <Link href={`/product/${product._id}`}>
                <a>
                  <img src={product.images[1].url} alt="" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Link href={`/product/${product._id}`}>
          <a>
            <img
              src={product.images[0].url}
              className="card-img-top"
              alt={product.title}
            />
          </a>
        </Link>
      )}

      <div className="card-body">
        <Link href={`/product/${product._id}`}>
          <a>
            <h6
              className="card-title product-name text-capitalize"
              title={product.title}
            >
              {product.title}
            </h6>
          </a>
        </Link>
        {/* <p className="card-text" title={product.description}>
          {product.description}
        </p> */}
        <div className="row justify-content-between align-items-center mx-0 my-2">
          <div className="price">
            <span
              className={`${
                product.price_sale > 0 && product.price_sale < product.price
                  ? "text-muted text-decoration fs-large"
                  : "text-danger fs-largest"
              }  d-block`}
            >
              {product.price.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            {product.price_sale > 0 && product.price_sale < product.price && (
              <span className="text-danger fs-largest d-block">
                {product.price_sale.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            )}
          </div>
          <div className="status">
            {product.inStock > 0 ? (
              <Chip label="Còn hàng" />
            ) : (
              <Chip label="Hết hàng" />
            )}
          </div>
        </div>
        <div className="row justify-content-center mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
