import { Request, Response } from "express";
import { Category } from "../models/category";
import { Request as RequestModel } from "../models/request";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { CATEGORY_MESSAGES } from "../constants/messages";

class CategoryController {
  async create(req: Request, res: Response) {
    const description = req.body.description;
    if (!description) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: CATEGORY_MESSAGES.THIEU_THONG_TIN,
      });
    }
    const newCategory = {
      description: description,
    }
    Category.create(newCategory)
      .then((newCategory) => {
        newCategory.$set({
          __v: undefined,
        })
        return res.status(HTTP_STATUS.OK).json({
          message: CATEGORY_MESSAGES.TAO_CATEGORY_THANH_CONG,
          data: newCategory,
        });
      })
      .catch((err) => {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "server error: " + err.message,
        });
      });
  }

  async index(req: Request, res: Response) {
    const categoryId = req.params.id;
    if (!categoryId) {
      const categories = await Category.find({}).select("-__v");
      return res.status(HTTP_STATUS.OK).json({
        message: CATEGORY_MESSAGES.LAY_RA_TOAN_BO_CATEGORY_THANH_CONG,
        data: categories,
      });
    }
    const category = await Category.findById(categoryId).select("-__v");
    if (!category) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: CATEGORY_MESSAGES.KHONG_TIM_THAY_CATEGORY,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: CATEGORY_MESSAGES.LAY_RA_CATEGORY_THEO_ID_THANH_CONG,
      data: category,
    });
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

    Category.findByIdAndUpdate(categoryId, category, { new: true })
      .then((updated) => {
        if (!updated) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: CATEGORY_MESSAGES.KHONG_TIM_THAY_CATEGORY,
          });
        }
        updated?.$set({
          __v: undefined
        })
        return res.status(HTTP_STATUS.OK).json({
          message: CATEGORY_MESSAGES.UPDATE_CATEGORY_THANH_CONG,
          data: updated,
        });
      })
      .catch((err) => {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "server error: " + err.message,
        })
      });
  }

  async delete(req: Request, res: Response) {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: CATEGORY_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const requestsWithCategory = await RequestModel.find({ categoryId: categoryId });
    if (requestsWithCategory.length) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        message: CATEGORY_MESSAGES.CATEGORY_NAM_TRONG_NHIEU_YEU_CAU,
      });
    }

    Category.findByIdAndDelete(categoryId)
      .then(() => {
        return res.status(HTTP_STATUS.OK).json({
          message: CATEGORY_MESSAGES.DELETE_CATEGORY_THANH_CONG,
        });
      })
      .catch((err) => {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "server error: " + err.message,
        });
      });
  }
}

export {
  CategoryController,
}