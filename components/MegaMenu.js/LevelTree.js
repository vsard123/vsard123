import React from "react";
import Link from "next/link";

const LevelTree = ({ parent_id, categories }) => {
  const result = categories.filter(
    (category) => category.parent_id == parent_id
  );
  return (
    <ul className="list-none menu-tree">
      {result.map((category) => (
        <li key={category._id}>
          <Link href={`/categories/${category._id}`}>
            <a className="nav-link fs-medium">{category.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LevelTree;
