import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['jwt'];

  if (!token) {
    return res.status(401).json({
      "message": "thieu token",
    });
  }
  
  if (!process.env.JWTSECRET) {
    return res.status(500).json({
      "message": "server error: no secret",
    });
  }

  const claims = jwt.verify(token, process.env.JWTSECRET);
  if (!claims) {
    return res.status(401).json({
      "message": "token khong hop le",
    });
  }

  res.locals.claims = claims;
  next();
}

export {
  isAuthenticated,
}
