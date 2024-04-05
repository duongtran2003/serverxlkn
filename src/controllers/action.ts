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
}

export {
  ActionController
}