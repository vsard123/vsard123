import { getData } from "../utils/fetchData";
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import ProductItem from "../components/product/ProductItem";
import { DataContext } from "../store/GlobalState";
import filterSearch from "../utils/filterSearch";
import { useRouter } from "next/router";
import Banner from "../components/Banner";
import ProductHome from "../components/ProductHome";

const Home = (props) => {
  const { state, dispatch } = useContext(DataContext);
  const router = useRouter();
  const { auth, categories } = state;

  return (
    <div className="home_page">
      <Head>
        <title>Trang Chủ</title>
      </Head>
      <Banner categories={categories} />
      <section className="product-home">
        <ProductHome category="6131fd9450956120b89278c1" />
        <ProductHome category="6131fdd650956120b89278d6" />
        <ProductHome category="6131fe5050956120b89278e8" />
      </section>
    </div>
  );
};

export default Home;
