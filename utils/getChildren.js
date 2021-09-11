export const getChildren = (parent_id, categories) => {
  const NewCategories = categories.filter((c) => c.parent_id === parent_id);
  return NewCategories;
};
