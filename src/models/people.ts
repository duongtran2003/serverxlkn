import { Schema, model } from "mongoose";
import { IPeople } from "../interfaces/dbInterface";

const peopleSchema = new Schema<IPeople>({
  fullname: String,
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const People = model<IPeople>('People', peopleSchema);

export {
  People
}