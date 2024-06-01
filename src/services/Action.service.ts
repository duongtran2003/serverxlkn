import { Action } from "../models/action";

class ActionService {
  async createNewAction(actionName: string) {
    const newAction = await Action.create({
      actionName: actionName
    });
    return newAction;
  }

  async getAllActions() {
    const actions = await Action.find({ actionName: { $nin: ["Tao moi", "Xem"] } }).select("-__v");
    return actions
  }

  async getActionById(actionId: string) {
    const action = await Action.findById(actionId).select("-__v");
    return action;
  }

  async getActionByName(acitonName: string) {
    const action = await Action.findOne({ actionName: actionName }).select("-__v");
    return action;
  }
}

export {
  ActionService
}
