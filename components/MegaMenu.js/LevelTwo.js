import React from "react";
import LevelTree from "./LevelTree";
import Link from "next/link";

const LevelTwo = ({ parent_id, categories }) => {
  const result = categories.filter(
    (category) => category.parent_id == parent_id
  );
  return (
    <ul className="submenu dropdown-menu ">
      <div className="row">
        {result.map((category) => (
          <div key={category._id} className="col-md-3 mb-3">
            <Link href={`/categories/${category._id}`}>
              <a className="nav-link">
                <span className="font-bold fs-medium color-red">
                  {category.name}
                </span>
              </a>
            </Link>
            <LevelTree parent_id={category._id} categories={categories} />
          </div>
        ))}
      </div>
    </ul>
  );
};

export default LevelTwo;
