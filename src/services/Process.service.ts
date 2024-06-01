import { ClientSession } from "mongoose";
import { Process } from "../models/process";

class ProcessService {
  async getByRequestIdAndUserId(userId: string, requestId: string) {
    const process = await Process.findOne({ peopleId: userId, requestId: requestId });
    return process;
  }


  async deleteByRequestId(requestId: string, session: ClientSession) {
    await Process.deleteOne({ requestId: requestId }).session(session);
    return;
  }


}

export {
  ProcessService
}
