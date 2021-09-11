import React from "react";
import LevelTwo from "./LevelTwo";
import Link from "next/link";

const LevelOne = ({ categories }) => {
  const result = categories.filter((category) => category.parent_id == "root");

  return (
    <ul className="nav flex-column list-none">
      {result.map((category) => (
        <li className="nav-item rounded transition" key={category._id}>
          <Link href={`/categories/${category._id}`}>
            <a className="nav-link d-flex justify-content-start">
              {category.icon && (
                <img
                  style={{ width: "20px", marginRight: "10px" }}
                  src={category.icon.url}
                  alt={category.name}
                />
              )}

              {category.name}
            </a>
          </Link>
          <LevelTwo parent_id={category._id} categories={categories} />
        </li>
      ))}
    </ul>
  );
};

export default LevelOne;
