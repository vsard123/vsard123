import React from "react";
import NavbarNew from "./NavbarNew";
import Notify from "./Notify";
import Modal from "./Modal";
import Container from "@material-ui/core/Container";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      {/* <Navbar /> */}
      <NavbarNew />
      {/* <AppBar /> */}
      <Container maxWidth="lg">
        <Notify />
        <Modal />
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
