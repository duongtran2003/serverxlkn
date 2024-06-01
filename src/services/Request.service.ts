import { ClientSession } from "mongoose";
import { Request } from "../models/request";
import { ReqEditHistory } from "../models/reqEditHistory";
import mongoose from "mongoose";


class RequestService {
  viewHistoryAggregationOptions: any[];
  viewRequestAggregationOptions: any[];

  constructor() {
    this.viewHistoryAggregationOptions = [
      {
        $lookup: {
          from: 'peoples',
          localField: 'peopleId',
          foreignField: '_id',
          as: 'people',
        }
      },
      {
        $unwind: "$people",
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: "_id",
          as: 'category'
        }
      },
      {
        $unwind: "$category"
      },
      {
        $lookup: {
          from: 'peoples',
          localField: 'editedBy',
          foreignField: '_id',
          as: 'editedBy',
        }
      },
      {
        $unwind: "$editedBy",
      },
      {
        $project: {
          "peopleId": 0,
          "requestId": 0,
          "categoryId": 0,
          "__v": 0,
          "people.password": 0,
          "people.isAdmin": 0,
          "people.updatedAt": 0,
          "people.createdAt": 0,
          "people.__v": 0,
          "category.updatedAt": 0,
          "category.createdAt": 0,
          "category.__v": 0,
          "editedBy.password": 0,
          "editedBy.isAdmin": 0,
          "editedBy.createdAt": 0,
          "editedBy.updatedAt": 0,
          "editedBy.__v": 0,
        }
      }
    ];

    this.viewRequestAggregationOptions = [
      {
        $lookup: {
          from: 'peoples',
          localField: 'peopleId',
          foreignField: '_id',
          as: 'people',
        }
      },
      {
        $unwind: "$people",
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: "_id",
          as: 'category'
        }
      },
      {
        $unwind: "$category"
      },
      {
        $lookup: {
          from: 'processes',
          localField: '_id',
          foreignField: 'requestId',
          pipeline: [
            // {
            //   $match: {
            //     peopleId: new mongoose.Types.ObjectId(userId),
            //   }
            // },
            {
              $lookup: {
                from: 'actions',
                localField: 'actionId',
                foreignField: '_id',
                as: 'action',
              }
            },
            {
              $unwind: "$action"
            },
            {
              $lookup: {
                from: 'peoples',
                localField: 'peopleId',
                foreignField: '_id',
                as: 'people',
              }
            },
            {
              $unwind: "$people"
            },
            {
              $project: {
                "peopleId": 0,
                "requestId": 0,
                "actionId": 0,
                "__v": 0,
                "action.id": 0,
                "action.createdAt": 0,
                "action.updatedAt": 0,
                "action.__v": 0,
                "people.id": 0,
                "people.createdAt": 0,
                "people.updatedAt": 0,
                "people.__v": 0,
                "people.password": 0,
                "people.isAdmin": 0,
              }
            }
          ],
          as: 'processes',
        }
      },
      // {
      //   $unwind: "$process"
      // },
      {
        $project: {
          "peopleId": 0,
          "categoryId": 0,
          "__v": 0,
          "people.password": 0,
          "people.isAdmin": 0,
          "people.updatedAt": 0,
          "people.createdAt": 0,
          "people.__v": 0,
          "category.updatedAt": 0,
          "category.createdAt": 0,
          "category.__v": 0,
          // "process.peopleId": 0,
          // "process.requestId": 0,
          // "process.actionId": 0,
          // "process.__v": 0,
          // "process.action.id": 0,
          // "process.action.createdAt": 0,
          // "process.action.updatedAt": 0,
          // "process.action.__v": 0,
          // "process.people.id": 0,
          // "process.people.createdAt": 0,
          // "process.people.updatedAt": 0,
          // "process.people.__v": 0,
          // "process.people.password": 0,
          // "process.people.isAdmin": 0,
        }
      }
    ];
  }

  async createNewRequest(request: any, session: ClientSession) {
    const newRequest = (await Request.create([request], { session: session }))[0];
    newRequest.$set({
      __v: undefined,
    })
    return newRequest;
  }

  async createRequestHistory(history: any, session: ClientSession) {
    const createdHistory = await ReqEditHistory.create([history], { session: session });
    return createdHistory;
  }

  async viewRequestHistory(requestId: string) {
    const aggregation = this.viewHistoryAggregationOptions;
    aggregation.unshift(
      {
        $match: {
          requestId: new mongoose.Types.ObjectId(requestId),
        }
      }
    );

    const history = await ReqEditHistory.aggregate(aggregation);
    return history;
  }

  async aggregateRequest(requestId: string) {
    const request = await Request.aggregate(
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(requestId),
          }
        },
        ...this.viewRequestAggregationOptions,
      ]
    );
    if (request.length) {
      return request[0];
    }
    return null;
  }

  async getRequestById(requestId: string) {
    const request = await Request.findById(requestId);
    return request;
  }

  async getRequestsWithCategory(categoryId: string) {
    const requestsWithCategory = await Request.find({ categoryId: categoryId });
    return requestsWithCategory;
  }

  async updateRequest(requestId: string, patched: any, session: ClientSession) {
    const updatedRequest = await Request.findByIdAndUpdate(requestId, patched, { new: true }).session(session);
    updatedRequest?.$set({
      __v: undefined,
    });
    return updatedRequest;
  }

  async deleteRequest(requestId: string, session: ClientSession) {
    await Request.findByIdAndDelete(requestId).session(session);
  }
}

export {
  RequestService
}

