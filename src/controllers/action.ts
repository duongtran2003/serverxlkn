import { Request, Response } from "express";
import { Action } from "../models/action";

class ActionController {
  async create(req: Request, res: Response) {
    const actionName = req.body.actionName;
    await Action.create({
      actionName: actionName,
    });
    return res.status(201).json({
      "message": "success",
    });
  }
  
  async index(req: Request, res: Response) {
    const actionId = req.params.id;
    if (!actionId) {
      const actions = await Action.find({}).select("-__v");
      return res.status(200).json(actions);
    }
    const action = await Action.findById(actionId).select("-__v");
    if (!action) {
      return res.status(404).json({
        "message": "khong tim thay action"
      });
    }
    return res.status(200).json(action);
  }
}

export {
  ActionController
}