import { Schema, model } from "mongoose";
import { IDivision } from "../interfaces/dbInterface";

const divisionSchema = new Schema<IDivision> ({
  divisionName: String,
  description: String,
}, {
  timestamps: true,
});

const Division = model<IDivision> ('Division', divisionSchema);

export {
  Division
}