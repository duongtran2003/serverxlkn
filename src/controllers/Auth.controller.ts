import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { People } from "../models/people";
import bcrypt from "bcrypt";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { AUTH_MESSAGES } from "../constants/messages";

class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: AUTH_MESSAGES.THIEU_THONG_TIN_VE_MAT_KHAU_HOAC_TAI_KHOAN,
      });
    }
    let user = await People.findOne({ username: username });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.SAI_THONG_TIN_TAI_KHOAN_HOAC_MAT_KHAU,
      });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.SAI_THONG_TIN_TAI_KHOAN_HOAC_MAT_KHAU,
      });
    }

    if (!process.env.JWTSECRET) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: AUTH_MESSAGES.KHONG_CO_JWT_SECRET,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWTSECRET);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
    });
    user.$set({ password: undefined });
    user.$set({ __v: undefined });
    return res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.LOGIN_THANH_CONG,
      data: user
    });
  }

  logout(req: Request, res: Response) {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
    });
    return res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.LOGOUT_THANH_CONG,
    });
  }
}

export { AuthController };
