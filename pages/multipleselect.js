import React, { useState, useContext, useEffect } from "react";
// import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { DataContext } from "../store/GlobalState";
import { getChildren } from "../utils/getChildren";

import { makeStyles } from "@material-ui/core/styles";

const columns = [
  { field: "id", hidden: true },
  { field: "name", headerName: "Column 1", width: 150 },
  { field: "slug", headerName: "Column 2", width: 150 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MultipleSelect() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const { state } = useContext(DataContext);
  // const [data, setData] = useState([]);
  const { categories } = state;
  const newCategory = getChildren("root", categories);
  newCategory.forEach((item) => {
    item.children = getChildren(item._id, categories);
  });

  const handleClick = () => {
    setOpen(!open);
  };

  // useEffect(() => {
  //   let newCategory = [];

  //   categories.forEach((item) => {
  //     var key = "_id";
  //     item["id"] = item[key];
  //     delete item[key];

  //     newCategory.push(item);
  //   });
  //   setData(newCategory);
  // }, []);
  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={data} columns={columns} />
    </div>
  );
}
