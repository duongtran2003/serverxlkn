import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { People } from '../models/people';
import bcrypt from 'bcrypt';

class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    let user = await People.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        "message": "sai thong tin",
      });
    }
    console.log(password, user);
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).json({
        "message": "sai thong tin",
      });
    }
    
    if (!process.env.JWTSECRET) {
      return res.status(500).json({
        "message": "server error: no secret",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWTSECRET);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    user.$set({ password: undefined })
    return res.status(200).json(user);
  }
  
  logout(req: Request, res: Response) {
    res.cookie('jwt', "", {
      httpOnly: true,
      maxAge: 0,
    });
    return res.status(200).json({
      "message": "success",
    });
  }
}

export {
  AuthController
}