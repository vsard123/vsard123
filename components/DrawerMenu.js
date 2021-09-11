import React, { useContext } from "react";
import Link from "next/link";
import { DataContext } from "../store/GlobalState";
import { getChildren } from "../utils/getChildren";

const DrawerMenu = () => {
  const { state } = useContext(DataContext);
  const { categories } = state;
  const newCategory = getChildren("root", categories);
  newCategory.forEach((item) => {
    item.children = getChildren(item._id, categories);
  });
  return (
    <nav className="sidebar py-2 mb-4">
      <ul className="nav flex-column" id="accordionExample">
        {newCategory.map((category) =>
          category.children.length == 0 ? (
            <li className="nav-item" key={category._id}>
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
            </li>
          ) : (
            <li className="nav-item" key={category._id}>
              <a
                className="nav-link collapsed d-flex justify-content-start"
                data-toggle="collapse"
                data-target={`#collapse${category._id}`}
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                {category.icon && (
                  <img
                    style={{ width: "20px", marginRight: "10px" }}
                    src={category.icon.url}
                    alt={category.name}
                  />
                )}
                {category.name}
                <i
                  className="fas fa-caret-down right-content fs-large"
                  aria-hidden="true"
                ></i>
              </a>
              <ul
                id={`collapse${category._id}`}
                className="collapse list-none"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                {category.children.map((item) => (
                  <li key={item._id}>
                    <Link href={`/categories/${item._id}`}>
                      <a className="nav-link">{item.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
        {/* <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Menu1
          </a>

          <ul
            id="collapseOne"
            className="collapse list-none"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <li>
              <a className="nav-link" href="#">
                Submenu item 1
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                Submenu item 2
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                Submenu item 3
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Menu 2
          </a>
        </li> */}
      </ul>
    </nav>
  );
};

export default DrawerMenu;
