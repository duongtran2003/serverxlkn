import { Schema, model } from "mongoose";
import { IProcess } from "../interfaces/dbInterface";

const processSchema = new Schema<IProcess>({
  requestId: {
    type: Schema.Types.ObjectId,
  },
  peopleId: {
    type: Schema.Types.ObjectId,
  },
  actionId: {
    type: Schema.Types.ObjectId,
  },
  result: {
    type: String,
    default: "Dang xu li"
  }
}, {
  timestamps: true
});

const Process = model<IProcess> ('Process', processSchema);

export {
  Process,
}