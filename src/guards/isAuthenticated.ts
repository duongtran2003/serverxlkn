import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/HttpStatus';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['jwt'];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      "message": "thieu token",
    });
  }
  
  if (!process.env.JWTSECRET) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      "message": "server error: no secret",
    });
  }

  const claims = jwt.verify(token, process.env.JWTSECRET);
  if (!claims) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      "message": "token khong hop le",
    });
  }

  res.locals.claims = claims;
  next();
}

export {
  isAuthenticated,
}
