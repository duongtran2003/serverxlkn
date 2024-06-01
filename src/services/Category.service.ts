import { Category } from "../models/category"

class CategoryService {
  async createNewCategory(category: any) {
    const newCategory = await Category.create(category);
    newCategory.$set({
      __v: undefined,
    });
    return newCategory;
  }

  async getCategoryById(categoryId: string) {
    const category = await Category.findById(categoryId).select("-__v");
    return category;
  }

  async getAllCategories() {
    const categories = await Category.find({}).select("-__v");
    return categories;
  }

  async updateCategory(categoryId: string, patched: any) {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, patched, { new: true });
    updatedCategory?.$set({
      __v: undefined,
    });
    return updatedCategory;
  }

  async deleteCategory(categoryId: string) {
    await Category.findByIdAndDelete(categoryId);
  }
}

export {
  CategoryService
}
