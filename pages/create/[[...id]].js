import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { DataContext } from "../../store/GlobalState";
import { postData, getData, putData } from "../../utils/fetchData";
import { useRouter } from "next/router";
import { imageUpload } from "../../utils/imageUpload";
import {
  Divider,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@material-ui/core";

import Multiselect from "multiselect-react-dropdown";
import Editor from "../../components/CkEditor";

const CreateProduct = () => {
  const initialState = {
    title: "",
    price: 0,
    price_sale: 0,
    inStock: 0,
    description: "",
  };
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState(initialState);
  const [onEdit, setOnEdit] = useState(false);

  // Ck Editor
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  const { title, price, price_sale, inStock } = product;
  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;
  const router = useRouter();
  const { id } = router.query;

  const [categoryList, setCategoryList] = useState([]);
  const [categoryselected, setCategoryseleted] = useState([]);

  const handleOnSelect = (selectedList, selectedItem) => {
    setCategoryList([...categoryList, selectedItem._id]);
  };

  const handleOnRemove = (selectedList, selectedItem) => {
    let arr = [];
    selectedList.forEach((item) => {
      arr.push(item._id);
    });
    setCategoryList(arr);
  };

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setDescription(res.product.description);
        setContent(res.product.content);
        setImages(res.product.images);
        setCategoryList(res.product.category);
        if (res.product.category.length > 0) {
          let selected = [];
          res.product.category.forEach((item) => {
            selected.push(getCategory(item)[0]);
          });
          setCategoryseleted(selected);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const getCategory = (id) => {
    return categories.filter((c) => c._id === id);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImage = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];
    //Nếu file rỗng
    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Không tìm thấy ảnh" },
      });

    files.forEach((file) => {
      //Nếu file quá lớn
      if (file.size > 1024 * 1024)
        return (err = "Kích thước hình ảnh lớn nhất là 1 Mb");
      //File không đúng định dạng
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Định dạng không được hỗ trợ");
      num += 1;
      //Kiểm tra nhỏ hơn 5 bức ảnh trong 1 lần up
      if (num <= 5) newImage.push(file);
      return newImage;
    });
    if (err) dispatch({ type: "NOTIFY", payload: { error: err } });
    const imgCount = images.length;
    //Kiểm tra tổng số ảnh up có lớn hơn 5
    if (imgCount + newImage.length > 5)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Chọn tối đa 5 hình ảnh" },
      });

    setImages([...images, ...newImage]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin") {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Xác thực không hợp lệ!" },
      });
    }
    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      !categoryList ||
      images.length === 0
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Vui lòng thêm tất cả các trường!" },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);
    if (imgNewURL.length > 0) {
      media = await imageUpload(imgNewURL);
    }

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        {
          ...product,
          description,
          content,
          category: categoryList,
          images: [...imgOldURL, ...media],
        },
        auth.token
      );
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
    } else {
      res = await postData(
        "product",
        {
          ...product,
          description,
          content,
          category: categoryList,
          images: [...imgOldURL, ...media],
        },
        auth.token
      );
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
    }

    return dispatch({
      type: "NOTIFY",
      payload: { success: res.msg },
    });
  };

  return (
    <div className="products_manager py-5">
      <Head>
        <title>Thêm sản phẩm</title>
      </Head>
      <Typography variant="h5" color="initial">
        Thêm sản phẩm
      </Typography>
      <Divider className="my-3" />
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-6">
          {/* Tên sản phẩm */}
          <div className="row form-group px-3">
            <FormControl className="w-100 ">
              <InputLabel htmlFor="title">Tên sản phẩm</InputLabel>
              <Input
                type="text"
                id="title"
                name="title"
                variant="outlined"
                value={title}
                onChange={handleChangeInput}
              />
            </FormControl>
          </div>

          {/* Giá  */}
          <div className="row form-group">
            <div className="col-sm-6">
              <FormControl className="w-100 ">
                <InputLabel htmlFor="price">Giá</InputLabel>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  variant="outlined"
                  value={price}
                  onChange={handleChangeInput}
                />
              </FormControl>
            </div>

            {/* Giá Khuyễn mãi */}
            <div className="col-sm-6">
              <FormControl className="w-100 ">
                <InputLabel htmlFor="price_sale">Giá khuyến mãi</InputLabel>
                <Input
                  type="number"
                  id="price_sale"
                  name="price_sale"
                  variant="outlined"
                  value={price_sale}
                  onChange={handleChangeInput}
                />
              </FormControl>
            </div>
          </div>

          {/* Số lượng */}
          <div className="row form-group">
            <div className="col-sm-6">
              <FormControl className="w-100 ">
                <InputLabel htmlFor="instock">Số lượng</InputLabel>
                <Input
                  type="number"
                  id="instock"
                  name="inStock"
                  variant="outlined"
                  value={inStock}
                  onChange={handleChangeInput}
                />
              </FormControl>
            </div>
          </div>

          {/* Danh mục */}
          <div className="form-group">
            <label htmlFor="categories">Danh mục</label>
            <Multiselect
              options={categories} // Options to display in the dropdown
              displayValue="name" // Property name to display in the dropdown options
              onSelect={handleOnSelect} // Function will trigger on select event
              onRemove={handleOnRemove} // Function will trigger on remove event
              selectedValues={categoryselected}
              placeholder="Chọn danh mục"
            />
          </div>

          {/* Mô tả ngắn */}
          <div className="form-group">
            <label htmlFor="description">Mô tả ngắn</label>
            {/* <textarea
              name="description"
              id="description"
              cols="30"
              rows="4"
              placeholder="Mô tả ngắn"
              onChange={handleChangeInput}
              className="d-block my-4 w-100 p-2 form-control"
              value={description}
            /> */}
            <Editor
              name="description"
              onChange={(data) => {
                setDescription(data);
              }}
              value={description}
              editorLoaded={editorLoaded}
            />
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="form-group">
            {/* <textarea
              name="content"
              id="content"
              cols="30"
              rows="6"
              placeholder="Chi tiết sản phẩm"
              onChange={handleChangeInput}
              className="d-block my-4 w-100 p-2 form-control"
              value={content}
            /> */}
            <label htmlFor="content">Chi tiết sản phẩm</label>
            <Editor
              name="content"
              onChange={(data) => {
                setContent(data);
              }}
              value={content}
              editorLoaded={editorLoaded}
            />
          </div>

          {/* <div className="input-group-prepend px-0 my-2 form-group">
            <select
              name="category"
              id="category"
              value={category}
              onChange={handleChangeInput}
              className="custom-select text-capitalize form-control"
            >
              <option value="all">Danh mục chung</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div> */}

          <button type="submit" className="btn btn-info my-2 px-4">
            {onEdit ? "Cập nhật" : "Lưu"}
          </button>
        </div>

        <div className="col-md-6 my-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text py-1 px-3">Tải ảnh</span>
            </div>
            <div className="custom-file border">
              <input
                type="file"
                className="custom-file-input"
                multiple
                accept="image/*"
                onChange={handleUploadInput}
              />
            </div>
          </div>

          <div className="row img-up mx-0">
            {images.map((img, index) => (
              <div key={index} className="file_img my-1">
                <img
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                  className="img-thumbnail rounded"
                />

                <span onClick={() => deleteImage(index)}>X</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
