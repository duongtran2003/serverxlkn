import { Request, Response } from "express";
import { Request as RequestModel } from "../models/request";
import mongoose from "mongoose";
import { Action } from "../models/action";
import { Process } from "../models/process";
import { Comment } from "../models/comment";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { ReqEditHistory } from "../models/reqEditHistory";
import { Category } from "../models/category";

class RequestController {
  async create(req: Request, res: Response) {
    const { title, content, priority, categoryId } = req.body;

    if (!title || !content || !priority || !categoryId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }

    const request = {
      title: title,
      content: content,
      priority: priority,
      peopleId: res.locals.claims.userId,
      categoryId: categoryId,
      status: "Da tao"
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newRequest = (await RequestModel.create([request], { session: session }))[0];
      const action = await Action.findOne({ actionName: "Tao moi" });

      const process = {
        requestId: newRequest._id,
        peopleId: res.locals.claims.userId,
        actionId: action?._id,
      }
      const newProcess = (await Process.create([process], { session: session }))[0];
      await session.commitTransaction();
      await session.endSession();
      newRequest.$set({
        __v: undefined
      });
      return res.status(201).json(newRequest);
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        "message": "server error" + err,
      });
    };
  }

  async viewHistory(req: Request, res: Response) {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": "thieu thong tin",
      });
    }
    const history = await ReqEditHistory.find({ requestId: requestId });
    return res.status(HTTP_STATUS.OK).json(history);
  } 

  async index(req: Request, res: Response) {
    const requestId = req.params.id;
    const userId = res.locals.claims.userId;

    if (!requestId) {
      const processes = await Process.find({ peopleId: userId });
      const requests: any = [];
      for (const process of processes) {
        const request = await RequestModel.findById(process.requestId).select('-__v');
        if (request) {
          requests.push(request);
        }
      }
      return res.status(200).json(requests);
    }
    else {
      const process = await Process.findOne({ peopleId: userId, requestId: requestId });
      if (!process) {
        return res.status(403).json({
          "message": "ban khong du tham quyen",
        });
      }
      const request = await RequestModel.findById(process.requestId).select('-__v');
      if (!request) {
        return res.status(404).json({
          "message": "khong tim thay request",
        });
      }
      return res.status(200).json(request);
    }
  }

  async update(req: Request, res: Response) {
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
      const request = await RequestModel.findById(requestId);
      if (!request) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay request",
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
      }
      
      await ReqEditHistory.create([history], { session: session });
      const { title, content, categoryId } = req.body;
      const patched = {
        title: title || undefined,
        content: content || undefined,
        categoryId: undefined,
      }
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            "message": "khong tim thay category",
          });
        }
        patched.categoryId = categoryId;
      }
      const updatedRequest = await RequestModel.findByIdAndUpdate(requestId, patched, { new: true }).session(session);
      updatedRequest?.$set({
        __v: undefined,
      });
      await session.commitTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.OK).json(updatedRequest);
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERRO).json({
        "message": "server error",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    const process = await Process.findOne({ requestId: requestId });
    if (!process) {
      return res.status(404).json({
        "message": "khong tim thay process lien quan",
      });
    }
    if (process.peopleId != userId) {
      return res.status(403).json({
        "message": "ban khong du tham quyen",
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Process.deleteOne({ requestId: requestId }).session(session);
      await Comment.deleteMany({ requestId: requestId }).session(session);
      await RequestModel.findByIdAndDelete(requestId).session(session);
      await session.commitTransaction();
      await session.endSession();
      return res.status(200).json({
        "message": "success",
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        "message": "server error: " + err,
      });
    }
  }

  async forward(req: Request, res: Response) {
    const { peopleId, actionId } = req.body;
    const userId = res.locals.claims.userId;
    const requestId = req.params.id;
    if (!peopleId || !actionId || !requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": "thieu thong tin",
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const request = await RequestModel.findById(requestId);
      const process = await Process.findOne({ peopleId: userId, requestId: requestId });
      if (!process) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay process lien quan",
        });
      }
      if (!request) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": "khong tim thay request",
        });
      }
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
      await process.save({ session: session });
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
        "message": "success",
      });
    }
    catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERRO).json({
        "message": "server error",
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
      const prevProcess = await Process.findOne({ requestId: requestId, status: "Cho phe duyet" });
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
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERRO).json({
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
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERRO).json({
        "message": "server error",
      });
    }
  }
}

export {
  RequestController
}