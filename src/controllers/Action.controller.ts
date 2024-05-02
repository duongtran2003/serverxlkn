import { Request, Response, NextFunction } from "express";
import { Action } from "../models/action";
import { ACTION_MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/HttpStatus";

class ActionController {
  async create(req: Request, res: Response, next: NextFunction) {
    const actionName = req.body.actionName;
    await Action.create({
      actionName: actionName,
    });
    return res.json({
      status: HTTP_STATUS.OK,
      message: ACTION_MESSAGES.TAO_ACTION_THANH_CONG,
    });
  }

  async index(req: Request, res: Response) {
    const actionId = req.params.id;
    if (!actionId) {
      // Get all actions
      const actions = await Action.find({}).select("-__v");
      return res.json({
        status: HTTP_STATUS.OK,
        message: ACTION_MESSAGES.LAY_RA_TOAN_BO_ACTION_THANH_CONG,
        data: actions
      });
    }
    const action = await Action.findById(actionId).select("-__v");
    if (!action) {
      return res.json({
        status: HTTP_STATUS.NOT_FOUND,
        message: ACTION_MESSAGES.KHONG_TIM_THAY_ACTION,
      });
    }
    return res.json({
      status: HTTP_STATUS.OK,
      message: ACTION_MESSAGES.LAY_RA_ACTION_THEO_ID_THANH_CONG,
      data: action
    });
  }
}

export { ActionController };
