import { Request, Response, NextFunction } from "express";
import { People } from "../models/people";

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = res.locals.claims.userId;
  const user = await People.findById(userId);
  if (!user) {
    return res.status(401).json({
      "message": "token khong hop le",
    });
  }
  if (!user.isAdmin) {
    return res.status(403).json({
      "message": "khong phai admin",
    });
  }
  next();
}

export {
  isAdmin
}