import { Schema, model } from "mongoose";
import { IAction } from "../interfaces/dbInterface";

const actionSchema = new Schema<IAction> ({
  actionName: String,
}, {
  timestamps: true
});

const Action = model<IAction> ('Action', actionSchema);

export {
  Action,
}