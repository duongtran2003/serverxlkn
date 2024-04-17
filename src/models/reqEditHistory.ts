import { Schema, model } from "mongoose"
import { IReqEditHistory } from "../interfaces/dbInterface"

const reqEditHistorySchema = new Schema<IReqEditHistory> ({
  title: String,
  content: String,
  priority: Number,
  peopleId: {
    type: Schema.Types.ObjectId,
    ref: 'People'
  },
  editedBy: {
    type: Schema.Types.ObjectId,
    ref: 'People'
  },
  status: String,
  duplicateRequestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
    default: null,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  result: {
    type: String,
    default: "Dang xu li",
  },
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request'
  }
}, {
  timestamps: true,
});

const ReqEditHistory = model<IReqEditHistory> ('ReqEditHistory', reqEditHistorySchema);

export {
  ReqEditHistory,
}

