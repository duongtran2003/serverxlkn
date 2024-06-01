import { Request, Response, request } from "express";
import { Process } from "../models/process";
import { Comment } from "../models/comment";
import mongoose from "mongoose";
import { COMMENT_MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/HttpStatus";

class CommentController {
  async create(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const { requestId, comment } = req.body;
    if (!requestId || !comment) {
      return res.status(HTTP_STATUS.OK).json({
        message: COMMENT_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const process = await Process.findOne({ requestId: requestId, peopleId: userId });
    if (!process) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: COMMENT_MESSAGES.BAN_KHONG_DU_THAM_QUYEN,
      });
    }

    const newComment = {
      requestId: requestId,
      peopleId: userId,
      comment: comment,
    }

    Comment.create(newComment)
      .then((comment) => {
        comment.$set({
          __v: undefined
        });
        return res.status(HTTP_STATUS.CREATED).json({
          message: COMMENT_MESSAGES.TAO_COMMENT_THANH_CONG,
          data: comment,
        });
      })
      .catch((err) => {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          "message": "server error: " + err.message,
        });
      });
  }

  async index(req: Request, res: Response) {
    const requestId = req.query.requestId;

    if (!requestId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: COMMENT_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const comments = await Comment.aggregate([
      {
        $match: {
          requestId: new mongoose.Types.ObjectId(requestId.toString()),
        }
      },
      {
        $lookup: {
          from: "peoples",
          localField: "peopleId",
          foreignField: "_id",
          as: "people",
        }
      },
      {
        $unwind: "$people",
      },
      {
        $project: {
          "peopleId": 0,
          "requestId": 0,
          "__v": 0,
          "people.password": 0,
          "people.isAdmin": 0,
          "people.createdAt": 0,
          "people.updatedAt": 0,
          "people.__v": 0,
        }
      }
    ])

    return res.status(HTTP_STATUS.OK).json({
      message: COMMENT_MESSAGES.LAY_RA_TOAN_BO_COMMENT_THANH_CONG,
      data: comments,
    });
  }

  async update(req: Request, res: Response) {
    const commentId = req.params.id;
    const newComment = {
      comment: req.body.comment || undefined,
    }
    if (!commentId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: COMMENT_MESSAGES.THIEU_THONG_TIN,
      });
    }

    const userId = res.locals.claims.userId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: COMMENT_MESSAGES.KHONG_TIM_THAY_COMMENT,
      });
    }
    if (comment.peopleId != userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: COMMENT_MESSAGES.BAN_KHONG_DU_THAM_QUYEN,
      });
    }

    Comment.findByIdAndUpdate(commentId, newComment, { new: true })
      .then((comment) => {
        if (!comment) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: COMMENT_MESSAGES.KHONG_TIM_THAY_COMMENT,
          });
        }
        comment?.$set({
          __v: undefined
        });
        return res.status(HTTP_STATUS.OK).json({
          message: COMMENT_MESSAGES.UPDATE_COMMENT_THANH_CONG,
          data: comment
        });
      })
      .catch((err) => {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          "message": "server error: " + err.message,
        });
      });
  }

  async delete(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const commentId = req.params.id;
    if (!commentId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: COMMENT_MESSAGES.THIEU_THONG_TIN,
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: COMMENT_MESSAGES.KHONG_TIM_THAY_COMMENT,
      });
    }
    if (comment.peopleId != userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: COMMENT_MESSAGES.BAN_KHONG_DU_THAM_QUYEN,
      });
    }

    Comment.findByIdAndDelete(commentId)
      .then(() => {
        return res.status(HTTP_STATUS.OK).json({
          message: COMMENT_MESSAGES.DELETE_COMMENT_THANH_CONG,
        });
      })
      .catch((err) => {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          "message": "server error: " + err.message,
        });
      });
  }
}

export {
  CommentController
}
