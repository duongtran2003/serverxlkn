import { Schema, model } from "mongoose";
import { ICategory } from "../interfaces/dbInterface";

const categorySchema = new Schema<ICategory> ({
  description: String,
}, {
  timestamps: true,
});

const Category = model<ICategory> ('Category', categorySchema);

export {
  Category,
}