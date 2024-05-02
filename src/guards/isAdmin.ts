import { Request, Response, NextFunction } from "express";
import { People } from "../models/people";
import { HTTP_STATUS } from "../constants/HttpStatus";

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = res.locals.claims.userId;
  const user = await People.findById(userId);
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      "message": "token khong hop le",
    });
  }
  if (!user.isAdmin) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      "message": "khong phai admin",
    });
  }
  next();
}

export {
  isAdmin
}