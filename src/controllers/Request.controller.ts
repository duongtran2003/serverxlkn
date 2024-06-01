import { Request, Response } from "express";
import { Request as RequestModel } from "../models/request";
import mongoose from "mongoose";
import { Action } from "../models/action";
import { Process } from "../models/process";
import { Comment } from "../models/comment";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { REQUEST_MESSAGES } from "../constants/messages";
import { RequestService } from "../services/Request.service";
import { ActionService } from "../services/Action.service";
import { CategoryService } from "../services/Category.service";
import { ProcessService } from "../services/Process.service";

class RequestController {
  requestService: RequestService;
  actionService: ActionService;
  categoryService: CategoryService;
  processService: ProcessService;

  constructor() {
    this.requestService = new RequestService();
    this.actionService = new ActionService();
    this.categoryService = new CategoryService();
    this.processService = new ProcessService();
  }

  async create(req: Request, res: Response) {
    const { title, content, priority, categoryId, createdDate } = req.body;

    if (!title || !content || !priority || !categoryId || !createdDate) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: REQUEST_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const request = {
      title: title,
      content: content,
      priority: priority,
      peopleId: res.locals.claims.userId,
      categoryId: categoryId,
      createdDate: createdDate,
      status: "Da tao"
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newRequest = await this.requestService.createNewRequest(request, session);
      const action = await this.actionService.getActionByName("Tao moi");

      const process = {
        requestId: newRequest._id,
        peopleId: res.locals.claims.userId,
        actionId: action?._id,
      }
      const newProcess = (await Process.create([process], { session: session }))[0];
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.CREATED).json({
        message: REQUEST_MESSAGES.TAO_REQUEST_THANH_CONG,
        data: newRequest
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: REQUEST_MESSAGES.SERVER_ERROR,
      });
    };
  }

  async viewHistory(req: Request, res: Response) {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: REQUEST_MESSAGES.THIEU_THONG_TIN,
      });
    }
    try {
      const history = await this.requestService.viewRequestHistory(requestId);
      return res.status(HTTP_STATUS.OK).json({
        data: history,
        message: REQUEST_MESSAGES.LAY_LICH_SU_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: REQUEST_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async index(req: Request, res: Response) {
    const requestId = req.params.id;
    const userId = res.locals.claims.userId;

    try {
      if (!requestId) {
        const processes = await Process.find({ peopleId: userId });
        const requests: any = [];
        for (const process of processes) {
          const request = await this.requestService.aggregateRequest(process.requestId.toString());
          if (request) {
            requests.push(request);
          }
        }
        return res.status(HTTP_STATUS.OK).json({
          data: requests,
          message: REQUEST_MESSAGES.LAY_RA_TOAN_BO_REQUEST_THANH_CONG
        });
      }

      const process = await Process.findOne({ peopleId: userId, requestId: requestId });
      if (!process) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: REQUEST_MESSAGES.KHONG_SO_HUU_REQUEST,
        });
      }
      const request = await this.requestService.aggregateRequest(process.requestId.toString());
      if (!request) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          meesage: REQUEST_MESSAGES.KHONG_TIM_THAY_REQUEST,
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        data: request,
        message: REQUEST_MESSAGES.LAY_RA_REQUEST_THEO_ID_THANH_CONG
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: REQUEST_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async update(req: Request, res: Response) {
    const requestId = req.params.id;
    const userId = res.locals.claims.userId;

    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: REQUEST_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const request = await this.requestService.aggregateRequest(requestId);
      if (!request) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: REQUEST_MESSAGES.KHONG_TIM_THAY_REQUEST,
        });
      }
      const history = {
        title: request.title,
        content: request.content,
        priority: request.priority,
        peopleId: request.peopleId,
        categoryId: request.categoryId,
        status: request.status,
        duplicateRequestId: request.duplicateRequestId,
        result: request.result,
        editedBy: userId,
        requestId: request._id,
        createdDate: request.createdDate,
      }

      await this.requestService.createRequestHistory(history, session);
      const { title, content, categoryId, result, createdDate, priority } = req.body;
      const patched = {
        title: title || undefined,
        content: content || undefined,
        categoryId: undefined,
        result: result || undefined,
        createdDate: createdDate || undefined,
        priority: priority || undefined,
      }
      if (categoryId) {
        const category = await this.categoryService.getCategoryById(categoryId);
        if (!category) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: REQUEST_MESSAGES.KHONG_TIM_THAY_CATEGORY,
          });
        }
        patched.categoryId = categoryId;
      }
      const updatedRequest = await this.requestService.updateRequest(requestId, patched, session);
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.OK).json({
        data: updatedRequest,
        message: REQUEST_MESSAGES.CAP_NHAT_REQUEST_THANH_CONG,
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: REQUEST_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: REQUEST_MESSAGES.THIEU_THONG_TIN,
      });
    }
    const process = await Process.findOne({ requestId: requestId });
    if (!process) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: REQUEST_MESSAGES.KHONG_TIM_THAY_PROCESS,
      });
    }
    if (process.peopleId != userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: REQUEST_MESSAGES.KHONG_SO_HUU_REQUEST,
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.processService.deleteByRequestId(requestId, session);
      await Comment.deleteMany({ requestId: requestId }).session(session);
      await this.requestService.deleteRequest(requestId, session);
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.OK).json({
        message: REQUEST_MESSAGES.XOA_REQUEST_THANH_CONG,
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: REQUEST_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async forward(req: Request, res: Response) {
    const { peopleId, actionId } = req.body;
    const userId = res.locals.claims.userId;
    const requestId = req.params.id;
    if (!peopleId || !actionId || !requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: REQUEST_MESSAGES.THIEU_THONG_TIN,
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const request = await this.requestService.getRequestById(requestId);
      const process = await this.processService.getByRequestIdAndUserId(userId, requestId);
      if (!process) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: REQUEST_MESSAGES.KHONG_TIM_THAY_PROCESS,
        });
      }
      if (!request) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: REQUEST_MESSAGES.KHONG_TIM_THAY_REQUEST,
        });
      }

      let prevAction = await this.actionService.getActionById(process.actionId.toString());
      // process.actionName != "Tao moi"  => delete process => SCUFFED solution

      let action = await Action.findOne({ actionName: "Xem" });
      if (action) {
        process.$set({
          actionId: action._id,
        });
      }
      action = await Action.findById(actionId);
      if (!action) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay action",
        });
      }
      if (action.actionName == "Phe duyet") {
        process.$set({
          result: "Cho phe duyet",
        });
        request.$set({
          status: "Cho phe duyet"
        });
      }
      else {
        request.$set({
          status: action.actionName,
        });
      }
      if (prevAction?.actionName == "Tao moi" || action.actionName == "Phe duyet") {
        await process.save({ session: session });
      }
      else {
        await Process.findByIdAndDelete(process._id).session(session);
      }
      await request.save({ session: session });
      const newProcess = {
        peopleId: peopleId,
        actionId: actionId,
        requestId: requestId,
      }
      await Process.create([newProcess], { session: session });
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.OK).json({
        message: REQUEST_MESSAGES.CHUYEN_TIEP_THANH_CONG,
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: REQUEST_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async disapprove(req: Request, res: Response) {
    const requestId = req.params.id;
    const userId = res.locals.claims.userId;

    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": "thieu thong tin",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const prevProcess = await Process.findOne({ requestId: requestId, result: "Cho phe duyet" });
      await Process.findOneAndDelete({ requestId: requestId, peopleId: userId }).session(session);
      const request = await RequestModel.findById(requestId);
      if (!prevProcess) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay process lien quan",
        });
      }
      if (!request) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay request",
        });
      }
      const action = await Action.findOne({ actionName: "Cap nhat ket qua" });
      if (action) {
        prevProcess.$set({
          actionId: action._id,
          result: "Dang xu li",
        });
        request.$set({
          status: action.actionName,
        });
      }
      await request.save({ session: session });
      await prevProcess.save({ session: session });
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.OK).json({
        "message": "success",
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        "message": "server error",
      });
    }
  }

  async approve(req: Request, res: Response) {
    const requestId = req.params.id;
    const userId = res.locals.claims.userId;

    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": "thieu thong tin",
      });
    }

    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        "message": "khong tim thay request",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const process = await Process.findOne({ peopleId: userId, requestId: requestId });
      if (!process) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay process lien quan",
        });
      }
      const action = await Action.findOne({ actionName: "Xem" });
      if (action) {
        process.$set({
          actionId: action._id,
        });
      }
      request.$set({
        status: "Da phe duyet",
      });
      await process.save({ session: session });
      await request.save({ session: session });
      await Process.updateMany({ requestId: requestId }, { result: "Da xu li" }).session(session);
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.OK).json({
        "message": "success",
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        "message": "server error",
      });
    }
  }
}

export {
  RequestController
}
