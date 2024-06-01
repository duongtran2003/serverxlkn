import { Request, Response } from "express";
import { ACTION_MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { ActionService } from "../services/Action.service";

class ActionController {

  actionService: ActionService;

  constructor() {
    this.actionService = new ActionService();
  }

  async create(req: Request, res: Response) {
    const actionName = req.body.actionName;

    try {
      const newAction = await this.actionService.createNewAction(actionName);
      return res.status(HTTP_STATUS.CREATED).json({
        data: newAction,
        message: ACTION_MESSAGES.TAO_ACTION_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: ACTION_MESSAGES.SERVER_ERROR,
      })
    }
  }

  async index(req: Request, res: Response) {
    const actionId = req.params.id;

    try {
      if (!actionId) {
        // Get all actions
        const actions = await this.actionService.getAllActions();
        return res.status(HTTP_STATUS.OK).json({
          data: actions,
          message: ACTION_MESSAGES.LAY_RA_TOAN_BO_ACTION_THANH_CONG,
        });
      }

      // Get by ID
      const action = await this.actionService.getActionById(actionId);
      if (!action) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: ACTION_MESSAGES.KHONG_TIM_THAY_ACTION,
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        data: action,
        message: ACTION_MESSAGES.LAY_RA_ACTION_THEO_ID_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: ACTION_MESSAGES.SERVER_ERROR,
      })
    }
  }
}

export { ActionController };
