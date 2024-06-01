import { Request, Response, NextFunction } from "express";
import { People } from "../models/people";
import bcrypt from "bcrypt";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { AUTH_MESSAGES } from "../constants/messages";
import { AuthService } from "../services/Auth.service";
import { UserService } from "../services/User.service";


class AuthController {
  authService: AuthService;
  userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: AUTH_MESSAGES.THIEU_THONG_TIN_VE_MAT_KHAU_HOAC_TAI_KHOAN,
      });
    }
    try {
      let user = await this.userService.getUserByUsername(username);
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
      this.authService.login(res, user);
      return res.status(HTTP_STATUS.OK).json({
        message: AUTH_MESSAGES.LOGIN_THANH_CONG,
        data: user
      });
    }
    catch (err) {
      console.log(err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: AUTH_MESSAGES.SERVER_ERROR,
      });
    }
  }

  logout(req: Request, res: Response) {
    try {
      this.authService.logout(res);
      return res.status(HTTP_STATUS.OK).json({
        message: AUTH_MESSAGES.LOGOUT_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: AUTH_MESSAGES.SERVER_ERROR,
      })
    }
  }
}

export { AuthController };
