import { Document, Schema } from "mongoose"

interface IPeople {
  fullname: string,
  username: string,
  email: string,
  password: string, 
  isAdmin: boolean,
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
  status: string,
  duplicateRequestId: Schema.Types.ObjectId | null,
  result: string
}

export {
  IPeople,
  IAction,
  IProcess,
  IRequest
}