import { Schema, model } from "mongoose";
import { IPeopleDivision } from "../interfaces/dbInterface";

const peopleDivisionSchema = new Schema<IPeopleDivision> ({
  peopleId: {
    type: Schema.Types.ObjectId,
    ref: 'People',
  },
  divisionId: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
  },
  actionId: {
    type: Schema.Types.ObjectId,
    ref: 'Action',
  }
}, {
  timestamps: true,
});

const PeopleDivision = model<IPeopleDivision> ('PeopleDivision', peopleDivisionSchema);

export {
  PeopleDivision,
}