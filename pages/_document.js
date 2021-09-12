import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Dev AT E-commerce website with Next.js"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          />
          <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="https://kit.fontawesome.com/a076d05399.js"></script>
          <script
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`}
          ></script>
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="https://res.cloudinary.com/mctgear/image/upload/v1629735510/logo_banner/M_logo_vzrxit.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="https://res.cloudinary.com/mctgear/image/upload/v1629735510/logo_banner/M_logo_vzrxit.png"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
