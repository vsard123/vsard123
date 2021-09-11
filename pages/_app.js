import "../styles/global.css";
import Layout from "../components/Layout";
import { DataProvider } from "../store/GlobalState";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../pages/theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useEffect } from "react";

const CustomApp = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <DataProvider>
      <Layout>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Layout>
    </DataProvider>
  );
};

export default CustomApp;
