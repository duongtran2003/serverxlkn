import { Request, Response } from "express";
import { Validator } from "../helpers/validator";
import bcrypt from 'bcrypt';
import { Division } from "../models/division";
import { Action } from "../models/action";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { USER_MESSAGES } from "../constants/messages";
import { UserService } from "../services/User.service";

class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async create(req: Request, res: Response) {
    const { fullname, username, email, password } = req.body;
    if (!fullname || !username || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": USER_MESSAGES.THIEU_THONG_TIN,
      });
    }
    const validator = new Validator();
    if (!validator.isEmail(email) || !validator.isUsername(username) || !validator.isPassword(password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": USER_MESSAGES.THONG_TIN_KHONG_HOP_LE,
      });
    }
    try {
      let user = await this.userService.getUserByUsername(username);
      if (user) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          "message": USER_MESSAGES.USERNAME_TON_TAI,
        });
      }
      let newUser = await this.userService.createNewUser(fullname, username, email, password);
      return res.status(HTTP_STATUS.CREATED).json({
        message: USER_MESSAGES.TAO_USER_THANH_CONG,
        data: newUser,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: USER_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async index(req: Request, res: Response) {
    const username = req.query.username;
    const email = req.query.email;
    const fullname = req.query.fullname;
    const id = req.query.id;

    let options = [];
    if (username) {
      options.push({ username: { $regex: '.*' + username + '.*' } });
    }
    if (email) {
      options.push({ email: { $regex: '.*' + email + '.*' } });
    }
    if (fullname) {
      options.push({ fullname: { $regex: '.*' + fullname + '.*' } });
    }
    if (id) {
      options.push({ _id: id });
    }

    try {
      let users: any = [];

      if (options.length) {
        users = await this.userService.getUsersWithOptions(options);
      }
      else {
        users = await this.userService.getAllUsers();
      }

      return res.status(HTTP_STATUS.OK).json({
        data: users,
        message: USER_MESSAGES.LAY_RA_TOAN_BO_USERS_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: USER_MESSAGES.SERVER_ERROR,
      })
    }
  }

  async update(req: Request, res: Response) {
    const validator = new Validator();
    const { username, fullname, email, password, oldPassword } = req.body;
    const userId = req.params.id;
    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": USER_MESSAGES.THIEU_USER_ID,
      })
    }
    if (username) {
      if (!validator.isUsername(username)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          "message": USER_MESSAGES.THONG_TIN_KHONG_HOP_LE,
        });
      }
      const user = await this.userService.getUserByUsername(username);
      if (user) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          "message": USER_MESSAGES.USERNAME_TON_TAI,
        });
      }
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          "message": USER_MESSAGES.THONG_TIN_KHONG_HOP_LE,
        });
      }
    }

    if (password) {
      if (!oldPassword) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          "message": USER_MESSAGES.THIEU_THONG_TIN,
        });
      }
      if (!validator.isPassword(password)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          "message": USER_MESSAGES.THONG_TIN_KHONG_HOP_LE,
        });
      }
      let user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          "message": USER_MESSAGES.KHONG_TIM_THAY_USER,
        });
      }
      const result = await bcrypt.compare(oldPassword, user.password);
      if (!result) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          "message": USER_MESSAGES.THONG_TIN_KHONG_HOP_LE,
        });
      }
    }
    try {
      const updatedUser = await this.userService.updateUser(userId, username, fullname, email, password, oldPassword);
      if (!updatedUser) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: USER_MESSAGES.KHONG_TIM_THAY_USER,
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        data: updatedUser,
        message: USER_MESSAGES.CAP_NHAT_USER_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: USER_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const userId = req.params.id;
    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        "message": USER_MESSAGES.THIEU_THONG_TIN,
      })
    }
    try {
      await this.userService.deleteUser(userId);
      return res.status(HTTP_STATUS.OK).json({
        message: USER_MESSAGES.XOA_USER_THANH_CONG,
      })
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: USER_MESSAGES.SERVER_ERROR,
      })
    }
  }

  async assignDivision(req: Request, res: Response) {
    const { divisionId, actionId, peopleId } = req.body;
    const division = await Division.findById(divisionId);
    const action = await Action.findById(actionId);
    const people = await this.userService.getUserById(peopleId);
    if (!division || !action || !people) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        "message": USER_MESSAGES.KHONG_TIM_THAY_DIVISION_HOAC_ACTION_HOAC_USER,
      });
    }
    try {
      const peopleDivision = await this.userService.assignDivision(peopleId, actionId, divisionId);
      return res.status(HTTP_STATUS.CREATED).json({
        data: peopleDivision,
        message: USER_MESSAGES.GAN_DIVISION_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        "message": USER_MESSAGES.SERVER_ERROR,
      })
    };
  }

  async removeFromDivision(req: Request, res: Response) {
    const { peopleId, divisionId } = req.body;
    try {
      await this.userService.removeFromDivision(peopleId, divisionId);
      return res.status(HTTP_STATUS.OK).json({
        "message": USER_MESSAGES.GO_DIVISION_THANH_CONG,
      });
    }
    catch (err) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        "message": USER_MESSAGES.SERVER_ERROR,
      });
    }
  }
}

export {
  UserController
}
