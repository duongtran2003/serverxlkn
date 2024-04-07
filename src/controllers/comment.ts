import { Request, Response, request } from "express";
import { Process } from "../models/process";
import { Comment } from "../models/comment";

class CommentController {
  async create(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const { requestId, comment } = req.body;
    if (!requestId || !comment) {
      return res.status(400).json({
        "message": "thieu thong tin"
      });
    }
    
    const process = await Process.findOne({ requestId: requestId, peopleId: userId });
    if (!process) {
      return res.status(403).json({
        "message": "ban khong du tham quyen",
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
      return res.status(201).json(comment);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });      
    });
  }
  
  async index(req: Request, res: Response) {
    const { requestId } = req.query;

    if (!requestId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    } 

    const comments = await Comment.find({ requestId: requestId }).select("-__v");
    return res.status(200).json(comments);
  }
  
  async update(req: Request, res: Response) {
    const commentId = req.params.id;
    const newComment = {
      comment: req.body.comment || undefined,
    } 
    if (!commentId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    const userId = res.locals.claims.userId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        "message": "sai id",
      });
    }
    if (comment.peopleId != userId) {
      return res.status(403).json({
        "message": "ban khong du tham quyen",
      });
    }
    
    Comment.findByIdAndUpdate(commentId, newComment, { new: true })
    .then((comment) => {
      comment?.$set({
        __v: undefined
      });
      return res.status(200).json(comment);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
  
  async delete(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const commentId = req.params.commentId;
    if (!commentId) {
      return res.status(400).json({
        "message": "thieu thong tin"
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        "message": "sai id",
      });
    }
    if (comment.peopleId != userId) {
      return res.status(403).json({
        "message": "ban khong du tham quyen",
      });
    }
    
    Comment.findByIdAndDelete(commentId)
    .then(() => {
      return res.status(200).json({
        "message": "success",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
}

export {
  CommentController
}