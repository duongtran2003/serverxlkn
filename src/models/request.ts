import { Schema, model } from "mongoose";
import { IRequest } from "../interfaces/dbInterface";

const requestSchema = new Schema<IRequest> ({
  title: String,
  content: String,
  priority: {
    type: Number,
    default: 1
  },
  peopleId: {
    type: Schema.Types.ObjectId,
    ref: 'People'
  },
  status: String,
  duplicateRequestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
    default: null,
  },
  result: {
    type: String,
    default: "Dang xu li",
  }
}, {
  timestamps: true,
});

const Request = model<IRequest> ('Request', requestSchema);

export {
  Request
}