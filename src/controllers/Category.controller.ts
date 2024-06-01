import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { CATEGORY_MESSAGES } from "../constants/messages";
import { CategoryService } from "../services/Category.service";
import { RequestService } from "../services/Request.service";

class CategoryController {
  categoryService: CategoryService;
  requestService: RequestService;

  constructor() {
    this.categoryService = new CategoryService();
    this.requestService = new RequestService();
  }

  async create(req: Request, res: Response) {
    const description = req.body.description;
    if (!description) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: CATEGORY_MESSAGES.THIEU_THONG_TIN,
      });
    }
    const category = {
      description: description,
    }

    try {
      const newCategory = await this.categoryService.createNewCategory(category);
      return res.status(HTTP_STATUS.CREATED).json({
        data: newCategory,
        message: CATEGORY_MESSAGES.TAO_CATEGORY_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: CATEGORY_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async index(req: Request, res: Response) {
    const categoryId = req.params.id;
    try {
      if (!categoryId) {
        const categories = await this.categoryService.getAllCategories();
        return res.status(HTTP_STATUS.OK).json({
          data: categories,
          message: CATEGORY_MESSAGES.LAY_RA_TOAN_BO_CATEGORY_THANH_CONG,
        });
      }
      const category = await this.categoryService.getCategoryById(categoryId);
      if (!category) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: CATEGORY_MESSAGES.KHONG_TIM_THAY_CATEGORY,
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        data: category,
        message: CATEGORY_MESSAGES.LAY_RA_CATEGORY_THEO_ID_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: CATEGORY_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async update(req: Request, res: Response) {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: CATEGORY_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const category = {
      description: req.body.description || undefined,
    }

    try {
      const updatedCategory = this.categoryService.updateCategory(categoryId, category);
      if (!updatedCategory) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: CATEGORY_MESSAGES.KHONG_TIM_THAY_CATEGORY,
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        data: updatedCategory,
        message: CATEGORY_MESSAGES.UPDATE_CATEGORY_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: CATEGORY_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: CATEGORY_MESSAGES.THIEU_THONG_TIN,
      });
    }

    try {
      const requestsWithCategory = await this.requestService.getRequestsWithCategory(categoryId);
      if (requestsWithCategory.length) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          message: CATEGORY_MESSAGES.CATEGORY_NAM_TRONG_NHIEU_YEU_CAU,
        });
      }

      await this.categoryService.deleteCategory(categoryId);
      return res.status(HTTP_STATUS.OK).json({
        message: CATEGORY_MESSAGES.DELETE_CATEGORY_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: CATEGORY_MESSAGES.SERVER_ERROR,
      });
    };
  }
}

export {
  CategoryController,
}
