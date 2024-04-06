import { Schema, model } from "mongoose";
import { IComment } from "../interfaces/dbInterface";

const commentSchema = new Schema<IComment> ({
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
  },
  peopleId: {
    type: Schema.Types.ObjectId,
    ref: 'People',
  },
  comment: {
    type: String,
  }
}, {
  timestamps: true,
});

const Comment = model<IComment> ('Comment', commentSchema);

export {
  Comment,
}