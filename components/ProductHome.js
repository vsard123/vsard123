import React, { useState, useEffect } from "react";
import { getData } from "../utils/fetchData";
import ProductItem from "./product/ProductItem";

const ProductHome = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState({});

  useEffect(async () => {
    if (category)
      await getData(`categories/${category}?search=all&limit=4`).then(
        (data) => {
          setProducts(data.products);
          setCat(data.category);
        }
      );
  }, [category]);
  return (
    <div className="product-category">
      {cat && (
        <div className="title-category d-flex justify-content-between align-items-center">
          <div className="title fs-largest">{cat.name}</div>
          <div className="view_all">
            <a>
              Xem tất cả
              <i
                className="fas fa-chevron-circle-right pl-2"
                aria-hidden="true"
              ></i>
            </a>
          </div>
        </div>
      )}
      {products && (
        <div className="products py-3">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductHome;
