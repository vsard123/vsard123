import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";

export default function Bread_Crumbs({ title }) {
  return (
    <Breadcrumbs aria-label="breadcrumb" className="py-4">
      <Link href="/">Trang chủ</Link>
      <Link href="#" aria-current="page">
        {title}
      </Link>
    </Breadcrumbs>
  );
}
