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
      newRequest.$set({
        __v: undefined
      })
      return res.status(201).json(newRequest);
    }
    catch (err) {
      return res.status(500).json({
        "message": "server error" + err,
      })
    };
  }

  async index(req: Request, res: Response) {
    const requestId = req.params.id;

    const aggregation = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(requestId),
        }
      },
      {
        $lookup: {
          from: 'peoples',
          localField: "peopleId",
          foreignField: "_id",
          as: "people",
        }
      },
      {
        $unwind: "$people",
      },
      {
        $lookup: {
          from: "processes",
          localField: "_id",
          foreignField: "requestId",
          as: "process",
        }
      },
      {
        $unwind: "$process",
      },
      {
        $match: {
          "process.peopleId": new mongoose.Types.ObjectId(res.locals.claims.userId),
        }
      },
      {
        $lookup: {
          from: "actions",
          localField: "process.actionId",
          foreignField: "_id",
          as: "action",
        }
      },
      {
        $unwind: "$action"
      },
      {
        $project: {
          peopleId: 0,
          "people.password": 0,
          "people.__v": 0,
          "process.requestId": 0,
          "process.peopleId": 0,
          "process.__v": 0,
          "process.actionId": 0,
          "action.__v": 0,
          __v: 0,
        }
      }
    ];


    if (requestId) {
      aggregation.splice(5, 1);
      const requests = await RequestModel.aggregate(aggregation);
      return res.status(200).json(requests[0]);
    }
    if (!requestId) {
      aggregation.shift();
      const requests = await RequestModel.aggregate(aggregation);
      return res.status(200).json(requests);
    }
  }
}

export {
  RequestController
}