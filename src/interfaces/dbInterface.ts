import { Document, Schema } from "mongoose"

interface IPeople {
  fullname: string,
  username: string,
  email: string,
  password: string, 
  isAdmin: boolean,
  divisions: Schema.Types.ObjectId[],
}

interface IAction {
  actionName: string,
}

interface IProcess {
  requestId: Schema.Types.ObjectId,
  peopleId: Schema.Types.ObjectId,
  actionId: Schema.Types.ObjectId,
  result: string,
}

interface IRequest {
  title: string,
  content: string,
  priority: number,
  peopleId: Schema.Types.ObjectId,
  // divisionId: Schema.Types.ObjectId,
  categoryId: Schema.Types.ObjectId,
  status: string,
  duplicateRequestId: Schema.Types.ObjectId | null,
  result: string
}

interface IComment {
  requestId: Schema.Types.ObjectId,
  peopleId: Schema.Types.ObjectId,
  comment: string,
}

interface ICategory {
  description: string,
}

interface IDivision {
  divisionName: string,
  description: string,
}

interface IPeopleDivision {
  peopleId: Schema.Types.ObjectId,
  divisionId: Schema.Types.ObjectId,
  actionId: Schema.Types.ObjectId,
}

export {
  IPeople,
  IAction,
  IProcess,
  IRequest,
  IComment,
  ICategory,
  IDivision,
  IPeopleDivision,
}