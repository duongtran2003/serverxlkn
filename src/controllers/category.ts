import { Request, Response } from "express";
import { Category } from "../models/category";
import { Request as RequestModel } from "../models/request";

class CategoryController {
  async create(req: Request, res: Response) {
    const description = req.body.description;
    if (!description) {
      return res.status(400).json({
        "message": "thieu thong tin"
      });
    }
    const newCategory = {
      description: description,
    }
    Category.create(newCategory)
    .then((newCategory) => {
      return res.status(201).json(newCategory);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
  
  async index(req: Request, res: Response) {
    const query = req.query.query;

    if (!query) {
      const categories = await Category.find({});
      return res.status(200).json(categories);
    }
    else {
      const categories = await Category.find({ description: { $regex: ".*" + query + ".*" } });
      return res.status(200).json(categories);
    }
  }
  
  async update(req: Request, res: Response) {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    const category = {
      description: req.body.description || undefined,
    }
    
    Category.findByIdAndUpdate(categoryId, category, { new: true })
    .then((updated) => {
      return res.status(200).json(updated);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      })
    });
  }
  
  async delete(req: Request, res: Response) {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    const requestsWithCategory = await RequestModel.find({ categoryId: categoryId });
    if (requestsWithCategory.length) {
      return res.status(409).json({
        "message": "category nam trong nhieu yeu cau",
      });
    }
    
    Category.findByIdAndDelete(categoryId)
    .then(() => {
      return res.status(200).json({
        "message": "success",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
}

export {
  CategoryController,
}