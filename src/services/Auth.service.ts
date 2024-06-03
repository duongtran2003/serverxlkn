import { Response } from "express"
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { IPeople } from "../interfaces/dbInterface";

class AuthService {
  async login(res: Response, user: Document<unknown, {}, IPeople> & IPeople) {
    user.$set({
      password: undefined,
    })
    const token = jwt.sign({ userId: user._id }, process.env.JWTSECRET!);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
      secure: true,
    });
  }

  async logout(res: Response) {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "none",
      secure: true,
    });
  }
}

export {
  AuthService
}
