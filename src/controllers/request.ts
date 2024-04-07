import { Request, Response } from "express";
import { Request as RequestModel } from "../models/request";
import mongoose from "mongoose";
import { Action } from "../models/action";
import { Process } from "../models/process";
import { Comment } from "../models/comment";

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
      session.endSession();
      newRequest.$set({
        __v: undefined
      });
      return res.status(201).json(newRequest);
    }
    catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        "message": "server error" + err,
      });
    };
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
      return res.status(200).json(request);
    }
  }
  
  async update(req: Request, res: Response) {
    //todo:
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
      await RequestModel.findByIdAndDelete(requestId).session(session);
      await Comment.deleteMany({ requestId: requestId }).session(session);
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        "message": "success",
      });
    }
    catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        "message": "server error: " + err,
      });
    }
  }
}

export {
  RequestController
}