import { Schema, model } from "mongoose";
import { IProcess } from "../interfaces/dbInterface";

const processSchema = new Schema<IProcess>({
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request'
  },
  peopleId: {
    type: Schema.Types.ObjectId,
    ref: 'People'
  },
  actionId: {
    type: Schema.Types.ObjectId,
    ref: 'Action'
  },
  result: {
    type: String,
    default: "Dang xu li"
  }
});

const Process = model<IProcess> ('Process', processSchema);

export {
  Process,
}