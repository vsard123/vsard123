import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { DataContext } from "../../store/GlobalState";
import { postData, putData, getData } from "../../utils/fetchData";
import { updateItem } from "../../store/Actions";
import { imageNewUpload } from "../../utils/imageUpload";
import { Divider, MenuItem, TextField, Typography } from "@material-ui/core";

const Categories = () => {
  const initialState = {
    name: "",
    parent_id: "root",
    icon: "",
  };
  const [category, setCategory] = useState(initialState);
  const { name, parent_id } = category;
  const { state, dispatch } = useContext(DataContext);
  const [id, setId] = useState("");
  const { categories, auth } = state;
  const [images, setImages] = useState("");

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Xác thực không hợp lệ!" },
      });
    if (!name)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Tên không được để trống" },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let media = [];
    if (images) {
      media = await imageNewUpload(images);
    }
    let res;
    if (id) {
      res = await putData(
        `categories/${id}`,
        { ...category, icon: media },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"));
    } else {
      res = await postData(
        "categories",
        { ...category, icon: media },
        auth.token
      );
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
      dispatch({
        type: "ADD_CATEGORIES",
        payload: [...categories, res.newCategory],
      });
    }

    setId("");

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let err = "";
    const files = [...e.target.files];
    //Nếu file rỗng
    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Không tìm thấy ảnh" },
      });

    files.forEach((file) => {
      //Nếu file rỗng
      if (file.length === 0)
        return dispatch({
          type: "NOTIFY",
          payload: { error: "Không tìm thấy ảnh" },
        });

      //Nếu file quá lớn
      if (file.size > 1024 * 1024)
        return (err = "Kích thước hình ảnh lớn nhất là 1 Mb");
      //File không đúng định dạng
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp"
      )
        return (err = "Định dạng không được hỗ trợ");
    });

    if (err) dispatch({ type: "NOTIFY", payload: { error: err } });
    setImages(files[0]);
  };

  const handleEditCategory = (category) => {
    setId(category._id);
  };

  useEffect(() => {
    if (id) {
      getData(`categories/${id}`).then((res) => {
        setCategory(res.category);
        setImages(res.category.icon);
      });
    } else {
      setCategory(initialState);
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Danh mục</title>
      </Head>
      <Typography variant="h5" color="initial" className="my-3">
        Quản lý danh mục
      </Typography>
      <Divider className="mb-3" />
      <div className="row mx-auto my-3">
        <div className="col-md-6 col-sm-12">
          <form onSubmit={onHandleSubmit}>
            <div className="form-group">
              {/* <input
          type="text"
          className="form-control"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}

              <TextField
                id="standard-basic"
                type="text"
                label="Tên danh mục"
                className="w-100"
                name="name"
                value={name}
                onChange={handleChangeInput}
              />
            </div>
            <div className="form-group">
              {/* <TextField
                id="standard-basic"
                type="text"
                label="Icon"
                className="w-100"
                name="icon"
                value={icon}
                onChange={handleChangeInput}
              /> */}
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text py-1 px-3">Tải ảnh</span>
                </div>
                <div className="custom-file border">
                  <input
                    type="file"
                    className="custom-file-input"
                    accept="image/*"
                    onChange={handleUploadInput}
                  />
                </div>
              </div>
              <div className="row img-up mx-0">
                {images && (
                  <div
                    className="my-1"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {images.url && (
                      <img
                        src={images.url}
                        alt=""
                        className="img-thumbnail rounded"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Danh mục cha"
                className="w-50"
                name="parent_id"
                value={parent_id}
                select
                onChange={handleChangeInput}
              >
                <MenuItem value="root">Danh mục chính</MenuItem>
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <button className="btn btn-primary ml-1" type="submit">
              {id ? "Update" : "Create"}
            </button>
          </form>
        </div>
        <div className="col-md-6 col-sm-12">
          {categories.map((category) => (
            <div key={category._id} className="card my-2 text-capitalize">
              <div className="card-body d-flex justify-content-between">
                {category.name}
                <div style={{ cursor: "pointer" }}>
                  <i
                    className="fas fa-edit mr-2 text-info"
                    aria-hidden="true"
                    onClick={() => handleEditCategory(category)}
                  ></i>
                  <i
                    className="fas fa-trash text-danger"
                    aria-hidden="true"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() =>
                      dispatch({
                        type: "ADD_MODAL",
                        payload: [
                          {
                            data: categories,
                            id: category._id,
                            title: category.name,
                            type: "ADD_CATEGORIES",
                          },
                        ],
                      })
                    }
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
