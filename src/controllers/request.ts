import { Request, Response } from "express";
import { Request as RequestModel } from "../models/request";
import mongoose from "mongoose";
import { Action } from "../models/action";
import { Process } from "../models/process";

class RequestController {
  async create(req: Request, res: Response) {
    const { title, content, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    const request = {
      title: title,
      content: content,
      priority: priority,
      peopleId: res.locals.claims.userId,
      status: "Da tao"
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newRequest = await RequestModel.create(request); 
      const action = await Action.findOne({ actionName: "Tao moi" });

      const process = {
        requestId: newRequest._id,
        peopleId: res.locals.claims.userId,
        actionId: action?._id,
      }
      const newProcess = await Process.create(process);
      await session.commitTransaction();
      session.endSession();
      return res.status(201).json(newRequest);
    }
    catch(err) {
      return res.status(500).json({
        "message": "server error" + err,
      })
    };
  }
}

export {
  RequestController
}