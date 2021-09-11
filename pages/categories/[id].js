import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";

import { useRouter } from "next/router";
import filterSearch from "../../utils/filterSearch";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Bread_Crumbs from "../../components/Bread_Crumb";
import ProductItem from "../../components/product/ProductItem";
import Filter from "../../components/Filter";

const CategoriesProduct = (props) => {
  const [products, setProducts] = useState(props.products);
  const { category } = props;
  const [page, setPage] = useState(1);
  const { state, dispatch } = useContext(DataContext);
  const router = useRouter();

  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  return (
    <Container maxWidth="lg" className="my-5">
      <Typography variant="h4" color="initial">
        {category.name}
      </Typography>
      <Bread_Crumbs title={category.name} />
      <Filter state={state} />
      <div className="products">
        {products.length === 0 ? (
          <h2>No Products</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              // handleCheck={handleCheck}
            />
          ))
        )}
      </div>
      {props.result < page * 6 ? (
        ""
      ) : (
        <button
          className="btn btn-outline-info d-block mx-auto mb-4"
          onClick={handleLoadmore}
        >
          Xem thêm
        </button>
      )}
    </Container>
  );
};

export async function getServerSideProps({ params: { id }, query }) {
  const page = query.page || 1;
  const sort = query.sort || "";
  const res = await getData(`categories/${id}?limit=${page * 6}&sort=${sort}`);
  // server side rendering
  return {
    props: {
      products: res.products,
      category: res.category,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

export default CategoriesProduct;
