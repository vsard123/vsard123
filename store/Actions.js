export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_CART: "ADD_CART",
  ADD_MODAL: "ADD_MODAL",
  ADD_ORDERS: "ADD_ORDERS",
  ADD_USERS: "ADD_USERS",
  ADD_CATEGORIES: "ADD_CATEGORIES",
};

//THem vao gio hang
export const addToCart = (product, cart) => {
  //Kiểm tra sản phẩm còn trong kho hay ko
  if (product.inStock === 0) {
    return {
      type: "NOTIFY",
      payload: { error: "Sản phẩm hiện đã hết hàng" },
    };
  }

  //Kiểm tra xem product đã tồn tại trong giỏ hàng chưa
  const check = cart.every((item) => {
    return item._id !== product._id;
  });
  if (!check) {
    return {
      type: "NOTIFY",
      payload: { error: "Sản phẩm đã được thêm vào giỏ hàng" },
    };
  }

  //Hoàn tất thêm sản phẩm vào giỏ hàng
  return {
    type: "ADD_CART",
    payload: [...cart, { ...product, quantity: 1 }],
  };
};

//Giảm số lượng
export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity -= 1;
  });
  return { type: "ADD_CART", payload: newData };
};

//tăng số lượng
export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity += 1;
  });
  return { type: "ADD_CART", payload: newData };
};

//Xoa san pham trong gio hang
export const deleteItem = (data, id, type) => {
  const newData = data.filter((item) => item._id !== id);
  return { type, payload: newData };
};

//Update san pham trong gio hang
export const updateItem = (data, id, post, type) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return { type, payload: newData };
};
